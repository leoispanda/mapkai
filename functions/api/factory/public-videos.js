import { PUBLIC_PREVIEW_DISCLOSURE, PUBLIC_PREVIEW_LABEL, publicItemProjection, readPublicCatalog, responseJson } from './_public.js';

export async function onRequest({ request, env }) {
  if (request.method !== 'GET') return responseJson({ error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  try {
    const catalog = await readPublicCatalog(env);
    return responseJson({
      items: catalog.items.map(publicItemProjection),
      reviewLabel: PUBLIC_PREVIEW_LABEL,
      disclosure: PUBLIC_PREVIEW_DISCLOSURE,
    });
  } catch {
    return responseJson({ error: 'Learning previews are temporarily unavailable.' }, 503);
  }
}
