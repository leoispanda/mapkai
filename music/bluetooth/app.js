import { createBluetoothTest, SOURCE, TEST_SECONDS } from './controller.js?v=song-names-20261024';
const audio = document.querySelector('audio');
audio.src = SOURCE;
const start = document.getElementById('start-test'), stop = document.getElementById('stop-test');
const progress = document.getElementById('test-progress'), label = document.getElementById('sent-title');
const status = document.getElementById('test-status'), count = document.getElementById('test-count');
const messages = {
  ready: '准备好了。连接 Clio 蓝牙后，点开始测试。',
  loading: '正在载入测试音乐…',
  running: '网页已提交下面这段文字。请看车屏是否也随之变化。',
  complete: '测试结束，已恢复歌名。车屏是否依次显示了 TEST 1、2、3、4？',
  stopped: '已停止测试，并恢复歌名。',
  interrupted: '其他播放器接管了媒体控制，测试已停止。',
  error: '音乐未能播放。请检查网络，再点开始测试。',
  unsupported: '当前浏览器无法更新系统媒体信息。请用 iPhone 的 Safari 打开此页重试。',
};
let lastState = '';
const test = createBluetoothTest({ audio, session: navigator.mediaSession, Metadata: globalThis.MediaMetadata,
  onChange({ state, phase, seconds, supported }) {
    const busy = state === 'running' || state === 'loading';
    start.disabled = busy || !supported; stop.disabled = !busy;
    progress.value = Math.min(TEST_SECONDS, seconds); count.textContent = `${Math.min(TEST_SECONDS, Math.floor(seconds))} / ${TEST_SECONDS} 秒`;
    label.textContent = state === 'running' ? `MapKAI TEST ${phase}` : 'Your Turn';
    if (state !== lastState) { status.textContent = messages[state]; lastState = state; }
  },
});
start.addEventListener('click', () => void test.start());
stop.addEventListener('click', test.stop);
window.addEventListener('pagehide', test.stop);
document.addEventListener('visibilitychange', () => { if (!document.hidden) test.refresh(); });
