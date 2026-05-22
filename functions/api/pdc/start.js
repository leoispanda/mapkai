import { cleanText, ensurePdcTables, getIsoNow, getPass, INVALID_PDC_LINK_MESSAGE, isPassUsable, json } from "./_shared.js";
import { generatePdcCouncilRecap, pdcModes, resolveSessionRoster } from "./pdc-service.js";

export async function onRequest({ request, env }) {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405);
  if (!env.MAPKAI_DB) return json({ ok: false, message: "PDC is temporarily unavailable. Please try again later." }, 500);

  await ensurePdcTables(env.MAPKAI_DB);
  const body = await request.json().catch(() => ({}));
  const passCode = cleanText(body.pass, 80);
  const modeId = ["personal", "company"].includes(body.mode_id) ? body.mode_id : "";
  const userQuestion = cleanText(body.user_question, 1200);

  if (!passCode) return json({ ok: false, message: INVALID_PDC_LINK_MESSAGE }, 400);
  if (!modeId || !pdcModes[modeId]) return json({ ok: false, message: "Choose a PDC type before starting." }, 400);
  if (userQuestion.length < 8) return json({ ok: false, message: "Please enter a decision question before starting." }, 400);
  if (userQuestion.length > 1200) return json({ ok: false, message: "Please keep the decision question under 1200 characters." }, 400);

  const pass = await getPass(env.MAPKAI_DB, passCode);
  if (!isPassUsable(pass)) return json({ ok: false, message: INVALID_PDC_LINK_MESSAGE }, 403);

  const allowedModes = pass.allowed_modes ? pass.allowed_modes.split(",").map((mode) => mode.trim()) : ["personal", "company"];
  if (pass.pdc_type !== "both" && pass.pdc_type !== modeId) {
    return json({ ok: false, message: "This access link is not enabled for the selected PDC type." }, 403);
  }
  if (!allowedModes.includes(modeId)) {
    return json({ ok: false, message: "This access link is not enabled for the selected PDC type." }, 403);
  }

  const now = getIsoNow();
  const claim = await env.MAPKAI_DB.prepare(
    `UPDATE pdc_access_passes
     SET status = 'in_progress', started_at = COALESCE(started_at, ?), mode_id = ?, input_char_count = ?, last_error = NULL
     WHERE pass_code = ?
       AND status = 'unused'
       AND used_count < allowed_uses
       AND (expires_at IS NULL OR expires_at > ?)`,
  ).bind(now, modeId, userQuestion.length, passCode, now).run();

  if (!claim.meta || claim.meta.changes < 1) {
    return json({ ok: false, message: INVALID_PDC_LINK_MESSAGE }, 403);
  }

  try {
    const isPlaceholder = !env.OPENAI_API_KEY;
    const sessionRoster = resolveSessionRoster({ modeId, sessionRoster: null });
    const recap = await generatePdcCouncilRecap({ modeId, sessionRoster, userQuestion, isPlaceholder });
    const usedAt = getIsoNow();
    await env.MAPKAI_DB.prepare(
      `UPDATE pdc_access_passes
       SET status = 'used', used_count = used_count + 1, used_at = ?, last_error = NULL
       WHERE pass_code = ?`,
    ).bind(usedAt, passCode).run();
    return json({ ok: true, recap });
  } catch (error) {
    await env.MAPKAI_DB.prepare(
      `UPDATE pdc_access_passes
       SET status = 'unused', last_error = ?
       WHERE pass_code = ? AND status = 'in_progress' AND used_count = 0`,
    ).bind(String(error.message || "PDC generation failed").slice(0, 500), passCode).run();
    return json({ ok: false, message: "The PDC experience could not be generated. Please try again later." }, 500);
  }
}
