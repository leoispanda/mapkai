import { authorize, readCatalog, responseJson, safeItem } from './_media.js';

export async function onRequest({ request, env }) {
  if (request.method !== 'GET') return responseJson({ error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  const denied = await authorize(request, env);
  if (denied) return denied;
  try {
    const catalog = await readCatalog(env);
    if (!catalog.items.every(safeItem)) return responseJson({ error: 'Video catalog integrity check failed.' }, 503);
    return responseJson({ visibility: 'FOUNDER_ONLY', publicationStatus: 'NOT_PUBLISHED', items: catalog.items.map(({ objectKey, auditKey, sourceKeys, rawVideoPath, ...item }) => ({
      ...item,
      videoUrl: `/api/factory/video?id=${encodeURIComponent(item.id)}`,
      auditUrl: `/api/factory/source?id=${encodeURIComponent(item.id)}&file=receipt.json`,
      sources: (sourceKeys || []).map(source => ({ name: source.name, sha256: source.sha256, url: `/api/factory/source?id=${encodeURIComponent(item.id)}&file=${encodeURIComponent(source.name)}` })),
    })) });
  } catch { return responseJson({ error: 'Video catalog temporarily unavailable.' }, 503); }
}
