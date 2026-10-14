import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../music/preferences.js', import.meta.url), 'utf8');
const context = vm.createContext({ AbortController });
vm.runInContext(source, context);
const { createStore } = context.MapKAIMusicPreferences;
const FIRST = '11111111-1111-4111-8111-111111111111';
const SECOND = '22222222-2222-4222-8222-222222222222';
const THIRD = '33333333-3333-4333-8333-333333333333';
const KEY = 'mapkaiMusicPendingVotes.v1';
const OLD_KEY = 'mapkaiMusicReactions.v1';
const normal = value => JSON.parse(JSON.stringify(value));
const total = (id, likes = 0, dislikes = 0) => ({ id, likes, dislikes, score: likes - dislikes });
const response = (body, status = 200) => ({ status, ok: status >= 200 && status < 300, async json() { return body; } });
const deferred = () => { let resolve; let reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const tick = async () => { for (let index = 0; index < 8; index += 1) await Promise.resolve(); };

function fixture(options = {}) {
  const requests = [];
  const data = options.data || new Map([[OLD_KEY, '{"version":1,"reactions":{"old":"like"}}']]);
  const reads = [];
  const timers = new Map();
  const events = new Map();
  const docEvents = new Map();
  let sequence = 0;
  let timerId = 0;
  let blockWrite = false;
  let blockRead = false;
  const eventTarget = {
    addEventListener(name, listener) { events.set(name, listener); },
    removeEventListener(name) { events.delete(name); },
  };
  const document = {
    visibilityState: 'visible',
    addEventListener(name, listener) { docEvents.set(name, listener); },
    removeEventListener(name) { docEvents.delete(name); },
  };
  const sessionStorage = {
    getItem(key) { reads.push(key); if (blockRead) throw new Error('Blocked'); return data.get(key) ?? null; },
    setItem(key, value) { if (blockWrite) throw new Error('Blocked'); data.set(key, value); },
  };
  const serverTotals = new Map();
  const serverRequests = new Map();
  let implementation = options.fetch || (async (_url, init) => {
    if (init.method === 'GET') return response({ totals: [...serverTotals.values()] });
    const body = JSON.parse(init.body);
    const duplicate = serverRequests.has(body.requestId);
    if (!duplicate) {
      const current = serverTotals.get(body.id) || total(body.id);
      serverTotals.set(body.id, total(body.id, current.likes + Number(body.reaction === 'like'), current.dislikes + Number(body.reaction === 'dislike')));
      serverRequests.set(body.requestId, body);
    }
    return response({ total: serverTotals.get(body.id), requestId: body.requestId, duplicate });
  });
  const defaults = {
    fetch: (url, init) => { requests.push({ url, ...init }); return implementation(url, init); },
    eventTarget, document, sessionStorage,
    randomUUID: () => `${(++sequence).toString(16).padStart(8, '0')}-aaaa-4aaa-8aaa-aaaaaaaaaaaa`,
    setTimeout(fn, delay) { timers.set(++timerId, { fn, delay }); return timerId; },
    clearTimeout(id) { timers.delete(id); },
    now: () => 1234,
  };
  return {
    requests, data, reads, timers, events, docEvents, document, serverTotals, serverRequests,
    make: overrides => createStore({ ...defaults, ...overrides }),
    fetch(fn) { implementation = fn; },
    blockRead(value) { blockRead = value; }, blockWrite(value) { blockWrite = value; },
    emit(name) { events.get(name)?.(); },
    visibility(value) { document.visibilityState = value; docEvents.get('visibilitychange')?.(); },
    fire(delay) { const found = [...timers].find(([, timer]) => timer.delay === delay); assert.ok(found, `Timer ${delay} exists`); timers.delete(found[0]); found[1].fn(); },
  };
}

function ack(init, value, duplicate = false) {
  return response({ total: value, requestId: JSON.parse(init.body).requestId, duplicate });
}

test('helper and mirror expose async shared counts without loading or importing personal reactions', async () => {
  assert.equal(source, await readFile(new URL('../public/music/preferences.js', import.meta.url), 'utf8'));
  for (const name of ['get', 'status', 'vote', 'compare', 'subscribe', 'refresh', 'dispose', 'createStore']) assert.equal(typeof context.MapKAIMusicPreferences[name], 'function');
  const f = fixture(); const store = f.make();
  assert.equal(f.requests.length, 0); assert.equal(f.timers.size, 0); assert.equal(f.events.size, 0);
  assert.deepEqual(f.reads, [KEY]); assert.equal(f.data.get(OLD_KEY), '{"version":1,"reactions":{"old":"like"}}');
  assert.deepEqual(normal(store.get(FIRST)), { likes: 0, dislikes: 0, score: 0, known: false, pending: false, error: null, unknown: false, reaction: null });
  assert.equal(await store.refresh(), true);
  assert.equal(store.get(FIRST).known, true); assert.equal(store.status().loaded, true);
  assert.equal(f.requests[0].url, '/api/music/votes'); assert.equal(f.requests[0].credentials, 'same-origin'); assert.equal(f.requests[0].cache, 'no-store');
});

test('each completed click accumulates a new server vote with no local optimistic or undo count', async () => {
  const f = fixture(); const store = f.make();
  const first = store.vote(FIRST, 'like');
  assert.equal(store.get(FIRST).likes, 0); assert.equal(store.get(FIRST).pending, true);
  assert.equal(JSON.parse(f.data.get(KEY)).requests.length, 1, 'Identity is stored before the request is sent');
  assert.equal((await first).ok, true);
  assert.equal((await store.vote(FIRST, 'like')).ok, true);
  assert.equal((await store.vote(FIRST, 'dislike')).ok, true);
  assert.deepEqual([store.get(FIRST).likes, store.get(FIRST).dislikes, store.get(FIRST).score], [2, 1, 1]);
  assert.equal(new Set(f.requests.map(row => JSON.parse(row.body).requestId)).size, 3);
  assert.deepEqual(JSON.parse(f.data.get(KEY)), { version: 1, requests: [] });
  assert.equal(f.reads.includes(OLD_KEY), false);
});

test('same-song pending clicks share one request; another song can vote independently', async () => {
  const first = deferred(); const f = fixture({ fetch: (_url, init) => JSON.parse(init.body).id === FIRST ? first.promise : Promise.resolve(ack(init, total(SECOND, 1))) });
  const store = f.make(); const vote = store.vote(FIRST, 'like');
  assert.equal(store.vote(FIRST, 'like'), vote); assert.equal(store.vote(FIRST, 'dislike'), vote);
  await tick(); assert.equal(f.requests.length, 1); assert.equal(store.get(FIRST).likes, 0);
  await store.vote(SECOND, 'like'); assert.equal(store.get(SECOND).likes, 1);
  first.resolve(ack(f.requests[0], total(FIRST, 1))); await vote;
  assert.equal(f.requests.length, 2); assert.equal(store.get(FIRST).pending, false);
});

test('shared score sorts descending, lets dislikes lower rank, and keeps fixed numeric ties', async () => {
  const f = fixture(); f.serverTotals.set(FIRST, total(FIRST, 2, 1)); f.serverTotals.set(SECOND, total(SECOND, 1, 0));
  const store = f.make(); await store.refresh();
  const tracks = [Object.freeze({ id: FIRST, title: '047 Later number' }), Object.freeze({ id: SECOND, title: '001 Earlier number' }), Object.freeze({ id: THIRD, title: '048 Future number' })];
  assert.deepEqual([...tracks].sort(store.compare).map(row => row.id), [SECOND, FIRST, THIRD]);
  await store.vote(SECOND, 'dislike'); await store.vote(SECOND, 'dislike');
  assert.equal(store.get(SECOND).score, -1);
  assert.deepEqual([...tracks].sort(store.compare).map(row => row.id), [FIRST, THIRD, SECOND]);
  assert.deepEqual(tracks.map(row => row.title), ['047 Later number', '001 Earlier number', '048 Future number']);
});

test('unknown POST has no automatic retry, locks the opposite action, and same action reuses its request ID', async () => {
  const f = fixture(); const store = f.make(); let unknownId;
  f.fetch(async (_url, init) => {
    if (init.method === 'GET') return response({ totals: [total(FIRST, 1)] });
    unknownId = JSON.parse(init.body).requestId;
    throw new Error('Connection lost after server commit');
  });
  const outcome = await store.vote(FIRST, 'like');
  assert.equal(outcome.unknown, true); assert.equal(store.get(FIRST).likes, 0); assert.equal(f.requests.length, 1);
  await store.refresh(); assert.equal(store.get(FIRST).unknown, true); assert.equal(store.get(FIRST).likes, 1);
  assert.equal((await store.vote(FIRST, 'dislike')).unknown, true); assert.equal(f.requests.length, 2);
  f.fetch(async (_url, init) => { assert.equal(JSON.parse(init.body).requestId, unknownId); return ack(init, total(FIRST, 1), true); });
  assert.equal((await store.vote(FIRST, 'like')).duplicate, true);
  assert.equal(store.get(FIRST).unknown, false); assert.equal(store.get(FIRST).likes, 1); assert.equal(f.requests.length, 3);
});

test('a timeout preserves identity, late responses cannot apply counts, and explicit retry is idempotent', async () => {
  const delayed = deferred(); const f = fixture({ fetch: () => delayed.promise }); const store = f.make();
  const vote = store.vote(FIRST, 'like'); await tick(); const requestId = JSON.parse(f.requests[0].body).requestId;
  f.fire(10000); assert.equal((await vote).unknown, true); assert.equal(f.requests[0].signal.aborted, true);
  delayed.resolve(ack(f.requests[0], total(FIRST, 99))); await tick(); assert.equal(store.get(FIRST).likes, 0);
  f.fetch(async (_url, init) => { assert.equal(JSON.parse(init.body).requestId, requestId); return ack(init, total(FIRST, 1), true); });
  await store.vote(FIRST, 'like'); assert.equal(store.get(FIRST).likes, 1);
});

test('pending-only session recovery survives reload without automatically resending a POST', async () => {
  const wait = deferred(); const f = fixture({ fetch: () => wait.promise }); const store = f.make();
  store.vote(FIRST, 'dislike'); await tick();
  const saved = JSON.parse(f.data.get(KEY)).requests[0];
  const restored = f.make();
  assert.equal(f.requests.length, 1); assert.equal(restored.get(FIRST).unknown, true); assert.equal(restored.get(FIRST).reaction, 'dislike');
  f.fetch(async (_url, init) => { assert.equal(JSON.parse(init.body).requestId, saved.requestId); return ack(init, total(FIRST, 0, 1), true); });
  await restored.vote(FIRST, 'dislike');
  assert.equal(restored.get(FIRST).dislikes, 1); assert.deepEqual(JSON.parse(f.data.get(KEY)).requests, []);
  wait.resolve(ack(f.requests[0], total(FIRST, 0, 1))); await tick();
});

test('blocked recovery storage is reported while a live uncertain request still retries safely', async () => {
  const f = fixture({ fetch: async () => { throw new Error('Offline'); } }); f.blockWrite(true);
  const store = f.make(); const unknown = await store.vote(FIRST, 'like');
  assert.equal(store.status().sessionRecovery, false); assert.equal(store.get(FIRST).unknown, true);
  f.fetch(async (_url, init) => { assert.equal(JSON.parse(init.body).requestId, unknown.requestId); return ack(init, total(FIRST, 1)); });
  assert.equal((await store.vote(FIRST, 'like')).ok, true); assert.equal(store.get(FIRST).likes, 1);
  assert.equal(f.data.has(KEY), false);
});

test('malformed or oversized pending recovery stays untouched and never becomes server votes or counts', () => {
  for (const raw of ['null', '{bad', ' '.repeat(40001), JSON.stringify({ version: 2, requests: [] }), JSON.stringify({ version: 1, requests: [{ id: FIRST, reaction: 'like', requestId: 'bad' }] }), JSON.stringify({ version: 1, requests: Array(129).fill({ id: FIRST, reaction: 'like', requestId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' }) })]) {
    const data = new Map([[KEY, raw]]); const f = fixture({ data }); const store = f.make();
    assert.equal(store.get(FIRST).unknown, false); assert.equal(store.status().sessionRecovery, false); assert.equal(f.requests.length, 0); assert.equal(data.get(KEY), raw);
  }
});

test('known 429 and 4xx rejections clear request identity while 5xx and invalid acknowledgements retain it', async () => {
  for (const status of [400, 403, 404, 409, 429]) {
    const f = fixture({ fetch: async () => response({}, status) }); const store = f.make();
    const first = await store.vote(FIRST, 'like');
    assert.equal(first.unknown, false); assert.equal(first.error, status === 429 ? 'rateLimited' : 'rejected');
    assert.deepEqual(JSON.parse(f.data.get(KEY)).requests, []);
    const second = await store.vote(FIRST, 'dislike'); assert.notEqual(second.requestId, first.requestId);
  }
  for (const value of [response({}, 503), response({ total: total(FIRST, 4), requestId: 'wrong', duplicate: false }), response({ total: total(FIRST, 4) })]) {
    const f = fixture({ fetch: async () => value }); const store = f.make(); const result = await store.vote(FIRST, 'like');
    assert.equal(result.unknown, true); assert.equal(store.get(FIRST).likes, 0); assert.equal(JSON.parse(f.data.get(KEY)).requests[0].requestId, result.requestId);
  }
});

test('stale GET cannot roll back a later POST and newer dislikes are not hidden by score monotonicity', async () => {
  const wait = deferred(); const f = fixture({ fetch: (_url, init) => init.method === 'GET' ? wait.promise : Promise.resolve(ack(init, total(FIRST, 5, 1))) });
  const store = f.make(); const refresh = store.refresh(); await tick();
  await store.vote(FIRST, 'like'); assert.equal(store.get(FIRST).likes, 5);
  wait.resolve(response({ totals: [total(FIRST, 1, 0)] })); await refresh;
  assert.deepEqual([store.get(FIRST).likes, store.get(FIRST).dislikes, store.get(FIRST).score], [5, 1, 4]);
  f.fetch(async () => response({ totals: [total(FIRST, 5, 8)] })); await store.refresh();
  assert.deepEqual([store.get(FIRST).likes, store.get(FIRST).dislikes, store.get(FIRST).score], [5, 8, -3]);
});

test('refresh is single-flight; only visible active pages poll and focus/visibility do not create overlap', async () => {
  const first = deferred(); const f = fixture({ fetch: () => first.promise }); const store = f.make();
  const refresh = store.refresh(); assert.equal(store.refresh(), refresh); f.emit('focus'); await tick(); assert.equal(f.requests.length, 1);
  first.resolve(response({ totals: [] })); await refresh;
  assert.equal([...f.timers.values()].filter(timer => timer.delay === 30000).length, 1);
  f.visibility('hidden'); assert.equal(f.timers.size, 0); f.emit('focus'); await tick(); assert.equal(f.requests.length, 1);
  f.fetch(async () => response({ totals: [] })); f.visibility('visible'); await store.refresh(); assert.equal(f.requests.length, 2);
  f.fire(30000); await store.refresh(); assert.equal(f.requests.length, 3);
  store.dispose(); assert.equal(f.timers.size, 0); assert.equal(f.events.size, 0); assert.equal(f.docEvents.size, 0);
  assert.equal(await store.refresh(), false); assert.equal(f.requests.length, 3);
});

test('failed or malformed GET preserves last confirmed counts and reports unavailable without an unhandled rejection', async () => {
  const f = fixture(); f.serverTotals.set(FIRST, total(FIRST, 3, 1)); const store = f.make(); await store.refresh();
  for (const body of [null, { totals: [total(FIRST, 0, 0), total(FIRST, 0, 0)] }, { totals: [{ id: FIRST, likes: -1, dislikes: 0, score: -1 }] }, { totals: [{ id: FIRST, likes: 0, dislikes: 0, score: 5 }] }]) {
    f.fetch(async () => response(body)); assert.equal(await store.refresh(), false);
    assert.equal(store.get(FIRST).likes, 3); assert.equal(store.status().unavailable, true); assert.equal(store.status().refreshing, false);
  }
  f.fetch(async () => { throw new Error('Offline'); }); assert.equal(await store.refresh(), false);
  assert.equal(store.get(FIRST).dislikes, 1);
});

test('invalid IDs/reactions cannot send requests, and missing UUID or fetch cannot pretend success', async () => {
  const f = fixture(); const store = f.make();
  assert.throws(() => store.vote('not-a-song', 'like')); assert.throws(() => store.vote(FIRST, 'love')); assert.equal(f.requests.length, 0);
  const noUUID = f.make({ randomUUID: () => null }); assert.equal((await noUUID.vote(FIRST, 'like')).error, 'unavailable');
  const noNetwork = f.make({ fetch: null }); assert.equal((await noNetwork.vote(FIRST, 'like')).error, 'unavailable'); assert.equal(await noNetwork.refresh(), false);
  assert.equal(f.requests.length, 0); assert.equal(noUUID.get(FIRST).likes, 0);
});


test('a rejected retry cannot erase the identity of an earlier ambiguous server commit, including across reload', async () => {
  const f = fixture({ fetch: async () => { throw new Error('Committed but lost acknowledgement'); } }); const store = f.make();
  const first = await store.vote(FIRST, 'like');
  f.fetch(async () => response({}, 429));
  const rejectedRetry = await store.vote(FIRST, 'like');
  assert.equal(rejectedRetry.unknown, true); assert.equal(rejectedRetry.requestId, first.requestId);
  assert.equal(JSON.parse(f.data.get(KEY)).requests[0].requestId, first.requestId);
  const reloaded = f.make(); assert.equal(reloaded.get(FIRST).unknown, true);
  f.fetch(async (_url, init) => { assert.equal(JSON.parse(init.body).requestId, first.requestId); return ack(init, total(FIRST, 1), true); });
  const settled = await reloaded.vote(FIRST, 'like');
  assert.equal(settled.duplicate, true); assert.equal(reloaded.get(FIRST).likes, 1); assert.equal(reloaded.get(FIRST).unknown, false);
});


test('a restored unknown request stays unknown when transport itself is unavailable', async () => {
  const requestId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const raw = JSON.stringify({ version: 1, requests: [{ id: FIRST, reaction: 'like', requestId }] });
  const f = fixture({ data: new Map([[KEY, raw]]) }); const store = f.make({ fetch: null });
  const result = await store.vote(FIRST, 'like');
  assert.equal(result.unknown, true); assert.equal(result.requestId, requestId);
  assert.equal(store.get(FIRST).unknown, true); assert.equal(store.get(FIRST).reaction, 'like');
  assert.equal(f.data.get(KEY), raw); assert.equal(f.requests.length, 0);
});
