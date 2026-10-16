import { wrapR2Bucket, costResponse } from '../../_shared/cost-guard.js';
import { hasValidFounderAccessCookie } from '../pdc/_shared.js';

export const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
export const MAX_LYRICS_CHARS = 12000;
export const MAX_LYRICS_TIMING_CUES = 600;
export const MAX_LYRICS_TIMING_SECONDS = 7200;
// UTF-8 lyrics can use three bytes per JavaScript character; reserve space for
// their complete metadata and multipart text without raising the audio limit.
export const MAX_TRACK_METADATA_BYTES = 64 * 1024;
export const MAX_MUSIC_UPLOAD_BYTES = MAX_AUDIO_BYTES + 64 * 1024;
export const TRACK_PREFIX = 'music/tracks/';
export const TRACK_SCHEMA = 'mapkai-music-track.v1';
export const TRACK_ID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
export const AUDIO_TYPES = Object.freeze({ mp3: 'audio/mpeg', m4a: 'audio/mp4', wav: 'audio/wav' });
export const SONG_LANGUAGES = Object.freeze(['en', 'nl', 'zh']);
export const GENERATION_PROVIDER = 'ElevenLabs';
export const RESPONSE_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Referrer-Policy': 'no-referrer',
};
// Timing is public only after readTrack verifies the exact normalized lyrics.
// A raw metadata object cannot bypass the asynchronous content-hash check.
const verifiedLyricsTiming = new WeakMap();

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status,
    headers: { ...RESPONSE_HEADERS, 'Content-Type': 'application/json; charset=utf-8', ...headers } });
}

export function inputError(message, status = 400) {
  return Object.assign(new Error(message), { musicInputError: true, status });
}

export function normalizeLyrics(value) {
  if (typeof value !== 'string') throw inputError('Lyrics must be plain text.');
  if (/[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f-\u009f]/.test(value)) throw inputError('Lyrics contain unsupported control characters.');
  const lyrics = value.replace(/\r\n?/g, '\n').trim();
  if (lyrics.length > MAX_LYRICS_CHARS) throw inputError('Lyrics can have up to 12,000 characters.');
  return lyrics;
}

export function normalizeLyricsTiming(lyrics, value) {
  const lines = normalizeLyrics(lyrics).split('\n');
  const sungLines = lines.flatMap((line, index) => {
    const text = line.trim();
    return text && !/^\[[^\[\]\n]+\]$/.test(text) ? [index] : [];
  });
  if (!Array.isArray(value) || value.length > MAX_LYRICS_TIMING_CUES || value.length !== sungLines.length) {
    throw inputError('Lyrics timing must cover every sung line, with up to 600 cues.');
  }
  let previousEnd = 0;
  return Array.from(value, (cue, index) => {
    if (!cue || typeof cue !== 'object' || Array.isArray(cue)
      || Object.keys(cue).length !== 3 || !['line', 'start', 'end'].every(key => Object.hasOwn(cue, key))
      || !Number.isSafeInteger(cue.line) || cue.line !== sungLines[index]
      || !Number.isFinite(cue.start) || !Number.isFinite(cue.end)
      || cue.start < 0 || cue.end <= cue.start || cue.end > MAX_LYRICS_TIMING_SECONDS || cue.start < previousEnd) {
      throw inputError('Lyrics timing must use ordered, nonoverlapping sung-line cues between 0 and 7,200 seconds.');
    }
    previousEnd = cue.end;
    return { line: cue.line, start: cue.start, end: cue.end };
  });
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
  if (track?.schemaVersion !== TRACK_SCHEMA || track.visibility !== 'PUBLIC' || !SONG_LANGUAGES.includes(track.language) || !TRACK_ID_PATTERN.test(track.id || '')) return false;
  // Older tracks remain playable without inferred provenance. Once disclosed,
  // the AI flag and provider must be a complete, validated pair.
  if ((Object.hasOwn(track, 'aiGenerated') || Object.hasOwn(track, 'generationProvider'))
    && (track.aiGenerated !== true || track.generationProvider !== GENERATION_PROVIDER)) return false;
  if (Object.hasOwn(track, 'lyrics')) {
    try { normalizeLyrics(track.lyrics); } catch { return false; }
  }
  // Optional timing is enhancement metadata. Invalid or stale timestamps must
  // not prevent the song's validated audio and plain lyrics from being read.
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
  const aiGenerated = track.aiGenerated === true && track.generationProvider === GENERATION_PROVIDER;
  const lyrics = normalizeLyrics(Object.hasOwn(track, 'lyrics') ? track.lyrics : '');
  const verified = verifiedLyricsTiming.get(track);
  const lyricsTiming = verified && verified.lyrics === lyrics && verified.cues === track.lyricsTiming
    && verified.sha256 === track.lyricsTimingSha256 ? verified.cues.map(cue => ({ ...cue })) : [];
  // A trusted private import declares the measured tempo for this recording.
  // Reads validate that declaration, without measuring audio or inferring tempo
  // from a generation request. Invalid optional metadata only hides the label.
  const tempo = track.tempo;
  const tempoBpm = tempo && typeof tempo === 'object' && !Array.isArray(tempo)
    && Number.isFinite(tempo.bpm) && tempo.bpm >= 20 && tempo.bpm <= 300 && tempo.status === 'verified'
    && typeof tempo.audioEtag === 'string' && /^[a-fA-F0-9-]{1,160}$/.test(tempo.audioEtag)
    && tempo.audioEtag === track.audioEtag ? tempo.bpm : null;
  return { id: track.id, title: track.title, description: track.description, language: track.language,
    lyrics, lyricsTiming, tempoBpm,
    aiGenerated: aiGenerated ? true : null, generationProvider: aiGenerated ? GENERATION_PROVIDER : null,
    url: `/api/music/audio?id=${encodeURIComponent(track.id)}`, durationSeconds: null,
    createdAt: track.createdAt, filename: track.filename };
}

export async function readTrack(bucket, id) {
  if (!TRACK_ID_PATTERN.test(id || '')) return null;
  const object = await bucket.get(metadataKey(id));
  if (!object) return null;
  if (!Number.isSafeInteger(object.size) || object.size > MAX_TRACK_METADATA_BYTES) throw new Error('Invalid stored track.');
  const track = await object.json();
  // Archiving preserves the song and its audio, but removes public discovery
  // and playback. Validate the same complete base record before hiding it.
  if (track?.visibility === 'ARCHIVED') {
    if (track.id !== id || !safeTrack({ ...track, visibility: 'PUBLIC' })) throw new Error('Invalid stored track.');
    return null;
  }
  if (!SONG_LANGUAGES.includes(track?.language)) return null;
  if (!safeTrack(track) || track.id !== id) throw new Error('Invalid stored track.');
  const readable = { ...track, lyricsTiming: [] };
  delete readable.lyricsTimingSha256;
  if (Object.hasOwn(track, 'lyricsTiming') && typeof track.lyricsTimingSha256 === 'string'
    && /^[a-f0-9]{64}$/.test(track.lyricsTimingSha256)) {
    try {
      const lyrics = normalizeLyrics(Object.hasOwn(track, 'lyrics') ? track.lyrics : '');
      const cues = normalizeLyricsTiming(lyrics, track.lyricsTiming);
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(lyrics));
      const sha256 = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
      if (sha256 === track.lyricsTimingSha256) {
        readable.lyricsTiming = Object.freeze(cues.map(cue => Object.freeze(cue)));
        readable.lyricsTimingSha256 = sha256;
        verifiedLyricsTiming.set(readable, { lyrics, cues: readable.lyricsTiming, sha256 });
      }
    } catch { /* Invalid timing or unavailable hashing falls back to plain lyrics. */ }
  }
  return readable;
}
