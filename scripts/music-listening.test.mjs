import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';

const source = await readFile(new URL('../music/listening.js', import.meta.url), 'utf8');
const id = '11111111-1111-4111-8111-111111111111', other = '22222222-2222-4222-8222-222222222222';
const flush = async () => { for (let index = 0; index < 100; index++) await Promise.resolve(); };
function harness(storage = new Map()) {
  class Target {
    listeners = new Map();
    addEventListener(type, fn) { this.listeners.set(type, [...(this.listeners.get(type) || []), fn]); }
    emit(type) { for (const fn of this.listeners.get(type) || []) fn({ type }); }
  }
  let now = 0, fail = false, block = false, release, holdRead = false, releaseRead;
  const window = new Target(), document = new Target(), posts = [], requests = [];
  document.visibilityState = 'visible';
  const audio = Object.assign(new Target(), { paused: true, ended: false, error: null, seeking: false, currentTime: 0, duration: 120, playbackRate: 1 });
  const context = vm.createContext({ window, document, performance: { now: () => now }, crypto: { randomUUID }, AbortSignal,
    sessionStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) }, queueMicrotask, setInterval() {},
    fetch: async (url, options = {}) => {
      requests.push({ url, options });
      if (!options.body) {
        if (holdRead) { holdRead = false; await new Promise(resolve => { releaseRead = resolve; }); }
        return { ok: !fail, json: async () => ({ totals: [] }) };
      }
      const body = JSON.parse(options.body); posts.push(body);
      if (block) { block = false; await new Promise(resolve => { release = resolve; }); }
      return { ok: !fail, json: async () => ({ sessionId: body.sessionId, total: { id: body.id, starts: 1, listens: 0, completions: 0, skips: 0, earlySkips: 0, listenedMs: body.listenedMs } }) };
    },
  });
  vm.runInContext(source, context);
  const store = context.MapKAIMusicListening, tracker = store.createTracker(audio);
  return { store, tracker, audio, window, document, storage, posts, requests,
    playing() { audio.paused = false; audio.ended = false; audio.emit('playing'); },
    advance(seconds, wall = seconds) { now += wall * 1000; audio.currentTime += seconds; audio.emit('timeupdate'); },
    pause() { audio.paused = true; audio.emit('pause'); },
    seek(seconds) { audio.seeking = true; audio.currentTime = seconds; audio.emit('seeking'); audio.seeking = false; audio.emit('seeked'); },
    fail(value) { fail = value; }, block() { block = true; }, release() { release?.(); },
    blockRead() { holdRead = true; }, releaseRead() { releaseRead?.(); },
  };
}

test('only real playing starts a session; pauses and buffering do not add time or count as skips', async () => {
  const f = harness(); f.tracker.select(id); await flush(); assert.equal(f.posts.length, 0);
  f.playing(); await flush(); assert.equal(f.posts.length, 1); const sessionId = f.posts[0].sessionId;
  f.advance(20); f.pause(); await flush(); assert.equal(f.posts.at(-1).listenedMs, 20000);
  f.advance(10, 100); f.playing(); f.advance(10); await flush(); assert.equal(f.posts.at(-1).listenedMs, 30000);
  f.audio.emit('waiting'); f.advance(15, 80); f.playing(); f.advance(5); f.pause(); await flush();
  assert.equal(f.posts.at(-1).listenedMs, 35000);
  assert(f.posts.every(body => body.sessionId === sessionId && body.skipped === false));
});

test('seek jumps and replaying the same portion never manufacture a completion', async () => {
  const f = harness(); f.tracker.select(id); f.playing(); f.advance(20); f.seek(110); f.advance(10); f.pause(); await flush();
  assert.equal(f.posts.at(-1).listenedMs, 30000);
  f.seek(0); f.playing(); f.advance(20); f.pause(); await flush(); assert.equal(f.posts.at(-1).listenedMs, 30000);
  f.playing(); f.advance(80, 1); f.pause(); await flush(); assert.equal(f.posts.at(-1).listenedMs, 30000);
});

test('explicit changes and restarts mark the previous started session; natural endings do not', async () => {
  const f = harness(); f.tracker.select(id); f.playing(); f.advance(5); f.tracker.select(other, { restart: true });
  f.audio.currentTime = 0; f.playing(); f.advance(108); f.audio.ended = true; f.audio.paused = true; f.audio.emit('ended');
  f.tracker.select(id, { restart: true }); f.audio.currentTime = 0; f.playing(); await flush();
  const first = f.posts.filter(body => body.id === id)[1]; assert.equal(first.skipped, true); assert.equal(first.listenedMs, 5000);
  assert.equal(f.posts.filter(body => body.id === other).at(-1).listenedMs, 108000);
  assert(f.posts.filter(body => body.id === other).every(body => !body.skipped));
  assert.equal(new Set(f.posts.map(body => body.sessionId)).size, 3);
});

test('a page continuation restores the same session without counting navigation as a skip', async () => {
  const f = harness(); f.tracker.select(id); f.playing(); f.advance(20); f.window.emit('pagehide'); await flush();
  const sessionId = f.posts.at(-1).sessionId;
  const next = harness(f.storage); next.tracker.select(id, { restore: true }); next.audio.currentTime = 20;
  next.playing(); next.advance(10); await flush();
  assert.equal(next.posts.at(-1).sessionId, sessionId); assert.equal(next.posts.at(-1).listenedMs, 30000);
  assert(next.posts.every(body => !body.skipped));
});

test('switching away before a restoration plays cannot apply its session to another song', async () => {
  const f = harness(); f.tracker.select(id); f.playing(); f.advance(20); f.window.emit('pagehide'); await flush();
  const old = f.posts.at(-1).sessionId;
  const next = harness(f.storage); next.tracker.select(id, { restore: true }); next.tracker.select(other); next.audio.currentTime = 20; next.playing(); await flush();
  assert.equal(next.posts.at(-1).id, other); assert.notEqual(next.posts.at(-1).sessionId, old);
});

test('pagehide immediately sends a keepalive checkpoint even while an earlier write is pending', async () => {
  const f = harness(); f.block(); f.tracker.select(id); f.playing(); await flush();
  assert.equal(f.posts.length, 1); f.advance(25); f.window.emit('pagehide');
  assert.equal(f.posts.length, 2); assert.equal(f.posts.at(-1).listenedMs, 25000);
  assert.equal(f.requests.at(-1).options.keepalive, true);
  f.release(); await flush();
});

test('network failures never interrupt playback or invent shared totals', async () => {
  const f = harness(); f.fail(true); await f.store.refresh(); assert.equal(f.store.status().loaded, false);
  assert.equal(f.store.status().unavailable, true);
  f.tracker.select(id); f.playing(); f.advance(40); await flush();
  assert.equal(f.audio.paused, false); assert.equal(f.store.get(id).starts, 0);
});

test('a delayed summary cannot replace a later server-confirmed checkpoint with stale zeroes', async () => {
  const f = harness(); f.blockRead(); const refreshing = f.store.refresh();
  f.tracker.select(id); f.playing(); await flush(); assert.equal(f.store.get(id).starts, 1);
  f.releaseRead(); await refreshing;
  assert.equal(f.store.status().loaded, true); assert.equal(f.store.get(id).starts, 1);
});
