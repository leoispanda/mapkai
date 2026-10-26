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
  newer: ['当前版本', 'Current version'], older: ['较早版本', 'Earlier version'],
  openSubject: ['进入学科', 'Open subject'], readIntro: ['阅读学科导论', 'Read the introduction'],
  watch: ['看总览视频', 'Watch overview'], listen: ['听主题歌', 'Play theme song'],
  openField: ['进入小学科', 'Open field'], watchField: ['观看视频', 'Watch video'],
  read: ['阅读故事', 'Read story'], listenShared: ['听共享歌曲', 'Play shared song'],
  prepared: ['故事稿已备', 'Story drafts ready'], open: ['可阅读', 'Open for reading'],
  draft: ['草稿版本', 'Draft version'], songCollection: ['歌曲', 'Songs'],
  introCollection: ['可读学科导论', 'Readable introductions'], videoCollection: ['学科视频', 'Subject videos'],
  films: ['MV 作品', 'Music video works'], preview: ['含待审预览', 'Includes previews under review'],
  complete: ['完整课程 · 需课程密码', 'Complete course · Course password required'], openCourse: ['打开课程入口 ↗', 'Open the course entrance ↗'],
  noVideos: ['视频目录暂时无法核实，相关数量与状态灯保持“待核实”。稍后重新打开此页可再次读取。', 'The video directory could not be verified. Its counts and lights remain unverified. Reopen this page to try again.'],
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
let expandedAll = true;
let selected = 'root';
let selectionReturn = null;
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
function watchAnchor(video, label) { return video ? anchor(`/share/video/${video.slug}`, label) : `<span>${esc(video === undefined ? (zh?'视频待核实':'Video unverified') : (zh?'视频待补':'Video needed'))}</span>`; }
function matches(...values) { return !query || values.flat(Infinity).filter(Boolean).join(' ').toLocaleLowerCase().includes(query); }
function songMatches(song) { return song && matches(song.title, song.subject, Object.values(song.concept)); }
function fieldMatches(field) {
  return matches(Object.values(field.title), field.stories.flatMap(s => [...Object.values(s.title), ...Object.values(s.concept)])) || Boolean(query && songMatches(songsById.get(field.songId)));
}
function passesFilter(field) {
  if (filter === 'complete') return fieldScore(field) === null || fieldScore(field) === 3;
  if (filter === 'video') return videoFor(field) !== null;
  if (filter === 'music') return songsById.has(field.songId);
  if (filter === 'missing-music') return !songsById.has(field.songId);
  if (filter === 'missing-video') return videoFor(field) === null;
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
  query='';filter='all';expandedAll=true;selected='root';expandedFields.clear();
  $('overview-search').value='';$('overview-subject').value='';renderTree();renderSongs();
}
function closeSelection() {
  const previous=selectionReturn;selected='root';renderTree();
  const target=previous?.kind==='story'?[...$('content-map').querySelectorAll('[data-story-id]')].find(el=>el.dataset.storyId===previous.item.id):[...$('content-map').querySelectorAll('[data-node]')].find(el=>el.dataset.node===previous?.id);
  target?.focus({preventScroll:true});
}
function activateNode(node) {
  if(node.kind==='root'){resetMap();mindMap.fit();return;}
  selected=node.id;selectionReturn=node;
  if(node.kind==='category'&&!expandedAll){expandedAll=true;renderTree();mindMap.focusCategory(node.item.code);return;}
  if(node.kind==='field'){
    if(expandedFields.has(node.id))expandedFields.delete(node.id);else{expandedFields.clear();expandedFields.add(node.id);}
  }
  renderTree();$('map-selection').focus({preventScroll:true});
  if(node.kind==='category')mindMap.focusCategory(node.item.code);
  else if(node.kind==='field')mindMap.focusNode(node.id);
  else if(node.kind==='story'){const field=catalog.categories.flatMap(c=>c.fields).find(f=>f.stories.some(story=>story.id===node.item.id));if(field)mindMap.focusNode(`field-${field.code}`);}
}
function storyDotClass(story) { return `resource-dot small ${story.ready ? `on${story.newer?'':' earlier'}` : 'missing'}`; }
function storyNode(story) {
  const node={id:`story-${story.id}`,kind:'story',item:story,label:pick(story.title),subtitle:`${t(story.newer?'newer':'older')} · ${t(story.public?'open':'prepared')}`,signals:[graphSignal(story.ready,pick(story.title))]};
  node.description=`${node.label}. ${node.subtitle}. ${t(story.public?'open':'pending')}`;
  return node;
}
function renderSelection(node) {
  if(!node||node.kind==='root'){$('map-selection').hidden=true;return;}
  const item=node.item;let links=[],note='',stories='';
  if(node.kind==='category'){
    links=[anchor(`/categories/${item.code}`,t('openSubject')),item.introduction?.public?anchor(`/lens-stories/${item.introduction.id}`,t('readIntro')):'',watchAnchor(videoFor(item),t('watch')),songsById.has(item.songId)?songAnchor(item.songId,t('listen')):''];
    note=item.introduction?`${t(item.introduction.public?'open':'pending')} · ${pick(item.introduction.title)}`:'';
  }else if(node.kind==='field'){
    links=[anchor(`/fields/${item.slug}`,t('openField')),watchAnchor(videoFor(item),t('watchField')),songsById.has(item.songId)?songAnchor(item.songId,t('listenShared')):`<span>${esc(zh?'音乐待补':'Music needed')}</span>`];
    note=zh?'三个故事的版本与阅读状态':'Versions and reading availability of the three stories';
    stories=`<div class="selection-stories">${item.stories.map((story,i)=>`<button type="button" data-select-story="${esc(story.id)}" aria-label="${esc(`${i+1}. ${pick(story.title)} · ${t(story.newer?'newer':'older')} · ${t(story.public?'open':'pending')}`)}"><span class="${storyDotClass(story)}" aria-hidden="true"></span><span><strong>${i+1}. ${esc(pick(story.title))}</strong><small>${esc(t(story.public?'open':'pending'))}</small></span></button>`).join('')}</div>`;
  }else{
    links=item.public?[anchor(`/concept-fables/${item.id}`,t('read'))]:[];
    note=`${pick(item.concept)} · ${t(item.public?'open':'pending')}`;
  }
  const indicator=node.kind==='story'?`<i class="${storyDotClass(item)}" role="img" aria-label="${esc(t(item.newer?'newer':'older'))}"></i> `:'';
  $('map-selection').innerHTML=`<button type="button" id="selection-close" class="selection-close" aria-label="${esc(zh?'关闭详情':'Close details')}">×</button><div class="selection-heading"><span>${indicator}${esc(zh?'当前分支':'Selected branch')}</span><h3>${esc(node.label)}</h3></div><div class="selection-content"><div class="overview-resource-links">${links.filter(Boolean).join('')}</div><p>${esc(note)}</p>${stories}</div>`;
  $('map-selection').hidden=false;
}
function availability(field) {
  const video=videoFor(field),music=songsById.has(field.songId),stories=field.stories.some(s=>s.ready);
  if(music&&video&&stories)return zh?'✓ 大满贯':'✓ All three ready';
  const missing=[];
  if(!music)missing.push(zh?'缺音乐':'Music needed');
  if(video===undefined)missing.push(zh?'视频待核实':'Video unverified');else if(!video)missing.push(zh?'缺视频':'Video needed');
  if(!stories)missing.push(zh?'缺故事':'Stories needed');
  return missing.join(' · ');
}
function renderFilters() {
  const fields=catalog.categories.flatMap(c=>c.fields);
  const options=[['all',zh?'全部':'All',fields.length,false],['complete',zh?'大满贯':'All three',videos===null?'—':fields.filter(f=>fieldScore(f)===3).length,videos===null],
    ['missing-music',zh?'缺音乐':'Music needed',fields.filter(f=>!songsById.has(f.songId)).length,false],['missing-video',zh?'缺视频':'Video needed',videos===null?'—':fields.filter(f=>videoFor(f)===null).length,videos===null],
    ['video',zh?'有视频':'With video',videos===null?'—':fields.filter(f=>videoFor(f)).length,videos===null],['music',zh?'有共享歌':'Shared song',fields.filter(f=>songsById.has(f.songId)).length,false],['older',zh?'较早故事':'Earlier stories',fields.filter(f=>f.stories.some(story=>!story.newer)).length,false]];
  if(!$('overview-filters').children.length)$('overview-filters').innerHTML=options.map(([value])=>`<button type="button" data-filter="${value}"><span></span><strong></strong></button>`).join('');
  for(const [value,label,count,disabled]of options){const button=$('overview-filters').querySelector(`[data-filter="${value}"]`);button.querySelector('span').textContent=label;button.querySelector('strong').textContent=count;button.disabled=disabled;button.setAttribute('aria-pressed',String(filter===value));}
}
function renderTree() {
  const root={id:'root',kind:'root',label:'MapKAI',subtitle:zh?'80 个小学科':'80 learning fields',description:zh?'MapKAI，显示全部80个小学科':'MapKAI, show all 80 fields'};
  const categories=[],allNodes=[root];let fieldCount=0;
  for(const category of catalog.categories){
    const song=songsById.get(category.songId);
    const categoryMatch=matches(Object.values(category.title),category.introduction?Object.values(category.introduction.title):[])||Boolean(query&&songMatches(song));
    const fields=category.fields.filter(f=>(categoryMatch||fieldMatches(f))&&passesFilter(f));
    if(!fields.length)continue;
    fieldCount+=fields.length;
    const complete=fields.filter(f=>fieldScore(f)===3).length;
    const subtitle=zh?`${fields.length} 小学科 · ${videos===null?'待核实':`${complete} 大满贯`}`:`${fields.length} fields · ${videos===null?'Unverified':`${complete} complete`}`;
    const node={id:`category-${category.code}`,kind:'category',item:category,label:pick(category.title),subtitle,complete,total:fields.length,expandable:false,expanded:expandedAll};
    node.description=`${node.label}. ${subtitle}`;allNodes.push(node);
    if(expandedAll||query||filter!=='all')node.children=fields.map(field=>{
      const children=field.stories.map(storyNode);allNodes.push(...children);
      const f={id:`field-${field.code}`,kind:'field',item:field,category,label:pick(field.title),subtitle:availability(field),score:fieldScore(field),expandable:true,expanded:expandedFields.has(`field-${field.code}`)||Boolean(query&&field.stories.some(story=>matches(Object.values(story.title),Object.values(story.concept)))),signals:graphSignals(field,field.stories.some(s=>s.ready),true),storySignals:field.stories.map((story,i)=>({...graphSignal(story.ready,`${pick(story.title)} · ${t(story.newer?'newer':'older')} · ${t(story.public?'open':'pending')}`),id:story.id,newer:story.newer,node:children[i]}))};
      f.description=`${f.label}. ${f.subtitle}. ${f.signals.map(s=>s.label).join('. ')}. ${f.storySignals.map(s=>s.label).join('. ')}`;
      if(f.expanded)f.children=children;allNodes.push(f);return f;
    });
    categories.push(node);
  }
  if(!allNodes.some(n=>n.id===selected))selected='root';
  mindMap.render({root,categories,selected,viewKey:`${query}|${filter}|${expandedAll}`,searching:Boolean(query),filtered:Boolean(query||filter!=='all')});renderSelection(allNodes.find(n=>n.id===selected));renderFilters();
  $('overview-empty').hidden=fieldCount>0;
  const detailed=Boolean(expandedAll||query||filter!=='all');
  $('directory-title').textContent=zh?(query?'搜索结果':filter!=='all'?'筛选结果':detailed?'全部小学科':'学科大类'):(query?'Search results':filter!=='all'?'Filtered fields':detailed?'All fields':'Subject groups');
  $('map-guidance').textContent=zh?`${detailed?fieldCount:categories.length}${detailed?'科':'类'}完整全景 · 点击学科放大`:`${detailed?fieldCount:categories.length} ${detailed?'fields':'subjects'} · Select a subject to zoom`;
  $('directory-results').textContent=zh?`${fieldCount} / 80 个小学科 · ${categories.length} 个学科分支`:`${fieldCount} / 80 fields · ${categories.length} subject branches`;
  $('map-expand').textContent=zh?(detailed?'只看大类':'展开80小学科'):(detailed?'Subjects only':'Expand 80 fields');$('map-expand').setAttribute('aria-pressed',String(detailed));
  const counts={1:0,2:0,3:0};for(const field of catalog.categories.flatMap(c=>c.fields)){const score=fieldScore(field);if(score!==null)counts[score]=(counts[score]||0)+1;}
  $('readiness').textContent=videos===null?(zh?'正在核实视频资源':'Verifying videos'):(zh?`${counts[3]} 大满贯 · ${counts[2]} 双绿 · ${counts[1]} 单绿`:`${counts[3]} complete · ${counts[2]} with two · ${counts[1]} with one`);
  if(!$('overview-subject').querySelector('option[data-category]'))$('overview-subject').insertAdjacentHTML('beforeend',catalog.categories.map(c=>`<option data-category="${c.code}" value="${c.code}">${esc(pick(c.title))}</option>`).join(''));
  const visible=new Set(categories.map(c=>c.item.code));$('overview-subject').querySelectorAll('option[data-category]').forEach(option=>{option.disabled=!visible.has(option.value);});if($('overview-subject').value&&!visible.has($('overview-subject').value))$('overview-subject').value='';
}
function renderCounts() {
  const fields = catalog.categories.flatMap(c => c.fields);
  const stories = fields.flatMap(f => f.stories);
  const progress = [
    {key:'stories', title:t('stories'), total:stories.length, done:stories.filter(s => s.ready && s.newer).length, unit:zh?'篇':'stories', completed:zh?'已转换':'Converted', remaining:zh?'待转换':'To convert', note:zh?'按故事版本转换计数；已备稿不代表正文已开放。':'Counts current story versions. Prepared drafts may not be open for reading.'},
    {key:'music', title:t('music'), total:fields.length, done:fields.filter(f => songsById.has(f.songId)).length, unit:zh?'科':'fields', completed:zh?'已覆盖':'Covered', remaining:zh?'待补':'Needed', note:zh?`按小学科覆盖计数，含分组共享歌曲${songsCurrent?'':'；当前为目录快照'}。`:`Field coverage, including shared group songs${songsCurrent?'':'; directory snapshot'}.`},
    {key:'video', title:t('video'), total:fields.length, done:videos === null ? null : fields.filter(f => videoFor(f)).length, unit:zh?'科':'fields', completed:zh?'已覆盖':'Covered', remaining:zh?'待补':'Needed', note:videoFailed?t('noVideos'):t('liveVideos')},
  ];
  $('content-counts').innerHTML = progress.map(({key,title,total,done,unit,completed,remaining,note}) => {
    const known = done !== null, pending = known ? total - done : '—';
    const percent = known && total ? Math.round(done / total * 1000) / 10 : 0;
    const totalLabel = zh ? `共 ${total} ${unit}` : `${total} ${unit}`;
    const valueLabel = known ? `${totalLabel} · ${completed} ${done} · ${remaining} ${pending} · ${percent}%` : `${totalLabel} · ${t('unknown')}`;
    return `<div class="overview-progress" data-progress="${key}" title="${esc(note)}"><div class="progress-heading"><h2>${esc(title)}</h2><span class="progress-total">${esc(totalLabel)}</span></div><div class="progress-numbers"><span class="progress-completed">${esc(completed)} <strong>${known?done:'—'}</strong></span><span>${esc(remaining)} <strong>${pending}</strong></span></div><div class="progress-track"><progress max="${total}"${known?` value="${done}"`:''} aria-label="${esc(title)}" aria-valuetext="${esc(valueLabel)}"></progress><span class="progress-percent">${known?`${percent}%`:esc(t('unknown'))}</span></div><span class="sr-only">${esc(note)}</span></div>`;
  }).join('');
  const intros = catalog.categories.filter(c => c.introduction?.public).length;
  const draftCount = stories.filter(s => s.ready && !s.public).length;
  const workCount = films === null ? '—' : new Set(films.map(f => pick(f.title).replace(/\s*\(Draft \d+\)$/, '').toLowerCase())).size;
  const stats = [
    ['#content-map', intros, t('introCollection'), zh ? `另有 ${draftCount} 篇故事稿已备` : `${draftCount} further story drafts ready`],
    ['#content-map', videos === null ? '—' : videos.size, t('videoCollection'), videoFailed ? t('unknown') : t('preview')],
    ['#music-library', catalog.songs.length, t('songCollection'), songsCurrent ? (zh ? '按录音计数 · 含不同版本' : 'Recordings, including alternate versions') : (zh ? '目录快照' : 'Directory snapshot')],
    ['#film-library', workCount, t('films'), films === null ? (filmFailed ? t('failed') : t('loading')) : (zh ? `${films.length} 个创作版本` : `${films.length} creative versions`)],
  ];
  const shortTitles=zh?['导论','视频','歌曲','MV']:['Intros','Videos','Songs','MVs'];
  $('collection-counts').innerHTML = stats.map(([href,n,title,note],i) => `<a class="overview-stat" href="${href}" title="${esc(`${title} · ${note}`)}" aria-label="${esc(`${n} ${title} · ${note}`)}"><strong>${esc(n)}</strong><span>${esc(shortTitles[i])}</span><small>${esc(note)}</small></a>`).join('');
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
    mindMap=createMindMap({svg:$('content-map'),frame:$('map-frame'),language,onActivate:activateNode,onDismiss:closeSelection});
    renderCounts(); renderCourse(); renderTree(true); renderSongs();
    $('overview-search').addEventListener('input',event=>{query=event.target.value.trim().toLocaleLowerCase();selected='root';expandedFields.clear();renderTree();renderSongs();});
    $('overview-filters').addEventListener('click',event=>{const button=event.target.closest('[data-filter]');if(!button||button.disabled)return;filter=button.dataset.filter;selected='root';expandedFields.clear();renderTree();});
    $('overview-subject').addEventListener('change',event=>mindMap.focusCategory(event.target.value));
    $('overview-reset').addEventListener('click',resetMap);
    $('map-home').addEventListener('click',()=>{resetMap();mindMap.focusCategory('');});
    $('map-expand').addEventListener('click',()=>{expandedAll=!(expandedAll||query||filter!=='all');query='';filter='all';$('overview-search').value='';selected='root';expandedFields.clear();renderTree();renderSongs();});
    $('map-selection').addEventListener('click',event=>{if(event.target.closest('#selection-close')){closeSelection();return;}const story=event.target.closest('[data-select-story]');if(story){const item=catalog.categories.flatMap(c=>c.fields).flatMap(f=>f.stories).find(s=>s.id===story.dataset.selectStory);if(item)activateNode(storyNode(item));}});
    document.addEventListener('keydown',event=>{if(event.key==='Escape')closeSelection();});
    $('collection-counts').addEventListener('click', event => { const href = event.target.closest('a')?.getAttribute('href'); if (href === '#music-library' || href === '#film-library') $(href.slice(1)).open = true; });
    await Promise.allSettled([
      json('/music/song-catalog.json').then(payload => {
        if (!Array.isArray(payload?.songs) || payload.songs.some(s => !/^[a-f0-9-]{36}$/i.test(s.id || '') || typeof s.songName !== 'string' || typeof s.subjectName !== 'string' || typeof s.conceptName !== 'string') || new Set(payload.songs.map(s => s.id)).size !== payload.songs.length) throw new Error('Invalid songs');
        catalog.songs = payload.songs.map(s => ({ id:s.id, number:s.numberLabel, title:s.songName, subject:s.subjectName, language:s.language,
          concept:songsById.get(s.id)?.concept?.en === s.conceptName ? songsById.get(s.id).concept : {en:s.conceptName,zh:s.conceptName} }));
        songsById = new Map(catalog.songs.map(s => [s.id,s])); songsCurrent = true;
      }).catch(() => {}).finally(() => { renderCounts(); renderTree(); renderSongs(); }),
      json('/api/factory/public-videos').then(payload => { videos = videoIndex(payload); }).catch(() => { videoFailed = true; }).finally(() => { renderTree(); renderCounts(); $('video-status').textContent = t(videoFailed ? 'noVideos' : 'liveVideos'); }),
      json('/api/music/videos').then(payload => {
        if (!Array.isArray(payload?.items) || payload.items.some(f => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(f.id || '') || !f.title || !Array.isArray(f.qualities))) throw new Error('Invalid films');
        films = payload.items;
      }).catch(() => { filmFailed = true; }).finally(() => { renderFilms(); renderCounts(); }),
    ]);
  } catch { $('coverage').textContent = t('catalogFailure'); }
}
initialize();
