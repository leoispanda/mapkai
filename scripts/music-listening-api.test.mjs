import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { onRequest } from '../functions/api/music/listening.js';
import { COST_GUARD_SCHEMA_SQL } from '../functions/_shared/cost-guard.js';
import { audioKey, metadataKey, TRACK_SCHEMA } from '../functions/api/music/_shared.js';

const id = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
const origin = 'https://www.mapkai.com';
function binding() {
  const sqlite = new DatabaseSync(':memory:');
  const prepare = sql => ({ sql, values: [], bind(...values) { return { ...this, values }; },
    async run() { return { success: true, meta: sqlite.prepare(sql).run(...this.values) }; },
    async first() { return sqlite.prepare(sql).get(...this.values) ?? null; },
    async all() { return { success: true, results: sqlite.prepare(sql).all(...this.values) }; },
  });
  return { sqlite, prepare, async batch(statements) {
    sqlite.exec('BEGIN IMMEDIATE');
    try {
      const results = statements.map(({ sql, values }) => {
        const statement = sqlite.prepare(sql);
        return { success: true, results: statement.columns().length ? statement.all(...values) : (statement.run(...values), []) };
      });
      sqlite.exec('COMMIT'); return results;
    } catch (error) { sqlite.exec('ROLLBACK'); throw error; }
  } };
}
function fixture(t) {
  const db = binding(), cost = binding(); cost.sqlite.exec(COST_GUARD_SCHEMA_SQL);
  const reads = [], metadata = new Map();
  for (const song of [id, other]) metadata.set(metadataKey(song), { schemaVersion: TRACK_SCHEMA, visibility: 'PUBLIC', id: song,
    language: 'en', title: '001 Sample', description: '', filename: 'original.mp3', lyrics: '', createdAt: '2026-10-21T00:00:00.000Z',
    extension: 'mp3', contentType: 'audio/mpeg', fileSize: 834, objectKey: audioKey(song, 'mp3'), audioEtag: 'a'.repeat(32) });
  const env = { MAPKAI_DB: db, CLOUDFLARE_COST_DB: cost, MAPKAI_REVIEW_MEDIA: { async get(key) {
    reads.push(key); const data = metadata.get(key); return data ? { size: JSON.stringify(data).length, async json() { return data; } } : null;
  } } };
  t.after(() => { db.sqlite.close(); cost.sqlite.close(); });
  return { db, cost, env, reads, metadata };
}
function post(value, headers = {}) {
  return new Request(`${origin}/api/music/listening`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', ...headers },
    body: typeof value === 'string' ? value : JSON.stringify(value) });
}
const event = changes => ({ id, sessionId: randomUUID(), listenedMs: 0, durationMs: 120000, skipped: false, ...changes });
const send = (f, value, headers) => onRequest({ request: post(value, headers), env: f.env });
const read = f => onRequest({ request: new Request(`${origin}/api/music/listening`), env: f.env });

test('shared sessions accumulate qualified listening, completion and explicit skip deltas only once', async t => {
  const f = fixture(t), first = event();
  assert.deepEqual(await (await read(f)).json(), { totals: [] });
  for (const listenedMs of [0, 12000, 30000, 30000, 5000, 108000, 120000]) {
    const response = await send(f, { ...first, listenedMs }); assert.equal(response.status, 200);
  }
  assert.equal(f.reads.length, 1, 'checkpoints reuse the validated public identity');
  const second = event({ listenedMs: 4000, skipped: true });
  assert.equal((await send(f, second)).status, 200);
  assert.equal((await send(f, second)).status, 200);
  const third = event({ listenedMs: 40000, skipped: true }); await send(f, third);
  const response = await read(f); assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(await response.json(), { totals: [{ id, starts: 3, listens: 2, completions: 1, skips: 2, earlySkips: 1, listenedMs: 164000 }] });
  assert.equal(f.db.sqlite.prepare('SELECT COUNT(*) AS n FROM music_listening_sessions').get().n, 3);
});

test('short-song thresholds and out-of-order final snapshots stay consistent', async t => {
  const f = fixture(t), body = event({ durationMs: 20000, listenedMs: 9999 });
  let data = await (await send(f, body)).json(); assert.equal(data.total.listens, 0);
  data = await (await send(f, { ...body, listenedMs: 10000 })).json(); assert.equal(data.total.listens, 1);
  await send(f, { ...body, listenedMs: 11000, skipped: true });
  data = await (await send(f, { ...body, listenedMs: 18000 })).json();
  assert.equal(data.total.completions, 1); assert.equal(data.total.skips, 0); assert.equal(data.total.starts, 1);
  await send(f, { ...body, listenedMs: 1000, skipped: true });
  data = await (await read(f)).json(); assert.equal(data.totals[0].completions, 1); assert.equal(data.totals[0].skips, 0);
});

test('session identity cannot migrate to another song or duration', async t => {
  const f = fixture(t), body = event(); await send(f, body);
  assert.equal((await send(f, { ...body, id: other })).status, 409);
  assert.equal((await send(f, { ...body, durationMs: 100000 })).status, 409);
  assert.equal(f.reads.length, 1);
  assert.equal((await (await read(f)).json()).totals[0].starts, 1);
});

test('simultaneous starts and duplicate progress share one atomic session total', async t => {
  const f = fixture(t), body = event({ listenedMs: 40000 });
  const responses = await Promise.all(Array.from({ length: 12 }, () => send(f, body)));
  assert(responses.every(response => response.status === 200));
  let total = (await (await read(f)).json()).totals[0];
  assert.equal(total.starts, 1); assert.equal(total.listens, 1); assert.equal(total.listenedMs, 40000);
  await Promise.all([108000, 50000, 120000, 30000].map(listenedMs => send(f, { ...body, listenedMs })));
  total = (await (await read(f)).json()).totals[0];
  assert.equal(total.starts, 1); assert.equal(total.completions, 1); assert.equal(total.listenedMs, 120000);
});

test('bounded input, same-origin proof and missing dependencies fail closed', async t => {
  const f = fixture(t), body = event();
  for (const value of [null, [], {}, { ...body, id: '../file' }, { ...body, sessionId: 'bad' }, { ...body, listenedMs: -1 },
    { ...body, listenedMs: 120001 }, { ...body, listenedMs: 0.1 }, { ...body, durationMs: 0 }, { ...body, durationMs: 7200001 },
    { ...body, skipped: 1 }, { ...body, extra: 1 }, '{']) assert.equal((await send(f, value)).status, 400);
  assert.equal((await send(f, 'x'.repeat(1025))).status, 413);
  assert.equal((await send(f, body, { Origin: 'https://other.example' })).status, 403);
  assert.equal((await send(f, body, { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await send({ env: {} }, body)).status, 503);
  assert.equal((await onRequest({ request: new Request(origin, { method: 'DELETE' }), env: f.env })).status, 405);
  assert.equal(f.reads.length, 0);
});

test('unknown or archived songs cannot start a session; R2 cost guard still applies', async t => {
  const f = fixture(t);
  f.metadata.delete(metadataKey(id)); assert.equal((await send(f, event())).status, 404);
  f.metadata.set(metadataKey(id), { ...f.metadata.get(metadataKey(other)), id, objectKey: audioKey(id, 'mp3'), visibility: 'ARCHIVED' });
  assert.equal((await send(f, event())).status, 404);
  assert.equal((await send({ env: { ...f.env, CLOUDFLARE_COST_DB: undefined } }, event())).status, 503);
  assert.equal(f.reads.length, 2);
  assert.deepEqual(await (await read(f)).json(), { totals: [] });
});

test('rate protection limits new playback sessions without storing raw IPs', async t => {
  const f = fixture(t);
  for (let index = 0; index < 120; index++) assert.equal((await send(f, event(), { 'CF-Connecting-IP': '192.0.2.8' })).status, 200);
  const response = await send(f, event(), { 'CF-Connecting-IP': '192.0.2.8' }); assert.equal(response.status, 429);
  assert.equal(f.reads.length, 120);
  assert.match(f.db.sqlite.prepare('SELECT rate_key FROM rate_limits').get().rate_key, /^music-listening:[a-f0-9]{64}$/);
});
