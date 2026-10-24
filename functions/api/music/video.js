import { parseRange } from '../factory/_media.js';
import { RESPONSE_HEADERS, errorResponse, json, musicBucket } from './_shared.js';
import { findVideoQuality, VIDEO_REVISION } from './_videos.js';

function selectedVideo(url) {
  const params = url.searchParams;
  if ([...params.keys()].some(key => !['id', 'quality', 'revision'].includes(key))
    || params.getAll('id').length !== 1 || params.getAll('quality').length > 1
    || params.getAll('revision').length > 1
    || (params.has('revision') && ![VIDEO_REVISION, 'song-names-20261024', 'ai-label-20261023'].includes(params.get('revision')))) return null;
  return findVideoQuality(params.get('id'), params.get('quality') ?? 'phone');
}

export async function onRequest({ request, env = {} }) {
  if (!['GET', 'HEAD'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET, HEAD' });
  const url = new URL(request.url);
  // Public links are same-origin; no request parameter can name an R2 object.
  const selected = selectedVideo(url);
  if (!selected) return json({ error: 'Music video not found.' }, 404);
  const origin = request.headers.get('Origin');
  if ((origin && origin !== url.origin) || request.headers.get('Sec-Fetch-Site') === 'cross-site'
    || request.headers.get('Sec-Fetch-Mode') === 'navigate' || request.headers.get('Sec-Fetch-Dest') === 'document') {
    return json({ error: 'Open MapKAI Music to watch this video.' }, 403);
  }
  try {
    const { rendition } = selected;
    const bucket = musicBucket(env);
    const head = await bucket.head(rendition.objectKey);
    if (!head || head.size !== rendition.bytes || head.etag !== rendition.etag) {
      return json({ error: 'This music video is unavailable.' }, 404);
    }
    const etag = `"${rendition.etag}"`;
    const headers = { ...RESPONSE_HEADERS, 'Cache-Control': 'public, max-age=86400, immutable',
      'Content-Type': 'video/mp4', 'Accept-Ranges': 'bytes', ETag: etag,
      Vary: 'Origin, Sec-Fetch-Site, Sec-Fetch-Mode, Sec-Fetch-Dest',
      'Content-Disposition': `inline; filename="${rendition.filename}"` };
    const validators = request.headers.get('If-None-Match')?.split(',').map(value => value.trim().replace(/^W\//, ''));
    if (validators?.some(value => value === '*' || value === etag)) return new Response(null, { status: 304, headers });
    let range;
    const ifRange = request.headers.get('If-Range');
    try { range = parseRange(!ifRange || ifRange === etag ? request.headers.get('Range') : null, head.size); }
    catch { return new Response(null, { status: 416, headers: { ...headers, 'Content-Range': `bytes */${head.size}` } }); }
    headers['Content-Length'] = String(range ? range.length : head.size);
    if (range) headers['Content-Range'] = `bytes ${range.start}-${range.end}/${head.size}`;
    if (request.method === 'HEAD') return new Response(null, { status: range ? 206 : 200, headers });
    const object = await bucket.get(rendition.objectKey, { onlyIf: { etagMatches: head.etag },
      ...(range ? { range: { offset: range.start, length: range.length } } : {}) });
    // Recheck the object returned after HEAD; an overwritten or deleted object
    // cannot slip through the conditional read during the two operations.
    if (!object?.body || object.etag !== head.etag || object.size !== head.size) {
      return json({ error: 'This music video is unavailable.' }, 404);
    }
    return new Response(object.body, { status: range ? 206 : 200, headers });
  } catch (error) { return errorResponse(error, 'Music videos are temporarily unavailable. Please try again later.'); }
}
