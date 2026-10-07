import { wrapR2Bucket, costResponse } from './shared/cost-guard.mjs';

const HOST_BUCKETS = Object.freeze({
  'media.mapkai.com': 'MAPKAI_FINANCE_MEDIA',
  'media.turnpo.com': 'TURNPO_MEDIA',
});

function failure(status, message, headers = {}) {
  return new Response(message, { status, headers: {
    'Cache-Control': 'no-store',
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'X-Cloudflare-Cost-Guard': 'protected',
    ...headers,
  } });
}

export function parseMediaRange(value, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim());
  if (!match || (!match[1] && !match[2]) || size === 0) throw new Error('Invalid range');
  const first = Number(match[1] || 0);
  const last = Number(match[2] || 0);
  if (![first, last].every(Number.isSafeInteger)) throw new Error('Invalid range');
  const suffix = !match[1];
  const start = suffix ? Math.max(0, size - last) : first;
  const end = suffix || !match[2] ? size - 1 : Math.min(last, size - 1);
  if (start >= size || end < start || (suffix && last === 0)) throw new Error('Invalid range');
  return { offset: start, length: end - start + 1 };
}

function unmodified(request, object) {
  const etags = request.headers.get('If-None-Match');
  if (etags) return etags.split(',').some(tag => tag.trim() === '*' || tag.trim().replace(/^W\//, '') === object.httpEtag);
  const since = Date.parse(request.headers.get('If-Modified-Since') || '');
  return Number.isFinite(since) && Math.floor(object.uploaded.getTime() / 1000) <= Math.floor(since / 1000);
}

function permitsRange(request, object) {
  const validator = request.headers.get('If-Range');
  if (!validator) return true;
  if (validator.startsWith('"') || validator.startsWith('W/')) return validator === object.httpEtag;
  const since = Date.parse(validator);
  return Number.isFinite(since) && Math.floor(object.uploaded.getTime() / 1000) <= Math.floor(since / 1000);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const binding = Object.hasOwn(HOST_BUCKETS, url.hostname) ? HOST_BUCKETS[url.hostname] : undefined;
    if (!binding) return failure(404, 'Not found.');
    if (!['GET', 'HEAD'].includes(request.method)) return failure(405, 'Method not allowed.', { Allow: 'GET, HEAD' });
    let key;
    try { key = decodeURIComponent(url.pathname.slice(1)); }
    catch { return failure(400, 'Invalid media address.'); }
    if (!key || key.includes('\0')) return failure(404, 'Not found.');
    try {
      const bucket = wrapR2Bucket(env[binding], env);
      const head = await bucket.head(key);
      if (!head) return failure(404, 'Media not found.');
      const headers = new Headers();
      head.writeHttpMetadata(headers);
      headers.set('ETag', head.httpEtag);
      headers.set('Last-Modified', head.uploaded.toUTCString());
      headers.set('Accept-Ranges', 'bytes');
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Cloudflare-Cost-Guard', 'protected');
      if (!headers.has('Cache-Control')) headers.set('Cache-Control', 'public, max-age=3600');
      if (unmodified(request, head)) return new Response(null, { status: 304, headers });
      let range;
      if (request.method === 'GET' && request.headers.has('Range') && permitsRange(request, head)) {
        try { range = parseMediaRange(request.headers.get('Range'), head.size); }
        catch { return failure(416, 'Requested media range is unavailable.', { 'Content-Range': `bytes */${head.size}` }); }
      }
      headers.set('Content-Length', String(range ? range.length : head.size));
      if (range) headers.set('Content-Range', `bytes ${range.offset}-${range.offset + range.length - 1}/${head.size}`);
      if (request.method === 'HEAD') return new Response(null, { status: 200, headers });
      const object = await bucket.get(key, { onlyIf: { etagMatches: head.etag }, ...(range ? { range } : {}) });
      if (!object?.body) return failure(503, 'Media is temporarily unavailable. Please try again later.');
      return new Response(object.body, { status: range ? 206 : 200, headers });
    } catch (error) {
      const protectedResponse = costResponse(error);
      if (protectedResponse) {
        protectedResponse.headers.set('X-Cloudflare-Cost-Guard', 'protected');
        return protectedResponse;
      }
      return failure(503, 'Media is temporarily unavailable. Please try again later.');
    }
  },
};
