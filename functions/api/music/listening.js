import { checkRateLimit, getClientIp } from '../_shared/rate-limit.js';
import { errorResponse, inputError, json, musicBucket, readBoundedBody, readTrack, requireSameOrigin } from './_shared.js';
import { ensureListeningSchema, listeningDatabase, MAX_TOTALS, parseListening, publicListeningTotal,
  READ_SESSION, READ_TOTAL, READ_TOTALS, SAVE_SESSION } from './_listening-shared.js';

export async function onRequest({ request, env = {} }) {
  if (!['GET', 'POST'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' });
  try {
    if (request.method === 'POST') requireSameOrigin(request);
    const db = listeningDatabase(env);
    if (request.method === 'GET') {
      await ensureListeningSchema(db);
      const result = await db.prepare(READ_TOTALS).all();
      if (result?.success === false || !Array.isArray(result?.results) || result.results.length > MAX_TOTALS) throw new Error('Listening totals unavailable.');
      return json({ totals: result.results.map(publicListeningTotal) });
    }
    if (!/^application\/json(?:\s*;|\s*$)/i.test(request.headers.get('Content-Type') || '')) throw inputError('Submit JSON.', 415);
    let body;
    try { body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(await readBoundedBody(request, 1024))); }
    catch (error) { if (error?.musicInputError) throw error; throw inputError('Invalid listening event.'); }
    const event = parseListening(body);
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(getClientIp(request)));
    const ipHash = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
    const limit = await checkRateLimit(db, `music-listening:${ipHash}`, { limit: 120, windowSeconds: 60 });
    if (!limit.ok) return json({ error: 'Please try again later.' }, 429, { 'Retry-After': String(limit.retryAfter) });
    await ensureListeningSchema(db);
    const existing = await db.prepare(READ_SESSION).bind(event.sessionId).first();
    if (existing && (existing.track_id !== event.id || existing.duration_ms !== event.durationMs)) throw inputError('Playback session conflict.', 409);
    // Validate new public identities once. Progress checkpoints incur no R2 read.
    if (!existing) {
      let track;
      try { track = await readTrack(musicBucket(env), event.id); }
      catch (error) {
        if (error instanceof SyntaxError || error?.message === 'Invalid stored track.') throw inputError('Song not found.', 404);
        throw error;
      }
      if (!track) throw inputError('Song not found.', 404);
    }
    const results = await db.batch([
      db.prepare(SAVE_SESSION).bind(event.sessionId, event.id, event.listenedMs, event.durationMs, Number(event.skipped), Date.now()),
      db.prepare(READ_SESSION).bind(event.sessionId), db.prepare(READ_TOTAL).bind(event.id),
    ]);
    if (results?.length !== 3 || results.some(result => result?.success === false || !Array.isArray(result?.results))) throw new Error('Listening update failed.');
    const saved = results[1].results[0];
    if (saved?.track_id !== event.id || saved?.duration_ms !== event.durationMs) throw inputError('Playback session conflict.', 409);
    return json({ total: publicListeningTotal(results[2].results[0]), sessionId: event.sessionId });
  } catch (error) { return errorResponse(error, 'Listening statistics are temporarily unavailable.'); }
}
