import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { Worker } from 'node:worker_threads';
import { onRequest as votes } from '../functions/api/music/votes.js';
import { ensureVoteSchema, INSERT_VOTE_SQL, MAX_VOTE_TOTALS, VOTE_SCHEMA_SQL } from '../functions/api/music/_votes-shared.js';
import { AUDIO_TYPES, audioKey, metadataKey, TRACK_SCHEMA } from '../functions/api/music/_shared.js';
import { COST_GUARD_SCHEMA_SQL } from '../functions/_shared/cost-guard.js';

const songA = '11111111-1111-4111-8111-111111111111';
const songB = '22222222-2222-4222-8222-222222222222';
const origin = 'https://www.mapkai.com';

// This adapter executes the production SQL in SQLite itself. It deliberately
// does not interpret SQL or manufacture aggregate/idempotency responses.
function sqliteBinding(sqlite = new DatabaseSync(':memory:')) {
  const seen = [];
  function prepare(sql) {
    const statement = { sql, values: [], bind(...values) { return { ...statement, values }; },
      async run() { seen.push({ sql, values: this.values }); return { success: true, meta: sqlite.prepare(sql).run(...this.values) }; },
      async first() { seen.push({ sql, values: this.values }); return sqlite.prepare(sql).get(...this.values) ?? null; },
      async all() { seen.push({ sql, values: this.values }); return { success: true, results: sqlite.prepare(sql).all(...this.values) }; },
    };
    return statement;
  }
  return { sqlite, seen, prepare, async batch(statements) {
    sqlite.exec('BEGIN IMMEDIATE');
    try {
      const result = statements.map(({ sql, values }) => {
        seen.push({ sql, values });
        const statement = sqlite.prepare(sql);
        return { success: true, results: statement.columns().length ? statement.all(...values) : (statement.run(...values), []) };
      });
      sqlite.exec('COMMIT');
      return result;
    } catch (error) { sqlite.exec('ROLLBACK'); throw error; }
  } };
}

function fixture() {
  const db = sqliteBinding();
  const cost = sqliteBinding();
  cost.sqlite.exec(COST_GUARD_SCHEMA_SQL);
  const metadata = new Map();
  const r2Calls = [];
  const bucket = { async get(key) {
    r2Calls.push(key);
    const bytes = metadata.get(key);
    return bytes ? { size: bytes.byteLength, async json() { return JSON.parse(new TextDecoder().decode(bytes)); } } : null;
  } };
  const env = { MAPKAI_DB: db, CLOUDFLARE_COST_DB: cost, MAPKAI_REVIEW_MEDIA: bucket };
  function install(id = songA, changes = {}) {
    const data = { schemaVersion: TRACK_SCHEMA, visibility: 'PUBLIC', id, language: 'en', title: '001 Sample - MapKAI - Learning - Curiosity',
      description: '', filename: 'original.mp3', lyrics: 'Original complete lyrics.', createdAt: '2026-10-14T00:00:00.000Z',
      extension: 'mp3', contentType: AUDIO_TYPES.mp3, fileSize: 834, objectKey: audioKey(id, 'mp3'), audioEtag: 'a'.repeat(32), ...changes };
    metadata.set(metadataKey(id), new TextEncoder().encode(JSON.stringify(data)));
    return data;
  }
  install(); install(songB);
  return { db, cost, env, metadata, r2Calls, install, close() { db.sqlite.close(); cost.sqlite.close(); } };
}

function post(body = { id: songA, reaction: 'like', requestId: randomUUID() }, extra = {}) {
  return new Request(`${origin}/api/music/votes`, { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body),
    headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.7', ...extra } });
}

async function send(env, body, headers) { return votes({ request: post(body, headers), env }); }
async function totals(env) { return votes({ request: new Request(`${origin}/api/music/votes`), env }); }
const plain = value => JSON.parse(JSON.stringify(value));

test('separate clicks accumulate shared positive and negative counts without mutating song objects', async t => {
  const f = fixture(); t.after(() => f.close());
  const originals = new Map([...f.metadata].map(([id, bytes]) => [id, createHash('sha256').update(bytes).digest('hex')]));
  const empty = await totals(f.env);
  assert.equal(empty.status, 200); assert.equal(empty.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(await empty.json(), { totals: [] });
  assert.equal(f.r2Calls.length, 0);
  for (const [reaction, expected] of [['like', [1, 0, 1]], ['like', [2, 0, 2]], ['dislike', [2, 1, 1]]]) {
    const requestId = randomUUID();
    const response = await send(f.env, { id: songA, reaction, requestId });
    assert.equal(response.status, 200); assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.deepEqual(await response.json(), { total: { id: songA, likes: expected[0], dislikes: expected[1], score: expected[2] }, requestId, duplicate: false });
  }
  const fromOtherBrowser = await totals(f.env);
  assert.deepEqual(await fromOtherBrowser.json(), { totals: [{ id: songA, likes: 2, dislikes: 1, score: 1 }] });
  assert.deepEqual(f.r2Calls, Array(3).fill(metadataKey(songA)));
  for (const [key, sha] of originals) assert.equal(createHash('sha256').update(f.metadata.get(key)).digest('hex'), sha);
  const rateKeys = f.db.sqlite.prepare('SELECT rate_key FROM rate_limits').all();
  assert.equal(rateKeys.length, 1); assert.match(rateKeys[0].rate_key, /^music-vote:[a-f0-9]{64}$/);
  assert.equal(rateKeys[0].rate_key.includes('192.0.2.7'), false);
});

test('durable request keys deduplicate retries and reject changed reaction or track', async t => {
  const f = fixture(); t.after(() => f.close());
  const requestId = randomUUID();
  const body = { id: songA, reaction: 'like', requestId };
  assert.equal((await send(f.env, body)).status, 200);
  const duplicate = await send(f.env, body);
  assert.equal(duplicate.status, 200);
  assert.deepEqual(await duplicate.json(), { total: { id: songA, likes: 1, dislikes: 0, score: 1 }, requestId, duplicate: true });
  assert.equal((await send(f.env, { ...body, reaction: 'dislike' })).status, 409);
  assert.equal((await send(f.env, { ...body, id: songB })).status, 409);
  // A new binding object/reinitialization still reads persisted request keys.
  const restartedEnv = { ...f.env, MAPKAI_DB: sqliteBinding(f.db.sqlite) };
  assert.equal((await (await send(restartedEnv, body)).json()).duplicate, true);
  assert.equal(f.db.sqlite.prepare('SELECT COUNT(*) AS n FROM music_vote_events').get().n, 1);
  assert.deepEqual(await (await totals(f.env)).json(), { totals: [{ id: songA, likes: 1, dislikes: 0, score: 1 }] });
});

test('invalid input, origin, unsupported methods and missing bindings fail closed before R2', async t => {
  const f = fixture(); t.after(() => f.close());
  const valid = { id: songA, reaction: 'like', requestId: randomUUID() };
  for (const body of [null, [], {}, { ...valid, id: '../audio' }, { ...valid, id: 'AAAAAAAA-1111-4111-8111-111111111111' },
    { ...valid, requestId: '11111111-1111-1111-8111-111111111111' }, { ...valid, reaction: 'clear' },
    { ...valid, likes: 100 }, '{broken']) {
    assert.equal((await send(f.env, body)).status, 400);
  }
  assert.equal((await send(f.env, valid, { Origin: 'https://elsewhere.example' })).status, 403);
  assert.equal((await send(f.env, valid, { Origin: '' })).status, 403);
  assert.equal((await send(f.env, valid, { 'Sec-Fetch-Site': 'cross-site' })).status, 403);
  assert.equal((await send(f.env, valid, { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await send(f.env, 'x'.repeat(1025))).status, 413);
  const unsupported = await votes({ request: new Request(`${origin}/api/music/votes`, { method: 'DELETE' }), env: f.env });
  assert.equal(unsupported.status, 405); assert.equal(unsupported.headers.get('Allow'), 'GET, POST');
  assert.equal((await send({ ...f.env, MAPKAI_DB: undefined }, valid)).status, 503);
  assert.equal((await totals({ ...f.env, MAPKAI_DB: undefined })).status, 503);
  assert.deepEqual(f.r2Calls, []);
  const invalidUtf8 = new Request(`${origin}/api/music/votes`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: new Uint8Array([0xc3, 0x28]) });
  assert.equal((await votes({ request: invalidUtf8, env: f.env })).status, 400);
});

test('unknown, archived and malformed songs cannot receive votes; cost protection is retained', async t => {
  const f = fixture(); t.after(() => f.close());
  for (const kind of ['missing', 'archived', 'bad-fields', 'bad-json']) {
    if (kind === 'missing') f.metadata.delete(metadataKey(songA));
    else if (kind === 'archived') f.install(songA, { visibility: 'ARCHIVED' });
    else if (kind === 'bad-fields') f.install(songA, { objectKey: 'elsewhere' });
    else f.metadata.set(metadataKey(songA), new TextEncoder().encode('{'));
    assert.equal((await send(f.env, { id: songA, reaction: 'like', requestId: randomUUID() })).status, 404, kind);
  }
  const absent = f.db.sqlite.prepare("SELECT name FROM sqlite_master WHERE name = 'music_vote_events'").get();
  assert.equal(absent, undefined);
  f.install();
  assert.equal((await send({ ...f.env, CLOUDFLARE_COST_DB: undefined }, { id: songA, reaction: 'like', requestId: randomUUID() })).status, 503);
  assert.equal(f.r2Calls.length, 4);
});

test('61st valid request is rate-limited with no metadata read or vote write', async t => {
  const f = fixture(); t.after(() => f.close());
  for (let i = 0; i < 60; i++) assert.equal((await send(f.env, { id: songA, reaction: 'like', requestId: randomUUID() })).status, 200);
  const limited = await send(f.env, { id: songA, reaction: 'dislike', requestId: randomUUID() });
  assert.equal(limited.status, 429); assert.ok(Number(limited.headers.get('Retry-After')) >= 1);
  assert.equal(f.r2Calls.length, 60);
  assert.deepEqual(await (await totals(f.env)).json(), { totals: [{ id: songA, likes: 60, dislikes: 0, score: 60 }] });
});

test('native SQLite statement failure rolls back both event and trigger aggregate', async t => {
  const db = sqliteBinding(); t.after(() => db.sqlite.close());
  await ensureVoteSchema(db);
  db.sqlite.prepare('INSERT INTO music_vote_totals (track_id, likes, dislikes) VALUES (?, ?, ?)').run(songA, Number.MAX_SAFE_INTEGER, 0);
  const requestId = randomUUID();
  await assert.rejects(db.batch([db.prepare(INSERT_VOTE_SQL).bind(requestId, songA, 'like', Date.now())]), /CHECK constraint/);
  assert.equal(db.sqlite.prepare('SELECT COUNT(*) AS n FROM music_vote_events').get().n, 0);
  assert.equal(db.sqlite.prepare('SELECT likes FROM music_vote_totals').get().likes, Number.MAX_SAFE_INTEGER);
});

test('private exact-event cleanup decrements only that event and preserves unrelated votes', async t => {
  const db = sqliteBinding(); t.after(() => db.sqlite.close());
  await ensureVoteSchema(db);
  const ids = Array.from({ length: 3 }, () => randomUUID());
  for (const [i, requestId] of ids.entries()) await db.prepare(INSERT_VOTE_SQL).bind(requestId, i === 2 ? songB : songA, i === 1 ? 'dislike' : 'like', Date.now()).all();
  const beforeOther = plain(db.sqlite.prepare('SELECT * FROM music_vote_totals WHERE track_id = ?').get(songB));
  db.sqlite.prepare('DELETE FROM music_vote_events WHERE request_id = ? AND track_id = ? AND reaction = ?').run(ids[0], songA, 'like');
  assert.deepEqual(plain(db.sqlite.prepare('SELECT * FROM music_vote_totals WHERE track_id = ?').get(songA)), { track_id: songA, likes: 0, dislikes: 1 });
  assert.deepEqual(plain(db.sqlite.prepare('SELECT * FROM music_vote_totals WHERE track_id = ?').get(songB)), beforeOther);
  assert.throws(() => db.sqlite.prepare('UPDATE music_vote_events SET reaction = ? WHERE request_id = ?').run('like', ids[1]), /immutable/);
  db.sqlite.prepare('DELETE FROM music_vote_events WHERE request_id = ? AND track_id = ? AND reaction = ?').run(ids[1], songA, 'dislike');
  assert.equal(db.sqlite.prepare('SELECT * FROM music_vote_totals WHERE track_id = ?').get(songA), undefined);
  assert.equal(db.sqlite.prepare('SELECT COUNT(*) AS n FROM music_vote_events').get().n, 1);
});

test('shared database concurrent connections never lose increments or count duplicate keys twice', async t => {
  const directory = mkdtempSync(path.join(tmpdir(), 'mapkai-music-votes-'));
  const filename = path.join(directory, 'votes.sqlite');
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const sqlite = new DatabaseSync(filename);
  sqlite.exec('PRAGMA journal_mode = WAL');
  const db = sqliteBinding(sqlite);
  await ensureVoteSchema(db);
  const start = new SharedArrayBuffer(4);
  const workers = Array.from({ length: 4 }, (_, worker) => new Worker(`
    const { parentPort, workerData } = require('node:worker_threads');
    const { DatabaseSync } = require('node:sqlite');
    const { randomUUID } = require('node:crypto');
    const db = new DatabaseSync(workerData.filename);
    db.exec('PRAGMA busy_timeout = 10000');
    const insert = db.prepare(workerData.sql);
    parentPort.postMessage('ready');
    Atomics.wait(new Int32Array(workerData.start), 0, 0);
    for (let i = 0; i < 40; i++) {
      const reaction = (i + workerData.worker) % 3 === 0 ? 'dislike' : 'like';
      const id = randomUUID();
      insert.get(id, workerData.song, reaction, Date.now());
      insert.get(id, workerData.song, reaction, Date.now());
      insert.get(workerData.commonRequest, workerData.song, 'like', Date.now());
    }
    db.close();
    parentPort.postMessage('done');
  `, { eval: true, workerData: { filename, sql: INSERT_VOTE_SQL, song: songA, worker, start, commonRequest: '33333333-3333-4333-8333-333333333333' } }));
  let ready = 0;
  const finished = workers.map(worker => new Promise((resolve, reject) => {
    worker.on('message', message => {
      if (message === 'ready' && ++ready === workers.length) { Atomics.store(new Int32Array(start), 0, 1); Atomics.notify(new Int32Array(start), 0); }
    });
    worker.once('error', reject);
    worker.once('exit', code => code === 0 ? resolve() : reject(new Error(`SQLite worker exited ${code}`)));
  }));
  await Promise.all(finished);
  const expectedDislikes = Array.from({ length: 4 }, (_, worker) => Array.from({ length: 40 }, (_, i) => (i + worker) % 3 === 0 ? 1 : 0).reduce((sum, n) => sum + n, 0)).reduce((sum, n) => sum + n, 0);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM music_vote_events').get().n, 161);
  assert.deepEqual(plain(sqlite.prepare('SELECT * FROM music_vote_totals').get()), { track_id: songA, likes: 161 - expectedDislikes, dislikes: expectedDislikes });
  sqlite.close();
});

test('summary refuses oversized or corrupt results instead of returning misleading totals', async t => {
  const f = fixture(); t.after(() => f.close());
  await ensureVoteSchema(f.db);
  const insert = f.db.sqlite.prepare('INSERT INTO music_vote_totals (track_id, likes, dislikes) VALUES (?, 1, 0)');
  for (let i = 0; i <= MAX_VOTE_TOTALS; i++) insert.run(`${i.toString(16).padStart(8, '0')}-1111-4111-8111-111111111111`);
  assert.equal((await totals(f.env)).status, 503);
  f.db.sqlite.exec('DELETE FROM music_vote_totals');
  insert.run('malformed-id');
  const corrupt = await totals(f.env);
  assert.equal(corrupt.status, 503);
  assert.deepEqual(await corrupt.json(), { error: 'Song voting is temporarily unavailable. Please try again later.' });
});
