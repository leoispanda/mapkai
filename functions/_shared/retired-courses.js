const retiredPrefixes = [
  '/learning/emba',
  '/learning/corporate-finance',
  '/zh/learning/corporate-finance',
  '/management',
  '/finance',
  '/subtitles/finance',
];
const retiredAssets = new Set([
  '/finance-course.js',
  '/assets/finance-course-og.png',
  '/content/management-column.js',
  '/content/management-lesson-stories.js',
  '/content/management-lesson-references.js',
]);

export function isRetiredCoursePath(pathname) {
  let path = String(pathname || '');
  // The asset server also decodes URL paths. Check the decoded form before
  // falling through to static assets or the single-page application.
  for (let pass = 0; pass < 4; pass += 1) {
    try {
      const decoded = decodeURIComponent(path);
      if (decoded === path) break;
      path = decoded;
    } catch {
      break;
    }
  }
  path = path.replace(/\/{2,}/g, '/');
  if (path === '/learning/emba/fd-context-storyflow' || path.startsWith('/learning/emba/fd-context-storyflow/')) {
    return false;
  }
  return retiredAssets.has(path) || retiredPrefixes.some(prefix => path === prefix || path.startsWith(`${prefix}/`));
}

export function retiredCourseResponse(request) {
  const url = new URL(request.url);
  if (!isRetiredCoursePath(url.pathname)) return null;
  const zh = url.pathname.startsWith('/zh/') || url.searchParams.get('lang') === 'zh';
  const title = zh ? '课程已移除' : 'This course has been removed';
  const message = zh ? '此课程已不再提供。你可以继续探索 MapKAI 的其他内容。' : 'This course is no longer available. You can keep exploring other content on MapKAI.';
  const home = zh ? '返回首页' : 'Back to MapKAI';
  const body = `<!doctype html><html lang="${zh ? 'zh-CN' : 'en'}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · MapKAI</title><style>body{margin:0;background:#fffdf8;color:#172033;font:17px/1.7 system-ui,sans-serif}main{max-width:560px;margin:16vh auto;padding:28px}h1{font-size:30px;line-height:1.3}a{color:#2563eb}</style><main><p>MapKAI</p><h1>${title}</h1><p>${message}</p><a href="/${zh ? '?lang=zh' : ''}">${home}</a></main></html>`;
  return new Response(request.method === 'HEAD' ? null : body, {
    status: 410,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
    },
  });
}
