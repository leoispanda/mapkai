import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../music/preferences.js', import.meta.url), 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
const { createStore } = context.MapKAIMusicPreferences;
const KEY = 'mapkaiMusicReactions.v1';
const FIRST = '11111111-1111-4111-8111-111111111111';
const SECOND = '22222222-2222-4222-8222-222222222222';
const THIRD = '33333333-3333-4333-8333-333333333333';
const FOURTH = '44444444-4444-4444-8444-444444444444';
const stored = reactions => JSON.stringify({ version: 1, reactions });
const result = value => JSON.parse(JSON.stringify(value));

function fixture(initial = null) {
  const data = new Map(initial === null ? [] : [[KEY, initial]]);
  const writes = [];
  const handlers = new Set();
  let readError = false;
  let writeError = false;
  const storage = {
    getItem(key) { if (readError) throw new Error('Storage access denied'); return data.get(key) ?? null; },
    setItem(key, value) { if (writeError) throw new Error('Quota exceeded'); data.set(key, value); writes.push([key, value]); },
  };
  const eventTarget = { addEventListener(type, listener) { if (type === 'storage') handlers.add(listener); } };
  return {
    data, storage, eventTarget, writes,
    make: () => createStore({ storage, eventTarget }),
    readError(value) { readError = value; },
    writeError(value) { writeError = value; },
    emit(key = KEY, area = storage) { for (const handler of handlers) handler({ key, storageArea: area }); },
  };
}

test('the script exposes the complete synchronous browser API and public mirror matches', async () => {
  for (const name of ['get', 'toggle', 'compare', 'subscribe', 'isPersistent', 'createStore']) {
    assert.equal(typeof context.MapKAIMusicPreferences[name], 'function');
  }
  assert.equal(source, await readFile(new URL('../public/music/preferences.js', import.meta.url), 'utf8'));
  assert.equal(context.MapKAIMusicPreferences.get(FIRST), null);
});

test('toggle adds, removes, and exclusively replaces a reaction using one key', () => {
  const f = fixture();
  const store = f.make();
  assert.equal(store.isPersistent(), true);
  assert.deepEqual(result(store.toggle(FIRST, 'like')), { value: 'like', persisted: true });
  assert.equal(store.get(FIRST), 'like');
  assert.deepEqual(result(store.toggle(FIRST, 'dislike')), { value: 'dislike', persisted: true });
  assert.deepEqual(JSON.parse(f.data.get(KEY)), { version: 1, reactions: { [FIRST]: 'dislike' } });
  assert.deepEqual(result(store.toggle(FIRST, 'dislike')), { value: null, persisted: true });
  assert.equal(store.get(FIRST), null);
  assert.equal(f.writes.every(([key]) => key === KEY), true);
});

test('reload preserves UUID-based reactions even when a track title changes', () => {
  const f = fixture();
  f.make().toggle(FIRST, 'like');
  const reloaded = f.make();
  assert.equal(reloaded.get(FIRST), 'like');
  assert.equal(reloaded.get(FIRST.toUpperCase()), 'like');
  assert.equal(reloaded.compare({ id: FIRST, title: '047 A renamed song' }, { id: SECOND, title: '001 Earlier' }) < 0, true);
});

test('liked, neutral, and disliked groups each retain fixed number order without mutating tracks', () => {
  const f = fixture(stored({ [FIRST]: 'dislike', [THIRD]: 'like', [FOURTH]: 'like' }));
  const store = f.make();
  const tracks = [
    Object.freeze({ id: FIRST, title: '001 First' }),
    Object.freeze({ id: SECOND, title: '002 Second' }),
    Object.freeze({ id: THIRD, title: '047 Third' }),
    Object.freeze({ id: FOURTH, title: '003 Fourth' }),
  ];
  assert.deepEqual([...tracks].sort(store.compare).map(track => track.title), ['003 Fourth', '047 Third', '002 Second', '001 First']);
  assert.deepEqual(tracks.map(track => track.title), ['001 First', '002 Second', '047 Third', '003 Fourth']);
  store.toggle(FIRST, 'like');
  assert.deepEqual([...tracks].sort(store.compare).map(track => track.title), ['001 First', '003 Fourth', '047 Third', '002 Second']);
});

test('future numbers stay ordered and unnumbered ties preserve featured, date, and deterministic ID fallbacks', () => {
  const store = fixture().make();
  const featured = ['c2a4a749-933b-4b4b-95fb-0d2d3f12ac6f', 'ccb37c55-bae6-4f72-a80a-d1bc94e40ae0',
    'e4363fdb-2354-4e5c-98f0-9549b689b5c3', 'bb5957e7-9e91-45e1-a978-5643451d7820'];
  const tracks = [
    { id: SECOND, title: 'Unnumbered', createdAt: '2026-10-14T00:00:00Z' },
    { id: FIRST, title: 'Unnumbered', createdAt: '2026-10-14T00:00:00Z' },
    ...[...featured].reverse().map(id => ({ id, title: 'Unnumbered', createdAt: '2020-01-01' })),
    { id: THIRD, title: '048 New song' }, { id: FOURTH, title: '047 Existing song' },
    { id: '55555555-5555-4555-8555-555555555555', title: 'Unnumbered', createdAt: '2026-10-13T00:00:00Z' },
  ];
  assert.deepEqual(tracks.sort(store.compare).map(track => track.id), [FOURTH, THIRD, ...featured, FIRST, SECOND, '55555555-5555-4555-8555-555555555555']);
  assert.equal(store.compare({ id: FIRST, title: '99999999999999999 Unsafe', createdAt: 'bad' }, { id: SECOND, title: 'Unnumbered', createdAt: 'bad' }) < 0, true);
});

test('malformed, oversized, unsupported, and invalid persisted data stay untouched and fall back to memory', () => {
  const invalid = [
    '{bad json', 'null', '[]', JSON.stringify({ version: 2, reactions: {} }),
    JSON.stringify({ version: 1, reactions: {}, extra: true }),
    stored({ [FIRST]: 'love' }), stored({ bad: 'like' }),
    '{"version":1,"reactions":{"__proto__":"like"}}',
    stored({ 'abcdefab-1111-4111-8111-111111111111': 'like', 'ABCDEFAB-1111-4111-8111-111111111111': 'dislike' }),
    ' '.repeat(200001),
    stored(Object.fromEntries(Array.from({ length: 2001 }, (_, index) => [`${index.toString(16).padStart(8, '0')}-1111-4111-8111-111111111111`, 'like']))),
  ];
  for (const raw of invalid) {
    const f = fixture(raw);
    const store = f.make();
    assert.equal(store.isPersistent(), false);
    assert.equal(store.get(FIRST), null);
    assert.deepEqual(result(store.toggle(FIRST, 'like')), { value: 'like', persisted: false });
    assert.equal(store.get(FIRST), 'like');
    assert.equal(f.data.get(KEY), raw);
    assert.equal(f.writes.length, 0);
  }
});

test('blocked storage and inaccessible global storage remain usable without throwing', () => {
  const f = fixture();
  f.readError(true);
  const store = f.make();
  assert.equal(store.isPersistent(), false);
  assert.deepEqual(result(store.toggle(FIRST, 'like')), { value: 'like', persisted: false });
  assert.deepEqual(result(store.toggle(SECOND, 'dislike')), { value: 'dislike', persisted: false });
  assert.equal(store.get(FIRST), 'like');
  const browser = vm.createContext({});
  Object.defineProperty(browser, 'localStorage', { get() { throw new Error('Storage disabled'); } });
  vm.runInContext(source, browser);
  assert.deepEqual(result(browser.MapKAIMusicPreferences.toggle(FIRST, 'like')), { value: 'like', persisted: false });
});

test('failed writes keep in-memory changes and can merge and persist them when storage recovers', () => {
  const f = fixture(stored({ [THIRD]: 'like' }));
  const store = f.make();
  f.writeError(true);
  assert.deepEqual(result(store.toggle(FIRST, 'like')), { value: 'like', persisted: false });
  assert.equal(store.get(FIRST), 'like');
  f.data.set(KEY, stored({ [SECOND]: 'dislike', [THIRD]: 'like' }));
  f.emit();
  assert.equal(store.get(FIRST), 'like');
  assert.equal(store.get(SECOND), 'dislike');
  assert.equal(store.isPersistent(), false);
  f.writeError(false);
  assert.deepEqual(result(store.toggle(THIRD, 'dislike')), { value: 'dislike', persisted: true });
  assert.deepEqual(JSON.parse(f.data.get(KEY)).reactions, { [SECOND]: 'dislike', [THIRD]: 'dislike', [FIRST]: 'like' });
});

test('a change re-reads shared storage and preserves unrelated reactions before writing', () => {
  const f = fixture();
  const firstTab = f.make();
  const secondTab = f.make();
  firstTab.toggle(FIRST, 'like');
  secondTab.toggle(SECOND, 'dislike');
  assert.deepEqual(JSON.parse(f.data.get(KEY)).reactions, { [FIRST]: 'like', [SECOND]: 'dislike' });
  assert.equal(secondTab.get(FIRST), 'like');
  firstTab.toggle(THIRD, 'like');
  assert.deepEqual(JSON.parse(f.data.get(KEY)).reactions, { [FIRST]: 'like', [SECOND]: 'dislike', [THIRD]: 'like' });
});

test('storage events refresh other tabs, removeItem and clear refresh, and unrelated events are ignored', () => {
  const f = fixture();
  const store = f.make();
  const notifications = [];
  store.subscribe(change => notifications.push(result(change)));
  f.data.set(KEY, stored({ [FIRST]: 'like' }));
  f.emit('another-key');
  assert.equal(store.get(FIRST), null);
  f.emit(KEY, {});
  assert.equal(store.get(FIRST), null);
  f.emit();
  assert.equal(store.get(FIRST), 'like');
  assert.deepEqual(notifications.at(-1), { source: 'storage', id: null, value: null, persisted: true });
  f.data.delete(KEY);
  f.emit();
  assert.equal(store.get(FIRST), null);
  store.toggle(SECOND, 'dislike');
  f.data.clear();
  f.emit(null);
  assert.equal(store.get(SECOND), null);
  assert.equal(store.isPersistent(), true);
});

test('malformed events preserve current preferences and a real clear discards unpersisted changes', () => {
  const f = fixture();
  const store = f.make();
  store.toggle(FIRST, 'like');
  f.data.set(KEY, '{bad');
  f.emit();
  assert.equal(store.get(FIRST), 'like');
  assert.equal(store.isPersistent(), false);
  store.toggle(SECOND, 'like');
  f.data.clear();
  f.emit(null);
  assert.equal(store.get(FIRST), null);
  assert.equal(store.get(SECOND), null);
  assert.equal(store.isPersistent(), true);
});

test('subscriptions can unsubscribe and an observer error cannot prevent a saved preference', () => {
  const f = fixture();
  const store = f.make();
  const values = [];
  const unsubscribe = store.subscribe(change => values.push(change.value));
  store.subscribe(() => { throw new Error('Observer failed'); });
  assert.deepEqual(result(store.toggle(FIRST, 'like')), { value: 'like', persisted: true });
  unsubscribe();
  store.toggle(FIRST, 'dislike');
  assert.deepEqual(values, ['like']);
  assert.equal(store.get(FIRST), 'dislike');
  assert.throws(() => store.toggle('not-a-uuid', 'like'), { name: 'TypeError' });
  assert.throws(() => store.toggle(FIRST, 'love'), { name: 'TypeError' });
  assert.throws(() => store.subscribe(null), { name: 'TypeError' });
  assert.equal(store.get('__proto__'), null);
});
