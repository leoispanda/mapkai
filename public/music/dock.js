/* Shared, lazy-loaded learning soundtrack. The Music page keeps its own single queue. */
(() => {
  'use strict';
  if (document.getElementById('mapkai-music-dock')) return;
  const sync = globalThis.MapKAILyricsSync;
  const preferences = globalThis.MapKAIMusicPreferences;
  const key = 'mapkaiMusicDock';
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const copy = {
    zh: { title: '学习时，听首 MapKAI 的歌', play: '播放全部', pause: '暂停', resume: '继续播放', cancel: '取消载入', retry: '重试', replay: '重新播放', previous: '上一首', next: '下一首', collapse: '收起', expand: '展开', choose: '选择歌曲', volume: '音量', seek: '歌曲进度', ai: 'AI 生成', ready: '按顺序播放全部歌曲', loading: '正在载入歌曲…', error: '暂时无法播放，请点击重试。', libraryError: '歌曲列表暂时无法载入，请点击重试。', empty: '还没有歌曲', unavailable: '这首歌没有同步歌词。', lyrics: '当前歌词', originalLyrics: '完整原始歌词', position: '第 {n} / {total} 首' },
    en: { title: 'A MapKAI soundtrack for learning', play: 'Play all', pause: 'Pause', resume: 'Resume', cancel: 'Cancel loading', retry: 'Retry', replay: 'Replay', previous: 'Previous', next: 'Next', collapse: 'Collapse', expand: 'Expand', choose: 'Choose a song', volume: 'Volume', seek: 'Song progress', ai: 'AI-generated', ready: 'Play every song in order', loading: 'Loading songs…', error: 'This song could not play. Tap Retry.', libraryError: 'The song list could not load. Tap Retry.', empty: 'No songs yet', unavailable: 'Synchronized lyrics are unavailable for this song.', lyrics: 'Current lyric', originalLyrics: 'Original lyrics', position: 'Song {n} of {total}' },
  };
  const t = name => copy[document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'][name];
  let saved = null;
  try {
    const value = JSON.parse(sessionStorage.getItem(key));
    if (value?.version === 1 && (!value.id || (typeof value.id === 'string' && uuid.test(value.id)))
      && Number.isFinite(value.seconds) && value.seconds >= 0 && value.seconds <= 7200
      && Number.isFinite(value.volume) && value.volume >= 0 && value.volume <= 1
      && typeof value.collapsed === 'boolean') saved = value;
  } catch {}

  const dock = document.createElement('section');
  dock.id = 'mapkai-music-dock'; dock.className = 'music-dock';
  // Only fixed, trusted markup; catalog titles and lyrics are inserted as plain text.
  dock.innerHTML = `<div class="music-dock-inner">
    <div class="music-dock-top"><a class="music-dock-brand" href="/music/">MapKAI Music</a><span id="music-dock-title" class="music-dock-title" aria-live="polite"></span><span id="music-dock-ai" class="music-dock-ai"></span><button id="music-dock-mini-play" type="button" aria-describedby="music-dock-ai"></button><button id="music-dock-collapse" type="button" aria-controls="music-dock-body"></button></div>
    <div id="music-dock-body" class="music-dock-body">
      <div class="music-dock-controls"><button id="music-dock-prev" type="button"></button><button id="music-dock-play" class="primary" type="button" aria-describedby="music-dock-ai"></button><button id="music-dock-next" type="button"></button><select id="music-dock-select"></select><label class="music-dock-volume"><span id="music-dock-volume-label"></span><input id="music-dock-volume" type="range" min="0" max="100" step="1"></label></div>
      <div class="music-dock-progress"><span id="music-dock-elapsed">0:00</span><input id="music-dock-seek" type="range" min="0" max="1000" step="1" value="0" disabled><span id="music-dock-duration">—:—</span></div>
      <p id="music-dock-lyrics" class="music-dock-lyrics" role="region" tabindex="0"><span id="music-dock-line"></span></p>
      <details id="music-dock-original" class="music-dock-original" hidden><summary id="music-dock-original-summary"></summary><pre id="music-dock-original-text" class="music-dock-original-text" role="region" tabindex="0"></pre></details>
      <p id="music-dock-status" class="music-dock-status" role="status"></p>
    </div></div>`;
  const ownAudio = document.createElement('audio'); ownAudio.preload = 'none'; ownAudio.hidden = true;
  dock.append(ownAudio); document.body.append(dock);
  document.body.classList.add('music-dock-present'); document.documentElement.classList.add('music-dock-present');
  const $ = name => document.getElementById(`music-dock-${name}`);
  let tracks = [], selected = null, loaded = false, loading = false, failed = false, libraryFailed = false, pending = false, complete = false;
  let sequence = 0, fetchPromise = null, restoreDone = false, restoring = false, lastSave = 0, optionSignature = '', currentLine = null, lineSource = null, resumeSeconds = null;
  let requestedPlay = null, explicitSelection = false, delegatingPlay = false;
  let originalLyricTrackId = null, originalLyricSource = null;
  let volume = saved?.volume ?? 0.5;
  ownAudio.volume = volume;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const page = () => window.MapKAIMusicPage;
  const state = () => page()?.snapshot() || { tracks, track: selected, audio: selected ? ownAudio : null, loaded, libraryFailed, pending, failed, complete, volume };
  const active = state => Boolean(state.audio && !state.audio.paused && !state.audio.ended && !state.audio.error);
  const clock = seconds => `${Math.floor(Math.max(0, seconds) / 60)}:${String(Math.floor(Math.max(0, seconds)) % 60).padStart(2, '0')}`;
  const reserveSpace = () => document.documentElement.style.setProperty('--music-dock-height', `${Math.ceil(dock.getBoundingClientRect().height) + 16}px`);
  new ResizeObserver(reserveSpace).observe(dock);
  function collapse(value) {
    dock.classList.toggle('is-collapsed', value); $('body').hidden = value;
    $('collapse').setAttribute('aria-expanded', String(!value)); $('collapse').textContent = t(value ? 'expand' : 'collapse');
    reserveSpace();
  }
  collapse(saved?.collapsed ?? false);

  function persist(force = false) {
    if (restoring) return;
    if (!force && Date.now() - lastSave < 1000) return;
    const current = state();
    // Do not overwrite a pending restore with the not-yet-loaded empty page.
    if (!restoreDone && saved?.id) return;
    lastSave = Date.now();
    try { sessionStorage.setItem(key, JSON.stringify({ version: 1, id: current.track?.id || null,
      seconds: Math.max(0, Math.min(7200, current.pendingPosition ?? (!page() ? resumeSeconds : null) ?? (Number.isFinite(current.audio?.currentTime) ? current.audio.currentTime : 0))),
      volume: current.volume, collapsed: dock.classList.contains('is-collapsed') })); } catch {}
  }

  function render() {
    const current = state(), list = current.tracks, audio = current.audio, track = current.track;
    dock.setAttribute('aria-label', 'MapKAI Music');
    const title = track?.title || t('title');
    if ($('title').textContent !== title) $('title').textContent = title;
    $('title').title = title;
    $('ai').hidden = Boolean(track && !track.aiGenerated); $('ai').textContent = t('ai');
    const signature = JSON.stringify(list.map(item => [item.id, item.title]));
    if (signature !== optionSignature || !$('select').options.length) {
      optionSignature = signature; $('select').replaceChildren();
      const placeholder = document.createElement('option'); placeholder.value = ''; placeholder.textContent = t('choose'); $('select').append(placeholder);
      for (const item of list) { const option = document.createElement('option'); option.value = item.id; option.textContent = item.title; $('select').append(option); }
    }
    $('select').options[0].textContent = t('choose'); $('select').value = track?.id || ''; $('select').disabled = !list.length;
    $('select').setAttribute('aria-label', t('choose'));
    const index = track ? list.findIndex(item => item.id === track.id) : -1;
    const waiting = current.pending || loading;
    const action = waiting ? 'cancel' : current.failed || current.libraryFailed ? 'retry' : active(current) ? 'pause' : current.complete ? 'replay' : track ? 'resume' : 'play';
    for (const id of ['play', 'mini-play']) { $(id).textContent = t(action); $(id).disabled = current.loaded && !list.length && !current.libraryFailed; }
    $('prev').textContent = t('previous'); $('next').textContent = t('next');
    $('prev').disabled = index <= 0; $('next').disabled = index < 0 || index >= list.length - 1;
    $('volume-label').textContent = t('volume'); $('volume').setAttribute('aria-label', t('volume')); $('volume').value = Math.round(current.volume * 100);
    const total = audio?.duration;
    const seekable = Number.isFinite(total) && total > 0 && audio.readyState > 0 && !audio.error;
    const time = seekable ? Math.max(0, Math.min(total, audio.currentTime)) : 0;
    $('elapsed').textContent = clock(time); $('duration').textContent = seekable ? clock(total) : '—:—';
    $('seek').disabled = !seekable; $('seek').value = seekable ? Math.round(time / total * 1000) : 0;
    $('seek').style.setProperty('--progress', `${seekable ? time / total * 100 : 0}%`);
    $('seek').setAttribute('aria-label', `${t('seek')}${track ? ` · ${track.title}` : ''}`);
    $('seek').setAttribute('aria-valuetext', `${$('elapsed').textContent} / ${$('duration').textContent}`);
    const originalLyrics = track?.lyrics || '';
    if (originalLyricTrackId !== (track?.id || null) || originalLyricSource !== originalLyrics) {
      originalLyricTrackId = track?.id || null; originalLyricSource = originalLyrics;
      $('original-text').textContent = originalLyrics;
      $('original').open = false;
    }
    $('original').hidden = !originalLyrics;
    $('original-summary').textContent = t('originalLyrics');
    $('original-text').setAttribute('aria-label', `${t('originalLyrics')}${track ? ` · ${track.title}` : ''}`);
    $('lyrics').setAttribute('aria-label', t('lyrics'));
    const timing = track?.lyricsTiming && (!Number.isFinite(total) || track.lyricsTiming.at(-1).end <= total) ? track.lyricsTiming : null;
    const line = timing && audio?.readyState > 0 && !audio.ended && !audio.error ? sync.activeLineAt(timing, time) : null;
    const changed = line !== currentLine || track?.lyrics !== lineSource;
    if (changed) {
      currentLine = line; lineSource = track?.lyrics;
      $('line').textContent = line === null ? '' : track.lyrics.split('\n')[line]; $('lyrics').scrollLeft = 0;
    }
    $('lyrics').classList.toggle('is-direct', changed || Boolean(audio?.paused || audio?.seeking));
    $('lyrics').hidden = Boolean(track && !timing);
    if (line === null) $('lyrics').removeAttribute('data-line'); else $('lyrics').dataset.line = line;
    const style = getComputedStyle($('lyrics'));
    const width = $('lyrics').clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
    const cue = line === null ? null : timing.find(item => item.line === line);
    const offset = reducedMotion.matches ? 0 : sync.lyricOffsetAt(cue, time, Math.max(0, $('line').offsetWidth - width));
    $('line').style.transform = `translateX(${-offset}px)`;
    const message = current.libraryFailed ? t('libraryError') : current.failed ? t('error') : waiting ? t('loading') : current.loaded && !list.length ? t('empty') : track && !timing ? t('unavailable') : index >= 0 ? t('position').replace('{n}', index + 1).replace('{total}', list.length) : t('ready');
    if ($('status').textContent !== message) $('status').textContent = message;
    $('collapse').textContent = t(dock.classList.contains('is-collapsed') ? 'expand' : 'collapse');
    persist();
  }

  function validTrack(raw) {
    if (!raw || typeof raw.id !== 'string' || !uuid.test(raw.id) || typeof raw.title !== 'string' || !raw.title.trim() || typeof raw.url !== 'string') return null;
    try {
      const url = new URL(raw.url, location.href);
      if (url.origin !== location.origin || url.pathname !== '/api/music/audio' || url.searchParams.get('id') !== raw.id) return null;
      const lyrics = typeof raw.lyrics === 'string' ? raw.lyrics.slice(0, 12000).replace(/\r\n?/g, '\n').trim() : '';
      return { id: raw.id, title: raw.title.slice(0, 120), url: url.href, lyrics,
        lyricsTiming: sync.validateTiming(lyrics, raw.lyricsTiming), aiGenerated: raw.aiGenerated === true,
        createdAt: raw.createdAt };
    } catch { return null; }
  }
  const ranks = new Map([['c2a4a749-933b-4b4b-95fb-0d2d3f12ac6f', -1], ['ccb37c55-bae6-4f72-a80a-d1bc94e40ae0', 0], ['e4363fdb-2354-4e5c-98f0-9549b689b5c3', 1], ['bb5957e7-9e91-45e1-a978-5643451d7820', 2]]);
  const compareTracks = (a, b) => preferences ? preferences.compare(a, b) : (ranks.get(a.id) ?? 3) - (ranks.get(b.id) ?? 3) || (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0);
  async function load() {
    if (page()) {
      loading = true; render();
      try { await page().load(); } finally { loading = false; restore(); render(); }
      return;
    }
    if (fetchPromise) return fetchPromise;
    loading = true; libraryFailed = false; render();
    const votesReady = preferences?.refresh().catch(() => {});
    fetchPromise = (async () => {
      const found = new Map(), cursors = new Set(); let cursor = null;
      for (let count = 0; count < 10; count++) {
        const response = await fetch(`/api/music/tracks${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`, { credentials: 'same-origin', cache: 'no-store', signal: AbortSignal.timeout(20000) });
        if (!response.ok) throw new Error('Catalog unavailable');
        const data = await response.json(); if (!Array.isArray(data.tracks) || data.tracks.length > 500) throw new Error('Invalid catalog');
        for (const raw of data.tracks) { const track = validTrack(raw); if (track) found.set(track.id, track); }
        cursor = data.nextCursor;
        if (!cursor) break;
        if (typeof cursor !== 'string' || cursor.length > 1000 || cursors.has(cursor) || count === 9) throw new Error('Invalid catalog cursor');
        cursors.add(cursor);
      }
      await votesReady;
      tracks = [...found.values()].sort(compareTracks);
      loaded = true;
    })().catch(() => { libraryFailed = true; }).finally(() => { loading = false; fetchPromise = null; restore(); render(); });
    return fetchPromise;
  }

  function select(track, seconds = null) {
    sequence++; ownAudio.pause(); selected = track; pending = false; failed = false; complete = false;
    resumeSeconds = seconds; ownAudio.src = track.url; render();
    if (seconds !== null) ownAudio.load();
  }
  function cancelRequestedPlay() { requestedPlay?.finish(false); }
  function pause() {
    cancelRequestedPlay();
    sequence++; pending = false;
    if (page()) page().pause();
    else { ownAudio.pause(); render(); }
    persist(true);
  }
  async function start() {
    if (!selected) return false;
    if (ownAudio.error) ownAudio.load();
    if (ownAudio.ended && ownAudio.readyState > 0) ownAudio.currentTime = 0;
    const request = ++sequence; pending = true; failed = false; complete = false; render();
    try {
      await ownAudio.play();
      if (request !== sequence) return false;
      pending = false; render(); return !page() && active(state());
    } catch (error) {
      if (request === sequence) { pending = false; failed = error.name !== 'AbortError'; render(); }
      return false;
    }
  }
  // Subject cards share this player and public catalog; IDs never become URLs.
  // Resolve false immediately when a newer choice, pause, or page intent wins.
  function playTrack(id) {
    if (typeof id !== 'string' || !uuid.test(id)) return Promise.resolve(false);
    explicitSelection = true; pause();
    return new Promise(resolve => {
      let settled = false, cleanup = () => {};
      const operation = { finish(success) {
        if (settled) return;
        settled = true; cleanup();
        if (requestedPlay === operation) { requestedPlay = null; pending = false; render(); }
        resolve(success);
      } };
      requestedPlay = operation; pending = true; failed = false; render();
      (async () => {
        try {
          const before = state();
          if (!before.loaded || before.libraryFailed) await load();
          if (requestedPlay !== operation) return;
          const current = state();
          const track = current.loaded && !current.libraryFailed && current.tracks.find(item => validTrack(item) && item.id.toLowerCase() === id.toLowerCase());
          if (!track) { operation.finish(false); return; }
          const bridge = page();
          if (!bridge) { select(track); operation.finish(await start()); return; }
          const check = () => {
            if (requestedPlay !== operation) return;
            const playing = state();
            if (playing.track?.id !== track.id || playing.libraryFailed || playing.failed || playing.audio?.error) operation.finish(false);
            else if (!playing.pending) operation.finish(active(playing));
          };
          // The existing Music page play method returns no promise. Its update
          // event reports both successful media starts and playback failures.
          const update = () => Promise.resolve().then(check);
          window.addEventListener('mapkai:music-update', update);
          cleanup = () => window.removeEventListener('mapkai:music-update', update);
          delegatingPlay = true;
          try { bridge.play(track.id); } finally { delegatingPlay = false; }
          check();
        } catch { operation.finish(false); }
      })();
    });
  }
  async function toggle() {
    const current = state();
    if (current.pending || loading || active(current)) { pause(); return; }
    cancelRequestedPlay();
    const request = ++sequence;
    if (!current.loaded || current.libraryFailed) { pending = true; await load(); if (request !== sequence) return; pending = false; }
    if (page()) { page().toggle(); return; }
    if (!tracks.length || libraryFailed) { render(); return; }
    if (!selected || complete) select(tracks[0]);
    start();
  }
  function move(direction) {
    cancelRequestedPlay();
    sequence++; pending = false;
    if (page()) { page().move(direction); return; }
    const index = tracks.findIndex(track => track.id === selected?.id), next = tracks[index + direction];
    if (index < 0 || !next) return; select(next); start();
  }
  function restore() {
    const current = state(); if (restoreDone || !current.loaded) return;
    restoreDone = true; restoring = true;
    if (saved) { volume = saved.volume; if (page()) page().volume(volume); else ownAudio.volume = volume; }
    const track = current.tracks.find(item => item.id === saved?.id);
    if (track && !current.track && !explicitSelection) {
      if (page()) page().restore(track.id, saved.seconds);
      else select(track, saved.seconds);
    }
    restoring = false;
  }

  $('play').onclick = toggle; $('mini-play').onclick = toggle;
  $('prev').onclick = () => move(-1); $('next').onclick = () => move(1);
  $('collapse').onclick = () => { collapse(!dock.classList.contains('is-collapsed')); render(); persist(true); };
  $('select').onchange = () => {
    const track = state().tracks.find(item => item.id === $('select').value); if (!track) return;
    cancelRequestedPlay(); explicitSelection = true;
    sequence++; pending = false;
    if (page()) page().play(track.id); else { select(track); start(); }
  };
  $('seek').oninput = () => {
    const value = Number($('seek').value), audio = state().audio;
    if (!Number.isFinite(value) || !Number.isFinite(audio?.duration) || audio.duration <= 0 || audio.error) return;
    if (page()) page().seek(value); else audio.currentTime = Math.max(0, Math.min(1000, value)) / 1000 * audio.duration;
    render(); persist(true);
  };
  $('volume').oninput = () => {
    const value = Number($('volume').value); if (!Number.isFinite(value)) return;
    volume = Math.max(0, Math.min(100, value)) / 100;
    if (page()) page().volume(volume); else ownAudio.volume = volume;
    render(); persist(true);
  };
  ownAudio.addEventListener('loadedmetadata', () => {
    if (resumeSeconds !== null && Number.isFinite(ownAudio.duration) && ownAudio.duration > 0) {
      ownAudio.currentTime = Math.min(resumeSeconds, ownAudio.duration); resumeSeconds = null;
    }
    render();
  });
  ownAudio.addEventListener('ended', () => {
    if (!selected || !ownAudio.ended || page()) return;
    const index = tracks.findIndex(track => track.id === selected.id), next = tracks[index + 1];
    if (next) { select(next); start(); } else { pending = false; complete = true; render(); }
  });
  ownAudio.addEventListener('error', () => { cancelRequestedPlay(); sequence++; pending = false; failed = true; render(); });
  for (const event of ['timeupdate', 'play', 'pause', 'playing', 'seeking', 'seeked', 'durationchange', 'waiting']) ownAudio.addEventListener(event, render);
  // Starting a lesson's narration or video pauses background music as well.
  document.addEventListener('play', event => {
    const target = event.target; if (!['AUDIO', 'VIDEO'].includes(target.tagName)) return;
    const current = state();
    if (target === current.audio) {
      document.querySelectorAll('audio,video').forEach(media => { if (media !== target && !media.paused) media.pause(); });
    } else if (pending || loading || current.pending || active(current)) pause();
  }, true);
  preferences?.subscribe(() => {
    if (!page()) { tracks.sort(compareTracks); render(); }
  });
  window.addEventListener('mapkai:music-update', () => { restore(); render(); });
  window.addEventListener('mapkai:music-intent', () => {
    if (delegatingPlay) return;
    cancelRequestedPlay(); sequence++; pending = false; explicitSelection = true;
  });
  window.addEventListener('mapkai:music-ready', () => { cancelRequestedPlay(); sequence++; ownAudio.pause(); restore(); render(); });
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  window.addEventListener('resize', render); reducedMotion.addEventListener?.('change', render);
  window.addEventListener('pagehide', () => { cancelRequestedPlay(); sequence++; persist(true); });
  window.addEventListener('pageshow', () => { restore(); render(); });
  window.MapKAIMusicDock = Object.freeze({ play: playTrack });
  window.dispatchEvent(new Event('mapkai:music-dock-ready'));
  render(); restore();
  // Visitors who have not started listening incur no catalog/audio read.
  if (saved?.id && !page()) load();
})();
