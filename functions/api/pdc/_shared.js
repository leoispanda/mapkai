export const INVALID_PDC_LINK_MESSAGE = "This PDC access link is no longer available. It may have already been used or expired.";

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

export function isFounderRequest(request) {
  return request.headers.get("X-MapKAI-Founder") === "true";
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
