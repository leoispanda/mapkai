import { checkRateLimit, getClientIp } from "./api/_shared/rate-limit.js";

// EMBA is the programme; Corporate Finance is what sits inside it. So there is
// one door, on EMBA, and unlocking it opens everything within. This is a filter,
// not a vault -- the lesson text still ships in the public bundle.
const areas = [
  {
    id: "emba",
    name: "EMBA learning",
    prefixes: [
      "/learning/emba",
      "/learning/corporate-finance",
      "/zh/learning/corporate-finance",
    ],
    secretKey: "EMBA_ACCESS_PASSWORD",
    // keeps working on the secret that is already configured
    fallbackSecretKey: "COURSE_ACCESS_PASSWORD",
    cookieName: "mapkai_course_session",
  },
];
const legacyCookieName = "mapkai_course_access";
const encoder = new TextEncoder();
// A signed cookie with no expiry stays valid for as long as the password does.
const sessionSeconds = 60 * 60 * 24 * 30;
// Generous for a person typing a password they were given; hostile to a script.
const unlockAttemptLimit = 10;
const unlockWindowSeconds = 60 * 15;

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const area = areaFor(url.pathname);
  if (!area) return context.next();

  const password = secretFor(context.env, area);
  if (!password) {
    return new Response("Course access is not configured.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  if (url.pathname === unlockPathFor(area)) {
    return handleUnlock(context, url, area, password);
  }

  if (await hasValidAccessCookie(context.request, area, password)) return context.next();
  return passwordPage(url, area);
}

function areaFor(pathname) {
  return areas.find((entry) => entry.prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )) || null;
}

function secretFor(env, area) {
  const primary = String(env[area.secretKey] || "").trim();
  if (primary) return primary;
  return area.fallbackSecretKey ? String(env[area.fallbackSecretKey] || "").trim() : "";
}

function unlockPathFor(area) {
  return `${area.prefixes[0]}/unlock`;
}

async function handleUnlock(context, url, area, password) {
  const request = context.request;
  const returnTo = safeReturnTo(url.searchParams.get("returnTo"), area);
  if (request.method !== "POST") return passwordPage(url, area);

  // One shared password with unlimited guesses is a password in name only.
  const attempts = await checkRateLimit(context.env.MAPKAI_DB, `course-unlock:${area.id}:${getClientIp(request)}`, {
    limit: unlockAttemptLimit,
    windowSeconds: unlockWindowSeconds,
  });
  if (!attempts.ok) {
    return passwordPage(url, area, false, {
      status: 429,
      retryAfter: attempts.retryAfter,
      notice: "Too many attempts. Please wait a few minutes and try again.",
    });
  }

  const form = await request.formData().catch(() => null);
  const submittedPassword = String(form?.get("password") || "");
  if (!(await secretsMatch(submittedPassword, password))) return passwordPage(url, area, true);

  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL(returnTo, url.origin).toString(),
      "Cache-Control": "no-store",
      "Set-Cookie": await createAccessCookie(request, area, password),
    },
  });
}

function passwordPage(url, area, isInvalid = false, options = {}) {
  const returnTo = safeReturnTo(url.searchParams.get("returnTo") || `${url.pathname}${url.search}`, area);
  const action = `${unlockPathFor(area)}?returnTo=${encodeURIComponent(returnTo)}`;
  const message = options.notice
    || (isInvalid ? "That password is not correct. Please try again." : "");
  const error = message ? `<p class="error">${escapeHtml(message)}</p>` : "";
  const courseName = area.name;
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
      <h1>${escapeHtml(courseName)}</h1>
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
    status: options.status || (isInvalid ? 401 : 200),
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      ...(options.retryAfter ? { "Retry-After": String(options.retryAfter) } : {}),
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'",
      "Referrer-Policy": "no-referrer",
      "X-Frame-Options": "DENY",
      "Set-Cookie": `${legacyCookieName}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${url.protocol === "https:" ? "; Secure" : ""}`,
    },
  });
}

async function createAccessCookie(request, area, password) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const signature = await signCookie(area, password, issuedAt);
  const isSecureRequest = new URL(request.url).protocol === "https:";
  return `${area.cookieName}=${issuedAt}.${signature}; Path=/; Max-Age=${sessionSeconds}; HttpOnly; SameSite=Lax${isSecureRequest ? "; Secure" : ""}`;
}

async function hasValidAccessCookie(request, area, password) {
  const value = getCookie(request, area.cookieName);
  const [issuedAtRaw, signature] = value.split(".");
  const issuedAt = Number(issuedAtRaw);
  if (!issuedAt || !signature) return false;
  // The client controls its own cookie, so the age is checked here as well.
  const age = Math.floor(Date.now() / 1000) - issuedAt;
  if (age < 0 || age > sessionSeconds) return false;
  return safeEqual(signature, await signCookie(area, password, issuedAt));
}

async function signCookie(area, password, issuedAt) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`mapkai-course-access:${area.id}:${issuedAt}`));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getCookie(request, name) {
  return (request.headers.get("Cookie") || "")
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.slice(name.length + 1) || "";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]
  ));
}

function safeReturnTo(value, area) {
  const route = String(value || "");
  const withinArea = area.prefixes.some(
    (prefix) => route === prefix || route.startsWith(`${prefix}/`),
  );
  return withinArea && !route.startsWith("//") ? route : area.prefixes[0];
}

// Compare digests, not the secrets themselves: the length check below would
// otherwise reveal how long the real password is.
async function secretsMatch(left, right) {
  const [a, b] = await Promise.all([digestHex(left), digestHex(right)]);
  return safeEqual(a, b);
}

async function digestHex(value) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(String(value)));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}
