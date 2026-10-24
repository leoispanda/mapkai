/* Shared, lazy-loaded learning soundtrack. The Music page keeps its own single queue. */
(() => {
  'use strict';
  if (document.getElementById('mapkai-music-dock')) return;
  const sync = globalThis.MapKAILyricsSync;
  const preferences = globalThis.MapKAIMusicPreferences;
  const musicTempo = globalThis.MapKAIMusicTempo;
  const key = 'mapkaiMusicDock';
  const carKey = 'mapkaiMusicCarLyrics.v1';
  const carSupported = Boolean(navigator.mediaSession && typeof MediaMetadata !== 'undefined');
  let carLyrics = false;
  try { carLyrics = carSupported && localStorage.getItem(carKey) === 'on'; } catch {}
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const copy = {
    zh: { carLyrics: '车载歌词（试用）', carUnsupported: '当前浏览器不支持车载文字输出。', carNoTiming: '这首歌没有同步时间轴，车屏继续显示歌名。', carHint: '尝试在车屏歌名位置逐句显示歌词；手机锁屏后的效果需实测。', captionHint: '同步字幕沿用 MV，时间为近似值；省略号表示未确认的字句。完整原稿另行保留。', title: '学习时，听首 MapKAI 的歌', play: '播放全部', pause: '暂停', resume: '继续播放', cancel: '取消载入', retry: '重试', replay: '重新播放', previous: '上一首', next: '下一首', collapse: '收起', expand: '展开', choose: '选择歌曲', volume: '音量', seek: '歌曲进度', ai: 'AI 生成', running180: '180 BPM · 跑步', ready: '按顺序播放全部歌曲', loading: '正在载入歌曲…', error: '暂时无法播放，请点击重试。', libraryError: '歌曲列表暂时无法载入，请点击重试。', empty: '还没有歌曲', unavailable: '这首歌没有同步歌词。', lyrics: '当前歌词', originalLyrics: '完整原始歌词', position: '第 {n} / {total} 首', continuousOn: '连续播放', continuousOff: '播完本首后停止', singleReady: '选择一首歌曲播放', singlePlay: '播放', navigationResume: '浏览器暂停了自动续播，请点继续播放。' },
    en: { carLyrics: 'Car lyrics (trial)', carUnsupported: 'This browser cannot send car display text.', carNoTiming: 'No synchronized timing for this song; the car keeps the song title.', carHint: 'Try showing each lyric in the car’s title field. Updates with the phone locked need testing.', captionHint: 'Uses approximate MV subtitles; ellipses mark uncertain words. The original written lyrics remain separate.', title: 'A MapKAI soundtrack for learning', play: 'Play all', pause: 'Pause', resume: 'Resume', cancel: 'Cancel loading', retry: 'Retry', replay: 'Replay', previous: 'Previous', next: 'Next', collapse: 'Collapse', expand: 'Expand', choose: 'Choose a song', volume: 'Volume', seek: 'Song progress', ai: 'AI-generated', running180: '180 BPM · Running', ready: 'Play every song in order', loading: 'Loading songs…', error: 'This song could not play. Tap Retry.', libraryError: 'The song list could not load. Tap Retry.', empty: 'No songs yet', unavailable: 'Synchronized lyrics are unavailable for this song.', lyrics: 'Current lyric', originalLyrics: 'Original lyrics', position: 'Song {n} of {total}', continuousOn: 'Continuous play', continuousOff: 'Stop after this song', singleReady: 'Choose a song to play', singlePlay: 'Play', navigationResume: 'Your browser paused automatic playback. Tap Resume.' },
  };
  const t = name => copy[document.documentElement.lang.startsWith('zh') ? 'zh' : 'en'][name];
  const songName = track => track.title.replace(/^[0-9]{3,}\s+/, '').split(' - MapKAI - ')[0];
  let saved = null;
  try {
    const value = JSON.parse(sessionStorage.getItem(key));
    if (value?.version === 1 && (!value.id || (typeof value.id === 'string' && uuid.test(value.id)))
      && Number.isFinite(value.seconds) && value.seconds >= 0 && value.seconds <= 7200
      && Number.isFinite(value.volume) && value.volume >= 0 && value.volume <= 1
      && typeof value.collapsed === 'boolean' && (value.wasPlaying === undefined || typeof value.wasPlaying === 'boolean')) saved = value;
  } catch {}

  const dock = document.createElement('section');
  dock.id = 'mapkai-music-dock'; dock.className = 'music-dock';
  // Only fixed, trusted markup; catalog titles and lyrics are inserted as plain text.
  dock.innerHTML = `<div class="music-dock-inner">
    <div class="music-dock-top"><a class="music-dock-brand" href="/music/">Music</a><div class="music-dock-track"><span id="music-dock-title" class="music-dock-title" aria-live="polite"></span><span id="music-dock-ai" class="music-dock-ai"></span></div><div class="music-dock-transport"><button id="music-dock-mini-prev" type="button"></button><button id="music-dock-mini-play" type="button" aria-describedby="music-dock-ai"></button><button id="music-dock-mini-next" type="button"></button><button id="music-dock-collapse" type="button" aria-controls="music-dock-body"></button></div></div>
    <div id="music-dock-body" class="music-dock-body"><p id="music-dock-detail-title" class="music-dock-detail-title"></p><span id="music-dock-tempo" class="music-dock-tempo" hidden></span>
      <div class="music-dock-controls"><button id="music-dock-prev" type="button"></button><button id="music-dock-play" class="primary" type="button" aria-describedby="music-dock-ai"></button><button id="music-dock-next" type="button"></button><select id="music-dock-select"></select><label class="music-dock-volume"><span id="music-dock-volume-label"></span><input id="music-dock-volume" type="range" min="0" max="100" step="1"></label></div>
      <div class="music-dock-progress"><span id="music-dock-elapsed">0:00</span><input id="music-dock-seek" type="range" min="0" max="1000" step="1" value="0" disabled><span id="music-dock-duration">—:—</span></div>
      <p id="music-dock-lyrics" class="music-dock-lyrics" role="region" tabindex="0"><span id="music-dock-line"></span></p>
      <details id="music-dock-original" class="music-dock-original" hidden><summary id="music-dock-original-summary"></summary><pre id="music-dock-original-text" class="music-dock-original-text" role="region" tabindex="0"></pre></details>
      <label class="music-dock-car"><input id="music-dock-car" type="checkbox" aria-describedby="music-dock-car-note"><span id="music-dock-car-label"></span></label>
      <p id="music-dock-car-note" class="music-dock-status"></p>
      <p id="music-dock-caption-note" class="music-dock-status" hidden></p>
      <p id="music-dock-status" class="music-dock-status" role="status"></p>
    </div></div>`;
  const ownAudio = document.createElement('audio'); ownAudio.preload = 'none'; ownAudio.hidden = true;
  dock.append(ownAudio); document.body.append(dock);
  document.body.classList.add('music-dock-present'); document.documentElement.classList.add('music-dock-present');
  const $ = name => document.getElementById(`music-dock-${name}`);
  let tracks = [], selected = null, loaded = false, loading = false, failed = false, libraryFailed = false, pending = false, complete = false;
  let sequence = 0, fetchPromise = null, restoreDone = false, restoring = false, lastSave = 0, optionSignature = '', currentLine = null, lineSource = null, resumeSeconds = null;
  let requestedPlay = null, explicitSelection = false, delegatingPlay = false;
  let restorePlayIntent = saved?.wasPlaying === true, autoResumeBlocked = false, leaving = false, navigationWasPlaying = false;
  let mediaTrackId = null, mediaSessionOwned = false, externalMediaOwner = null, mediaSignature = '', ownedMetadata = null;
  let playbackIntent = false, advancing = false, audioSessionLease = null;
  let originalLyricTrackId = null, originalLyricSource = null;
  let publicStateSignature = '';
  let volume = saved?.volume ?? 0.5;
  ownAudio.volume = volume;
  const listeningTracker = globalThis.MapKAIMusicListening?.createTracker(ownAudio);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const page = () => window.MapKAIMusicPage;
  const state = () => page()?.snapshot() || { tracks, track: selected, audio: selected ? ownAudio : null, loaded, libraryFailed, pending, failed, complete, volume, playbackIntent, advancing };
  const active = state => Boolean(state.audio && !state.audio.paused && !state.audio.ended && !state.audio.error);
  function publicSnapshot() {
    const current = state();
    return Object.freeze({ id: current.track?.id || null, playing: active(current),
      pending: Boolean(current.pending || current.advancing || loading),
      failed: Boolean(current.failed || current.libraryFailed || current.audio?.error) });
  }
  function emitStateChange() {
    const signature = JSON.stringify(publicSnapshot());
    if (signature === publicStateSignature) return;
    publicStateSignature = signature;
    window.dispatchEvent(new Event('mapkai:music-dock-state'));
  }
  function continuousEnabled(current = state()) {
    if (typeof current.continuousPlay === 'boolean') return current.continuousPlay;
    try { return localStorage.getItem('mapkaiMusicContinuous.v1') !== 'off'; } catch { return true; }
  }
  const activeExternalMedia = current => [...document.querySelectorAll('audio,video')].filter(media => media !== current.audio && !media.paused && !media.ended);
  const sessionPlaying = current => current.playbackIntent !== false && (active(current)
    || (current.playbackIntent === true && !current.failed && !current.audio?.error
      && (current.pending || current.advancing || (current.audio?.ended && continuousEnabled(current)))));
  function acquireAudioSession() {
    if (page() || audioSessionLease) return;
    try {
      const session = typeof navigator !== 'undefined' && navigator.audioSession;
      const previous = session?.type;
      // Microphone/recording ownership is never changed by a music request.
      if (!session || typeof previous !== 'string' || previous === 'play-and-record' || previous === 'playback') return;
      session.type = 'playback';
      if (session.type === 'playback') audioSessionLease = { session, previous };
    } catch {}
  }
  function releaseAudioSession() {
    const lease = audioSessionLease; audioSessionLease = null;
    if (!lease) return;
    try { if (lease.session.type === 'playback') lease.session.type = lease.previous; } catch {}
  }
  function clearPlaybackIntent() { playbackIntent = false; advancing = false; releaseAudioSession(); }
  const clock = seconds => `${Math.floor(Math.max(0, seconds) / 60)}:${String(Math.floor(Math.max(0, seconds)) % 60).padStart(2, '0')}`;
  const reserveSpace = () => document.documentElement.style.setProperty('--music-dock-height', `${Math.ceil(dock.getBoundingClientRect().height) + 16}px`);
  new ResizeObserver(reserveSpace).observe(dock);
  function collapse(value) {
    dock.classList.toggle('is-collapsed', value); $('body').hidden = value;
    $('collapse').setAttribute('aria-expanded', String(!value));
    $('collapse').textContent = value ? '⌃' : '⌄'; $('collapse').setAttribute('aria-label', t(value ? 'expand' : 'collapse')); $('collapse').title = t(value ? 'expand' : 'collapse');
    reserveSpace();
  }
  // Every new page starts as a single compact bar. Expansion is an in-page choice.
  collapse(true);

  function persist(force = false) {
    if (restoring || leaving) return;
    if (!force && Date.now() - lastSave < 1000) return;
    const current = state();
    // Do not overwrite a pending restore with the not-yet-loaded empty page.
    if (!restoreDone && saved?.id) return;
    lastSave = Date.now();
    try { sessionStorage.setItem(key, JSON.stringify({ version: 1, id: current.track?.id || null,
      seconds: Math.max(0, Math.min(7200, current.pendingPosition ?? (!page() ? resumeSeconds : null) ?? (Number.isFinite(current.audio?.currentTime) ? current.audio.currentTime : 0))),
      volume: current.volume, collapsed: dock.classList.contains('is-collapsed'), wasPlaying: restorePlayIntent || sessionPlaying(current) })); } catch {}
  }

  function render() {
    const current = state(), list = current.tracks, audio = current.audio, track = current.track;
    dock.setAttribute('aria-label', 'MapKAI Music');
    const title = track?.title || t('title');
    const compactTitle = track ? songName(track) : 'MapKAI Music';
    if ($('title').textContent !== compactTitle) $('title').textContent = compactTitle;
    $('detail-title').textContent = compactTitle;
    $('title').title = title;
    $('ai').hidden = Boolean(track && !track.aiGenerated); $('ai').textContent = t('ai');
    const tempo = musicTempo?.describe(track, document.documentElement.lang.startsWith('zh') ? 'zh' : 'en');
    $('tempo').hidden = !tempo?.text || tempo.unknown;
    $('tempo').textContent = tempo?.text || '';
    $('tempo').dataset.estimated = String(tempo?.estimated === true);
    $('tempo').dataset.running = String(track?.tempoBpm === 180);
    const language = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
    const signature = JSON.stringify([language, list.map(item => [item.id, item.title, item.tempoBpm, item.tempoEstimate])]);
    if (signature !== optionSignature || !$('select').options.length) {
      optionSignature = signature; $('select').replaceChildren();
      const placeholder = document.createElement('option'); placeholder.value = ''; placeholder.textContent = t('choose'); $('select').append(placeholder);
      for (const item of list) {
        const option = document.createElement('option'), itemTempo = musicTempo?.describe(item, language);
        option.value = item.id; option.textContent = `${songName(item)}${itemTempo && !itemTempo.unknown ? ` · ${itemTempo.text}` : ''}`; $('select').append(option);
      }
    }
    $('select').options[0].textContent = t('choose'); $('select').value = track?.id || ''; $('select').disabled = !list.length;
    $('select').setAttribute('aria-label', t('choose'));
    const index = track ? list.findIndex(item => item.id === track.id) : -1;
    const waiting = current.pending || current.advancing || loading;
    const action = waiting ? 'cancel' : autoResumeBlocked ? 'resume' : current.failed || current.libraryFailed ? 'retry' : active(current) ? 'pause' : current.complete ? 'replay' : track ? 'resume' : continuousEnabled(current) ? 'play' : 'singlePlay';
    $('play').textContent = t(action); $('play').disabled = current.loaded && !list.length && !current.libraryFailed;
    $('mini-play').textContent = action === 'pause' ? 'Ⅱ' : action === 'cancel' ? '×' : action === 'retry' || action === 'replay' ? '↻' : '▶';
    $('mini-play').setAttribute('aria-label', t(action)); $('mini-play').title = t(action); $('mini-play').disabled = $('play').disabled;
    for (const [name, symbol] of [['prev', '⏮'], ['next', '⏭']]) {
      $(name).textContent = t(name === 'prev' ? 'previous' : 'next');
      $(`mini-${name}`).textContent = symbol; $(`mini-${name}`).setAttribute('aria-label', $(name).textContent); $(`mini-${name}`).title = $(name).textContent;
      $(name).disabled = $(`mini-${name}`).disabled = index < 0 || list.length < 2;
    }
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
    const displayLyrics = track?.displayLyrics ?? track?.lyrics;
    const displayTiming = track?.displayTiming ?? track?.lyricsTiming;
    const timing = displayTiming && (!Number.isFinite(total) || displayTiming.at(-1).end <= total) ? displayTiming : null;
    const line = timing && audio?.readyState > 0 && !audio.ended && !audio.error ? sync.activeLineAt(timing, time) : null;
    const changed = line !== currentLine || displayLyrics !== lineSource;
    if (changed) {
      currentLine = line; lineSource = displayLyrics;
      $('line').textContent = line === null ? '' : displayLyrics.split('\n')[line]; $('lyrics').scrollLeft = 0;
    }
    $('lyrics').classList.toggle('is-direct', changed || Boolean(audio?.paused || audio?.seeking));
    $('lyrics').hidden = Boolean(track && !timing);
    if (line === null) $('lyrics').removeAttribute('data-line'); else $('lyrics').dataset.line = line;
    const style = getComputedStyle($('lyrics'));
    const width = $('lyrics').clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
    const cue = line === null ? null : timing.find(item => item.line === line);
    const offset = reducedMotion.matches ? 0 : sync.lyricOffsetAt(cue, time, Math.max(0, $('line').offsetWidth - width));
    $('line').style.transform = `translateX(${-offset}px)`;
    $('car').checked = carLyrics; $('car').disabled = !carSupported;
    $('car-label').textContent = t('carLyrics');
    $('car-note').textContent = t(!carSupported ? 'carUnsupported' : carLyrics && track && !timing ? 'carNoTiming' : 'carHint');
    $('caption-note').hidden = !track?.captionFallback;
    $('caption-note').textContent = t('captionHint');
    let message = autoResumeBlocked ? t('navigationResume') : current.libraryFailed ? t('libraryError') : current.failed ? t('error') : waiting ? t('loading') : current.loaded && !list.length ? t('empty') : track && !timing ? t('unavailable') : index >= 0 ? t('position').replace('{n}', index + 1).replace('{total}', list.length) : t(continuousEnabled(current) ? 'ready' : 'singleReady');
    if (track && !current.libraryFailed && !current.failed && !waiting && !autoResumeBlocked) message += ` · ${t(continuousEnabled(current) ? 'continuousOn' : 'continuousOff')}`;
    if ($('status').textContent !== message) $('status').textContent = message;
    const collapsed = dock.classList.contains('is-collapsed');
    $('collapse').setAttribute('aria-label', t(collapsed ? 'expand' : 'collapse')); $('collapse').title = t(collapsed ? 'expand' : 'collapse');
    updateMediaSession(current); persist(); attemptRestorePlayback(); emitStateChange();
  }

  function validTrack(raw) {
    if (!raw || typeof raw.id !== 'string' || !uuid.test(raw.id) || typeof raw.title !== 'string' || !raw.title.trim() || typeof raw.url !== 'string') return null;
    try {
      const url = new URL(raw.url, location.href);
      if (url.origin !== location.origin || url.pathname !== '/api/music/audio' || url.searchParams.get('id') !== raw.id) return null;
      const lyrics = typeof raw.lyrics === 'string' ? raw.lyrics.slice(0, 12000).replace(/\r\n?/g, '\n').trim() : '';
      const display = sync.playbackLyrics({ lyrics, lyricsTiming: raw.lyricsTiming, lyricCaptions: raw.lyricCaptions });
      return { id: raw.id, title: raw.title.slice(0, 120), url: url.href, lyrics,
        lyricsTiming: sync.validateTiming(lyrics, raw.lyricsTiming), aiGenerated: raw.aiGenerated === true,
        displayLyrics: display?.text ?? lyrics, displayTiming: display?.timing ?? null, captionFallback: display?.captions === true,
        tempoBpm: Number.isFinite(raw.tempoBpm) && raw.tempoBpm >= 20 && raw.tempoBpm <= 300 ? raw.tempoBpm : null,
        tempoEstimate: musicTempo?.sanitize(raw.tempoEstimate) || null,
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

  function select(track, seconds = null, immediatePlay = false) {
    listeningTracker?.select(track.id, { restart: true, restore: seconds !== null });
    sequence++;
    if (!immediatePlay) { clearPlaybackIntent(); ownAudio.pause(); }
    selected = track; pending = false; failed = false; complete = false;
    resumeSeconds = seconds; ownAudio.src = track.url;
    // The next native play request must precede DOM/storage work at a natural end.
    if (!immediatePlay) render();
    if (seconds !== null) ownAudio.load();
  }
  function cancelRequestedPlay() { requestedPlay?.finish(false); }
  function pause() {
    restorePlayIntent = false; autoResumeBlocked = false; clearPlaybackIntent(); cancelRequestedPlay();
    sequence++; pending = false;
    if (page()) page().pause();
    else { ownAudio.pause(); render(); }
    persist(true);
  }
  function pauseTrack(id) {
    const selectedId = state().track?.id;
    if (typeof id !== 'string' || !selectedId || id.toLowerCase() !== selectedId.toLowerCase()) return false;
    pause(); return true;
  }
  async function start(automaticRestore = false) {
    if (!selected) return false;
    if (ownAudio.error) ownAudio.load();
    if (ownAudio.ended && ownAudio.readyState > 0) { listeningTracker?.select(selected.id, { restart: true }); ownAudio.currentTime = 0; }
    const request = ++sequence; pending = true; failed = false; complete = false; playbackIntent = true;
    acquireAudioSession();
    try {
      const started = ownAudio.play();
      render();
      await started;
      if (request !== sequence) {
        if (!playbackIntent && !ownAudio.paused) ownAudio.pause();
        return false;
      }
      pending = false; advancing = false; render(); return !page() && active(state());
    } catch (error) {
      if (request !== sequence && !playbackIntent && !ownAudio.paused) ownAudio.pause();
      if (request === sequence) { clearPlaybackIntent(); pending = false; autoResumeBlocked = automaticRestore && error.name === 'NotAllowedError'; failed = !autoResumeBlocked && error.name !== 'AbortError'; render(); persist(true); }
      return false;
    }
  }
  // Subject cards share this player and public catalog; IDs never become URLs.
  // Resolve false immediately when a newer choice, pause, or page intent wins.
  function playTrack(id) {
    if (typeof id !== 'string' || !uuid.test(id)) return Promise.resolve(false);
    externalMediaOwner = null; explicitSelection = true; pause();
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
          if (!bridge) { select(track, null, true); operation.finish(await start()); return; }
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
  function resumeTrack(id) {
    const current = state();
    if (typeof id !== 'string' || !current.track || current.track.id.toLowerCase() !== id.toLowerCase()) return Promise.resolve(false);
    if (active(current)) return Promise.resolve(true);
    if (current.pending || current.advancing || loading) return Promise.resolve(false);
    externalMediaOwner = null; explicitSelection = true; restorePlayIntent = false; autoResumeBlocked = false;
    cancelRequestedPlay();
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
          const bridge = page();
          if (!bridge) { operation.finish(await start()); return; }
          const check = () => {
            if (requestedPlay !== operation) return;
            const playing = state();
            if (playing.track?.id !== current.track.id || playing.libraryFailed || playing.failed || playing.audio?.error) operation.finish(false);
            else if (!playing.pending) operation.finish(active(playing));
          };
          const update = () => Promise.resolve().then(check);
          window.addEventListener('mapkai:music-update', update);
          cleanup = () => window.removeEventListener('mapkai:music-update', update);
          delegatingPlay = true;
          try { Promise.resolve(bridge.toggle()).catch(() => operation.finish(false)); }
          finally { delegatingPlay = false; }
          check();
        } catch { operation.finish(false); }
      })();
    });
  }
  async function toggle() {
    externalMediaOwner = null; restorePlayIntent = false; autoResumeBlocked = false;
    const current = state();
    if (current.pending || current.advancing || loading || active(current)) { pause(); return; }
    cancelRequestedPlay();
    const request = ++sequence;
    if (!current.loaded || current.libraryFailed) { pending = true; await load(); if (request !== sequence) return; pending = false; }
    if (page()) { page().toggle(); return; }
    if (!tracks.length || libraryFailed) { render(); return; }
    if (!selected || (complete && continuousEnabled(current))) select(tracks[0], null, true);
    start();
  }
  function move(direction) {
    externalMediaOwner = null; restorePlayIntent = false; autoResumeBlocked = false; cancelRequestedPlay();
    sequence++; pending = false;
    if (page()) { page().move(direction); return; }
    const index = tracks.findIndex(track => track.id === selected?.id);
    if (index < 0 || !tracks.length) return; select(tracks[(index + direction + tracks.length) % tracks.length], null, true); start();
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
    if (!track || explicitSelection) restorePlayIntent = false;
    attemptRestorePlayback();
  }

  // A navigation resumes only a session that was actually playing. Browsers may
  // still require a tap; a denied attempt stays paused instead of retrying.
  function attemptRestorePlayback() {
    const current = state();
    if (restorePlayIntent && (current.failed || current.audio?.error)) { restorePlayIntent = false; persist(true); return; }
    if (!restoreDone || !restorePlayIntent || restoring || leaving || !current.track || current.audio?.readyState < 1 || current.pending || loading) return;
    restorePlayIntent = false;
    if (active(current)) return;
    if (page()) {
      const attempt = page().toggle(), request = sequence;
      Promise.resolve(attempt).then(() => {
        const after = state();
        if (request === sequence && !after.pending && !active(after)) { autoResumeBlocked = true; render(); persist(true); }
      }, () => { if (request === sequence) { autoResumeBlocked = true; render(); persist(true); } });
    } else start(true);
  }

  function updateMediaSession(current) {
    const session = typeof navigator !== 'undefined' && navigator.mediaSession;
    if (!session || !current.track || leaving) return;
    if (externalMediaOwner || activeExternalMedia(current).length) { mediaSessionOwned = false; return; }
    // A dormant dock must not replace controls owned by another page tool.
    if (!mediaSessionOwned) {
      if (!sessionPlaying(current)) return;
      claimMediaSession(); mediaSessionOwned = true; mediaTrackId = null; mediaSignature = '';
    }
    try {
      const audio = current.audio;
      const timing = current.track.displayTiming ?? current.track.lyricsTiming;
      const validTiming = timing && Number.isFinite(audio?.duration) && timing.at(-1).end <= audio.duration;
      const line = carLyrics && active(current) && audio.readyState > 0 && validTiming
        ? sync.activeLineAt(timing, audio.currentTime) : null;
      const text = current.track.displayLyrics ?? current.track.lyrics;
      const title = line === null ? songName(current.track) : text.split('\n')[line];
      const artist = line === null ? 'MapKAI' : `${songName(current.track)} · MapKAI`;
      const signature = JSON.stringify([current.track.id, title, artist]);
      if ((mediaTrackId !== current.track.id || mediaSignature !== signature) && typeof MediaMetadata !== 'undefined') {
        ownedMetadata = new MediaMetadata({ title, artist, album: 'MapKAI Music' });
        session.metadata = ownedMetadata;
        mediaTrackId = current.track.id;
        mediaSignature = signature;
      }
      session.playbackState = sessionPlaying(current) ? 'playing' : 'paused';
      if (session.setPositionState && audio?.readyState > 0 && Number.isFinite(audio.duration) && audio.duration > 0) {
        session.setPositionState({ duration: audio.duration, playbackRate: audio.playbackRate || 1, position: Math.max(0, Math.min(audio.duration, audio.currentTime || 0)) });
      }
    } catch {}
  }
  function setCarLyrics(value) {
    carLyrics = value === true && carSupported;
    try { localStorage.setItem(carKey, carLyrics ? 'on' : 'off'); } catch {}
    render(); window.dispatchEvent(new Event('mapkai:car-lyrics'));
  }
  function mediaSeek(seconds, external = null) {
    const audio = external || state().audio;
    if (!Number.isFinite(seconds) || !Number.isFinite(audio?.duration) || audio.duration <= 0 || audio.error) return;
    const ratio = Math.max(0, Math.min(audio.duration, seconds)) / audio.duration * 1000;
    if (!external && page()) page().seek(ratio); else audio.currentTime = ratio / 1000 * audio.duration;
    if (!external) { render(); persist(true); }
  }
  const mediaSession = typeof navigator !== 'undefined' && navigator.mediaSession;
  function claimMediaSession() {
    if (!mediaSession?.setActionHandler) return;
    const musicAction = action => details => { if (!externalMediaOwner && !activeExternalMedia(state()).length) action(details); };
    const systemPause = () => {
      const external = activeExternalMedia(state());
      if (external.length) external.forEach(media => media.pause());
      else if (externalMediaOwner) externalMediaOwner.pause();
      else pause();
    };
    const systemPlay = () => {
      // The last lesson keeps ownership while paused. System Play must never
      // silently switch back to Music; a Music button is an explicit handoff.
      if (externalMediaOwner) {
        try { Promise.resolve(externalMediaOwner.play()).catch(() => {}); } catch {}
        return;
      }
      const current = state(); if (!current.pending && !loading && !sessionPlaying(current)) toggle();
    };
    const sessionSeek = seconds => mediaSeek(seconds, externalMediaOwner);
    const actions = { play: systemPlay,
      pause: systemPause, stop: systemPause,
      previoustrack: musicAction(() => move(-1)), nexttrack: musicAction(() => move(1)),
      seekto: details => sessionSeek(details.seekTime),
      seekbackward: details => sessionSeek(((externalMediaOwner || state().audio)?.currentTime || 0) - (details.seekOffset || 10)),
      seekforward: details => sessionSeek(((externalMediaOwner || state().audio)?.currentTime || 0) + (details.seekOffset || 10)) };
    for (const [action, handler] of Object.entries(actions)) { try { mediaSession.setActionHandler(action, handler); } catch {} }
  }

  $('play').onclick = toggle; $('mini-play').onclick = toggle;
  $('car').onchange = () => setCarLyrics($('car').checked);
  $('prev').onclick = $('mini-prev').onclick = () => move(-1); $('next').onclick = $('mini-next').onclick = () => move(1);
  $('collapse').onclick = () => { collapse(!dock.classList.contains('is-collapsed')); render(); persist(true); };
  $('select').onchange = () => {
    const track = state().tracks.find(item => item.id === $('select').value); if (!track) return;
    externalMediaOwner = null; restorePlayIntent = false; autoResumeBlocked = false; cancelRequestedPlay(); explicitSelection = true;
    sequence++; pending = false;
    if (page()) page().play(track.id); else { select(track, null, true); start(); }
  };
  $('seek').oninput = () => {
    const value = Number($('seek').value), audio = state().audio;
    if (!Number.isFinite(value) || !Number.isFinite(audio?.duration) || audio.duration <= 0 || audio.error) return;
    externalMediaOwner = null;
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
  ownAudio.addEventListener('pause', () => {
    if (page() || !ownAudio.paused) return;
    // Native playback ends with pause before ended. Only the real ended flag
    // preserves intent; an OS/user pause near the end is still a true pause.
    if (playbackIntent && ownAudio.ended && continuousEnabled() && !leaving) advancing = true;
    else { clearPlaybackIntent(); sequence++; pending = false; cancelRequestedPlay(); }
    render();
  });
  ownAudio.addEventListener('ended', () => {
    if (!selected || !ownAudio.ended || page()) return;
    if (!playbackIntent || !continuousEnabled()) { clearPlaybackIntent(); pending = false; complete = true; render(); persist(true); return; }
    const index = tracks.findIndex(track => track.id === selected.id);
    if (index >= 0 && tracks.length) {
      advancing = true;
      select(tracks[(index + 1) % tracks.length], null, true); start();
    } else { clearPlaybackIntent(); pending = false; render(); }
  });
  ownAudio.addEventListener('error', () => { clearPlaybackIntent(); cancelRequestedPlay(); sequence++; pending = false; failed = true; render(); persist(true); });
  for (const event of ['play', 'playing']) ownAudio.addEventListener(event, () => {
    // A cancelled native request can resume late on mobile. Never let it play
    // without current intent, and never stop a newer legitimate request.
    if (!playbackIntent && !ownAudio.paused) ownAudio.pause();
    render();
  });
  for (const event of ['timeupdate', 'seeking', 'seeked', 'durationchange', 'waiting']) ownAudio.addEventListener(event, render);
  // Starting a lesson's narration or video pauses background music as well.
  document.addEventListener('play', event => {
    const target = event.target; if (!['AUDIO', 'VIDEO'].includes(target.tagName)) return;
    // Reject a stale own play before it can pause the real external owner.
    if (target === ownAudio && !playbackIntent) { if (!ownAudio.paused) ownAudio.pause(); return; }
    const current = state();
    if (target === current.audio) {
      document.querySelectorAll('audio,video').forEach(media => { if (media !== target && !media.paused) media.pause(); });
    } else {
      externalMediaOwner = target; mediaSessionOwned = false;
      if (restorePlayIntent || playbackIntent || pending || loading || current.pending || current.playbackIntent || active(current)) pause();
    }
  }, true);
  preferences?.subscribe(() => {
    if (!page()) { tracks.sort(compareTracks); render(); }
  });
  window.addEventListener('mapkai:music-update', () => { restore(); render(); });
  window.addEventListener('mapkai:music-intent', () => {
    if (delegatingPlay) return;
    externalMediaOwner = null; restorePlayIntent = false; autoResumeBlocked = false; cancelRequestedPlay(); sequence++; pending = false; explicitSelection = true;
  });
  window.addEventListener('mapkai:music-ready', () => { clearPlaybackIntent(); cancelRequestedPlay(); sequence++; ownAudio.pause(); restore(); render(); });
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  window.addEventListener('storage', event => {
    if (event.key === carKey || event.key === null) {
      try { carLyrics = carSupported && localStorage.getItem(carKey) === 'on'; } catch {}
      window.dispatchEvent(new Event('mapkai:car-lyrics')); render();
    }
    if (event.key === 'mapkaiMusicContinuous.v1') render();
  });
  document.addEventListener('visibilitychange', render);
  window.addEventListener('resize', render); reducedMotion.addEventListener?.('change', render);
  window.addEventListener('pagehide', () => {
    const current = state();
    if (mediaSessionOwned && mediaSession?.metadata === ownedMetadata && current.track && typeof MediaMetadata !== 'undefined') {
      try { mediaSession.metadata = new MediaMetadata({ title: songName(current.track), artist: 'MapKAI', album: 'MapKAI Music' }); } catch {}
      mediaSignature = '';
    }
    navigationWasPlaying = sessionPlaying(state()); cancelRequestedPlay(); sequence++; persist(true); leaving = true; clearPlaybackIntent();
    if (page()) page().pause(); else ownAudio.pause();
  }, { capture: true });
  window.addEventListener('pageshow', event => {
    leaving = false; if (event.persisted && navigationWasPlaying) restorePlayIntent = true; restore(); render();
  });
  window.MapKAIMusicDock = Object.freeze({ play: playTrack, pause: pauseTrack, resume: resumeTrack, snapshot: publicSnapshot, setCarLyrics,
    carLyricsState: () => ({ enabled: carLyrics, supported: carSupported }) });
  window.dispatchEvent(new Event('mapkai:music-dock-ready'));
  render(); restore();
  // Visitors who have not started listening incur no catalog/audio read.
  if (saved?.id && !page()) load();
})();
