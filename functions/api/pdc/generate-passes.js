import { createPassCode, ensurePdcTables, getIsoNow, getWeeklyBatchId, hasFounderApiAccess, json } from "./_shared.js";

export async function onRequest({ request, env }) {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405);
  if (!(await hasFounderApiAccess(request, env))) return json({ ok: false, error: "Founder mode required." }, 403);
  if (!env.MAPKAI_DB) return json({ ok: false, error: "PDC database is not configured." }, 500);

  await ensurePdcTables(env.MAPKAI_DB);
  const body = await request.json().catch(() => ({}));
  const count = Math.min(Math.max(Number(body.count) || 20, 1), 20);
  const batchId = String(body.batch_id || getWeeklyBatchId()).trim().slice(0, 32);
  const now = getIsoNow();
  const passes = [];

  for (let index = 0; index < count; index += 1) {
    let passCode = createPassCode();
    let inserted = false;
    for (let attempt = 0; attempt < 5 && !inserted; attempt += 1) {
      try {
        await env.MAPKAI_DB.prepare(
          `INSERT INTO pdc_access_passes
            (pass_code, batch_id, status, allowed_uses, used_count, pdc_type, allowed_modes, created_at)
           VALUES (?, ?, 'unused', 1, 0, 'both', 'personal,company', ?)`,
        ).bind(passCode, batchId, now).run();
        inserted = true;
      } catch {
        passCode = createPassCode();
      }
    }
    if (inserted) passes.push({ pass_code: passCode, batch_id: batchId, status: "unused", pdc_type: "both", created_at: now });
  }

  return json({ ok: true, batch_id: batchId, passes });
}
