(() => {
  'use strict';

  const copy = {
    zh: {
      back: '← 返回 Toolbox', intro: '歌曲小卡片，点击即可播放。', aiNotice: '使用 AI 创作的歌曲，会在卡片上标明 AI 生成，播放前即可看到。', aiGenerated: 'AI 生成', library: '歌曲列表', searchLabel: '搜索歌曲', search: '搜索歌曲…', manage: '管理歌曲',
      like: '点赞', dislike: '不喜欢', likeLabel: '点赞 {title}；累计 {count} 票', dislikeLabel: '不喜欢 {title}；累计 {count} 票', reactionLabel: '{title} 的共享投票', voteScore: '总分 {score}', retryVote: '重试{reaction}', votePending: '正在提交这一票…', voteUnknown: '这票结果未确认，请重试同一操作；不会重复计票。', voteRateLimited: '操作太频繁，这次未计票，请稍后再试。', voteRejected: '这次未计票，请稍后再试。', voteUnavailable: '暂时无法提交，这次未计票。', voteRetryLabel: '重试{reaction}：{title}；累计 {count} 票', preferencesNotice: '每次点击记一票；总分 = 赞 − 不喜欢，按总分排序，跨浏览器共享。', preferencesLoading: '正在载入共享票数。', preferencesUnavailable: '共享票数暂不可用；已显示的票数可能不是最新。', preferencesRecovery: '浏览器暂不支持保存待确认投票；结果未确认时，请留在本页重试。',
      lyrics: '歌词', originalLyrics: '完整原始歌词', originalLyricsLabel: '{title} 的完整原始歌词', lyricsLabel: '{title} 的歌词', lyricsUnavailable: '这首歌没有同步歌词。', songLyrics: '原始歌词（可选）', lyricsPlaceholder: '粘贴这首歌实际使用的歌词，保留段落和换行。', lyricsLimit: '歌词最多 12000 个字符。',
      playlistHeading: '一起听 MapKAI', playlistIntro: '一键播放全部歌曲，按列表顺序连续聆听。', playlistReady: '选一首喜欢的歌，或播放全部', playAll: '播放全部', pauseAll: '暂停', resumeAll: '继续播放', replayAll: '重新播放全部', cancelAll: '取消载入', previousSong: '上一首', nextSong: '下一首', playlistPosition: '第 {position} / {count} 首', seekLabel: '{title} 的播放进度', playlistSeekLabel: '当前歌曲的播放进度', playbackTime: '{current} / {total}', volumeLabel: '音量',
      createSong: '制作歌曲', composerIntro: '先在这里准备创作说明，复制后粘贴到 ElevenLabs。歌曲会在你自己的音乐账号中制作，并使用该账号的点数。', composerPrivacy: '你的主题和歌词只保留在当前页面；由你复制并粘贴到音乐工具。', composerTheme: '想法或主题', composerStyle: '音乐风格', composerDuration: '时长', styleMemphisHipHop: '孟菲斯 Hip-hop', styleRock: '摇滚', styleSymphonic: '交响', styleFolkRap: '民谣说唱', styleAcoustic: '原声', durationOne: '1 分钟', durationTwo: '2 分钟', composerLyrics: '原创歌词（可选）', composerLyricsPlaceholder: '留空即可按主题创作原创歌词。', preparePrompt: '生成创作说明', composerPrompt: '创作说明', copyPrompt: '复制创作说明', copyingPrompt: '正在复制…', openCreator: '打开音乐制作工具 ↗', composerReturn: '先复制说明，再打开音乐工具粘贴并制作。下载完成的歌曲后，回到这里通过“管理歌曲”上传成品。', composerReady: '创作说明已准备好。先复制，再到音乐工具中粘贴。', composerCopied: '已复制创作说明。打开音乐工具并粘贴，即可开始制作。', composerCopyFallback: '请复制已选中的创作说明：按 ⌘C 或 Ctrl+C，也可以长按复制。', composerThemeRequired: '请填写歌曲的想法或主题。', composerThemeLimit: '主题最多 1000 个字符。', composerLyricsLimit: '歌词最多 2400 个字符。', composerStyleRequired: '请选择一种音乐风格。', composerDurationRequired: '请选择 1 分钟或 2 分钟。', composerPromptLimit: '创作说明最多 4100 个字符，请缩短主题或歌词。', composerCount: '{count} / 4100 个字符',
      libraryError: '暂时无法载入歌曲列表，请再试一次。', retry: '重新载入', emptyTitle: '还没有歌曲。', emptyCopy: '歌曲上传后，会在这里展示。', noResults: '没有找到这首歌。', noResultsCopy: '试试其他关键词，或看看完整列表。', clearSearch: '查看全部歌曲', home: '回到 MapKAI ↗',
      studioTitle: '上传歌曲', close: '关闭', checking: '正在打开歌曲工作室…', ownerIntro: '输入 MapKAI 管理密码，开始上传歌曲。', ownerCode: '管理密码', login: '打开工作室', unavailable: '暂时无法上传歌曲，请稍后再试。', uploadIntro: '下载你使用 AI 创作的歌曲，在这里上传，即可加入公开歌曲列表。', chooseFile: '选择歌曲文件', fileFormats: 'MP3 / M4A / WAV · 每首最多 25 MB', preview: '上传前试听', songTitle: '歌名', songLanguage: '歌曲语言', chooseLanguage: '请选择英语、荷兰语或中文。', songDescription: '一句介绍（可选）', titlePlaceholder: '给这首歌一个名字', descriptionPlaceholder: '这首歌的灵感，或你想说的话…', publishNote: '上传的歌曲和 AI 生成标识会公开展示。请确认你有权分享这首作品。', progress: '上传进度', publish: '上传并加入列表',
      loading: '正在载入歌曲…', count: '{count} 首歌曲', filteredCount: '{shown} / {count} 首歌曲', playing: '正在播放：{title}', buffering: '正在缓冲：{title}', playSong: '播放', pauseSong: '暂停', loadingSong: '正在缓冲…', retrySong: '点击重试', audioLabel: '播放 {title}', pauseLabel: '暂停 {title}', cancelLabel: '停止载入 {title}', retryLabel: '重新播放 {title}', controlsLabel: '{title} 的播放控制', audioError: '暂时无法播放这首歌，点击卡片重试。', previewAudio: '试听所选歌曲', authenticating: '正在打开工作室…', wrongCode: '管理密码不正确，请再试一次。', loginFailed: '暂时无法打开工作室，请稍后再试。', chooseFirst: '请先选择一首歌曲。', invalidFile: '请选择 MP3、M4A 或 WAV 格式的歌曲。', fileTooLarge: '这首歌超过 25 MB，请选择更小的文件。', emptyFile: '这个文件是空的，请重新选择。', addTitle: '请给这首歌填写一个名字。', uploading: '正在上传歌曲，请保持页面打开…', publishing: '文件已发送，正在加入歌曲列表…', uploaded: '上传成功，已加入公开歌曲列表。你可以继续上传下一首。', uploadedRefresh: '歌曲已上传。暂时无法刷新歌曲列表，请稍后重新载入。', uploadFailed: '上传未完成，请再试一次。', sessionExpired: '请重新输入管理密码，再上传这首歌。', tooMany: '操作太频繁，请稍后再试。', titleLimit: '歌名最多 120 个字。', descriptionLimit: '介绍最多 500 个字。', storageFull: '暂时无法保存这首歌，请稍后再试。', unknownOutcome: '连接中断，无法确认上传结果。请先重新载入歌曲列表，确认歌曲是否已经出现。',
    },
    en: {
      back: '← Back to Toolbox', intro: 'Tap a song card to listen.', aiNotice: 'Songs created with AI are labelled AI-generated on their cards before playback.', aiGenerated: 'AI-generated', library: 'Song list', searchLabel: 'Search songs', search: 'Search songs…', manage: 'Manage songs',
      like: 'Like', dislike: 'Dislike', likeLabel: 'Like {title}; {count} total votes', dislikeLabel: 'Dislike {title}; {count} total votes', reactionLabel: 'Shared votes for {title}', voteScore: 'Score {score}', retryVote: 'Retry {reaction}', votePending: 'Submitting this vote…', voteUnknown: 'This vote is unconfirmed. Retry the same action without counting it twice.', voteRateLimited: 'Too many requests. This vote was not counted; try again later.', voteRejected: 'This vote was not counted. Please try again later.', voteUnavailable: 'Unable to submit. This vote was not counted.', voteRetryLabel: 'Retry {reaction}: {title}; {count} total votes', preferencesNotice: 'Each click adds one vote. Score = likes − dislikes; ranking is shared across browsers.', preferencesLoading: 'Loading shared vote totals.', preferencesUnavailable: 'Shared totals are unavailable; displayed counts may be out of date.', preferencesRecovery: 'This browser cannot save unconfirmed votes. Stay on this page to retry an unconfirmed result.',
      lyrics: 'Lyrics', originalLyrics: 'Original lyrics', originalLyricsLabel: 'Original lyrics for {title}', lyricsLabel: 'Lyrics for {title}', lyricsUnavailable: 'Synchronized lyrics are unavailable for this song.', songLyrics: 'Original song lyrics (optional)', lyricsPlaceholder: 'Paste the lyrics actually used in this song, keeping verse breaks and line breaks.', lyricsLimit: 'The lyrics can have up to 12000 characters.',
      playlistHeading: 'Listen with MapKAI', playlistIntro: 'Play every song, in order, with one tap.', playlistReady: 'Choose a song, or play them all', playAll: 'Play all', pauseAll: 'Pause', resumeAll: 'Resume', replayAll: 'Replay all', cancelAll: 'Cancel loading', previousSong: 'Previous', nextSong: 'Next', playlistPosition: 'Song {position} of {count}', seekLabel: 'Playback progress for {title}', playlistSeekLabel: 'Current song playback progress', playbackTime: '{current} of {total}', volumeLabel: 'Volume',
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
  const lyricsSync = globalThis.MapKAILyricsSync;
  const musicPreferences = globalThis.MapKAIMusicPreferences;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const cards = new Map();
  const featuredRank = new Map([
    ['c2a4a749-933b-4b4b-95fb-0d2d3f12ac6f', -1],
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
  let playlistMode = false;
  let playlistComplete = false;
  let playlistIds = [];
  let playbackVolume = 1;
  const playlistLyrics = {
    lyricsText: $('playlist-lyrics'), lyricsSpan: $('playlist-lyric-span'),
    lyricsUnavailable: $('playlist-lyrics-unavailable'), currentLyricLine: null, trackId: null,
  };
  const playlistReactions = createReactionControls(() => selectedCard?.track);
  $('playlist-reactions').append(playlistReactions.element);
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
      'memphis-hip-hop': 'Upbeat, bouncy, rhythmic Memphis hip-hop with warm clean bass, crisp snare and claps, lively hi-hats, and a catchy memorable hook. Use clear melodic and spoken vocals, with bright acoustic or light guitar accents. Keep the mood sunny and lively; avoid dark phonk, metal, screaming, and heavily distorted guitars.',
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
    updatePreferencesNotice();
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
      const lyrics = typeof raw.lyrics === 'string' ? raw.lyrics.slice(0, 12000).replace(/\r\n?/g, '\n').trim() : '';
      return { ...raw, title: raw.title.slice(0, 120), description: typeof raw.description === 'string' ? raw.description.slice(0, 500) : '', lyrics, lyricsTiming: lyricsSync?.validateTiming(lyrics, raw.lyricsTiming) || null, url: url.href,
        aiGenerated: raw.aiGenerated === true && raw.generationProvider === 'ElevenLabs', generationProvider: raw.generationProvider === 'ElevenLabs' ? 'ElevenLabs' : null };
    } catch { return null; }
  }

  function stopOtherPlayers(audio) {
    if (playingAudio && playingAudio !== audio) playingAudio.pause();
    for (const card of cards.values()) {
      if (card.audio === audio) selectedCard = card;
      else {
        card.restoreSeconds = null;
        card.playRequest += 1;
        card.pending = false;
        card.waiting = false;
        card.audio.pause();
      }
    }
    if (audio === preview) { selectedCard = null; playlistMode = false; playlistComplete = false; }
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
      card.audio.hidden = true;
      const revealLyrics = selected || active;
      if (revealLyrics && !card.lyricsActive && !card.lyricsDetails.hidden) card.lyricsDetails.open = true;
      card.lyricsActive = revealLyrics;
      card.button.setAttribute('aria-label', t(waiting ? 'cancelLabel' : active ? 'pauseLabel' : !card.error.hidden ? 'retryLabel' : 'audioLabel', { title: card.track.title }));
      card.icon.dataset.state = waiting ? 'loading' : active ? 'pause' : 'play';
      card.action.textContent = t(waiting ? 'loadingSong' : active ? 'pauseSong' : !card.error.hidden ? 'retrySong' : 'playSong');
      syncLyrics(card, { immediate: true });
      updateCardProgress(card);
      if (active || waiting) { activeTrack = card.track; buffering = waiting; }
    }
    $('library-status').hidden = !activeTrack;
    if (activeTrack) $('library-status').textContent = t(buffering ? 'buffering' : 'playing', { title: activeTrack.title });
    updatePlaylist({ immediate: true });
  }

  function playbackError(card) {
    card.pending = false;
    card.waiting = false;
    card.error.textContent = t('audioError');
    card.error.hidden = false;
    updatePlaying();
  }

  async function togglePlayback(card) {
    window.dispatchEvent(new Event('mapkai:music-intent'));
    if (card.pending || (!card.audio.paused && !card.audio.ended && !card.audio.error)) {
      card.playRequest += 1;
      card.pending = false;
      card.waiting = false;
      card.audio.pause();
      updatePlaying();
      return;
    }
    return startPlayback(card);
  }

  async function startPlayback(card, { restart = false } = {}) {
    window.dispatchEvent(new Event('mapkai:music-intent'));
    selectedCard = card;
    stopOtherPlayers(card.audio);
    card.error.hidden = true;
    if (restart) card.restoreSeconds = null;
    if (card.audio.error) card.audio.load();
    if ((restart || card.audio.ended) && card.audio.readyState > 0) card.audio.currentTime = 0;
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

  function updateSeek(seek, elapsed, length, card) {
    const total = card?.audio.duration;
    const available = Number.isFinite(total) && total > 0 && card.audio.readyState > 0 && !card.audio.error;
    const current = available ? Math.max(0, Math.min(total, card.audio.currentTime)) : 0;
    const fraction = available ? current / total : 0;
    seek.disabled = !available;
    seek.value = Math.round(fraction * 1000);
    seek.style.setProperty('--progress', `${fraction * 100}%`);
    elapsed.textContent = duration(current) || '0:00';
    length.textContent = available ? duration(total) : '—:—';
    seek.setAttribute('aria-valuetext', t('playbackTime', { current: elapsed.textContent, total: length.textContent }));
  }

  function updateCardProgress(card) {
    card.seek.setAttribute('aria-label', t('seekLabel', { title: card.track.title }));
    updateSeek(card.seek, card.elapsed, card.length, card);
  }

  function seekPlayback(card, value) {
    const position = Number(value);
    if (!card || !Number.isFinite(position) || !Number.isFinite(card.audio.duration) || card.audio.duration <= 0 || card.audio.error) return;
    window.dispatchEvent(new Event('mapkai:music-intent'));
    card.restoreSeconds = null;
    if (selectedCard !== card) {
      playlistMode = false;
      playlistComplete = false;
      selectedCard = card;
      stopOtherPlayers(card.audio);
    }
    card.audio.currentTime = Math.max(0, Math.min(1000, position)) / 1000 * card.audio.duration;
    syncLyrics(card, { immediate: true });
    updateCardProgress(card);
    updatePlaylist({ immediate: true });
  }

  function currentQueue() {
    return playlistMode ? playlistIds : tracks.map(track => track.id);
  }

  function updatePlaylist({ immediate = false } = {}) {
    const card = selectedCard;
    const queue = currentQueue();
    const index = card ? queue.indexOf(card.track.id) : -1;
    const active = card && !card.audio.paused && !card.audio.ended && !card.audio.error;
    const pending = card && (card.pending || (active && card.waiting));
    $('play-all').disabled = !loaded || !tracks.length;
    const key = playlistMode && card ? (!card.error.hidden ? 'retrySong' : pending ? 'cancelAll' : active ? 'pauseAll' : 'resumeAll') : playlistComplete ? 'replayAll' : 'playAll';
    $('play-all').textContent = t(key);
    $('play-all').setAttribute('aria-label', t(key));
    $('playlist-prev').disabled = index <= 0;
    $('playlist-next').disabled = index < 0 || index >= queue.length - 1;
    const title = card ? card.track.title : t('playlistReady');
    if ($('playlist-title').textContent !== title) $('playlist-title').textContent = title;
    $('playlist-position').textContent = index >= 0 ? t('playlistPosition', { position: index + 1, count: queue.length }) : loaded ? t('count', { count: tracks.length }) : t(libraryFailed ? 'libraryError' : 'loading');
    $('playlist-disclosure').hidden = !card?.track.aiGenerated;
    $('playlist-disclosure').textContent = t('aiGenerated');
    renderReactionControls(playlistReactions, card?.track);
    $('playlist-error').hidden = !card || card.error.hidden;
    $('playlist-error').textContent = t('audioError');
    $('playlist-seek').setAttribute('aria-label', card ? t('seekLabel', { title: card.track.title }) : t('playlistSeekLabel'));
    updateSeek($('playlist-seek'), $('playlist-elapsed'), $('playlist-duration'), card);
    if (card) syncLyricDisplay(card, playlistLyrics, { immediate });
    else {
      playlistLyrics.currentLyricLine = null;
      playlistLyrics.trackId = null;
      playlistLyrics.lyricsSpan.textContent = '';
      playlistLyrics.lyricsSpan.style.transform = 'translateX(0px)';
      playlistLyrics.lyricsText.removeAttribute('data-line');
      playlistLyrics.lyricsText.hidden = false;
      playlistLyrics.lyricsUnavailable.hidden = true;
    }
    window.dispatchEvent(new Event('mapkai:music-update'));
  }

  function playAll() {
    if (!loaded || !tracks.length) return;
    if (playlistMode && selectedCard) { togglePlayback(selectedCard); return; }
    playlistIds = tracks.map(track => track.id);
    playlistMode = true;
    playlistComplete = false;
    $('song-search').value = '';
    updateLibrary();
    startPlayback(cards.get(playlistIds[0]), { restart: true });
  }

  function movePlaylist(direction) {
    const queue = currentQueue();
    const index = selectedCard ? queue.indexOf(selectedCard.track.id) : -1;
    const next = cards.get(queue[index + direction]);
    if (index < 0 || !next) return;
    playlistIds = queue;
    playlistMode = true;
    playlistComplete = false;
    startPlayback(next, { restart: true });
  }

  function finishPlayback(card) {
    card.pending = false;
    card.waiting = false;
    if (playlistMode && selectedCard === card && card.audio.ended) {
      const index = playlistIds.indexOf(card.track.id);
      const next = index >= 0 ? cards.get(playlistIds[index + 1]) : null;
      if (next) { startPlayback(next, { restart: true }); return; }
      playlistMode = false;
      playlistComplete = true;
    }
    updatePlaying();
  }

  function usableLyricsTiming(card) {
    const timing = card.track.lyricsTiming;
    if (!timing || (Number.isFinite(card.audio.duration) && timing[timing.length - 1].end > card.audio.duration)) return null;
    return timing;
  }

  function syncLyrics(card, { immediate = false } = {}) {
    syncLyricDisplay(card, card, { immediate });
  }

  function syncLyricDisplay(card, display, { immediate = false } = {}) {
    const timing = usableLyricsTiming(card);
    display.lyricsText.hidden = !timing;
    display.lyricsUnavailable.hidden = Boolean(timing);
    display.lyricsUnavailable.textContent = t('lyricsUnavailable');
    const line = timing && card === selectedCard && card.audio.readyState > 0 && !card.audio.ended && !card.audio.error
      ? lyricsSync.activeLineAt(timing, card.audio.currentTime) : null;
    const changed = line !== display.currentLyricLine || display.trackId !== card.track.id || display.lyricSource !== card.track.lyrics;
    if (changed) {
      display.currentLyricLine = line;
      display.trackId = card.track.id;
      display.lyricSource = card.track.lyrics;
      display.lyricsSpan.textContent = line === null ? '' : card.lyricLines[line];
      display.lyricsText.scrollLeft = 0;
      display.lyricsText.classList.remove('is-changing');
      if (line === null) display.lyricsText.removeAttribute('data-line');
      else {
        display.lyricsText.dataset.line = line;
        // Restart the small entrance animation when the sung line changes.
        void display.lyricsText.offsetWidth;
        display.lyricsText.classList.add('is-changing');
      }
    }
    display.lyricsText.classList.toggle('is-direct', immediate || changed || card.audio.paused || card.audio.seeking);
    const style = getComputedStyle(display.lyricsText);
    const availableWidth = display.lyricsText.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
    const overflow = Math.max(0, display.lyricsSpan.offsetWidth - availableWidth);
    const cue = line === null ? null : timing.find(entry => entry.line === line);
    const offset = !cue || reducedMotion.matches ? 0 : lyricsSync.lyricOffsetAt(cue, card.audio.currentTime, overflow);
    display.lyricsSpan.style.transform = `translateX(${-offset}px)`;
  }

  function renderLyrics(card) {
    if (card.renderedLyrics !== card.track.lyrics) {
      card.lyricsSpan.textContent = '';
      card.lyricsText.removeAttribute('data-line');
      card.lyricsText.classList.remove('is-changing');
      card.lyricLines = card.track.lyrics.split('\n');
      card.originalLyricsText.textContent = card.track.lyrics;
      card.renderedLyrics = card.track.lyrics;
      card.currentLyricLine = null;
    }
    syncLyrics(card, { immediate: true });
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
    const hadLyrics = !card.lyricsDetails.hidden;
    card.lyricsDetails.hidden = !card.track.lyrics;
    card.lyricsSummary.textContent = t('lyrics');
    const lyricsLabel = t('lyricsLabel', { title: card.track.title });
    card.lyricsSummary.setAttribute('aria-label', lyricsLabel);
    card.lyricsText.setAttribute('aria-label', lyricsLabel);
    card.originalLyricsDetails.hidden = !card.track.lyrics;
    card.originalLyricsSummary.textContent = t('originalLyrics');
    const originalLyricsLabel = t('originalLyricsLabel', { title: card.track.title });
    card.originalLyricsSummary.setAttribute('aria-label', originalLyricsLabel);
    card.originalLyricsText.setAttribute('aria-label', originalLyricsLabel);
    if (!card.track.lyrics) card.originalLyricsDetails.open = false;
    renderLyrics(card);
    renderReactionControls(card.reactions, card.track);
    if (!card.track.lyrics) card.lyricsDetails.open = false;
    else if (!hadLyrics && card === selectedCard) card.lyricsDetails.open = true;
  }

  function createReactionControls(getTrack) {
    const element = document.createElement('div');
    element.className = 'track-reactions';
    element.setAttribute('role', 'group');
    const buttons = {};
    for (const value of ['like', 'dislike']) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'reaction-button';
      button.dataset.reaction = value;
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('viewBox', '0 0 24 24');
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute('focusable', 'false');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M7 10v11H3V10h4Zm3 11h7.4a2 2 0 0 0 1.9-1.4l2.1-7A2 2 0 0 0 19.5 10H14l.7-4.4A2.5 2.5 0 0 0 12.2 3L7 10v11h3Z');
      icon.append(path);
      const label = document.createElement('span');
      const count = document.createElement('span');
      count.className = 'reaction-count';
      count.setAttribute('aria-hidden', 'true');
      button.append(icon, label, count);
      button.addEventListener('click', () => {
        const track = getTrack();
        if (!track || !musicPreferences) return;
        // The server counts one explicit action. Pending and uncertain requests
        // keep their identity; the store never retries a POST automatically.
        musicPreferences.vote(track.id, value);
      });
      buttons[value] = { button, label, count };
      element.append(button);
    }
    const score = document.createElement('span');
    score.className = 'reaction-score';
    const message = document.createElement('p');
    message.className = 'reaction-status';
    message.setAttribute('role', 'status');
    message.setAttribute('aria-live', 'polite');
    element.append(score, message);
    return { element, buttons, score, message };
  }

  function renderReactionControls(controls, track) {
    controls.element.hidden = !track;
    if (!track) return;
    controls.element.setAttribute('aria-label', t('reactionLabel', { title: track.title }));
    const vote = musicPreferences?.get(track.id);
    controls.element.setAttribute('aria-busy', String(Boolean(vote?.pending)));
    for (const [value, entry] of Object.entries(controls.buttons)) {
      const retry = vote?.unknown && vote.reaction === value;
      const label = retry ? t('retryVote', { reaction: t(value) }) : t(value);
      if (entry.label.textContent !== label) entry.label.textContent = label;
      const count = vote?.known ? vote[value === 'like' ? 'likes' : 'dislikes'] : '—';
      entry.count.textContent = count;
      entry.button.disabled = !musicPreferences || vote.pending || Boolean(vote.unknown && vote.reaction !== value);
      entry.button.setAttribute('aria-label', t(retry ? 'voteRetryLabel' : `${value}Label`, { title: track.title, count, reaction: t(value) }));
    }
    controls.score.textContent = t('voteScore', { score: vote?.known ? vote.score : '—' });
    const errorKey = { unknown: 'voteUnknown', rateLimited: 'voteRateLimited', rejected: 'voteRejected', unavailable: 'voteUnavailable' }[vote?.error];
    controls.message.textContent = vote?.pending ? t('votePending') : errorKey ? t(errorKey) : '';
    controls.message.hidden = !controls.message.textContent;
  }

  function updatePreferencesNotice() {
    const state = musicPreferences?.status();
    const messages = [t('preferencesNotice')];
    if (!state || state.unavailable) messages.push(t('preferencesUnavailable'));
    else if (!state.loaded && state.refreshing) messages.push(t('preferencesLoading'));
    if (state && !state.sessionRecovery) messages.push(t('preferencesRecovery'));
    $('preferences-notice').textContent = messages.join(' ');
  }

  function orderExistingCards() {
    const list = $('tracks');
    const focused = document.activeElement;
    const desired = tracks.map(track => cards.get(track.id)?.element).filter(Boolean);
    if (typeof list.moveBefore === 'function') {
      // State-preserving moves keep the existing audio, focus, and lyric details.
      for (const [index, element] of desired.entries()) {
        const current = list.children[index];
        if (current !== element) {
          if (element.parentNode === list && element.isConnected && list.isConnected) list.moveBefore(element, current || null);
          else list.insertBefore(element, current || null);
        }
      }
    } else {
      // Older browsers pause media when its ancestor is detached. Keep the
      // playing, pending, or paused selected card anchored; move only the others.
      const active = [...cards.values()].find(card => card.element.parentNode === list && (!card.audio.paused || card.pending || card.waiting));
      const anchor = active?.element || (selectedCard?.element.parentNode === list ? selectedCard.element : null);
      const anchorIndex = anchor ? desired.indexOf(anchor) : -1;
      if (anchorIndex >= 0) {
        for (let index = 0; index < anchorIndex; index += 1) list.insertBefore(desired[index], anchor);
        for (let index = anchorIndex + 1; index < desired.length; index += 1) list.append(desired[index]);
      } else {
        for (const [index, element] of desired.entries()) {
          const current = list.children[index];
          if (current !== element) list.insertBefore(element, current || null);
        }
      }
    }
    if (focused?.isConnected && document.activeElement !== focused) focused.focus({ preventScroll: true });
  }

  function applyPreferences() {
    tracks.sort(compareTrackOrder);
    orderExistingCards();
    playlistIds = tracks.map(track => track.id);
    for (const card of cards.values()) renderReactionControls(card.reactions, card.track);
    updatePreferencesNotice();
    // Refresh queue position and the dock without changing selection or playback.
    updatePlaylist({ immediate: true });
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
    const audio = document.createElement('audio'); audio.preload = 'none'; audio.src = track.url; audio.hidden = true; audio.volume = playbackVolume;
    audio.id = `song-controls-${++cardSequence}`;
    const progress = document.createElement('div'); progress.className = 'playback-progress'; progress.id = `${audio.id}-progress`;
    button.setAttribute('aria-controls', progress.id);
    const seek = document.createElement('input'); seek.className = 'playback-seek'; seek.type = 'range'; seek.min = 0; seek.max = 1000; seek.step = 1; seek.value = 0; seek.disabled = true;
    const times = document.createElement('div'); times.className = 'playback-times';
    const elapsed = document.createElement('span'); elapsed.textContent = '0:00';
    const length = document.createElement('span'); length.textContent = '—:—';
    times.append(elapsed, length); progress.append(seek, times);
    disclosure.id = `${audio.id}-disclosure`;
    const error = document.createElement('p'); error.className = 'track-error'; error.setAttribute('role', 'status'); error.hidden = true;
    const lyricsDetails = document.createElement('details'); lyricsDetails.className = 'track-lyrics'; lyricsDetails.hidden = true;
    const lyricsSummary = document.createElement('summary');
    const lyricsText = document.createElement('p'); lyricsText.className = 'lyrics-text'; lyricsText.tabIndex = 0; lyricsText.setAttribute('role', 'region');
    const lyricsSpan = document.createElement('span'); lyricsSpan.className = 'lyrics-current'; lyricsText.append(lyricsSpan);
    const lyricsUnavailable = document.createElement('p'); lyricsUnavailable.className = 'lyrics-unavailable'; lyricsUnavailable.hidden = true;
    lyricsDetails.append(lyricsSummary, lyricsText, lyricsUnavailable);
    const originalLyricsDetails = document.createElement('details'); originalLyricsDetails.className = 'track-original-lyrics'; originalLyricsDetails.hidden = true;
    const originalLyricsSummary = document.createElement('summary');
    const originalLyricsText = document.createElement('pre'); originalLyricsText.className = 'original-lyrics-text'; originalLyricsText.tabIndex = 0; originalLyricsText.setAttribute('role', 'region');
    originalLyricsDetails.append(originalLyricsSummary, originalLyricsText);
    const reactions = createReactionControls(() => card.track);
    element.append(button, reactions.element, progress, audio, error, lyricsDetails, originalLyricsDetails);
    const card = { element, button, reactions, icon, action, audio, seek, elapsed, length, error, title, disclosure, description, meta, lyricsDetails, lyricsSummary, lyricsText, lyricsSpan, lyricsUnavailable, originalLyricsDetails, originalLyricsSummary, originalLyricsText, lyricLines: [], renderedLyrics: null, currentLyricLine: null, track, pending: false, waiting: false, playRequest: 0, lyricsActive: false };
    button.addEventListener('click', () => { if (selectedCard !== card) { playlistMode = false; playlistComplete = false; } togglePlayback(card); });
    seek.addEventListener('input', () => seekPlayback(card, seek.value));
    audio.addEventListener('play', () => { if (audio.paused) return; error.hidden = true; card.waiting = true; stopOtherPlayers(audio); });
    audio.addEventListener('playing', () => { if (audio.paused) return; card.pending = false; card.waiting = false; error.hidden = true; updatePlaying(); });
    audio.addEventListener('waiting', () => { if (audio.paused) return; card.waiting = true; updatePlaying(); });
    audio.addEventListener('pause', () => { if (!audio.paused) return; card.pending = false; card.waiting = false; updatePlaying(); });
    audio.addEventListener('ended', () => finishPlayback(card));
    audio.addEventListener('loadedmetadata', () => {
      if (Number.isFinite(card.restoreSeconds) && selectedCard === card && Number.isFinite(audio.duration) && audio.duration > 0) {
        const seconds = card.restoreSeconds; card.restoreSeconds = null;
        audio.currentTime = Math.min(seconds, audio.duration);
      }
      trackMetadata(card); updatePlaying();
    });
    audio.addEventListener('timeupdate', () => { syncLyrics(card); updateCardProgress(card); if (card === selectedCard) updatePlaylist(); });
    const syncSeek = () => { syncLyrics(card, { immediate: true }); updateCardProgress(card); if (card === selectedCard) updatePlaylist({ immediate: true }); };
    audio.addEventListener('seeking', syncSeek);
    audio.addEventListener('seeked', syncSeek);
    audio.addEventListener('durationchange', () => { updateCardProgress(card); if (card === selectedCard) updatePlaylist({ immediate: true }); });
    audio.addEventListener('error', () => playbackError(card));
    lyricsDetails.addEventListener('toggle', () => { if (lyricsDetails.open) syncLyrics(card, { immediate: true }); });
    trackMetadata(card);
    updateCardProgress(card);
    return card;
  }

  function songNumber(track) {
    const match = /^([0-9]{3,}) /.exec(track.title);
    const number = match ? Number(match[1]) : 0;
    return Number.isSafeInteger(number) && number > 0 ? number : Number.POSITIVE_INFINITY;
  }

  function compareTrackOrder(first, second) {
    if (musicPreferences) return musicPreferences.compare(first, second);
    const firstNumber = songNumber(first);
    const secondNumber = songNumber(second);
    if (firstNumber !== secondNumber) return firstNumber - secondNumber;
    return (featuredRank.get(first.id) ?? 3) - (featuredRank.get(second.id) ?? 3)
      || (Date.parse(second.createdAt) || 0) - (Date.parse(first.createdAt) || 0);
  }

  function syncCards() {
    tracks.sort(compareTrackOrder);
    const ids = new Set(tracks.map(track => track.id));
    for (const [id, card] of cards) {
      if (!ids.has(id)) { card.playRequest += 1; if (selectedCard === card) { selectedCard = null; playlistMode = false; playlistComplete = false; } card.audio.pause(); card.audio.removeAttribute('src'); card.element.remove(); cards.delete(id); }
    }
    playlistIds = playlistIds.filter(id => ids.has(id));
    for (const track of tracks) {
      let card = cards.get(track.id);
      if (!card) { card = createCard(track); cards.set(track.id, card); }
      else {
        card.track = track;
        card.title.textContent = track.title;
        card.description.textContent = track.description;
        card.description.hidden = !track.description;
        if (card.audio.src !== track.url) { card.restoreSeconds = null; card.playRequest += 1; card.pending = false; card.waiting = false; card.audio.pause(); card.audio.src = track.url; card.error.hidden = true; }
        trackMetadata(card);
      }
      if (!card.element.parentNode) $('tracks').append(card.element);
    }
    orderExistingCards();
    if (playlistMode) playlistIds = tracks.map(track => track.id);
    updateLibrary();
  }

  function updateLibrary() {
    const query = $('song-search').value.trim().toLocaleLowerCase();
    let shown = 0;
    for (const card of cards.values()) {
      const matches = `${card.track.title} ${card.track.description}`.toLocaleLowerCase().includes(query);
      card.element.hidden = !matches;
      if (!matches && !playlistMode && (card.pending || !card.audio.paused)) { card.playRequest += 1; card.pending = false; card.waiting = false; card.audio.pause(); }
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
      updatePlaylist({ immediate: true });
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
  const resizeLyrics = () => { for (const card of cards.values()) syncLyrics(card, { immediate: true }); updatePlaylist({ immediate: true }); };
  window.addEventListener('resize', resizeLyrics);
  reducedMotion.addEventListener('change', resizeLyrics);
  $('play-all').addEventListener('click', playAll);
  $('playlist-prev').addEventListener('click', () => movePlaylist(-1));
  $('playlist-next').addEventListener('click', () => movePlaylist(1));
  $('playlist-seek').addEventListener('input', () => seekPlayback(selectedCard, $('playlist-seek').value));
  $('playlist-volume').addEventListener('input', () => {
    playbackVolume = Number($('playlist-volume').value) / 100;
    for (const card of cards.values()) card.audio.volume = playbackVolume;
    preview.volume = playbackVolume;
    updatePlaylist({ immediate: true });
  });
  $('create-music').addEventListener('click', () => { composer.showModal(); $('composer-song-title').focus(); });
  $('close-composer').addEventListener('click', () => composer.close());
  $('composer-form').addEventListener('submit', event => { event.preventDefault(); prepareComposerPrompt(); });
  $('composer-form').addEventListener('input', invalidateComposerPrompt);
  $('composer-form').addEventListener('change', invalidateComposerPrompt);
  $('copy-prompt').addEventListener('click', copyComposerPrompt);
  $('song-search').addEventListener('input', updateLibrary);
  $('clear-search').addEventListener('click', () => { $('song-search').value = ''; updateLibrary(); $('song-search').focus(); });
  $('retry-library').addEventListener('click', loadLibrary);
  $('manage-music').addEventListener('click', () => {
    if (!$('song-lyrics').value.trim() && $('composer-lyrics').value.trim()) $('song-lyrics').value = $('composer-lyrics').value.trim();
    studio.showModal(); checkOwner();
  });
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
    const lyrics = $('song-lyrics').value.trim();
    const songLanguage = $('song-language').value;
    const invalid = validateFile(file) || (!['en', 'nl', 'zh'].includes(songLanguage) ? 'chooseLanguage' : !title ? 'addTitle' : title.length > 120 ? 'titleLimit' : description.length > 500 ? 'descriptionLimit' : lyrics.length > 12000 ? 'lyricsLimit' : null);
    if (invalid) { setUploadStatus(invalid, 'error'); return; }
    preview.pause();
    uploadPercent = 0; uploadSent = false;
    $('progress-bar').value = 0;
    setUploadStatus('uploading');
    setUploading(true);
    const data = new FormData();
    data.append('file', file); data.append('title', title); data.append('description', description); data.append('language', songLanguage); data.append('lyrics', lyrics);
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
  // The site-wide dock controls this page's existing audio and queue.
  // It never creates a second playing audio on the Music page.
  window.MapKAIMusicPage = Object.freeze({
    snapshot: () => ({ tracks, track: selectedCard?.track || null, audio: selectedCard?.audio || null,
      loaded, libraryFailed, pending: Boolean(selectedCard?.pending || selectedCard?.waiting),
      failed: Boolean(selectedCard && !selectedCard.error.hidden), complete: playlistComplete, volume: playbackVolume,
      pendingPosition: Number.isFinite(selectedCard?.restoreSeconds) ? selectedCard.restoreSeconds : null }),
    load: loadLibrary,
    toggle: () => selectedCard && !playlistComplete ? togglePlayback(selectedCard) : playAll(),
    pause: () => {
      for (const card of cards.values()) { card.playRequest += 1; card.pending = false; card.waiting = false; card.audio.pause(); }
      updatePlaying();
    },
    move: movePlaylist,
    play: id => {
      const card = cards.get(id); if (!card) return;
      playlistIds = tracks.map(track => track.id); playlistMode = true; playlistComplete = false;
      startPlayback(card, { restart: true });
    },
    seek: value => seekPlayback(selectedCard, value),
    volume: value => {
      if (!Number.isFinite(value)) return;
      playbackVolume = Math.max(0, Math.min(1, value));
      $('playlist-volume').value = Math.round(playbackVolume * 100);
      for (const card of cards.values()) card.audio.volume = playbackVolume;
      preview.volume = playbackVolume; updatePlaylist({ immediate: true });
    },
    restore: (id, seconds) => {
      const card = cards.get(id); if (!card || !Number.isFinite(seconds) || seconds < 0) return;
      playlistIds = tracks.map(track => track.id); playlistMode = true; playlistComplete = false;
      selectedCard = card; stopOtherPlayers(card.audio);
      card.restoreSeconds = seconds;
      if (card.audio.readyState > 0 && Number.isFinite(card.audio.duration) && card.audio.duration > 0) {
        card.restoreSeconds = null; card.audio.currentTime = Math.min(seconds, card.audio.duration);
      } else card.audio.load();
      updatePlaying();
    },
  });
  musicPreferences?.subscribe(applyPreferences);
  window.dispatchEvent(new Event('mapkai:music-ready'));
  applyLanguage(language);
  loadLibrary();
  musicPreferences?.refresh();
})();
