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
const categories=[{code:'00',groups:[{code:'000'},{code:'001'},{code:'002'},{code:'003'},{code:'009'}]},{code:'01',groups:[{code:'011'}]},{code:'04',groups:[{code:'040'}]},{code:'10',groups:[{code:'104'},{code:'108'},{code:'109'}]}];
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
 const h=harness(),html=h.render('00');assert.ok(html.includes(old.id)&&html.includes(extra.id));assert.ok(html.indexOf(old.id)<html.indexOf(extra.id));assert.equal((html.match(/data-category-song-id=/g)||[]).length,categories.find(c=>c.code==='00').groups.reduce((count,g)=>count+(defaults[g.code]?1:0)+(editions[g.code]||[]).length,0));
 assert.match(h.context.getCategorySongSubject(defaults['000'],'00'),/^General Studies · /);assert.match(h.context.getCategorySongSubject(editions['000'].find(x=>x.id===extra.id),'00'),/^General Foundations · Reasonableness Checks$/);
 const zh=harness('zh');assert.match(zh.context.getCategorySongSubject(defaults['000'],'00'),/^通用学习 · /);assert.match(zh.context.getCategorySongSubject(editions['000'].find(x=>x.id===extra.id),'00'),/^通用基础 · 合理性检验$/);
});
test('both old and new foundation songs activate their exact recording through the existing player',async()=>{
 const h=harness();await h.play(old.id,'00');await h.play(extra.id,'00');assert.deepEqual(h.calls,[old.id,extra.id]);
});
test('all four new group defaults render and play their allocated recordings without changing the foundation default',async()=>{
 const h=harness();for(const[code,number,category]of [['104',101,'10'],['108',102,'10'],['109',103,'10'],['040',104,'04']]){const song=ledger.songs.find(x=>x.number===number);assert.equal(defaults[code].id,song.id);assert.ok(h.render(category).includes(song.id));await h.play(song.id,category)}assert.deepEqual(h.calls,[101,102,103,104].map(n=>ledger.songs.find(x=>x.number===n).id));assert.equal(defaults['000'].id,old.id);
});

// Permanent B19 regression: all old defaults remain selected while new concepts append.
const defaultsBeforeB19={
  "000": "1eaa815d-a3ee-4a44-b9b0-0d17f25fe8fb",
  "001": "f371a248-b6c3-4ad9-89c5-467aa2886313",
  "002": "3e8a31da-c412-4c6b-8ffb-1aac28a56763",
  "003": "38a9863f-c874-4cb1-ad34-6ac12dfafb31",
  "009": "35a50c6d-c221-4231-b4b0-1110fa0b6433",
  "011": "46b5a636-42ae-40fd-aeec-52989eece8be",
  "018": "b3e949de-bca1-4ab9-b188-deeb79b19639",
  "020": "19294308-f15b-4fd4-b26b-2fe060633aaf",
  "021": "b7fc894c-e97a-49a9-92b6-d4ac21dc30fd",
  "022": "27124e5d-996a-4acc-98b2-37451861e50e",
  "023": "c72ee55f-ee05-4e97-82eb-1fcb34ac1234",
  "028": "8119cee8-55f1-4374-b1a4-25f3c7522935",
  "029": "3ff31ae1-2e8d-4fc2-83c3-d8d5dd4f9e88",
  "030": "451bf81c-35ae-4fc1-b53d-8a6f8bb92725",
  "031": "071f823e-75d8-4414-93d8-d6036cddb44f",
  "032": "4f8a674a-4647-470c-b591-fdf11d6e0886",
  "038": "5107ad5f-8340-43b4-9feb-774beaaa0e2f",
  "039": "ede8bff2-65ce-4581-860b-edc9e88ba43e",
  "041": "fc7d3cdd-f5c9-4d4b-b3d8-fddd65d2d0dc",
  "042": "4d248746-5274-47e7-8db5-5ebc7e20dd9e",
  "048": "bf37d0a7-a6a7-40ae-ab11-4842f8e4febc",
  "049": "bf70a9c9-c006-40d8-8fe7-5b16244f47dc",
  "050": "f631fba1-1e6a-4262-a13e-4199f5580944",
  "051": "928ac881-4220-49bd-a07f-34502c1760e9",
  "052": "5a5797ec-1bc5-4180-a16d-a99df53f88e4",
  "053": "aa077192-d6be-40c1-9d7e-5e738d50c8b8",
  "054": "2a7a93ab-c68b-487e-a87d-a22118d78843",
  "058": "60bb0d73-f6c0-4a4d-a259-226edd5b6c40",
  "059": "8de6f005-8b77-4d3e-a677-8a077076e999",
  "061": "180b1191-bca4-4042-b6d7-6a053b976a89",
  "068": "c97b3c86-1e7a-441d-8a87-a3917fb91e00",
  "070": "d9b0dea1-5d10-434b-ba86-cdfedd82ae5c",
  "071": "49b73ac8-7559-4f52-a457-d08f6df066c4",
  "072": "2fdd5250-0a16-4aa9-8c95-585267dafff8",
  "073": "a01ee68e-5082-4bb5-ab0a-88d2b950e101",
  "078": "28b42b8a-29ac-4de8-8c39-8797dfa13833",
  "079": "f5bc6236-b8d0-4347-9aac-716d8241387a",
  "080": "9a806f20-44d1-4e87-8844-799f1d0e669d",
  "081": "cb2a7614-4bc3-4e1b-993f-7699be99df39",
  "082": "77d67406-100e-4d8f-b78d-00218fdd81ed",
  "083": "e481d3b4-2b95-4354-a2c6-6e81b9d7358e",
  "084": "5ba5af11-5185-4c34-9c89-4a95c0106258",
  "088": "797c9984-644c-4c52-bb2b-e6104949b50b",
  "089": "b0bc9407-b3c7-425e-84f2-a1470ac9a1ba",
  "090": "a7759fae-040e-4e7b-be67-e507f7df0b61",
  "091": "bb604e2a-8cfe-4ec9-8868-f4a04b642487",
  "092": "2fc1a9b1-dc33-4649-80cf-1d9c144d83e8",
  "098": "1739a3f4-bc5a-4ec2-b6ba-6db17ab7120d",
  "099": "4a267e21-e59e-47cd-bfbf-4238bdd75db6",
  "100": "de23413a-a616-428f-b1b4-138fe1d35e07",
  "101": "5621e480-6d5d-4952-a2db-2102e95fb8bf",
  "102": "910ed1ef-f802-47d1-945d-96a2e638a818",
  "103": "632ef975-0d36-4e91-b6a6-314545ca11a7",
  "104": "df873a60-5842-492e-b8ed-cd92f3c5ab40",
  "108": "5f5c2da3-1f63-4f36-87bf-84359e664e68",
  "109": "e46e11ba-e5d3-4c05-8421-8f21667d22ab",
  "040": "310d4e89-197c-4f7c-ab3b-22b87e2af5cd"
};
test('five foundation and education concept editions append, render and play without replacing any of the57defaults',async()=>{
 assert.equal(Object.keys(defaults).length,Object.keys(defaultsBeforeB19).length);for(const[code,id]of Object.entries(defaultsBeforeB19))assert.equal(defaults[code].id,id);
 const h=harness(),expected=[];for(const[code,number,category]of [['001',106,'00'],['002',107,'00'],['003',108,'00'],['009',109,'00'],['011',110,'01']]){const row=ledger.songs.find(x=>x.number===number),track=editions[code]?.find(x=>x.id===row.id);assert.ok(track,'Missing appended edition '+code);assert.notEqual(track.id,defaults[code].id);const html=h.render(category);assert.ok(html.includes(defaults[code].id)&&html.includes(track.id));assert.ok(html.indexOf(defaults[code].id)<html.indexOf(track.id));assert.equal(h.context.getCategorySongSubject(track,category),row.subjectName+' · '+row.conceptName);await h.play(row.id,category);expected.push(row.id)}assert.deepEqual(h.calls,expected);
 const old105=ledger.songs.find(x=>x.number===105);assert.ok(editions['000'].some(x=>x.id===old105.id));
});
