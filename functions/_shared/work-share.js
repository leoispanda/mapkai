import { musicBucket, publicTrack, readTrack, TRACK_ID_PATTERN } from '../api/music/_shared.js';
import { publicVideos } from '../api/music/_videos.js';
import { getPublicItemBySlug, publicItemProjection, readPublicCatalog } from '../api/factory/_public.js';
import { costResponse } from './cost-guard.js';

export const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const origin = 'https://www.mapkai.com';
const assetVersion = 'quiet-actions-20261024';
const bilingual = (value, lang) => value?.[lang] || value?.en || value?.zh || '';

export async function workShareResponse({ request, env = {}, kind, id }) {
  if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  const lang = new URL(request.url).searchParams.get('lang') === 'zh' ? 'zh' : 'en', zh = lang === 'zh';
  let title, description, body, back = '/music/', image = '/assets/mapkai-og-image.png';
  try {
    if (kind === 'song' && TRACK_ID_PATTERN.test(id)) {
      const record = await readTrack(musicBucket(env), id);
      if (!record) return unavailable(404, zh);
      const track = publicTrack(record);
      const [name, subject] = track.title.replace(/^\d{3,}\s+/, '').split(' - MapKAI - ');
      title = name; description = track.description || subject || (zh ? '在 MapKAI 听这首歌。' : 'Listen to this song on MapKAI.');
      body = `${track.aiGenerated ? '<p class="work-notice">AI generated</p>' : ''}<audio controls preload="none" data-track-id="${escape(id)}" src="${escape(track.url)}" aria-label="${escape(title)}"></audio>${track.lyrics ? `<section><h2>${zh ? '歌词' : 'Lyrics'}</h2><div class="work-lyrics">${escape(track.lyrics)}</div></section>` : ''}`;
    } else if (kind === 'film') {
      const item = publicVideos().find(item => item.id === id);
      if (!item) return unavailable(404, zh);
      title = bilingual(item.title, lang); description = bilingual(item.description, lang); image = item.poster; back = '/music/videos/';
      body = `<p class="work-notice">AI generated · ${zh ? '画面与人物为艺术演绎' : 'Imagined scenes and portraits'}</p><video controls controlslist="nodownload" playsinline preload="none" poster="${escape(item.poster)}" src="${escape(item.qualities[0].url)}" aria-label="${escape(title)}"></video>${item.qualities.length > 1 ? `<div class="work-qualities"><label>${zh ? '播放画质' : 'Playback quality'} <select id="work-quality">${item.qualities.map(q => `<option data-src="${escape(q.url)}">${escape(bilingual(q.label, lang))}</option>`).join('')}</select></label></div>` : ''}`;
    } else if (kind === 'video' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      const record = getPublicItemBySlug(await readPublicCatalog(env), id);
      if (!record) return unavailable(404, zh);
      const item = publicItemProjection(record);
      title = item.fieldName; description = item.disclosure; back = '/categories';
      body = `<p class="work-notice">AI generated</p><p class="work-notice">${escape(item.reviewLabel)}</p><video controls controlslist="nodownload" playsinline preload="none" src="${escape(item.videoUrl)}" aria-label="${escape(title)}"></video>`;
    } else return unavailable(404, zh);
  } catch (error) { return costResponse(error) || unavailable(503, zh); }
  const canonical = `${origin}/share/${kind}/${encodeURIComponent(id)}?lang=${lang}`;
  const html = `<!doctype html><html lang="${zh ? 'zh-CN' : 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} · MapKAI</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${escape(canonical)}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(canonical)}"><meta property="og:type" content="${kind === 'song' ? 'music.song' : 'video.other'}"><meta property="og:image" content="${origin}${escape(image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${origin}${escape(image)}"><link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/content-share.css?v=${assetVersion}"><script src="/content-share.js?v=${assetVersion}" defer></script>${kind === 'song' ? '<script src="/music/listening.js?v=listening-20261021" defer></script>' : ''}<script src="/shared-work.js?v=${assetVersion}" defer></script></head><body class="shared-work-page"><a class="work-brand" href="/">MapKAI</a><main class="shared-work"><h1>${escape(title)}</h1><div data-work-share="${kind}"></div><p class="work-intro">${escape(description)}</p>${body}<p id="work-error" class="work-notice" role="status" hidden>${zh ? '暂时无法播放，请刷新页面重试。' : 'Playback is unavailable. Refresh the page to try again.'}</p><footer class="work-footer"><a href="${back}?lang=${lang}">${zh ? '浏览更多作品' : 'Explore more works'} ↗</a> · <a href="?lang=${zh ? 'en' : 'zh'}" lang="${zh ? 'en' : 'zh'}">${zh ? 'English' : '中文'}</a></footer></main></body></html>`;
  return new Response(request.method === 'HEAD' ? null : html, { headers: {
    'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; media-src 'self'; base-uri 'none'; frame-ancestors 'none'; object-src 'none'",
    'Referrer-Policy': 'no-referrer', 'X-Frame-Options': 'DENY',
  } });
}

function unavailable(status, zh) {
  return new Response(zh ? (status === 404 ? '找不到这件作品。' : '暂时无法载入作品，请稍后重试。') : (status === 404 ? 'Work not found.' : 'This work is temporarily unavailable. Please try again.'), { status, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
}
