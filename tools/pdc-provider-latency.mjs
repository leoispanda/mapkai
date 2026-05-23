#!/usr/bin/env node

import { generatePdcDialogue, pdcModes, resolveSessionRoster, toCouncilRoomPersona } from "../functions/api/pdc/pdc-service.js";

const defaultQuestion = "做饭耽误时间，那么直接在外面买快餐是不是更好";
const question = getArgValue("--question") || process.env.PDC_LATENCY_QUESTION || defaultQuestion;
const modeId = getArgValue("--mode") || process.env.PDC_LATENCY_MODE || "personal";
const phaseType = String(getArgValue("--phase") || process.env.PDC_LATENCY_PHASE || "A").toUpperCase() === "B" ? "B" : "A";
const roundNumber = Number(getArgValue("--round") || process.env.PDC_LATENCY_ROUND || 1);
const providers = (getArgValue("--providers") || process.env.PDC_LATENCY_PROVIDERS || "openai,cloudflare,placeholder")
  .split(",")
  .map((item) => item.trim().toLowerCase())
  .filter(Boolean);

const mode = pdcModes[modeId] || pdcModes.personal;
const sessionRoster = resolveSessionRoster({ modeId: mode.id, sessionRoster: null }).map((persona) => toCouncilRoomPersona(persona, mode.id));
const baseEnv = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  OPENAI_MODEL: process.env.OPENAI_MODEL || "",
  PDC_CLOUDFLARE_MODEL: process.env.PDC_CLOUDFLARE_MODEL || "",
  PDC_DIALOGUE_FALLBACK_PROVIDER: "placeholder",
};

const rows = [];
for (const provider of providers) {
  rows.push(await runProvider(provider));
}

const report = {
  question,
  modeId: mode.id,
  phaseType,
  roundNumber,
  generatedAt: new Date().toISOString(),
  rows,
};

console.log(JSON.stringify(report, null, 2));

async function runProvider(provider) {
  const env = { ...baseEnv };
  if (provider === "cloudflare") {
    const ai = createCloudflareAiBinding();
    if (!ai) {
      return {
        provider,
        skipped: true,
        skipReason: "Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN to run Cloudflare Workers AI locally.",
      };
    }
    env.AI = ai;
  }

  const startedAt = Date.now();
  try {
    const result = await generatePdcDialogue({
      modeId: mode.id,
      modeLabel: mode.label,
      sessionRoster,
      observerRoster: [],
      userQuestion: question,
      provider,
      roundNumber,
      phaseType,
      previousSummary: "",
      meetingMemory: null,
      userIntervention: "",
      env,
    });
    const durationMs = Date.now() - startedAt;
    const diagnostics = result.contentDiagnostics || {};
    const dialogue = Array.isArray(result.dialogue) ? result.dialogue : [];
    const summary = result.blueWhaleSummary?.text || "";
    return {
      provider,
      requestedProvider: result.requestedProvider || provider,
      actualProvider: result.actualProvider || result.provider || provider,
      fallbackUsed: result.fallbackUsed === true,
      fallbackReason: result.fallbackReason || "",
      durationMs,
      providerDurationMs: Number(diagnostics.phaseTotalDurationMs || diagnostics.totalPhaseDurationMs || diagnostics.openAiDurationMs || 0),
      promptCharLength: numberOrNull(diagnostics.promptCharLength),
      approximateInputTokenEstimate: numberOrNull(diagnostics.approximateInputTokenEstimate),
      outputCharLength: numberOrNull(diagnostics.outputCharLength) ?? estimateOutputCharLength(result),
      statementCount: dialogue.length,
      jsonSuccess: result.jsonParseFailed !== true && !/json/i.test(result.fallbackReason || ""),
      jsonParseFailed: result.jsonParseFailed === true,
      modelName: result.modelName || "",
      contentQualityNotes: buildQualityNotes({ result, dialogue, summary, diagnostics }),
      sampleStatements: dialogue.slice(0, 3).map((line) => ({
        speakerId: line.speakerId,
        text: line.text,
      })),
      blueWhaleSummary: summary,
    };
  } catch (error) {
    return {
      provider,
      durationMs: Date.now() - startedAt,
      jsonSuccess: false,
      jsonParseFailed: /json|parse|expected|unexpected/i.test(String(error?.message || "")),
      error: String(error?.message || error).slice(0, 500),
      contentQualityNotes: ["Provider threw before returning a normalized phase."],
    };
  }
}

function createCloudflareAiBinding() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "";
  const apiToken = process.env.CLOUDFLARE_API_TOKEN || "";
  if (!accountId || !apiToken) return null;
  return {
    async run(model, payload) {
      const modelPath = String(model || "").split("/").map(encodeURIComponent).join("/");
      const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${modelPath}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || body.success === false) {
        const message = body?.errors?.[0]?.message || body?.error || `Cloudflare HTTP ${response.status}`;
        throw new Error(String(message));
      }
      return body.result ?? body;
    },
  };
}

function buildQualityNotes({ result, dialogue, summary, diagnostics }) {
  const notes = [];
  if (result.fallbackUsed) notes.push(`fallback used: ${result.fallbackReason || "unknown reason"}`);
  if (!dialogue.length) notes.push("no usable statements returned");
  if (dialogue.length && dialogue.length < sessionRoster.length) notes.push(`only ${dialogue.length}/${sessionRoster.length} statements returned`);
  if (diagnostics.defaultStatementsInjected) notes.push(`default statements injected: ${(diagnostics.defaultStatementSpeakerIds || []).join(", ")}`);
  if (diagnostics.templateContentDetected) notes.push(`template content detected: ${(diagnostics.templateMatchedPhrases || []).join(", ")}`);
  if (diagnostics.contentQualityRetryUsed) notes.push("content quality retry used");
  if (dialogue.some((line) => /\[object Object\]/.test(String(line.text || "")))) notes.push("[object Object] appeared in dialogue");
  if (summary && /\[object Object\]/.test(summary)) notes.push("[object Object] appeared in Blue Whale summary");
  if (!notes.length) notes.push("normalized phase returned without obvious local quality flags");
  return notes;
}

function estimateOutputCharLength(result) {
  return JSON.stringify({
    dialogue: result.dialogue || [],
    blueWhaleSummary: result.blueWhaleSummary || null,
  }).length;
}

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function getArgValue(name) {
  const index = process.argv.indexOf(name);
  if (index < 0) return "";
  return process.argv[index + 1] || "";
}
