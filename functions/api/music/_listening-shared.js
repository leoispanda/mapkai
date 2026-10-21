import { inputError, TRACK_ID_PATTERN } from './_shared.js';

const ready = new WeakMap();
export const MAX_TOTALS = 5000;
const qualified = row => `${row}.listened_ms >= MIN(30000, ${row}.duration_ms / 2.0)`;
const completed = row => `${row}.listened_ms >= ${row}.duration_ms * 0.9`;
const skipped = row => `(${row}.skipped = 1 AND NOT (${completed(row)}))`;
const early = row => `(${skipped(row)} AND NOT (${qualified(row)}))`;
const fields = ['starts', 'listens', 'completions', 'skips', 'early_skips', 'listened_ms'];
const values = row => ['1', `(${qualified(row)})`, `(${completed(row)})`, skipped(row), early(row), `${row}.listened_ms`];

// One row per playback session; monotonic snapshots make retries and reordered
// network deliveries safe. Triggers apply only the delta to shared totals.
export const LISTENING_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS music_listening_sessions (
    session_id TEXT PRIMARY KEY NOT NULL, track_id TEXT NOT NULL,
    listened_ms INTEGER NOT NULL CHECK (listened_ms BETWEEN 0 AND 7200000),
    duration_ms INTEGER NOT NULL CHECK (duration_ms BETWEEN 1000 AND 7200000),
    skipped INTEGER NOT NULL CHECK (skipped IN (0, 1)),
    updated_at INTEGER NOT NULL, CHECK (listened_ms <= duration_ms)
  )`,
  `CREATE TABLE IF NOT EXISTS music_listening_totals (
    track_id TEXT PRIMARY KEY NOT NULL,
    ${fields.map(field => `${field} INTEGER NOT NULL DEFAULT 0 CHECK (${field} >= 0 AND ${field} <= 9007199254740991)`).join(',\n')}
  )`,
  `CREATE TRIGGER IF NOT EXISTS music_listening_insert AFTER INSERT ON music_listening_sessions BEGIN
    INSERT INTO music_listening_totals (track_id, ${fields.join(', ')})
    VALUES (NEW.track_id, ${values('NEW').join(', ')})
    ON CONFLICT(track_id) DO UPDATE SET ${fields.map(field => `${field} = ${field} + excluded.${field}`).join(', ')};
  END`,
  `CREATE TRIGGER IF NOT EXISTS music_listening_update AFTER UPDATE ON music_listening_sessions BEGIN
    UPDATE music_listening_totals SET ${fields.map((field, index) => `${field} = ${field} + (${values('NEW')[index]}) - (${values('OLD')[index]})`).join(', ')}
    WHERE track_id = NEW.track_id;
  END`,
];
export const READ_SESSION = 'SELECT session_id, track_id, duration_ms FROM music_listening_sessions WHERE session_id = ?1';
export const READ_TOTAL = 'SELECT * FROM music_listening_totals WHERE track_id = ?1';
export const READ_TOTALS = `SELECT * FROM music_listening_totals ORDER BY track_id LIMIT ${MAX_TOTALS + 1}`;
export const SAVE_SESSION = `INSERT INTO music_listening_sessions
  (session_id, track_id, listened_ms, duration_ms, skipped, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)
  ON CONFLICT(session_id) DO UPDATE SET
    listened_ms = MAX(listened_ms, excluded.listened_ms), skipped = MAX(skipped, excluded.skipped),
    updated_at = MAX(updated_at, excluded.updated_at)
  WHERE track_id = excluded.track_id AND duration_ms = excluded.duration_ms`;

export function listeningDatabase(env) {
  const db = env?.MAPKAI_DB;
  if (!db?.prepare || !db?.batch) throw inputError('Listening statistics are temporarily unavailable.', 503);
  return db;
}
export async function ensureListeningSchema(db) {
  if (!ready.has(db)) ready.set(db, db.batch(LISTENING_SCHEMA.map(sql => db.prepare(sql))).then(results => {
    if (results?.length !== LISTENING_SCHEMA.length || results.some(result => result?.success === false)) throw new Error('Listening schema unavailable.');
  }).catch(error => { ready.delete(db); throw error; }));
  await ready.get(db);
}
export function parseListening(value) {
  if (!value || Array.isArray(value) || typeof value !== 'object' || Object.keys(value).length !== 5
    || !['id', 'sessionId', 'listenedMs', 'durationMs', 'skipped'].every(key => Object.hasOwn(value, key))
    || typeof value.id !== 'string' || !TRACK_ID_PATTERN.test(value.id)
    || typeof value.sessionId !== 'string' || !TRACK_ID_PATTERN.test(value.sessionId)
    || !Number.isSafeInteger(value.durationMs) || value.durationMs < 1000 || value.durationMs > 7200000
    || !Number.isSafeInteger(value.listenedMs) || value.listenedMs < 0 || value.listenedMs > value.durationMs
    || typeof value.skipped !== 'boolean') throw inputError('Invalid listening event.');
  return value;
}
export function publicListeningTotal(row) {
  if (!row || !TRACK_ID_PATTERN.test(row.track_id || '') || fields.some(field => !Number.isSafeInteger(row[field]) || row[field] < 0)
    || row.listens > row.starts || row.completions > row.listens || row.skips + row.completions > row.starts || row.early_skips > row.skips) {
    throw new Error('Invalid listening total.');
  }
  return { id: row.track_id, starts: row.starts, listens: row.listens, completions: row.completions,
    skips: row.skips, earlySkips: row.early_skips, listenedMs: row.listened_ms };
}
