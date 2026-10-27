import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('../script.js',import.meta.url),'utf8');
const mirrored=await readFile(new URL('../public/script.js',import.meta.url),'utf8');
const ledger=JSON.parse(await readFile(new URL('../music/song-catalog.json',import.meta.url),'utf8'));
function literal(name){const marker='const '+name+' = ',a=source.indexOf(marker)+marker.length,z=source.indexOf('\n};',a)+2;assert.ok(a>=marker.length&&z>a,'Missing song data '+name);return JSON.parse(source.slice(a,z))}
const defaults=literal('categoryGroupSongTracks'),editions=literal('categoryGroupSongEditions');
const subjects=literal('categorySongSubjectLabels'),topics=literal('categorySongTopicLabelsZh');
const handlers=['getCategorySongDisplayTitle','getCategorySongSubject','renderCategorySongButton','renderCategorySongModule','renderCategoryGroupSongs','refreshCategorySongModules','playCategorySongModule'].map(name=>{const m=source.match(new RegExp(`^(?:async )?function ${name}\\([^\\n]*\\) \\{[\\s\\S]*?^\\}`,'m'));assert.ok(m,'Missing application handler '+name);return m[0]}).join('\n');
const categories=[{code:'00',groups:[{code:'000'}]},{code:'04',groups:[{code:'040'}]},{code:'10',groups:[{code:'104'},{code:'108'},{code:'109'}]}];
function harness(language='en'){
 const buttons=[],calls=[];let route='/categories/00',state={id:null,playing:false,pending:false,failed:false};
 const dock={snapshot:()=>({...state}),play:async id=>{calls.push(id);state={id,playing:true,pending:false,failed:false};return true}};
 const document={querySelectorAll:selector=>selector==='[data-category-song-id]'?buttons:buttons.map(b=>b.status)};
 const context=vm.createContext({currentLanguage:language,categoryGroupSongTracks:defaults,categoryGroupSongEditions:editions,categorySongSubjectLabels:subjects,categorySongTopicLabelsZh:topics,categorySongTracks:{},ownerCulturalSongs:[],categories,categorySongRenderToken:1,categorySongPlaybackToken:0,categorySongPendingId:null,document,window:{MapKAIMusicDock:dock,location:{get pathname(){return route},set pathname(_){throw Error('Playback navigated')}}},normalizeRoute:x=>x,waitForCategorySongPlayer:()=>Promise.resolve(dock),getPublicCategoryTitle:code=>'Broad '+code,escapeHtml:value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')});
 vm.runInContext(handlers,context);
 return{context,calls,render:code=>context.renderCategoryGroupSongs(categories.find(x=>x.code===code)),play:async(id,code)=>{route='/categories/'+code;const attributes=new Map(),status={textContent:''};const button={dataset:{categorySongId:id,songCategory:code,songTitle:id},disabled:false,isConnected:true,status,setAttribute:(k,v)=>attributes.set(k,v),removeAttribute:k=>attributes.delete(k),closest:()=>({querySelector:()=>status})};buttons.push(button);await context.playCategorySongModule(button);assert.equal(route,'/categories/'+code);assert.equal(button.disabled,false);assert.equal(status.textContent,'')}};
}
const old=ledger.songs.find(x=>x.number===37),extra=ledger.songs.find(x=>x.number===105);
test('a new concept edition keeps the original default and both are rendered with their own subjects',()=>{
 assert.equal(source,mirrored);assert.equal(defaults['000'].id,old.id);assert.equal(old.conceptName,'Spaced Retrieval Practice');assert.equal(extra.conceptName,'Reasonableness Checks');assert.ok(editions['000'].some(x=>x.id===extra.id));
 const h=harness(),html=h.render('00');assert.ok(html.includes(old.id)&&html.includes(extra.id));assert.ok(html.indexOf(old.id)<html.indexOf(extra.id));assert.equal((html.match(/data-category-song-id=/g)||[]).length,1+editions['000'].length);
 assert.match(h.context.getCategorySongSubject(defaults['000'],'00'),/^General Studies · /);assert.match(h.context.getCategorySongSubject(editions['000'].find(x=>x.id===extra.id),'00'),/^General Foundations · Reasonableness Checks$/);
 const zh=harness('zh');assert.match(zh.context.getCategorySongSubject(defaults['000'],'00'),/^通用学习 · /);assert.match(zh.context.getCategorySongSubject(editions['000'].find(x=>x.id===extra.id),'00'),/^通用基础 · 合理性检验$/);
});
test('both old and new foundation songs activate their exact recording through the existing player',async()=>{
 const h=harness();await h.play(old.id,'00');await h.play(extra.id,'00');assert.deepEqual(h.calls,[old.id,extra.id]);
});
test('all four new group defaults render and play their allocated recordings without changing the foundation default',async()=>{
 const h=harness();for(const[code,number,category]of [['104',101,'10'],['108',102,'10'],['109',103,'10'],['040',104,'04']]){const song=ledger.songs.find(x=>x.number===number);assert.equal(defaults[code].id,song.id);assert.ok(h.render(category).includes(song.id));await h.play(song.id,category)}assert.deepEqual(h.calls,[101,102,103,104].map(n=>ledger.songs.find(x=>x.number===n).id));assert.equal(defaults['000'].id,old.id);
});
