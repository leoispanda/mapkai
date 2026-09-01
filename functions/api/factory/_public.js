import { parseRange, safeItem } from './_media.js';
import { CANONICAL_MAJOR_FIELDS, CANONICAL_MAJOR_FIELD_IDS, isCanonicalMajorField } from './_major-fields.js';

// The public preview catalog is deliberately separate from the founder-only
// catalog. It contains the same content-addressed media references, but the
// public handlers only expose the learner-safe projection below.
export const PUBLIC_CATALOG_KEY = 'catalog/public-preview-v1.json';
export const PUBLIC_PREVIEW_DISCLOSURE = 'This AI-generated video is currently under content review. It is available as an experimental learning preview and has not yet been formally approved by MapKAI.';
export const PUBLIC_PREVIEW_LABEL = 'Video content under review · Not yet approved for formal publication';

export const PUBLIC_HEADERS = {
  'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
  'X-Content-Type-Options': 'nosniff',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Referrer-Policy': 'no-referrer',
};

export function responseJson(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...PUBLIC_HEADERS, 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });
}

export function slugifyFieldName(name) {
  return String(name || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function expectedSlug(fieldId) {
  return slugifyFieldName(CANONICAL_MAJOR_FIELDS[fieldId]);
}

export function isExpectedPublicField(item) {
  return Boolean(item && isCanonicalMajorField(item.fieldId, item.fieldName)
    && item.slug === expectedSlug(item.fieldId));
}

export function safePublicItem(item) {
  if (!isExpectedPublicField(item) || !safeItem(item)) return false;
  if (item.status !== 'HUMAN_REVIEW_PENDING'
    || item.publicationStatus !== 'NOT_PUBLISHED'
    || item.brandingStatus !== 'NOT_APPLIED'
    || item.publicPreviewStatus !== 'VIDEO_CONTENT_UNDER_REVIEW'
    || item.aiGenerated !== true) return false;
  if (typeof item.title !== 'string' || !item.title.trim() || item.title.length > 240) return false;
  if (!(item.videoDuration === 'UNKNOWN' || (Number.isFinite(item.videoDuration) && item.videoDuration > 0))) return false;
  if (typeof item.resolution !== 'string' || !/^\d+x\d+$/.test(item.resolution)) return false;
  return true;
}

export async function readPublicCatalog(env) {
  if (!env?.MAPKAI_REVIEW_MEDIA) throw new Error('Public preview storage is not configured');
  const object = await env.MAPKAI_REVIEW_MEDIA.get(PUBLIC_CATALOG_KEY);
  if (!object) throw new Error('Public preview catalog is missing');
  const data = await object.json();
  if (data?.schemaVersion !== 'mapkai-public-preview-catalog.v1'
    || data.visibility !== 'PUBLIC_PREVIEW'
    || !Array.isArray(data.items)
    || data.items.length > CANONICAL_MAJOR_FIELD_IDS.length
    || !data.items.every(safePublicItem)) throw new Error('Invalid public preview catalog');
  const ids = new Set(data.items.map(item => item.fieldId));
  const slugs = new Set(data.items.map(item => item.slug));
  if (ids.size !== data.items.length || slugs.size !== data.items.length) {
    throw new Error('Public preview catalog contains duplicate field identities');
  }
  return data;
}

export function publicItemProjection(item) {
  return {
    slug: item.slug,
    fieldName: item.fieldName,
    title: item.title,
    duration: item.videoDuration === 'UNKNOWN' ? null : item.videoDuration,
    resolution: item.resolution,
    videoUrl: `/api/factory/public-video?field=${encodeURIComponent(item.slug)}`,
    reviewLabel: PUBLIC_PREVIEW_LABEL,
    disclosure: PUBLIC_PREVIEW_DISCLOSURE,
  };
}

export function getPublicItemBySlug(catalog, slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(slug || ''))) return null;
  return catalog.items.find(item => item.slug === slug) || null;
}

export function publicRange(header, size) {
  return parseRange(header, size);
}
