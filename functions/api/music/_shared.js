import { wrapR2Bucket, costResponse } from '../../_shared/cost-guard.js';
import { hasValidFounderAccessCookie } from '../pdc/_shared.js';

export const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
export const TRACK_PREFIX = 'music/tracks/';
export const TRACK_SCHEMA = 'mapkai-music-track.v1';
export const TRACK_ID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
export const AUDIO_TYPES = Object.freeze({ mp3: 'audio/mpeg', m4a: 'audio/mp4', wav: 'audio/wav' });
export const RESPONSE_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Referrer-Policy': 'no-referrer',
};

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status,
    headers: { ...RESPONSE_HEADERS, 'Content-Type': 'application/json; charset=utf-8', ...headers } });
}

export function inputError(message, status = 400) {
  return Object.assign(new Error(message), { musicInputError: true, status });
}

export function errorResponse(error, message = 'Music is temporarily unavailable. Please try again later.') {
  return costResponse(error) || json({ error: error?.musicInputError ? error.message : message }, error?.musicInputError ? error.status : 503);
}

export function uploadConfigured(env) {
  return Boolean(env?.MAPKAI_REVIEW_MEDIA && typeof env?.CLOUDFLARE_COST_DB?.prepare === 'function');
}

export function musicBucket(env) {
  return wrapR2Bucket(env?.MAPKAI_REVIEW_MEDIA, env);
}

// Require the browser's same-origin proof before processing authenticated writes.
// A cookie alone must not authorize a cross-site form submission.
export function requireSameOrigin(request) {
  let origin;
  try { origin = new URL(request.headers.get('Origin') || '').origin; } catch {}
  if (!origin || origin !== new URL(request.url).origin || request.headers.get('Sec-Fetch-Site') === 'cross-site') {
    throw inputError('Open MapKAI Music to make this change.', 403);
  }
}

export async function requireOwner(request, env) {
  if (!await hasValidFounderAccessCookie(request, env)) throw inputError('Owner sign-in required.', 401);
  requireSameOrigin(request);
  if (!uploadConfigured(env)) throw inputError('Music uploads are temporarily unavailable.', 503);
}

// Bound the actual body as well as Content-Length; chunked requests cannot
// bypass the limit or allocate arbitrary amounts of Worker memory.
export async function readBoundedBody(request, maximum) {
  const suppliedLength = request.headers.get('Content-Length');
  if (suppliedLength !== null && (!/^\d+$/.test(suppliedLength) || Number(suppliedLength) > maximum)) {
    await request.body?.cancel().catch(() => {});
    throw inputError('This upload is too large.', 413);
  }
  const chunks = [];
  let size = 0;
  if (request.body) {
    const reader = request.body.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > maximum) {
          await reader.cancel().catch(() => {});
          throw inputError('This upload is too large.', 413);
        }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return bytes;
}

export const metadataKey = id => `${TRACK_PREFIX}${id}.json`;
export const audioKey = (id, extension) => `music/audio/${id}.${extension}`;

export function safeTrack(track) {
  if (track?.schemaVersion !== TRACK_SCHEMA || track.visibility !== 'PUBLIC' || track.language !== 'en' || !TRACK_ID_PATTERN.test(track.id || '')) return false;
  if (!Object.hasOwn(AUDIO_TYPES, track.extension) || track.contentType !== AUDIO_TYPES[track.extension]
    || track.objectKey !== audioKey(track.id, track.extension)) return false;
  if (!Number.isSafeInteger(track.fileSize) || track.fileSize < 1 || track.fileSize > MAX_AUDIO_BYTES) return false;
  if (typeof track.audioEtag !== 'string' || !/^[a-fA-F0-9-]{1,160}$/.test(track.audioEtag)) return false;
  if (typeof track.title !== 'string' || !track.title.trim() || track.title.length > 120
    || typeof track.description !== 'string' || track.description.length > 1000
    || typeof track.filename !== 'string' || track.filename.length > 160) return false;
  if ([track.title, track.description, track.filename].some(value => /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value))) return false;
  return typeof track.createdAt === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(track.createdAt)
    && Number.isFinite(Date.parse(track.createdAt));
}

export function publicTrack(track) {
  return { id: track.id, title: track.title, description: track.description, language: track.language,
    url: `/api/music/audio?id=${encodeURIComponent(track.id)}`, durationSeconds: null,
    createdAt: track.createdAt, filename: track.filename };
}

export async function readTrack(bucket, id) {
  if (!TRACK_ID_PATTERN.test(id || '')) return null;
  const object = await bucket.get(metadataKey(id));
  if (!object) return null;
  if (!Number.isSafeInteger(object.size) || object.size > 16 * 1024) throw new Error('Invalid stored track.');
  const track = await object.json();
  if (track?.language !== 'en') return null;
  if (!safeTrack(track) || track.id !== id) throw new Error('Invalid stored track.');
  return track;
}
