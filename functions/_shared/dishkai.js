// MapKAI's public menu adapter. Only these public DishKAI operations are exposed.
const ORIGIN = 'https://dishkai.com';
const IMAGE_LIMIT = 8 * 1024 * 1024;
const JSON_LIMIT = 64 * 1024;
const RESPONSE_LIMIT = 3 * 1024 * 1024;
const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const json = (body, status = 400, extra = {}) => new Response(JSON.stringify(body), { status, headers: { ...headers, ...extra } });
const error = (code, status) => json({ ok: false, error: code }, status);

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
  const origin = request.headers.get('Origin');
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get('Sec-Fetch-Site') === 'cross-site') return error('ORIGIN_NOT_ALLOWED', 403);
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
    // This server-to-server call has no browser Origin, cookies or credentials.
    // DishKAI's public endpoint retains its own request validation and limits.
    const response = await fetcher(`${ORIGIN}/api/analyze-menu-${mode}`, {
      method: 'POST', headers: mode === 'text' ? { 'Content-Type': 'application/json', Accept: 'application/json' } : { Accept: 'application/json' },
      body, redirect: 'manual', signal: controller.signal,
    });
    if (response.status === 429) { await response.body?.cancel(); return json({ ok: false, error: 'RATE_LIMITED' }, 429, { 'Retry-After': response.headers.get('Retry-After') || '60' }); }
    if (!response.ok) { console.warn(JSON.stringify({ event: 'dishkai_upstream_error', mode, status: response.status })); await response.body?.cancel(); return error(mode === 'image' ? 'IMAGE_UNAVAILABLE' : 'UPSTREAM_UNAVAILABLE', 502); }
    if (!response.headers.get('Content-Type')?.includes('application/json')) { await response.body?.cancel(); return error('INVALID_RESPONSE', 502); }
    const data = JSON.parse(new TextDecoder().decode(await readBoundedBody(response, RESPONSE_LIMIT)));
    if (data.ok !== true || !Array.isArray(data.items) || data.items.length > 200 || data.items.some(item => !item || typeof item !== 'object')) return error('INVALID_RESPONSE', 502);
    return json(data, 200);
  } catch (cause) { console.warn(JSON.stringify({ event: 'dishkai_request_failed', mode, name: cause?.name, message: cause?.message })); return error(controller.signal.aborted ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_UNAVAILABLE', controller.signal.aborted ? 504 : 502); }
  finally { clearTimeout(timeout); }
}

export async function proxyDishImage(request, fetcher = fetch) {
  if (request.method !== 'GET') return json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, 405, { Allow: 'GET' });
  const path = new URL(request.url).searchParams.get('path') || '';
  if (!/^\/assets\/dishes\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:webp|png|jpe?g)$/i.test(path)) return error('INVALID_IMAGE_PATH', 400);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetcher(`${ORIGIN}${path}`, { redirect: 'manual', signal: controller.signal });
    const type = response.headers.get('Content-Type')?.split(';')[0];
    if (!response.ok || !['image/webp', 'image/png', 'image/jpeg'].includes(type)) { await response.body?.cancel(); return error('IMAGE_NOT_FOUND', 404); }
    const bytes = await readBoundedBody(response, IMAGE_LIMIT);
    return new Response(bytes, { headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=86400', 'X-Content-Type-Options': 'nosniff' } });
  } catch { return error('IMAGE_UNAVAILABLE', 502); }
  finally { clearTimeout(timeout); }
}
