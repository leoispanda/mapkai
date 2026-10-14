import { inputError, TRACK_ID_PATTERN } from './_shared.js';

export const MAX_VOTE_BODY_BYTES = 1024;
export const MAX_VOTE_TOTALS = 5000;
const schemaReady = new WeakMap();

// Event insertion and its aggregate update are one SQLite statement. Retaining
// the request key makes network retries safe without identifying a listener.
export const VOTE_SCHEMA_SQL = Object.freeze([
  `CREATE TABLE IF NOT EXISTS music_vote_totals (
    track_id TEXT PRIMARY KEY NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0 CHECK (typeof(likes) = 'integer' AND likes BETWEEN 0 AND 9007199254740991),
    dislikes INTEGER NOT NULL DEFAULT 0 CHECK (typeof(dislikes) = 'integer' AND dislikes BETWEEN 0 AND 9007199254740991)
  )`,
  `CREATE TABLE IF NOT EXISTS music_vote_events (
    request_id TEXT PRIMARY KEY NOT NULL,
    track_id TEXT NOT NULL,
    reaction TEXT NOT NULL CHECK (reaction IN ('like', 'dislike')),
    created_at INTEGER NOT NULL CHECK (typeof(created_at) = 'integer' AND created_at >= 0)
  )`,
  `CREATE TRIGGER IF NOT EXISTS music_vote_insert_total
  AFTER INSERT ON music_vote_events BEGIN
    INSERT INTO music_vote_totals (track_id, likes, dislikes)
    VALUES (NEW.track_id, CASE WHEN NEW.reaction = 'like' THEN 1 ELSE 0 END,
      CASE WHEN NEW.reaction = 'dislike' THEN 1 ELSE 0 END)
    ON CONFLICT(track_id) DO UPDATE SET
      likes = music_vote_totals.likes + excluded.likes,
      dislikes = music_vote_totals.dislikes + excluded.dislikes;
  END`,
  // This is for narrowly scoped private maintenance, not a public undo route.
  // Deleting an exact verification event reverses only that event's increment.
  `CREATE TRIGGER IF NOT EXISTS music_vote_delete_total
  AFTER DELETE ON music_vote_events BEGIN
    UPDATE music_vote_totals SET
      likes = likes - CASE WHEN OLD.reaction = 'like' THEN 1 ELSE 0 END,
      dislikes = dislikes - CASE WHEN OLD.reaction = 'dislike' THEN 1 ELSE 0 END
    WHERE track_id = OLD.track_id;
    DELETE FROM music_vote_totals WHERE track_id = OLD.track_id AND likes = 0 AND dislikes = 0;
  END`,
  `CREATE TRIGGER IF NOT EXISTS music_vote_events_immutable
  BEFORE UPDATE ON music_vote_events BEGIN
    SELECT RAISE(ABORT, 'Music vote events are immutable.');
  END`,
]);

export const INSERT_VOTE_SQL = `INSERT INTO music_vote_events (request_id, track_id, reaction, created_at)
  VALUES (?1, ?2, ?3, ?4) ON CONFLICT(request_id) DO NOTHING RETURNING request_id`;
export const READ_EVENT_SQL = `SELECT request_id, track_id, reaction FROM music_vote_events WHERE request_id = ?1`;
export const READ_TOTAL_SQL = `SELECT track_id, likes, dislikes FROM music_vote_totals WHERE track_id = ?1`;
export const READ_TOTALS_SQL = `SELECT track_id, likes, dislikes FROM music_vote_totals
  WHERE likes > 0 OR dislikes > 0 ORDER BY track_id LIMIT ${MAX_VOTE_TOTALS + 1}`;

export function voteDatabase(env) {
  const db = env?.MAPKAI_DB;
  if (!db || typeof db.prepare !== 'function' || typeof db.batch !== 'function') {
    throw inputError('Song voting is temporarily unavailable.', 503);
  }
  return db;
}

export async function ensureVoteSchema(db) {
  let ready = schemaReady.get(db);
  if (!ready) {
    ready = db.batch(VOTE_SCHEMA_SQL.map(sql => db.prepare(sql))).then(results => {
      if (!Array.isArray(results) || results.length !== VOTE_SCHEMA_SQL.length || results.some(result => result?.success === false)) {
        throw new Error('Music vote schema initialization failed.');
      }
    }).catch(error => { schemaReady.delete(db); throw error; });
    schemaReady.set(db, ready);
  }
  await ready;
}

export function parseVote(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || Object.keys(value).length !== 3 || !['id', 'reaction', 'requestId'].every(key => Object.hasOwn(value, key))
    || typeof value.id !== 'string' || !TRACK_ID_PATTERN.test(value.id)
    || typeof value.requestId !== 'string' || !TRACK_ID_PATTERN.test(value.requestId)
    || !['like', 'dislike'].includes(value.reaction)) {
    throw inputError('Choose a song and submit a valid like or dislike.');
  }
  return { id: value.id, reaction: value.reaction, requestId: value.requestId };
}

export function publicVoteTotal(row) {
  if (!row || typeof row.track_id !== 'string' || !TRACK_ID_PATTERN.test(row.track_id)
    || !Number.isSafeInteger(row.likes) || row.likes < 0 || !Number.isSafeInteger(row.dislikes) || row.dislikes < 0) {
    throw new Error('Invalid music vote total.');
  }
  return { id: row.track_id, likes: row.likes, dislikes: row.dislikes, score: row.likes - row.dislikes };
}
