import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { DISHKAI_SESSION_COOKIE, proxyDishkaiAuth, proxyMenu, proxyDishImage } from '../functions/_shared/dishkai.js';
import { onRequest } from '../functions/api/dishkai/auth.js';

const ORIGIN = 'https://mapkai.com';
const PRIVATE_CODE = 'synthetic-test-access';
const SIGNING_SECRET = 'synthetic-signing-material-for-tests-only';
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...headers } });
const signedToken = (payload = {}) => {
  const encoded = Buffer.from(JSON.stringify({ sub: 'dishkai-owner', version: 2, exp: Math.floor(Date.now() / 1000) + 3600, ...payload })).toString('base64url');
  return `${encoded}.${createHmac('sha256', SIGNING_SECRET).update(encoded).digest('base64url')}`;
};
const req = (method = 'GET', body, cookie, path = '/api/dishkai/auth', extraHeaders = {}) => new Request(`${ORIGIN}${path}`, {
  method, headers: { Origin: ORIGIN, 'Sec-Fetch-Site': 'same-origin', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...(cookie ? { Cookie: cookie } : {}), ...extraHeaders },
  ...(body === undefined ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) }),
});

function rateDatabase() {
  const buckets = new Map();
  return { prepare(sql) {
    return { run: async () => {}, bind(key, resetAt, now) {
      assert.match(sql, /RETURNING count, reset_at/);
      return { first: async () => {
        const previous = buckets.get(key);
        const row = previous && previous.reset_at > now ? { count: previous.count + 1, reset_at: previous.reset_at } : { count: 1, reset_at: resetAt };
        buckets.set(key, row);
        return row;
      } };
    } };
  } };
}

function service() {
  const calls = [];
  const token = signedToken();
  let revoked = false;
  let rejectScan = false;
  const valid = value => {
    const candidate = value?.replace(/^dishkai_session=/, '');
    if (!candidate || revoked) return false;
    const [payload, signature] = candidate.split('.');
    try {
      const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
      return signature === createHmac('sha256', SIGNING_SECRET).update(payload).digest('base64url') && data.version === 2 && data.exp > Date.now() / 1000;
    } catch { return false; }
  };
  const fetcher = async (url, init) => {
    calls.push({ path: new URL(url).pathname, method: init.method || 'GET' });
    assert.equal(new URL(url).origin, 'https://dishkai.com');
    assert.equal(init.redirect, 'manual');
    const suppliedHeaders = new Headers(init.headers);
    assert.equal(suppliedHeaders.has('Authorization'), false);
    assert.equal(suppliedHeaders.has('Origin'), false);
    assert.equal(suppliedHeaders.has('X-Forwarded-For'), false);
    if (url.endsWith('/api/private-login')) {
      assert.equal(suppliedHeaders.has('Cookie'), false);
      const body = JSON.parse(init.body);
      assert.deepEqual(Object.keys(body), ['accessCode']);
      return body.accessCode === PRIVATE_CODE
        ? json({ ok: true }, 200, { 'Set-Cookie': `dishkai_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800` })
        : json({ error: 'INVALID_ACCESS_CODE' }, 401);
    }
    assert.match(suppliedHeaders.get('Cookie') || '', /^dishkai_session=[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    const authenticated = valid(suppliedHeaders.get('Cookie'));
    if (url.endsWith('/api/private-status')) return json({ ok: true, configured: true, authenticated });
    if (!authenticated || rejectScan) return json({ error: 'PRIVATE_ACCESS_REQUIRED' }, 401);
    if (url.endsWith('/api/analyze-menu-text')) {
      assert.deepEqual(JSON.parse(init.body), { menuText: 'Pad Thai', sourceLanguage: 'auto', targetLanguage: 'en' });
      return json({ ok: true, items: [{ originalName: 'Pad Thai' }] });
    }
    if (url.endsWith('/api/analyze-menu-image')) {
      assert.deepEqual([...init.body.keys()], ['image', 'sourceLanguage', 'targetLanguage']);
      return json({ ok: true, items: [{ originalName: 'Pad Thai' }] });
    }
    assert.match(url, /\/assets\/dishes\/thai\/pad-thai\.webp$/);
    return new Response(new Uint8Array([1, 2, 3]), { headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=86400' } });
  };
  return { fetcher, calls, token, revoke: () => { revoked = true; }, rejectScan: () => { rejectScan = true; } };
}

function imageRequest(cookie) {
  const form = new FormData();
  form.set('image', new Blob(['synthetic-image'], { type: 'image/png' }), 'private-menu-name.png');
  form.set('targetLanguage', 'en');
  form.set('injected', 'unused');
  return new Request(`${ORIGIN}/api/dishkai/analyze-menu-image`, { method: 'POST', headers: { Origin: ORIGIN, Cookie: cookie }, body: form });
}

test('delegated login, retained browser cookie, text/photo/images and local logout work as one flow', async () => {
  const upstream = service();
  const env = { MAPKAI_DB: rateDatabase() };
  assert.deepEqual(await (await proxyDishkaiAuth(req(), env, upstream.fetcher)).json(), { ok: true, authenticated: false });
  const loggedIn = await proxyDishkaiAuth(req('POST', { accessCode: PRIVATE_CODE, token: 'ignored', apiKey: 'ignored' }), env, upstream.fetcher);
  assert.deepEqual(await loggedIn.json(), { ok: true, authenticated: true });
  const stored = loggedIn.headers.get('Set-Cookie');
  assert.match(stored, new RegExp(`^${DISHKAI_SESSION_COOKIE}=`));
  for (const flag of ['HttpOnly', 'Secure', 'SameSite=Strict', 'Path=/api/dishkai']) assert.ok(stored.includes(flag));
  assert.equal(stored.includes('Domain='), false);
  const maxAge = Number(/Max-Age=(\d+)/.exec(stored)[1]);
  assert.ok(maxAge > 0 && maxAge <= 3600);
  const cookie = `${stored.split(';')[0]}; unrelated=private-value; dishkai_session=attacker; founder=private-value`;
  assert.deepEqual(await (await proxyDishkaiAuth(req('GET', undefined, cookie), env, upstream.fetcher)).json(), { ok: true, authenticated: true });
  const text = await proxyMenu(req('POST', { menuText: 'Pad Thai', targetLanguage: 'en', ignored: 'private-value' }, cookie, '/api/dishkai/analyze-menu-text', { Authorization: 'private-value' }), 'text', upstream.fetcher);
  assert.equal(text.status, 200);
  assert.equal(text.headers.get('Cache-Control'), 'private, no-store');
  assert.equal((await proxyMenu(imageRequest(cookie), 'image', upstream.fetcher)).status, 200);
  const image = await proxyDishImage(req('GET', undefined, cookie, '/api/dishkai/image?path=/assets/dishes/thai/pad-thai.webp'), upstream.fetcher);
  assert.equal(image.status, 200);
  assert.equal(image.headers.get('Cache-Control'), 'private, no-store');
  assert.equal(image.headers.get('Vary'), 'Cookie');
  const beforeLogout = upstream.calls.length;
  const logout = await proxyDishkaiAuth(req('DELETE', undefined, cookie), env, upstream.fetcher);
  assert.deepEqual(await logout.json(), { ok: true, authenticated: false });
  assert.ok(logout.headers.get('Set-Cookie').includes('Max-Age=0'));
  assert.equal(upstream.calls.length, beforeLogout);
  const blocked = await proxyMenu(req('POST', { menuText: 'Pad Thai', targetLanguage: 'en' }, undefined, '/api/dishkai/analyze-menu-text'), 'text', upstream.fetcher);
  assert.equal(blocked.status, 401);
  assert.equal(upstream.calls.length, beforeLogout);
});

test('absent, malformed, expired, duplicate and forged sessions fail before reading uploads or invoking AI', async () => {
  const upstream = service();
  const valid = signedToken();
  const badSignature = `${valid.split('.')[0]}.${'a'.repeat(43)}`;
  const cookies = [undefined, `dishkai_session=${valid}`, `${DISHKAI_SESSION_COOKIE}=malformed`, `${DISHKAI_SESSION_COOKIE}=${signedToken({ exp: 1 })}`, `${DISHKAI_SESSION_COOKIE}=${signedToken({ version: 1 })}`, `${DISHKAI_SESSION_COOKIE}=${valid}; ${DISHKAI_SESSION_COOKIE}=${valid}`, `${DISHKAI_SESSION_COOKIE}=${badSignature}`];
  for (const cookie of cookies) {
    const upload = req('POST', '{}', cookie, '/api/dishkai/analyze-menu-image');
    const response = await proxyMenu(upload, 'image', upstream.fetcher);
    assert.equal(response.status, 401);
    assert.equal(upload.bodyUsed, false);
    assert.equal((await response.json()).error, 'PRIVATE_ACCESS_REQUIRED');
    assert.equal(response.headers.has('Set-Cookie'), false);
  }
  assert.ok(upstream.calls.every(call => call.path === '/api/private-status'));
});

test('upstream expiry is checked on startup and before scans without deleting a newer cookie', async () => {
  const upstream = service();
  const cookie = `${DISHKAI_SESSION_COOKIE}=${upstream.token}`;
  upstream.revoke();
  const expired = await proxyDishkaiAuth(req('GET', undefined, cookie), {}, upstream.fetcher);
  assert.equal(expired.status, 401);
  assert.equal(expired.headers.has('Set-Cookie'), false);
  const second = service();
  second.rejectScan();
  const response = await proxyMenu(req('POST', { menuText: 'Pad Thai', targetLanguage: 'en' }, `${DISHKAI_SESSION_COOKIE}=${second.token}`, '/api/dishkai/analyze-menu-text'), 'text', second.fetcher);
  assert.equal(response.status, 401);
  assert.equal((await response.json()).error, 'PRIVATE_ACCESS_REQUIRED');
  assert.equal(response.headers.has('Set-Cookie'), false);
});

test('login redirects preserve private access for status, scans and images without following', async () => {
  const token = signedToken();
  const cookie = `${DISHKAI_SESSION_COOKIE}=${token}`;
  const redirect = async () => new Response(null, { status: 302, headers: { Location: '/login?next=%2F' } });
  assert.equal((await proxyDishkaiAuth(req('GET', undefined, cookie), {}, redirect)).status, 401);
  const statusThenRedirect = async url => url.endsWith('/api/private-status') ? json({ ok: true, configured: true, authenticated: true }) : redirect();
  assert.equal((await proxyMenu(req('POST', { menuText: 'Pad Thai', targetLanguage: 'en' }, cookie, '/api/dishkai/analyze-menu-text'), 'text', statusThenRedirect)).status, 401);
  assert.equal((await proxyDishImage(req('GET', undefined, cookie, '/api/dishkai/image?path=/assets/dishes/thai/pad-thai.webp'), statusThenRedirect)).status, 401);
});

test('same-origin protection covers login, logout, status, analysis and images', async () => {
  const fail = async () => assert.fail('Cross-site input must not reach DishKAI');
  const token = signedToken();
  const cookie = `${DISHKAI_SESSION_COOKIE}=${token}`;
  for (const bad of [{ Origin: 'https://evil.example' }, { 'Sec-Fetch-Site': 'cross-site' }]) {
    for (const method of ['GET', 'POST', 'DELETE']) assert.equal((await proxyDishkaiAuth(req(method, method === 'POST' ? { accessCode: PRIVATE_CODE } : undefined, cookie, '/api/dishkai/auth', bad), { MAPKAI_DB: rateDatabase() }, fail)).status, 403);
    assert.equal((await proxyMenu(req('POST', { menuText: 'Pad Thai', targetLanguage: 'en' }, cookie, '/api/dishkai/analyze-menu-text', bad), 'text', fail)).status, 403);
    assert.equal((await proxyDishImage(req('GET', undefined, cookie, '/api/dishkai/image?path=/assets/dishes/thai/pad-thai.webp', bad), fail)).status, 403);
  }
});

test('five delegated password attempts per client/15 minutes persist across calls, with independent clients', async () => {
  const env = { MAPKAI_DB: rateDatabase() };
  const upstream = service();
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await proxyDishkaiAuth(req('POST', { accessCode: 'synthetic-wrong-code' }, undefined, '/api/dishkai/auth', { 'CF-Connecting-IP': '192.0.2.1' }), env, upstream.fetcher);
    assert.equal(response.status, 401);
  }
  const limited = await proxyDishkaiAuth(req('POST', { accessCode: PRIVATE_CODE }, undefined, '/api/dishkai/auth', { 'CF-Connecting-IP': '192.0.2.1' }), env, upstream.fetcher);
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('Retry-After')) > 0);
  assert.equal(upstream.calls.length, 5);
  assert.equal((await proxyDishkaiAuth(req('POST', { accessCode: PRIVATE_CODE }, undefined, '/api/dishkai/auth', { 'CF-Connecting-IP': '192.0.2.2' }), env, upstream.fetcher)).status, 200);
});

test('missing/failed durable limit closes login; other methods, body types and bounds are constrained', async () => {
  const fail = async () => assert.fail('Invalid requests must not reach DishKAI');
  assert.equal((await onRequest({ request: req('POST', { accessCode: PRIVATE_CODE }) })).status, 503);
  const failedDb = { prepare() { throw new Error('synthetic failure'); } };
  assert.equal((await proxyDishkaiAuth(req('POST', { accessCode: PRIVATE_CODE }), { MAPKAI_DB: failedDb }, fail)).status, 503);
  const env = { MAPKAI_DB: rateDatabase() };
  assert.equal((await proxyDishkaiAuth(req('PUT'), env, fail)).status, 405);
  assert.equal((await proxyDishkaiAuth(req('POST', '{}', undefined, '/api/dishkai/auth', { 'Content-Type': 'text/plain' }), env, fail)).status, 415);
  assert.equal((await proxyDishkaiAuth(req('POST', '{'), env, fail)).status, 400);
  assert.equal((await proxyDishkaiAuth(req('POST', { accessCode: 123 }), env, fail)).status, 400);
  assert.equal((await proxyDishkaiAuth(req('POST', { accessCode: 'a'.repeat(257) }), env, fail)).status, 400);
  assert.equal((await proxyDishkaiAuth(req('POST', 'a'.repeat(4097)), env, fail)).status, 413);
});

test('only one valid upstream-signed cookie and confirmed status can establish authentication', async () => {
  const token = signedToken();
  const invalidCookies = [undefined, 'other_session=ignored', 'dishkai_session=forged', `dishkai_session=${signedToken({ exp: 1 })}`, `dishkai_session=${token}; Path=/, dishkai_session=${token}; Path=/`];
  for (const upstreamCookie of invalidCookies) {
    const fake = async url => {
      assert.ok(url.endsWith('/api/private-login'));
      return json({ ok: true }, 200, upstreamCookie ? { 'Set-Cookie': upstreamCookie } : {});
    };
    const response = await proxyDishkaiAuth(req('POST', { accessCode: PRIVATE_CODE }), { MAPKAI_DB: rateDatabase() }, fake);
    assert.equal(response.status, 502);
    assert.equal(response.headers.has('Set-Cookie'), false);
  }
  const notConfirmed = async url => url.endsWith('/api/private-login') ? json({ ok: true }, 200, { 'Set-Cookie': `dishkai_session=${token}; Path=/` }) : json({ ok: true, configured: true, authenticated: false });
  assert.equal((await proxyDishkaiAuth(req('POST', { accessCode: PRIVATE_CODE }), { MAPKAI_DB: rateDatabase() }, notConfirmed)).status, 401);
});

test('upstream failures are bounded/sanitized and never return response content or secrets', async () => {
  const cases = [
    [async () => new Response('private-upstream-content', { headers: { 'Content-Type': 'text/html' } }), 502],
    [async () => json({ ok: true, padding: 'a'.repeat(8192) }), 502],
    [async () => new Response('private-upstream-content', { status: 500 }), 502],
    [async () => { throw new Error('private-transport-details'); }, 502],
    [async () => new Response(null, { status: 302, headers: { Location: 'https://evil.example/login' } }), 502],
    [async () => json({}, 429, { 'Retry-After': '30' }), 429],
  ];
  for (const [fetcher, expected] of cases) {
    const response = await proxyDishkaiAuth(req('POST', { accessCode: PRIVATE_CODE }), { MAPKAI_DB: rateDatabase() }, fetcher);
    assert.equal(response.status, expected);
    const data = await response.text();
    assert.equal(data.includes('private-'), false);
    assert.equal(data.includes(PRIVATE_CODE), false);
  }
});

test('delayed invalid scan/status responses cannot remove a newly authenticated browser session', async () => {
  const upstream = service();
  const oldToken = signedToken({ exp: Math.floor(Date.now() / 1000) + 1800 });
  let releaseOld;
  let started;
  const oldStarted = new Promise(resolve => { started = resolve; });
  const delayed = new Promise(resolve => { releaseOld = resolve; });
  const fetcher = async (url, init) => {
    if (new Headers(init.headers).get('Cookie') === `dishkai_session=${oldToken}`) {
      started();
      return delayed;
    }
    return upstream.fetcher(url, init);
  };
  const oldUpload = req('POST', '{}', `${DISHKAI_SESSION_COOKIE}=${oldToken}`, '/api/dishkai/analyze-menu-image');
  const oldScan = proxyMenu(oldUpload, 'image', fetcher);
  await oldStarted;
  const freshLogin = await proxyDishkaiAuth(req('POST', { accessCode: PRIVATE_CODE }), { MAPKAI_DB: rateDatabase() }, fetcher);
  assert.equal(freshLogin.status, 200);
  const newCookie = freshLogin.headers.get('Set-Cookie').split(';')[0];
  releaseOld(json({ ok: true, configured: true, authenticated: false }));
  const oldResponse = await oldScan;
  assert.equal(oldResponse.status, 401);
  assert.equal(oldUpload.bodyUsed, false);
  assert.equal(oldResponse.headers.has('Set-Cookie'), false);
  const newStatus = await proxyDishkaiAuth(req('GET', undefined, newCookie), {}, fetcher);
  assert.deepEqual(await newStatus.json(), { ok: true, authenticated: true });
  assert.equal(newStatus.headers.has('Set-Cookie'), false);
  const staleCookieFreeStatus = await proxyDishkaiAuth(req(), {}, fetcher);
  assert.equal(staleCookieFreeStatus.headers.has('Set-Cookie'), false);
});

test('authentication timeout covers both waiting for headers and reading the response body', async t => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  for (const bodyPhase of [false, true]) {
    let signal;
    let started;
    const upstreamStarted = new Promise(resolve => { started = resolve; });
    const fetcher = async (_url, init) => {
      signal = init.signal;
      started();
      if (!bodyPhase) return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('synthetic timeout')), { once: true }));
      return new Response(new ReadableStream({ start(controller) {
        signal.addEventListener('abort', () => controller.error(new Error('synthetic timeout')), { once: true });
      } }), { headers: { 'Content-Type': 'application/json' } });
    };
    const pending = proxyDishkaiAuth(req('GET', undefined, `${DISHKAI_SESSION_COOKIE}=${signedToken()}`), {}, fetcher);
    await upstreamStarted;
    t.mock.timers.tick(10001);
    const response = await pending;
    assert.equal(signal.aborted, true);
    assert.equal(response.status, 504);
    assert.deepEqual(await response.json(), { ok: false, error: 'UPSTREAM_TIMEOUT' });
  }
});

test('combined and multiple Set-Cookie headers only relay the one exact upstream token', async () => {
  const upstream = service();
  for (const combined of [false, true]) {
    const fetcher = async (url, init) => {
      if (!url.endsWith('/api/private-login')) return upstream.fetcher(url, init);
      const headers = new Headers({ 'Content-Type': 'application/json' });
      const session = `dishkai_session=${upstream.token}; Expires=Tue, 13 Oct 2026 10:00:00 GMT; Path=/; Domain=dishkai.com`;
      if (combined) headers.set('Set-Cookie', `unrelated_cookie=ignored; Path=/, ${session}`);
      else { headers.append('Set-Cookie', 'unrelated_cookie=ignored; Path=/'); headers.append('Set-Cookie', session); }
      return new Response(JSON.stringify({ ok: true }), { headers });
    };
    const response = await proxyDishkaiAuth(req('POST', { accessCode: PRIVATE_CODE }), { MAPKAI_DB: rateDatabase() }, fetcher);
    assert.equal(response.status, 200);
    const cookie = response.headers.get('Set-Cookie');
    assert.equal(cookie.includes('unrelated_cookie'), false);
    assert.equal(cookie.includes('Domain='), false);
    assert.ok(cookie.startsWith(`${DISHKAI_SESSION_COOKIE}=${upstream.token};`));
  }
});
