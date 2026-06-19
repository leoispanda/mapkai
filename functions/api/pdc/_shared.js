export const INVALID_PDC_LINK_MESSAGE = "This PDC access link is no longer available. It may have already been used or expired.";
const founderCookieName = "mapkai_pdc_founder";
const pdcSessionCookieName = "mapkai_pdc_session";
const encoder = new TextEncoder();

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

export function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

export function isFounderRequest(request) {
  return request.headers.get("X-MapKAI-Founder") === "true";
}

export async function hasFounderApiAccess(request, env) {
  if (!isFounderRequest(request)) return false;
  if (!getFounderAccessCode(env)) return false;
  return hasValidFounderAccessCookie(request, env);
}

export function getFounderAccessCode(env) {
  return String(env?.MAPKAI_FOUNDER_ACCESS_CODE || "").trim();
}

export function isFounderAccessCode(env, passCode) {
  const founderCode = getFounderAccessCode(env);
  return Boolean(founderCode && passCode && safeEqualString(passCode, founderCode));
}

export async function createFounderAccessCookie(env, request) {
  const founderCode = getFounderAccessCode(env);
  if (!founderCode) return "";
  const issuedAt = Math.floor(Date.now() / 1000);
  const signature = await signFounderAccessCookie(founderCode, issuedAt);
  const isSecureRequest = request ? new URL(request.url).protocol === "https:" : true;
  return `${founderCookieName}=${issuedAt}.${signature}; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax${isSecureRequest ? "; Secure" : ""}`;
}

export async function hasValidFounderAccessCookie(request, env) {
  const founderCode = getFounderAccessCode(env);
  if (!founderCode) return false;
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookieValue = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${founderCookieName}=`))
    ?.split("=")[1] || "";
  const [issuedAtRaw, signature] = cookieValue.split(".");
  const issuedAt = Number(issuedAtRaw);
  if (!issuedAt || !signature) return false;
  const maxAgeSeconds = 30 * 24 * 60 * 60;
  if (issuedAt < Math.floor(Date.now() / 1000) - maxAgeSeconds) return false;
  const expected = await signFounderAccessCookie(founderCode, issuedAt);
  return safeEqualString(signature, expected);
}

async function signFounderAccessCookie(secret, issuedAt) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`mapkai-pdc-founder:${issuedAt}`));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function createPdcSessionCookie(env, request, passCode) {
  const sessionSecret = getPdcSessionSecret(env);
  if (!sessionSecret) return "";
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + 4 * 60 * 60;
  const payload = base64UrlEncode(JSON.stringify({ passCode, issuedAt, expiresAt }));
  const signature = await signValue(sessionSecret, payload);
  const isSecureRequest = request ? new URL(request.url).protocol === "https:" : true;
  return `${pdcSessionCookieName}=${payload}.${signature}; Path=/api/pdc; Max-Age=${4 * 60 * 60}; HttpOnly; SameSite=Lax${isSecureRequest ? "; Secure" : ""}`;
}

export function clearPdcSessionCookie(request) {
  const isSecureRequest = request ? new URL(request.url).protocol === "https:" : true;
  return `${pdcSessionCookieName}=; Path=/api/pdc; Max-Age=0; HttpOnly; SameSite=Lax${isSecureRequest ? "; Secure" : ""}`;
}

export async function readPdcSessionPassCode(env, request) {
  const sessionSecret = getPdcSessionSecret(env);
  if (!sessionSecret) return "";
  const cookieValue = getCookieValue(request, pdcSessionCookieName);
  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) return "";
  const expected = await signValue(sessionSecret, payload);
  if (!safeEqualString(signature, expected)) return "";
  try {
    const session = JSON.parse(base64UrlDecode(payload));
    if (!session?.passCode || Number(session.expiresAt || 0) < Math.floor(Date.now() / 1000)) return "";
    return cleanText(session.passCode, 80);
  } catch {
    return "";
  }
}

export async function resolvePdcSessionPassCode({ env, request, suppliedPassCode = "", requireSession = false }) {
  const sessionPassCode = await readPdcSessionPassCode(env, request);
  const cleanSuppliedPassCode = cleanText(suppliedPassCode, 80);
  if (requireSession && !sessionPassCode) return { ok: false, passCode: "", error: INVALID_PDC_LINK_MESSAGE };
  if (sessionPassCode && cleanSuppliedPassCode && sessionPassCode !== cleanSuppliedPassCode) {
    return { ok: false, passCode: "", error: INVALID_PDC_LINK_MESSAGE };
  }
  const passCode = sessionPassCode || cleanSuppliedPassCode;
  return passCode ? { ok: true, passCode, error: "" } : { ok: false, passCode: "", error: INVALID_PDC_LINK_MESSAGE };
}

function getPdcSessionSecret(env) {
  return String(env?.MAPKAI_PDC_SESSION_SECRET || env?.AUTH_SECRET || "").trim();
}

function getCookieValue(request, name) {
  const cookieHeader = request.headers.get("Cookie") || "";
  return cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.slice(name.length + 1) || "";
}

async function signValue(secret, value) {
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

function safeEqualString(left, right) {
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

export function getIsoNow() {
  return new Date().toISOString();
}

export function getWeeklyBatchId(date = new Date()) {
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNumber = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((utcDate - yearStart) / 86400000 + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

export async function ensurePdcTables(database) {
  await database.prepare(
    `CREATE TABLE IF NOT EXISTS pdc_access_passes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pass_code TEXT UNIQUE NOT NULL,
      batch_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'unused',
      allowed_uses INTEGER NOT NULL DEFAULT 1,
      used_count INTEGER NOT NULL DEFAULT 0,
      pdc_type TEXT NOT NULL DEFAULT 'both',
      mode_id TEXT,
      template_id TEXT,
      roster_id TEXT,
      persona_ids TEXT,
      allowed_modes TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      expires_at TEXT,
      started_at TEXT,
      used_at TEXT,
      last_error TEXT,
      input_char_count INTEGER
    )`,
  ).run();

  await database.prepare(
    `CREATE TABLE IF NOT EXISTS pdc_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pass_code TEXT NOT NULL,
      pdc_type TEXT,
      mode_id TEXT,
      clarity_rating TEXT,
      most_useful_part TEXT,
      would_use_again TEXT,
      short_feedback TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
  ).run();
}

export function createPassCode() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(36).padStart(2, "0")).join("").slice(0, 18).toUpperCase();
}

export function isPassUsable(pass) {
  if (!pass) return false;
  if (pass.status !== "unused") return false;
  if (pass.used_count >= pass.allowed_uses) return false;
  if (pass.expires_at && new Date(pass.expires_at).getTime() < Date.now()) return false;
  return true;
}

export async function getPass(database, passCode) {
  const result = await database.prepare(
    `SELECT pass_code, batch_id, status, allowed_uses, used_count, pdc_type, mode_id,
      template_id, roster_id, persona_ids, allowed_modes, notes, created_at, expires_at,
      started_at, used_at, last_error, input_char_count
     FROM pdc_access_passes
     WHERE pass_code = ?`,
  ).bind(passCode).first();
  return result || null;
}
