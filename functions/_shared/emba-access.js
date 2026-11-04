const cookieName = "mapkai_emba_session";
const sessionSeconds = 60 * 60 * 12;
const encoder = new TextEncoder();

function toBase64Url(bytes) {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function signatureFor(expiry, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`mapkai-emba:${expiry}`));
  return toBase64Url(signature);
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

export async function createEmbaSessionCookie(env, request, now = Date.now()) {
  const secret = typeof env?.EMBA_PASSWORD === "string" ? env.EMBA_PASSWORD : "";
  if (!secret) return "";
  const expiry = Math.floor(now / 1000) + sessionSeconds;
  const signature = await signatureFor(expiry, secret);
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${cookieName}=${expiry}.${signature}; Path=/emba; HttpOnly; SameSite=Strict; Max-Age=${sessionSeconds}${secure}`;
}

export async function hasEmbaAccess(request, env, now = Date.now()) {
  const secret = typeof env?.EMBA_PASSWORD === "string" ? env.EMBA_PASSWORD : "";
  if (!secret) return false;
  const rawCookie = typeof request?.headers?.get === "function"
    ? request.headers.get("Cookie") || ""
    : request?.headers?.cookie || "";
  if (!rawCookie || rawCookie.length > 16384) return false;
  const matches = rawCookie.split(";").map((part) => part.trim()).filter((part) => part.startsWith(`${cookieName}=`));
  if (matches.length !== 1) return false;
  const value = matches[0].slice(cookieName.length + 1);
  const separator = value.indexOf(".");
  if (separator < 1) return false;
  const expiry = value.slice(0, separator);
  const providedSignature = value.slice(separator + 1);
  const expirySeconds = Number(expiry);
  const nowSeconds = Math.floor(now / 1000);
  if (!Number.isSafeInteger(expirySeconds) || expirySeconds <= nowSeconds || expirySeconds > nowSeconds + sessionSeconds + 60) return false;
  return constantTimeEqual(providedSignature, await signatureFor(expiry, secret));
}

export function embaLoginHtml(request, { incorrect = false, configured = true } = {}) {
  const chinese = /\bzh\b/i.test(request?.headers?.get?.("Accept-Language") || "");
  const title = chinese ? "MapKAI EMBA" : "MapKAI EMBA";
  const subtitle = chinese ? "FD Context + StoryFlow" : "FD Context + StoryFlow";
  const label = chinese ? "访问密码" : "Access password";
  const button = chinese ? "进入 EMBA" : "Enter EMBA";
  const error = !configured
    ? (chinese ? "EMBA 密码尚未配置。" : "EMBA password access is not configured yet.")
    : incorrect
      ? (chinese ? "密码不正确，请重试。" : "That password did not match. Try again.")
      : (chinese ? "请输入密码以查看栏目内容。" : "Enter the password to view this section.");
  const buttonMarkup = configured
    ? `<button type="submit">${button}</button>`
    : `<button type="submit" disabled>${button}</button>`;
  return `<!doctype html>
<html lang="${chinese ? "zh" : "en"}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>${title} — ${subtitle}</title>
  <style>
    :root{color-scheme:light;--ink:#20221f;--muted:#686961;--paper:#f4f0e7;--surface:#fffaf1;--line:#ccc5b8;--orange:#b23e18}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:var(--paper);color:var(--ink);font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    main{width:min(460px,100%);padding:clamp(28px,7vw,52px);background:var(--surface);border:1px solid var(--line)}.brand{display:block;margin-bottom:40px;color:var(--ink);font-size:13px;font-weight:700;letter-spacing:.15em;text-decoration:none}
    .eyebrow{margin:0 0 12px;color:var(--orange);font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}h1{margin:0;font:500 clamp(38px,8vw,54px)/.98 Georgia,"Times New Roman",serif;letter-spacing:-.04em}p{color:var(--muted)}form{display:grid;gap:12px;margin-top:28px}label{font-size:13px;font-weight:650}input{width:100%;min-height:46px;margin-top:7px;padding:10px 12px;border:1px solid var(--line);border-radius:0;background:white;color:var(--ink);font:inherit}button{min-height:46px;border:0;border-radius:0;background:var(--ink);color:white;font:inherit;font-weight:700;cursor:pointer}button:disabled{opacity:.55;cursor:not-allowed}.message{min-height:24px;margin:10px 0 0;color:var(--orange);font-size:13px}
    :focus-visible{outline:3px solid #e35f2d;outline-offset:3px}
  </style>
</head>
<body>
  <main>
    <a class="brand" href="/">MAPKAI</a>
    <p class="eyebrow">EMBA · PRIVATE SECTION</p>
    <h1>${subtitle}</h1>
    <p>${chinese ? "使用密码进入 EMBA 栏目。" : "A password is required to enter the EMBA section."}</p>
    <form method="post" action="/api/emba/auth">
      <label for="password">${label}<input id="password" name="password" type="password" autocomplete="current-password" required autofocus></label>
      ${buttonMarkup}
    </form>
    <p class="message" role="status">${error}</p>
  </main>
</body>
</html>`;
}
