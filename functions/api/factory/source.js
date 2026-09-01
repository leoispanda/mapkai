import { authorize, readCatalog, responseJson, safeItem, PRIVATE_HEADERS } from './_media.js';

export async function onRequest({ request, env }) {
  if (request.method !== 'GET') return responseJson({ error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  const denied = await authorize(request, env);
  if (denied) return denied;
  try {
    const url = new URL(request.url);
    const item = (await readCatalog(env)).items.find(candidate => candidate.id === url.searchParams.get('id'));
    if (!safeItem(item)) return responseJson({ error: 'Artifact not found.' }, 404);
    const file = url.searchParams.get('file');
    if (!['receipt.json', 'overview.md', 'narrative_blueprint.md', 'video_prompt.md'].includes(file)) return responseJson({ error: 'Artifact not found.' }, 404);
    // Resolve from this exact attempt. Never accept an arbitrary object key from a URL.
    const key = `audit/${item.id}/${file}`;
    if (file !== 'receipt.json' && !(item.sourceKeys || []).some(source => source.name === file && source.key === key)) return responseJson({ error: 'Artifact not found.' }, 404);
    const object = await env.MAPKAI_REVIEW_MEDIA.get(key);
    if (!object) return responseJson({ error: 'Artifact not uploaded.' }, 404);
    return new Response(object.body, { headers: { ...PRIVATE_HEADERS, 'Content-Type': 'text/plain; charset=utf-8', 'Content-Disposition': `inline; filename="${file}"` } });
  } catch { return responseJson({ error: 'Artifact temporarily unavailable.' }, 503); }
}
