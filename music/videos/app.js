(() => {
  'use strict';
  const copy = {
    zh: {
      back:'← 返回 Music', collection:'音乐影像 / MAPKAI MUSIC', heading:'音乐影像', intro:'把歌里的故事与想法，连成一部短片。',
      browseEarlier:'看看早期版本 ↓', artNote:'AI 绘画与音乐 · 艺术演绎', fromCollection:'来自作品集', earlierHeading:'早期版本', earlierIntro:'从最初的构想到绘画长卷，保留每一次不同的表达。',
      loading:'正在载入音乐影像…', loadError:'暂时无法载入音乐影像，请再试一次。', retry:'重新载入', empty:'新的音乐影像即将在这里展示。', arts:'艺术与人文 ↗', backToSongs:'继续听歌 ↗',
      latest:'最新作品', featured:'精选作品', earlier:'早期版本', english:'英文演唱', play:'播放', replay:'重新播放', quality:'播放画质', playbackError:'暂时无法播放这个视频，请点击播放重试。',
      disclosure:'AI 创作 · 画面与人物为艺术演绎', count:'{count} 部音乐影像', pageTitle:'音乐影像 · MapKAI Music', pageDescription:'MapKAI 音乐影像。在线观看 Under the Blue、Leave a Little Room 与 Your Turn 绘画 MV。',
    },
    en: {
      back:'← Back to Music', collection:'MUSIC VIDEOS / MAPKAI MUSIC', heading:'Music videos', intro:'Stories and ideas, brought to life in music videos.',
      browseEarlier:'Explore earlier versions ↓', artNote:'AI-created art and music · Artistic interpretations', fromCollection:'FROM THE COLLECTION', earlierHeading:'Earlier versions', earlierIntro:'From the first idea to a painted journey, each version keeps its own expression.',
      loading:'Loading music videos…', loadError:'The films could not be loaded. Please try again.', retry:'Try again', empty:'New music videos will appear here.', arts:'Arts & humanities ↗', backToSongs:'Keep listening ↗',
      latest:'Latest film', featured:'Featured film', earlier:'Earlier version', english:'English vocals', play:'Play', replay:'Play again', quality:'Playback quality', playbackError:'This video cannot be played right now. Press play to try again.',
      disclosure:'AI-created · Imagined scenes and portraits', count:'{count} music videos', pageTitle:'Music videos · MapKAI Music', pageDescription:'MapKAI music videos. Watch Under the Blue, Leave a Little Room and Your Turn online.',
    },
  };
  const order = ['under-the-blue', 'leave-a-little-room', 'your-turn-asml', 'your-turn-artworks', 'your-turn-original'];
  const cards = new Map();
  const $ = id => document.getElementById(id);
  const label = (value, fallback = '') => value?.[language] || value?.en || value?.zh || fallback;
  let language = 'zh';
  let loading = false;
  let loadState = 'loading';
  let visibleCount = 0;
  try {
    const requested = new URLSearchParams(location.search).get('lang');
    const saved = localStorage.getItem('mapkaiMusicLanguage') || localStorage.getItem('mapkaiLanguageV2');
    language = ['en','zh'].includes(requested) ? requested : ['en','zh'].includes(saved) ? saved : 'zh';
  } catch {}
  const t = key => copy[language][key] || key;
  const bilingual = value => value && typeof value === 'object' && ['zh','en'].every(key => typeof value[key] === 'string' && value[key].trim().length > 0 && value[key].length <= 1200);
  const duration = seconds => { const total = Math.round(seconds); return `${Math.floor(total / 60)}:${String(total % 60).padStart(2,'0')}`; };

  function mediaUrl(value, id, quality) {
    try {
      const url = new URL(value, location.href);
      if (url.origin !== location.origin || url.pathname !== '/api/music/video'
        || url.searchParams.getAll('id').length !== 1 || url.searchParams.get('id') !== id
        || url.searchParams.getAll('quality').length !== 1 || url.searchParams.get('quality') !== quality
        || url.searchParams.has('download')) return null;
      return url.pathname + url.search;
    } catch { return null; }
  }

  function safeItem(raw) {
    if (!raw || typeof raw.featured !== 'boolean' || !order.includes(raw.id) || !bilingual(raw.title) || !bilingual(raw.description)
      || !Number.isFinite(raw.durationSeconds) || raw.durationSeconds <= 0 || raw.durationSeconds > 7200
      || raw.poster !== `/music/videos/posters/${raw.id}.jpg` || !Array.isArray(raw.qualities)) return null;
    const qualities = raw.qualities.filter(quality => quality && ['phone','hd'].includes(quality.id) && bilingual(quality.label)
      && Number.isSafeInteger(quality.bytes) && quality.bytes > 0
      && Number.isSafeInteger(quality.width) && quality.width > 0
      && Number.isSafeInteger(quality.height) && quality.height > 0)
      .map(quality => ({...quality, url:mediaUrl(quality.url,raw.id,quality.id)}))
      .filter(quality => quality.url);
    if (!qualities.length || new Set(qualities.map(quality => quality.id)).size !== qualities.length) return null;
    qualities.sort((a,b) => Number(a.id !== 'hd') - Number(b.id !== 'hd'));
    return {...raw, qualities, version:typeof raw.version === 'string' ? raw.version.slice(0,48) : ''};
  }

  function textNode(tag, className) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function playIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('aria-hidden','true');
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d','M7 4v16l14-8L7 4Z');
    svg.append(path); return svg;
  }

  function updateCard(card) {
    const {item} = card;
    const title = label(item.title);
    card.title.textContent = title;
    card.description.textContent = label(item.description); card.description.hidden = !['under-the-blue','leave-a-little-room'].includes(item.id);
    card.badge.textContent = t(item.id === order[0] ? 'latest' : item.featured ? 'featured' : 'earlier');
    card.meta.textContent = [duration(item.durationSeconds), t('english')].join(' · ');
    card.video.setAttribute('aria-label',title);
    card.play.setAttribute('aria-label',`${t(card.video.ended ? 'replay' : 'play')} · ${title}`);
    card.qualityLabel.textContent = t('quality');
    card.select.setAttribute('aria-label',`${t('quality')} · ${title}`);
    for (const [index, quality] of item.qualities.entries()) {
      card.select.options[index].textContent = label(quality.label);
    }
    card.disclosure.textContent = t('disclosure');
    if (!card.error.hidden) card.error.textContent = t('playbackError');
  }

  function createCard(item) {
    const element = textNode('article','film-card'); element.id = item.id;
    const player = textNode('div','film-player');
    const video = document.createElement('video');
    video.controls = true; video.playsInline = true; video.preload = 'none'; video.poster = item.poster; video.src = item.qualities[0].url;
    video.setAttribute('playsinline',''); video.setAttribute('preload','none');
    video.setAttribute('controlslist','nodownload');
    video.addEventListener('contextmenu',event => event.preventDefault());
    const play = textNode('button','film-start'); play.type = 'button'; play.append(playIcon());
    player.append(video,play);
    const body = textNode('div','film-copy');
    const topline = textNode('div','film-topline');
    const badge = textNode('span','film-badge'); const aiBadge = textNode('span','film-ai-badge'); aiBadge.textContent = 'AI generated'; aiBadge.lang = 'en'; const meta = textNode('span','film-meta'); topline.append(badge,aiBadge,meta);
    const title = textNode(item.featured ? 'h2' : 'h3'); title.id = `${item.id}-title`;
    element.setAttribute('aria-labelledby',title.id);
    const description = textNode('p','film-description');
    const actions = textNode('div','film-actions');
    const qualityControl = textNode('label','quality-control');
    const qualityLabel = textNode('span'); const select = document.createElement('select');
    for (const quality of item.qualities) { const option = document.createElement('option'); option.value = quality.id; select.append(option); }
    qualityControl.append(qualityLabel,select); qualityControl.hidden = item.qualities.length < 2;
    actions.append(qualityControl); actions.hidden = item.qualities.length < 2;
    const disclosure = textNode('p','film-disclosure');
    const error = textNode('p','film-error'); error.hidden = true; error.setAttribute('role','status');
    body.append(topline,title,description,actions,disclosure,error); element.append(player,body);
    const card = {element,item,video,play,title,description,badge,meta,qualityLabel,select,disclosure,error,pendingSeek:null};
    play.addEventListener('click',() => {
      error.hidden = true;
      if (video.error) video.load();
      video.play().catch(() => { error.textContent = t('playbackError'); error.hidden = false; play.hidden = false; });
    });
    select.addEventListener('change',() => {
      const quality = item.qualities.find(candidate => candidate.id === select.value);
      if (!quality) return;
      card.pendingSeek = Number.isFinite(video.currentTime) ? video.currentTime : 0;
      video.pause(); video.src = quality.url; video.load(); play.hidden = false; error.hidden = true;
    });
    video.addEventListener('loadedmetadata',() => {
      if (card.pendingSeek !== null) {
        const seconds = card.pendingSeek; card.pendingSeek = null;
        if (seconds > 0 && Number.isFinite(video.duration)) video.currentTime = Math.min(seconds,Math.max(0,video.duration - 0.1));
      }
    });
    video.addEventListener('play',() => {
      for (const other of cards.values()) if (other.video !== video) other.video.pause();
      play.hidden = true; error.hidden = true;
    });
    video.addEventListener('ended',() => { play.hidden = false; updateCard(card); });
    video.addEventListener('error',() => { error.textContent = t('playbackError'); error.hidden = false; play.hidden = false; });
    updateCard(card); return card;
  }

  function applyLanguage(next) {
    if (!['zh','en'].includes(next)) return;
    language = next; document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
    document.title = t('pageTitle'); document.querySelector('meta[name="description"]').content = t('pageDescription');
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll('[data-language]').forEach(button => { button.setAttribute('aria-pressed',String(button.dataset.language === next)); });
    document.querySelector('.brand').setAttribute('aria-label',next === 'zh' ? 'MapKAI 首页' : 'MapKAI home');
    $('featured-films').setAttribute('aria-label',next === 'zh' ? '精选音乐影像' : 'Featured music videos');
    $('arts-link').href = `/categories/02?lang=${next}`;
    if (loadState === 'loaded') $('gallery-status').textContent = t('count').replace('{count}',String(visibleCount));
    else if (loadState === 'empty') $('gallery-status').textContent = t('empty');
    for (const card of cards.values()) updateCard(card);
    try { localStorage.setItem('mapkaiMusicLanguage',next); } catch {}
  }

  function revealHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (![...order,'earlier-versions'].includes(id)) return;
    const target = document.getElementById(id);
    if (target && !target.hidden) requestAnimationFrame(() => target.scrollIntoView({block:'start'}));
  }

  async function loadGallery() {
    if (loading) return;
    loading = true; loadState = 'loading'; $('retry-gallery').disabled = true;
    $('gallery-error').hidden = true; $('gallery-status').hidden = false; $('gallery-status').textContent = t('loading');
    try {
      const response = await fetch('/api/music/videos',{headers:{Accept:'application/json'},cache:'no-store',signal:AbortSignal.timeout(12000)});
      if (!response.ok) throw new Error('Collection unavailable');
      const data = await response.json();
      if (!Array.isArray(data?.items) || data.items.length > 24) throw new Error('Invalid collection');
      const items = data.items.map(safeItem).filter(Boolean).sort((a,b) => order.indexOf(a.id) - order.indexOf(b.id));
      if (new Set(items.map(item => item.id)).size !== items.length) throw new Error('Duplicate film');
      visibleCount = items.length; loadState = items.length ? 'loaded' : 'empty';
      for (const item of items) {
        const card = createCard(item); cards.set(item.id,card);
        (item.featured ? $('featured-films') : $('earlier-films')).append(card.element);
      }
      $('featured-films').hidden = !items.some(item => item.featured);
      $('earlier-versions').hidden = !items.some(item => !item.featured);
      applyLanguage(language); revealHash();
    } catch {
      loadState = 'error'; $('gallery-status').hidden = true; $('gallery-error').hidden = false;
    } finally { loading = false; $('retry-gallery').disabled = false; }
  }

  document.querySelectorAll('[data-language]').forEach(button => { button.addEventListener('click',() => applyLanguage(button.dataset.language)); });
  $('retry-gallery').addEventListener('click',loadGallery);
  window.addEventListener('hashchange',revealHash);
  window.addEventListener('storage',event => { if (event.key === 'mapkaiMusicLanguage' && ['en','zh'].includes(event.newValue)) applyLanguage(event.newValue); });
  window.addEventListener('pagehide',() => { for (const card of cards.values()) card.video.pause(); });
  applyLanguage(language); loadGallery();
})();
