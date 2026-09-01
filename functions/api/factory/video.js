import { authorize, readCatalog, responseJson, safeItem, parseRange, PRIVATE_HEADERS } from './_media.js';

export async function onRequest({ request, env }) {
  if (!['GET', 'HEAD'].includes(request.method)) return responseJson({ error: 'Method not allowed.' }, 405, { Allow: 'GET, HEAD' });
  const denied = await authorize(request, env);
  if (denied) return denied;
  try {
    const url = new URL(request.url);
    const catalog = await readCatalog(env);
    const item = catalog.items.find(candidate => candidate.id === url.searchParams.get('id'));
    if (!safeItem(item)) return responseJson({ error: 'Video not found.' }, 404);
    const head = await env.MAPKAI_REVIEW_MEDIA.head(item.objectKey);
    if (!head) return responseJson({ error: 'Video is not uploaded yet.' }, 404);
    if (head.size !== item.fileSize) return responseJson({ error: 'Stored video does not match its receipt.' }, 409);
    const headers = { ...PRIVATE_HEADERS, 'Content-Type': 'video/mp4', 'Accept-Ranges': 'bytes',
      'Content-Disposition': `${url.searchParams.get('download') === '1' ? 'attachment' : 'inline'}; filename="mapkai-${item.fieldId}-raw.mp4"`,
      ETag: `"${item.sha256}"`, 'X-MapKAI-Video-Review': 'HUMAN_REVIEW_PENDING' };
    let range;
    const ifRange = request.headers.get('If-Range');
    try { range = parseRange(!ifRange || ifRange === headers.ETag ? request.headers.get('Range') : null, head.size); }
    catch { return new Response(null, { status: 416, headers: { ...headers, 'Content-Range': `bytes */${head.size}` } }); }
    headers['Content-Length'] = String(range ? range.length : head.size);
    if (range) headers['Content-Range'] = `bytes ${range.start}-${range.end}/${head.size}`;
    if (request.method === 'HEAD') return new Response(null, { status: range ? 206 : 200, headers });
    const object = await env.MAPKAI_REVIEW_MEDIA.get(item.objectKey, range ? { range: { offset: range.start, length: range.length } } : undefined);
    if (!object?.body) return responseJson({ error: 'Video is not available.' }, 404);
    // Stream directly from R2; do not load a large video into Worker memory.
    return new Response(object.body, { status: range ? 206 : 200, headers });
  } catch { return responseJson({ error: 'Video temporarily unavailable.' }, 503); }
}
