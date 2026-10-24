(() => {
  'use strict';
  const audio = document.querySelector('audio[data-track-id]');
  if (audio) {
    const tracker = globalThis.MapKAIMusicListening?.createTracker(audio);
    tracker?.select(audio.dataset.trackId);
    audio.addEventListener('play', () => {
      document.querySelectorAll('audio, video').forEach(other => { if (other !== audio) other.pause(); });
      window.dispatchEvent(new CustomEvent('mapkai:external-audio-play', { detail: { audio } }));
    });
  }
  const video = document.querySelector('video');
  const quality = document.querySelector('#work-quality');
  let pendingSeek = null;
  quality?.addEventListener('change', () => {
    const selected = quality.selectedOptions[0];
    if (!video || !selected?.dataset.src) return;
    pendingSeek = Number.isFinite(video.currentTime) ? video.currentTime : 0;
    video.pause(); video.src = selected.dataset.src; video.load();
  });
  video?.addEventListener('loadedmetadata', () => {
    if (pendingSeek !== null && Number.isFinite(video.duration)) video.currentTime = Math.min(pendingSeek, Math.max(0, video.duration - .1));
    pendingSeek = null;
  });
  const media = audio || video;
  media?.addEventListener('error', () => { document.querySelector('#work-error').hidden = false; });
  media?.addEventListener('playing', () => { document.querySelector('#work-error').hidden = true; });
  window.addEventListener('pagehide', () => media?.pause());
})();
