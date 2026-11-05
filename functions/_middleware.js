import { articleShareMeta } from "./_shared/article-share.js";
import { retiredCourseResponse } from "./_shared/retired-courses.js";
import { embaLoginHtml, hasEmbaAccess } from "./_shared/emba-access.js";

export async function onRequest(context) {
  const retired = retiredCourseResponse(context.request);
  if (retired) return retired;
  const url = new URL(context.request.url);
  if (url.pathname === "/api/emba/auth") return context.next();
  if (url.pathname === "/showcase/fd-context-storyflow" || url.pathname.startsWith("/showcase/fd-context-storyflow/")) {
    return Response.redirect(new URL("/learning/emba/fd-context-storyflow/", url), 302);
  }
  if (url.pathname === "/emba" || url.pathname.startsWith("/emba/")) {
    if (await hasEmbaAccess(context.request, context.env)) {
      if (url.pathname === "/emba" || url.pathname === "/emba/") {
        const academyUrl = new URL("/learning/emba/fd-context-storyflow/", url.origin);
        return context.next(new Request(academyUrl, context.request));
      }
      return context.next();
    }
    return new Response(embaLoginHtml(context.request, {
      configured: Boolean(context.env?.EMBA_PASSWORD),
      incorrect: url.searchParams.get("error") === "1",
    }), {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }
  if (url.pathname === '/speaking' || url.pathname.startsWith('/speaking/')) {
    const upstream = await context.next();
    const response = new Response(upstream.body, upstream);
    response.headers.set('Permissions-Policy', 'microphone=(self), camera=(), geolocation=(), payment=()');
    response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; worker-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self' https://generativelanguage.googleapis.com wss://generativelanguage.googleapis.com; media-src 'self' blob:; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
    response.headers.set('Cache-Control', 'no-cache');
    response.headers.set('Referrer-Policy', 'no-referrer');
    return response;
  }
  return articleShareMeta(await context.next(), url);
}
