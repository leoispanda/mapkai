import articles from './article-share-data.js';
import { escape } from './work-share.js';

export function articleShareMeta(response, url) {
  const article = articles[url.pathname.replace(/\/$/, '')];
  if (!article || !response.ok || !response.headers.get('Content-Type')?.includes('text/html')) return response;
  const lang = url.searchParams.get('lang') === 'zh' ? 'zh' : 'en';
  const entry = article[lang];
  const canonical = `https://www.mapkai.com${url.pathname.replace(/\/$/, '')}?lang=${lang}`;
  const title = `${entry.title} · MapKAI`;
  const image = 'https://www.mapkai.com/assets/mapkai-og-image.png';
  return new HTMLRewriter()
    .on('title', { element(el) { el.setInnerContent(title); } })
    .on('link[rel="canonical"]', { element(el) { el.setAttribute('href', canonical); } })
    .on('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]', { element(el) { el.setAttribute('content', entry.description); } })
    .on('meta[property="og:title"], meta[name="twitter:title"]', { element(el) { el.setAttribute('content', title); } })
    .on('meta[property="og:url"]', { element(el) { el.setAttribute('content', canonical); } })
    .on('meta[property="og:type"]', { element(el) { el.setAttribute('content', 'article'); } })
    .on('meta[property="og:image"], meta[name="twitter:image"]', { element(el) { el.setAttribute('content', image); } })
    .on('html', { element(el) { el.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en'); } })
    .on('head', { element(el) { el.append(`<meta name="mapkai:article" content="${escape(url.pathname)}">`, { html: true }); } })
    .transform(response);
}
