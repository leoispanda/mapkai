const coursePrefix = "/learning/corporate-finance";
const protectedCoursePrefixes = [coursePrefix, "/zh/learning/corporate-finance", "/learning/emba"];
const unlockPath = `${coursePrefix}/unlock`;
const cookieName = "mapkai_course_session";
const legacyCookieName = "mapkai_course_access";
const encoder = new TextEncoder();

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (!isProtectedCoursePath(url.pathname)) return context.next();

  const password = String(context.env.COURSE_ACCESS_PASSWORD || "").trim();
  if (!password) {
    return new Response("Course access is not configured.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (url.pathname === unlockPath) {
    return handleUnlock(context.request, url, password);
  }

  if (await hasValidAccessCookie(context.request, password)) return context.next();
  return passwordPage(url);
}

function isProtectedCoursePath(pathname) {
  return protectedCoursePrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

async function handleUnlock(request, url, password) {
  const returnTo = safeReturnTo(url.searchParams.get("returnTo"));
  if (request.method !== "POST") return passwordPage(url);

  const form = await request.formData().catch(() => null);
  const submittedPassword = String(form?.get("password") || "");
  if (!safeEqual(submittedPassword, password)) return passwordPage(url, true);

  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL(returnTo, url.origin).toString(),
      "Cache-Control": "no-store",
      "Set-Cookie": await createAccessCookie(request, password),
    },
  });
}

function passwordPage(url, isInvalid = false) {
  const returnTo = safeReturnTo(url.searchParams.get("returnTo") || `${url.pathname}${url.search}`);
  const action = `${unlockPath}?returnTo=${encodeURIComponent(returnTo)}`;
  const error = isInvalid ? `<p class="error">That password is not correct. Please try again.</p>` : "";
  return new Response(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Course access | MapKAI</title>
    <style>
      :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 24px; box-sizing: border-box; background: #f6f0e4; color: #172033; }
      main { width: min(100%, 430px); border: 1px solid rgba(15, 23, 42, .12); border-radius: 18px; padding: 32px; background: rgba(255, 255, 255, .94); box-shadow: 0 20px 48px rgba(15, 23, 42, .12); }
      .eyebrow { margin: 0 0 10px; color: #1d4ed8; font-size: .76rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
      h1 { margin: 0; font-size: clamp(1.75rem, 5vw, 2.35rem); line-height: 1.08; }
      p { color: #526079; line-height: 1.6; }
      label { display: grid; gap: 8px; margin-top: 24px; color: #172033; font-size: .9rem; font-weight: 700; }
      input { min-height: 46px; box-sizing: border-box; border: 1px solid #b8c3d3; border-radius: 10px; padding: 0 12px; font: inherit; }
      button { width: 100%; min-height: 48px; margin-top: 18px; border: 0; border-radius: 10px; background: #2563eb; color: #fff; font: inherit; font-weight: 750; cursor: pointer; }
      .error { margin: 18px 0 0; border-radius: 10px; padding: 10px 12px; background: #fff1f2; color: #b42318; font-size: .92rem; }
      .note { margin: 18px 0 0; font-size: .82rem; }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">Private course</p>
      <h1>Corporate Finance Essentials</h1>
      <p>This course is password protected. Enter the course password to continue.</p>
      ${error}
      <form method="post" action="${action}">
        <label for="password">Course password
          <input id="password" name="password" type="password" autocomplete="current-password" required autofocus />
        </label>
        <button type="submit">Continue to course</button>
      </form>
      <p class="note">本课程已加密码保护。</p>
    </main>
  </body>
</html>`, {
    status: isInvalid ? 401 : 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'",
      "Referrer-Policy": "no-referrer",
      "X-Frame-Options": "DENY",
      "Set-Cookie": `${legacyCookieName}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${url.protocol === "https:" ? "; Secure" : ""}`,
    },
  });
}

async function createAccessCookie(request, password) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const signature = await signCookie(password, issuedAt);
  const isSecureRequest = new URL(request.url).protocol === "https:";
  return `${cookieName}=${issuedAt}.${signature}; Path=/; HttpOnly; SameSite=Lax${isSecureRequest ? "; Secure" : ""}`;
}

async function hasValidAccessCookie(request, password) {
  const value = getCookie(request, cookieName);
  const [issuedAtRaw, signature] = value.split(".");
  const issuedAt = Number(issuedAtRaw);
  if (!issuedAt || !signature) return false;
  return safeEqual(signature, await signCookie(password, issuedAt));
}

async function signCookie(password, issuedAt) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`mapkai-course-access:${issuedAt}`));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getCookie(request, name) {
  return (request.headers.get("Cookie") || "")
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.slice(name.length + 1) || "";
}

function safeReturnTo(value) {
  const route = String(value || "");
  return isProtectedCoursePath(route) && !route.startsWith("//") ? route : coursePrefix;
}

function safeEqual(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}
