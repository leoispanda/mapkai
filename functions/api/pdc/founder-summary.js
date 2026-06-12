import { ensurePdcTables, getWeeklyBatchId, hasFounderApiAccess, json } from "./_shared.js";

export async function onRequest({ request, env }) {
  if (request.method !== "GET") return json({ ok: false, error: "Method not allowed." }, 405);
  if (!(await hasFounderApiAccess(request, env))) return json({ ok: false, error: "Founder mode required." }, 403);
  if (!env.MAPKAI_DB) return json({ ok: false, error: "PDC database is not configured." }, 500);

  await ensurePdcTables(env.MAPKAI_DB);
  const url = new URL(request.url);
  const batchId = String(url.searchParams.get("batch_id") || getWeeklyBatchId()).trim().slice(0, 32);

  const passesResult = await env.MAPKAI_DB.prepare(
    `SELECT pass_code, status, created_at, used_at, pdc_type, mode_id, batch_id
     FROM pdc_access_passes
     WHERE batch_id = ?
     ORDER BY created_at DESC, id DESC
     LIMIT 200`,
  ).bind(batchId).all();

  const usageResult = await env.MAPKAI_DB.prepare(
    `SELECT status, COUNT(*) AS count
     FROM pdc_access_passes
     WHERE batch_id = ?
     GROUP BY status`,
  ).bind(batchId).all();

  const clarityResult = await env.MAPKAI_DB.prepare(
    `SELECT clarity_rating AS value, COUNT(*) AS count
     FROM pdc_feedback
     WHERE clarity_rating IS NOT NULL AND clarity_rating != ''
     GROUP BY clarity_rating`,
  ).all();
  const usefulResult = await env.MAPKAI_DB.prepare(
    `SELECT most_useful_part AS value, COUNT(*) AS count
     FROM pdc_feedback
     WHERE most_useful_part IS NOT NULL AND most_useful_part != ''
     GROUP BY most_useful_part`,
  ).all();
  const againResult = await env.MAPKAI_DB.prepare(
    `SELECT would_use_again AS value, COUNT(*) AS count
     FROM pdc_feedback
     WHERE would_use_again IS NOT NULL AND would_use_again != ''
     GROUP BY would_use_again`,
  ).all();
  const recentFeedbackResult = await env.MAPKAI_DB.prepare(
    `SELECT pdc_type, clarity_rating, most_useful_part, would_use_again, short_feedback, created_at
     FROM pdc_feedback
     WHERE short_feedback IS NOT NULL AND short_feedback != ''
     ORDER BY created_at DESC, id DESC
     LIMIT 12`,
  ).all();

  const usage = { total: 0, unused: 0, in_progress: 0, used: 0, expired: 0 };
  (usageResult.results || []).forEach((row) => {
    usage[row.status] = Number(row.count) || 0;
    usage.total += Number(row.count) || 0;
  });

  return json({
    ok: true,
    batch_id: batchId,
    passes: passesResult.results || [],
    usage,
    feedback: {
      clarity_rating: clarityResult.results || [],
      most_useful_part: usefulResult.results || [],
      would_use_again: againResult.results || [],
      recent_short_feedback: recentFeedbackResult.results || [],
    },
  });
}
