import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const appSource = await readFile(new URL('../music/app.js', import.meta.url), 'utf8');
const tempoSource = await readFile(new URL('../music/tempo.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../music/index.html', import.meta.url), 'utf8');
const catalog = [
  { id: '00000000-0000-4000-8000-000000000001', title: '001 First Question - MapKAI - Education - Feedback', subject: 'Education' },
  { id: '00000000-0000-4000-8000-000000000002', title: '002 Second Look - MapKAI - Arts - Context', subject: 'Arts' },
  { id: '00000000-0000-4000-8000-000000000003', title: '048 Before I Guess - MapKAI - Languages - Pragmatics', subject: 'Languages' },
].map(track => ({ ...track, url: `/api/music/audio?id=${track.id}`, language: 'en',
  aiGenerated: true, generationProvider: 'ElevenLabs', filename: 'original.mp3', durationSeconds: 120,
  description: 'A complete original recording.', lyrics: '[Verse]\nThe original line.\n\n[Chorus]\nKeep this ending.', lyricsTiming: [],
}));
const flush = async () => { for (let index = 0; index < 30; index++) await Promise.resolve(); };

// Execute the production app with a small DOM/media model. Tests drive user and
// native media events, not extracted copies of the queue implementation.
function harness({ savedContinuous = null, failPlay = false, songs = catalog, audioSession = null } = {}) {
  const trace = [], snapshots = [];
  const ids = new Map(), all = [], values = new Map(), scores = new Map();
  if (savedContinuous) values.set('mapkaiMusicContinuous.v1', savedContinuous);
  class Target {
    addEventListener(type, callback) { const callbacks = this.listeners?.get(type) || []; callbacks.push(callback); (this.listeners ||= new Map()).set(type, callbacks); }
    dispatchEvent(event) { trace.push(['event', event.type]); event.target ||= this; for (const callback of [...(this.listeners?.get(event.type) || [])]) callback(event); return true; }
  }
  class Element extends Target {
    constructor(tag) {
      super(); this.tagName = tag.toUpperCase(); this.children = []; this.attributes = new Map(); this.dataset = {};
      this.hidden = false; this.value = ''; this.textContent = ''; this.style = { setProperty() {} };
      this.offsetWidth = 100; this.clientWidth = 300; this.open = false;
      const classes = new Set();
      this.classList = { add: value => classes.add(value), remove: value => classes.delete(value), contains: value => classes.has(value),
        toggle: (value, force) => { const next = force ?? !classes.has(value); next ? classes.add(value) : classes.delete(value); } };
      all.push(this);
    }
    set id(value) { this.identifier = value; ids.set(value, this); }
    get id() { return this.identifier; }
    get isConnected() { return Boolean(this.parentNode) || this === document.body; }
    append(...items) { for (const item of items) { item.remove(); item.parentNode = this; this.children.push(item); } }
    insertBefore(item, before) { if (item === before) return; item.remove(); const index = before ? this.children.indexOf(before) : -1; item.parentNode = this; this.children.splice(index < 0 ? this.children.length : index, 0, item); }
    replaceChildren(...items) { for (const item of [...this.children]) item.remove(); this.append(...items); }
    remove() { if (this.parentNode) this.parentNode.children.splice(this.parentNode.children.indexOf(this), 1); this.parentNode = null; }
    set hidden(value) { this.hiddenValue = value; trace.push(['dom', 'hidden']); }
    get hidden() { return this.hiddenValue; }
    setAttribute(name, value) { trace.push(['dom', 'attribute']); this.attributes.set(name, String(value)); }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    removeAttribute(name) { this.attributes.delete(name); }
    get options() { return this.children; }
    focus() { document.activeElement = this; }
    select() {}
    reset() {}
    showModal() { this.open = true; }
    close() { this.open = false; this.dispatchEvent({ type: 'close' }); }
  }
  class Audio extends Element {
    constructor() { super('audio'); this.paused = true; this.ended = false; this.error = null; this.readyState = 0; this.duration = NaN; this.currentTime = 0; this.volume = 1; this.playCalls = 0; this.loadCalls = 0; this.pauseCalls = 0; }
    set src(value) { trace.push(['src', value]); this.source = value; this.ended = false; this.error = null; this.currentTime = 0; this.readyState = 0; this.duration = NaN; }
    get src() { return this.source || ''; }
    event(type) { this.dispatchEvent({ type, target: this }); }
    play() {
      this.playCalls++; trace.push(['play', this.src]);
      if (failPlay) return Promise.reject(Object.assign(new Error('Playback requires a gesture'), { name: 'NotAllowedError' }));
      this.paused = false; this.ended = false;
      const gate = this.nextPlay; this.nextPlay = null;
      queueMicrotask(() => { this.event('play'); if (!gate) this.event('playing'); }); return gate?.promise || Promise.resolve();
    }
    pause() { this.pauseCalls++; trace.push(['pause']); const changed = !this.paused; this.paused = true; if (changed) queueMicrotask(() => this.event('pause')); }
    load() { this.loadCalls++; trace.push(['load']); this.paused = true; this.readyState = 0; this.currentTime = 0; this.ended = false; this.error = null; }
    metadata() { this.readyState = 4; this.duration = 120; this.event('loadedmetadata'); }
    finish() { this.paused = true; this.ended = true; this.currentTime = this.duration; this.event('ended'); }
  }
  const document = new Target(); document.body = new Element('body'); document.documentElement = new Element('html');
  document.createElement = tag => tag === 'audio' ? new Audio() : new Element(tag);
  document.createElementNS = (_, tag) => new Element(tag);
  for (const match of html.matchAll(/<([a-z]+)[^>]*\bid="([^"]+)"([^>]*)>/g)) {
    const element = document.createElement(match[1]); element.id = match[2]; element.hidden = /\bhidden\b/.test(match[3]); document.body.append(element);
  }
  ids.get('song-sort').value = 'rank';
  const allSubjects = new Element('option'); allSubjects.value = ''; ids.get('subject-filter').append(allSubjects);
  const brand = new Element('a'), description = new Element('meta');
  document.querySelector = selector => selector === '.brand' ? brand : selector === 'meta[name=description]' ? description : null;
  document.querySelectorAll = () => [];
  document.getElementById = id => ids.get(id) || null;
  const window = new Target();
  let preferenceListener, currentSongs = songs, fetchCalls = 0;
  const preferences = {
    get: id => ({ known: true, likes: Math.max(0, scores.get(id) || 0), dislikes: Math.max(0, -(scores.get(id) || 0)), score: scores.get(id) || 0, pending: false }),
    status: () => ({ loaded: true, sessionRecovery: true }),
    compare: (a, b) => (scores.get(b.id) || 0) - (scores.get(a.id) || 0) || Number(a.title.slice(0, 3)) - Number(b.title.slice(0, 3)),
    subscribe: callback => { preferenceListener = callback; }, refresh() {}, vote() {},
  };
  const context = vm.createContext({ window, document, URL, Event: class { constructor(type) { this.type = type; } },
    location: { href: 'https://www.mapkai.com/music/', origin: 'https://www.mapkai.com' },
    navigator: audioSession ? { audioSession } : {},
    localStorage: { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) },
    MapKAIMusicPreferences: preferences,
    matchMedia: () => ({ matches: false, addEventListener() {} }), getComputedStyle: () => ({ paddingLeft: '0', paddingRight: '0' }),
    AbortController, setTimeout, clearTimeout, queueMicrotask,
    fetch: async () => { fetchCalls++; return { ok: true, json: async () => ({ tracks: structuredClone(currentSongs), nextCursor: null }) }; },
  });
  vm.runInContext(tempoSource, context, { filename: 'music/tempo.js' });
  vm.runInContext(appSource, context, { filename: 'music/app.js' });
  window.addEventListener('mapkai:music-update', () => snapshots.push(window.MapKAIMusicPage.snapshot()));
  return {
    trace, snapshots,
    delayNext: () => { let resolve, reject; const gate = { promise: new Promise((done, fail) => { resolve = done; reject = fail; }), resolve: value => resolve(value), reject: value => reject(value) }; window.MapKAIMusicPage.snapshot().audio.nextPlay = gate; return gate; },
    visibility: value => { document.visibilityState = value; document.dispatchEvent({ type: 'visibilitychange' }); },
    foreignPlay: () => { const audio = new Audio(); audio.paused = false; document.dispatchEvent({ type: 'play', target: audio }); return audio; },
    pagehide: () => window.dispatchEvent({ type: 'pagehide' }),
    page: window.MapKAIMusicPage, element: id => ids.get(id), rows: () => ids.get('tracks').children,
    allAudio: () => all.filter(element => element.tagName === 'AUDIO'),
    click: element => element.dispatchEvent({ type: 'click' }),
    input: (id, value, event = 'input') => { const element = ids.get(id); element.value = value; element.dispatchEvent({ type: event }); },
    rank: (id, score) => { scores.set(id, score); preferenceListener(); },
    setSongs: next => { currentSongs = next; }, values,
    details: row => row.children.find(element => element.className === 'track-details'),
    original: row => row.children.find(element => element.className === 'track-details').children[1].children.find(element => element.className === 'track-original-lyrics').children[1],
  };
}

test('loading the library does not start audio and creates only preview plus one queue player', async () => {
  const h = harness(); await flush();
  assert.equal(h.page.snapshot().loaded, true);
  assert.equal(h.rows().length, 3);
  assert.equal(h.allAudio().length, 2);
  assert.equal(h.allAudio().reduce((sum, audio) => sum + audio.playCalls, 0), 0);
});

test('choosing any row continues to the next song using the same media element', async () => {
  const h = harness(); await flush(); h.click(h.rows()[1].children[0]); await flush();
  const audio = h.page.snapshot().audio; audio.metadata(); audio.finish(); await flush();
  assert.equal(h.page.snapshot().track.id, catalog[2].id);
  assert.equal(h.page.snapshot().audio, audio);
  assert.equal(audio.paused, false);
  assert.equal(audio.src, `https://www.mapkai.com${catalog[2].url}`);
});

test('last song wraps to first and manual previous/next also wrap', async () => {
  const h = harness(); await flush(); h.page.play(catalog[2].id); await flush();
  const audio = h.page.snapshot().audio; audio.metadata(); audio.finish(); await flush();
  assert.equal(h.page.snapshot().track.id, catalog[0].id);
  h.page.move(-1); await flush(); assert.equal(h.page.snapshot().track.id, catalog[2].id);
  h.page.move(1); await flush(); assert.equal(h.page.snapshot().track.id, catalog[0].id);
});

test('a one-song queue repeats on its existing player', async () => {
  const h = harness({ songs: [catalog[0]] }); await flush(); h.page.play(catalog[0].id); await flush();
  const audio = h.page.snapshot().audio; audio.metadata(); audio.finish(); await flush();
  assert.equal(audio.paused, false); assert.equal(audio.currentTime, 0); assert.equal(audio.playCalls, 2);
});

test('turning continuous playback off is persistent and stops at the end', async () => {
  const h = harness({ savedContinuous: 'off' }); await flush(); h.page.play(catalog[1].id); await flush();
  const audio = h.page.snapshot().audio; audio.metadata(); audio.finish(); await flush();
  assert.equal(h.page.snapshot().track.id, catalog[1].id); assert.equal(audio.paused, true);
  const checkbox = h.element('continuous-play'); checkbox.checked = true; checkbox.dispatchEvent({ type: 'change' });
  assert.equal(h.values.get('mapkaiMusicContinuous.v1'), 'on');
});

test('search and subject filters find songs without pausing, seeking, or shrinking the active queue', async () => {
  const h = harness(); await flush(); h.page.play(catalog[0].id); await flush();
  const audio = h.page.snapshot().audio; audio.metadata(); audio.currentTime = 32;
  h.input('song-search', '048 pragmatics'); h.input('subject-filter', 'Languages', 'change');
  assert.equal(h.rows().filter(row => !row.hidden).length, 1);
  assert.equal(audio.paused, false); assert.equal(audio.currentTime, 32);
  audio.finish(); await flush(); assert.equal(h.page.snapshot().track.id, catalog[1].id);
  h.input('song-search', ''); h.input('subject-filter', '', 'change');
  assert.equal(h.rows().filter(row => !row.hidden).length, 3); assert.equal(audio.paused, false);
});

test('BPM estimates and ambiguity appear on rows; near-180 filtering composes without changing playback', async () => {
  const estimate = { bpmCandidates: [90, 180], confidence: 'strong', metricalAmbiguity: true,
    sectionAmbiguity: false, near180: true, analyzedAt: '2026-10-18' };
  const songs = catalog.map((track, index) => ({ ...track, tempoEstimate: index === 0 ? estimate : index === 1
    ? { ...estimate, bpmCandidates: [95, 190], near180: false }
    : { ...estimate, bpmCandidates: [172, 344], sectionAmbiguity: true, confidence: 'review' } }));
  const h = harness({ songs }); await flush();
  assert.equal(h.element('song-controls-1-tempo').textContent, '≈90 / 180 BPM · 半/倍速待定');
  assert.match(h.element('song-controls-3-tempo').textContent, /分段待核/);
  h.page.play(catalog[1].id); await flush(); const audio = h.page.snapshot().audio; audio.metadata(); audio.currentTime = 32;
  h.input('tempo-filter', 'near180', 'change');
  assert.equal(h.rows().filter(row => !row.hidden).length, 1);
  assert.equal(audio.paused, false); assert.equal(audio.currentTime, 32);
  h.input('subject-filter', 'Arts', 'change');
  assert.equal(h.rows().filter(row => !row.hidden).length, 0);
  h.input('subject-filter', 'Education', 'change'); h.input('song-search', '001');
  assert.equal(h.rows().filter(row => !row.hidden).length, 1);
  audio.finish(); await flush(); assert.equal(h.page.snapshot().track.id, catalog[2].id);
  assert.equal(h.page.snapshot().audio, audio); assert.equal(audio.paused, false);
  h.click(h.element('clear-search'));
  assert.equal(h.element('tempo-filter').value, ''); assert.equal(h.element('subject-filter').value, '');
  assert.equal(h.element('song-search').value, ''); assert.equal(h.rows().filter(row => !row.hidden).length, 3);
});

test('missing or invalid BPM estimates stay unknown and creation targets do not pass the tempo filter', async () => {
  const songs = catalog.map(track => ({ ...track, requestedTempoBpm: 180, tempoEstimate: { bpmCandidates: [180] } }));
  const h = harness({ songs }); await flush();
  assert.equal(h.element('song-controls-1-tempo').textContent, 'BPM 待检测');
  h.input('tempo-filter', 'near180', 'change');
  assert.equal(h.rows().filter(row => !row.hidden).length, 0);
});

test('selecting a one-result search retains the complete library queue', async () => {
  const h = harness(); await flush(); h.input('song-search', '048'); h.click(h.rows()[2].children[0]); await flush();
  const audio = h.page.snapshot().audio; audio.metadata(); audio.finish(); await flush();
  assert.equal(h.page.snapshot().track.id, catalog[0].id);
});

test('shared vote reorder and number sorting preserve selection, audio node, time, and originals', async () => {
  const h = harness(); await flush(); h.page.play(catalog[1].id); await flush();
  const audio = h.page.snapshot().audio; audio.metadata(); audio.currentTime = 42;
  h.rank(catalog[2].id, 5); assert.equal(h.rows()[0].children[0].children[0].textContent, '048');
  h.input('song-sort', 'number', 'change'); assert.equal(h.rows()[0].children[0].children[0].textContent, '001');
  h.input('song-sort', 'newest', 'change'); assert.equal(h.rows()[0].children[0].children[0].textContent, '048');
  assert.equal(h.page.snapshot().track.id, catalog[1].id); assert.equal(h.page.snapshot().audio, audio);
  assert.equal(audio.currentTime, 42); assert.equal(audio.paused, false);
  assert.equal(h.original(h.rows().find(row => row.children[0].children[0].textContent === '002')).textContent, catalog[1].lyrics);
});

test('song detail panels keep the complete name and lyrics and open only one at a time', async () => {
  const h = harness(); await flush();
  assert.equal(h.details(h.rows()[0]).open, false);
  const one = h.details(h.rows()[0]), two = h.details(h.rows()[1]);
  one.open = true; one.dispatchEvent({ type: 'toggle' }); two.open = true; two.dispatchEvent({ type: 'toggle' });
  assert.equal(one.open, false); assert.equal(two.open, true);
  assert.equal(two.children[1].children[0].textContent, catalog[1].title);
  assert.equal(h.original(h.rows()[1]).textContent, catalog[1].lyrics);
});

test('removing a different library song never clears the shared playing audio', async () => {
  const h = harness(); await flush(); h.page.play(catalog[1].id); await flush();
  const audio = h.page.snapshot().audio; audio.metadata(); audio.currentTime = 28;
  h.setSongs(catalog.slice(1)); await h.page.load(); await flush();
  assert.equal(h.page.snapshot().audio, audio); assert.equal(audio.paused, false); assert.equal(audio.currentTime, 28);
});

test('bridge restore is paused until toggle and applies the saved position when metadata arrives', async () => {
  const h = harness(); await flush(); h.page.restore(catalog[2].id, 37);
  const audio = h.page.snapshot().audio; assert.equal(audio.playCalls, 0); assert.equal(h.page.snapshot().pendingPosition, 37);
  audio.metadata(); assert.equal(audio.currentTime, 37);
  const play = h.page.toggle(); assert.equal(typeof play?.then, 'function'); await play; await flush();
  assert.equal(audio.currentTime, 37); assert.equal(audio.paused, false);
});

test('browser autoplay denial becomes a recoverable error without an automatic retry loop', async () => {
  const h = harness({ failPlay: true }); await flush(); h.page.play(catalog[0].id); await flush();
  assert.equal(h.page.snapshot().failed, true); assert.equal(h.page.snapshot().pending, false);
  assert.equal(h.page.snapshot().audio.playCalls, 1);
});


test('native pause with ended=true retains continuation intent until the same-task next play request', async () => {
  const h = harness(); await flush(); await h.page.play(catalog[0].id); await flush();
  const audio = h.page.snapshot().audio; audio.metadata();
  const gate = h.delayNext(); const loads = audio.loadCalls, pauses = audio.pauseCalls;
  audio.currentTime = audio.duration; audio.paused = true; audio.ended = true; audio.event('pause');
  assert.equal(h.page.snapshot().playbackIntent, true); assert.equal(h.page.snapshot().advancing, true);
  assert.equal(h.page.snapshot().pending, true);
  h.trace.length = 0;
  audio.ended = true; audio.event('ended');
  const firstNativePlay = h.trace.findIndex(entry => entry[0] === 'play');
  const firstUI = h.trace.findIndex(entry => entry[0] === 'dom' || entry[0] === 'event' && entry[1].startsWith('mapkai:'));
  assert.ok(firstNativePlay >= 0 && firstUI > firstNativePlay, JSON.stringify(h.trace.slice(0, 12)));
  assert.equal(audio.loadCalls, loads); assert.equal(audio.pauseCalls, pauses);
  assert.equal(h.page.snapshot().audio, audio); assert.equal(h.page.snapshot().track.id, catalog[1].id);
  assert.equal(h.page.snapshot().advancing, true); assert.equal(h.page.snapshot().playbackIntent, true);
  await flush(); assert.equal(h.page.snapshot().pending, true);
  gate.resolve(); await flush();
  assert.equal(h.page.snapshot().advancing, false); assert.equal(h.page.snapshot().pending, false);
  assert.equal(audio.paused, false);
});

test('explicit pause during a pending automatic handoff wins over a late play promise', async () => {
  const h = harness(); await flush(); await h.page.play(catalog[0].id); await flush();
  const audio = h.page.snapshot().audio; audio.metadata(); const gate = h.delayNext();
  audio.finish(); await flush(); assert.equal(h.page.snapshot().advancing, true);
  h.page.pause(); assert.equal(h.page.snapshot().playbackIntent, false); assert.equal(h.page.snapshot().advancing, false);
  // An awkward platform callback must never override a later explicit pause.
  audio.paused = false; gate.resolve(); await flush();
  assert.equal(audio.paused, true); assert.equal(h.page.snapshot().pending, false);
  assert.equal(audio.playCalls, 2);
  audio.currentTime = 120; audio.ended = true; audio.event('ended'); await flush();
  assert.equal(audio.playCalls, 2);
});

test('native pause away from the actual endpoint cancels intent and blocks a later ended advance', async () => {
  const h = harness(); await flush(); await h.page.play(catalog[0].id); await flush();
  const audio = h.page.snapshot().audio; audio.metadata(); audio.currentTime = 60; audio.paused = true; audio.event('pause');
  assert.equal(h.page.snapshot().playbackIntent, false); assert.equal(h.page.snapshot().advancing, false);
  audio.finish(); await flush(); assert.equal(audio.playCalls, 1); assert.equal(h.page.snapshot().track.id, catalog[0].id);
});

test('hidden and visible events never resume a paused player or create another play request', async () => {
  const h = harness(); await flush(); await h.page.play(catalog[0].id); await flush();
  const audio = h.page.snapshot().audio; audio.metadata(); h.page.pause(); await flush();
  h.visibility('hidden'); h.visibility('visible'); await flush();
  assert.equal(audio.playCalls, 1); assert.equal(audio.paused, true); assert.equal(h.page.snapshot().playbackIntent, false);
});

test('playback failure during automatic handoff clears intent and does not retry', async () => {
  const h = harness(); await flush(); await h.page.play(catalog[0].id); await flush();
  const audio = h.page.snapshot().audio; audio.metadata(); const gate = h.delayNext(); audio.finish();
  gate.reject(Object.assign(new Error('Background play denied'), { name: 'NotAllowedError' })); await flush();
  assert.equal(h.page.snapshot().failed, true); assert.equal(h.page.snapshot().playbackIntent, false);
  assert.equal(h.page.snapshot().advancing, false); assert.equal(audio.paused, true); assert.equal(audio.playCalls, 2);
});

function session(initialType = 'auto') {
  let type = initialType; const writes = [];
  return { get type() { return type; }, set type(value) { writes.push(value); type = value; }, writes };
}

test('AudioSession lease starts only for a true play, survives automatic handoff, and restores on pause', async () => {
  const audioSession = session(), h = harness({ audioSession }); await flush();
  assert.deepEqual(audioSession.writes, []);
  await h.page.play(catalog[0].id); await flush(); assert.deepEqual(audioSession.writes, ['playback']);
  const audio = h.page.snapshot().audio; audio.metadata(); const gate = h.delayNext();
  audio.currentTime = 120; audio.paused = true; audio.ended = true; audio.event('pause'); audio.event('ended'); await flush();
  assert.deepEqual(audioSession.writes, ['playback']);
  gate.resolve(); await flush(); h.page.pause();
  assert.deepEqual(audioSession.writes, ['playback', 'auto']);
});

test('AudioSession is optional and a recording session or existing playback ownership is not changed', async () => {
  for (const type of ['play-and-record', 'playback']) {
    const audioSession = session(type), h = harness({ audioSession }); await flush();
    await h.page.play(catalog[0].id); await flush(); h.page.pause();
    assert.deepEqual(audioSession.writes, []); assert.equal(audioSession.type, type);
  }
  const h = harness(); await flush(); await h.page.play(catalog[0].id); await flush(); h.page.pause();
  assert.equal(h.page.snapshot().failed, false);
});

test('an AudioSession lease does not overwrite a new recording owner, and failure restores its own prior type', async () => {
  const changed = session('ambient'), h = harness({ audioSession: changed }); await flush();
  await h.page.play(catalog[0].id); await flush(); changed.type = 'play-and-record'; h.page.pause();
  assert.deepEqual(changed.writes, ['playback', 'play-and-record']);
  const failed = session('ambient'), rejected = harness({ audioSession: failed, failPlay: true }); await flush();
  await rejected.page.play(catalog[0].id); await flush();
  assert.deepEqual(failed.writes, ['playback', 'ambient']); assert.equal(rejected.page.snapshot().playbackIntent, false);
});

test('foreign media and navigation release the local AudioSession lease and cancel continuation', async () => {
  const audioSession = session(), h = harness({ audioSession }); await flush();
  await h.page.play(catalog[0].id); await flush(); h.foreignPlay(); await flush();
  assert.equal(h.page.snapshot().playbackIntent, false); assert.equal(audioSession.type, 'auto');
  await h.page.play(catalog[1].id); await flush(); h.pagehide();
  assert.equal(h.page.snapshot().playbackIntent, false); assert.equal(audioSession.type, 'auto');
});


test('continuous-off native pause and ended release the lease without an advancing gap', async () => {
  const audioSession = session(), h = harness({ audioSession, savedContinuous: 'off' }); await flush();
  await h.page.play(catalog[0].id); await flush(); const audio = h.page.snapshot().audio; audio.metadata();
  audio.currentTime = 120; audio.paused = true; audio.event('pause');
  assert.equal(h.page.snapshot().advancing, false); assert.equal(h.page.snapshot().playbackIntent, false);
  audio.ended = true; audio.event('ended'); await flush();
  assert.equal(audio.playCalls, 1); assert.deepEqual(audioSession.writes, ['playback', 'auto']);
});

test('an unsupported AudioSession type setter does not prevent ordinary playback or pause', async () => {
  const audioSession = { get type() { return 'auto'; }, set type(_) { throw new Error('Unsupported'); } };
  const h = harness({ audioSession }); await flush(); await h.page.play(catalog[0].id); await flush();
  assert.equal(h.page.snapshot().audio.paused, false); assert.equal(h.page.snapshot().playbackIntent, true);
  h.page.pause(); assert.equal(h.page.snapshot().audio.paused, true);
});


test('a pause at duration without a native ended flag is respected as a stop', async () => {
  const h = harness(); await flush(); await h.page.play(catalog[0].id); await flush();
  const audio = h.page.snapshot().audio; audio.metadata(); audio.currentTime = audio.duration;
  audio.paused = true; audio.ended = false; audio.event('pause');
  assert.equal(h.page.snapshot().playbackIntent, false); assert.equal(h.page.snapshot().advancing, false);
  audio.ended = true; audio.event('ended'); await flush(); assert.equal(audio.playCalls, 1);
});
