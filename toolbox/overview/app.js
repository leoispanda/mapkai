const zh = document.documentElement.lang.startsWith('zh');
const language = zh ? 'zh' : 'en';
try { localStorage.setItem('mapkaiLanguageV2', language); } catch {}
const $ = id => document.getElementById(id);
const pick = value => value?.[language] || value?.en || value?.zh || '';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const words = {
  loading: ['读取中', 'Loading'], failed: ['目录暂时无法读取', 'Directory temporarily unavailable'],
  music: ['音乐', 'Music'], video: ['视频', 'Video'], stories: ['故事', 'Stories'],
  ready: ['已有', 'Available'], missing: ['待补', 'Not yet available'], unknown: ['尚未核实', 'Not yet verified'],
  shared: ['分组共享歌曲', 'Shared group song'], pending: ['已有稿件 · 暂未开放', 'Draft ready · Not open for reading'],
  newer: ['新版', 'Newer version'], older: ['旧版', 'Earlier version'],
  openSubject: ['进入学科', 'Open subject'], readIntro: ['阅读学科导论', 'Read the introduction'],
  watch: ['看总览视频', 'Watch overview'], listen: ['听主题歌', 'Play theme song'],
  openField: ['进入小学科', 'Open field'], watchField: ['观看视频', 'Watch video'],
  read: ['阅读故事', 'Read story'], listenShared: ['听共享歌曲', 'Play shared song'],
  prepared: ['故事稿已备', 'Story drafts ready'], open: ['可阅读', 'Open for reading'],
  draft: ['草稿版本', 'Draft version'], songCollection: ['歌曲', 'Songs'],
  introCollection: ['可读学科导论', 'Readable introductions'], videoCollection: ['学科视频', 'Subject videos'],
  films: ['MV 作品', 'Music video works'], preview: ['含待审预览', 'Includes previews under review'],
  complete: ['完整课程 · 需课程密码', 'Complete course · Course password required'], openCourse: ['打开课程入口 ↗', 'Open the course entrance ↗'],
  noVideos: ['视频目录暂时无法核实，相关数量与绿灯保持“待核实”。稍后重新打开此页可再次读取。', 'The video directory could not be verified. Its counts and lights remain unverified. Reopen this page to try again.'],
  liveVideos: ['视频状态来自当前公开目录；待审预览并不代表完整审核通过。', 'Video availability follows the current public directory. A preview is not a full review approval.'],
  catalogFailure: ['内容目录暂时无法载入，请稍后重新打开。', 'The content directory could not be loaded. Please reopen this page later.'],
};
const t = key => words[key][zh ? 0 : 1];
const localizedPath = path => `${path}${path.includes('?') ? '&' : '?'}lang=${language}`;
const anchor = (path, label, extra = '') => `<a href="${esc(localizedPath(path))}"${extra}>${esc(label)}</a>`;
let catalog;
let videos = null;
let films = null;
let videoFailed = false;
let filmFailed = false;
let songsCurrent = false;
let query = '';
let filter = 'all';
let songsById = new Map();

export function videoIndex(payload) {
  if (!Array.isArray(payload?.items) || payload.items.length > 150) throw new Error('Invalid video directory');
  const output = new Map();
  for (const item of payload.items) {
    if (typeof item.fieldName !== 'string' || !item.fieldName || typeof item.title !== 'string'
      || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug || '') || output.has(item.fieldName)) throw new Error('Invalid video identity');
    output.set(item.fieldName, { slug: item.slug, title: item.title });
  }
  return output;
}
function videoFor(item) { return videos === null ? undefined : videos.get(item.title.en) || null; }
function signal(ready, label, shared = false, small = false) {
  const state = ready === undefined ? 'unknown' : ready ? 'on' : '';
  const description = `${label}: ${ready === undefined ? t('unknown') : ready ? t('ready') : t('missing')}${shared ? ` · ${t('shared')}` : ''}`;
  return `<span class="resource-dot ${state}${small ? ' small' : ''}" role="img" aria-label="${esc(description)}" title="${esc(description)}">${shared && ready && !small ? (zh ? '共' : 'S') : ''}</span>`;
}
function resourceSignals(song, video, stories, shared = false) {
  return `<span class="resource-signals">${signal(Boolean(song), t('music'), shared)}${signal(video === undefined ? undefined : Boolean(video), t('video'))}${signal(stories, t('stories'))}</span>`;
}
function fieldScore(field) {
  const v = videoFor(field);
  return v === undefined ? null : Number(songsById.has(field.songId)) + Number(Boolean(v)) + Number(field.stories.some(s => s.ready));
}
function songAnchor(id, label) { return anchor(`/share/song/${id}`, label); }
function watchAnchor(video, label) { return video ? anchor(`/share/video/${video.slug}`, label) : `<span>${esc(video === undefined ? t('unknown') : t('missing'))}</span>`; }
function matches(...values) { return !query || values.flat(Infinity).filter(Boolean).join(' ').toLocaleLowerCase().includes(query); }
function songMatches(song) { return song && matches(song.title, song.subject, Object.values(song.concept)); }
function fieldMatches(field) {
  return matches(Object.values(field.title), field.stories.flatMap(s => [...Object.values(s.title), ...Object.values(s.concept)])) || Boolean(query && songMatches(songsById.get(field.songId)));
}
function passesFilter(field) {
  if (filter === 'complete') return fieldScore(field) === null || fieldScore(field) === 3;
  if (filter === 'video') return videoFor(field) !== null;
  if (filter === 'music') return songsById.has(field.songId);
  if (filter === 'older') return field.stories.some(story => !story.newer);
  return true;
}
function renderStory(story) {
  const title = pick(story.title);
  const label = story.newer ? t('newer') : t('older');
  return `<li class="overview-story" data-story="${esc(story.id)}"><div class="story-title-row">${signal(story.ready, title, false, true)}${story.public ? anchor(`/concept-fables/${story.id}`, title) : `<span>${esc(title)}</span>`}</div><p class="story-state">${esc(label)} · ${esc(story.public ? t('open') : t('pending'))}</p></li>`;
}
function renderField(field, openKeys) {
  const video = videoFor(field);
  const song = songsById.get(field.songId);
  const autoOpen = Boolean(query && fieldMatches(field));
  return `<details class="overview-field" data-key="field-${field.code}"${openKeys.has(`field-${field.code}`) || autoOpen ? ' open' : ''}><summary><span class="field-name">${esc(pick(field.title))}</span>${resourceSignals(song, video, field.stories.some(s => s.ready), Boolean(song))}</summary><div class="field-detail"><div class="overview-resource-links">${anchor(`/fields/${field.slug}`, t('openField'))}${watchAnchor(video, t('watchField'))}${song ? songAnchor(song.id, t('listenShared')) : ''}</div><ul class="overview-stories">${field.stories.map(renderStory).join('')}</ul></div></details>`;
}
function renderTree() {
  const openKeys = new Set([...$('overview-tree').querySelectorAll('details[open]')].map(el => el.dataset.key));
  let fieldCount = 0;
  const groups = [];
  for (const category of catalog.categories) {
    const song = songsById.get(category.songId);
    const categoryMatch = matches(Object.values(category.title), category.introduction ? Object.values(category.introduction.title) : []) || Boolean(query && songMatches(song));
    const fields = category.fields.filter(f => (categoryMatch || fieldMatches(f)) && passesFilter(f));
    if (!fields.length) continue;
    fieldCount += fields.length;
    const video = videoFor(category);
    const fieldVideos = videos === null ? '—' : category.fields.filter(f => videoFor(f)).length;
    const meta = zh ? `${category.fields.length} 个小学科 · 视频 ${fieldVideos}/${category.fields.length}` : `${category.fields.length} fields · Videos ${fieldVideos}/${category.fields.length}`;
    const intro = category.introduction;
    const links = [anchor(`/categories/${category.code}`, t('openSubject')),
      intro?.public ? anchor(`/lens-stories/${intro.id}`, t('readIntro')) : '', watchAnchor(video, t('watch')),
      song ? songAnchor(song.id, t('listen')) : ''].filter(Boolean).join('');
    groups.push(`<details class="overview-category" data-key="category-${category.code}"${openKeys.has(`category-${category.code}`) || query || filter !== 'all' ? ' open' : ''}><summary><span><span class="category-name">${esc(pick(category.title))}</span><span class="category-meta">${esc(meta)}</span></span>${resourceSignals(song, video, Boolean(intro?.ready))}</summary><div class="category-body"><div class="overview-resource-links">${links}</div><div class="overview-fields">${fields.map(f => renderField(f, openKeys)).join('')}</div></div></details>`);
  }
  $('overview-tree').innerHTML = groups.join('');
  $('overview-empty').hidden = fieldCount > 0;
  $('directory-results').textContent = zh ? `显示 ${groups.length} 个大类 · ${fieldCount} / ${catalog.categories.flatMap(c => c.fields).length} 个小学科` : `${groups.length} subjects · ${fieldCount} / ${catalog.categories.flatMap(c => c.fields).length} fields`;
  const counts = { 1:0, 2:0, 3:0 };
  for (const field of catalog.categories.flatMap(c => c.fields)) { const score = fieldScore(field); if (score !== null) counts[score] = (counts[score] || 0) + 1; }
  $('readiness').textContent = videos === null ? (zh ? '音乐 / 视频 / 故事 · 正在核实视频资源' : 'Music / videos / stories · Verifying videos') : (zh ? `${counts[3]} 个大满贯 · ${counts[2]} 个双绿 · ${counts[1]} 个单绿` : `${counts[3]} with all three · ${counts[2]} with two · ${counts[1]} with one`);
}
function renderCounts() {
  const intros = catalog.categories.filter(c => c.introduction?.public).length;
  const draftCount = catalog.categories.flatMap(c => c.fields).flatMap(f => f.stories).filter(s => s.ready && !s.public).length;
  const workCount = films === null ? '—' : new Set(films.map(f => pick(f.title).replace(/\s*\(Draft \d+\)$/, '').toLowerCase())).size;
  const stats = [
    ['#overview-tree', intros, t('introCollection'), zh ? `另有 ${draftCount} 篇故事稿已备` : `${draftCount} further story drafts ready`],
    ['#overview-tree', videos === null ? '—' : videos.size, t('videoCollection'), videoFailed ? t('unknown') : t('preview')],
    ['#music-library', catalog.songs.length, t('songCollection'), songsCurrent ? (zh ? '按录音计数 · 含不同版本' : 'Recordings, including alternate versions') : (zh ? '目录快照' : 'Directory snapshot')],
    ['#film-library', workCount, t('films'), films === null ? (filmFailed ? t('failed') : t('loading')) : (zh ? `${films.length} 个创作版本` : `${films.length} creative versions`)],
  ];
  $('content-counts').innerHTML = stats.map(([href,n,title,note]) => `<a class="overview-stat" href="${href}"><strong>${esc(n)}</strong><span>${esc(title)}</span><small>${esc(note)}</small></a>`).join('');
  $('coverage').textContent = zh ? `${catalog.categories.length} 个学科大类 · ${catalog.categories.flatMap(c => c.fields).length} 个小学科 · 每科 3 个故事` : `${catalog.categories.length} subjects · ${catalog.categories.flatMap(c => c.fields).length} fields · 3 stories per field`;
}
function renderCourse() {
  const c = catalog.course;
  const href = zh ? '/zh/learning/corporate-finance' : '/learning/corporate-finance';
  $('course').innerHTML = `<div><p>${esc(t('complete'))}</p><h2 id="course-title">${esc(pick(c.title))}</h2><p>${esc(zh ? `${c.lessons.length} 天 · 中英文 · ${c.videoCount} 部视频＋${c.podcastCount} 段播客（含总览）` : `${c.lessons.length} days · Chinese & English · ${c.videoCount} videos + ${c.podcastCount} podcasts, including orientation`)}</p></div><a class="button secondary" href="${href}">${esc(t('openCourse'))}</a><div class="course-days">${c.lessons.map(l => `<a href="${href}/day-${l.day}">Day ${l.day} · ${esc(pick(l.title))}</a>`).join('')}</div>`;
}
function renderSongs() {
  const songs = catalog.songs.filter(song => songMatches(song));
  $('song-count').textContent = zh ? `${songs.length} / ${catalog.songs.length} 首可听` : `${songs.length} / ${catalog.songs.length} available recordings`;
  $('song-list').innerHTML = songs.map(song => `<article class="overview-song">${songAnchor(song.id, `${song.number} ${song.title}`)}<p>${esc(song.subject)} · ${esc(pick(song.concept))}</p><small>${esc(/\(Draft \d+\)/.test(song.title) ? t('draft') : '')}</small></article>`).join('');
}
function renderFilms() {
  if (films === null) { $('film-count').textContent = filmFailed ? t('failed') : t('loading'); return; }
  $('film-count').textContent = zh ? `${films.length} 个创作版本` : `${films.length} creative versions`;
  $('film-list').innerHTML = films.map(film => `<article class="overview-film"><h3>${anchor(`/share/film/${film.id}`, pick(film.title))}</h3><p>${esc(film.version)} · ${esc(zh ? `${film.qualities.length} 种画质` : `${film.qualities.length} qualities`)}</p></article>`).join('');
}
async function json(url) { const response = await fetch(url, { cache:'no-cache', credentials:'same-origin', signal:AbortSignal.timeout(15000) }); if (!response.ok) throw new Error('Directory unavailable'); return response.json(); }
async function initialize() {
  try {
    const url = new URL('./catalog.json', import.meta.url); url.searchParams.set('v', document.querySelector('[data-catalog-revision]').dataset.catalogRevision);
    catalog = await json(url);
    if (catalog.schema !== 'mapkai-content-overview.v1' || !Array.isArray(catalog.categories) || !Array.isArray(catalog.songs)) throw new Error('Invalid directory');
    songsById = new Map(catalog.songs.map(s => [s.id, s]));
    renderCounts(); renderCourse(); renderTree(); renderSongs();
    $('overview-search').addEventListener('input', event => { query = event.target.value.trim().toLocaleLowerCase(); renderTree(); renderSongs(); });
    $('overview-filter').addEventListener('change', event => { filter = event.target.value; renderTree(); });
    $('overview-reset').addEventListener('click', () => { query = ''; filter = 'all'; $('overview-search').value = ''; $('overview-filter').value = 'all'; renderTree(); renderSongs(); $('overview-search').focus(); });
    $('content-counts').addEventListener('click', event => { const href = event.target.closest('a')?.getAttribute('href'); if (href === '#music-library' || href === '#film-library') $(href.slice(1)).open = true; });
    await Promise.allSettled([
      json('/music/song-catalog.json').then(payload => {
        if (!Array.isArray(payload?.songs) || payload.songs.some(s => !/^[a-f0-9-]{36}$/i.test(s.id || '') || typeof s.songName !== 'string' || typeof s.subjectName !== 'string' || typeof s.conceptName !== 'string') || new Set(payload.songs.map(s => s.id)).size !== payload.songs.length) throw new Error('Invalid songs');
        catalog.songs = payload.songs.map(s => ({ id:s.id, number:s.numberLabel, title:s.songName, subject:s.subjectName, language:s.language,
          concept:songsById.get(s.id)?.concept?.en === s.conceptName ? songsById.get(s.id).concept : {en:s.conceptName,zh:s.conceptName} }));
        songsById = new Map(catalog.songs.map(s => [s.id,s])); songsCurrent = true;
      }).catch(() => {}).finally(() => { renderCounts(); renderTree(); renderSongs(); }),
      json('/api/factory/public-videos').then(payload => { videos = videoIndex(payload); $('overview-filter').querySelectorAll('option[disabled]').forEach(option => { option.disabled = false; }); }).catch(() => { videoFailed = true; }).finally(() => { renderTree(); renderCounts(); $('video-status').textContent = t(videoFailed ? 'noVideos' : 'liveVideos'); }),
      json('/api/music/videos').then(payload => {
        if (!Array.isArray(payload?.items) || payload.items.some(f => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(f.id || '') || !f.title || !Array.isArray(f.qualities))) throw new Error('Invalid films');
        films = payload.items;
      }).catch(() => { filmFailed = true; }).finally(() => { renderFilms(); renderCounts(); }),
    ]);
  } catch { $('coverage').textContent = t('catalogFailure'); }
}
initialize();
