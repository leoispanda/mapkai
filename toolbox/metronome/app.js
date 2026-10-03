const $ = id => document.getElementById(id);
const en = document.documentElement.lang === 'en';
const copy = en ? {
  ready: 'Ready when you are', playing: 'Keeping your rhythm', paused: 'Paused', interrupted: 'Audio interrupted · tap to resume',
  start: 'Start running', pause: 'Pause', resume: 'Resume running', loading: 'Starting…',
  wakeReady: 'Will try to keep the screen on when you start', wakeOn: 'Screen is staying on', wakeOff: 'Screen can turn off',
  wakeUnavailable: 'Keep-screen-on is unavailable in this browser', wakeFailed: 'Could not keep the screen on; check your screen timeout',
  unsupported: 'This browser cannot play the metronome. Try a browser that supports Web Audio.',
  audioFailed: 'Audio could not start. Tap Start to try again.',
  cadence: bpm => `${(bpm / 60).toFixed(2).replace(/\.?0+$/, '')} steps / second · one click every ${(60 / bpm).toFixed(3)} s`,
  cadenceLabel: bpm => `${bpm} steps per minute`,
  lockHint: 'Start playback, then lock your iPhone. Use its volume buttons.',
  mixHint: 'Keep this page open to play alongside your music.',
  mediaFailed: 'The audio could not load. Check your connection and tap Start again.',
  buffering: 'Loading audio…',
} : {
  ready: '准备开始', playing: '节拍进行中', paused: '已暂停', interrupted: '声音已中断 · 点击继续',
  start: '开始跑步', pause: '暂停', resume: '继续跑步', loading: '正在启动…',
  wakeReady: '开始后尝试保持亮屏', wakeOn: '已保持亮屏', wakeOff: '允许屏幕自动熄灭',
  wakeUnavailable: '当前浏览器不支持保持亮屏', wakeFailed: '未能保持亮屏，请留意手机的自动锁屏设置',
  unsupported: '当前浏览器不支持播放节拍，请换用支持 Web Audio 的浏览器。',
  audioFailed: '声音未能启动，请点击开始重试。',
  cadence: bpm => `每秒 ${(bpm / 60).toFixed(2).replace(/\.?0+$/, '')} 步 · 每 ${(60 / bpm).toFixed(3)} 秒一声`,
  cadenceLabel: bpm => `每分钟 ${bpm} 步`,
  lockHint: '开始播放后再锁屏；用 iPhone 音量键调节声音。',
  mixHint: '配合其他音乐播放时，请保持此页面打开。',
  mediaFailed: '音轨未能加载，请检查网络后点击开始重试。',
  buffering: '正在加载音轨…',
};

let cadence = 180;
let context, gain, source, wakeLock;
let playing = false, pending = false, startAttempt = 0, wakeAttempt = 0;
let totalSeconds = 0, totalBeats = 0, startedAt = 0, phaseAt = 0, phaseBase = 0;
let animation = 0, lastBeat = -1;
const buffers = new Map();
const dots = [...document.querySelectorAll('.beat-dot')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const media = $('background-audio');
let mode = 'lock';
let mediaLastTime = 0, mediaRate = 1, mediaCountedFirst = false;

function configureAudioSession(type) {
  // Optional on Safari. Other browsers still use the native media element.
  try { if (navigator.audioSession) navigator.audioSession.type = type; } catch {}
}

function updateMediaSession() {
  if (!navigator.mediaSession) return;
  try {
    navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
    if (mode !== 'lock') { navigator.mediaSession.metadata = null; return; }
    if (window.MediaMetadata) navigator.mediaSession.metadata = new MediaMetadata({
      title: en ? `${cadence} steps/min · Running Metronome` : `${cadence} 步/分钟 · 跑步节拍器`,
      artist: 'MapKAI Toolbox',
      artwork: [{ src: '/mapkai-icon-square-512.png', sizes: '512x512', type: 'image/png' }],
    });
  } catch {}
}

function prepareMedia() {
  const tone = document.querySelector('[name=tone]:checked').value;
  media.src = `/toolbox/metronome/audio/${tone}-180-60min-v1.m4a`;
  mediaLastTime = 0;
  mediaCountedFirst = false;
  media.defaultPlaybackRate = mediaRate = cadence / 180;
  media.playbackRate = mediaRate;
  media.preservesPitch = false;
  if ('webkitPreservesPitch' in media) media.webkitPreservesPitch = false;
  media.load();
}

function syncMedia() {
  if (!playing || mode !== 'lock') return;
  const position = media.currentTime;
  let delta = position - mediaLastTime;
  let beatDelta = Math.floor(position * 3 + 1e-7) - Math.floor(mediaLastTime * 3 + 1e-7);
  // The media element loops the long track natively, without a background timer.
  if (delta < -0.1 && Number.isFinite(media.duration)) {
    delta += media.duration;
    beatDelta += Math.round(media.duration * 3);
  }
  if (delta > 0) {
    totalSeconds += delta / mediaRate;
    totalBeats += Math.max(0, beatDelta) + (mediaCountedFirst ? 0 : 1);
    mediaCountedFirst = true;
  }
  mediaLastTime = position;
}

function renderMode() {
  const lock = mode === 'lock';
  $('play-hint').textContent = lock ? copy.lockHint : copy.mixHint;
  $('volume-controls').hidden = lock;
  $('hardware-volume').hidden = !lock;
  $('wake-controls').hidden = lock;
  $('lock-note').hidden = !lock;
  $('mix-note').hidden = lock;
  updateMediaSession();
}

async function startMedia() {
  const attempt = ++startAttempt;
  pending = true;
  $('error').hidden = true;
  renderPlayback('ready');
  configureAudioSession('playback');
  // Keep the media element connected directly to the system audio output.
  // Routing it through an AudioContext would reintroduce background suspension.
  try {
    media.playbackRate = mediaRate = cadence / 180;
    await media.play();
    if (attempt !== startAttempt) return;
    if (media.paused) throw new Error('Playback interrupted');
    pending = false;
    playing = true;
    lastBeat = -1;
    renderPlayback('playing');
    updateMediaSession();
    animation = requestAnimationFrame(frame);
  } catch {
    if (attempt !== startAttempt) return;
    stop('paused');
    $('error').textContent = copy.mediaFailed;
    $('error').hidden = false;
  }
}

// The audio engine loops the clicks itself; no JavaScript timer schedules beats.
// At 180, the one-second buffer has three identical, evenly spaced clicks.
function clickBuffer(tone) {
  if (buffers.has(tone)) return buffers.get(tone);
  const rate = context.sampleRate;
  const buffer = context.createBuffer(1, rate, rate);
  const data = buffer.getChannelData(0);
  const length = Math.floor(rate * 0.045);
  for (let beat = 0; beat < 3; beat++) {
    const offset = Math.round(beat * rate / 3);
    for (let i = 0; i < length; i++) {
      const t = i / rate;
      const attack = Math.min(1, t / 0.0015);
      const tail = Math.min(1, (length - 1 - i) / (rate * 0.006));
      const wave = tone === 'beep'
        ? Math.sin(2 * Math.PI * 1100 * t) * Math.exp(-75 * t)
        : (Math.sin(2 * Math.PI * 820 * t) + 0.4 * Math.sin(2 * Math.PI * 1370 * t)) / 1.4 * Math.exp(-110 * t);
      data[offset + i] = wave * attack * tail * 0.8;
    }
  }
  buffers.set(tone, buffer);
  return buffer;
}

function makeSource() {
  const node = context.createBufferSource();
  node.buffer = clickBuffer(document.querySelector('[name=tone]:checked').value);
  node.loop = true;
  node.playbackRate.value = cadence / 180;
  node.connect(gain);
  node.onended = () => node.disconnect();
  return node;
}

function phase(now = context?.currentTime || 0) {
  return phaseBase + Math.max(0, now - phaseAt) * cadence / 60;
}

function metrics() {
  if (mode === 'lock') { syncMedia(); return { seconds: totalSeconds, beats: totalBeats }; }
  if (!playing) return { seconds: totalSeconds, beats: totalBeats };
  const now = context.currentTime;
  return {
    seconds: totalSeconds + Math.max(0, now - startedAt),
    beats: totalBeats + (now >= startedAt ? Math.floor(phase(now) + 1e-8) + 1 : 0),
  };
}

function renderMetrics() {
  const { seconds, beats } = metrics();
  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = String(Math.floor(whole / 60) % 60).padStart(2, '0');
  $('elapsed').textContent = `${hours ? `${hours}:` : ''}${minutes}:${String(whole % 60).padStart(2, '0')}`;
  $('beat-count').textContent = beats.toLocaleString(en ? 'en' : 'zh-CN');
  $('reset').disabled = !playing && !pending && beats === 0;
  if (playing && beats !== lastBeat) {
    // Respect reduced motion: use a steady indicator instead of moving dots.
    dots.forEach((dot, index) => dot.classList.toggle('active', reducedMotion.matches ? index === 0 : beats > 0 && index === (beats - 1) % dots.length));
    lastBeat = beats;
  }
}

function frame() {
  renderMetrics();
  if (playing) animation = requestAnimationFrame(frame);
}

function renderPlayback(status) {
  document.body.classList.toggle('is-playing', playing);
  $('play').setAttribute('aria-pressed', String(playing));
  $('play').disabled = pending;
  $('play-label').textContent = pending ? copy.loading : playing ? copy.pause : totalBeats ? copy.resume : copy.start;
  $('play-icon').toggleAttribute('hidden', playing);
  $('pause-icon').toggleAttribute('hidden', !playing);
  $('session-status').textContent = copy[status];
  if (!playing) dots.forEach(dot => dot.classList.remove('active'));
  renderMetrics();
}

function wakeStatus(message) { $('wake-status').textContent = message; }

function releaseWakeLock() {
  wakeAttempt++;
  const lock = wakeLock;
  wakeLock = null;
  if (lock) lock.release().catch(() => {});
  wakeStatus(!('wakeLock' in navigator) ? copy.wakeUnavailable : $('keep-awake').checked ? copy.wakeReady : copy.wakeOff);
}

async function requestWakeLock() {
  if (mode === 'lock' || !playing || !navigator.wakeLock || !$('keep-awake').checked || document.visibilityState !== 'visible' || wakeLock) return;
  const attempt = ++wakeAttempt;
  try {
    const lock = await navigator.wakeLock.request('screen');
    if (attempt !== wakeAttempt || !playing || !$('keep-awake').checked || document.visibilityState !== 'visible') {
      await lock.release();
      return;
    }
    wakeLock = lock;
    wakeStatus(copy.wakeOn);
    lock.addEventListener('release', () => {
      if (wakeLock !== lock) return;
      wakeLock = null;
      wakeStatus(playing ? copy.wakeFailed : copy.wakeReady);
    });
  } catch {
    if (attempt === wakeAttempt) wakeStatus(copy.wakeFailed);
  }
}

function stop(status = 'paused') {
  startAttempt++;
  pending = false;
  if (playing) {
    const current = metrics();
    totalSeconds = current.seconds;
    totalBeats = current.beats;
  }
  playing = false;
  media.pause();
  if (source) { try { source.stop(); } catch {} source.disconnect(); source = null; }
  cancelAnimationFrame(animation);
  releaseWakeLock();
  renderPlayback(status);
  updateMediaSession();
}

async function start() {
  if (playing || pending) return;
  if (mode === 'lock') return startMedia();
  configureAudioSession('ambient');
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) { $('error').textContent = copy.unsupported; $('error').hidden = false; return; }
  const attempt = ++startAttempt;
  pending = true;
  $('error').hidden = true;
  renderPlayback('ready');
  try {
    if (!context || context.state === 'closed') {
      context = new AudioContext();
      buffers.clear();
      gain = context.createGain();
      gain.gain.value = Number($('volume').value) / 100 * 0.65;
      gain.connect(context.destination);
      context.addEventListener('statechange', () => {
        if (mode === 'mix' && playing && context.state !== 'running') stop('interrupted');
      });
    }
    // Called directly from the Start tap to satisfy browser audio activation.
    await context.resume();
    if (attempt !== startAttempt) return;
    if (context.state !== 'running') throw new Error('Audio unavailable');
    source = makeSource();
    startedAt = context.currentTime + 0.025;
    phaseAt = startedAt;
    phaseBase = 0;
    source.start(startedAt);
    playing = true;
    pending = false;
    lastBeat = -1;
    renderPlayback('playing');
    animation = requestAnimationFrame(frame);
    void requestWakeLock();
  } catch {
    if (attempt !== startAttempt) return;
    stop('paused');
    $('error').textContent = copy.audioFailed;
    $('error').hidden = false;
  }
}

function setCadence(value) {
  const next = Math.max(120, Math.min(220, Math.round(Number(value))));
  if (!Number.isFinite(next)) return;
  if (playing && mode === 'mix') {
    const now = Math.max(context.currentTime, startedAt);
    phaseBase = phase(now);
    phaseAt = now;
    source.playbackRate.setValueAtTime(next / 180, now);
  }
  if (mode === 'lock') {
    syncMedia();
    media.playbackRate = media.defaultPlaybackRate = mediaRate = next / 180;
  }
  cadence = next;
  $('cadence').value = next;
  $('cadence-value').textContent = next;
  $('cadence').setAttribute('aria-valuetext', copy.cadenceLabel(next));
  $('cadence-description').textContent = copy.cadence(next);
  $('decrease').disabled = next === 120;
  $('increase').disabled = next === 220;
  document.querySelectorAll('[data-cadence]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.cadence) === next)));
  updateMediaSession();
}

$('play').addEventListener('click', () => playing ? stop() : void start());
$('reset').addEventListener('click', () => {
  stop('ready');
  totalSeconds = 0;
  totalBeats = 0;
  media.currentTime = 0;
  mediaLastTime = 0;
  mediaCountedFirst = false;
  $('error').hidden = true;
  setCadence(180);
  renderPlayback('ready');
});
$('decrease').addEventListener('click', () => setCadence(cadence - 1));
$('increase').addEventListener('click', () => setCadence(cadence + 1));
$('cadence').addEventListener('input', event => setCadence(event.target.value));
document.querySelectorAll('[data-cadence]').forEach(button => button.addEventListener('click', () => setCadence(button.dataset.cadence)));
$('volume').addEventListener('input', event => {
  const value = Number(event.target.value);
  $('volume-value').textContent = `${value}%`;
  $('mute-note').hidden = value !== 0;
  if (gain) gain.gain.setTargetAtTime(value / 100 * 0.65, context.currentTime, 0.012);
});
document.querySelectorAll('[name=tone]').forEach(input => input.addEventListener('change', () => {
  if (mode === 'lock') {
    const resume = playing || pending;
    stop();
    prepareMedia();
    if (resume) void start();
    return;
  }
  if (!playing) return;
  // Preserve the current loop position so changing tone does not add a beat.
  const now = Math.max(context.currentTime, startedAt);
  const next = makeSource();
  next.start(now, (phase(now) % 3) / 3);
  source.stop(now);
  source = next;
}));
$('keep-awake').addEventListener('change', () => {
  if (!$('keep-awake').checked) releaseWakeLock();
  else { wakeStatus(copy.wakeReady); void requestWakeLock(); }
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') releaseWakeLock();
  else if (mode === 'lock') {
    if (playing && media.paused) stop('interrupted');
    else renderMetrics();
  }
  else if (playing && context.state !== 'running') stop('interrupted');
  else if (playing) void requestWakeLock();
});
document.querySelectorAll('[name=play-mode]').forEach(input => input.addEventListener('change', () => {
  stop();
  mode = input.value;
  if (mode === 'lock') {
    // A previously used foreground AudioContext must not hold the audio session.
    if (context?.state === 'running') context.suspend().catch(() => {});
    prepareMedia();
  } else configureAudioSession('ambient');
  renderMode();
  renderPlayback(totalBeats ? 'paused' : 'ready');
}));
media.addEventListener('timeupdate', () => { if (mode === 'lock') renderMetrics(); });
media.addEventListener('pause', () => {
  if (mode === 'lock' && playing && media.paused) stop();
});
media.addEventListener('playing', () => {
  if (mode !== 'lock' || pending || media.paused) return;
  if (!playing) {
    playing = true;
    lastBeat = -1;
    animation = requestAnimationFrame(frame);
  }
  renderPlayback('playing');
  updateMediaSession();
});
media.addEventListener('waiting', () => {
  if (mode === 'lock' && (playing || pending)) $('session-status').textContent = copy.buffering;
});
media.addEventListener('error', () => {
  if (mode !== 'lock' || !(playing || pending)) return;
  stop('paused');
  $('error').textContent = copy.mediaFailed;
  $('error').hidden = false;
});
if (navigator.mediaSession) {
  for (const [action, handler] of Object.entries({
    play: () => { if (mode === 'lock') void start(); },
    pause: () => { if (mode === 'lock') stop(); },
    stop: () => { if (mode === 'lock') stop(); },
  })) { try { navigator.mediaSession.setActionHandler(action, handler); } catch {} }
  // Running cadence tracks should not expose chapter/seek controls.
  for (const action of ['seekbackward', 'seekforward', 'seekto', 'previoustrack', 'nexttrack']) {
    try { navigator.mediaSession.setActionHandler(action, null); } catch {}
  }
}
window.addEventListener('pagehide', () => stop());
if (!('wakeLock' in navigator)) {
  $('keep-awake').checked = false;
  $('keep-awake').disabled = true;
  wakeStatus(copy.wakeUnavailable);
}
setCadence(180);
prepareMedia();
renderMode();
renderPlayback('ready');
