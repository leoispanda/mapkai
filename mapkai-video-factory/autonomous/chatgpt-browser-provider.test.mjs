import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { ChatGPTLoginRequired, ChatGPTStageIndeterminate, ChatGPTTimeout, ChatGPTUiChanged, ChatGPTRateLimited, chatgptBrowserConfig, createChatGPTBrowserProvider, extractJson, freshRateLimitEvidence, rateLimitSignal, validateSchema } from "./chatgpt-browser-provider.mjs";
import { providerConfig } from "./editorial-provider.mjs";

const guidance = { schemaVersion: "editorial-guidance.v1", field: { id: "0311", name: "Economics", slug: "economics", type: "FIELD" }, centralHumanQuestion: "How should people compare valuable futures when every real choice excludes another?", fieldBecomesNecessaryWhen: "People need to coordinate scarce resources, trade-offs, shared costs, and distribution.", coreThesis: "Economics makes constrained possibilities and their consequences visible.", narrativeEngine: "system cascade", parallelCivilization: { enabled: true, entryPoint: "A settlement faces winter.", existingKnowledge: ["harvest", "storage"], trigger: "grain runs short", ordinaryIntuition: "store everything", failedIntuition: "one choice changes every other option", emergentProblem: "which future is forgone" }, openingHook: "A granary decision changes a settlement.", centralTension: "No choice is free of a foregone future.", primaryAha: "Cost includes the best possible future abandoned.", secondaryTurns: ["prices coordinate", "effects spill over"], emergencePath: ["choice", "comparison", "exchange", "institutions", "models"], modernFieldMap: [{ name: "Microeconomics", reasonItExists: "choices interact" }, { name: "Macroeconomics", reasonItExists: "aggregate feedback matters" }, { name: "Public economics", reasonItExists: "shared effects need rules" }], mandatoryConcepts: ["opportunity cost", "price", "externality"], methodsToRepresent: ["comparison", "model"], crossFieldConnections: [{ field: "Law", connection: "rules structure exchange", difference: "law studies norms" }, { field: "Psychology", connection: "choice is bounded", difference: "psychology studies cognition" }], visualOpportunities: ["granary", "price signals", "smoke"], endingReturn: "Return to the modern economy.", finalMentalModel: "Choices coordinate and spill over.", avoid: ["textbook list", "fake history", "generic motivation"] };

const sandbox = await mkdtemp(path.join(os.tmpdir(), "mapkai-chatgpt-provider-"));
const calls = [];
let healthCalls = 0;
const transport = { health: async () => { healthCalls += 1; return { available: true, reachable: true, authenticated: true, uiDetected: true, ready: true, state: "READY" }; }, send: async ({ prompt }) => { calls.push(prompt); return { text: "```json\\n" + JSON.stringify(guidance) + "\\n```", conversationId: "test-conversation", ui: "detected" }; } };
const provider = createChatGPTBrowserProvider({ env: { CHATGPT_BROWSER_TIMEOUT_MS: "10000", CHATGPT_BROWSER_RUNTIME_DIR: sandbox, CHATGPT_BROWSER_MIN_REQUEST_INTERVAL_MS: "0", CHATGPT_BROWSER_HEALTH_CACHE_MS: "60000" }, transport });
assert.equal(providerConfig({}).provider, "chatgpt-browser");
assert.equal(providerConfig({ EDITORIAL_PROVIDER_AUTO_DETECT_CHATGPT_BROWSER: "true" }).provider, "chatgpt-browser");
assert.equal(providerConfig({ EDITORIAL_PROVIDER: "openai", OPENAI_API_KEY: "x" }).provider, "openai");
assert.deepEqual(extractJson("before\\n```json\\n{\"ok\":true}\\n```\\nafter"), { ok: true });
assert.ok(validateSchema({ overviewMarkdown: "short" }, { type: "object", required: ["overviewMarkdown"], properties: { overviewMarkdown: { type: "string", minLength: 10 } } }).length > 0);
const context = { field: "0311", attemptId: "test-attempt", promptVersion: "1", canonVersion: "1" };
const result = await provider.generateEditorialGuidance("director", context);
assert.equal(result.coreThesis, guidance.coreThesis);
await provider.generateEditorialGuidance("director", context);
assert.equal(calls.length, 1, "duplicate stage was sent twice");
const auditPath = path.join(sandbox, "audit", "0311", "editorial-director", "test-attempt", "raw-response.md");
assert.ok(existsSync(auditPath), "raw response was not captured");
assert.match(await readFile(auditPath, "utf8"), /coreThesis/);
const thread = await provider.openThread({ field: "0311" });
assert.equal(thread.exists, true, "field conversation was not persisted");
await provider.sendMessage(thread, "Explore a surprising premise for Economics; do not write JSON.", { stage: "explore", context: { ...context, attemptId: "natural-explore" } });
assert.equal(calls.length, 2, "natural conversation message was not sent");
assert.doesNotMatch(calls.at(-1), /STRICT JSON CONTRACT/, "natural editorial conversation was forced into JSON");
const transcript = await provider.getTranscript(thread);
assert.ok(transcript.entries.some((entry) => entry.role === "user" && /Explore a surprising premise/.test(entry.text)), "natural user message was not retained in the transcript");
const journey = await provider.runEditorialJourney({ field: "0311", context: { ...context, attemptId: "journey" }, prompts: { conversation: { challenge: "Challenge the initial direction in natural prose.", select: "Select a stronger direction." } } });
assert.equal(journey.transcript.length, 2, "editorial journey did not preserve its natural-language turns");
assert.equal(calls.length, 4, "editorial journey did not reuse the field conversation");
const repeatedJourney = await provider.runEditorialJourney({ field: "0311", context: { ...context, attemptId: "journey-repeat" }, prompts: { conversation: { challenge: "Challenge the initial direction in natural prose.", select: "Select a stronger direction." } } });
assert.equal(calls.length, 4, "completed natural-language stages were sent again after restart-like reuse");
assert.ok(repeatedJourney.transcript.every((entry) => entry.reused), "completed stage reuse was not visible to the caller");
assert.equal(healthCalls, 1, "health check was repeated for every stage despite the cache");
assert.deepEqual(rateLimitSignal("Too many requests. Try again in 2 minutes"), { matched: true, waitMs: 120000 });
assert.deepEqual(freshRateLimitEvidence([
  { at: 90, fresh: true, text: "Too many requests" },
  { at: 110, fresh: false, text: "Too many requests" },
  { at: 120, fresh: true, text: "Too many requests" },
], { requestTimestamp: 100 }), [{ at: 120, fresh: true, text: "Too many requests" }], "historical/non-request-scoped rate-limit text was not ignored");
assert.equal(chatgptBrowserConfig({}).minRequestIntervalMs, 30000, "the recovery-safe default request gap is not 30 seconds");
let repairCalls = 0;
const repairProvider = createChatGPTBrowserProvider({ env: { CHATGPT_BROWSER_RUNTIME_DIR: path.join(sandbox, "repair"), CHATGPT_BROWSER_MIN_REQUEST_INTERVAL_MS: "0" }, transport: { health: async () => ({ ready: true, state: "READY" }), send: async () => ({ text: repairCalls++ ? JSON.stringify(guidance) : "{}", conversationId: "repair-conversation" }) } });
assert.equal((await repairProvider.generateEditorialGuidance("repair", { ...context, attemptId: "repair-attempt" })).field.id, "0311");
assert.equal(repairCalls, 2, "invalid JSON/schema response did not receive one bounded repair turn");
await assert.rejects(() => createChatGPTBrowserProvider({ env: { CHATGPT_BROWSER_RUNTIME_DIR: path.join(sandbox, "timeout"), CHATGPT_BROWSER_MIN_REQUEST_INTERVAL_MS: "0" }, transport: { health: async () => ({ ready: true, state: "READY" }), send: async () => { throw new ChatGPTTimeout(); } } }).generateEditorialGuidance("x", context), ChatGPTTimeout);
await assert.rejects(() => createChatGPTBrowserProvider({ env: { CHATGPT_BROWSER_RUNTIME_DIR: sandbox, CHATGPT_BROWSER_MIN_REQUEST_INTERVAL_MS: "0" }, transport: { health: async () => ({ state: "CHATGPT_LOGIN_REQUIRED", ready: false }) } }).generateEditorialGuidance("x", context), ChatGPTLoginRequired);
await assert.rejects(() => createChatGPTBrowserProvider({ env: { CHATGPT_BROWSER_RUNTIME_DIR: sandbox, CHATGPT_BROWSER_MIN_REQUEST_INTERVAL_MS: "0" }, transport: { health: async () => ({ state: "CHATGPT_UI_CHANGED", ready: false }) } }).generateEditorialGuidance("x", context), ChatGPTUiChanged);
let limitedHealthCalls = 0; let limitedSendCalls = 0;
const limitedRuntime = path.join(sandbox, "rate-limited");
const limitedProvider = createChatGPTBrowserProvider({ env: { CHATGPT_BROWSER_RUNTIME_DIR: limitedRuntime, CHATGPT_BROWSER_MIN_REQUEST_INTERVAL_MS: "0" }, transport: {
  health: async () => { limitedHealthCalls += 1; return { ready: true, state: "READY" }; },
  send: async () => { limitedSendCalls += 1; throw new ChatGPTRateLimited("Too many requests", { retryAfterMs: 1 }); },
} });
await assert.rejects(() => limitedProvider.generateEditorialGuidance("rate limited", { ...context, field: "rate" }), ChatGPTRateLimited);
const limitedState = await limitedProvider.rateLimitStatus();
assert.equal(limitedState.status, "CHATGPT_RATE_LIMITED");
assert.equal(limitedState.blocked, true);
await assert.rejects(() => limitedProvider.generateEditorialGuidance("rate limited again", { ...context, field: "rate" }), ChatGPTRateLimited);
assert.equal(limitedSendCalls, 1, "rate-limited provider retried immediately");
assert.equal(limitedHealthCalls, 1, "rate-limited provider performed another browser health request");
const healthLimitedRuntime = path.join(sandbox, "health-rate-limited");
const healthLimitedProvider = createChatGPTBrowserProvider({ env: { CHATGPT_BROWSER_RUNTIME_DIR: healthLimitedRuntime, CHATGPT_BROWSER_MIN_REQUEST_INTERVAL_MS: "0" }, transport: {
  health: async () => { throw new ChatGPTRateLimited("Too many requests", { retryAfterMs: 1, source: "historical_health_text" }); },
  send: async () => ({ text: JSON.stringify(guidance), conversationId: "health-conversation" }),
} });
const healthLimitedResult = await healthLimitedProvider.healthCheck();
assert.equal(healthLimitedResult.state, "CHATGPT_HEALTH_UNCERTAIN", "health did not distinguish a non-request rate-limit signal");
const healthLimitedState = await healthLimitedProvider.rateLimitStatus();
assert.equal(healthLimitedState.status, "CLEAR", "a health-only historical warning incorrectly started a cooldown");

const recoveryRuntime = path.join(sandbox, "recovery-probe");
await mkdir(recoveryRuntime, { recursive: true });
await writeFile(path.join(recoveryRuntime, "conversations.json"), JSON.stringify({
  schemaVersion: 2,
  conversations: { general: { conversationId: "general-conversation", purpose: "MapKAI Editorial — General Overview" } },
  completedStages: {},
  inFlightByFieldStage: {},
  stageStates: {},
  rateLimit: { status: "CHATGPT_RATE_LIMITED", attempt: 1, retryAt: new Date(Date.now() - 1_000).toISOString(), retryAfterMs: 1, detectedAt: new Date(Date.now() - 10_000).toISOString(), reason: "historical warning", source: "user_report" },
  throttle: {},
}));
let recoveryHealthCalls = 0; let recoverySendCalls = 0; let recoveryConversationId = null;
const recoveryProvider = createChatGPTBrowserProvider({ env: { CHATGPT_BROWSER_RUNTIME_DIR: recoveryRuntime, CHATGPT_BROWSER_MIN_REQUEST_INTERVAL_MS: "0" }, transport: {
  health: async () => { recoveryHealthCalls += 1; return { ready: true, state: "READY", historicalRateLimitTextPresent: true }; },
  send: async ({ conversationId, requestId }) => { recoverySendCalls += 1; recoveryConversationId = conversationId; return { text: "A normal recovery response.", conversationId, requestId }; },
} });
const recoveryResponse = await recoveryProvider.sendMessage({ field: "GENERAL", name: "MapKAI Editorial — General Overview" }, "Continue the first pending General Overview stage.", { stage: "self_review", context: { field: "GENERAL", attemptId: "GENERAL-self-review-recovery-probe" } });
assert.equal(recoveryResponse.reused, false, "the recovery probe was incorrectly reused from an old audit");
assert.equal(recoverySendCalls, 1, "recovery probe did not send exactly one real request");
assert.equal(recoveryConversationId, "general-conversation", "recovery probe did not reuse the existing conversation ID");
assert.equal(recoveryHealthCalls, 1, "recovery probe performed duplicate health requests");
const recoveryState = await recoveryProvider.rateLimitStatus();
assert.equal(recoveryState.status, "CLEAR", "normal recovery response did not clear the cooldown");
assert.equal(recoveryState.channel.status, "RECOVERED", "recovered channel was not marked");
assert.equal(recoveryState.recoveryProbePending, false, "recovery probe remained pending after a normal response");
const derivedRecoveryRuntime = path.join(sandbox, "recovery-probe-derived-deadline");
await mkdir(derivedRecoveryRuntime, { recursive: true });
await writeFile(path.join(derivedRecoveryRuntime, "conversations.json"), JSON.stringify({
  schemaVersion: 2,
  conversations: { business: { conversationId: "business-conversation", purpose: "MapKAI Editorial — Business, Administration and Law" } },
  completedStages: {},
  inFlightByFieldStage: {},
  stageStates: {},
  rateLimit: { status: "CHATGPT_RATE_LIMITED", attempt: 2, retryAt: null, retryAfterMs: null, detectedAt: new Date(Date.now() - 60 * 60 * 1_000).toISOString(), reason: "legacy fresh dialog record", source: "fresh_dialog" },
  throttle: {},
}));
let derivedRecoverySendCalls = 0; let derivedRecoveryConversationId = null;
const derivedRecoveryProvider = createChatGPTBrowserProvider({ env: { CHATGPT_BROWSER_RUNTIME_DIR: derivedRecoveryRuntime, CHATGPT_BROWSER_MIN_REQUEST_INTERVAL_MS: "0" }, transport: {
  health: async () => ({ ready: true, state: "READY" }),
  send: async ({ conversationId, requestId }) => { derivedRecoverySendCalls += 1; derivedRecoveryConversationId = conversationId; return { text: "A normal recovery response with a derived deadline.", conversationId, requestId }; },
} });
const derivedStatusBefore = await derivedRecoveryProvider.rateLimitStatus();
assert.equal(derivedStatusBefore.cooldownExpired, true, "missing retryAt did not derive an expired cooldown from detectedAt and backoff");
assert.equal(derivedStatusBefore.blocked, false, "an expired derived cooldown incorrectly remained blocked");
const derivedRecoveryResponse = await derivedRecoveryProvider.sendMessage({ field: "BUSINESS", name: "MapKAI Editorial — Business, Administration and Law" }, "Continue the first pending Business independent review stage.", { stage: "independent_review", context: { field: "BUSINESS", attemptId: "business-independent-review-recovery-probe" } });
assert.equal(derivedRecoveryResponse.reused, false, "derived-deadline recovery probe was incorrectly reused");
assert.equal(derivedRecoverySendCalls, 1, "derived-deadline recovery probe did not send exactly one request");
assert.equal(derivedRecoveryConversationId, "business-conversation", "derived-deadline recovery probe did not reuse the existing conversation ID");
assert.equal((await derivedRecoveryProvider.rateLimitStatus()).status, "CLEAR", "derived-deadline recovery response did not clear the cooldown");
const unknownRuntime = path.join(sandbox, "unknown-inflight");
await mkdir(unknownRuntime, { recursive: true });
await writeFile(path.join(unknownRuntime, "conversations.json"), JSON.stringify({ schemaVersion: 1, conversations: { rate: { conversationId: "known-conversation" } }, completedStages: {}, inFlightByFieldStage: { "rate:develop": { conversationId: "known-conversation", attemptId: "old-attempt" } } }));
let unknownSendCalls = 0;
const unknownProvider = createChatGPTBrowserProvider({ env: { CHATGPT_BROWSER_RUNTIME_DIR: unknownRuntime, CHATGPT_BROWSER_MIN_REQUEST_INTERVAL_MS: "0" }, transport: { health: async () => ({ ready: true, state: "READY" }), send: async () => { unknownSendCalls += 1; return { text: "should not send", conversationId: "known-conversation" }; } } });
await assert.rejects(() => unknownProvider.sendMessage("rate", "continue develop", { stage: "develop" }), ChatGPTStageIndeterminate);
assert.equal(unknownSendCalls, 0, "an unidentifiable in-flight stage was resent");
await rm(sandbox, { recursive: true, force: true });
console.log("chatgpt-browser provider unit tests passed");
