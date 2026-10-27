import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../script.js', import.meta.url), 'utf8');
const functions = ['refreshCategorySongModules', 'playCategorySongModule'].map(name => {
  const match = source.match(new RegExp(`^(?:async )?function ${name}\\([^\\n]*\\) \\{[\\s\\S]*?^\\}`, 'm'));
  assert.ok(match, `Missing application function ${name}`);
  return match[0];
}).join('\n');
const first = '11111111-1111-4111-8111-111111111111';
const second = '22222222-2222-4222-8222-222222222222';
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
};
const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };

// Run the real application handlers against a narrow player contract. Native
// audio, queueing, cancellation and seek preservation are tested by music-dock.
function harness({ ready = null, songRoute = null } = {}) {
  let route = songRoute || '/categories/00';
  let current = { id: null, playing: false, pending: false, failed: false };
  const calls = [];
  const location = {};
  Object.defineProperty(location, 'pathname', { get: () => route, set() { throw Error('Song activation navigated'); } });
  const buttons = [first, second].map((id, index) => {
    const status = { textContent: '' };
    const attributes = new Map();
    return {
      dataset: { categorySongId: id, songCategory: '00', songTitle: `Song ${index + 1}`, ...(songRoute ? { songRoute } : {}) },
      disabled: false, isConnected: true, status, attributes,
      setAttribute: (name, value) => attributes.set(name, value),
      removeAttribute: name => attributes.delete(name),
      closest: () => ({ querySelector: () => status }),
    };
  });
  const dock = {
    snapshot: () => Object.freeze({ ...current }),
    play: async id => { calls.push(['play', id]); current = { id, playing: true, pending: false, failed: false }; return true; },
    pause: id => { calls.push(['pause', id]); current = { ...current, playing: false, pending: false }; return true; },
    resume: async id => { calls.push(['resume', id]); current = { ...current, playing: true, pending: false, failed: false }; return true; },
  };
  const document = { querySelectorAll: selector => {
    if (selector === '[data-category-song-id]') return buttons;
    if (selector === '.category-song-module-status') return buttons.map(button => button.status);
    throw Error(`Unexpected DOM dependency ${selector}`);
  } };
  const context = vm.createContext({ document, window: { location, MapKAIMusicDock: dock,
    history: { pushState() { throw Error('Song activation changed history'); }, replaceState() { throw Error('Song activation changed history'); } } },
    currentLanguage: 'zh', categorySongRenderToken: 1, categorySongPlaybackToken: 0, categorySongPendingId: null,
    categories: [{ code: '00', groups: [{ code: '001' }] }], categorySongTracks: { '00': { id: first } },
    categoryGroupSongTracks: { '001': { id: second } }, ownerCulturalSongs: [],
    normalizeRoute: value => value, waitForCategorySongPlayer: () => ready?.promise || Promise.resolve(dock),
  });
  vm.runInContext(functions, context);
  return { context, buttons, dock, calls, ready, route: () => route, move: value => { route = value; },
    state: value => { current = { ...current, ...value }; },
    activate: index => context.playCategorySongModule(buttons[index]), refresh: () => context.refreshCategorySongModules() };
}

test('song activation plays the shared player and leaves the category address unchanged', async () => {
  const h = harness();
  await h.activate(0);
  assert.deepEqual(h.calls, [['play', first]]);
  assert.equal(h.route(), '/categories/00');
  assert.equal(h.buttons[0].dataset.state, 'playing');
  assert.equal(h.buttons[0].attributes.get('aria-pressed'), 'true');
  assert.equal(h.buttons[0].attributes.get('aria-label'), '暂停歌曲 · Song 1');
  assert.equal(h.buttons[0].disabled, false);
});

test('the same song pauses and resumes through the guarded API instead of selecting it again', async () => {
  const h = harness();
  h.state({ id: first, playing: true });
  await h.activate(0);
  assert.equal(h.buttons[0].dataset.state, 'paused');
  assert.equal(h.buttons[0].attributes.get('aria-pressed'), 'false');
  await h.activate(0);
  assert.deepEqual(h.calls, [['pause', first], ['resume', first]]);
  assert.equal(h.buttons[0].dataset.state, 'playing');
});

test('a newer song retains loading ownership when an older request is cancelled', async () => {
  const h = harness(), a = deferred(), b = deferred();
  h.dock.play = id => {
    h.calls.push(['play', id]); h.state({ id, playing: false, pending: true, failed: false }); h.refresh();
    return id === first ? a.promise : b.promise;
  };
  const old = h.activate(0); await flush();
  const latest = h.activate(1); await flush();
  a.resolve(false); await old;
  assert.equal(h.buttons[0].status.textContent, '');
  assert.equal(h.buttons[1].dataset.state, 'pending');
  assert.equal(h.buttons[1].disabled, true);
  assert.equal(h.buttons[1].attributes.get('aria-busy'), 'true');
  h.state({ id: second, playing: true, pending: false }); b.resolve(true); await latest;
  assert.equal(h.buttons[1].dataset.state, 'playing');
  assert.equal(h.buttons[1].attributes.has('aria-busy'), false);
  assert.equal(h.buttons[1].disabled, false);
  assert.equal(h.route(), '/categories/00');
});

test('external cancellation stays quiet, while an actual media failure offers retry', async () => {
  for (const failed of [false, true]) {
    const h = harness();
    h.dock.play = async id => { h.state({ id, playing: false, pending: false, failed }); return false; };
    await h.activate(0);
    assert.equal(h.buttons[0].status.textContent, failed ? '暂时无法播放，请重试。' : '');
    assert.equal(h.buttons[0].disabled, false);
    assert.equal(h.buttons[0].attributes.has('aria-busy'), false);
  }
});

test('unavailable player reports an error and releases the module for another attempt', async () => {
  const ready = deferred(), h = harness({ ready });
  const attempt = h.activate(0);
  ready.reject(Error('Player unavailable')); await attempt;
  assert.equal(h.buttons[0].status.textContent, '暂时无法播放，请重试。');
  assert.equal(h.buttons[0].disabled, false);
  assert.equal(h.buttons[0].attributes.has('aria-busy'), false);
});

test('route, language or render changes prevent a delayed player from starting stale work', async () => {
  for (const change of [h => h.move('/categories/01'), h => { h.context.currentLanguage = 'en'; },
    h => { h.context.categorySongRenderToken++; h.buttons[0].isConnected = false; }]) {
    const ready = deferred(), h = harness({ ready });
    const attempt = h.activate(0); change(h); ready.resolve(h.dock); await attempt;
    assert.deepEqual(h.calls, []);
    assert.equal(h.buttons[0].status.textContent, '');
    assert.equal(h.buttons[0].disabled, false);
  }
});

test('a late rejected request cannot overwrite a newer successful song status', async () => {
  const h = harness(), oldGate = deferred();
  h.dock.play = id => {
    if (id === first) return oldGate.promise;
    h.state({ id, playing: true, pending: false, failed: false }); return Promise.resolve(true);
  };
  const old = h.activate(0); await flush();
  await h.activate(1);
  oldGate.reject(Error('Old media failure')); await old;
  assert.equal(h.buttons[0].status.textContent, '');
  assert.equal(h.buttons[1].status.textContent, '');
  assert.equal(h.buttons[1].dataset.state, 'playing');
});


test('subject and story modules play, pause and resume without changing their reader address', async () => {
  for (const songRoute of ['/fields/0011', '/concept-fables/0011-learning-story']) {
    const h = harness({ songRoute });
    await h.activate(0); await h.activate(0); await h.activate(0);
    assert.deepEqual(h.calls, [['play', first], ['pause', first], ['resume', first]]);
    assert.equal(h.route(), songRoute); assert.equal(h.buttons[0].dataset.state, 'playing');
  }
});

test('a delayed subject or story player cannot start after the reader changes route or language', async () => {
  for (const songRoute of ['/fields/0011', '/concept-fables/0011-learning-story']) {
    for (const change of [h => h.move('/fields/0021'), h => { h.context.currentLanguage = 'en'; },
      h => { h.context.categorySongRenderToken++; }]) {
      const ready = deferred(), h = harness({ ready, songRoute });
      const attempt = h.activate(0); change(h); ready.resolve(h.dock); await attempt;
      assert.deepEqual(h.calls, []); assert.equal(h.buttons[0].status.textContent, '');
      assert.equal(h.buttons[0].disabled, false);
    }
  }
});

test('a hidden module belonging to a different reader route cannot start playback', async () => {
  const h = harness({ songRoute: '/fields/0011' }); h.move('/fields/0021');
  await h.activate(0); assert.deepEqual(h.calls, []); assert.equal(h.buttons[0].status.textContent, '');
});
