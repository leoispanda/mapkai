(() => {
  'use strict';

  const copy = {
    zh: {
      back: '← 返回 Toolbox', intro: '歌曲小卡片，点击即可播放。', aiNotice: '使用 AI 创作的歌曲，会在卡片上标明 AI 生成，播放前即可看到。', aiGenerated: 'AI 生成', library: '歌曲列表', searchLabel: '搜索歌曲', search: '搜索歌曲…', manage: '管理歌曲',
      createSong: '制作歌曲', composerIntro: '先在这里准备创作说明，复制后粘贴到 ElevenLabs。歌曲会在你自己的音乐账号中制作，并使用该账号的点数。', composerPrivacy: '你的主题和歌词只保留在当前页面；由你复制并粘贴到音乐工具。', composerTheme: '想法或主题', composerStyle: '音乐风格', composerDuration: '时长', styleMemphisHipHop: '孟菲斯 Hip-hop', styleRock: '摇滚', styleSymphonic: '交响', styleFolkRap: '民谣说唱', styleAcoustic: '原声', durationOne: '1 分钟', durationTwo: '2 分钟', composerLyrics: '原创歌词（可选）', composerLyricsPlaceholder: '留空即可按主题创作原创歌词。', preparePrompt: '生成创作说明', composerPrompt: '创作说明', copyPrompt: '复制创作说明', copyingPrompt: '正在复制…', openCreator: '打开音乐制作工具 ↗', composerReturn: '先复制说明，再打开音乐工具粘贴并制作。下载完成的歌曲后，回到这里通过“管理歌曲”上传成品。', composerReady: '创作说明已准备好。先复制，再到音乐工具中粘贴。', composerCopied: '已复制创作说明。打开音乐工具并粘贴，即可开始制作。', composerCopyFallback: '请复制已选中的创作说明：按 ⌘C 或 Ctrl+C，也可以长按复制。', composerThemeRequired: '请填写歌曲的想法或主题。', composerThemeLimit: '主题最多 1000 个字符。', composerLyricsLimit: '歌词最多 2400 个字符。', composerStyleRequired: '请选择一种音乐风格。', composerDurationRequired: '请选择 1 分钟或 2 分钟。', composerPromptLimit: '创作说明最多 4100 个字符，请缩短主题或歌词。', composerCount: '{count} / 4100 个字符',
      libraryError: '暂时无法载入歌曲列表，请再试一次。', retry: '重新载入', emptyTitle: '还没有歌曲。', emptyCopy: '歌曲上传后，会在这里展示。', noResults: '没有找到这首歌。', noResultsCopy: '试试其他关键词，或看看完整列表。', clearSearch: '查看全部歌曲', home: '回到 MapKAI ↗',
      studioTitle: '上传歌曲', close: '关闭', checking: '正在打开歌曲工作室…', ownerIntro: '输入 MapKAI 管理密码，开始上传歌曲。', ownerCode: '管理密码', login: '打开工作室', unavailable: '暂时无法上传歌曲，请稍后再试。', uploadIntro: '下载你使用 AI 创作的歌曲，在这里上传，即可加入公开歌曲列表。', chooseFile: '选择歌曲文件', fileFormats: 'MP3 / M4A / WAV · 每首最多 25 MB', preview: '上传前试听', songTitle: '歌名', songLanguage: '歌曲语言', chooseLanguage: '请选择英语、荷兰语或中文。', songDescription: '一句介绍（可选）', titlePlaceholder: '给这首歌一个名字', descriptionPlaceholder: '这首歌的灵感，或你想说的话…', publishNote: '上传的歌曲和 AI 生成标识会公开展示。请确认你有权分享这首作品。', progress: '上传进度', publish: '上传并加入列表',
      loading: '正在载入歌曲…', count: '{count} 首歌曲', filteredCount: '{shown} / {count} 首歌曲', playing: '正在播放：{title}', buffering: '正在缓冲：{title}', playSong: '播放', pauseSong: '暂停', loadingSong: '正在缓冲…', retrySong: '点击重试', audioLabel: '播放 {title}', pauseLabel: '暂停 {title}', cancelLabel: '停止载入 {title}', retryLabel: '重新播放 {title}', controlsLabel: '{title} 的播放控制', audioError: '暂时无法播放这首歌，点击卡片重试。', previewAudio: '试听所选歌曲', authenticating: '正在打开工作室…', wrongCode: '管理密码不正确，请再试一次。', loginFailed: '暂时无法打开工作室，请稍后再试。', chooseFirst: '请先选择一首歌曲。', invalidFile: '请选择 MP3、M4A 或 WAV 格式的歌曲。', fileTooLarge: '这首歌超过 25 MB，请选择更小的文件。', emptyFile: '这个文件是空的，请重新选择。', addTitle: '请给这首歌填写一个名字。', uploading: '正在上传歌曲，请保持页面打开…', publishing: '文件已发送，正在加入歌曲列表…', uploaded: '上传成功，已加入公开歌曲列表。你可以继续上传下一首。', uploadedRefresh: '歌曲已上传。暂时无法刷新歌曲列表，请稍后重新载入。', uploadFailed: '上传未完成，请再试一次。', sessionExpired: '请重新输入管理密码，再上传这首歌。', tooMany: '操作太频繁，请稍后再试。', titleLimit: '歌名最多 120 个字。', descriptionLimit: '介绍最多 500 个字。', storageFull: '暂时无法保存这首歌，请稍后再试。', unknownOutcome: '连接中断，无法确认上传结果。请先重新载入歌曲列表，确认歌曲是否已经出现。',
    },
    en: {
      back: '← Back to Toolbox', intro: 'Tap a song card to listen.', aiNotice: 'Songs created with AI are labelled AI-generated on their cards before playback.', aiGenerated: 'AI-generated', library: 'Song list', searchLabel: 'Search songs', search: 'Search songs…', manage: 'Manage songs',
      createSong: 'Create a song', composerIntro: 'Prepare a prompt here, then copy and paste it into ElevenLabs. The song is generated in your own music account and uses that account’s credits.', composerPrivacy: 'Your theme and lyrics stay on this page. You choose when to copy and paste them into the music tool.', composerTheme: 'Idea or theme', composerStyle: 'Music style', composerDuration: 'Duration', styleMemphisHipHop: 'Memphis hip-hop', styleRock: 'Rock', styleSymphonic: 'Symphonic', styleFolkRap: 'Folk rap', styleAcoustic: 'Acoustic', durationOne: '1 minute', durationTwo: '2 minutes', composerLyrics: 'Original lyrics (optional)', composerLyricsPlaceholder: 'Leave blank to create original lyrics from your theme.', preparePrompt: 'Prepare prompt', composerPrompt: 'Your creation prompt', copyPrompt: 'Copy prompt', copyingPrompt: 'Copying…', openCreator: 'Open music creator ↗', composerReturn: 'Copy the prompt first, then open the music tool, paste it, and create your song. Download the finished song and return here to upload it through Manage songs.', composerReady: 'Your prompt is ready. Copy it, then paste it into the music tool.', composerCopied: 'Prompt copied. Open the music tool and paste it to begin creating.', composerCopyFallback: 'Copy the selected prompt with ⌘C or Ctrl+C, or press and hold to copy.', composerThemeRequired: 'Add an idea or theme for your song.', composerThemeLimit: 'The theme can have up to 1000 characters.', composerLyricsLimit: 'The lyrics can have up to 2400 characters.', composerStyleRequired: 'Choose a music style.', composerDurationRequired: 'Choose 1 minute or 2 minutes.', composerPromptLimit: 'The prompt can have up to 4100 characters. Shorten the theme or lyrics.', composerCount: '{count} / 4100 characters',
      libraryError: 'The song list could not be loaded. Please try again.', retry: 'Try again', emptyTitle: 'No songs yet.', emptyCopy: 'Songs will appear here once uploaded.', noResults: 'No songs found.', noResultsCopy: 'Try another keyword, or see the full list.', clearSearch: 'See all songs', home: 'Back to MapKAI ↗',
      studioTitle: 'Upload a song', close: 'Close', checking: 'Opening the music studio…', ownerIntro: 'Enter the MapKAI owner password to upload songs.', ownerCode: 'Owner password', login: 'Open the studio', unavailable: 'Uploads are temporarily unavailable. Please try again later.', uploadIntro: 'Download the song you created with AI, then upload it here to join the public song list.', chooseFile: 'Choose a song file', fileFormats: 'MP3 / M4A / WAV · Up to 25 MB per song', preview: 'Listen before uploading', songTitle: 'Song title', songLanguage: 'Song language', chooseLanguage: 'Choose English, Dutch, or Chinese.', songDescription: 'A few words (optional)', titlePlaceholder: 'Give your song a name', descriptionPlaceholder: 'The inspiration behind this song, or something you want to share…', publishNote: 'Uploaded songs and their AI-generated labels are public. Please make sure you have the right to share this work.', progress: 'Upload progress', publish: 'Upload to the list',
      loading: 'Loading songs…', count: '{count} songs', filteredCount: '{shown} of {count} songs', playing: 'Now playing: {title}', buffering: 'Buffering: {title}', playSong: 'Play', pauseSong: 'Pause', loadingSong: 'Buffering…', retrySong: 'Tap to retry', audioLabel: 'Play {title}', pauseLabel: 'Pause {title}', cancelLabel: 'Stop loading {title}', retryLabel: 'Retry {title}', controlsLabel: 'Playback controls for {title}', audioError: 'This song cannot be played right now. Tap the card to retry.', previewAudio: 'Preview selected song', authenticating: 'Opening the studio…', wrongCode: 'The owner password is incorrect. Please try again.', loginFailed: 'The studio could not be opened. Please try again later.', chooseFirst: 'Choose a song file first.', invalidFile: 'Choose an MP3, M4A, or WAV song file.', fileTooLarge: 'This song is over 25 MB. Please choose a smaller file.', emptyFile: 'This file is empty. Please choose another one.', addTitle: 'Please give your song a title.', uploading: 'Uploading your song. Please keep this page open…', publishing: 'File sent. Adding your song to the list…', uploaded: 'Your song is uploaded and in the public song list. You can upload another.', uploadedRefresh: 'Your song is uploaded. The song list could not be refreshed; please reload it later.', uploadFailed: 'The upload did not finish. Please try again.', sessionExpired: 'Enter the owner password again, then upload your song.', tooMany: 'Too many attempts. Please try again later.', titleLimit: 'The title can have up to 120 characters.', descriptionLimit: 'The description can have up to 500 characters.', storageFull: 'Your song could not be saved right now. Please try again later.', unknownOutcome: 'The connection was interrupted, so we cannot confirm the upload. Reload the song list first to check whether your song is already there.',
    },
  };
  const $ = id => document.getElementById(id);
  const studio = $('music-studio');
  const composer = $('music-composer');
  const preview = $('preview-audio');
  const cards = new Map();
  const featuredRank = new Map([
    ['ba310ae6-7b5f-4807-934a-9e0ddd849491', -1],
    ['ccb37c55-bae6-4f72-a80a-d1bc94e40ae0', 0],
    ['e4363fdb-2354-4e5c-98f0-9549b689b5c3', 1],
    ['bb5957e7-9e91-45e1-a978-5643451d7820', 2],
  ]);
  let language = 'zh';
  let tracks = [];
  let loaded = false;
  let libraryPromise = null;
  let libraryFailed = false;
  let playingAudio = null;
  let selectedCard = null;
  let cardSequence = 0;
  let previewUrl = null;
  let uploading = false;
  let authenticating = false;
  let ownerStatus = null;
  let uploadStatus = null;
  let uploadPercent = 0;
  let uploadSent = false;
  let authSequence = 0;
  let composerStatus = null;
  let copyingPrompt = false;
  let copySequence = 0;

  try {
    const saved = localStorage.getItem('mapkaiMusicLanguage');
    if (saved === 'en' || saved === 'zh') language = saved;
  } catch {}

  function t(key, values = {}) {
    return Object.entries(values).reduce((value, [name, replacement]) => value.replaceAll(`{${name}}`, String(replacement)), copy[language][key] || key);
  }

  function status(element, entry) {
    element.hidden = !entry;
    if (entry) {
      element.textContent = t(entry.key, entry.values);
      element.dataset.kind = entry.kind || 'info';
    }
  }

  function setOwnerStatus(key, kind = 'info') {
    ownerStatus = key ? { key, kind } : null;
    status($('owner-status'), ownerStatus);
  }

  function setUploadStatus(key, kind = 'info') {
    uploadStatus = key ? { key, kind } : null;
    status($('upload-status'), uploadStatus);
  }

  function setComposerStatus(key, kind = 'info') {
    composerStatus = key ? { key, kind } : null;
    status($('composer-status'), composerStatus);
  }

  function updateComposerCopy() {
    $('copy-prompt').disabled = copyingPrompt || !$('composer-prompt').value;
    $('copy-prompt').textContent = t(copyingPrompt ? 'copyingPrompt' : 'copyPrompt');
    $('composer-count').textContent = t('composerCount', { count: $('composer-prompt').value.length });
  }

  function invalidateComposerPrompt() {
    copySequence += 1;
    copyingPrompt = false;
    $('composer-prompt').value = '';
    $('composer-output').hidden = true;
    setComposerStatus(null);
    updateComposerCopy();
  }

  function prepareComposerPrompt() {
    const title = $('composer-song-title').value.trim();
    const theme = $('composer-theme').value.trim();
    const songLanguage = $('composer-language').value;
    const style = $('composer-style').value;
    const seconds = Number($('composer-duration').value);
    const lyrics = $('composer-lyrics').value.trim();
    const languageNames = { en: 'English', nl: 'Dutch', zh: 'Mandarin Chinese' };
    const musicalDirections = {
      'memphis-hip-hop': 'Upbeat, bouncy, rhythmic Memphis hip-hop with warm clean bass, crisp snare and claps, lively hi-hats, and a catchy city-name hook. Use clear melodic and spoken vocals, with bright acoustic or light guitar accents. Keep the mood sunny and lively; avoid dark phonk, metal, screaming, and heavily distorted guitars.',
      rock: 'Bright melodic rock with clear singing, moderate light guitar accents, crisp drums, warm clean bass, and a catchy chorus. Keep the vocals clean and the arrangement open; avoid heavy metal, screaming, and heavily distorted guitars.',
      symphonic: 'Cinematic symphonic music with orchestral strings, brass, dynamic percussion, and a soaring vocal melody.',
      'folk-rap': 'A folk and rap blend with acoustic instrumentation, rhythmic spoken verses, and a melodic sung chorus.',
      acoustic: 'Warm acoustic music with fingerpicked guitar, gentle percussion, intimate vocals, and a melodic chorus.',
    };
    let invalid = null;
    if (!title) invalid = ['addTitle', 'composer-song-title'];
    else if (title.length > 120) invalid = ['titleLimit', 'composer-song-title'];
    else if (!theme) invalid = ['composerThemeRequired', 'composer-theme'];
    else if (theme.length > 1000) invalid = ['composerThemeLimit', 'composer-theme'];
    else if (!Object.hasOwn(languageNames, songLanguage)) invalid = ['chooseLanguage', 'composer-language'];
    else if (!Object.hasOwn(musicalDirections, style)) invalid = ['composerStyleRequired', 'composer-style'];
    else if (![60, 120].includes(seconds)) invalid = ['composerDurationRequired', 'composer-duration'];
    else if (lyrics.length > 2400) invalid = ['composerLyricsLimit', 'composer-lyrics'];
    invalidateComposerPrompt();
    if (invalid) { setComposerStatus(invalid[0], 'error'); $(invalid[1]).focus(); return; }
    const prompt = [
      `Create an original vocal song titled "${title}".`,
      `Language: ${languageNames[songLanguage]}. Sing all lyrics in ${languageNames[songLanguage]}.`,
      `Duration: exactly ${seconds} seconds (${seconds / 60}:00). Finish the complete song at ${seconds / 60}:00, with a clear ending.`,
      `Musical direction: ${musicalDirections[style]}`,
      'Composition: use an original melody and arrangement. Do not imitate any artist, band, or existing song. Include clear lead vocals, distinct verses, and a memorable chorus.',
      `Theme and imagery:\n${theme}`,
      lyrics ? `Use these original lyrics as the sung text:\n${lyrics}` : `Write original lyrics in ${languageNames[songLanguage]} based on the theme. Use a coherent story, specific imagery, and a singable chorus.`,
    ].join('\n\n');
    if (prompt.length > 4100) { setComposerStatus('composerPromptLimit', 'error'); $('composer-lyrics').focus(); return; }
    $('composer-prompt').value = prompt;
    $('composer-output').hidden = false;
    setComposerStatus('composerReady', 'success');
    updateComposerCopy();
    $('composer-prompt').focus();
  }

  async function copyComposerPrompt() {
    const prompt = $('composer-prompt').value;
    if (!prompt || copyingPrompt) return;
    const sequence = ++copySequence;
    copyingPrompt = true;
    updateComposerCopy();
    try {
      await navigator.clipboard.writeText(prompt);
      if (sequence === copySequence) setComposerStatus('composerCopied', 'success');
    } catch {
      if (sequence !== copySequence) return;
      $('composer-prompt').focus();
      $('composer-prompt').select();
      $('composer-prompt').setSelectionRange(0, prompt.length);
      setComposerStatus('composerCopyFallback');
    } finally {
      if (sequence === copySequence) { copyingPrompt = false; updateComposerCopy(); }
    }
  }

  function applyLanguage(next) {
    language = next;
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
    document.querySelectorAll('[data-placeholder]').forEach(element => { element.placeholder = t(element.dataset.placeholder); });
    document.querySelectorAll('[data-aria]').forEach(element => { element.setAttribute('aria-label', t(element.dataset.aria)); });
    document.querySelectorAll('[data-language]').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.language === next)); });
    document.querySelector('.brand').setAttribute('aria-label', next === 'zh' ? 'MapKAI 首页' : 'MapKAI home');
    $('tracks').setAttribute('aria-label', next === 'zh' ? '歌曲列表' : 'Songs');
    preview.setAttribute('aria-label', t('previewAudio'));
    document.querySelector('meta[name=description]').content = next === 'zh' ? 'MapKAI Music。使用 AI 创作的歌曲，点击卡片即可播放。' : 'MapKAI Music. Songs created with AI. Tap a card to listen.';
    updateLibrary();
    status($('owner-status'), ownerStatus);
    status($('upload-status'), uploadStatus);
    status($('composer-status'), composerStatus);
    updateComposerCopy();
    updateProgress();
    if (authenticating) $('owner-login').textContent = t('authenticating');
    if (uploading) $('publish-song').textContent = t(uploadSent ? 'publishing' : 'uploading');
    try { localStorage.setItem('mapkaiMusicLanguage', next); } catch {}
  }

  function safeTrack(raw) {
    if (!raw || !['en', 'nl', 'zh'].includes(raw.language) || typeof raw.id !== 'string' || typeof raw.title !== 'string' || typeof raw.url !== 'string') return null;
    try {
      const url = new URL(raw.url, location.href);
      if (url.origin !== location.origin || !['https:', 'http:'].includes(url.protocol)) return null;
      return { ...raw, title: raw.title.slice(0, 120), description: typeof raw.description === 'string' ? raw.description.slice(0, 500) : '', url: url.href,
        aiGenerated: raw.aiGenerated === true && raw.generationProvider === 'ElevenLabs', generationProvider: raw.generationProvider === 'ElevenLabs' ? 'ElevenLabs' : null };
    } catch { return null; }
  }

  function stopOtherPlayers(audio) {
    if (playingAudio && playingAudio !== audio) playingAudio.pause();
    for (const card of cards.values()) {
      if (card.audio === audio) selectedCard = card;
      else {
        card.playRequest += 1;
        card.pending = false;
        card.waiting = false;
        card.audio.pause();
      }
    }
    if (audio === preview) selectedCard = null;
    if (preview !== audio && !preview.paused) preview.pause();
    playingAudio = audio;
    updatePlaying();
  }

  function updatePlaying() {
    let activeTrack = null;
    let buffering = false;
    for (const card of cards.values()) {
      const active = !card.audio.paused && !card.audio.ended && !card.audio.error;
      const waiting = card.pending || (active && card.waiting);
      const selected = card === selectedCard;
      card.element.classList.toggle('is-playing', active);
      card.element.classList.toggle('is-buffering', waiting);
      card.element.classList.toggle('is-selected', selected);
      card.audio.hidden = !selected;
      card.button.setAttribute('aria-expanded', String(selected));
      card.button.setAttribute('aria-label', t(waiting ? 'cancelLabel' : active ? 'pauseLabel' : !card.error.hidden ? 'retryLabel' : 'audioLabel', { title: card.track.title }));
      card.icon.dataset.state = waiting ? 'loading' : active ? 'pause' : 'play';
      card.action.textContent = t(waiting ? 'loadingSong' : active ? 'pauseSong' : !card.error.hidden ? 'retrySong' : 'playSong');
      if (active || waiting) { activeTrack = card.track; buffering = waiting; }
    }
    $('library-status').hidden = !activeTrack;
    if (activeTrack) $('library-status').textContent = t(buffering ? 'buffering' : 'playing', { title: activeTrack.title });
  }

  function playbackError(card) {
    card.pending = false;
    card.waiting = false;
    card.error.textContent = t('audioError');
    card.error.hidden = false;
    updatePlaying();
  }

  async function togglePlayback(card) {
    if (card.pending || (!card.audio.paused && !card.audio.ended && !card.audio.error)) {
      card.playRequest += 1;
      card.pending = false;
      card.waiting = false;
      card.audio.pause();
      updatePlaying();
      return;
    }
    selectedCard = card;
    stopOtherPlayers(card.audio);
    card.error.hidden = true;
    if (card.audio.error) card.audio.load();
    const request = ++card.playRequest;
    card.pending = true;
    updatePlaying();
    try {
      await card.audio.play();
      if (request !== card.playRequest) return;
      card.pending = false;
      updatePlaying();
    } catch (error) {
      // Switching tracks or pausing cancels the earlier request without showing an error.
      if (request !== card.playRequest) return;
      if (error.name === 'AbortError' && card.audio.paused) { card.pending = false; card.waiting = false; updatePlaying(); }
      else playbackError(card);
    }
  }

  function duration(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) return '';
    const total = Math.floor(seconds);
    const hours = Math.floor(total / 3600);
    return hours ? `${hours}:${String(Math.floor(total / 60) % 60).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}` : `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
  }

  function trackMetadata(card) {
    const ext = String(card.track.filename || '').match(/\.(mp3|m4a|wav)$/i)?.[1]?.toUpperCase();
    const length = duration(card.audio.duration || card.track.durationSeconds);
    const songLanguage = { en: 'English', nl: 'Nederlands', zh: '中文' }[card.track.language];
    card.meta.textContent = [songLanguage, ext, length].filter(Boolean).join(' · ');
    card.disclosure.hidden = !card.track.aiGenerated;
    card.disclosure.textContent = t('aiGenerated');
    if (card.track.aiGenerated) card.button.setAttribute('aria-describedby', card.disclosure.id);
    else card.button.removeAttribute('aria-describedby');
  }

  function createCard(track) {
    const element = document.createElement('li');
    element.className = 'track-card';
    const button = document.createElement('button'); button.type = 'button'; button.className = 'track-button';
    const icon = document.createElement('span'); icon.className = 'track-icon'; icon.setAttribute('aria-hidden', 'true'); icon.dataset.state = 'play';
    const content = document.createElement('span'); content.className = 'track-copy';
    const title = document.createElement('span'); title.className = 'track-title'; title.textContent = track.title;
    const disclosure = document.createElement('span'); disclosure.className = 'track-disclosure';
    const description = document.createElement('span'); description.className = 'track-description'; description.textContent = track.description; description.hidden = !track.description;
    const meta = document.createElement('span'); meta.className = 'track-meta';
    const action = document.createElement('span'); action.className = 'track-action'; action.setAttribute('aria-hidden', 'true');
    content.append(title, disclosure, description, meta, action); button.append(icon, content);
    const audio = document.createElement('audio'); audio.controls = true; audio.preload = 'none'; audio.src = track.url; audio.hidden = true;
    audio.id = `song-controls-${++cardSequence}`; button.setAttribute('aria-controls', audio.id);
    disclosure.id = `${audio.id}-disclosure`;
    const error = document.createElement('p'); error.className = 'track-error'; error.setAttribute('role', 'status'); error.hidden = true;
    element.append(button, audio, error);
    const card = { element, button, icon, action, audio, error, title, disclosure, description, meta, track, pending: false, waiting: false, playRequest: 0 };
    button.addEventListener('click', () => togglePlayback(card));
    audio.addEventListener('play', () => { if (audio.paused) return; error.hidden = true; card.waiting = true; stopOtherPlayers(audio); });
    audio.addEventListener('playing', () => { if (audio.paused) return; card.pending = false; card.waiting = false; error.hidden = true; updatePlaying(); });
    audio.addEventListener('waiting', () => { if (audio.paused) return; card.waiting = true; updatePlaying(); });
    audio.addEventListener('pause', () => { if (!audio.paused) return; card.pending = false; card.waiting = false; updatePlaying(); });
    audio.addEventListener('ended', () => { card.pending = false; card.waiting = false; updatePlaying(); });
    audio.addEventListener('loadedmetadata', () => { trackMetadata(card); updatePlaying(); });
    audio.addEventListener('error', () => playbackError(card));
    trackMetadata(card);
    return card;
  }

  function syncCards() {
    tracks.sort((first, second) => (featuredRank.get(first.id) ?? 3) - (featuredRank.get(second.id) ?? 3)
      || (Date.parse(second.createdAt) || 0) - (Date.parse(first.createdAt) || 0));
    const ids = new Set(tracks.map(track => track.id));
    for (const [id, card] of cards) {
      if (!ids.has(id)) { card.playRequest += 1; if (selectedCard === card) selectedCard = null; card.audio.pause(); card.audio.removeAttribute('src'); card.element.remove(); cards.delete(id); }
    }
    for (const [index, track] of tracks.entries()) {
      let card = cards.get(track.id);
      if (!card) { card = createCard(track); cards.set(track.id, card); }
      else {
        card.track = track;
        card.title.textContent = track.title;
        card.description.textContent = track.description;
        card.description.hidden = !track.description;
        if (card.audio.src !== track.url) { card.playRequest += 1; card.pending = false; card.waiting = false; card.audio.pause(); card.audio.src = track.url; card.error.hidden = true; }
        trackMetadata(card);
      }
      const current = $('tracks').children[index];
      if (current !== card.element) $('tracks').insertBefore(card.element, current || null);
    }
    updateLibrary();
  }

  function updateLibrary() {
    const query = $('song-search').value.trim().toLocaleLowerCase();
    let shown = 0;
    for (const card of cards.values()) {
      const matches = `${card.track.title} ${card.track.description}`.toLocaleLowerCase().includes(query);
      card.element.hidden = !matches;
      if (!matches && (card.pending || !card.audio.paused)) { card.playRequest += 1; card.pending = false; card.waiting = false; card.audio.pause(); }
      if (matches) shown += 1;
      card.audio.setAttribute('aria-label', t('controlsLabel', { title: card.track.title }));
      trackMetadata(card);
      if (!card.error.hidden) card.error.textContent = t('audioError');
    }
    $('track-count').textContent = !loaded ? (libraryFailed ? '—' : t('loading')) : t(query ? 'filteredCount' : 'count', { count: tracks.length, shown });
    $('empty-library').hidden = !loaded || tracks.length !== 0;
    $('empty-search').hidden = !loaded || !tracks.length || shown !== 0;
    $('song-search').disabled = !loaded || !tracks.length;
    updatePlaying();
  }

  async function jsonRequest(url, options = {}, timeout = 20000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store', ...options, signal: controller.signal });
      const data = await response.json().catch(() => null);
      if (!response.ok) { const error = new Error('Request failed'); error.status = response.status; throw error; }
      if (!data || typeof data !== 'object') throw new Error('Invalid response');
      return data;
    } finally { clearTimeout(timer); }
  }

  function loadLibrary() {
    if (libraryPromise) return libraryPromise;
    libraryPromise = fetchLibrary().finally(() => { libraryPromise = null; });
    return libraryPromise;
  }

  async function fetchLibrary() {
    libraryFailed = false;
    $('retry-library').disabled = true;
    $('library-error').hidden = true;
    if (!loaded) updateLibrary();
    try {
      const results = new Map();
      const cursors = new Set();
      let cursor = null;
      do {
        const data = await jsonRequest(`/api/music/tracks${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`);
        if (!Array.isArray(data.tracks)) throw new Error('Invalid collection');
        data.tracks.map(safeTrack).filter(Boolean).forEach(track => results.set(track.id, track));
        cursor = typeof data.nextCursor === 'string' && data.nextCursor ? data.nextCursor : null;
        if (cursor && cursors.has(cursor)) throw new Error('Invalid collection page');
        if (cursor) cursors.add(cursor);
      } while (cursor);
      tracks = Array.from(results.values());
      loaded = true;
      syncCards();
      return true;
    } catch {
      libraryFailed = true;
      $('library-error').hidden = false;
      if (!loaded) $('track-count').textContent = '—';
      return false;
    } finally { $('retry-library').disabled = false; }
  }

  function showOwner() {
    $('studio-checking').hidden = true;
    $('upload-unavailable').hidden = true;
    $('upload-form').hidden = true;
    $('owner-form').hidden = false;
    if (studio.open) $('owner-code').focus();
  }

  function showUpload() {
    $('studio-checking').hidden = true;
    $('upload-unavailable').hidden = true;
    $('owner-form').hidden = true;
    $('upload-form').hidden = false;
    if (studio.open) ($('song-file').files.length ? $('song-title') : $('song-file')).focus();
  }

  async function checkOwner() {
    const sequence = ++authSequence;
    $('studio-checking').hidden = false;
    $('owner-form').hidden = true;
    $('upload-form').hidden = true;
    $('upload-unavailable').hidden = true;
    setOwnerStatus(null);
    try {
      const data = await jsonRequest('/api/music/auth');
      if (sequence !== authSequence) return;
      if (!data.uploadConfigured) throw new Error('Unavailable');
      if (data.owner) showUpload(); else showOwner();
    } catch {
      if (sequence !== authSequence) return;
      $('studio-checking').hidden = true;
      $('upload-unavailable').hidden = false;
    }
  }

  function revokePreview() {
    preview.pause();
    preview.removeAttribute('src');
    preview.load();
    if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null; }
    $('file-preview').hidden = true;
  }

  function validateFile(file) {
    if (!file) return 'chooseFirst';
    if (!/\.(mp3|m4a|wav)$/i.test(file.name)) return 'invalidFile';
    if (!file.size) return 'emptyFile';
    if (file.size > 25 * 1024 * 1024) return 'fileTooLarge';
    return null;
  }

  function updateProgress() {
    $('progress-label').textContent = uploadSent ? (language === 'zh' ? '正在保存…' : 'Saving…') : `${uploadPercent}%`;
  }

  function setUploading(value) {
    uploading = value;
    $('upload-form').querySelectorAll('input,textarea,select,button').forEach(element => { element.disabled = value; });
    $('close-studio').disabled = value;
    $('upload-progress').hidden = !value;
    $('publish-song').textContent = t(value ? (uploadSent ? 'publishing' : 'uploading') : 'publish');
  }

  function uploadSong(formData) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('POST', '/api/music/tracks');
      request.withCredentials = true;
      request.timeout = 300000;
      request.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          uploadPercent = Math.min(100, Math.round(event.loaded / event.total * 100));
          $('progress-bar').value = uploadPercent;
          updateProgress();
        }
      });
      request.upload.addEventListener('load', () => {
        uploadSent = true;
        setUploadStatus('publishing');
        $('publish-song').textContent = t('publishing');
        $('progress-bar').removeAttribute('value');
        updateProgress();
      });
      request.addEventListener('load', () => {
        let data;
        try { data = JSON.parse(request.responseText); } catch {}
        const track = safeTrack(data?.track);
        if (request.status >= 200 && request.status < 300 && track) resolve(track);
        else {
          const error = new Error('Upload failed');
          error.status = request.status;
          error.uncertain = request.status >= 200 && request.status < 300;
          reject(error);
        }
      });
      const interrupted = () => { const error = new Error('Connection interrupted'); error.uncertain = true; reject(error); };
      request.addEventListener('error', interrupted);
      request.addEventListener('timeout', interrupted);
      request.addEventListener('abort', interrupted);
      request.send(formData);
    });
  }

  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => applyLanguage(button.dataset.language)));
  $('create-music').addEventListener('click', () => { composer.showModal(); $('composer-song-title').focus(); });
  $('close-composer').addEventListener('click', () => composer.close());
  $('composer-form').addEventListener('submit', event => { event.preventDefault(); prepareComposerPrompt(); });
  $('composer-form').addEventListener('input', invalidateComposerPrompt);
  $('composer-form').addEventListener('change', invalidateComposerPrompt);
  $('copy-prompt').addEventListener('click', copyComposerPrompt);
  $('song-search').addEventListener('input', updateLibrary);
  $('clear-search').addEventListener('click', () => { $('song-search').value = ''; updateLibrary(); $('song-search').focus(); });
  $('retry-library').addEventListener('click', loadLibrary);
  $('manage-music').addEventListener('click', () => { studio.showModal(); checkOwner(); });
  $('retry-studio').addEventListener('click', checkOwner);
  $('close-studio').addEventListener('click', () => { if (!uploading) studio.close(); });
  studio.addEventListener('cancel', event => { if (uploading) event.preventDefault(); });
  studio.addEventListener('close', () => { authSequence += 1; preview.pause(); $('owner-code').value = ''; });
  preview.addEventListener('play', () => stopOtherPlayers(preview));
  preview.addEventListener('pause', updatePlaying);

  $('owner-form').addEventListener('submit', async event => {
    event.preventDefault();
    if (authenticating) return;
    const code = $('owner-code').value;
    if (!code) return;
    $('owner-code').value = '';
    authenticating = true;
    $('owner-code').disabled = true;
    $('owner-login').disabled = true;
    $('owner-login').textContent = t('authenticating');
    setOwnerStatus('authenticating');
    try {
      const data = await jsonRequest('/api/music/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
      if (!data.owner) throw new Error('Not authenticated');
      setOwnerStatus(null);
      if (data.uploadConfigured) showUpload(); else { $('owner-form').hidden = true; $('upload-unavailable').hidden = false; }
    } catch (error) { setOwnerStatus(error.status === 401 ? 'wrongCode' : error.status === 429 ? 'tooMany' : 'loginFailed', 'error'); }
    finally {
      authenticating = false;
      $('owner-code').disabled = false;
      $('owner-login').disabled = false;
      $('owner-login').textContent = t('login');
      if (!$('owner-form').hidden && studio.open) $('owner-code').focus();
    }
  });

  $('song-file').addEventListener('change', () => {
    revokePreview();
    setUploadStatus(null);
    const file = $('song-file').files[0];
    if (!file) return;
    const error = validateFile(file);
    if (error) { $('song-file').value = ''; setUploadStatus(error, 'error'); return; }
    previewUrl = URL.createObjectURL(file);
    preview.src = previewUrl;
    $('file-preview').hidden = false;
    $('selected-file').textContent = `${file.name} · ${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    if (!$('song-title').value.trim()) $('song-title').value = file.name.replace(/\.[^.]+$/, '').slice(0, 120);
  });

  $('upload-form').addEventListener('submit', async event => {
    event.preventDefault();
    if (uploading) return;
    const file = $('song-file').files[0];
    const title = $('song-title').value.trim();
    const description = $('song-description').value.trim();
    const songLanguage = $('song-language').value;
    const invalid = validateFile(file) || (!['en', 'nl', 'zh'].includes(songLanguage) ? 'chooseLanguage' : !title ? 'addTitle' : title.length > 120 ? 'titleLimit' : description.length > 500 ? 'descriptionLimit' : null);
    if (invalid) { setUploadStatus(invalid, 'error'); return; }
    preview.pause();
    uploadPercent = 0; uploadSent = false;
    $('progress-bar').value = 0;
    setUploadStatus('uploading');
    setUploading(true);
    const data = new FormData();
    data.append('file', file); data.append('title', title); data.append('description', description); data.append('language', songLanguage);
    try {
      const track = await uploadSong(data);
      // Finish a pre-upload refresh before publishing the newly confirmed track in the page.
      // A fresh read below then verifies the durable public collection.
      if (libraryPromise) await libraryPromise;
      tracks = [track, ...tracks.filter(item => item.id !== track.id)];
      loaded = true;
      $('song-search').value = '';
      syncCards();
      revokePreview();
      $('upload-form').reset();
      setUploadStatus('uploaded', 'success');
      const refreshed = await loadLibrary();
      if (!refreshed) setUploadStatus('uploadedRefresh', 'success');
    } catch (error) {
      if (error.status === 401 || error.status === 403) { showOwner(); setOwnerStatus('sessionExpired', 'error'); }
      else setUploadStatus(error.uncertain ? 'unknownOutcome' : error.status === 413 ? 'fileTooLarge' : error.status === 415 ? 'invalidFile' : error.status === 429 ? 'tooMany' : error.status === 503 || error.status === 507 ? 'storageFull' : 'uploadFailed', 'error');
    } finally { setUploading(false); }
  });

  window.addEventListener('pagehide', revokePreview);
  applyLanguage(language);
  loadLibrary();
})();
