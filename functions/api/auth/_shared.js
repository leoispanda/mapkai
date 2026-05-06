const cookieName = "mapkai_login_challenge";
const encoder = new TextEncoder();

export function createCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function normalizeEmail(email) {
  const value = String(email || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : "";
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}

export function requireEmailConfig(env) {
  return Boolean(env.RESEND_API_KEY && env.AUTH_SECRET);
}

export async function sendLoginEmail(env, email, code) {
  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM || "MapKAI <onboarding@resend.dev>",
      to: email,
      subject: "Your MapKAI login code",
      text: `Your MapKAI login code is ${code}. It expires in 10 minutes.`,
      html: `<p>Your MapKAI login code is:</p><h1>${code}</h1><p>It expires in 10 minutes.</p>`,
    }),
  });

  if (!result.ok) {
    throw new Error(await result.text());
  }
}

export async function createChallengeCookie(env, email, code) {
  const expiresAt = Date.now() + 10 * 60 * 1000;
  const payload = base64UrlEncode(JSON.stringify({ email, code, expiresAt }));
  const signature = await sign(env.AUTH_SECRET, payload);
  return `${cookieName}=${payload}.${signature}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`;
}

export async function readChallenge(env, request) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`${cookieName}=([^;]+)`));
  if (!match) return null;

  const [payload, signature] = match[1].split(".");
  if (!payload || !signature) return null;

  const expected = await sign(env.AUTH_SECRET, payload);
  if (!safeEqual(signature, expected)) return null;

  try {
    return JSON.parse(base64UrlDecode(payload));
  } catch {
    return null;
  }
}

export function clearChallengeCookie() {
  return `${cookieName}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

async function sign(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return arrayBufferToBase64Url(signature);
}

function safeEqual(left, right) {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}

function base64UrlEncode(value) {
  return btoa(value).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlDecode(value) {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
  return atob(padded.replaceAll("-", "+").replaceAll("_", "/"));
}

function arrayBufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}
