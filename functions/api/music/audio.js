import { parseRange } from '../factory/_media.js';
import { RESPONSE_HEADERS, errorResponse, json, musicBucket, readTrack } from './_shared.js';

export async function onRequest({ request, env = {} }) {
  if (!['GET', 'HEAD'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET, HEAD' });
  try {
    const bucket = musicBucket(env);
    const track = await readTrack(bucket, new URL(request.url).searchParams.get('id'));
    if (!track) return json({ error: 'Song not found.' }, 404);
    const head = await bucket.head(track.objectKey);
    if (!head || head.size !== track.fileSize || head.etag !== track.audioEtag) return json({ error: 'This song is unavailable.' }, 404);
    const headers = { ...RESPONSE_HEADERS, 'Cache-Control': 'public, max-age=86400, immutable',
      'Content-Type': track.contentType, 'Accept-Ranges': 'bytes', ETag: head.httpEtag || `"${head.etag}"`,
      'Content-Disposition': `inline; filename="mapkai-${track.id}.${track.extension}"` };
    if (request.headers.get('If-None-Match')?.split(',').map(value => value.trim()).includes(headers.ETag)) return new Response(null, { status: 304, headers });
    let range;
    const ifRange = request.headers.get('If-Range');
    try { range = parseRange(!ifRange || ifRange === headers.ETag ? request.headers.get('Range') : null, head.size); }
    catch { return new Response(null, { status: 416, headers: { ...headers, 'Content-Range': `bytes */${head.size}` } }); }
    headers['Content-Length'] = String(range ? range.length : head.size);
    if (range) headers['Content-Range'] = `bytes ${range.start}-${range.end}/${head.size}`;
    if (request.method === 'HEAD') return new Response(null, { status: range ? 206 : 200, headers });
    const object = await bucket.get(track.objectKey, { onlyIf: { etagMatches: head.etag },
      ...(range ? { range: { offset: range.start, length: range.length } } : {}) });
    if (!object?.body) return json({ error: 'This song is unavailable.' }, 404);
    return new Response(object.body, { status: range ? 206 : 200, headers });
  } catch (error) { return errorResponse(error); }
}
