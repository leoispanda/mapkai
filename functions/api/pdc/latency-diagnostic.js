import { hasFounderApiAccess, json } from "./_shared.js";
import { generatePdcDialogue, pdcModes, resolveSessionRoster, toCouncilRoomPersona } from "./pdc-service.js";

const diagnosticQuestion = "欧洲白领为什么收入比美国白领低那么多";
const providerTimeoutMs = 90000;
const diagnosticProviders = ["openai", "cloudflare", "placeholder"];

export async function onRequest({ request, env }) {
  if (!["GET", "POST"].includes(request.method)) return json({ ok: false, error: "Method not allowed." }, 405);
  if (!(await hasFounderApiAccess(request, env))) return json({ ok: false, error: "Founder mode required." }, 403);

  const mode = pdcModes.personal;
  const sessionRoster = resolveSessionRoster({ modeId: mode.id, sessionRoster: null })
    .map((persona) => toCouncilRoomPersona(persona, mode.id));

  const rows = [];
  for (const provider of diagnosticProviders) {
    rows.push(await runProviderDiagnostic({ provider, mode, sessionRoster, env }));
  }

  return json({
    ok: true,
    generatedAt: new Date().toISOString(),
    timeoutMs: providerTimeoutMs,
    rows,
  });
}

async function runProviderDiagnostic({ provider, mode, sessionRoster, env }) {
  if (provider === "cloudflare" && !env?.AI) {
    return {
      provider,
      requestedProvider: provider,
      actualProvider: "skipped",
      providerSuccess: false,
      durationMs: null,
      promptCharLength: null,
      outputCharLength: null,
      statementCount: null,
      jsonSuccess: false,
      fallbackUsed: false,
      fallbackReason: "",
      skippedReason: "Cloudflare AI binding is not configured.",
      contentQualityNote: "Skipped because this deployed environment has no AI binding.",
    };
  }

  const startedAt = Date.now();
  try {
    return await withTimeout(
      generateProviderPhase({ provider, mode, sessionRoster, env, startedAt }),
      providerTimeoutMs,
      provider,
    );
  } catch (error) {
    return {
      provider,
      requestedProvider: provider,
      actualProvider: "error",
      providerSuccess: false,
      durationMs: Date.now() - startedAt,
      promptCharLength: null,
      outputCharLength: null,
      statementCount: null,
      jsonSuccess: false,
      fallbackUsed: false,
      fallbackReason: "",
      errorType: classifyError(error),
      contentQualityNote: "Provider did not return a normalized diagnostic phase.",
    };
  }
}

async function generateProviderPhase({ provider, mode, sessionRoster, env, startedAt }) {
  const result = await generatePdcDialogue({
    modeId: mode.id,
    modeLabel: mode.label,
    sessionRoster,
    observerRoster: [],
    userQuestion: diagnosticQuestion,
    provider,
    roundNumber: 1,
    phaseType: "A",
    previousSummary: "",
    meetingMemory: null,
    userIntervention: "",
    env: {
      OPENAI_API_KEY: env?.OPENAI_API_KEY || "",
      OPENAI_MODEL: env?.OPENAI_MODEL || "",
      PDC_CLOUDFLARE_MODEL: env?.PDC_CLOUDFLARE_MODEL || "",
      PDC_DIALOGUE_FALLBACK_PROVIDER: "placeholder",
      PDC_LATENCY_DIAGNOSTIC: "true",
      PDC_DIAGNOSTIC_PHASE_MAX_OUTPUT_TOKENS: "6000",
      AI: provider === "cloudflare" ? env?.AI : undefined,
    },
  });
  const diagnostics = result.contentDiagnostics || {};
  const dialogue = Array.isArray(result.dialogue) ? result.dialogue : [];
  const fallbackReason = String(result.fallbackReason || "");
  const fallbackUsed = result.fallbackUsed === true;
  const jsonSuccess = result.jsonParseFailed !== true;
  const actualProvider = result.actualProvider || result.provider || provider;
  const errorType = fallbackReason ? classifyFallbackReason(fallbackReason, result.providerErrorShort) : "";

  return {
    provider,
    requestedProvider: provider,
    actualProvider,
    providerSuccess: actualProvider === provider && fallbackUsed !== true && jsonSuccess === true && !errorType,
    durationMs: Date.now() - startedAt,
    promptCharLength: positiveNumberOrNull(diagnostics.promptCharLength),
    outputCharLength: positiveNumberOrNull(diagnostics.outputCharLength) ?? estimateOutputCharLength(result),
    statementCount: dialogue.length,
    jsonSuccess,
    fallbackUsed,
    fallbackReason,
    errorType,
    openAiResponseStatus: diagnostics.openAiResponseStatus || "",
    openAiIncompleteReason: diagnostics.openAiIncompleteReason || "",
    openAiOutputTextLength: positiveNumberOrNull(diagnostics.openAiOutputTextLength),
    openAiRawTextFirst200: diagnostics.openAiRawTextFirst200 || "",
    schemaName: diagnostics.schemaName || result.schemaName || "",
    strict: diagnostics.strict === true || result.strict === true,
    phaseMaxOutputTokens: positiveNumberOrNull(diagnostics.phaseMaxOutputTokens || diagnostics.maxOutputTokens),
    contentQualityNote: buildContentQualityNote({ result, dialogue, diagnostics, sessionRoster }),
  };
}

function withTimeout(promise, timeoutMs, provider) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${provider} diagnostic timed out after ${timeoutMs}ms`)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

function buildContentQualityNote({ result, dialogue, diagnostics, sessionRoster }) {
  const notes = [];
  if (result.fallbackUsed) notes.push("fallback used");
  if (!dialogue.length) notes.push("no usable statements returned");
  if (dialogue.length && dialogue.length < sessionRoster.length) notes.push(`only ${dialogue.length}/${sessionRoster.length} statements returned`);
  if (diagnostics.defaultStatementsInjected) notes.push("default statements injected");
  if (diagnostics.templateContentDetected) notes.push("template content detected");
  if (diagnostics.contentQualityRetryUsed) notes.push("content quality retry used");
  if (!notes.length) notes.push("normalized phase returned without obvious local quality flags");
  return notes.join("; ");
}

function estimateOutputCharLength(result) {
  return JSON.stringify({
    dialogue: result.dialogue || [],
    blueWhaleSummary: result.blueWhaleSummary || null,
  }).length;
}

function positiveNumberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function classifyFallbackReason(reason, providerErrorShort = "") {
  const text = `${reason} ${providerErrorShort}`;
  if (/timeout|timed out/i.test(text)) return "timeout";
  if (/OPENAI_API_KEY|api key/i.test(text)) return "missing_openai_api_key";
  if (/AI binding|binding/i.test(text)) return "missing_cloudflare_ai_binding";
  if (/json|parse|schema|output_text/i.test(text)) return "json_failure";
  if (/template|default|missing required dialogue/i.test(text)) return "content_quality_failure";
  return "provider_fallback";
}

function classifyError(error) {
  const message = String(error?.message || error || "");
  if (/timeout|timed out/i.test(message)) return "timeout";
  if (/json|parse|schema|output_text/i.test(message)) return "json_failure";
  if (/OPENAI_API_KEY|api key/i.test(message)) return "missing_openai_api_key";
  if (/AI binding|binding/i.test(message)) return "missing_cloudflare_ai_binding";
  return "provider_error";
}
