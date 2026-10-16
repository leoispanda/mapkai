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
  let resolve, reject;
  const promise = new Promise((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
};
const flush = async () => { for (let count = 0; count < 12; count++) await Promise.resolve(); };

// Delayed catalog and media events run the actual dock source. The small DOM and
// page bridge model only browser/integration contracts, not playback decisions.
function harness({ saved = null, pageLoaded = null, pageFailed = false, playGate = null, playFailure = false, catalogFailure = false, continuous = 'on', initialMediaActions = [], playGates = [], audioSessionType = null, hidden = false, pagehideClearsIntent = false } = {}) {
  const ids = new Map(), elements = [], operations = [];
  class Target {
    addEventListener(type, callback, options = {}) {
      const list = this.listeners?.get(type) || [];
      list.push({ callback, once: options.once, capture: options === true || options.capture === true });
      (this.listeners ||= new Map()).set(type, list);
    }
    removeEventListener(type, callback) {
      this.listeners?.set(type, (this.listeners.get(type) || []).filter(entry => entry.callback !== callback));
    }
    dispatchEvent(event) {
      for (const entry of [...(this.listeners?.get(event.type) || [])].sort((a, b) => Number(b.capture) - Number(a.capture))) {
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
    set textContent(value) { this.text = value; if (this.identifier) operations.push('dom'); }
    get textContent() { return this.text; }
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
    set src(value) { operations.push('src'); this.source = value; this.currentTime = 0; this.readyState = 0; this.duration = NaN; this.ended = false; }
    get src() { return this.source; }
    event(type) { const event = { type, target: this }; document.dispatchEvent(event); this.dispatchEvent(event); }
    play() {
      this.playCalls++; operations.push('play');
      if (playFailure) return Promise.reject(Object.assign(new Error('Media unavailable'), { name: 'NotAllowedError' }));
      this.paused = false; queueMicrotask(() => this.event('play'));
      return (playGates.length ? playGates.shift() : playGate)?.promise || Promise.resolve();
    }
    pause() { operations.push('pause'); const changed = !this.paused; this.paused = true; if (changed) queueMicrotask(() => this.event('pause')); }
    load() { operations.push('load'); this.paused = true; this.readyState = 0; this.currentTime = 0; }
    metadata(duration = 120) { this.readyState = 1; this.duration = duration; this.event('loadedmetadata'); }
  }
  document.hidden = hidden; document.visibilityState = hidden ? 'hidden' : 'visible';
  document.body = new Element('body'); document.documentElement = new Element('html'); document.documentElement.lang = 'en';
  document.getElementById = id => ids.get(id) || null;
  document.createElement = tag => tag === 'audio' ? new Audio() : new Element(tag);
  document.querySelectorAll = selector => selector === 'audio,video' ? elements.filter(element => ['AUDIO', 'VIDEO'].includes(element.tagName)) : [];
  const window = new Target(), request = deferred(), mediaActions = new Map(initialMediaActions);
  const playbackStates = [], audioSessionTypes = []; let sessionType = audioSessionType;
  const audioSession = audioSessionType === null ? undefined : { get type() { return sessionType; }, set type(value) { audioSessionTypes.push(value); sessionType = value; } };
  const mediaSession = { set playbackState(value) { this.currentPlaybackState = value; playbackStates.push(value); }, get playbackState() { return this.currentPlaybackState; }, setActionHandler: (action, handler) => mediaActions.set(action, handler), setPositionState(value) { this.position = value; } };
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
      play: id => {
        intent(); pageCalls.play++; choose(id);
        const audio = pageState.audio; pageState.pending = true; pageState.failed = false; update();
        audio.play().then(() => {
          if (pageState.audio !== audio) return;
          pageState.pending = false; update();
        }, () => {
          if (pageState.audio !== audio) return;
          pageState.pending = false; pageState.failed = true; update();
        });
      },
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
  if (pagehideClearsIntent) window.addEventListener('pagehide', () => { pageState.playbackIntent = false; pageState.advancing = false; });
  context = vm.createContext({ document, window, URL, Event: class { constructor(type) { this.type = type; } },
    navigator: { mediaSession, audioSession }, MediaMetadata: class { constructor(value) { Object.assign(this, value); } },
    Date: class extends Date { static now() { return now; } },
    location: { href: 'https://www.mapkai.com/explore', origin: 'https://www.mapkai.com' },
    localStorage: { getItem: key => key === 'mapkaiMusicContinuous.v1' ? continuous : null },
    sessionStorage: { getItem: key => stored.get(key) ?? null, setItem: (key, value) => { operations.push('storage'); stored.set(key, value); } },
    matchMedia: () => ({ matches: false, addEventListener() {} }), getComputedStyle: () => ({ paddingLeft: '0', paddingRight: '0' }),
    ResizeObserver: class { observe() {} }, MutationObserver: class { observe() {} },
    AbortSignal: { timeout: () => undefined },
    fetch: async () => {
      fetchCalls++; const data = await request.promise;
      return { ok: !catalogFailure, json: async () => vm.runInContext(`JSON.parse(${JSON.stringify(JSON.stringify(data))})`, context) };
    },
  });
  vm.runInContext(syncSource, context, { filename: 'music/lyrics-sync.js' });
  vm.runInContext(dockSource, context, { filename: 'music/dock.js' });
  return { control: id => ids.get(`music-dock-${id}`), ownAudio: elements.find(element => element.tagName === 'AUDIO'),
    request, fetchCalls: () => fetchCalls, page: window.MapKAIMusicPage, pageCalls, pageState, dock: window.MapKAIMusicDock,
    session: () => JSON.parse(stored.get('mapkaiMusicDock')), mediaSession, mediaActions, playbackStates, operations, audioSession, audioSessionTypes,
    updatePage: update, visibility: () => { document.dispatchEvent({ type: 'visibilitychange' }); },
    pageshow: persisted => window.dispatchEvent({ type: 'pageshow', persisted }),
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

test('subject API rejects non-UUID values without catalog or audio reads', async () => {
  const h = harness();
  for (const id of [null, undefined, 7, {}, '', `/api/music/audio?id=${firstId}`, `${firstId} `]) {
    assert.equal(await h.dock.play(id), false);
  }
  assert.equal(h.fetchCalls(), 0); assert.equal(h.ownAudio.playCalls, 0); assert.equal(h.ownAudio.src, undefined);
});

test('subject API lazily validates a public ID and uses the existing standalone audio', async () => {
  const h = harness(), play = h.dock.play(secondId.toUpperCase());
  assert.equal(h.fetchCalls(), 1); assert.equal(h.ownAudio.src, undefined);
  h.request.resolve({ tracks: catalog }); assert.equal(await play, true); await flush();
  assert.equal(h.ownAudio.playCalls, 1); assert.equal(h.control('select').value, secondId);
  assert.equal(new URL(h.ownAudio.src).searchParams.get('id'), secondId);
});

test('absent and unsafe catalog tracks cannot be selected through the subject API', async () => {
  for (const tracks of [catalog.filter(track => track.id !== secondId),
    catalog.map(track => track.id === secondId ? { ...track, url: 'https://untrusted.example/audio.mp3' } : track)]) {
    const h = harness(), play = h.dock.play(secondId);
    h.request.resolve({ tracks }); assert.equal(await play, false);
    assert.equal(h.ownAudio.playCalls, 0); assert.equal(h.ownAudio.src, undefined);
  }
});

test('the latest subject choice wins a shared delayed standalone catalog', async () => {
  const h = harness(), older = h.dock.play(firstId), newer = h.dock.play(secondId);
  assert.equal(await older, false); assert.equal(h.fetchCalls(), 1);
  h.request.resolve({ tracks: catalog }); assert.equal(await newer, true); await flush();
  assert.equal(h.ownAudio.playCalls, 1); assert.equal(h.control('select').value, secondId);
});

test('Pause and lesson playback immediately cancel a subject catalog waiter', async () => {
  for (const cancel of [h => h.control('play').onclick(), h => h.lesson()]) {
    const h = harness(), play = h.dock.play(secondId);
    await cancel(h); await flush(); assert.equal(await play, false);
    h.request.resolve({ tracks: catalog }); await flush();
    assert.equal(h.ownAudio.playCalls, 0);
  }
});

test('explicit subject choice cannot be overwritten by first saved restore', async () => {
  const saved = { version: 1, id: firstId, seconds: 47.5, volume: 0.3, collapsed: false };
  const h = harness({ saved }), play = h.dock.play(secondId);
  h.request.resolve({ tracks: catalog }); assert.equal(await play, true); await flush();
  h.ownAudio.metadata(); h.pagehide();
  assert.equal(h.control('select').value, secondId); assert.equal(h.ownAudio.currentTime, 0);
  assert.equal(h.session().id, secondId); assert.equal(h.session().seconds, 0); assert.equal(h.ownAudio.volume, 0.3);
});

test('subject API reports catalog and standalone media failures', async () => {
  for (const options of [{ catalogFailure: true }, { playFailure: true }]) {
    const h = harness(options), play = h.dock.play(firstId);
    h.request.resolve({ tracks: catalog }); assert.equal(await play, false);
    assert.equal(h.ownAudio.paused, true);
  }
});

test('new subject choices and dropdown selection cancel older pending media starts', async () => {
  for (const dropdown of [false, true]) {
    const gate = deferred(), h = harness({ playGate: gate }), older = h.dock.play(firstId);
    h.request.resolve({ tracks: catalog }); await flush(); assert.equal(h.ownAudio.playCalls, 1);
    let newer;
    if (dropdown) { h.control('select').value = secondId; h.control('select').onchange(); }
    else newer = h.dock.play(secondId);
    assert.equal(await older, false); gate.resolve(); if (newer) assert.equal(await newer, true); await flush();
    assert.equal(h.control('select').value, secondId); assert.equal(h.ownAudio.paused, false);
  }
});

test('subject API awaits Music page playback and never starts a second audio', async () => {
  const gate = deferred(), h = harness({ pageLoaded: true, playGate: gate });
  let settled = false; const play = h.dock.play(secondId).then(value => { settled = true; return value; });
  await flush(); assert.equal(settled, false); assert.equal(h.pageCalls.play, 1); assert.equal(h.ownAudio.playCalls, 0);
  gate.resolve(); assert.equal(await play, true); assert.equal(h.pageState.track.id, secondId);
});

test('Pause cancels pending standalone and Music page media promises immediately', async () => {
  for (const pageLoaded of [null, true]) {
    const gate = deferred(), h = harness({ pageLoaded, playGate: gate }), play = h.dock.play(firstId);
    if (pageLoaded === null) h.request.resolve({ tracks: catalog });
    await flush(); await h.control('play').onclick(); assert.equal(await play, false);
    gate.resolve(); await flush();
    const audio = pageLoaded === null ? h.ownAudio : h.pageState.audio;
    assert.equal(audio.paused, true);
  }
});

test('subject API reports Music page media errors and cancellation without extra toggles', async () => {
  const failure = harness({ pageLoaded: true, playFailure: true });
  assert.equal(await failure.dock.play(firstId), false); assert.equal(failure.ownAudio.playCalls, 0);
  const gate = deferred(), h = harness({ pageLoaded: true, playGate: gate }), play = h.dock.play(firstId);
  await flush(); h.page.play(secondId); assert.equal(await play, false);
  gate.resolve(); await flush();
  assert.equal(h.pageState.track.id, secondId); assert.equal(h.pageState.audio.paused, false);
  assert.equal(h.pageCalls.toggle, 0); assert.equal(h.ownAudio.playCalls, 0);
});

test('Music page subject selection waits for the public catalog and honors Pause', async () => {
  for (const cancel of [false, true]) {
    const h = harness({ pageLoaded: false }), play = h.dock.play(secondId);
    assert.equal(h.pageCalls.load, 1); assert.equal(h.pageCalls.play, 0);
    if (cancel) { await h.control('play').onclick(); assert.equal(await play, false); }
    h.request.resolve(); if (!cancel) assert.equal(await play, true); await flush();
    assert.equal(h.pageCalls.play, cancel ? 0 : 1); assert.equal(h.ownAudio.playCalls, 0);
    if (!cancel) assert.equal(h.pageState.track.id, secondId);
  }
});

test('only an API-verified 180 BPM value labels the current song and dropdown', async () => {
  for (const [tempoBpm, visible] of [[180, true], [90, false], [null, false], ['180', false], [undefined, false]]) {
    const h = harness(), play = h.dock.play(firstId);
    h.request.resolve({ tracks: catalog.map(track => ({ ...track, tempoBpm, requestedTempoBpm: 180 })) });
    assert.equal(await play, true); await flush();
    assert.equal(h.control('tempo').hidden, !visible);
    assert.equal(h.control('select').options[1].textContent.includes('180 BPM'), visible);
    assert.equal(h.control('title').textContent, 'Song 1');
    assert.equal(h.ownAudio.playCalls, 1);
  }
});

test('Music page bridge preserves the 180 BPM label and clears it for the next 90 BPM song', async () => {
  const h = harness({ pageLoaded: true });
  h.pageState.tracks[0].tempoBpm = 180;
  h.pageState.tracks[1].tempoBpm = 90;
  assert.equal(await h.dock.play(firstId), true); await flush();
  assert.equal(h.control('tempo').hidden, false);
  assert.equal(h.control('tempo').textContent, '180 BPM · Running');
  assert.equal(await h.dock.play(secondId), true); await flush();
  assert.equal(h.control('tempo').hidden, true);
  assert.equal(h.ownAudio.playCalls, 0);
});


test('new documents always open the compact bar, even after an old expanded session', () => {
  for (const saved of [null, { version: 1, id: null, seconds: 0, volume: 0.5, collapsed: false }]) {
    const h = harness({ saved });
    assert.equal(h.control('body').hidden, true);
    assert.equal(h.control('collapse').attributes.get('aria-expanded'), 'false');
    assert.equal(h.control('mini-play').attributes.get('aria-label'), 'Play all');
    assert.equal(h.control('mini-prev').attributes.get('aria-label'), 'Previous');
    assert.equal(h.control('mini-next').attributes.get('aria-label'), 'Next');
    h.control('collapse').onclick(); assert.equal(h.control('body').hidden, false);
    h.pageshow(false); assert.equal(h.control('body').hidden, false, 'same document does not reset an intentional expansion');
  }
});

test('standalone selection keeps one audio and advances through the end of the full queue', async () => {
  const h = harness(), audio = h.ownAudio, play = h.dock.play(secondId);
  h.request.resolve({ tracks: catalog }); assert.equal(await play, true); await flush();
  audio.metadata(); audio.currentTime = audio.duration; audio.ended = true; audio.paused = true; audio.event('ended'); await flush();
  assert.equal(h.ownAudio, audio); assert.equal(audio.playCalls, 2);
  assert.equal(h.control('select').value, firstId);
  assert.equal(h.control('mini-prev').disabled, false); assert.equal(h.control('mini-next').disabled, false);
  h.control('mini-prev').onclick(); await flush(); assert.equal(h.control('select').value, secondId);
  h.control('mini-next').onclick(); await flush(); assert.equal(h.control('select').value, firstId);
  assert.equal(audio.playCalls, 4);
});

test('a playing session resumes once after metadata with its saved position', async () => {
  const saved = { version: 1, id: secondId, seconds: 47.5, volume: 0.3, collapsed: false, wasPlaying: true };
  const h = harness({ saved }); h.request.resolve({ tracks: catalog }); await flush();
  assert.equal(h.ownAudio.playCalls, 0, 'position is restored before playing');
  h.ownAudio.metadata(); await flush();
  assert.equal(h.ownAudio.currentTime, 47.5); assert.equal(h.ownAudio.playCalls, 1); assert.equal(h.ownAudio.paused, false);
  h.ownAudio.event('loadedmetadata'); h.pageshow(false); await flush(); assert.equal(h.ownAudio.playCalls, 1);
  h.pagehide(); assert.equal(h.session().wasPlaying, true); assert.equal(h.session().seconds, 47.5);
  assert.equal(h.ownAudio.paused, true, 'the outgoing document stops its audio after saving intent');
  h.pageshow(true); await flush(); assert.equal(h.ownAudio.playCalls, 2, 'back-forward cache return resumes once');
});

test('a blocked automatic restore stays paused with a Resume action and never loops attempts', async () => {
  const saved = { version: 1, id: firstId, seconds: 23, volume: 0.3, collapsed: true, wasPlaying: true };
  const h = harness({ saved, playFailure: true }); h.request.resolve({ tracks: catalog }); await flush();
  h.ownAudio.metadata(); await flush();
  assert.equal(h.ownAudio.playCalls, 1); assert.equal(h.ownAudio.paused, true);
  assert.equal(h.control('play').textContent, 'Resume');
  assert.match(h.control('status').textContent, /browser paused automatic playback/);
  h.ownAudio.event('timeupdate'); h.ownAudio.event('loadedmetadata'); h.pageshow(false); await flush();
  assert.equal(h.ownAudio.playCalls, 1); assert.equal(h.session().wasPlaying, false);
});

test('a paused session and a lesson that interrupts restore never trigger automatic playback', async () => {
  for (const wasPlaying of [false, true]) {
    const saved = { version: 1, id: firstId, seconds: 12, volume: 0.5, collapsed: true, wasPlaying };
    const h = harness({ saved }); h.request.resolve({ tracks: catalog }); await flush();
    if (wasPlaying) { h.lesson(); await flush(); }
    h.ownAudio.metadata(); await flush();
    assert.equal(h.ownAudio.playCalls, 0);
  }
});

test('a Music-page playing session resumes its restored bridge audio without a second audio', async () => {
  const saved = { version: 1, id: firstId, seconds: 31, volume: 0.5, collapsed: true, wasPlaying: true };
  const h = harness({ saved, pageLoaded: true }); h.pageState.audio.metadata(); await flush();
  assert.equal(h.pageCalls.toggle, 1); assert.equal(h.pageState.audio.currentTime, 31);
  assert.equal(h.pageState.audio.playCalls, 1); assert.equal(h.ownAudio.playCalls, 0);
});

test('Media Session controls use the current player, wrap the queue, and publish real position', async () => {
  const h = harness(), play = h.dock.play(firstId); h.request.resolve({ tracks: catalog }); await play; await flush();
  h.ownAudio.metadata(); h.ownAudio.currentTime = 15; h.ownAudio.event('timeupdate');
  assert.equal(h.mediaSession.metadata.title, 'Song 1'); assert.equal(h.mediaSession.playbackState, 'playing');
  assert.equal(h.mediaSession.position.position, 15);
  h.mediaActions.get('play')(); await flush(); assert.equal(h.ownAudio.playCalls, 1, 'system Play cannot pause a playing song');
  h.mediaActions.get('pause')(); await flush(); assert.equal(h.ownAudio.paused, true);
  h.mediaActions.get('play')(); await flush(); assert.equal(h.ownAudio.paused, false);
  h.mediaActions.get('seekto')({ seekTime: 50 }); assert.equal(h.ownAudio.currentTime, 50);
  h.mediaActions.get('seekbackward')({ seekOffset: 8 }); assert.equal(h.ownAudio.currentTime, 42);
  h.mediaActions.get('seekforward')({ seekOffset: 4 }); assert.equal(h.ownAudio.currentTime, 46);
  h.mediaActions.get('previoustrack')(); await flush(); assert.equal(h.control('select').value, secondId);
  assert.equal(h.mediaSession.metadata.title, 'Song 2');
});

test('Media Session delegates Music-page transport instead of starting dock audio', async () => {
  const h = harness({ pageLoaded: true }); await h.dock.play(firstId); await flush();
  h.mediaActions.get('nexttrack')(); await flush(); assert.equal(h.pageState.track.id, secondId);
  h.mediaActions.get('pause')(); await flush(); assert.equal(h.pageState.audio.paused, true);
  h.mediaActions.get('play')(); await flush(); assert.equal(h.pageState.audio.paused, false);
  assert.equal(h.ownAudio.playCalls, 0);
});


test('continuous off carries into the standalone dock and stops after the selected song', async () => {
  const h = harness({ continuous: 'off' }), play = h.dock.play(secondId);
  h.request.resolve({ tracks: catalog }); await play; await flush();
  h.ownAudio.metadata(); h.ownAudio.currentTime = h.ownAudio.duration; h.ownAudio.ended = true; h.ownAudio.paused = true;
  h.ownAudio.event('ended'); await flush();
  assert.equal(h.ownAudio.playCalls, 1); assert.equal(h.control('select').value, secondId);
  assert.equal(h.control('play').textContent, 'Replay'); assert.match(h.control('status').textContent, /Stop after this song/);
  await h.control('play').onclick(); await flush();
  assert.equal(h.control('select').value, secondId, 'single-song replay does not jump to the first song');
  assert.equal(h.ownAudio.playCalls, 2);
});

test('a dormant dock does not replace an existing Media Session owner', async () => {
  const foreignPause = () => {}, foreignNext = () => {};
  const h = harness({ initialMediaActions: [['pause', foreignPause], ['nexttrack', foreignNext]] });
  assert.equal(h.mediaActions.get('pause'), foreignPause); assert.equal(h.mediaActions.get('nexttrack'), foreignNext);
  assert.equal(h.mediaSession.metadata, undefined); assert.equal(h.fetchCalls(), 0);
});

test('a paused restored selection also leaves another Media Session owner alone', async () => {
  const foreignPause = () => {};
  const saved = { version: 1, id: firstId, seconds: 11, volume: 0.5, collapsed: true, wasPlaying: false };
  const h = harness({ saved, initialMediaActions: [['pause', foreignPause]] });
  h.request.resolve({ tracks: catalog }); await flush(); h.ownAudio.metadata(); await flush();
  assert.equal(h.mediaActions.get('pause'), foreignPause); assert.equal(h.mediaSession.metadata, undefined);
});

test('stale Music system controls do not leave later external media playing', async () => {
  const h = harness(), play = h.dock.play(firstId); h.request.resolve({ tracks: catalog }); await play; await flush();
  const lesson = h.lesson(); await flush();
  assert.equal(h.ownAudio.paused, true); assert.equal(lesson.paused, false);
  const previousCalls = h.ownAudio.playCalls;
  h.mediaActions.get('nexttrack')(); h.mediaActions.get('play')(); await flush();
  assert.equal(h.ownAudio.playCalls, previousCalls); assert.equal(lesson.paused, false);
  h.mediaActions.get('pause')(); await flush(); assert.equal(lesson.paused, true);
  lesson.metadata(); h.mediaActions.get('seekto')({ seekTime: 27 }); assert.equal(lesson.currentTime, 27);
  h.mediaActions.get('play')(); await flush();
  assert.equal(lesson.paused, false, 'system Play resumes the external owner after system Pause');
  assert.equal(h.ownAudio.playCalls, previousCalls, 'system Play cannot silently switch back to Music');
  h.mediaActions.get('stop')(); await flush(); assert.equal(lesson.paused, true);
  h.mediaActions.get('nexttrack')(); await flush(); assert.equal(h.ownAudio.playCalls, previousCalls);
  await h.control('mini-play').onclick(); await flush();
  assert.equal(h.ownAudio.paused, false, 'a deliberate Music control returns ownership to Music');
  assert.equal(h.ownAudio.playCalls, previousCalls + 1);
});


test('natural pause then ended keeps Media Session playing through delayed next play, including hidden pages', async () => {
  for (const hidden of [false, true]) {
    const nextGate = deferred(), h = harness({ hidden, playGates: [null, nextGate], audioSessionType: 'auto' });
    const play = h.dock.play(firstId); h.request.resolve({ tracks: catalog }); await play; await flush(); h.ownAudio.metadata();
    const statesStart = h.playbackStates.length;
    h.ownAudio.currentTime = h.ownAudio.duration; h.ownAudio.paused = true; h.ownAudio.ended = true;
    h.ownAudio.event('pause');
    assert.equal(h.mediaSession.playbackState, 'playing', 'real end pause cannot relinquish the lock-screen session');
    const operationsStart = h.operations.length; h.ownAudio.event('ended');
    const startOperations = h.operations.slice(operationsStart);
    assert.deepEqual(startOperations.slice(0, 2), ['src', 'play'], 'source and native play precede render, storage, pause, or load');
    assert.equal(h.ownAudio.playCalls, 2); assert.equal(h.control('select').value, secondId);
    assert.equal(h.mediaSession.playbackState, 'playing');
    assert.deepEqual(h.audioSessionTypes, ['playback'], 'automatic handoff retains its lease');
    h.mediaActions.get('play')(); await flush(); assert.equal(h.ownAudio.playCalls, 2, 'system Play during the gap is harmless');
    nextGate.resolve(); await flush();
    assert.ok(h.playbackStates.slice(statesStart).every(value => value === 'playing'));
    assert.equal(h.mediaSession.playbackState, 'playing');
  }
});

test('system Pause during delayed automatic handoff cancels immediately and releases the playback lease', async () => {
  const nextGate = deferred(), h = harness({ playGates: [null, nextGate], audioSessionType: 'ambient' });
  const play = h.dock.play(firstId); h.request.resolve({ tracks: catalog }); await play; await flush(); h.ownAudio.metadata();
  h.ownAudio.currentTime = h.ownAudio.duration; h.ownAudio.paused = true; h.ownAudio.ended = true;
  h.ownAudio.event('pause'); h.ownAudio.event('ended'); await flush();
  h.mediaActions.get('pause')();
  assert.equal(h.mediaSession.playbackState, 'paused'); assert.equal(h.audioSession.type, 'ambient');
  const statesStart = h.playbackStates.length; nextGate.resolve(); await flush(); h.visibility(); await flush();
  assert.equal(h.ownAudio.paused, true); assert.equal(h.ownAudio.playCalls, 2);
  assert.ok(h.playbackStates.slice(statesStart).every(value => value === 'paused'));
  assert.deepEqual(h.audioSessionTypes, ['playback', 'ambient']);
});

test('a real native pause near the end clears intent rather than treating elapsed time as an automatic end', async () => {
  const h = harness({ audioSessionType: 'auto' }), play = h.dock.play(firstId);
  h.request.resolve({ tracks: catalog }); await play; await flush(); h.ownAudio.metadata();
  h.ownAudio.currentTime = h.ownAudio.duration - 0.001; h.ownAudio.paused = true; h.ownAudio.ended = false; h.ownAudio.event('pause');
  assert.equal(h.mediaSession.playbackState, 'paused'); assert.equal(h.audioSession.type, 'auto');
  h.ownAudio.ended = true; h.ownAudio.event('ended'); await flush();
  assert.equal(h.ownAudio.playCalls, 1, 'a later stale ended event cannot restart user-paused playback');
});

test('continuous off truthfully ends the media session and releases its Audio Session', async () => {
  const h = harness({ continuous: 'off', audioSessionType: 'auto' }), play = h.dock.play(firstId);
  h.request.resolve({ tracks: catalog }); await play; await flush(); h.ownAudio.metadata();
  h.ownAudio.currentTime = h.ownAudio.duration; h.ownAudio.paused = true; h.ownAudio.ended = true;
  h.ownAudio.event('pause'); h.ownAudio.event('ended'); await flush();
  assert.equal(h.ownAudio.playCalls, 1); assert.equal(h.mediaSession.playbackState, 'paused');
  assert.deepEqual(h.audioSessionTypes, ['playback', 'auto']);
});

test('Audio Session is not acquired for dormant/restored-paused sessions or delegated Music-page playback', async () => {
  const fresh = harness({ audioSessionType: 'auto' }); fresh.visibility(); assert.deepEqual(fresh.audioSessionTypes, []);
  const saved = { version: 1, id: firstId, seconds: 12, volume: 0.5, collapsed: true, wasPlaying: false };
  const paused = harness({ saved, audioSessionType: 'auto' }); paused.request.resolve({ tracks: catalog }); await flush(); paused.ownAudio.metadata();
  assert.deepEqual(paused.audioSessionTypes, []);
  const bridge = harness({ pageLoaded: true, audioSessionType: 'auto' }); await bridge.dock.play(firstId); await flush();
  assert.deepEqual(bridge.audioSessionTypes, [], 'the app owns its lease when the dock delegates');
});

test('Audio Session recording and later foreign ownership are never overwritten', async () => {
  const recording = harness({ audioSessionType: 'play-and-record' }), play = recording.dock.play(firstId);
  recording.request.resolve({ tracks: catalog }); await play; await flush(); recording.mediaActions.get('pause')(); await flush();
  assert.deepEqual(recording.audioSessionTypes, []); assert.equal(recording.audioSession.type, 'play-and-record');
  const foreign = harness({ audioSessionType: 'auto' }), otherPlay = foreign.dock.play(firstId);
  foreign.request.resolve({ tracks: catalog }); await otherPlay; await flush(); foreign.audioSession.type = 'play-and-record';
  foreign.mediaActions.get('pause')(); await flush();
  assert.equal(foreign.audioSession.type, 'play-and-record'); assert.deepEqual(foreign.audioSessionTypes, ['playback', 'play-and-record']);
});

test('foreign media, playback failure, and pagehide release an owned Audio Session lease', async () => {
  for (const end of ['foreign', 'error', 'pagehide']) {
    const h = harness({ audioSessionType: 'auto' }), play = h.dock.play(firstId);
    h.request.resolve({ tracks: catalog }); await play; await flush();
    if (end === 'foreign') { h.lesson(); await flush(); }
    else if (end === 'error') { h.ownAudio.error = new Error('decode'); h.ownAudio.event('error'); }
    else h.pagehide();
    assert.equal(h.audioSession.type, 'auto', end); assert.deepEqual(h.audioSessionTypes, ['playback', 'auto'], end);
  }
  const denied = harness({ playFailure: true, audioSessionType: 'ambient' }), deniedPlay = denied.dock.play(firstId);
  denied.request.resolve({ tracks: catalog }); assert.equal(await deniedPlay, false); await flush();
  assert.deepEqual(denied.audioSessionTypes, ['playback', 'ambient']);
});

test('bridge handoff intent preserves Media Session through natural end and pending next start', async () => {
  const h = harness({ pageLoaded: true }); await h.dock.play(firstId); await flush(); h.pageState.audio.metadata();
  h.pageState.playbackIntent = true; h.pageState.advancing = false; h.pageState.continuousPlay = true;
  const start = h.playbackStates.length;
  h.pageState.audio.paused = true; h.pageState.audio.ended = true; h.updatePage();
  assert.equal(h.mediaSession.playbackState, 'playing', 'ended is sufficient before the app ended callback sets advancing');
  h.pageState.advancing = true; h.pageState.pending = true; h.pageState.audio.ended = false; h.updatePage();
  assert.equal(h.mediaSession.playbackState, 'playing');
  assert.ok(h.playbackStates.slice(start).every(value => value === 'playing'));
  h.pageState.playbackIntent = false; h.pageState.pending = false; h.pageState.advancing = false; h.updatePage();
  assert.equal(h.mediaSession.playbackState, 'paused');
});


test('a genuine native pause cancels a pending subject play immediately without awaiting its promise', async () => {
  const gate = deferred(), h = harness({ playGate: gate, audioSessionType: 'auto' });
  const play = h.dock.play(firstId); h.request.resolve({ tracks: catalog }); await flush();
  h.ownAudio.pause(); await flush();
  assert.equal(await play, false); assert.equal(h.mediaSession.playbackState, 'paused'); assert.equal(h.audioSession.type, 'auto');
  gate.resolve(); await flush(); assert.equal(h.ownAudio.paused, true); assert.equal(h.ownAudio.playCalls, 1);
});

test('capture-phase navigation save precedes a Music app pagehide intent cleanup', async () => {
  const h = harness({ pageLoaded: true, pagehideClearsIntent: true }); await h.dock.play(firstId); await flush();
  h.pageState.playbackIntent = true; h.pageState.audio.metadata(); h.pageState.audio.currentTime = 36;
  h.pagehide();
  assert.equal(h.session().wasPlaying, true); assert.equal(h.session().seconds, 36);
  assert.equal(h.pageState.playbackIntent, false); assert.equal(h.pageState.audio.paused, true);
});


test('late native play, playing, or promise settlement cannot resume a cancelled request', async () => {
  for (const late of ['play', 'playing', 'promise']) {
    const gate = deferred(), h = harness({ playGate: gate, audioSessionType: 'auto' });
    const play = h.dock.play(firstId); h.request.resolve({ tracks: catalog }); await flush();
    h.mediaActions.get('pause')(); await flush(); assert.equal(await play, false);
    h.ownAudio.paused = false;
    if (late !== 'promise') h.ownAudio.event(late);
    gate.resolve(); await flush();
    assert.equal(h.ownAudio.paused, true, late); assert.equal(h.mediaSession.playbackState, 'paused', late);
    assert.equal(h.audioSession.type, 'auto'); assert.equal(h.ownAudio.playCalls, 1);
  }
});

test('a stale native own play cannot pause the real external lesson owner', async () => {
  const gate = deferred(), h = harness({ playGate: gate });
  const play = h.dock.play(firstId); h.request.resolve({ tracks: catalog }); await flush(); await flush();
  const lesson = h.lesson(); await flush(); assert.equal(await play, false); assert.equal(lesson.paused, false);
  h.ownAudio.paused = false; h.ownAudio.event('play'); await flush();
  assert.equal(h.ownAudio.paused, true); assert.equal(lesson.paused, false);
  gate.resolve(); await flush(); assert.equal(lesson.paused, false);
});

test('a stale request settlement cannot pause a newer legitimate Music request or release its lease', async () => {
  const oldGate = deferred(), h = harness({ playGates: [oldGate, null], audioSessionType: 'auto' });
  const older = h.dock.play(firstId); h.request.resolve({ tracks: catalog }); await flush();
  const newer = h.dock.play(secondId); assert.equal(await older, false); assert.equal(await newer, true); await flush();
  oldGate.resolve(); h.ownAudio.event('playing'); await flush();
  assert.equal(h.ownAudio.paused, false); assert.equal(h.control('select').value, secondId);
  assert.equal(h.ownAudio.playCalls, 2); assert.equal(h.audioSession.type, 'playback');
  assert.equal(h.mediaSession.playbackState, 'playing');
});
