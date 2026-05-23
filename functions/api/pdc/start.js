import { cleanText, ensurePdcTables, getIsoNow, getPass, INVALID_PDC_LINK_MESSAGE, isFounderRequest, isPassUsable, json } from "./_shared.js";
import { generatePdcCouncilRecap, generatePdcDialogue, generatePdcFinalRecap, pdcModes, resolveSessionRoster, toCouncilRoomPersona } from "./pdc-service.js";

export async function onRequest({ request, env }) {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405);

  const body = await request.json().catch(() => ({}));
  const passCode = cleanText(body.pass, 80);
  const modeId = ["personal", "company"].includes(body.mode_id) ? body.mode_id : "";
  const userQuestion = cleanText(body.user_question, 1200);
  const isFounderPreview = body.founder_preview === true && isFounderRequest(request);
  const isContinuePhase = body.continue_phase === true;
  const isFinalRecap = body.final_recap === true;

  if (!modeId || !pdcModes[modeId]) return json({ ok: false, message: "Choose a PDC type before starting." }, 400);
  if (userQuestion.length < 8) return json({ ok: false, message: "Please enter a decision question before starting." }, 400);
  if (userQuestion.length > 1200) return json({ ok: false, message: "Please keep the decision question under 1200 characters." }, 400);

  if (isContinuePhase) {
    return handleContinuePhase({ request, env, body, passCode, modeId, userQuestion, isFounderPreview });
  }
  if (isFinalRecap) {
    return handleFinalRecap({ request, env, body, passCode, modeId, userQuestion, isFounderPreview });
  }

  if (isFounderPreview) {
    try {
      const isPlaceholder = !env.OPENAI_API_KEY;
      const sessionRoster = resolveSessionRoster({ modeId, sessionRoster: null });
      const recap = await generatePdcCouncilRecap({ modeId, sessionRoster, userQuestion, isPlaceholder, includeContentDiagnostics: isFounderPreview, env });
      return json({ ok: true, founder_preview: true, recap });
    } catch {
      return json({ ok: false, message: "The PDC experience could not be generated. Please try again later." }, 500);
    }
  }

  if (!env.MAPKAI_DB) return json({ ok: false, message: "PDC is temporarily unavailable. Please try again later." }, 500);
  if (!passCode) return json({ ok: false, message: INVALID_PDC_LINK_MESSAGE }, 400);

  await ensurePdcTables(env.MAPKAI_DB);

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
    const recap = await generatePdcCouncilRecap({ modeId, sessionRoster, userQuestion, isPlaceholder, includeContentDiagnostics: isFounderPreview, env });
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

async function handleFinalRecap({ request, env, body, passCode, modeId, userQuestion, isFounderPreview }) {
  if (!isFounderPreview) {
    if (!env.MAPKAI_DB) return json({ ok: false, message: "PDC is temporarily unavailable. Please try again later." }, 500);
    if (!passCode) return json({ ok: false, message: INVALID_PDC_LINK_MESSAGE }, 400);
    await ensurePdcTables(env.MAPKAI_DB);
    const pass = await getPass(env.MAPKAI_DB, passCode);
    if (!pass || !["used", "in_progress"].includes(pass.status)) return json({ ok: false, message: INVALID_PDC_LINK_MESSAGE }, 403);
  }
  const activeRoster = resolveRosterByIds(modeId, body.active_roster_ids);
  const observerRoster = resolveRosterByIds(modeId, body.observer_roster_ids);
  const mode = pdcModes[modeId];
  const result = await generatePdcFinalRecap({
    modeId,
    modeLabel: mode.label,
    userQuestion,
    activeRoster,
    observerRoster,
    latestPhase: sanitizeObject(body.latest_phase, 5000),
    meetingMemory: sanitizeMeetingMemory(body.meeting_memory),
    voteSummary: sanitizeObject(body.vote_summary, 2500),
    userInterventions: Array.isArray(body.user_interventions) ? body.user_interventions.map((item) => cleanText(item, 300)).filter(Boolean).slice(-8) : [],
    provider: String(env.PDC_DIALOGUE_PROVIDER || "placeholder").trim().toLowerCase(),
    env,
  });
  return json({ ok: true, ...result });
}

async function handleContinuePhase({ request, env, body, passCode, modeId, userQuestion, isFounderPreview }) {
  const roundNumber = Number(body.round_number) > 0 ? Math.min(Number(body.round_number), 99) : 1;
  const phaseType = String(body.phase_type || "A").toUpperCase() === "B" ? "B" : "A";
  const previousSummary = cleanText(body.previous_summary, 1200);
  const userIntervention = cleanText(body.user_intervention, 500);
  const meetingMemory = sanitizeMeetingMemory(body.meeting_memory);

  if (!isFounderPreview) {
    if (!env.MAPKAI_DB) return json({ ok: false, message: "PDC is temporarily unavailable. Please try again later." }, 500);
    if (!passCode) return json({ ok: false, message: INVALID_PDC_LINK_MESSAGE }, 400);
    await ensurePdcTables(env.MAPKAI_DB);
    const pass = await getPass(env.MAPKAI_DB, passCode);
    if (!pass || !["used", "in_progress"].includes(pass.status)) return json({ ok: false, message: INVALID_PDC_LINK_MESSAGE }, 403);
  }

  try {
    const mode = pdcModes[modeId];
    const roster = resolveRosterByIds(modeId, body.active_roster_ids);
    const result = await generatePdcDialogue({
      modeId,
      modeLabel: mode.label,
      sessionRoster: roster,
      userQuestion,
      provider: String(env.PDC_DIALOGUE_PROVIDER || "placeholder").trim().toLowerCase(),
      roundNumber,
      phaseType,
      previousSummary,
      meetingMemory,
      userIntervention,
      env,
    });
    const phase = Array.isArray(result.rounds) && result.rounds.length ? result.rounds[0] : null;
    if (!phase) throw new Error("No PDC phase returned");
    return json({
      ok: true,
      phase,
      provider: result.provider,
      requestedProvider: result.requestedProvider,
      actualProvider: result.actualProvider || result.provider,
      fallbackUsed: result.fallbackUsed === true,
      fallbackReason: result.fallbackReason || "",
      providerErrorShort: result.providerErrorShort || "",
      jsonParseFailed: result.jsonParseFailed === true,
      modelName: result.modelName || "",
      schemaName: result.schemaName || "",
      strict: result.strict === true,
      ...(isFounderPreview ? { contentDiagnostics: result.contentDiagnostics || null } : {}),
    });
  } catch (error) {
    console.error("PDC continue phase failed:", error);
    return json({ ok: false, message: "The next PDC phase could not be generated. Please try again." }, 500);
  }
}

function resolveRosterByIds(modeId, ids) {
  const all = resolveSessionRoster({ modeId, sessionRoster: null }).map((persona) => toCouncilRoomPersona(persona, modeId));
  if (!Array.isArray(ids) || !ids.length) return all;
  const allowed = new Set(ids.map((id) => cleanText(id, 80)));
  return all.filter((persona) => allowed.has(persona.id));
}

function sanitizeObject(value, maxLength) {
  if (!value || typeof value !== "object") return null;
  try {
    return JSON.parse(JSON.stringify(value).slice(0, maxLength));
  } catch {
    return null;
  }
}

function sanitizeMeetingMemory(value) {
  if (!value || typeof value !== "object") return null;
  return {
    compactSummary: cleanText(value.compactSummary, 500),
    activeTensions: sanitizeList(value.activeTensions),
    strongestViews: sanitizeList(value.strongestViews),
    openQuestions: sanitizeList(value.openQuestions),
    convergenceSignals: sanitizeList(value.convergenceSignals),
    compactMemory: value.compactMemory && typeof value.compactMemory === "object"
      ? {
          mainTension: cleanText(value.compactMemory.mainTension, 200),
          strongestDisagreement: cleanText(value.compactMemory.strongestDisagreement, 200),
          whatChangedThisPhase: cleanText(value.compactMemory.whatChangedThisPhase, 200),
          whatNextPhaseShouldExamine: cleanText(value.compactMemory.whatNextPhaseShouldExamine, 200),
        }
      : null,
  };
}

function sanitizeList(value) {
  return Array.isArray(value) ? value.map((item) => cleanText(item, 160)).filter(Boolean).slice(0, 6) : [];
}
