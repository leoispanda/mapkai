import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { workShareResponse } from '../functions/_shared/work-share.js';
import { articleShareMeta } from '../functions/_shared/article-share.js';
import articles from '../functions/_shared/article-share-data.js';
import { COST_GUARD_KEY, COST_GUARD_LIMITS } from '../functions/_shared/cost-guard.js';
import { TRACK_SCHEMA, audioKey } from '../functions/api/music/_shared.js';

const id = '11111111-1111-4111-8111-111111111111';
const record = { schemaVersion: TRACK_SCHEMA, visibility: 'PUBLIC', language: 'en', id,
  title: 'One <Song>', description: 'An introduction & a question.', filename: 'song.mp3', lyrics: '[Verse]\nA <line> & another.',
  extension: 'mp3', contentType: 'audio/mpeg', objectKey: audioKey(id, 'mp3'), fileSize: 500, audioEtag: 'abcd',
  aiGenerated: true, generationProvider: 'ElevenLabs', createdAt: '2026-10-24T00:00:00.000Z' };
function environment(track = record) {
  let reads = 0;
  return { reads: () => reads, env: { MAPKAI_REVIEW_MEDIA: { async get() { reads++; return track ? { size: JSON.stringify(track).length, json: async () => track } : null; } },
    CLOUDFLARE_COST_DB: { prepare() { return { bind(...values) { return { async first() { return {
      guard_key: COST_GUARD_KEY, cycle_start: values[1], class_a_used: 0, class_b_used: 1, upload_bytes_used: 0,
      storage_bytes_reserved: COST_GUARD_LIMITS.initialStorageBytes, updated_at: values[6],
    }; } }; } }; } } } };
}
const call = (kind, target, env, suffix = '?lang=en', method = 'GET') => workShareResponse({ kind, id: target, env, request: new Request(`https://www.mapkai.com/share/${kind}/${target}${suffix}`, { method }) });

test('song page serves one validated public work, original lyrics and exact metadata before JavaScript', async () => {
  const f = environment(); const response = await call('song', id, f.env); const html = await response.text();
  assert.equal(response.status, 200); assert.equal(f.reads(), 1);
  assert.match(html, /One &lt;Song&gt;/); assert.match(html, /A &lt;line&gt; &amp; another/);
  assert.match(html, new RegExp(`rel="canonical" href="https://www.mapkai.com/share/song/${id}\\?lang=en"`));
  assert.match(html, /og:type" content="music.song/); assert.match(html, /AI generated/);
  assert.equal((html.match(/<audio /g) || []).length, 1); assert.doesNotMatch(html, /autoplay|objectKey|audioEtag|workspace-backups|<script>/);
  assert.match(response.headers.get('Content-Security-Policy'), /script-src 'self'/);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('archived, missing and invalid works never fall back to a collection or private data', async () => {
  for (const candidate of [null, { ...record, visibility: 'ARCHIVED' }]) {
    const f = environment(candidate); assert.equal((await call('song', id, f.env)).status, 404);
  }
  const f = environment();
  for (const [kind, target] of [['song', 'bad'], ['film', 'missing'], ['video', '../private'], ['unknown', id]]) {
    assert.equal((await call(kind, target, f.env)).status, 404);
  }
  assert.equal(f.reads(), 0);
});

test('music video links render only the selected film with no download controls or links', async () => {
  for (const id of ['when-the-money-arrives', 'under-the-blue', 'leave-a-little-room', 'your-turn-asml', 'your-turn-artworks', 'your-turn-original']) {
    const response = await call('film', id, {}); const html = await response.text();
    assert.equal(response.status, 200); assert.equal((html.match(/<video /g) || []).length, 1);
    assert.match(html, new RegExp(`/share/film/${id}\\?lang=en`)); assert.match(html, new RegExp(`/music/videos/posters/${id}.jpg`));
    assert.match(html, /AI generated/); assert.doesNotMatch(html, /autoplay|objectKey|sha256/);
    assert.match(html, /controlslist="nodownload"/); assert.doesNotMatch(html, /<a[^>]+\bdownload\b|downloadUrl|download=1|href="undefined"/);
    if (id === 'when-the-money-arrives') {
      assert.match(html, /src="\/api\/music\/video\?id=when-the-money-arrives&amp;quality=hd&amp;revision=watch-only-20261031"/);
      assert.match(html, /data-src="\/api\/music\/video\?id=when-the-money-arrives&amp;quality=phone&amp;revision=watch-only-20261031"/);
      const zh = await call('film', id, {}, '?lang=zh'); const zhHtml = await zh.text();
      assert.equal(zh.status, 200); assert.match(zhHtml, /When the Money Arrives/);
      assert.match(zhHtml, /画面与人物为艺术演绎/);
    }
  }
});

test('learning video link retains the public review boundary and hides catalog internals', async () => {
  const item = { id: 'attempt-0542', fieldId: '0542', fieldName: 'Statistics', slug: 'statistics', title: 'Statistics preview',
    sha256: 'a'.repeat(64), objectKey: `raw/0542/attempt-0542/${'a'.repeat(64)}.mp4`, fileSize: 100,
    videoDuration: 60, resolution: '1280x720', status: 'HUMAN_REVIEW_PENDING', publicationStatus: 'NOT_PUBLISHED',
    brandingStatus: 'NOT_APPLIED', aiGenerated: true, publicPreviewStatus: 'VIDEO_CONTENT_UNDER_REVIEW' };
  const f = environment();
  f.env.MAPKAI_REVIEW_MEDIA.get = async () => ({ json: async () => ({ schemaVersion: 'mapkai-public-preview-catalog.v1', visibility: 'PUBLIC_PREVIEW', items: [item] }) });
  const response = await call('video', 'statistics', f.env); const html = await response.text();
  assert.equal(response.status, 200); assert.match(html, /AI generated/); assert.match(html, /Pending review · Not fully approved/);
  assert.match(html, /api\/factory\/public-video\?field=statistics/); assert.doesNotMatch(html, /objectKey|raw\/0542|attempt-0542|sha256/);
  assert.equal((await call('video', 'unregistered', f.env)).status, 404);
});

test('HEAD has no body; unsupported methods and storage failures are bounded', async () => {
  const head = await call('film', 'your-turn-asml', {}, '', 'HEAD'); assert.equal(head.status, 200); assert.equal(await head.text(), '');
  assert.equal((await call('film', 'your-turn-asml', {}, '', 'POST')).status, 405);
  const failed = await call('song', id, {}); assert.equal(failed.status, 503); assert.doesNotMatch(await failed.text(), /credentials|token|SQL/i);
});

test('every exported article has independent Chinese and English share metadata', () => {
  assert.ok(Object.keys(articles).length >= 11);
  for (const [route, langs] of Object.entries(articles)) {
    assert.match(route, /^\/(lens-stories|concept-fables|stories)\/[a-z0-9-]+$/);
    for (const lang of ['en', 'zh']) { assert.ok(langs[lang].title); assert.ok(langs[lang].description); }
  }
  assert.ok(articles['/lens-stories/02-subject-intro']);
  assert.equal(articles['/learning/corporate-finance/day-1'], undefined);
});

test('article response rewriting keeps the exact article and language; unrelated responses pass through', () => {
  const handlers = new Map(); let transformed;
  globalThis.HTMLRewriter = class { on(selector, handler) { handlers.set(selector, handler); return this; } transform(response) { transformed = response; return response; } };
  const response = new Response('<title>MapKAI</title>', { headers: { 'Content-Type': 'text/html' } });
  const route = '/lens-stories/02-subject-intro';
  articleShareMeta(response, new URL(`https://www.mapkai.com${route}?lang=zh`)); assert.equal(transformed, response);
  const attrs = {}, element = { setAttribute(key, value) { attrs[key] = value; }, setInnerContent(value) { attrs.text = value; } };
  handlers.get('link[rel="canonical"]').element(element); assert.equal(attrs.href, `https://www.mapkai.com${route}?lang=zh`);
  handlers.get('title').element(element); assert.equal(attrs.text, `${articles[route].zh.title} · MapKAI`);
  assert.equal(articleShareMeta(response, new URL('https://www.mapkai.com/categories')), response);
  delete globalThis.HTMLRewriter;
});

test('browser metadata uses the article identity after internal navigation and language changes', async () => {
  const source = await readFile(new URL('../script.js', import.meta.url), 'utf8');
  const fn = source.match(/^function updateRouteMeta\(route\) \{[\s\S]*?^\}/m)[0];
  const attrs = new Map();
  const document = { querySelector: selector => ({ setAttribute: (key, value) => attrs.set(`${selector}:${key}`, value) }) };
  const context = vm.createContext({ document, currentLanguage: 'zh', getAllRateableArticles: () => [{ href: '/concept-fables/a-story', title: '一篇故事', summary: '一句介绍' }], routeMeta: { '/': {}, '/concept-fables': {} } });
  vm.runInContext(fn, context); context.updateRouteMeta('/concept-fables/a-story');
  assert.equal(document.title, '一篇故事 · MapKAI');
  assert.equal(attrs.get('link[rel="canonical"]:href'), 'https://www.mapkai.com/concept-fables/a-story?lang=zh');
  context.currentLanguage = 'en'; context.updateRouteMeta('/concept-fables/a-story');
  assert.equal(attrs.get('meta[property="og:url"]:content'), 'https://www.mapkai.com/concept-fables/a-story?lang=en');
});

test('sharing uses the work permalink and language; native cancellation does not copy', async () => {
  const source = await readFile(new URL('../content-share.js', import.meta.url), 'utf8');
  async function run(navigator) {
    const document = { documentElement: { lang: 'zh-CN' }, body: {}, querySelectorAll: () => [], addEventListener() {} };
    const context = vm.createContext({ document, window: { addEventListener() {} }, location: { origin: 'https://www.mapkai.com', pathname: '/music/' }, URL,
      navigator, MutationObserver: class { observe() {} }, setTimeout() {} });
    vm.runInContext(source.replace('  scan();\n  syncMusicAddress();\n})();', '  globalThis.testShare = share;\n  scan();\n  syncMusicAddress();\n})();'), context);
    const button = { dataset: { sharePath: `/share/song/${id}`, shareTitle: 'One song', shareKind: 'song' }, disabled: false };
    await context.testShare(button); assert.equal(button.disabled, false); return button;
  }
  let payload, copied;
  await run({ share: async value => { payload = value; } });
  assert.equal(payload.url, `https://www.mapkai.com/share/song/${id}?lang=zh`); assert.equal(payload.title, 'One song');
  const button = await run({ clipboard: { writeText: async value => { copied = value; } } });
  assert.equal(copied, payload.url); assert.equal(button.textContent, '链接已复制');
  copied = null;
  await run({ share: async () => { throw Object.assign(new Error('Cancelled'), { name: 'AbortError' }); }, clipboard: { writeText: async value => { copied = value; } } });
  assert.equal(copied, null);
});
