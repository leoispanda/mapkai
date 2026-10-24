import test from 'node:test';
import assert from 'node:assert/strict';
import { createBluetoothTest } from '../music/bluetooth/controller.js';

class AudioStub extends EventTarget {
  currentTime = 0; paused = true; error = null; playCalls = 0;
  async play() {
    this.playCalls += 1;
    if (this.rejected) throw new Error('Playback denied');
    if (this.gate) await this.gate;
    this.paused = false; this.dispatchEvent(new Event('playing'));
  }
  pause() { if (!this.paused) { this.paused = true; this.dispatchEvent(new Event('pause')); } }
}
function fixture({ supported = true } = {}) {
  const audio = new AudioStub(), changes = [], actions = new Map();
  const session = { metadata: null, setActionHandler: (name, action) => actions.set(name, action) };
  let tick = null;
  const controller = createBluetoothTest({ audio, session: supported ? session : null,
    Metadata: class { constructor(value) { Object.assign(this, value); } },
    onChange: value => changes.push(value), schedule: callback => { tick = callback; return 1; }, unschedule: () => { tick = null; } });
  return { audio, session, actions, changes, controller, advance(seconds) { audio.currentTime = seconds; tick?.(); }, hasTimer: () => tick !== null };
}

test('four title phases follow actual audio time and restore the song after twenty seconds', async () => {
  const h = fixture(); await h.controller.start();
  assert.equal(h.session.metadata.title, 'MapKAI TEST 1');
  for (const [seconds, number] of [[5, 2], [10, 3], [15, 4]]) {
    h.advance(seconds); assert.equal(h.session.metadata.title, `MapKAI TEST ${number}`);
  }
  h.advance(20);
  assert.equal(h.audio.paused, true); assert.equal(h.hasTimer(), false);
  assert.equal(h.session.metadata.title, 'Your Turn');
  assert.equal(h.session.playbackState, 'paused'); assert.equal(h.changes.at(-1).state, 'complete');
});

test('stopping a pending start cannot restart audio when its delayed play resolves', async () => {
  const h = fixture(); let release;
  h.audio.gate = new Promise(resolve => { release = resolve; });
  const pending = h.controller.start(); h.controller.stop(); release();
  assert.equal(await pending, false); assert.equal(h.audio.paused, true); assert.equal(h.hasTimer(), false);
});

test('a rejected play request leaves no timer or test title', async () => {
  const h = fixture(); h.audio.rejected = true;
  assert.equal(await h.controller.start(), false);
  assert.equal(h.changes.at(-1).state, 'error'); assert.equal(h.hasTimer(), false); assert.equal(h.session.metadata, null);
});

test('another metadata owner is preserved when the experiment stops', async () => {
  const h = fixture(); await h.controller.start();
  const other = { title: 'Other player' }; h.session.metadata = other; h.advance(6);
  assert.equal(h.session.metadata, other); assert.equal(h.audio.paused, true);
  assert.equal(h.hasTimer(), false); assert.equal(h.changes.at(-1).state, 'interrupted');
});

test('a system pause restores the song title and cancels title updates', async () => {
  const h = fixture(); await h.controller.start(); h.actions.get('pause')();
  assert.equal(h.audio.paused, true); assert.equal(h.session.metadata.title, 'Your Turn');
  assert.equal(h.hasTimer(), false); assert.equal(h.changes.at(-1).state, 'stopped');
});

test('unsupported browsers do not play audio or schedule a misleading test', async () => {
  const h = fixture({ supported: false }); assert.equal(await h.controller.start(), false);
  assert.equal(h.audio.playCalls, 0); assert.equal(h.hasTimer(), false); assert.equal(h.changes.at(-1).state, 'unsupported');
});

test('destroy stops playback and restores metadata without leaving a timer', async () => {
  const h = fixture(); await h.controller.start(); h.controller.destroy();
  assert.equal(h.audio.paused, true); assert.equal(h.hasTimer(), false);
  assert.equal(h.session.metadata.title, 'Your Turn');
});

test('native audio progress updates titles and ends the test when interval callbacks are delayed', async () => {
  const h = fixture(); await h.controller.start();
  h.audio.currentTime = 10; h.audio.dispatchEvent(new Event('timeupdate'));
  assert.equal(h.session.metadata.title, 'MapKAI TEST 3');
  h.audio.currentTime = 20; h.audio.dispatchEvent(new Event('timeupdate'));
  assert.equal(h.audio.paused, true); assert.equal(h.hasTimer(), false);
  assert.equal(h.changes.at(-1).state, 'complete');
});
