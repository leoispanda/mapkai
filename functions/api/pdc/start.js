import { cleanText, json } from "./_shared.js";
import { generatePdcCouncilRecap, generatePdcDialogue, generatePdcFinalRecap, hasPdcProvider, pdcModes, resolveCouncilTier, resolveDialogueProvider, resolvePdcModels, resolveSessionRoster, toCouncilRoomPersona } from "./pdc-service.js";

const MAX_REQUEST_BYTES = 64 * 1024;

export async function onRequest({ request, env = {} }) {
  if (request.method !== "POST") return json({ ok: false, error: "METHOD_NOT_ALLOWED", message: "Use POST for PDC requests." }, 405, { Allow: "POST" });
  let body;
  try {
    body = await readRequestJson(request);
  } catch (error) {
    const inputErrors = {
      INVALID_CONTENT_TYPE: { status: 415, message: "Send PDC requests as JSON." },
      BODY_TOO_LARGE: { status: 413, message: "This PDC request is too large. Please shorten the discussion context." },
      INVALID_JSON: { status: 400, message: "Enter a valid PDC request." },
    };
    const code = Object.hasOwn(inputErrors, error?.code) ? error.code : "INVALID_JSON";
    return json({ ok: false, error: code, code, message: inputErrors[code].message }, inputErrors[code].status);
  }
  if (body.advanced_final_audit === true) return json({ ok: false, error: "AUDIT_UNAVAILABLE", code: "AUDIT_UNAVAILABLE", message: "This PDC operation is no longer available." }, 410);
  if (body.continue_phase === true && body.final_recap === true) return json({ ok: false, error: "INVALID_OPERATION", message: "Choose a discussion phase or a recap." }, 400);
  const modeId = body.mode_id || "personal";
  if (!["personal", "company"].includes(modeId) || !pdcModes[modeId]) return json({ ok: false, error: "INVALID_MODE", message: "Choose a PDC type before starting." }, 400);
  if (typeof body.user_question !== "string") return json({ ok: false, error: "INVALID_QUESTION", message: "Please enter a decision question before starting." }, 400);
  const userQuestion = body.user_question.trim();
  if (userQuestion.length < 8) return json({ ok: false, error: "INVALID_QUESTION", message: "Please enter a decision question before starting." }, 400);
  if (userQuestion.length > 1200) return json({ ok: false, error: "QUESTION_TOO_LONG", message: "Please keep the decision question under 1200 characters." }, 400);

  // Public PDC has one Gemini council. Legacy pass, founder and tier fields cannot select another service.
  const providerEnv = { ...env, PDC_DIALOGUE_PROVIDER: "gemini" };
  const phase = body.final_recap === true ? "final" : body.continue_phase === true ? "continue" : "start";
  try {
    requirePdcProvider(providerEnv);
    const tierInfo = resolveCouncilTier("standard");
    const modelInfo = resolvePdcModels("standard", providerEnv);
    const provider = resolveDialogueProvider(providerEnv);
    const metadata = { councilTier: "standard", requestedTier: "standard", effectiveTier: "standard", phaseModel: modelInfo.phaseModel, finalModel: modelInfo.finalModel, founderOnlyFullFunction: false };
    if (phase === "start") {
      const sessionRoster = resolveSessionRoster({ modeId, sessionRoster: null });
      const recap = await generatePdcCouncilRecap({ modeId, sessionRoster, userQuestion, isPlaceholder: false, includeContentDiagnostics: false, env: providerEnv, tierInfo });
      requireGeneratedResult(recap);
      return json({ ok: true, ...metadata, recap });
    }
    const activeRoster = resolveRosterByIds(modeId, body.active_roster_ids);
    if (!activeRoster.length) return json({ ok: false, error: "INVALID_ROSTER", code: "INVALID_ROSTER", message: "The active council members could not be found. Please restart the discussion." }, 400);
    const observerRoster = mergeObserverRosterContext(resolveRosterByIds(modeId, body.observer_roster_ids, { defaultAll: false }), body.observer_roster_context);
    if (phase === "final") {
      const result = await generatePdcFinalRecap({
        modeId, modeLabel: pdcModes[modeId].label, userQuestion, activeRoster, observerRoster,
        latestPhase: sanitizeLatestPhase(body.latest_phase), meetingMemory: sanitizeMeetingMemory(body.meeting_memory),
        voteSummary: sanitizeVoteSummary(body.vote_summary),
        userInterventions: Array.isArray(body.user_interventions) ? body.user_interventions.map(item => cleanText(item, 300)).filter(Boolean).slice(-8) : [],
        provider, env: providerEnv, tierInfo,
      });
      requireGeneratedResult(result);
      return json({ ok: true, ...metadata, ...result });
    }
    const suppliedRound = Number(body.round_number);
    const roundNumber = Number.isSafeInteger(suppliedRound) && suppliedRound > 0 ? suppliedRound : 1;
    const result = await generatePdcDialogue({
      modeId, modeLabel: pdcModes[modeId].label, sessionRoster: activeRoster, observerRoster, userQuestion,
      provider, roundNumber, phaseType: String(body.phase_type || "A").toUpperCase() === "B" ? "B" : "A",
      previousSummary: cleanText(body.previous_summary, 1200), meetingMemory: sanitizeMeetingMemory(body.meeting_memory),
      userIntervention: cleanText(body.user_intervention, 500), env: providerEnv, tierInfo,
    });
    requireGeneratedResult(result);
    const nextPhase = Array.isArray(result.rounds) && result.rounds.length ? result.rounds[0] : null;
    if (!nextPhase) throw Object.assign(new Error("No PDC phase returned."), { code: "MODEL_INVALID_RESPONSE", status: 502 });
    return json({
      ok: true, ...metadata, phase: nextPhase, provider: result.provider,
      requestedProvider: result.requestedProvider, actualProvider: result.actualProvider || result.provider,
      fallbackUsed: false, fallbackReason: "", providerErrorShort: "", jsonParseFailed: false,
      modelName: result.modelName || modelInfo.phaseModel, schemaName: result.schemaName || "", strict: result.strict === true,
    });
  } catch (error) {
    return generationErrorResponse(error, phase);
  }
}

async function readRequestJson(request) {
  if (!/^application\/json(?:;|$)/i.test(request.headers.get("Content-Type") || "")) throw inputError("INVALID_CONTENT_TYPE", "Send PDC requests as JSON.", 415);
  if (Number(request.headers.get("Content-Length")) > MAX_REQUEST_BYTES) {
    await request.body?.cancel().catch(() => {});
    throw inputError("BODY_TOO_LARGE", "This PDC request is too large. Please shorten the discussion context.", 413);
  }
  const chunks = [];
  let size = 0;
  if (request.body) {
    const reader = request.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_REQUEST_BYTES) {
          await reader.cancel().catch(() => {});
          throw inputError("BODY_TOO_LARGE", "This PDC request is too large. Please shorten the discussion context.", 413);
        }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  let body;
  try { body = JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw inputError("INVALID_JSON", "Enter a valid PDC request.", 400); }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw inputError("INVALID_JSON", "Enter a valid PDC request.", 400);
  return body;
}

function inputError(code, message, status) { return Object.assign(new Error(message), { code, status }); }

function requirePdcProvider(env) {
  if (hasPdcProvider(env)) return;
  throw Object.assign(new Error("PDC provider is not configured."), { code: "MODEL_NOT_CONFIGURED", status: 503 });
}

function requireGeneratedResult(result) {
  const actualProvider = result?.actualProvider || result?.dialogueProvider || result?.provider;
  if (!result || result.ok === false || result.fallbackUsed === true || actualProvider !== "gemini") {
    throw Object.assign(new Error("PDC generation did not return live output."), { code: "MODEL_INVALID_RESPONSE", status: 502 });
  }
}

function generationErrorCode(error) {
  const code = String(error?.code || "");
  return ["MODEL_NOT_CONFIGURED", "MODEL_TIMEOUT", "MODEL_RATE_LIMITED", "MODEL_UNAVAILABLE", "MODEL_INVALID_RESPONSE", "MODEL_BLOCKED"].includes(code) ? code : "MODEL_UNAVAILABLE";
}

function generationErrorResponse(error, phase) {
  const status = [422, 429, 502, 503, 504].includes(Number(error?.status)) ? Number(error.status) : 502;
  const code = generationErrorCode(error);
  const messages = {
    422: "The AI service could not process this question. Please revise it and try again.",
    429: "The AI service is busy. Please try again shortly.",
    503: "PDC is temporarily unavailable. Please try again later.",
  };
  const retryMessage = phase === "final"
    ? "The recap could not be generated. Please retry; your discussion is still available."
    : phase === "continue"
      ? "The next phase could not be generated. Please retry; your discussion is still available."
      : "PDC could not be generated. Please try again.";
  const timeoutMessage = phase === "start" ? "PDC took too long to respond. Please try again." : "PDC took too long to respond. Please retry; your discussion is still available.";
  const retryAfter = Number(error?.retryAfter);
  const extraHeaders = status === 429 && Number.isFinite(retryAfter) && retryAfter > 0 ? { "Retry-After": String(Math.min(Math.ceil(retryAfter), 3600)) } : {};
  const upstreamStatus = Number(error?.upstreamStatus);
  const safeProviderStatus = Number.isInteger(upstreamStatus) && upstreamStatus >= 100 && upstreamStatus <= 599 ? { providerStatus: upstreamStatus } : {};
  console.warn(JSON.stringify({ event: "pdc_generation_failed", phase, code, status, ...safeProviderStatus }));
  return json({ ok: false, error: code, code, retryable: !["MODEL_NOT_CONFIGURED", "MODEL_BLOCKED"].includes(code), message: messages[status] || (status === 504 ? timeoutMessage : retryMessage), ...safeProviderStatus }, status, extraHeaders);
}

function sanitizeLatestPhase(value) {
  if (!value || typeof value !== "object") return null;
  const summary = value.blueWhaleSummary || {};
  const update = value.rosterUpdate || {};
  return {
    phaseLabel: cleanText(value.phaseLabel || value.label, 120), roundNumber: Number(value.roundNumber) || 1, phaseType: value.phaseType === "B" ? "B" : "A",
    blueWhaleSummary: {
      text: cleanText(summary.text, 1200), convergenceLevel: cleanText(summary.convergenceLevel, 40), shouldConsiderStopping: summary.shouldConsiderStopping === true,
      suggestedReasonToStop: cleanText(summary.suggestedReasonToStop, 300), strongestDisagreement: cleanText(summary.strongestDisagreement || summary.coreTension, 200),
      influenceShift: cleanText(summary.influenceShift || summary.whatChanged, 200), unresolvedQuestion: cleanText(summary.unresolvedQuestion || summary.nextRoundFocus, 200),
      nextFocus: cleanText(summary.nextFocus || summary.nextRoundFocus, 200), compactMemory: sanitizeCompactMemory(summary.compactMemory),
    },
    dialogue: Array.isArray(value.dialogue) ? value.dialogue.slice(0, 12).map(row => ({
      speakerId: cleanText(row?.speakerId, 80), speakerName: cleanText(row?.speakerName, 100), role: cleanText(row?.role, 160),
      text: cleanText(row?.text, 900), statementType: cleanText(row?.statementType, 40), targetSpeakerId: cleanText(row?.targetSpeakerId, 80),
      stance: cleanText(row?.stance || row?.stanceSummary, 180), stanceShift: cleanText(row?.stanceShift, 180), historyNote: cleanText(row?.historyNote, 180),
      contributionVote: sanitizeMemberVote(row?.contributionVote), concernVote: sanitizeMemberVote(row?.concernVote),
    })).filter(row => row.speakerId) : [],
    rosterUpdate: { shouldArchivePerspective: update.shouldArchivePerspective === true, archivedSpeakerId: cleanText(update.archivedSpeakerId, 80), archivedSpeakerName: cleanText(update.archivedSpeakerName, 100), reason: cleanText(update.reason, 220) },
    voteSummary: sanitizeVoteSummary(value.voteSummary),
  };
}

function sanitizeMemberVote(value) {
  return value && typeof value === "object" ? { targetSpeakerId: cleanText(value.targetSpeakerId, 80), targetSpeakerName: cleanText(value.targetSpeakerName, 100), reason: cleanText(value.reason, 180) } : null;
}

function sanitizeCompactMemory(value) {
  return value && typeof value === "object" ? {
    mainTension: cleanText(value.mainTension, 200), strongestDisagreement: cleanText(value.strongestDisagreement, 200),
    whatChangedThisPhase: cleanText(value.whatChangedThisPhase, 200), whatNextPhaseShouldExamine: cleanText(value.whatNextPhaseShouldExamine, 200),
  } : null;
}

function sanitizeVoteSummary(value) {
  if (!value || typeof value !== "object") return null;
  const top = item => item && typeof item === "object" ? { speakerId: cleanText(item.speakerId || item.targetSpeakerId, 80), speakerName: cleanText(item.speakerName || item.targetSpeakerName, 100), count: Math.max(0, Number(item.count) || 0), reasonSummary: cleanText(item.reasonSummary || item.reason, 180) } : null;
  const rows = items => Array.isArray(items) ? items.slice(0, 12).map(row => ({ targetSpeakerId: cleanText(row?.targetSpeakerId, 80), targetSpeakerName: cleanText(row?.targetSpeakerName, 100), count: Math.max(0, Number(row?.count) || 0), reasons: Array.isArray(row?.reasons) ? row.reasons.map(reason => cleanText(reason, 120)).filter(Boolean).slice(0, 3) : [] })).filter(row => row.targetSpeakerId) : [];
  return { leadingContributor: top(value.leadingContributor), mostPressuredPerspective: top(value.mostPressuredPerspective), suggestedArchivedPerspective: top(value.suggestedArchivedPerspective), shouldArchivePerspective: value.shouldArchivePerspective === true, contributionVotes: rows(value.contributionVotes), concernVotes: rows(value.concernVotes) };
}

function resolveRosterByIds(modeId, ids, { defaultAll = true } = {}) {
  const all = resolveSessionRoster({ modeId, sessionRoster: null }).map((persona) => toCouncilRoomPersona(persona, modeId));
  if (!Array.isArray(ids) || !ids.length) return defaultAll ? all : [];
  const allowed = new Set(ids.map((id) => cleanText(id, 80)));
  return all.filter((persona) => allowed.has(persona.id));
}

function mergeObserverRosterContext(observerRoster, rawContext) {
  if (!Array.isArray(observerRoster) || !observerRoster.length) return observerRoster;
  const contextById = new Map(
    (Array.isArray(rawContext) ? rawContext : [])
      .map((item) => [
        cleanText(item?.speakerId, 80),
        {
          archivedReason: cleanText(item?.archivedReason, 160),
          archivedStance: cleanText(item?.archivedStance, 180),
          lastContribution: cleanText(item?.lastContribution, 160),
          archivedAtPhaseLabel: cleanText(item?.archivedAtPhaseLabel, 120),
          archivedAtRoundNumber: Number(item?.archivedAtRoundNumber) || 0,
        },
      ])
      .filter(([speakerId]) => speakerId),
  );
  return observerRoster.map((persona) => ({
    ...persona,
    ...(contextById.get(persona.id) || {}),
  }));
}

function sanitizeMeetingMemory(value) {
  if (!value || typeof value !== "object") return null;
  return {
    compactSummary: cleanText(value.compactSummary, 500),
    phaseHistorySummary: cleanText(value.phaseHistorySummary, 500),
    mainTension: cleanText(value.mainTension, 200),
    activeDisagreements: sanitizeList(value.activeDisagreements),
    activeTensions: sanitizeList(value.activeTensions),
    strongestViews: sanitizeList(value.strongestViews),
    openQuestions: sanitizeList(value.openQuestions),
    convergenceSignals: sanitizeList(value.convergenceSignals),
    compactMemory: sanitizeCompactMemory(value.compactMemory),
    memberStates: value.memberStates && typeof value.memberStates === "object"
      ? Object.fromEntries(Object.entries(value.memberStates).slice(0, 12).filter(([id, item]) => id && item && typeof item === "object").map(([id, item]) => [cleanText(id, 80), {
        stance: cleanText(item.stance, 160), influence: cleanText(item.influence, 160), lastContribution: cleanText(item.lastContribution, 180),
        supportReceived: sanitizeList(item.supportReceived), supports: sanitizeList(item.supports), challenges: sanitizeList(item.challenges), changedMind: item.changedMind === true,
      }]))
      : {},
    memberStateSummaries: Array.isArray(value.memberStateSummaries)
      ? value.memberStateSummaries.map((item) => ({
          speakerId: cleanText(item?.speakerId, 80),
          currentStance: cleanText(item?.currentStance, 140),
          latestStatementSummary: cleanText(item?.latestStatementSummary, 160),
          latestTargetSummary: cleanText(item?.latestTargetSummary, 140),
          unresolvedTension: cleanText(item?.unresolvedTension, 140),
        })).filter((item) => item.speakerId).slice(0, 12)
      : [],
    archivedObserverSummaries: Array.isArray(value.archivedObserverSummaries)
      ? value.archivedObserverSummaries.map((item) => ({
          speakerId: cleanText(item?.speakerId, 80),
          name: cleanText(item?.name, 100),
          role: cleanText(item?.role, 100),
          archivedStance: cleanText(item?.archivedStance, 180),
          lastContribution: cleanText(item?.lastContribution, 180),
          reasonArchived: cleanText(item?.reasonArchived, 160),
          archivedAtPhaseLabel: cleanText(item?.archivedAtPhaseLabel, 120),
          archivedAtRoundNumber: Number(item?.archivedAtRoundNumber) || 0,
        })).filter((item) => item.speakerId).slice(0, 12)
      : [],
  };
}

function sanitizeList(value) {
  return Array.isArray(value) ? value.map((item) => cleanText(item, 160)).filter(Boolean).slice(0, 6) : [];
}
