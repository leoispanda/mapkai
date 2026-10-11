import { checkRateLimit, getClientIp } from '../api/_shared/rate-limit.js';

// Every browser relays its own upstream-signed session; no shared owner credential.
const ORIGIN = 'https://dishkai.com';
export const DISHKAI_SESSION_COOKIE = 'mapkai_dishkai_session';
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
const AUTH_BODY_LIMIT = 4096;
const AUTH_RESPONSE_LIMIT = 8192;
const IMAGE_LIMIT = 8 * 1024 * 1024;
const JSON_LIMIT = 64 * 1024;
const RESPONSE_LIMIT = 3 * 1024 * 1024;
const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'private, no-store', 'Vary': 'Cookie', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };
const json = (body, status = 400, extra = {}) => new Response(JSON.stringify(body), { status, headers: { ...headers, ...extra } });
const error = (code, status) => json({ ok: false, error: code }, status);

function sameOrigin(request) {
  const origin = request.headers.get('Origin');
  return (!origin || origin === new URL(request.url).origin) && request.headers.get('Sec-Fetch-Site') !== 'cross-site';
}

function tokenExpiry(token) {
  if (typeof token !== 'string' || token.length > 2048 || !/^[A-Za-z0-9_-]{16,1536}\.[A-Za-z0-9_-]{43}$/.test(token)) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')));
    return payload?.sub === 'dishkai-owner' && payload.version === 2 && Number.isSafeInteger(payload.exp)
      && payload.exp > Math.floor(Date.now() / 1000) ? payload.exp : null;
  } catch { return null; }
}

function sessionToken(request) {
  const cookie = request.headers.get('Cookie') || '';
  if (cookie.length > 16384) return null;
  const matches = cookie.split(';').map(part => part.trim()).filter(part => part.split('=')[0] === DISHKAI_SESSION_COOKIE);
  if (matches.length !== 1) return null;
  const token = matches[0].slice(DISHKAI_SESSION_COOKIE.length + 1);
  return tokenExpiry(token) ? token : null;
}

function sessionCookie(token = '') {
  const expires = tokenExpiry(token);
  const maxAge = expires ? Math.min(SESSION_TTL_SECONDS, expires - Math.floor(Date.now() / 1000)) : 0;
  return `${DISHKAI_SESSION_COOKIE}=${expires ? token : ''}; HttpOnly; Secure; SameSite=Strict; Path=/api/dishkai; Max-Age=${maxAge}`;
}

// Failed old requests can finish after a newer login; only explicit logout clears the cookie.
const privateAccessRequired = () => json({ ok: false, error: 'PRIVATE_ACCESS_REQUIRED' }, 401);

function upstreamCookie(response) {
  const values = typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : [response.headers.get('Set-Cookie') || ''];
  if (values.join('').length > 8192) return null;
  const matches = [];
  for (const value of values) {
    // Comma splitting supports runtimes which combine Set-Cookie headers, without splitting Expires dates.
    for (const cookie of value.split(/,(?=\s*[^;,=\s]+=)/)) {
      const match = /^\s*dishkai_session=([^;]+)(?:;|$)/.exec(cookie);
      if (match) matches.push(match[1]);
    }
  }
  return matches.length === 1 && tokenExpiry(matches[0]) ? matches[0] : null;
}

function privateUpstreamResponse(response) {
  if (response.status === 401) return true;
  if (response.status < 300 || response.status >= 400) return false;
  const location = response.headers.get('Location');
  if (!location) return false;
  try {
    const url = new URL(location, ORIGIN);
    return ['https://dishkai.com', 'https://www.dishkai.com'].includes(url.origin) && ['/login', '/login.html'].includes(url.pathname);
  } catch { return false; }
}

async function readUpstreamJson(response, limit = AUTH_RESPONSE_LIMIT) {
  if (!/^application\/json(?:;|$)/i.test(response.headers.get('Content-Type') || '')) throw new Error('INVALID_RESPONSE');
  return JSON.parse(new TextDecoder().decode(await readBoundedBody(response, limit)));
}

async function upstreamAuth(path, { token, body } = {}, fetcher = fetch) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  let response;
  try {
    response = await fetcher(`${ORIGIN}/api/private-${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { Accept: 'application/json', ...(token ? { Cookie: `dishkai_session=${token}` } : {}), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
      ...(body === undefined ? {} : { body }), redirect: 'manual', signal: controller.signal,
    });
    if (privateUpstreamResponse(response)) return { denied: true };
    if (response.status === 429) return { blocked: json({ ok: false, error: 'RATE_LIMITED' }, 429, { 'Retry-After': safeRetryAfter(response) }) };
    if (!response.ok) return { blocked: error('UPSTREAM_UNAVAILABLE', response.status === 503 ? 503 : 502) };
    const data = await readUpstreamJson(response);
    if (data?.ok !== true) return { blocked: error('INVALID_RESPONSE', 502) };
    return { data, token: path === 'login' ? upstreamCookie(response) : token };
  } catch {
    return { blocked: error(controller.signal.aborted ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_UNAVAILABLE', controller.signal.aborted ? 504 : 502) };
  } finally {
    if (response && !response.bodyUsed) await response.body?.cancel().catch(() => {});
    clearTimeout(timeout);
  }
}

function safeRetryAfter(response) {
  const value = response.headers.get('Retry-After') || '';
  return /^\d{1,6}$/.test(value) ? String(Math.max(1, Math.min(86400, Number(value)))) : '60';
}

async function validateSession(request, fetcher) {
  const token = sessionToken(request);
  if (!token) return { blocked: privateAccessRequired() };
  const result = await upstreamAuth('status', { token }, fetcher);
  if (result.blocked) return result;
  if (result.denied || result.data?.configured !== true || result.data?.authenticated !== true) return { blocked: privateAccessRequired() };
  return { token };
}

export async function proxyDishkaiAuth(request, env = {}, fetcher = fetch) {
  if (!['GET', 'POST', 'DELETE'].includes(request.method)) return json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, 405, { Allow: 'GET, POST, DELETE' });
  if (!sameOrigin(request)) return error('ORIGIN_NOT_ALLOWED', 403);
  if (request.method === 'DELETE') return json({ ok: true, authenticated: false }, 200, { 'Set-Cookie': sessionCookie() });
  if (request.method === 'GET') {
    if (!sessionToken(request)) return json({ ok: true, authenticated: false }, 200);
    const result = await validateSession(request, fetcher);
    return result.blocked || json({ ok: true, authenticated: true }, 200);
  }
  if (!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type') || '')) return error('INVALID_CONTENT_TYPE', 415);
  // A missing or failed durable limit must not make the delegated password endpoint public to guessing.
  if (typeof env.MAPKAI_DB?.prepare !== 'function') return error('AUTH_UNAVAILABLE', 503);
  try {
    const limited = await checkRateLimit(env.MAPKAI_DB, `dishkai-login:${getClientIp(request)}`, { limit: 5, windowSeconds: 15 * 60 });
    if (limited.skipped) return error('AUTH_UNAVAILABLE', 503);
    if (!limited.ok) return json({ ok: false, error: 'RATE_LIMITED' }, 429, { 'Retry-After': String(limited.retryAfter) });
  } catch { return error('AUTH_UNAVAILABLE', 503); }
  let data;
  try { data = JSON.parse(new TextDecoder().decode(await readBoundedBody(request, AUTH_BODY_LIMIT))); }
  catch (cause) { return error(cause instanceof RangeError ? 'BODY_TOO_LARGE' : 'INVALID_INPUT', cause instanceof RangeError ? 413 : 400); }
  if (!data || typeof data.accessCode !== 'string' || !data.accessCode || data.accessCode.length > 256) return error('INVALID_INPUT', 400);
  const result = await upstreamAuth('login', { body: JSON.stringify({ accessCode: data.accessCode }) }, fetcher);
  if (result.blocked) return result.blocked;
  if (result.denied) return json({ ok: false, error: 'INVALID_ACCESS_CODE' }, 401);
  if (!result.token) return error('INVALID_RESPONSE', 502);
  // Confirm this token independently before marking the browser authenticated.
  const confirmed = await upstreamAuth('status', { token: result.token }, fetcher);
  if (confirmed.blocked) return confirmed.blocked;
  if (confirmed.denied || confirmed.data?.configured !== true || confirmed.data?.authenticated !== true || !tokenExpiry(result.token)) return privateAccessRequired();
  return json({ ok: true, authenticated: true }, 200, { 'Set-Cookie': sessionCookie(result.token) });
}

export async function readBoundedBody(message, limit) {
  if (Number(message.headers.get('Content-Length')) > limit) {
    await message.body?.cancel();
    throw new RangeError('BODY_TOO_LARGE');
  }
  if (!message.body) return new Uint8Array();
  const reader = message.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new RangeError('BODY_TOO_LARGE'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return bytes;
}

export async function proxyMenu(request, mode, fetcher = fetch) {
  if (request.method !== 'POST') return json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, 405, { Allow: 'POST' });
  if (!['text', 'image'].includes(mode)) return error('NOT_FOUND', 404);
  if (!sameOrigin(request)) return error('ORIGIN_NOT_ALLOWED', 403);
  const session = await validateSession(request, fetcher);
  if (session.blocked) return session.blocked;
  const contentType = request.headers.get('Content-Type') || '';
  if (mode === 'text' ? !/^application\/json(?:;|$)/i.test(contentType) : !/^multipart\/form-data;.*boundary=/i.test(contentType)) return error('INVALID_CONTENT_TYPE', 415);
  let body;
  try {
    body = await readBoundedBody(request, mode === 'text' ? JSON_LIMIT : IMAGE_LIMIT + 32768);
    if (mode === 'text') {
      const data = JSON.parse(new TextDecoder().decode(body));
      if (typeof data.menuText !== 'string' || !data.menuText.trim() || data.menuText.length > 12000 || !['zh', 'en', 'nl'].includes(data.targetLanguage)) return error('INVALID_MENU', 400);
      body = JSON.stringify({ menuText: data.menuText.trim(), sourceLanguage: 'auto', targetLanguage: data.targetLanguage });
    } else {
      const form = await new Response(body, { headers: { 'Content-Type': contentType } }).formData();
      const image = form.get('image');
      if (!image || typeof image === 'string' || !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(image.type) || !image.size || image.size > IMAGE_LIMIT || !['zh', 'en', 'nl'].includes(form.get('targetLanguage'))) return error('INVALID_IMAGE', 400);
      const cleaned = new FormData();
      cleaned.set('image', image, 'menu-image');
      cleaned.set('sourceLanguage', 'auto');
      cleaned.set('targetLanguage', form.get('targetLanguage'));
      body = cleaned;
    }
  } catch (cause) { return error(cause instanceof RangeError ? 'BODY_TOO_LARGE' : 'INVALID_INPUT', cause instanceof RangeError ? 413 : 400); }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 100000);
  try {
    // Forward exactly this visitor's signed DishKAI token, never unrelated browser credentials.
    const response = await fetcher(`${ORIGIN}/api/analyze-menu-${mode}`, {
      method: 'POST', headers: { ...(mode === 'text' ? { 'Content-Type': 'application/json' } : {}), Accept: 'application/json', Cookie: `dishkai_session=${session.token}` },
      body, redirect: 'manual', signal: controller.signal,
    });
    if (privateUpstreamResponse(response)) { await response.body?.cancel(); return privateAccessRequired(); }
    if (response.status === 429) { await response.body?.cancel(); return json({ ok: false, error: 'RATE_LIMITED' }, 429, { 'Retry-After': safeRetryAfter(response) }); }
    if (!response.ok) { console.warn(JSON.stringify({ event: 'dishkai_upstream_error', mode, status: response.status })); await response.body?.cancel(); return error(mode === 'image' ? 'IMAGE_UNAVAILABLE' : 'UPSTREAM_UNAVAILABLE', 502); }
    if (!response.headers.get('Content-Type')?.includes('application/json')) { await response.body?.cancel(); return error('INVALID_RESPONSE', 502); }
    const data = JSON.parse(new TextDecoder().decode(await readBoundedBody(response, RESPONSE_LIMIT)));
    if (data.ok !== true || !Array.isArray(data.items) || data.items.length > 200 || data.items.some(item => !item || typeof item !== 'object')) return error('INVALID_RESPONSE', 502);
    return json(data, 200);
  } catch { console.warn(JSON.stringify({ event: 'dishkai_request_failed', mode, timeout: controller.signal.aborted })); return error(controller.signal.aborted ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_UNAVAILABLE', controller.signal.aborted ? 504 : 502); }
  finally { clearTimeout(timeout); }
}

export async function proxyDishImage(request, fetcher = fetch) {
  if (request.method !== 'GET') return json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, 405, { Allow: 'GET' });
  if (!sameOrigin(request)) return error('ORIGIN_NOT_ALLOWED', 403);
  const session = await validateSession(request, fetcher);
  if (session.blocked) return session.blocked;
  const path = new URL(request.url).searchParams.get('path') || '';
  if (!/^\/assets\/dishes\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:webp|png|jpe?g)$/i.test(path)) return error('INVALID_IMAGE_PATH', 400);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetcher(`${ORIGIN}${path}`, { headers: { Cookie: `dishkai_session=${session.token}` }, redirect: 'manual', signal: controller.signal });
    if (privateUpstreamResponse(response)) { await response.body?.cancel(); return privateAccessRequired(); }
    const type = response.headers.get('Content-Type')?.split(';')[0];
    if (!response.ok || !['image/webp', 'image/png', 'image/jpeg'].includes(type)) { await response.body?.cancel(); return error('IMAGE_NOT_FOUND', 404); }
    const bytes = await readBoundedBody(response, IMAGE_LIMIT);
    return new Response(bytes, { headers: { 'Content-Type': type, 'Cache-Control': 'private, no-store', 'Vary': 'Cookie', 'X-Content-Type-Options': 'nosniff' } });
  } catch { return error('IMAGE_UNAVAILABLE', 502); }
  finally { clearTimeout(timeout); }
}
