import { hasValidFounderAccessCookie } from '../pdc/_shared.js';

export const CATALOG_KEY = 'catalog/review-v1.json';
export const PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Vary': 'Cookie',
};
export function responseJson(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { ...PRIVATE_HEADERS, 'Content-Type': 'application/json; charset=utf-8', ...headers } });
}
export async function authorize(request, env) {
  if (!await hasValidFounderAccessCookie(request, env)) return responseJson({ error: 'Founder sign-in required.' }, 401);
  if (!env.MAPKAI_REVIEW_MEDIA) return responseJson({ error: 'Private video storage is not configured.' }, 503);
  return null;
}
export async function readCatalog(env) {
  const object = await env.MAPKAI_REVIEW_MEDIA.get(CATALOG_KEY);
  if (!object) return { items: [] };
  const data = await object.json();
  if (data.schemaVersion !== 'mapkai-private-video-catalog.v1' || data.visibility !== 'FOUNDER_ONLY' || !Array.isArray(data.items)) throw new Error('Invalid private catalog');
  return data;
}
export function safeItem(item) {
  if (!/^[a-zA-Z0-9_-]{1,180}$/.test(item?.id || '') || !/^\d{2}$/.test(item?.fieldId || '') || !/^[a-f0-9]{64}$/.test(item?.sha256 || '')) return false;
  return item.objectKey === `raw/${item.fieldId}/${item.id}/${item.sha256}.mp4` && Number.isSafeInteger(item.fileSize) && item.fileSize > 0;
}
// Explicit single byte-range support for seeking. An invalid/multiple range never fetches the full file.
export function parseRange(header, size) {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match || (!match[1] && !match[2])) throw new Error('Invalid range');
  const suffix = !match[1];
  const first = Number(match[1] || 0);
  const last = Number(match[2] || 0);
  if (![first, last].every(Number.isSafeInteger)) throw new Error('Invalid range');
  const start = suffix ? Math.max(0, size - last) : first;
  const end = suffix || !match[2] ? size - 1 : Math.min(last, size - 1);
  if (start < 0 || start >= size || end < start || (suffix && last === 0)) throw new Error('Unsatisfiable range');
  return { start, end, length: end - start + 1 };
}
