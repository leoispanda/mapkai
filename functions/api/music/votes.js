import { checkRateLimit, getClientIp } from '../_shared/rate-limit.js';
import { errorResponse, inputError, json, musicBucket, readBoundedBody, readTrack, requireSameOrigin } from './_shared.js';
import { ensureVoteSchema, INSERT_VOTE_SQL, MAX_VOTE_BODY_BYTES, MAX_VOTE_TOTALS, parseVote,
  publicVoteTotal, READ_EVENT_SQL, READ_TOTAL_SQL, READ_TOTALS_SQL, voteDatabase } from './_votes-shared.js';

async function listTotals(env) {
  const db = voteDatabase(env);
  await ensureVoteSchema(db);
  const result = await db.prepare(READ_TOTALS_SQL).all();
  if (result?.success === false || !Array.isArray(result?.results) || result.results.length > MAX_VOTE_TOTALS) {
    throw new Error('Music vote totals are unavailable.');
  }
  return json({ totals: result.results.map(publicVoteTotal) });
}

async function addVote(request, env) {
  requireSameOrigin(request);
  if (!/^application\/json(?:\s*;|\s*$)/i.test(request.headers.get('Content-Type') || '')) {
    throw inputError('Submit the vote as JSON.', 415);
  }
  let body;
  try { body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(await readBoundedBody(request, MAX_VOTE_BODY_BYTES))); }
  catch (error) {
    if (error?.musicInputError) throw error;
    throw inputError('The song vote could not be read.');
  }
  const vote = parseVote(body);
  const db = voteDatabase(env);
  // Rate-limit keys store only a one-way digest, never the supplied IP itself.
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(getClientIp(request)));
  const ipHash = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  const limit = await checkRateLimit(db, `music-vote:${ipHash}`, { limit: 60, windowSeconds: 60 });
  if (!limit.ok) return json({ error: 'Too many song votes. Please try again shortly.' }, 429, { 'Retry-After': String(limit.retryAfter) });

  let track;
  try { track = await readTrack(musicBucket(env), vote.id); }
  catch (error) {
    // Broken stored JSON/base metadata is not a public voting target. Cost guard
    // exhaustion and service failures retain their original fail-closed errors.
    if (error instanceof SyntaxError || error?.message === 'Invalid stored track.') {
      throw inputError('Song not found.', 404);
    }
    throw error;
  }
  if (!track) throw inputError('Song not found.', 404);
  await ensureVoteSchema(db);

  // D1 batch executes transactionally on the primary. The insert trigger and
  // durable key prevent lost increments and double counts across concurrent
  // browser requests. Reads return the result of that same transaction.
  const results = await db.batch([
    db.prepare(INSERT_VOTE_SQL).bind(vote.requestId, vote.id, vote.reaction, Date.now()),
    db.prepare(READ_EVENT_SQL).bind(vote.requestId),
    db.prepare(READ_TOTAL_SQL).bind(vote.id),
  ]);
  if (!Array.isArray(results) || results.length !== 3 || results.some(result => result?.success === false)
    || results.some(result => !Array.isArray(result?.results))) throw new Error('Music vote did not complete.');
  const event = results[1].results[0];
  if (!event || event.request_id !== vote.requestId) throw new Error('Music vote did not complete.');
  if (event.track_id !== vote.id || event.reaction !== vote.reaction) {
    throw inputError('This vote request was already used for another choice.', 409);
  }
  const inserted = results[0].results;
  if (inserted.length > 1 || (inserted.length === 1 && inserted[0]?.request_id !== vote.requestId)) {
    throw new Error('Music vote did not complete.');
  }
  return json({ total: publicVoteTotal(results[2].results[0]), requestId: vote.requestId, duplicate: inserted.length === 0 });
}

export async function onRequest({ request, env = {} }) {
  if (!['GET', 'POST'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' });
  try { return request.method === 'GET' ? await listTotals(env) : await addVote(request, env); }
  catch (error) { return errorResponse(error, 'Song voting is temporarily unavailable. Please try again later.'); }
}
