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
let mindMap;
let focusedCategory = null;
let focusedField = null;
let expandedAll = false;
let selected = 'root';
const expandedFields = new Set();

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
function graphSignal(ready, label, shared = false) {
  return {ready, shared, label:`${label}: ${ready === undefined ? t('unknown') : ready ? t('ready') : t('missing')}${shared ? ` · ${t('shared')}` : ''}`};
}
function graphSignals(item, stories, shared = false) {
  const song = songsById.get(item.songId), video = videoFor(item);
  return [graphSignal(Boolean(song),t('music'),shared&&Boolean(song)),graphSignal(video===undefined?undefined:Boolean(video),t('video')),graphSignal(stories,t('stories'))];
}
function resetMap() {
  query=''; filter='all'; focusedCategory=null; focusedField=null; expandedAll=false; selected='root'; expandedFields.clear();
  $('overview-search').value=''; $('overview-filter').value='all'; renderTree(true); renderSongs();
}
function activateNode(node) {
  if(node.kind==='root'){resetMap();return;}
  selected=node.id;
  if(node.kind==='category'){
    if(focusedCategory===node.item.code&&!focusedField){resetMap();return;}
    focusedCategory=node.item.code; focusedField=null; expandedAll=false; expandedFields.clear();
  }else if(node.kind==='field'){
    focusedCategory=node.category.code; expandedAll=false;
    if(expandedFields.has(node.id)){expandedFields.delete(node.id);focusedField=null;}
    else{expandedFields.clear();expandedFields.add(node.id);focusedField=node.item.code;}
  }
  renderTree(node.kind!=='story');
}
function renderSelection(node) {
  if(!node||node.kind==='root'){
    $('map-selection').innerHTML=`<p class="selection-instruction">${esc(zh?'学科 → 小学科 → 三个故事。点击分支查看资源，点击 MapKAI 回到全景。':'Subject → Field → Three stories. Select a branch for its resources; select MapKAI to return to the overview.')}</p>`;return;
  }
  const item=node.item;
  let links=[],note='';
  if(node.kind==='category'){
    links=[anchor(`/categories/${item.code}`,t('openSubject')),item.introduction?.public?anchor(`/lens-stories/${item.introduction.id}`,t('readIntro')):'',watchAnchor(videoFor(item),t('watch')),songsById.has(item.songId)?songAnchor(item.songId,t('listen')):''];
    note=item.introduction?`${t(item.introduction.public?'open':'pending')} · ${pick(item.introduction.title)}`:'';
  }else if(node.kind==='field'){
    links=[anchor(`/fields/${item.slug}`,t('openField')),watchAnchor(videoFor(item),t('watchField')),songsById.has(item.songId)?songAnchor(item.songId,t('listenShared')):''];
    note=zh?'三个小灯对应三个故事。点击故事查看版本；点击学科返回其他分支。':'Each small light represents a story. Select it for its version; select the subject to return to its other fields.';
  }else{
    links=item.public?[anchor(`/concept-fables/${item.id}`,t('read'))]:[];
    note=`${pick(item.concept)} · ${t(item.newer?'newer':'older')} · ${t(item.public?'open':'pending')}`;
  }
  $('map-selection').innerHTML=`<div class="selection-heading"><span>${esc(zh?'当前分支':'Selected branch')}</span><h3>${esc(node.label)}</h3></div><div class="selection-content"><div class="overview-resource-links">${links.filter(Boolean).join('')}</div><p>${esc(note)}</p></div>`;
}
function renderTree(refit = false) {
  const root={id:'root',kind:'root',label:'MapKAI',subtitle:zh?'11 大类 · 80 小学科':'11 subjects · 80 fields',note:zh?'240 个故事':'240 stories',description:zh?'MapKAI，返回全部学科':'MapKAI, return to all subjects'};
  const categories=[], allNodes=[root]; let fieldCount=0;
  for(const category of catalog.categories){
    if(focusedCategory&&category.code!==focusedCategory)continue;
    const song=songsById.get(category.songId);
    const categoryMatch=matches(Object.values(category.title),category.introduction?Object.values(category.introduction.title):[])||Boolean(query&&songMatches(song));
    const fields=category.fields.filter(f=>(categoryMatch||fieldMatches(f))&&passesFilter(f));
    if(!fields.length)continue;
    const shownFields=focusedField?fields.filter(f=>f.code===focusedField):fields;
    fieldCount+=shownFields.length;
    const showFields=Boolean(focusedCategory||expandedAll||query||filter!=='all');
    const complete=category.fields.filter(f=>fieldScore(f)===3).length;
    const subtitle=zh?`${fields.length} 小学科${videos===null?'':` · ${complete} 三绿`}`:`${fields.length} fields${videos===null?'':` · ${complete} complete`}`;
    const node={id:`category-${category.code}`,kind:'category',item:category,label:pick(category.title),subtitle,expandable:true,expanded:showFields,signals:graphSignals(category,Boolean(category.introduction?.ready))};
    node.description=`${node.label}. ${subtitle}. ${node.signals.map(s=>s.label).join('. ')}`;
    allNodes.push(node);
    if(showFields)node.children=shownFields.map(field=>{
      const newer=field.stories.filter(s=>s.newer).length;
      const note=zh?`${newer} 新版 · ${field.stories.length-newer} 旧版`:`${newer} newer · ${field.stories.length-newer} earlier`;
      const id=`field-${field.code}`;
      const expand=expandedFields.has(id)||Boolean(query&&field.stories.some(s=>matches(Object.values(s.title),Object.values(s.concept))));
      const f={id,kind:'field',item:field,category,label:pick(field.title),subtitle:fieldScore(field)===null?t('unknown'):zh?(fieldScore(field)===3?'大满贯':`${fieldScore(field)} 个绿灯`):(fieldScore(field)===3?'All three ready':`${fieldScore(field)} resources`),note,expandable:true,expanded:expand,signals:graphSignals(field,field.stories.some(s=>s.ready),true),storySignals:field.stories.map(s=>graphSignal(s.ready,pick(s.title)))};
      f.description=`${f.label}. ${f.subtitle}. ${note}. ${f.signals.map(s=>s.label).join('. ')}`;
      allNodes.push(f);
      if(expand)f.children=field.stories.map(story=>{
        const child={id:`story-${story.id}`,kind:'story',item:story,label:pick(story.title),subtitle:`${t(story.newer?'newer':'older')} · ${t(story.public?'open':'prepared')}`,signals:[graphSignal(story.ready,pick(story.title))]};
        child.description=`${child.label}. ${child.subtitle}. ${t(story.public?'open':'pending')}`;
        allNodes.push(child);return child;
      });
      return f;
    });
    categories.push(node);
  }
  if(!allNodes.some(n=>n.id===selected))selected='root';
  mindMap.render({root,categories,selected,focused:Boolean(focusedCategory)},refit);
  renderSelection(allNodes.find(n=>n.id===selected));
  $('overview-empty').hidden=fieldCount>0;
  $('directory-title').textContent=focusedCategory?pick(catalog.categories.find(c=>c.code===focusedCategory).title):(zh?'学科全景':'All subjects');
  $('directory-results').textContent=zh?`${categories.length} 大类 · ${fieldCount} / 80 小学科`:`${categories.length} subjects · ${fieldCount} / 80 fields`;
  $('map-expand').textContent=zh?(expandedAll?'收起小学科':'展开小学科'):(expandedAll?'Collapse fields':'Expand fields');
  $('map-expand').setAttribute('aria-pressed',String(expandedAll));
  const counts={1:0,2:0,3:0};
  for(const field of catalog.categories.flatMap(c=>c.fields)){const score=fieldScore(field);if(score!==null)counts[score]=(counts[score]||0)+1;}
  $('readiness').textContent=videos===null?(zh?'正在核实视频资源':'Verifying video resources'):(zh?`${counts[3]} 大满贯 · ${counts[2]} 双绿 · ${counts[1]} 单绿`:`${counts[3]} complete · ${counts[2]} with two · ${counts[1]} with one`);
}
function renderCounts() {
  const intros = catalog.categories.filter(c => c.introduction?.public).length;
  const draftCount = catalog.categories.flatMap(c => c.fields).flatMap(f => f.stories).filter(s => s.ready && !s.public).length;
  const workCount = films === null ? '—' : new Set(films.map(f => pick(f.title).replace(/\s*\(Draft \d+\)$/, '').toLowerCase())).size;
  const stats = [
    ['#content-map', intros, t('introCollection'), zh ? `另有 ${draftCount} 篇故事稿已备` : `${draftCount} further story drafts ready`],
    ['#content-map', videos === null ? '—' : videos.size, t('videoCollection'), videoFailed ? t('unknown') : t('preview')],
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
    const graphUrl=new URL('./graph.js',import.meta.url); graphUrl.search=new URL(import.meta.url).search;
    const {createMindMap}=await import(graphUrl.href);
    mindMap=createMindMap({svg:$('content-map'),frame:$('map-frame'),language,onActivate:activateNode});
    renderCounts(); renderCourse(); renderTree(true); renderSongs();
    $('overview-search').addEventListener('input',event=>{query=event.target.value.trim().toLocaleLowerCase();focusedCategory=null;focusedField=null;selected='root';expandedFields.clear();renderTree(true);renderSongs();});
    $('overview-filter').addEventListener('change',event=>{filter=event.target.value;focusedCategory=null;focusedField=null;selected='root';expandedFields.clear();renderTree(true);});
    $('overview-reset').addEventListener('click',resetMap);
    $('map-home').addEventListener('click',resetMap);
    $('map-expand').addEventListener('click',()=>{expandedAll=!expandedAll;focusedCategory=null;focusedField=null;selected='root';expandedFields.clear();renderTree(true);});
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
