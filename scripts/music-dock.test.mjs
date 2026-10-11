import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const dockSource = await readFile(new URL('../music/dock.js', import.meta.url), 'utf8');
const syncSource = await readFile(new URL('../music/lyrics-sync.js', import.meta.url), 'utf8');
const firstId = 'c2a4a749-933b-4b4b-95fb-0d2d3f12ac6f';
const secondId = 'ccb37c55-bae6-4f72-a80a-d1bc94e40ae0';
const catalog = [firstId, secondId].map((id, index) => ({ id, title: `Song ${index + 1}`,
  url: `/api/music/audio?id=${id}`, language: 'en', aiGenerated: true,
  lyrics: '[Verse]\nFirst line\nSecond line',
  lyricsTiming: [{ line: 1, start: 2, end: 4 }, { line: 2, start: 6, end: 8 }],
}));
const deferred = () => {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
};
const flush = async () => { for (let count = 0; count < 12; count++) await Promise.resolve(); };

// Delayed catalog and media events run the actual dock source. The small DOM and
// page bridge model only browser/integration contracts, not playback decisions.
function harness({ saved = null, pageLoaded = null, pageFailed = false } = {}) {
  const ids = new Map(), elements = [];
  class Target {
    addEventListener(type, callback, options = {}) {
      const list = this.listeners?.get(type) || [];
      list.push({ callback, once: options.once });
      (this.listeners ||= new Map()).set(type, list);
    }
    dispatchEvent(event) {
      for (const entry of [...(this.listeners?.get(event.type) || [])]) {
        if (entry.once) this.listeners.set(event.type, this.listeners.get(event.type).filter(item => item !== entry));
        entry.callback(event);
      }
    }
  }
  class Element extends Target {
    constructor(tag) {
      super(); this.tagName = tag.toUpperCase(); this.children = []; this.dataset = {};
      this.hidden = false; this.textContent = ''; this.value = ''; this.clientWidth = 300; this.offsetWidth = 100;
      this.style = { setProperty() {} }; this.attributes = new Map();
      const classes = new Set();
      this.classList = { add: (...values) => values.forEach(value => classes.add(value)),
        contains: value => classes.has(value),
        toggle: (value, force) => { const next = force ?? !classes.has(value); next ? classes.add(value) : classes.delete(value); return next; } };
      elements.push(this);
    }
    set id(value) { this.identifier = value; ids.set(value, this); }
    get id() { return this.identifier; }
    set innerHTML(value) {
      // Fixed dock markup supplies the controls. Catalog data never enters this setter.
      for (const match of value.matchAll(/<([a-z]+)[^>]*\bid="([^"]+)"[^>]*>/g)) {
        const child = new Element(match[1]); child.id = match[2]; this.children.push(child);
      }
    }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = children; }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    removeAttribute(name) { this.attributes.delete(name); }
    get options() { return this.children; }
    getBoundingClientRect() { return { height: 160 }; }
  }
  const document = new Target();
  class Audio extends Element {
    constructor() {
      super('audio'); this.paused = true; this.ended = false; this.error = null;
      this.readyState = 0; this.duration = NaN; this.currentTime = 0; this.volume = 1; this.playCalls = 0;
    }
    set src(value) { this.source = value; this.currentTime = 0; this.readyState = 0; this.duration = NaN; }
    get src() { return this.source; }
    event(type) { const event = { type, target: this }; document.dispatchEvent(event); this.dispatchEvent(event); }
    play() { this.playCalls++; this.paused = false; queueMicrotask(() => this.event('play')); return Promise.resolve(); }
    pause() { const changed = !this.paused; this.paused = true; if (changed) queueMicrotask(() => this.event('pause')); }
    load() { this.paused = true; this.readyState = 0; this.currentTime = 0; }
    metadata(duration = 120) { this.readyState = 1; this.duration = duration; this.event('loadedmetadata'); }
  }
  document.body = new Element('body'); document.documentElement = new Element('html'); document.documentElement.lang = 'en';
  document.getElementById = id => ids.get(id) || null;
  document.createElement = tag => tag === 'audio' ? new Audio() : new Element(tag);
  document.querySelectorAll = selector => selector === 'audio,video' ? elements.filter(element => ['AUDIO', 'VIDEO'].includes(element.tagName)) : [];
  const window = new Target(), request = deferred();
  const stored = new Map(saved ? [['mapkaiMusicDock', JSON.stringify(saved)]] : []);
  let now = 10000, fetchCalls = 0, context;
  const pageState = { tracks: pageLoaded ? structuredClone(catalog) : [], track: null, audio: null,
    loaded: Boolean(pageLoaded), libraryFailed: pageFailed, pending: false, failed: false, complete: false, volume: 0.5, pendingPosition: null };
  const pageCalls = { load: 0, toggle: 0, play: 0, pause: 0 };
  const update = () => window.dispatchEvent({ type: 'mapkai:music-update' });
  const intent = () => window.dispatchEvent({ type: 'mapkai:music-intent' });
  if (pageLoaded !== null) {
    const choose = id => {
      pageState.track = pageState.tracks.find(track => track.id === id);
      pageState.audio = new Audio(); pageState.audio.src = pageState.track.url;
      pageState.audio.addEventListener('loadedmetadata', () => {
        if (pageState.pendingPosition !== null) { pageState.audio.currentTime = pageState.pendingPosition; pageState.pendingPosition = null; }
        update();
      });
    };
    window.MapKAIMusicPage = {
      snapshot: () => pageState,
      load: async () => {
        pageCalls.load++; pageState.libraryFailed = false; update();
        await request.promise; pageState.loaded = true; pageState.tracks = structuredClone(catalog); update();
      },
      toggle: () => {
        intent();
        pageCalls.toggle++;
        if (!pageState.loaded) return;
        if (!pageState.track) choose(firstId);
        if (!pageState.audio.paused) pageState.audio.pause(); else pageState.audio.play();
        update();
      },
      pause: () => { pageCalls.pause++; pageState.audio?.pause(); pageState.pending = false; update(); },
      play: id => { intent(); pageCalls.play++; choose(id); pageState.audio.play(); update(); },
      move: direction => {
        const index = pageState.tracks.findIndex(track => track.id === pageState.track?.id);
        const next = pageState.tracks[index + direction];
        if (next) window.MapKAIMusicPage.play(next.id);
      },
      seek: value => { intent(); if (pageState.audio) pageState.audio.currentTime = value / 1000 * pageState.audio.duration; },
      volume: value => { pageState.volume = value; update(); },
      restore: (id, seconds) => { choose(id); pageState.pendingPosition = seconds; pageState.audio.load(); update(); },
    };
  }
  context = vm.createContext({ document, window, URL, Event: class { constructor(type) { this.type = type; } },
    Date: class extends Date { static now() { return now; } },
    location: { href: 'https://www.mapkai.com/explore', origin: 'https://www.mapkai.com' },
    sessionStorage: { getItem: key => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value) },
    matchMedia: () => ({ matches: false, addEventListener() {} }), getComputedStyle: () => ({ paddingLeft: '0', paddingRight: '0' }),
    ResizeObserver: class { observe() {} }, MutationObserver: class { observe() {} },
    AbortSignal: { timeout: () => undefined },
    fetch: async () => {
      fetchCalls++; const data = await request.promise;
      return { ok: true, json: async () => vm.runInContext(`JSON.parse(${JSON.stringify(JSON.stringify(data))})`, context) };
    },
  });
  vm.runInContext(syncSource, context, { filename: 'music/lyrics-sync.js' });
  vm.runInContext(dockSource, context, { filename: 'music/dock.js' });
  return { control: id => ids.get(`music-dock-${id}`), ownAudio: elements.find(element => element.tagName === 'AUDIO'),
    request, fetchCalls: () => fetchCalls, page: window.MapKAIMusicPage, pageCalls, pageState,
    session: () => JSON.parse(stored.get('mapkaiMusicDock')),
    pagehide: () => window.dispatchEvent({ type: 'pagehide' }),
    tick: () => { now += 1100; },
    lesson: () => { const audio = new Audio(); audio.play(); return audio; },
  };
}

test('fresh visitor incurs no catalog/audio read until Play, then starts once after catalog arrival', async () => {
  const h = harness(); assert.equal(h.fetchCalls(), 0);
  const play = h.control('play').onclick(); assert.equal(h.fetchCalls(), 1);
  assert.equal(h.control('play').textContent, 'Cancel loading');
  h.request.resolve({ tracks: catalog }); await play; await flush();
  assert.equal(h.ownAudio.playCalls, 1); assert.equal(h.control('select').value, firstId);
});

test('cancel before a standalone catalog response prevents later playback', async () => {
  const h = harness(), play = h.control('play').onclick();
  await h.control('play').onclick(); h.request.resolve({ tracks: catalog }); await play; await flush();
  assert.equal(h.ownAudio.playCalls, 0);
});

test('lesson playback cancels catalog-waiting music before a delayed response', async () => {
  const h = harness(), play = h.control('play').onclick(), lesson = h.lesson(); await flush();
  h.request.resolve({ tracks: catalog }); await play; await flush();
  assert.equal(h.ownAudio.playCalls, 0); assert.equal(lesson.paused, false);
});

test('Music page first Play awaits the shared catalog and uses its audio only', async () => {
  const h = harness({ pageLoaded: false }), play = h.control('play').onclick();
  assert.equal(h.pageCalls.load, 1); assert.equal(h.pageCalls.toggle, 0);
  h.request.resolve(); await play; await flush();
  assert.equal(h.pageCalls.toggle, 1); assert.equal(h.pageState.audio.playCalls, 1); assert.equal(h.ownAudio.playCalls, 0);
});

test('Music page Cancel and external lessons invalidate the shared catalog waiter', async () => {
  for (const cancel of [h => h.control('play').onclick(), h => h.lesson()]) {
    const h = harness({ pageLoaded: false }), play = h.control('play').onclick();
    await cancel(h); await flush(); h.request.resolve(); await play; await flush();
    assert.equal(h.pageCalls.toggle, 0);
  }
});

test('an explicit Music card choice supersedes an older dock catalog retry', async () => {
  const h = harness({ pageLoaded: true, pageFailed: true }), retry = h.control('play').onclick();
  h.page.play(secondId); await flush(); h.request.resolve(); await retry; await flush();
  assert.equal(h.pageCalls.toggle, 0, 'old retry must not toggle the newer card choice');
  assert.equal(h.pageState.audio.paused, false);
});

test('dock dropdown selection supersedes its older Music catalog retry', async () => {
  const h = harness({ pageLoaded: true, pageFailed: true }), retry = h.control('play').onclick();
  h.control('select').value = secondId; h.control('select').onchange(); await flush();
  h.request.resolve(); await retry; await flush();
  assert.equal(h.pageCalls.toggle, 0); assert.equal(h.pageState.track.id, secondId); assert.equal(h.pageState.audio.paused, false);
});

test('Music restore preserves saved ID/time when the bridge catalog is already ready', async () => {
  const saved = { version: 1, id: firstId, seconds: 47.5, volume: 0.3, collapsed: true };
  const h = harness({ saved, pageLoaded: true });
  assert.equal(h.session().id, firstId); assert.equal(h.session().seconds, 47.5);
  assert.equal(h.pageState.audio.paused, true); assert.equal(h.pageState.pendingPosition, 47.5);
  h.pagehide(); assert.equal(h.session().seconds, 47.5);
  h.pageState.audio.metadata(); h.tick(); h.pagehide();
  assert.equal(h.pageState.audio.currentTime, 47.5); assert.equal(h.session().seconds, 47.5);
});

test('standalone restore keeps pending position and never automatically plays', async () => {
  const h = harness({ saved: { version: 1, id: firstId, seconds: 47.5, volume: 0.3, collapsed: false } });
  assert.equal(h.fetchCalls(), 1); h.request.resolve({ tracks: catalog }); await flush();
  h.pagehide(); assert.equal(h.session().id, firstId); assert.equal(h.session().seconds, 47.5);
  assert.equal(h.ownAudio.playCalls, 0); h.ownAudio.metadata();
  assert.equal(h.ownAudio.currentTime, 47.5);
});

test('archived/absent saved IDs are discarded after validated public catalog load', async () => {
  const h = harness({ saved: { version: 1, id: '6e294673-6d7c-4c16-8464-f43c88a4d3e2', seconds: 20, volume: 0.4, collapsed: false } });
  h.request.resolve({ tracks: catalog }); await flush(); h.pagehide();
  assert.equal(h.session().id, null); assert.equal(h.ownAudio.playCalls, 0);
});

test('dock shows a single original timed line, clears real gaps, and follows seeks without HTML', async () => {
  const h = harness(), play = h.control('play').onclick();
  h.request.resolve({ tracks: catalog }); await play; await flush(); h.ownAudio.metadata(10);
  h.ownAudio.currentTime = 2.5; h.ownAudio.event('timeupdate'); assert.equal(h.control('line').textContent, 'First line');
  h.ownAudio.currentTime = 4; h.ownAudio.event('timeupdate'); assert.equal(h.control('line').textContent, '');
  h.ownAudio.currentTime = 6.5; h.ownAudio.event('seeking'); assert.equal(h.control('line').textContent, 'Second line');
  h.ownAudio.currentTime = 2.5; h.ownAudio.event('seeked'); assert.equal(h.control('line').textContent, 'First line');
});
