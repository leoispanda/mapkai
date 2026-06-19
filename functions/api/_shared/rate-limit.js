export function getClientIp(request) {
  const forwarded = request.headers.get("CF-Connecting-IP")
    || request.headers.get("X-Forwarded-For")
    || "";
  return String(forwarded).split(",")[0].trim() || "unknown";
}

export async function checkRateLimit(database, key, { limit, windowSeconds }) {
  if (!database || !key || !limit || !windowSeconds) return { ok: true, skipped: true };
  await database.prepare(
    `CREATE TABLE IF NOT EXISTS rate_limits (
      rate_key TEXT PRIMARY KEY,
      count INTEGER NOT NULL,
      reset_at INTEGER NOT NULL
    )`,
  ).run();
  await database.prepare(
    `CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at ON rate_limits(reset_at)`,
  ).run();

  const now = Math.floor(Date.now() / 1000);
  const resetAt = now + windowSeconds;
  const safeKey = String(key).slice(0, 180);
  const row = await database.prepare(
    `INSERT INTO rate_limits (rate_key, count, reset_at)
     VALUES (?, 1, ?)
     ON CONFLICT(rate_key) DO UPDATE SET
       count = CASE
         WHEN rate_limits.reset_at <= ? THEN 1
         ELSE rate_limits.count + 1
       END,
       reset_at = CASE
         WHEN rate_limits.reset_at <= ? THEN excluded.reset_at
         ELSE rate_limits.reset_at
       END
     RETURNING count, reset_at`,
  ).bind(safeKey, resetAt, now, now).first();
  const count = Number(row?.count || 1);
  const activeResetAt = Number(row?.reset_at || resetAt);
  if (count > limit) {
    return { ok: false, retryAfter: Math.max(1, activeResetAt - now) };
  }
  return { ok: true, remaining: Math.max(0, limit - count) };
}
