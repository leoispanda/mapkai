export const TEST_SECONDS = 20;
export const SOURCE = '/api/music/audio?id=efc8308c-614f-4845-94ce-3b32425c2e4a';
const original = { title: 'Your Turn (Science & ASML)', artist: 'MapKAI', album: 'MapKAI Music' };

export function createBluetoothTest({ audio, session, Metadata, onChange = () => {},
  schedule = callback => setInterval(callback, 500), unschedule = clearInterval }) {
  let active = false, beginning = null, timer = null, epoch = 0, phase = 0, lastMetadata = null;
  const supported = Boolean(session && typeof Metadata === 'function');
  const elapsed = () => beginning === null ? 0 : Math.max(0, (Number(audio.currentTime) || 0) - beginning);
  const ownsMetadata = () => lastMetadata && session?.metadata === lastMetadata;
  function emit(state, seconds = elapsed()) { onChange({ state, phase, seconds, supported }); }
  function finish(state = 'stopped') {
    const seconds = elapsed();
    active = false; epoch += 1; beginning = null;
    if (timer !== null) { unschedule(timer); timer = null; }
    audio.pause();
    // A video, another tab or another player may have taken the media controls.
    if (ownsMetadata()) {
      try { session.metadata = new Metadata(original); session.playbackState = 'paused'; } catch {}
    }
    lastMetadata = null; emit(state, seconds);
  }
  function refresh() {
    if (!active || beginning === null) return;
    if (!ownsMetadata()) { finish('interrupted'); return; }
    if (audio.error) { finish('error'); return; }
    if (audio.paused) { finish('stopped'); return; }
    const seconds = elapsed();
    if (seconds >= TEST_SECONDS) { finish('complete'); return; }
    const next = Math.floor(seconds / 5) + 1;
    if (next !== phase) {
      phase = next;
      try {
        lastMetadata = new Metadata({ title: `MapKAI TEST ${phase}`, artist: 'MapKAI', album: 'Bluetooth display test' });
        session.metadata = lastMetadata;
      } catch { finish('unsupported'); return; }
    }
    emit('running', seconds);
  }
  function playing() {
    if (!active || beginning !== null) return;
    beginning = Number(audio.currentTime) || 0; phase = 0;
    try {
      lastMetadata = new Metadata(original); session.metadata = lastMetadata; session.playbackState = 'playing';
    } catch { finish('unsupported'); return; }
    refresh(); if (active) timer = schedule(refresh);
  }
  async function start() {
    if (!supported) { emit('unsupported'); return false; }
    if (active) finish();
    active = true; beginning = null; phase = 0; const request = ++epoch;
    emit('loading', 0);
    try {
      audio.currentTime = 0;
      // Install transport handlers only after a user starts this test.
      for (const [action, handler] of Object.entries({ play: () => void start(), pause: () => finish(), stop: () => finish() })) {
        try { session.setActionHandler?.(action, handler); } catch {}
      }
      await audio.play();
      if (request !== epoch || !active) { if (!active) audio.pause(); return false; }
      playing(); return true;
    } catch { if (request === epoch && active) finish('error'); return false; }
  }
  const paused = () => { if (active) finish('stopped'); };
  const failed = () => { if (active) finish('error'); };
  const ended = () => { if (active) finish(elapsed() >= TEST_SECONDS ? 'complete' : 'stopped'); };
  audio.addEventListener('playing', playing); audio.addEventListener('pause', paused);
  audio.addEventListener('error', failed); audio.addEventListener('ended', ended);
  emit(supported ? 'ready' : 'unsupported', 0);
  return { start, stop: () => finish(), refresh, destroy() {
    finish(); audio.removeEventListener('playing', playing); audio.removeEventListener('pause', paused);
    audio.removeEventListener('error', failed); audio.removeEventListener('ended', ended);
  } };
}
