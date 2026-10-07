import { authorize, factoryMedia, readCatalog, responseJson, safeItem } from './_media.js';
import { readReview } from './_reviews.js';
import { costResponse } from '../../_shared/cost-guard.js';

export async function onRequest({ request, env }) {
  if (request.method !== 'GET') return responseJson({ error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  const denied = await authorize(request, env);
  if (denied) return denied;
  try {
    const catalog = await readCatalog(env);
    if (!catalog.items.every(safeItem)) return responseJson({ error: 'Video catalog integrity check failed.' }, 503);
    const bucket = factoryMedia(env);
    const items = await Promise.all(catalog.items.map(async ({ objectKey, auditKey, sourceKeys, rawVideoPath, ...item }) => ({
      ...item,
      humanReview: (await readReview(bucket, item)).record,
      videoUrl: `/api/factory/video?id=${encodeURIComponent(item.id)}`,
      auditUrl: `/api/factory/source?id=${encodeURIComponent(item.id)}&file=receipt.json`,
      sources: (sourceKeys || []).map(source => ({ name: source.name, sha256: source.sha256, url: `/api/factory/source?id=${encodeURIComponent(item.id)}&file=${encodeURIComponent(source.name)}` })),
    })));
    return responseJson({ visibility: 'FOUNDER_ONLY', publicationStatus: 'NOT_PUBLISHED', items });
  } catch (error) { return costResponse(error) || responseJson({ error: 'Video catalog temporarily unavailable.' }, 503); }
}
