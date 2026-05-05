import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

const emailFrom = process.env.EMAIL_FROM || "MapKai <onboarding@resend.dev>";
const resendApiKey = process.env.RESEND_API_KEY || "";
const authSecret = process.env.AUTH_SECRET || "";
const cookieName = "mapkai_login_challenge";

export function createCode() {
  return String(randomInt(100000, 1000000));
}

export function normalizeEmail(email) {
  const value = String(email || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : "";
}

export function sendJson(response, status, data, headers = {}) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    ...headers,
  });
  response.end(JSON.stringify(data));
}

export function requireEmailConfig(response) {
  if (resendApiKey && authSecret) return true;
  sendJson(response, 500, {
    error: "Email login is not configured yet. Set RESEND_API_KEY, EMAIL_FROM, and AUTH_SECRET in Vercel.",
  });
  return false;
}

export async function sendLoginEmail(email, code) {
  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: emailFrom,
      to: email,
      subject: "Your MapKai login code",
      text: `Your MapKai login code is ${code}. It expires in 10 minutes.`,
      html: `<p>Your MapKai login code is:</p><h1>${code}</h1><p>It expires in 10 minutes.</p>`,
    }),
  });

  if (!result.ok) {
    throw new Error(await result.text());
  }
}

export function createChallengeCookie(email, code) {
  const expiresAt = Date.now() + 10 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ email, code, expiresAt })).toString("base64url");
  const signature = sign(payload);
  return `${cookieName}=${payload}.${signature}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`;
}

export function readChallenge(request) {
  const cookie = request.headers.cookie || "";
  const match = cookie.match(new RegExp(`${cookieName}=([^;]+)`));
  if (!match) return null;

  const [payload, signature] = match[1].split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function clearChallengeCookie() {
  return `${cookieName}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}

function sign(value) {
  return createHmac("sha256", authSecret).update(value).digest("base64url");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
