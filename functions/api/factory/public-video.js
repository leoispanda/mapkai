import { getPublicItemBySlug, PUBLIC_HEADERS, readPublicCatalog, responseJson, publicRange } from './_public.js';

export async function onRequest({ request, env }) {
  if (!['GET', 'HEAD'].includes(request.method)) return responseJson({ error: 'Method not allowed.' }, 405, { Allow: 'GET, HEAD' });
  try {
    const url = new URL(request.url);
    // Only the stable learner-facing slug is accepted. Internal IDs, object
    // keys, hashes and download switches are intentionally not requestable.
    const item = getPublicItemBySlug(await readPublicCatalog(env), url.searchParams.get('field'));
    if (!item) return responseJson({ error: 'Learning preview not found.' }, 404);
    const head = await env.MAPKAI_REVIEW_MEDIA.head(item.objectKey);
    if (!head || head.size !== item.fileSize) return responseJson({ error: 'Learning preview is unavailable.' }, 404);

    const headers = {
      ...PUBLIC_HEADERS,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Content-Disposition': `inline; filename="mapkai-${item.slug}-learning-preview.mp4"`,
      'X-MapKAI-Video-Review': 'content-under-review',
    };
    let range;
    try { range = publicRange(request.headers.get('Range'), head.size); }
    catch { return new Response(null, { status: 416, headers: { ...headers, 'Content-Range': `bytes */${head.size}` } }); }
    headers['Content-Length'] = String(range ? range.length : head.size);
    if (range) headers['Content-Range'] = `bytes ${range.start}-${range.end}/${head.size}`;
    if (request.method === 'HEAD') return new Response(null, { status: range ? 206 : 200, headers });

    const object = await env.MAPKAI_REVIEW_MEDIA.get(item.objectKey, range ? { range: { offset: range.start, length: range.length } } : undefined);
    if (!object?.body) return responseJson({ error: 'Learning preview is unavailable.' }, 404);
    return new Response(object.body, { status: range ? 206 : 200, headers });
  } catch {
    return responseJson({ error: 'Learning preview is temporarily unavailable.' }, 503);
  }
}
