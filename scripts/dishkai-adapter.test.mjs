import test from 'node:test';
import assert from 'node:assert/strict';
import { proxyMenu as handleMenu, proxyDishImage as handleImage, readBoundedBody } from '../functions/_shared/dishkai.js';

const session = `${Buffer.from(JSON.stringify({ sub: 'dishkai-owner', version: 2, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.${'a'.repeat(43)}`;
const cookie = `mapkai_dishkai_session=${session}`;
const withSession = fetcher => async (url, init) => url === 'https://dishkai.com/api/private-status'
  ? Response.json({ ok: true, configured: true, authenticated: true }) : fetcher(url, init);
const proxyMenu = (input, mode, fetcher) => handleMenu(input, mode, withSession(fetcher));
const proxyDishImage = (input, fetcher) => handleImage(input, withSession(fetcher));
const imageRequest = url => new Request(url, { headers: { Cookie: cookie } });

const request = (overrides = {}) => new Request('https://mapkai.com/api/dishkai/analyze-menu-text', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://mapkai.com', Cookie: cookie },
  body: JSON.stringify({ menuText: 'Pad Thai', targetLanguage: 'zh' }), ...overrides,
});
const goodResponse = () => Response.json({ ok: true, items: [{ orderIndex: 1, originalName: 'Pad Thai', matchStatus: 'matched' }] });
const neverFetch = () => { assert.fail('Invalid requests must not reach DishKAI'); };

test('forwards text only to the fixed endpoint without browser credentials or extra fields', async () => {
  const input = request({ headers: { 'Content-Type': 'application/json', Origin: 'https://mapkai.com', Cookie: `${cookie}; private=secret`, Authorization: 'Bearer secret' }, body: JSON.stringify({ menuText: ' Pad Thai ', targetLanguage: 'zh', url: 'https://evil.example', token: 'secret' }) });
  const result = await proxyMenu(input, 'text', async (url, init) => {
    assert.equal(url, 'https://dishkai.com/api/analyze-menu-text');
    assert.deepEqual(init.headers, { 'Content-Type': 'application/json', Accept: 'application/json', Cookie: `dishkai_session=${session}` });
    assert.deepEqual(JSON.parse(init.body), { menuText: 'Pad Thai', targetLanguage: 'zh', sourceLanguage: 'auto' });
    assert.equal(init.redirect, 'manual');
    return goodResponse();
  });
  assert.equal(result.status, 200); assert.equal(result.headers.get('Cache-Control'), 'private, no-store');
});
test('rejects foreign origins, cross-site browser requests and unsupported methods', async () => {
  assert.equal((await proxyMenu(request({ headers: { Origin: 'https://evil.example', Cookie: cookie } }), 'text', neverFetch)).status, 403);
  assert.equal((await proxyMenu(request({ headers: { 'Sec-Fetch-Site': 'cross-site', Cookie: cookie } }), 'text', neverFetch)).status, 403);
  assert.equal((await proxyMenu(new Request('https://mapkai.com/api/dishkai/analyze-menu-text'), 'text', neverFetch)).status, 405);
});
test('rejects malformed, oversized, empty, unsupported language and wrong content type requests', async () => {
  for (const body of ['broken', '{}', JSON.stringify({ menuText: ' ', targetLanguage: 'en' }), JSON.stringify({ menuText: 'a'.repeat(12001), targetLanguage: 'en' }), JSON.stringify({ menuText: 'Pad Thai', targetLanguage: 'xx' })]) {
    assert.equal((await proxyMenu(request({ body }), 'text', neverFetch)).status, 400);
  }
  assert.equal((await proxyMenu(request({ body: 'x'.repeat(65537) }), 'text', neverFetch)).status, 413);
  assert.equal((await proxyMenu(request({ headers: { 'Content-Type': 'text/plain', Cookie: cookie } }), 'text', neverFetch)).status, 415);
});
test('stream limits work without a content length and cancel excess data', async () => {
  let cancelled = false;
  const body = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(5)); controller.enqueue(new Uint8Array(7)); }, cancel() { cancelled = true; } });
  await assert.rejects(readBoundedBody(new Response(body), 10), RangeError);
  assert.equal(cancelled, true);
});
test('rebuilds photo uploads with only supported fields and removes personal filenames', async () => {
  const form = new FormData(); form.set('image', new Blob(['photo'], { type: 'image/png' }), 'personal-name.png'); form.set('targetLanguage', 'en'); form.set('private', 'value');
  const result = await proxyMenu(request({ headers: { Cookie: cookie }, body: form }), 'image', async (url, init) => {
    assert.equal(url, 'https://dishkai.com/api/analyze-menu-image'); assert.deepEqual([...init.body.keys()], ['image', 'sourceLanguage', 'targetLanguage']);
    assert.equal(init.body.get('image').name, 'menu-image'); assert.equal(init.body.get('image').type, 'image/png'); assert.equal(init.body.get('targetLanguage'), 'en');
    return goodResponse();
  });
  assert.equal(result.status, 200);
});
test('rejects missing or unsupported image uploads', async () => {
  for (const type of ['', 'image/svg+xml', 'text/html']) {
    const form = new FormData(); if (type) form.set('image', new Blob(['bad'], { type }), 'file'); form.set('targetLanguage', 'zh');
    assert.equal((await proxyMenu(request({ headers: { Cookie: cookie }, body: form }), 'image', neverFetch)).status, 400);
  }
});
test('upstream failures, non-JSON pages, bad shapes and network errors are recoverable JSON', async () => {
  for (const fetcher of [async () => new Response('down', { status: 500 }), async () => new Response('<html>challenge</html>'), async () => Response.json({ ok: true }), async () => Response.json({ ok: true, items: [null] }), async () => { throw new Error('network'); }]) {
    const result = await proxyMenu(request(), 'text', fetcher); assert.equal(result.status, 502); assert.equal((await result.json()).ok, false);
  }
});
test('preserves upstream rate limiting', async () => {
  const result = await proxyMenu(request(), 'text', async () => new Response('', { status: 429, headers: { 'Retry-After': '42' } }));
  assert.equal(result.status, 429); assert.equal(result.headers.get('Retry-After'), '42'); assert.equal((await result.json()).error, 'RATE_LIMITED');
});
test('does not treat unknown or AI-generated items as verified', async () => {
  const items = [{ originalName: 'Unknown', matchStatus: 'unmatched', card: { verified: false } }, { originalName: 'Estimate', matchStatus: 'ai-generated', card: { metadataSource: 'ai-fallback', verified: false } }];
  const result = await proxyMenu(request(), 'text', async () => Response.json({ ok: true, items })); assert.deepEqual((await result.json()).items, items);
});
test('image proxy rejects foreign URLs, traversal, private APIs and SVG', async () => {
  for (const path of ['https://evil.example/a.png', '/api/private-status', '/assets/dishes/../secret.png', '/assets/dishes/%2e%2e/a.png', '/assets/dishes/test.svg', '/assets/dishes/a.webp?token=secret']) {
    assert.equal((await proxyDishImage(imageRequest(`https://mapkai.com/api/dishkai/image?path=${encodeURIComponent(path)}`), neverFetch)).status, 400);
  }
});
test('image proxy serves only expected image content with a bounded response', async () => {
  const input = () => imageRequest('https://mapkai.com/api/dishkai/image?path=/assets/dishes/main/108001-pad-thai.webp');
  const result = await proxyDishImage(input(), async (url, init) => {
    assert.equal(url, 'https://dishkai.com/assets/dishes/main/108001-pad-thai.webp'); assert.equal(init.redirect, 'manual');
    return new Response(new Uint8Array([1, 2, 3]), { headers: { 'Content-Type': 'image/webp', 'Set-Cookie': 'secret' } });
  });
  assert.equal(result.status, 200); assert.equal(result.headers.get('Content-Type'), 'image/webp'); assert.equal(result.headers.has('Set-Cookie'), false);
  assert.equal((await proxyDishImage(input(), async () => new Response('<html>error</html>', { headers: { 'Content-Type': 'text/html' } }))).status, 404);
});

test('upstream redirects are rejected without following the new destination', async () => {
  const result = await proxyMenu(request(), 'text', async (_url, init) => {
    assert.equal(init.redirect, 'manual');
    return new Response(null, { status: 302, headers: { Location: 'https://elsewhere.example/' } });
  });
  assert.equal(result.status, 502);
  assert.equal((await result.json()).error, 'UPSTREAM_UNAVAILABLE');
});
