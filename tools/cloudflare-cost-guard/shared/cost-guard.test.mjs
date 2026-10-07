import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { createFounderAccessCookie } from '../../../functions/api/pdc/_shared.js';
import { onRequest as publicVideos } from '../../../functions/api/factory/public-videos.js';
import { onRequest as publicVideo } from '../../../functions/api/factory/public-video.js';
import { onRequest as privateVideos } from '../../../functions/api/factory/videos.js';
import { onRequest as privateVideo } from '../../../functions/api/factory/video.js';
import { onRequest as privateSource } from '../../../functions/api/factory/source.js';
import { onRequest as privateReview } from '../../../functions/api/factory/review.js';
import { SCORE_KEYS } from '../../../functions/api/factory/_reviews.js';
import {
  billingCycleStart, COST_GUARD_KEY, COST_GUARD_LIMITS,
  COST_GUARD_SCHEMA_SQL, CostGuardError, costResponse,
  reserveR2Usage, wrapR2Bucket,
} from './cost-guard.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const bridge = path.join(root, 'sqlite-bridge.py');
const python = process.env.COST_GUARD_TEST_PYTHON || 'python3';
const now = Date.parse('2026-10-07T00:00:00Z');

function sqlite(request) {
  return new Promise((resolve, reject) => {
    // JSON goes through stdin, never shell interpolation. Concurrent calls use
    // independent SQLite connections and contend on the same real DB file.
    const child = spawn(python, [bridge], { stdio: ['pipe', 'pipe', 'pipe'] });
    let output = ''; let errors = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.on('data', chunk => { errors += chunk; });
    child.on('error', reject);
    child.on('close', code => {
      if (code !== 0) return reject(new Error(`SQLite bridge failed: ${errors}`));
      try { resolve(JSON.parse(output).result); } catch (error) { reject(error); }
    });
    child.stdin.end(JSON.stringify(request));
  });
}

async function fixture(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'cloudflare-cost-guard-test-'));
  const databasePath = path.join(directory, 'quota.sqlite');
  t.after(() => rm(directory, { recursive: true, force: true }));
  const query = (sql, bindings = []) => sqlite({ path: databasePath, sql, bindings });
  const migration = await readFile(path.join(root, 'schema.sql'), 'utf8');
  await sqlite({ path: databasePath, sql: migration, script: true });
  await query('PRAGMA journal_mode=WAL');
  const database = {
    prepare(sql) {
      return { bind: (...bindings) => ({ first: () => query(sql, bindings) }) };
    },
  };
  const env = { CLOUDFLARE_COST_DB: database };
  const state = () => query('SELECT * FROM cloudflare_cost_guard WHERE guard_key = ?', [COST_GUARD_KEY]);
  return { database, env, query, state };
}

function assertGuard(error, status, code) {
  assert.ok(error instanceof CostGuardError);
  assert.equal(error.status, status);
  if (code) assert.equal(error.code, code);
  return true;
}

test('migration works with real reservation SQL and schema export stays compatible', async t => {
  const { env, query, state } = await fixture(t);
  await query(COST_GUARD_SCHEMA_SQL);
  const row = await reserveR2Usage(env, 'get', { now });
  assert.equal(row.guard_key, COST_GUARD_KEY);
  assert.equal(row.class_b_used, 1);
  assert.equal(row.class_a_used, 0);
  assert.equal(row.storage_bytes_reserved, 3 * 1024 ** 3);
  assert.deepEqual(await state(), row);
});

test('real concurrent SQLite reservations cannot exceed Class B cap', async t => {
  const { env, query, state } = await fixture(t);
  await reserveR2Usage(env, 'get', { now });
  await query('UPDATE cloudflare_cost_guard SET class_b_used = ?', [COST_GUARD_LIMITS.classB - 7]);
  const calls = await Promise.allSettled(Array.from({ length: 28 }, () => reserveR2Usage(env, 'get', { now })));
  assert.equal(calls.filter(call => call.status === 'fulfilled').length, 7);
  for (const call of calls.filter(call => call.status === 'rejected')) assertGuard(call.reason, 429);
  assert.equal((await state()).class_b_used, COST_GUARD_LIMITS.classB);
});

test('Class A cap is shared by LIST and PUT, not counted as Class B', async t => {
  const { env, query, state } = await fixture(t);
  await reserveR2Usage(env, 'get', { now });
  await query('UPDATE cloudflare_cost_guard SET class_a_used = ?', [COST_GUARD_LIMITS.classA - 4]);
  const calls = await Promise.allSettled(Array.from({ length: 18 }, (_, index) =>
    reserveR2Usage(env, index % 2 ? 'list' : 'put', { now, bytes: index % 2 ? 0 : 1 })));
  assert.equal(calls.filter(call => call.status === 'fulfilled').length, 4);
  const row = await state();
  assert.equal(row.class_a_used, COST_GUARD_LIMITS.classA);
  assert.equal(row.class_b_used, 1);
  assert.ok(row.upload_bytes_used <= 4);
});

test('byte reservations and operation counters commit together under concurrency', async t => {
  const { env, query, state } = await fixture(t);
  await reserveR2Usage(env, 'head', { now });
  await query('UPDATE cloudflare_cost_guard SET upload_bytes_used = ?', [COST_GUARD_LIMITS.uploadBytes - 10]);
  const calls = await Promise.allSettled(Array.from({ length: 12 }, () => reserveR2Usage(env, 'put', { now, bytes: 4 })));
  assert.equal(calls.filter(call => call.status === 'fulfilled').length, 2);
  const row = await state();
  assert.equal(row.upload_bytes_used, COST_GUARD_LIMITS.uploadBytes - 2);
  assert.equal(row.class_a_used, 2);
  assert.equal(row.storage_bytes_reserved, COST_GUARD_LIMITS.initialStorageBytes + 8);
});

test('storage ceiling blocks before the R2 call and does not alter any ledger counters', async t => {
  const { env, query, state } = await fixture(t);
  await reserveR2Usage(env, 'get', { now });
  await query('UPDATE cloudflare_cost_guard SET storage_bytes_reserved = ?', [COST_GUARD_LIMITS.storageBytes - 2]);
  const before = await state();
  let writes = 0;
  const guarded = wrapR2Bucket({ put() { writes++; } }, env, { now: () => now });
  await assert.rejects(guarded.put('file', '€'), error => assertGuard(error, 429));
  assert.equal(writes, 0);
  assert.deepEqual(await state(), before);
});

test('cycle resets at day 7 UTC, preserving storage; stale requests cannot roll it back', async t => {
  const { env, query, state } = await fixture(t);
  const september = Date.parse('2026-09-07T00:00:00Z');
  await reserveR2Usage(env, 'put', { now: september, bytes: 11 });
  await query('UPDATE cloudflare_cost_guard SET class_a_used = ?, class_b_used = ?, upload_bytes_used = ?',
    [COST_GUARD_LIMITS.classA, COST_GUARD_LIMITS.classB, COST_GUARD_LIMITS.uploadBytes]);
  await assert.rejects(reserveR2Usage(env, 'get', { now: now - 1 }), error => assertGuard(error, 429));
  const reset = await reserveR2Usage(env, 'put', { now, bytes: 13 });
  assert.equal(reset.cycle_start, '2026-10-07');
  assert.equal(reset.class_a_used, 1);
  assert.equal(reset.class_b_used, 0);
  assert.equal(reset.upload_bytes_used, 13);
  assert.equal(reset.storage_bytes_reserved, COST_GUARD_LIMITS.initialStorageBytes + 24);
  await assert.rejects(reserveR2Usage(env, 'head', { now: september }), error => assertGuard(error, 429));
  assert.deepEqual(await state(), reset);
  assert.equal(billingCycleStart(Date.parse('2026-01-06T23:59:59Z')), '2025-12-07');
  assert.equal(billingCycleStart(Date.parse('2026-01-07T00:00:00Z')), '2026-01-07');
});

test('all missing, failed, malformed or explicitly broken quota stores fail closed', async t => {
  const { database } = await fixture(t);
  let calls = 0;
  const failing = { prepare() { throw new Error('sensitive provider text'); } };
  const malformed = { prepare() { return { bind: () => ({ first: async () => ({ class_b_used: 1 }) }) }; } };
  for (const env of [undefined, {}, { CLOUDFLARE_COST_DB: failing }, { CLOUDFLARE_COST_DB: malformed },
    { CLOUDFLARE_COST_DB: {}, MAPKAI_DB: database }, { MAPKAI_DB: database }]) {
    const guarded = wrapR2Bucket({ get() { calls++; } }, env, { now: () => now });
    await assert.rejects(guarded.get('file'), error => assertGuard(error, 503, 'COST_GUARD_UNAVAILABLE'));
  }
  assert.equal(calls, 0);
  const configured = wrapR2Bucket({ get() { calls++; return 'ok'; } }, { CLOUDFLARE_COST_DB: database }, { now: () => now });
  assert.equal(await configured.get('file'), 'ok');
  assert.equal(calls, 1);
});

test('known PUT bodies reserve exact bytes, preserve options and snapshot buffers', async t => {
  const { env, state } = await fixture(t);
  const writes = [];
  const options = { httpMetadata: { contentType: 'application/octet-stream' }, onlyIf: { etagDoesNotMatch: '*' } };
  const guarded = wrapR2Bucket({ put(...args) { writes.push(args); return 'saved'; } }, env, { now: () => now });
  const buffer = Buffer.from([1, 2, 3]);
  const array = new Uint8Array([4, 5]).buffer;
  const view = new DataView(new Uint8Array([90, 6, 7, 8, 91]).buffer, 1, 3);
  const pending = guarded.put('buffer', buffer, options);
  buffer[0] = 99;
  assert.equal(await pending, 'saved');
  for (const [key, value] of [['unicode', '汉€🙂'], ['array', array], ['view', view], ['blob', new Blob(['é'])], ['empty', null]]) {
    assert.equal(await guarded.put(key, value, options), 'saved');
  }
  const row = await state();
  assert.equal(row.class_a_used, 6);
  assert.equal(row.upload_bytes_used, 3 + 10 + 2 + 3 + 2);
  assert.equal(row.storage_bytes_reserved, COST_GUARD_LIMITS.initialStorageBytes + 20);
  assert.deepEqual([...writes[0][1]], [1, 2, 3]);
  assert.deepEqual([...writes[2][1]], [4, 5]);
  assert.deepEqual([...writes[3][1]], [6, 7, 8]);
  for (const write of writes) assert.equal(write[2], options);
});

test('unknown bodies, streams, multipart and extra native methods cannot bypass reservations', async t => {
  const { env, state } = await fixture(t);
  let nativeCalls = 0;
  const guarded = wrapR2Bucket({
    put() { nativeCalls++; }, createMultipartUpload() { nativeCalls++; },
    resumeMultipartUpload() { nativeCalls++; }, unguardedOperation() { nativeCalls++; },
  }, env, { now: () => now });
  for (const value of [undefined, {}, new ReadableStream(), { size: 0, stream() {} }]) {
    assert.throws(() => guarded.put('file', value), error => assertGuard(error, 503, 'COST_GUARD_UNSUPPORTED_WRITE'));
  }
  assert.throws(() => guarded.createMultipartUpload('file'), error => assertGuard(error, 503));
  assert.throws(() => guarded.resumeMultipartUpload('file', 'id'), error => assertGuard(error, 503));
  assert.equal(guarded.unguardedOperation, undefined);
  assert.equal(Object.isFrozen(guarded), true);
  assert.equal(nativeCalls, 0);
  assert.equal(await state(), null);
});

test('failed attempted operations are charged; DELETE cannot replenish storage or usage', async t => {
  const { env, state } = await fixture(t);
  const nativeError = new Error('native failure');
  const deleted = [];
  const guarded = wrapR2Bucket({
    put() { throw nativeError; }, get() { return Promise.reject(nativeError); },
    delete(...args) { deleted.push(args); return 'deleted'; },
  }, env, { now: () => now });
  await assert.rejects(guarded.put('file', '€'), error => error === nativeError);
  await assert.rejects(guarded.get('file'), error => error === nativeError);
  const before = await state();
  assert.equal(before.class_a_used, 1);
  assert.equal(before.class_b_used, 1);
  assert.equal(before.upload_bytes_used, 3);
  assert.equal(before.storage_bytes_reserved, COST_GUARD_LIMITS.initialStorageBytes + 3);
  assert.equal(await guarded.delete(['file']), 'deleted');
  assert.equal(await guarded.delete(['file']), 'deleted');
  assert.deepEqual(deleted, [[['file']], [['file']]]);
  assert.deepEqual(await state(), before);
});

test('separate bucket facades share the same exhausted global ledger', async t => {
  const { env, query, state } = await fixture(t);
  await reserveR2Usage(env, 'get', { now });
  await query('UPDATE cloudflare_cost_guard SET class_b_used = ?', [COST_GUARD_LIMITS.classB - 1]);
  let calls = 0;
  const one = wrapR2Bucket({ get() { calls++; return 'one'; } }, env, { now: () => now });
  const two = wrapR2Bucket({ head() { calls++; return 'two'; } }, env, { now: () => now });
  const results = await Promise.allSettled([one.get('a'), two.head('b')]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal(calls, 1);
  assert.equal((await state()).class_b_used, COST_GUARD_LIMITS.classB);
});

test('guard responses hide provider details and unrelated errors retain existing handlers', async () => {
  for (const status of [429, 503]) {
    const response = costResponse(new CostGuardError('INTERNAL_GUARD_CODE', status));
    assert.equal(response.status, status);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    const body = await response.json();
    assert.equal(typeof body.error, 'string');
    assert.equal(JSON.stringify(body).includes('INTERNAL_GUARD_CODE'), false);
  }
  assert.equal(costResponse(new Error('native provider error')), null);
});

test('invalid amounts and invalid clock input never execute an R2 call', async t => {
  const { env, state } = await fixture(t);
  for (const bytes of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    await assert.rejects(reserveR2Usage(env, 'put', { now, bytes }), error => assertGuard(error, 503));
  }
  await assert.rejects(reserveR2Usage(env, 'put', { now, bytes: COST_GUARD_LIMITS.uploadBytes + 1 }), error => assertGuard(error, 429));
  await assert.rejects(reserveR2Usage(env, 'unknown', { now }), error => assertGuard(error, 503));
  let calls = 0;
  const guarded = wrapR2Bucket({ get() { calls++; } }, env, { now: () => NaN });
  await assert.rejects(guarded.get('file'), error => assertGuard(error, 503));
  assert.equal(calls, 0);
  assert.equal(await state(), null);
});

const mediaItem = {
  id: 'sample-video', fieldId: '01', fieldName: 'Education', sha256: 'a'.repeat(64),
  objectKey: `raw/01/sample-video/${'a'.repeat(64)}.mp4`, fileSize: 3,
  slug: 'education', title: 'Education preview', videoDuration: 'UNKNOWN', resolution: '1280x720',
  status: 'HUMAN_REVIEW_PENDING', publicationStatus: 'NOT_PUBLISHED', brandingStatus: 'NOT_APPLIED',
  publicPreviewStatus: 'VIDEO_CONTENT_UNDER_REVIEW', aiGenerated: true,
};

function mediaBucket(calls) {
  return {
    async get(key, options) {
      calls.push(['get', key, options]);
      if (key === 'catalog/review-v1.json') return { json: async () => ({ schemaVersion: 'mapkai-private-video-catalog.v1', visibility: 'FOUNDER_ONLY', items: [mediaItem] }) };
      if (key === 'catalog/public-preview-v1.json') return { json: async () => ({ schemaVersion: 'mapkai-public-preview-catalog.v1', visibility: 'PUBLIC_PREVIEW', items: [mediaItem] }) };
      if (key.startsWith('reviews/')) return null;
      return { body: new Uint8Array([1, 2, 3]) };
    },
    async head(key) { calls.push(['head', key]); return { size: mediaItem.fileSize }; },
    async put(...args) { calls.push(['put', ...args]); return {}; },
  };
}

async function routeRequest(pathname, env, { method = 'GET', founder = false, body } = {}) {
  const headers = {};
  if (founder) headers.Cookie = (await createFounderAccessCookie(env)).split(';')[0];
  if (body) {
    headers.Origin = 'https://www.mapkai.com';
    headers['Content-Type'] = 'application/json';
  }
  return new Request(`https://www.mapkai.com${pathname}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
}

function reviewBody() {
  return {
    commandId: 'test-command-123456789', expectedRevision: 0,
    review: {
      schemaVersion: 'mapkai-human-video-review.v1', generationAttemptId: mediaItem.id,
      fieldId: mediaItem.fieldId, rawVideoSha256: mediaItem.sha256, decision: 'Accept',
      scores: Object.fromEntries(SCORE_KEYS.map(key => [key, 8])),
      strengths: 'Clear explanation.', weaknesses: '', missingKnowledge: '', openingApproach: '',
      genericAiFeeling: 'Low', keepWatching: 'Yes',
    },
  };
}

test('deployed module bytes match the tested canonical guard', async () => {
  assert.equal(await readFile(path.join(root, 'cost-guard.mjs'), 'utf8'),
    await readFile(path.join(root, '../../../functions/_shared/cost-guard.js'), 'utf8'));
});

test('all factory public/private read and write routes block missing quota DB before bucket access', async () => {
  const calls = [];
  const env = { MAPKAI_REVIEW_MEDIA: mediaBucket(calls), MAPKAI_FOUNDER_ACCESS_CODE: 'test-only-not-a-real-secret' };
  const variants = [
    [publicVideos, '/api/factory/public-videos', {}],
    [publicVideo, '/api/factory/public-video?field=education', {}],
    [publicVideo, '/api/factory/public-video?field=education', { method: 'HEAD' }],
    [privateVideos, '/api/factory/videos', { founder: true }],
    [privateVideo, '/api/factory/video?id=sample-video', { founder: true }],
    [privateVideo, '/api/factory/video?id=sample-video', { founder: true, method: 'HEAD' }],
    [privateSource, '/api/factory/source?id=sample-video&file=receipt.json', { founder: true }],
    [privateReview, '/api/factory/review?id=sample-video', { founder: true }],
    [privateReview, '/api/factory/review?id=sample-video', { founder: true, method: 'POST', body: reviewBody() }],
  ];
  for (const [handler, pathname, options] of variants) {
    const response = await handler({ request: await routeRequest(pathname, env, options), env });
    assert.equal(response.status, 503, pathname);
    assert.equal(response.headers.get('Cache-Control'), 'no-store', pathname);
    assert.equal((await response.json()).error, 'Media is temporarily unavailable. Please try again later.');
  }
  assert.deepEqual(calls, []);
});

test('private factory authorization still rejects before storage or quota work', async t => {
  const { env, state } = await fixture(t);
  const calls = [];
  const configured = { ...env, MAPKAI_REVIEW_MEDIA: mediaBucket(calls), MAPKAI_FOUNDER_ACCESS_CODE: 'test-only-not-a-real-secret' };
  for (const [handler, pathname] of [[privateVideos, '/api/factory/videos'], [privateVideo, '/api/factory/video'],
    [privateSource, '/api/factory/source'], [privateReview, '/api/factory/review']]) {
    const response = await handler({ request: await routeRequest(pathname, configured), env: configured });
    assert.equal(response.status, 401);
  }
  assert.equal(await state(), null);
  assert.deepEqual(calls, []);
});

test('a public video reserves every individual operation; exhaustion blocks HEAD after catalog GET', async t => {
  const { env, query, state } = await fixture(t);
  await reserveR2Usage(env, 'get');
  await query('UPDATE cloudflare_cost_guard SET class_b_used = ?', [COST_GUARD_LIMITS.classB - 1]);
  const calls = [];
  const configured = { ...env, MAPKAI_REVIEW_MEDIA: mediaBucket(calls) };
  const response = await publicVideo({ request: await routeRequest('/api/factory/public-video?field=education', configured), env: configured });
  assert.equal(response.status, 429);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'get');
  assert.equal(calls[0][1], 'catalog/public-preview-v1.json');
  assert.equal((await state()).class_b_used, COST_GUARD_LIMITS.classB);
});

test('public video preserves byte range and response while recording three R2 reads', async t => {
  const { env, state } = await fixture(t);
  const calls = [];
  const configured = { ...env, MAPKAI_REVIEW_MEDIA: mediaBucket(calls) };
  const request = new Request('https://www.mapkai.com/api/factory/public-video?field=education', { headers: { Range: 'bytes=1-2' } });
  const response = await publicVideo({ request, env: configured });
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('Content-Range'), 'bytes 1-2/3');
  assert.deepEqual(calls.map(call => call[0]), ['get', 'head', 'get']);
  assert.deepEqual(calls[2][2], { range: { offset: 1, length: 2 } });
  assert.equal((await state()).class_b_used, 3);
});

test('private review write shares Class A and byte budgets; exhausted Class A prevents PUT', async t => {
  const { env, query, state } = await fixture(t);
  await reserveR2Usage(env, 'get');
  await query('UPDATE cloudflare_cost_guard SET class_a_used = ?', [COST_GUARD_LIMITS.classA]);
  const calls = [];
  const configured = { ...env, MAPKAI_REVIEW_MEDIA: mediaBucket(calls), MAPKAI_FOUNDER_ACCESS_CODE: 'test-only-not-a-real-secret' };
  const request = await routeRequest('/api/factory/review?id=sample-video', configured, { founder: true, method: 'POST', body: reviewBody() });
  const response = await privateReview({ request, env: configured });
  assert.equal(response.status, 429);
  assert.deepEqual(calls.map(call => call[0]), ['get', 'get']);
  assert.equal((await state()).upload_bytes_used, 0);
});

test('private review successful PUT reserves the actual saved UTF8 bytes', async t => {
  const { env, state } = await fixture(t);
  const calls = [];
  const configured = { ...env, MAPKAI_REVIEW_MEDIA: mediaBucket(calls), MAPKAI_FOUNDER_ACCESS_CODE: 'test-only-not-a-real-secret' };
  const request = await routeRequest('/api/factory/review?id=sample-video', configured, { founder: true, method: 'POST', body: reviewBody() });
  const response = await privateReview({ request, env: configured });
  assert.equal(response.status, 200);
  const saved = calls.find(call => call[0] === 'put');
  assert.ok(saved);
  assert.deepEqual(saved[3].onlyIf, { etagDoesNotMatch: '*' });
  const record = JSON.parse(new TextDecoder().decode(saved[2]));
  assert.equal(record.review.strengths, 'Clear explanation.');
  const row = await state();
  assert.equal(row.class_b_used, 2);
  assert.equal(row.class_a_used, 1);
  assert.equal(row.upload_bytes_used, saved[2].byteLength);
  assert.equal(row.storage_bytes_reserved, COST_GUARD_LIMITS.initialStorageBytes + saved[2].byteLength);
});

test('native R2 failures retain existing factory error handling', async t => {
  const { env, state } = await fixture(t);
  const configured = { ...env, MAPKAI_REVIEW_MEDIA: { get() { throw new Error('native internal details'); } } };
  const response = await publicVideos({ request: await routeRequest('/api/factory/public-videos', configured), env: configured });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, 'Learning previews are temporarily unavailable.');
  assert.equal((await state()).class_b_used, 1);
});
