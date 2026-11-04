import { createEmbaSessionCookie, embaLoginHtml } from "../../_shared/emba-access.js";

export async function onRequestPost({ request, env }) {
  if (typeof env?.EMBA_PASSWORD !== "string" || !env.EMBA_PASSWORD) {
    return new Response(embaLoginHtml(request, { configured: false }), {
      status: 503,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return new Response("Invalid form submission.", { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const provided = String(form.get("password") || "");
  if (provided.length > 256 || provided !== env.EMBA_PASSWORD) {
    return new Response(null, {
      status: 303,
      headers: { Location: "/emba/?error=1", "Cache-Control": "no-store" },
    });
  }

  const cookie = await createEmbaSessionCookie(env, request);
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/emba/",
      "Set-Cookie": cookie,
      "Cache-Control": "no-store",
    },
  });
}

export async function onRequestGet() {
  return new Response("Method not allowed.", { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } });
}
