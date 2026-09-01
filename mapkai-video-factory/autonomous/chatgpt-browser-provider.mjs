import { createHash, randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const FACTORY = path.resolve(ROOT, "..");
const DEFAULT_TIMEOUT_MS = 120_000;
const MAX_JSON_REPAIR_TURNS = 1;
// Keep the browser channel deliberately conservative after recovery. A real
// recovery probe is still an ordinary editorial request, so it must obey the
// same 30-second spacing as every later request.
const DEFAULT_MIN_REQUEST_INTERVAL_MS = 30_000;
const DEFAULT_HEALTH_CACHE_MS = 300_000;
const DEFAULT_RATE_LIMIT_BACKOFF_MS = [300_000, 600_000, 1_200_000];

export class ChatGPTBrowserError extends Error {
  constructor(code, message) { super(message); this.name = code; this.code = code; }
}
export class ChatGPTLoginRequired extends ChatGPTBrowserError {
  constructor(message = "ChatGPT requires a manual login before the editorial provider can continue.") { super("CHATGPT_LOGIN_REQUIRED", message); }
}
export class ChatGPTSecurityPaused extends ChatGPTBrowserError {
  constructor(message = "ChatGPT showed a security challenge. Complete it manually, then resume.") { super("SECURITY_PAUSED", message); }
}
export class ChatGPTUiChanged extends ChatGPTBrowserError {
  constructor(message = "ChatGPT's visible composer or response UI was not detected.") { super("CHATGPT_UI_CHANGED", message); }
}
export class ChatGPTTimeout extends ChatGPTBrowserError {
  constructor(message = "Timed out while waiting for ChatGPT's response.") { super("CHATGPT_TIMEOUT", message); }
}
export class ChatGPTStageIndeterminate extends ChatGPTBrowserError {
  constructor(message = "A prior ChatGPT stage has no request hash. It was not resent because the previous attempt cannot be identified safely.") { super("CHATGPT_STAGE_INDETERMINATE", message); }
}
export class ChatGPTRateLimited extends ChatGPTBrowserError {
  constructor(message = "ChatGPT reported too many requests. The editorial channel is paused until the persisted retry time.", details = {}) {
    super("CHATGPT_RATE_LIMITED", message);
    this.retryAfterMs = Number.isFinite(Number(details.retryAfterMs)) ? Number(details.retryAfterMs) : null;
    this.retryAt = details.retryAt || null;
    this.source = details.source || null;
    this.rateLimitPersisted = details.rateLimitPersisted === true;
    this.fresh = details.fresh === true;
    this.requestId = details.requestId || null;
    this.requestTimestamp = details.requestTimestamp || null;
    this.evidence = details.evidence || null;
  }
}

function now() { return new Date().toISOString(); }
function hash(value) { return createHash("sha256").update(String(value)).digest("hex"); }
function slug(value) { return String(value || "unknown").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "unknown"; }
function bool(value) { return /^(1|true|yes)$/i.test(String(value || "")); }
async function writeJson(file, value) { await mkdir(path.dirname(file), { recursive: true }); await writeFile(file, `${JSON.stringify(value, null, 2)}\n`); }
async function writeText(file, value) { await mkdir(path.dirname(file), { recursive: true }); await writeFile(file, String(value).endsWith("\n") ? String(value) : `${value}\n`); }
async function readJson(file, fallback) { return existsSync(file) ? JSON.parse(await readFile(file, "utf8")) : fallback; }

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function parseWaitMs(text) {
  const match = String(text || "").toLowerCase().match(/(?:wait|retry|try again|in)\D{0,24}(\d+(?:\.\d+)?)\s*(second|sec|minute|min|hour|hr)s?/i);
  if (!match) return null;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return null;
  const unit = match[2].toLowerCase();
  const multiplier = unit.startsWith("hour") || unit === "hr" ? 3_600_000 : unit.startsWith("min") ? 60_000 : 1_000;
  return Math.ceil(amount * multiplier);
}

export function rateLimitSignal(text) {
  const body = String(text || "").toLowerCase();
  const matched = /\btoo many requests\b|\brate limit(?:ed|ing)?\b|\brequest limit\b|\btry again later\b|\bplease wait before trying again\b|\b429\b/.test(body);
  return { matched, waitMs: matched ? parseWaitMs(body) : null };
}

/**
 * Rate-limit text is only actionable when it is tied to the current request.
 * A conversation can retain an old warning forever, so callers must provide
 * mutation records (or another request-scoped signal) rather than scanning
 * the whole conversation body.
 */
export function freshRateLimitEvidence(records = [], { requestTimestamp = 0 } = {}) {
  return (Array.isArray(records) ? records : []).filter((record) => {
    const at = typeof record?.at === "number" ? record.at : Date.parse(record?.at || "") || 0;
    return at >= Number(requestTimestamp || 0)
      && record?.fresh === true
      && rateLimitSignal(record?.text || "").matched;
  });
}

function numericEnv(env, name, fallback, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  const value = Number(env?.[name]);
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

const FIELD_DISPLAY_NAMES = {
  GENERAL: "General Overview",
  "0533": "Physics",
  "0311": "Economics",
  "0313": "Psychology",
  "0542": "Statistics",
  "0421": "Law",
};

function fieldDisplayName(field) { return FIELD_DISPLAY_NAMES[String(field)] || String(field || "Unknown Field"); }

/** Extracts fenced JSON first, then the first balanced object. It never invents missing fields. */
export function extractJson(text) {
  const raw = String(text || "").trim();
  const fenced = [...raw.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)].map((match) => match[1].trim());
  const candidates = [...fenced, raw];
  for (const candidate of candidates) {
    try { return JSON.parse(candidate); } catch { /* try a balanced object below */ }
    const start = candidate.indexOf("{");
    if (start < 0) continue;
    let depth = 0; let quoted = false; let escaped = false;
    for (let index = start; index < candidate.length; index += 1) {
      const char = candidate[index];
      if (quoted) { if (escaped) escaped = false; else if (char === "\\") escaped = true; else if (char === '"') quoted = false; continue; }
      if (char === '"') { quoted = true; continue; }
      if (char === "{") depth += 1;
      if (char === "}") { depth -= 1; if (depth === 0) { try { return JSON.parse(candidate.slice(start, index + 1)); } catch { break; } } }
    }
  }
  const error = new Error("ChatGPT response did not contain a parseable JSON object."); error.code = "EDITORIAL_INVALID_JSON"; throw error;
}

/** Small JSON Schema validator for the strict schemas the factory already owns. */
export function validateSchema(value, schema, at = "$") {
  const errors = [];
  const types = Array.isArray(schema?.type) ? schema.type : schema?.type ? [schema.type] : [];
  const actual = Array.isArray(value) ? "array" : value === null ? "null" : typeof value;
  if (types.length && !types.includes(actual)) errors.push(`${at} must be ${types.join(" or ")}`);
  if (schema?.enum && !schema.enum.includes(value)) errors.push(`${at} is not an allowed value`);
  if (typeof value === "string" && schema.minLength && value.length < schema.minLength) errors.push(`${at} is too short`);
  if (typeof value === "number" && schema.minimum !== undefined && value < schema.minimum) errors.push(`${at} is below minimum`);
  if (typeof value === "number" && schema.maximum !== undefined && value > schema.maximum) errors.push(`${at} is above maximum`);
  if (Array.isArray(value)) {
    if (schema?.minItems && value.length < schema.minItems) errors.push(`${at} has too few items`);
    if (schema?.maxItems && value.length > schema.maxItems) errors.push(`${at} has too many items`);
    value.forEach((item, index) => errors.push(...validateSchema(item, schema?.items || {}, `${at}[${index}]`)));
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const name of schema?.required || []) if (!(name in value)) errors.push(`${at}.${name} is required`);
    for (const [name, child] of Object.entries(schema?.properties || {})) if (name in value) errors.push(...validateSchema(value[name], child, `${at}.${name}`));
    if (schema?.additionalProperties === false) for (const name of Object.keys(value)) if (!(name in (schema.properties || {}))) errors.push(`${at}.${name} is not allowed`);
  }
  return errors;
}

async function schemaFor(schemaName) {
  const file = path.join(FACTORY, "schemas", `${schemaName}.schema.json`);
  if (!existsSync(file)) throw new Error(`Required schema is missing: ${schemaName}`);
  return JSON.parse(await readFile(file, "utf8"));
}

function pageSignals(text) {
  const body = String(text || "").toLowerCase();
  return {
    login: /\b(log in|sign in|create account)\b/.test(body),
    security: /\b(captcha|verify you are human|security check|unusual activity|two-factor|2fa)\b/.test(body),
    rateLimit: rateLimitSignal(body),
  };
}

class PlaywrightChatGPTTransport {
  constructor({ env = process.env } = {}) {
    this.env = env;
    this.homeUrl = env.CHATGPT_BROWSER_URL || "https://chatgpt.com/";
    this.cdpUrl = env.CHATGPT_BROWSER_CDP_URL || env.MAPKAI_CHROME_CDP_URL || "http://127.0.0.1:9222";
  }
  async connect() {
    try { const { chromium } = await import("playwright"); return await chromium.connectOverCDP(this.cdpUrl); }
    catch { throw new ChatGPTSecurityPaused("Cannot attach to the existing visible browser. Open your signed-in ChatGPT browser and retry; no credentials were read."); }
  }
  async disconnect(browser) {
    // A CDP connection is attached to the user's visible browser. Disconnect
    // the automation client; never close the user's Chrome window or its tabs.
    if (typeof browser?.disconnect === "function") return browser.disconnect();
    if (typeof browser?.close === "function") return browser.close();
    return undefined;
  }
  async page(browser, conversationId) {
    const context = browser.contexts()[0];
    if (!context) throw new ChatGPTSecurityPaused("The browser exposed no authenticated context.");
    if (conversationId) {
      const existing = context.pages().find((candidate) => candidate.url().includes(`/c/${conversationId}`));
      if (existing) return existing;
    }
    const page = await context.newPage();
    await page.goto(conversationId ? `${this.homeUrl.replace(/\/$/, "")}/c/${conversationId}` : this.homeUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.waitForTimeout(700);
    return page;
  }
  async dismissHistoricalRateLimitDialog(page) {
    // This dialog is a pre-request UI artifact. Dismissing it does not submit
    // anything; it only restores the composer so the next real request can be
    // used as the recovery probe.
    const buttons = page.getByRole("button", { name: /got it|dismiss|close/i });
    const count = await buttons.count().catch(() => 0);
    for (let index = count - 1; index >= 0; index -= 1) {
      const button = buttons.nth(index);
      if (!(await button.isVisible().catch(() => false))) continue;
      const label = (await button.innerText().catch(() => "")).trim();
      if (/got it|dismiss|close/i.test(label)) {
        await button.click({ timeout: 10_000 });
        await page.waitForTimeout(250);
        return true;
      }
    }
    return false;
  }
  async installRateLimitObserver(page, { requestId, requestTimestamp }) {
    const token = `__mapkaiRateLimitObserver_${String(requestId || randomUUID()).replace(/[^a-zA-Z0-9_]/g, "_")}_${Date.now()}`;
    await page.evaluate(({ key, requestId: currentRequestId, requestTimestamp: currentRequestTimestamp }) => {
      const pattern = /\btoo many requests\b|\brate limit(?:ed|ing)?\b|\brequest limit\b|\btry again later\b|\bplease wait before trying again\b|\b429\b/i;
      const textOf = (node) => String(node?.innerText || node?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 800);
      const matches = (text) => pattern.test(String(text || ""));
      const baselineText = new WeakMap();
      for (const element of document.querySelectorAll("*")) baselineText.set(element, textOf(element));
      const state = {
        requestId: currentRequestId || null,
        requestTimestamp: Number(currentRequestTimestamp) || Date.now(),
        baselineText,
        records: [],
        seen: new Set(),
        observer: null,
      };
      const record = (node, kind) => {
        const element = node?.nodeType === 1 ? node : node?.parentElement;
        if (!element) return;
        const text = textOf(element);
        if (!matches(text)) return;
        const prior = state.baselineText.get(element);
        const isNewNode = prior === undefined;
        const changedFromNonMatch = prior !== undefined && !matches(prior) && matches(text);
        // Existing matching nodes are historical evidence. Only a newly
        // inserted node or an existing node that changed into a rate-limit
        // message belongs to this request.
        if (!isNewNode && !changedFromNonMatch) return;
        const messageId = element.getAttribute("data-message-id") || element.getAttribute("data-testid") || "";
        const signature = `${kind}|${messageId}|${element.tagName}|${text}`;
        if (state.seen.has(signature)) return;
        state.seen.add(signature);
        state.records.push({
          at: Date.now(),
          kind,
          fresh: true,
          text,
          tagName: element.tagName,
          role: element.getAttribute("role") || null,
          messageId: messageId || null,
          signature,
        });
      };
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "childList") {
            record(mutation.target, "child-list");
            for (const node of mutation.addedNodes || []) {
              record(node, "added");
              if (node.querySelectorAll) for (const child of node.querySelectorAll("*")) record(child, "added");
            }
          } else if (mutation.type === "characterData") {
            record(mutation.target, "text");
          } else if (mutation.type === "attributes") {
            record(mutation.target, "attribute");
          }
        }
      });
      observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["class", "id", "role", "aria-live", "data-state", "data-message-author-role", "data-testid"],
      });
      state.observer = observer;
      window[key] = state;
    }, { key: token, requestId, requestTimestamp });
    return token;
  }
  async collectRateLimitEvidence(page, token) {
    if (!token) return [];
    return page.evaluate((key) => window[key]?.records || [], token).catch(() => []);
  }
  async stopRateLimitObserver(page, token) {
    if (!token) return;
    await page.evaluate((key) => {
      const state = window[key];
      if (state?.observer) state.observer.disconnect();
      if (state) delete window[key];
    }, token).catch(() => {});
  }
  async messageSnapshot(page) {
    return page.locator("[data-message-author-role]").evaluateAll((nodes) => nodes.map((node) => ({
      role: node.getAttribute("data-message-author-role"),
      id: node.getAttribute("data-message-id") || node.getAttribute("data-testid") || null,
      text: String(node.innerText || node.textContent || "").trim().slice(0, 400),
    }))).catch(() => []);
  }
  async health({ conversationId = null } = {}) {
    const browser = await this.connect();
    try {
      const page = await this.page(browser, conversationId);
      await this.dismissHistoricalRateLimitDialog(page);
      const body = await page.locator("body").innerText({ timeout: 8_000 }).catch(() => "");
      const signals = pageSignals(body);
      const composers = await page.locator("textarea, [contenteditable='true']").count();
      return {
        available: true,
        reachable: true,
        authenticated: !signals.login && !signals.security && composers > 0,
        uiDetected: composers > 0,
        ready: !signals.login && !signals.security && composers > 0,
        state: signals.security ? "SECURITY_PAUSED" : signals.login ? "CHATGPT_LOGIN_REQUIRED" : composers > 0 ? "READY" : "CHATGPT_UI_CHANGED",
        // Informational only. This is deliberately never promoted to a
        // current rate-limit state because health did not send a request.
        historicalRateLimitTextPresent: signals.rateLimit.matched,
      };
    } finally { await this.disconnect(browser); }
  }
  async readLatest({ conversationId }) {
    const browser = await this.connect();
    try {
      const page = await this.page(browser, conversationId);
      await this.dismissHistoricalRateLimitDialog(page);
      const body = await page.locator("body").innerText({ timeout: 8_000 }).catch(() => "");
      const signals = pageSignals(body);
      if (signals.security) throw new ChatGPTSecurityPaused();
      if (signals.login) throw new ChatGPTLoginRequired();
      const responses = page.locator("[data-message-author-role='assistant']");
      const deadline = Date.now() + 12_000;
      let count = await responses.count();
      while (!count && Date.now() < deadline) { await page.waitForTimeout(750); count = await responses.count(); }
      if (!count) return null;
      return { text: (await responses.nth(count - 1).innerText({ timeout: 8_000 })).trim(), conversationId, ui: "detected" };
    } finally { await this.disconnect(browser); }
  }
  async transcript({ conversationId }) {
    const browser = await this.connect();
    try {
      const page = await this.page(browser, conversationId);
      const body = await page.locator("body").innerText({ timeout: 8_000 }).catch(() => "");
      const signals = pageSignals(body);
      if (signals.security) throw new ChatGPTSecurityPaused();
      if (signals.login) throw new ChatGPTLoginRequired();
      const messages = page.locator("[data-message-author-role]");
      const count = await messages.count();
      const entries = [];
      for (let index = 0; index < count; index += 1) {
        const message = messages.nth(index);
        entries.push({
          role: await message.getAttribute("data-message-author-role").catch(() => null),
          text: (await message.innerText({ timeout: 8_000 }).catch(() => "")).trim(),
        });
      }
      return { conversationId, entries: entries.filter((entry) => entry.text) };
    } finally { await this.disconnect(browser); }
  }
  async readyComposer(page) {
    const deadline = Date.now() + 20_000;
    while (Date.now() < deadline) {
      const candidates = await page.locator("textarea, [contenteditable='true']").all();
      for (const candidate of candidates.reverse()) {
        if (await candidate.isVisible().catch(() => false) && await candidate.isEnabled().catch(() => false)) return candidate;
      }
      await page.waitForTimeout(500);
    }
    throw new ChatGPTUiChanged("ChatGPT loaded, but no enabled visible composer appeared within 20 seconds.");
  }
  async fillComposer(page, prompt) {
    let lastError = null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const composer = await this.readyComposer(page);
      try { await composer.fill(prompt, { timeout: 15_000 }); return composer; }
      catch (error) { lastError = error; await page.waitForTimeout(1_000); }
    }
    throw lastError || new ChatGPTUiChanged("ChatGPT composer could not accept the prompt.");
  }
  async send({ conversationId, prompt, timeoutMs, onSent = null, requestId = null }) {
    const browser = await this.connect();
    let observerToken = null;
    try {
      const page = await this.page(browser, conversationId);
      await this.dismissHistoricalRateLimitDialog(page);
      const body = await page.locator("body").innerText({ timeout: 8_000 }).catch(() => "");
      const signals = pageSignals(body);
      if (signals.security) throw new ChatGPTSecurityPaused();
      if (signals.login) throw new ChatGPTLoginRequired();
      const responses = page.locator("[data-message-author-role='assistant']");
      const before = await responses.count();
      const beforeMessages = await this.messageSnapshot(page);
      const composer = await this.fillComposer(page, prompt);
      const requestTimestamp = Date.now();
      observerToken = await this.installRateLimitObserver(page, { requestId, requestTimestamp });
      const send = page.getByRole("button", { name: /send prompt|send/i });
      if (await send.count() && await send.last().isEnabled()) await send.last().click({ timeout: 15_000 });
      else await composer.press("Enter", { timeout: 15_000 });
      await page.waitForTimeout(500);
      const sentConversationId = page.url().match(/\/c\/([^/?#]+)/)?.[1] || conversationId || null;
      if (onSent) await onSent(sentConversationId);
      const began = Date.now(); let previous = ""; let stableSince = 0;
      while (Date.now() - began < timeoutMs) {
        await page.waitForTimeout(1_000);
        const freshRecords = freshRateLimitEvidence(await this.collectRateLimitEvidence(page, observerToken), { requestTimestamp });
        if (freshRecords.length) {
          const evidence = freshRecords[0];
          const signal = rateLimitSignal(evidence.text);
          throw new ChatGPTRateLimited("ChatGPT returned a fresh rate-limit response for this request.", {
            retryAfterMs: signal.waitMs,
            source: "send",
            fresh: true,
            requestId,
            requestTimestamp,
            evidence: { records: freshRecords.slice(0, 8), beforeMessages },
          });
        }
        const liveBody = await page.locator("body").innerText({ timeout: 8_000 }).catch(() => "");
        const liveSignals = pageSignals(liveBody);
        if (liveSignals.security) throw new ChatGPTSecurityPaused();
        if (liveSignals.login) throw new ChatGPTLoginRequired();
        const count = await responses.count();
        const answer = count > before ? (await responses.nth(count - 1).innerText({ timeout: 8_000 }).catch(() => "")).trim() : "";
        const stopButtons = await page.getByRole("button", { name: /stop generating|stop streaming/i }).all();
        const stopping = (await Promise.all(stopButtons.map((button) => button.isVisible().catch(() => false)))).some(Boolean);
        if (answer && answer === previous && !stopping) {
          if (!stableSince) stableSince = Date.now();
          if (Date.now() - stableSince >= 2_000) {
            const afterMessages = await this.messageSnapshot(page);
            const newAssistant = afterMessages.filter((entry) => entry.role === "assistant" && (!entry.id || !beforeMessages.some((beforeEntry) => beforeEntry.role === "assistant" && beforeEntry.id === entry.id)));
            return {
              text: answer,
              conversationId: (page.url().match(/\/c\/([^/?#]+)/)?.[1] || conversationId || null),
              responseMessageId: newAssistant.at(-1)?.id || null,
              requestId,
              requestTimestamp,
              beforeMessageIds: beforeMessages.map((entry) => entry.id).filter(Boolean),
              ui: "detected",
            };
          }
        }
        else stableSince = 0;
        previous = answer;
      }
      throw new ChatGPTTimeout();
    } finally {
      // Stop the request-scoped observer before detaching from the user's
      // browser. Historical warning nodes are never consulted after this.
      try {
        const pages = browser.contexts?.()[0]?.pages?.() || [];
        const page = pages.find((candidate) => conversationId && candidate.url().includes(`/c/${conversationId}`)) || pages.at(-1);
        if (page && observerToken) await this.stopRateLimitObserver(page, observerToken);
      } catch { /* browser may already be gone; the request result is final */ }
      await this.disconnect(browser);
    }
  }
}

export function chatgptBrowserConfig(env = process.env) {
  return {
    provider: "chatgpt-browser",
    model: "chatgpt-web",
    browserCdpConfigured: Boolean(env.CHATGPT_BROWSER_CDP_URL || env.MAPKAI_CHROME_CDP_URL),
    autoDetect: bool(env.EDITORIAL_PROVIDER_AUTO_DETECT_CHATGPT_BROWSER),
    timeoutMs: Math.max(10_000, Number(env.CHATGPT_BROWSER_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS),
    minRequestIntervalMs: numericEnv(env, "CHATGPT_BROWSER_MIN_REQUEST_INTERVAL_MS", DEFAULT_MIN_REQUEST_INTERVAL_MS, { max: 60_000 }),
    healthCacheMs: numericEnv(env, "CHATGPT_BROWSER_HEALTH_CACHE_MS", DEFAULT_HEALTH_CACHE_MS, { max: 300_000 }),
    rateLimitBackoffMs: DEFAULT_RATE_LIMIT_BACKOFF_MS.slice(),
  };
}

export function createChatGPTBrowserProvider({ env = process.env, logger = () => {}, transport = null } = {}) {
  const config = chatgptBrowserConfig(env);
  const runtime = env.CHATGPT_BROWSER_RUNTIME_DIR ? path.resolve(env.CHATGPT_BROWSER_RUNTIME_DIR) : path.join(FACTORY, "runtime", "chatgpt-browser");
  const auditRoot = path.join(runtime, "audit");
  const conversationsPath = path.join(runtime, "conversations.json");
  const ui = transport || new PlaywrightChatGPTTransport({ env });
  const chatBaseUrl = (env.CHATGPT_BROWSER_URL || "https://chatgpt.com").replace(/\/$/, "");
  let uiTail = Promise.resolve();
  let requestTail = Promise.resolve();
  let healthCache = null;
  let healthCacheAt = 0;

  function normalizeRegistry(value) {
    const data = value && typeof value === "object" ? value : {};
    data.schemaVersion = Math.max(2, Number(data.schemaVersion) || 1);
    data.conversations ||= {};
    data.completedStages ||= {};
    data.inFlightByFieldStage ||= {};
    data.stageStates ||= {};
    data.rateLimit ||= { status: "CLEAR", attempt: 0, retryAt: null, retryAfterMs: null, detectedAt: null, lastClearedAt: null };
    data.throttle ||= { lastSentAt: null, lastCompletedAt: null, lastRequestId: null };
    return data;
  }
  async function registry() { return normalizeRegistry(await readJson(conversationsPath, { schemaVersion: 2, conversations: {}, completedStages: {}, inFlightByFieldStage: {}, stageStates: {}, rateLimit: { status: "CLEAR", attempt: 0 }, throttle: {} })); }
  async function saveRegistry(value) { await writeJson(conversationsPath, value); }
  function purposeFor(field, explicitName = null) { return explicitName || `MapKAI Editorial — ${fieldDisplayName(field)}`; }
  function conversationUrl(conversationId) { return conversationId ? `${chatBaseUrl}/c/${conversationId}` : null; }

  // Some earlier persisted rate-limit records were written without retryAt.
  // A missing retryAt must not become an infinite cooldown when a reliable
  // detectedAt and backoff attempt are available. Derive the deadline from
  // the recorded event and keep the one-probe guard in force.
  function effectiveRateLimitDeadline(state) {
    if (!state || state.status !== "CHATGPT_RATE_LIMITED") return null;
    const persistedRetryAtMs = Date.parse(state.retryAt || "");
    if (Number.isFinite(persistedRetryAtMs)) {
      return {
        retryAtMs: persistedRetryAtMs,
        retryAt: state.retryAt,
        retryAfterMs: Number.isFinite(Number(state.retryAfterMs)) ? Number(state.retryAfterMs) : Math.max(0, persistedRetryAtMs - Date.now()),
        derived: false,
      };
    }
    const detectedAtMs = Date.parse(state.detectedAt || "");
    if (!Number.isFinite(detectedAtMs)) return null;
    const attempt = Math.min(config.rateLimitBackoffMs.length, Math.max(1, Number(state.attempt) || 1));
    const configuredWaitMs = config.rateLimitBackoffMs[attempt - 1] || config.rateLimitBackoffMs.at(-1);
    const explicitWaitMs = Number(state.retryAfterMs);
    const waitMs = Number.isFinite(explicitWaitMs) && explicitWaitMs > 0 ? explicitWaitMs : configuredWaitMs;
    const retryAtMs = detectedAtMs + waitMs;
    return { retryAtMs, retryAt: new Date(retryAtMs).toISOString(), retryAfterMs: waitMs, derived: true };
  }

  async function recoverConversationFromAudit(fieldKey) {
    const root = path.join(auditRoot, fieldKey);
    if (!existsSync(root)) return null;
    const stages = await readdir(root).catch(() => []);
    for (const stage of stages) {
      const attempts = await readdir(path.join(root, stage)).catch(() => []);
      for (const attempt of attempts) {
        const metadata = await readJson(path.join(root, stage, attempt, "attempt.json"), null).catch(() => null);
        const id = metadata?.conversation?.id;
        if (id) return { conversationId: id, purpose: metadata.conversation.purpose || null, conversationUrl: metadata.conversation.url || conversationUrl(id) };
      }
    }
    return null;
  }

  async function serializedUi(operation) {
    const run = uiTail.then(operation, operation);
    uiTail = run.catch(() => {});
    return run;
  }

  async function serializedRequest(operation) {
    const run = requestTail.then(operation, operation);
    requestTail = run.catch(() => {});
    return run;
  }

  function rateLimitFromState(data) {
    const state = data?.rateLimit;
    if (!state || state.status !== "CHATGPT_RATE_LIMITED") return null;
    const deadline = effectiveRateLimitDeadline(state);
    if (!deadline) {
      return new ChatGPTRateLimited("ChatGPT is rate limited and no retry time is known. No refresh, retry, or new conversation will be attempted until the state is explicitly resumed.", { source: "persisted_state" });
    }
    if (deadline.retryAtMs > Date.now()) {
      return new ChatGPTRateLimited(
        `ChatGPT is rate limited until ${deadline.retryAt}. No refresh, retry, or new conversation will be attempted.`,
        { retryAt: deadline.retryAt, retryAfterMs: deadline.retryAtMs - Date.now(), source: deadline.derived ? "persisted_state_derived_deadline" : "persisted_state" },
      );
    }
    if (state.probe?.status === "ATTEMPTED") {
      return new ChatGPTRateLimited(
        "The cooldown elapsed, but the one permitted recovery probe already has an unresolved outcome. An explicit resume is required; no second probe will be sent.",
        { retryAt: deadline.retryAt, source: "recovery_probe" },
      );
    }
    return null;
  }

  function isRateLimitError(error) {
    return error?.code === "CHATGPT_RATE_LIMITED" || rateLimitSignal(error?.message || error).matched;
  }

  async function persistRateLimit(error, { field = null, stage = null } = {}) {
    const data = await registry();
    const previous = data.rateLimit || {};
    const attempt = previous.status === "CHATGPT_RATE_LIMITED" ? Math.min(3, Math.max(1, Number(previous.attempt) || 1) + 1) : 1;
    const explicitWait = Number(error?.retryAfterMs) || null;
    const baseWait = config.rateLimitBackoffMs[Math.min(attempt, config.rateLimitBackoffMs.length) - 1] || config.rateLimitBackoffMs.at(-1);
    const waitMs = Math.max(baseWait, explicitWait || 0);
    const detectedAt = now();
    const retryAt = new Date(Date.now() + waitMs).toISOString();
    data.rateLimit = {
      status: "CHATGPT_RATE_LIMITED",
      attempt,
      detectedAt,
      retryAt,
      retryAfterMs: waitMs,
      reason: String(error?.message || error || "ChatGPT rate limit").slice(0, 500),
      field,
      stage,
      source: error?.source || "browser",
      fresh: error?.fresh === true,
      requestId: error?.requestId || null,
      requestTimestamp: error?.requestTimestamp || null,
      evidence: error?.evidence || null,
      probe: null,
    };
    data.channel = {
      ...(data.channel || {}),
      status: "RATE_LIMITED",
      detectedAt,
      requestId: error?.requestId || null,
      field,
      stage,
    };
    healthCache = null;
    healthCacheAt = 0;
    if (field && stage) {
      const pendingKey = `${field}:${stage}`;
      data.stageStates[pendingKey] = {
        ...(data.stageStates[pendingKey] || {}),
        status: "CHATGPT_RATE_LIMITED",
        field,
        stage,
        requestId: data.stageStates[pendingKey]?.requestId || null,
        updatedAt: detectedAt,
        retryAt,
        retryAfterMs: waitMs,
      };
    }
    await saveRegistry(data);
    logger({ event: "CHATGPT_RATE_LIMITED", provider: "chatgpt-browser", field, stage, attempt, retryAt, retryAfterMs: waitMs });
    error.retryAfterMs = waitMs;
    error.retryAt = retryAt;
    error.rateLimitPersisted = true;
    return data;
  }

  async function clearRateLimit(data, { field = null, stage = null, requestId = null, reason = "response" } = {}) {
    if (!data?.rateLimit || data.rateLimit.status !== "CHATGPT_RATE_LIMITED") return false;
    const clearedAt = now();
    data.rateLimit = {
      ...data.rateLimit,
      status: "CLEAR",
      lastClearedAt: clearedAt,
      clearedAfterAttempt: data.rateLimit.attempt,
      retryAt: null,
      retryAfterMs: null,
      clearReason: reason,
      recoveredByRequestId: requestId || null,
      recoveredAt: clearedAt,
      probe: data.rateLimit.probe ? { ...data.rateLimit.probe, status: "RECOVERED", recoveredAt: clearedAt, requestId: requestId || data.rateLimit.probe.requestId || null } : null,
    };
    data.channel = {
      ...(data.channel || {}),
      status: "RECOVERED",
      recoveredAt: clearedAt,
      requestId: requestId || null,
      field,
      stage,
    };
    logger({ event: "CHATGPT_CHANNEL_RECOVERED", provider: "chatgpt-browser", field, stage, requestId, recoveredAt: clearedAt, reason });
    return true;
  }

  async function waitForRequestGap(data, { field, stage, requestId }) {
    const previous = [data?.throttle?.lastSentAt, data?.throttle?.lastCompletedAt]
      .map((value) => Date.parse(value || ""))
      .filter(Number.isFinite)
      .reduce((max, value) => Math.max(max, value), 0);
    const remaining = config.minRequestIntervalMs - (Date.now() - previous);
    if (remaining > 0) {
      logger({ event: "CHATGPT_THROTTLE_WAIT", provider: "chatgpt-browser", field, stage, requestId, waitMs: remaining });
      await sleep(remaining);
    }
  }

  async function markRequestStarted(data, { field, stage, requestId, promptSha256, conversationId = null }) {
    const sentAt = now();
    const deadline = effectiveRateLimitDeadline(data.rateLimit);
    const retryAtMs = deadline?.retryAtMs || NaN;
    const recoveryProbe = data.rateLimit?.status === "CHATGPT_RATE_LIMITED"
      && (!Number.isFinite(retryAtMs) || retryAtMs <= Date.now())
      && !data.rateLimit?.probe?.requestId;
    if (recoveryProbe) {
      data.rateLimit = {
        ...data.rateLimit,
        ...(deadline?.derived && !data.rateLimit.retryAt ? { retryAt: deadline.retryAt, retryAfterMs: deadline.retryAfterMs, retryAtSource: "derived_detectedAt_backoff" } : {}),
        probe: { status: "ATTEMPTED", requestId, field, stage, sentAt },
      };
    }
    data.throttle ||= {};
    data.throttle.lastSentAt = sentAt;
    data.throttle.lastRequestId = requestId;
    data.stageStates ||= {};
    data.stageStates[`${field}:${stage}`] = {
      ...(data.stageStates[`${field}:${stage}`] || {}),
      status: "PENDING",
      field,
      stage,
      requestId,
      promptSha256,
      conversationId,
      sentAt,
      recoveryProbe,
      updatedAt: sentAt,
    };
    await saveRegistry(data);
    return sentAt;
  }

  async function markRequestCompleted(data, { field, stage, requestId, promptSha256, conversationId, rawResponsePath, completedAt }) {
    data.throttle ||= {};
    data.throttle.lastCompletedAt = completedAt;
    data.throttle.lastRequestId = requestId;
    data.stageStates ||= {};
    data.stageStates[`${field}:${stage}`] = {
      ...(data.stageStates[`${field}:${stage}`] || {}),
      status: "COMPLETE",
      field,
      stage,
      requestId,
      promptSha256,
      conversationId,
      completedAt,
      rawResponsePath,
      updatedAt: completedAt,
    };
    await clearRateLimit(data, { field, stage, requestId, reason: "completed_response" });
  }

  async function guardRateLimit() {
    const data = await registry();
    const blocked = rateLimitFromState(data);
    if (blocked) throw blocked;
    return data;
  }

  async function invokeUi(operation) {
    return serializedUi(operation);
  }
  async function openThread({ field, name = null } = {}) {
    const fieldKey = slug(field || name);
    const data = await registry();
    let current = data.conversations[fieldKey] || null;
    if (!current?.conversationId) {
      const recovered = await recoverConversationFromAudit(fieldKey);
      if (recovered?.conversationId) {
        current = { ...recovered, purpose: recovered.purpose || purposeFor(field, name), updatedAt: now() };
        data.conversations[fieldKey] = current;
        await saveRegistry(data);
      }
    }
    const requestedPurpose = purposeFor(field, name);
    const purpose = current?.purpose || requestedPurpose;
    // Keep the existing conversation ID, while upgrading legacy code-only
    // labels (for example `0311`) to the human-readable field name supplied by
    // the caller. This is metadata only; it never creates a second thread.
    const legacyPurpose = `MapKAI Editorial — ${String(field || "unknown")}`;
    if (current?.conversationId && name && current.purpose !== requestedPurpose && current.purpose === legacyPurpose) {
      data.conversations[fieldKey] = { ...current, purpose: requestedPurpose, updatedAt: now() };
      await saveRegistry(data);
    }
    return {
      field: field || "unknown",
      fieldKey,
      name: purpose,
      conversationId: current?.conversationId || null,
      conversationUrl: current?.conversationUrl || conversationUrl(current?.conversationId || null),
      exists: Boolean(current?.conversationId),
      creation: current?.conversationId ? "reused" : "lazy_on_first_message",
      rateLimit: data.rateLimit?.status === "CHATGPT_RATE_LIMITED" ? { ...data.rateLimit } : null,
    };
  }
  async function createThread(field, name = null) { return openThread({ field, name }); }
  async function reuseThread(field) { return openThread({ field }); }
  async function healthCheck({ conversationId = null, force = false } = {}) {
    const data = await registry();
    const blocked = rateLimitFromState(data);
    if (blocked) return {
      available: false,
      reachable: true,
      authenticated: false,
      uiDetected: false,
      ready: false,
      state: blocked.code,
      detail: blocked.message,
      retryAt: blocked.retryAt,
      retryAfterMs: blocked.retryAfterMs,
      recoveryProbeAllowed: false,
    };
    // A healthy signed-in session is sufficient for any known field thread during
    // the short cache window; do not reopen the browser just because the thread
    // ID became known after the first send.
    const cacheMatches = Boolean(healthCache);
    if (!force && cacheMatches && Date.now() - healthCacheAt < config.healthCacheMs) return { ...healthCache, cached: true };
    try {
      const result = await invokeUi(() => ui.health({ conversationId }));
      const recoveryProbeAllowed = data.rateLimit?.status === "CHATGPT_RATE_LIMITED";
      healthCache = { ...result, conversationId, recoveryProbeAllowed };
      healthCacheAt = Date.now();
      return { ...result, conversationId, recoveryProbeAllowed };
    }
    catch (error) {
      if (isRateLimitError(error)) {
        // A health check does not submit a request. Even if a custom
        // transport reports rate-limit text here, it cannot establish that the
        // text belongs to a fresh request, so never start/extend cooldown.
        return {
          available: false,
          reachable: true,
          authenticated: false,
          uiDetected: false,
          ready: false,
          state: "CHATGPT_HEALTH_UNCERTAIN",
          detail: "Health check observed rate-limit text without a request-scoped mutation; it was ignored as historical evidence.",
          historicalRateLimitTextPresent: true,
          recoveryProbeAllowed: false,
        };
      }
      if (error instanceof ChatGPTBrowserError) return { available: false, reachable: false, authenticated: false, uiDetected: false, ready: false, state: error.code, detail: error.message };
      throw error;
    }
  }

  function assertHealthy(health) {
    if (health.state === "CHATGPT_RATE_LIMITED") throw new ChatGPTRateLimited(health.detail, { retryAt: health.retryAt, retryAfterMs: health.retryAfterMs, source: "health", rateLimitPersisted: health.rateLimitPersisted === true });
    if (health.state === "CHATGPT_LOGIN_REQUIRED") throw new ChatGPTLoginRequired(health.detail);
    if (health.state === "SECURITY_PAUSED") throw new ChatGPTSecurityPaused(health.detail);
    if (!health.ready) throw new ChatGPTUiChanged("ChatGPT is reachable but its authenticated composer was not detected.");
    return health;
  }

  async function ensureReady(conversationId = null) {
    return assertHealthy(await healthCheck({ conversationId }));
  }
  async function call({ stage, prompt, schemaName, context = {}, correction = false }) {
    const field = context.field || "unknown";
    const attemptId = context.attemptId || `${slug(field)}-${randomUUID()}`;
    const promptHash = hash(prompt);
    const stageKey = hash(JSON.stringify({ stage, field, schemaName, promptHash, promptVersion: context.promptVersion || null, canonVersion: context.canonVersion || null }));
    let data = await registry();
    const cached = data.completedStages?.[stageKey];
    const stateCached = data.stageStates?.[`${field}:${stage}`];
    const cachedPath = cached?.parsedPath || (stateCached?.status === "COMPLETE" && stateCached.promptSha256 === promptHash ? stateCached.parsedResponsePath : null);
    if (cachedPath && existsSync(cachedPath)) {
      logger({ event: "MODEL_CALL_REUSED", provider: "chatgpt-browser", stage, field, attemptId: cached?.attemptId || stateCached?.requestId, rawResponsePath: cached?.rawResponsePath || stateCached?.rawResponsePath });
      return JSON.parse(await readFile(cachedPath, "utf8"));
    }
    const schema = await schemaFor(schemaName);
    const fieldKey = slug(field);
    const existing = data.conversations[fieldKey];
    const purpose = existing?.purpose || purposeFor(field, context.fieldName);
    const pendingKey = `${field}:${stage}`;
    const auditDir = path.join(auditRoot, fieldKey, slug(stage), slug(attemptId));
    let latestError = null;
    for (let repair = 0; repair <= MAX_JSON_REPAIR_TURNS; repair += 1) {
      const isolation = `[MapKAI dedicated editorial conversation: ${fieldDisplayName(field)}. Stage: ${stage}. Treat preceding messages in this same field conversation as primary editorial context; do not draw on unrelated fields or drafts. Return the requested JSON only.]`;
      const contract = `\n\nSTRICT JSON CONTRACT — return exactly one object matching this JSON Schema (no markdown, commentary, or extra fields):\n${JSON.stringify(schema)}`;
      const request = repair === 0 ? `${existing?.conversationId ? isolation : `${isolation}\nThis is the dedicated MapKAI Editorial conversation for this field; keep it isolated from other fields.`}\n\n${prompt}${contract}` : `${isolation}\n\n${prompt}${contract}\n\nYour previous answer failed local JSON/schema validation: ${latestError}. Return only one corrected JSON object. Do not omit any required fields or invent a replacement task.`;
      const startedAt = now();
      logger({ event: "MODEL_CALL_STARTED", provider: "chatgpt-browser", stage, field, attemptId, correction: repair > 0, startedAt });
      const savedInFlight = repair === 0 ? data.inFlightByFieldStage?.[pendingKey] : null;
      const savedState = repair === 0 ? data.stageStates?.[pendingKey] : null;
      if ((savedInFlight && !savedInFlight.promptSha256) || (savedState?.status === "PENDING" && !savedState.promptSha256)) {
        data.stageStates[pendingKey] = { ...(data.stageStates[pendingKey] || {}), status: "UNKNOWN_INFLIGHT", updatedAt: now(), reason: "missing_prompt_hash" };
        await saveRegistry(data);
        logger({ event: "UNKNOWN_INFLIGHT_STAGE", provider: "chatgpt-browser", stage, field, attemptId: savedInFlight?.attemptId || savedState?.requestId, reason: "missing_prompt_hash" });
        throw new ChatGPTStageIndeterminate();
      }
      const recovered = savedInFlight?.promptSha256 === promptHash ? savedInFlight : savedState?.status === "PENDING" && savedState.promptSha256 === promptHash ? savedState : null;
      if ((savedInFlight || savedState?.status === "PENDING") && !recovered) {
        delete data.inFlightByFieldStage[pendingKey];
        if (data.stageStates?.[pendingKey]) data.stageStates[pendingKey] = { ...data.stageStates[pendingKey], status: "SUPERSEDED", updatedAt: now() };
        await saveRegistry(data);
        logger({ event: "STALE_INFLIGHT_STAGE_CLEARED", provider: "chatgpt-browser", stage, field, attemptId: savedInFlight?.attemptId || savedState?.requestId, reason: "prompt_hash_changed" });
      }
      let response;
      if (recovered) {
        if (!recovered.conversationId) throw new ChatGPTTimeout("A previously sent ChatGPT stage has no persisted conversation ID; it was not resent.");
        data = await guardRateLimit();
        try { response = await invokeUi(() => ui.readLatest({ conversationId: recovered.conversationId })); }
        catch (error) { if (isRateLimitError(error) && !error.rateLimitPersisted) await persistRateLimit(error, { field, stage }); throw error; }
      } else {
        try {
          response = await serializedRequest(async () => {
            data = await guardRateLimit();
            const activeExisting = data.conversations[fieldKey] || existing;
            await ensureReady(activeExisting?.conversationId || null);
            await waitForRequestGap(data, { field, stage, requestId: attemptId });
            await markRequestStarted(data, { field, stage, requestId: attemptId, promptSha256: promptHash, conversationId: activeExisting?.conversationId || null });
            return invokeUi(() => ui.send({ conversationId: activeExisting?.conversationId || null, prompt: request, timeoutMs: config.timeoutMs, requestId: attemptId, onSent: async (conversationId) => {
            data.conversations[fieldKey] = { ...(data.conversations[fieldKey] || {}), conversationId, conversationUrl: conversationUrl(conversationId), purpose, updatedAt: now() };
              data.inFlightByFieldStage ||= {};
              data.inFlightByFieldStage[pendingKey] = { conversationId, attemptId, promptSha256: promptHash, sentAt: now() };
              data.stageStates[pendingKey] = { ...(data.stageStates[pendingKey] || {}), status: "PENDING", conversationId, requestId: attemptId, promptSha256: promptHash, sentAt: data.inFlightByFieldStage[pendingKey].sentAt, updatedAt: now() };
              await saveRegistry(data);
            } }));
          });
        }
        catch (error) { if (isRateLimitError(error) && !error.rateLimitPersisted) await persistRateLimit(error, { field, stage }); throw error; }
      }
      if (!response) throw new ChatGPTTimeout("A previously sent ChatGPT stage has no visible assistant response yet; it was not resent.");
      // A normal response is the recovery probe's proof of life. Clear the
      // persisted cooldown before parsing so a schema repair is not mistaken
      // for another recovery attempt.
      if (await clearRateLimit(data, { field, stage, requestId: attemptId, reason: "normal_response" })) await saveRegistry(data);
      const rawPath = path.join(auditDir, repair ? `raw-response-repair-${repair}.md` : "raw-response.md");
      await writeText(rawPath, response.text);
      const settledAt = now();
      data.throttle ||= {};
      data.throttle.lastCompletedAt = settledAt;
      data.throttle.lastRequestId = attemptId;
      let parsed; let errors = [];
      try { parsed = extractJson(response.text); errors = validateSchema(parsed, schema); if (errors.length) throw new Error(errors.join("; ")); }
      catch (error) {
        latestError = error instanceof Error ? error.message : String(error);
        data.stageStates[pendingKey] = { ...(data.stageStates[pendingKey] || {}), status: "REPAIR_REQUIRED", requestId: attemptId, promptSha256: promptHash, conversationId: response.conversationId || existing?.conversationId || recovered?.conversationId || null, rawResponsePath: rawPath, updatedAt: settledAt };
        if (data.inFlightByFieldStage) delete data.inFlightByFieldStage[pendingKey];
        await writeJson(path.join(auditDir, repair ? `schema-result-repair-${repair}.json` : "schema-result.json"), { valid: false, errors: [latestError] });
        await saveRegistry(data);
        logger({ event: "MODEL_SCHEMA_FAILED", provider: "chatgpt-browser", stage, field, attemptId, correction: repair > 0, rawResponsePath: rawPath, error: latestError.slice(0, 240) });
        continue;
      }
      const parsedPath = path.join(auditDir, "parsed-response.json");
      await writeJson(parsedPath, parsed);
      await writeJson(path.join(auditDir, "schema-result.json"), { valid: true, errors: [] });
      const completedAt = now();
      const conversationId = response.conversationId || existing?.conversationId || recovered?.conversationId || null;
      await writeJson(path.join(auditDir, "attempt.json"), { schemaVersion: 1, provider: "chatgpt-browser", stage, field, requestId: attemptId, attemptId, status: "COMPLETE", promptVersion: context.promptVersion || null, canonVersion: context.canonVersion || null, promptSha256: promptHash, timestamp: startedAt, completedAt, requestTimestamp: response.requestTimestamp || null, responseMessageId: response.responseMessageId || null, conversation: { id: conversationId, url: conversationUrl(conversationId), purpose, reused: Boolean(existing?.conversationId) }, rawResponsePath: rawPath, parsedResponsePath: parsedPath, schemaResult: { valid: true, errors: [] }, security: { credentialsReadOrSaved: false } });
      data.conversations[fieldKey] = { ...(data.conversations[fieldKey] || {}), conversationId, conversationUrl: conversationUrl(conversationId), purpose, updatedAt: completedAt };
      data.completedStages[stageKey] = { attemptId, parsedPath, rawResponsePath: rawPath, completedAt };
      await markRequestCompleted(data, { field, stage, requestId: attemptId, promptSha256: promptHash, conversationId, rawResponsePath: rawPath, completedAt });
      if (data.stageStates?.[pendingKey]) data.stageStates[pendingKey].parsedResponsePath = parsedPath;
      if (data.inFlightByFieldStage) delete data.inFlightByFieldStage[pendingKey];
      await saveRegistry(data);
      logger({ event: "MODEL_CALL_SUCCEEDED", provider: "chatgpt-browser", stage, field, attemptId, correction: repair > 0, rawResponsePath: rawPath, schemaValid: true });
      return parsed;
    }
    const failure = new Error(`ChatGPT returned invalid ${schemaName} JSON after ${MAX_JSON_REPAIR_TURNS + 1} attempt(s): ${latestError}`); failure.code = "EDITORIAL_INVALID_JSON"; throw failure;
  }
  async function sendMessage(thread, message, { stage = "conversation", context = {}, reuseCompleted = true, forceResend = false } = {}) {
    const field = typeof thread === "string" ? thread : thread?.field || "unknown";
    const threadName = typeof thread === "string" ? null : thread?.name || null;
    const fieldKey = slug(field);
    const attemptId = context.attemptId || `${fieldKey}-${slug(stage)}-${randomUUID()}`;
    const promptHash = hash(message);
    const naturalStageKey = hash(JSON.stringify({ type: "natural", stage, field, promptHash, promptVersion: context.promptVersion || null, canonVersion: context.canonVersion || null }));
    let data = await registry();
    const pendingKey = `${field}:${stage}`;
    const cached = data.completedStages?.[naturalStageKey];
    const stateCached = data.stageStates?.[pendingKey];
    const cachedPath = cached?.rawResponsePath || (stateCached?.status === "COMPLETE" && stateCached.promptSha256 === promptHash ? stateCached.rawResponsePath : null);
    if (!forceResend && (reuseCompleted || cachedPath) && cachedPath && existsSync(cachedPath)) {
      const text = await readFile(cachedPath, "utf8");
      logger({ event: "CONVERSATION_MESSAGE_REUSED", provider: "chatgpt-browser", stage, field, attemptId: cached?.attemptId || stateCached?.requestId, rawResponsePath: cachedPath });
      const reusedConversationId = data.conversations[fieldKey]?.conversationId || stateCached?.conversationId || null;
      return { text: text.trim(), conversationId: reusedConversationId, conversationUrl: data.conversations[fieldKey]?.conversationUrl || conversationUrl(reusedConversationId), reused: true };
    }
    const existing = data.conversations[fieldKey];
    const purpose = existing?.purpose || threadName || purposeFor(field, context.fieldName);
    const savedInFlight = data.inFlightByFieldStage?.[pendingKey];
    if ((savedInFlight && !savedInFlight.promptSha256) || (stateCached?.status === "PENDING" && !stateCached.promptSha256)) {
      data.stageStates[pendingKey] = { ...(data.stageStates[pendingKey] || {}), status: "UNKNOWN_INFLIGHT", updatedAt: now(), reason: "missing_prompt_hash" };
      await saveRegistry(data);
      logger({ event: "UNKNOWN_INFLIGHT_STAGE", provider: "chatgpt-browser", stage, field, attemptId: savedInFlight?.attemptId || stateCached?.requestId, reason: "missing_prompt_hash" });
      throw new ChatGPTStageIndeterminate();
    }
    const recovered = !forceResend && savedInFlight?.promptSha256 === promptHash ? savedInFlight : !forceResend && stateCached?.status === "PENDING" && stateCached.promptSha256 === promptHash ? stateCached : null;
    if ((savedInFlight || stateCached?.status === "PENDING") && !recovered) {
      delete data.inFlightByFieldStage[pendingKey];
      if (data.stageStates?.[pendingKey]) data.stageStates[pendingKey] = { ...data.stageStates[pendingKey], status: "SUPERSEDED", updatedAt: now() };
      await saveRegistry(data);
      logger({ event: "STALE_INFLIGHT_STAGE_CLEARED", provider: "chatgpt-browser", stage, field, attemptId: savedInFlight?.attemptId || stateCached?.requestId, reason: "prompt_hash_changed" });
    }
    const auditDir = path.join(auditRoot, fieldKey, slug(stage), slug(attemptId));
    const sentMessagePath = path.join(auditDir, "sent-message.md");
    await writeText(sentMessagePath, message);
    const startedAt = now();
    logger({ event: "CONVERSATION_MESSAGE_STARTED", provider: "chatgpt-browser", stage, field, attemptId, startedAt, reusedConversation: Boolean(existing?.conversationId) });
    let response;
    if (recovered) {
      if (!recovered.conversationId) throw new ChatGPTTimeout("A previously sent ChatGPT message has no persisted conversation ID; it was not resent.");
      data = await guardRateLimit();
      try { response = await invokeUi(() => ui.readLatest({ conversationId: recovered.conversationId })); }
      catch (error) { if (isRateLimitError(error) && !error.rateLimitPersisted) await persistRateLimit(error, { field, stage }); throw error; }
    } else {
      try {
        response = await serializedRequest(async () => {
          data = await guardRateLimit();
          const activeExisting = data.conversations[fieldKey] || existing;
          await ensureReady(activeExisting?.conversationId || null);
          await waitForRequestGap(data, { field, stage, requestId: attemptId });
          await markRequestStarted(data, { field, stage, requestId: attemptId, promptSha256: promptHash, conversationId: activeExisting?.conversationId || null });
          return invokeUi(() => ui.send({
            conversationId: activeExisting?.conversationId || null,
            prompt: message,
            timeoutMs: config.timeoutMs,
            requestId: attemptId,
            onSent: async (conversationId) => {
              data.conversations[fieldKey] = { ...(data.conversations[fieldKey] || {}), conversationId, conversationUrl: conversationUrl(conversationId), purpose, updatedAt: now() };
              data.inFlightByFieldStage ||= {};
              data.inFlightByFieldStage[pendingKey] = { conversationId, attemptId, promptSha256: promptHash, sentAt: now() };
              data.stageStates[pendingKey] = { ...(data.stageStates[pendingKey] || {}), status: "PENDING", conversationId, requestId: attemptId, promptSha256: promptHash, sentAt: data.inFlightByFieldStage[pendingKey].sentAt, updatedAt: now() };
              await saveRegistry(data);
            },
          }));
        });
      }
      catch (error) { if (isRateLimitError(error) && !error.rateLimitPersisted) await persistRateLimit(error, { field, stage }); throw error; }
    }
    if (!response) throw new ChatGPTTimeout("A previously sent ChatGPT message has no visible assistant response yet; it was not resent.");
    if (await clearRateLimit(data, { field, stage, requestId: attemptId, reason: "normal_response" })) await saveRegistry(data);
    const rawResponsePath = path.join(auditDir, "raw-response.md");
    await writeText(rawResponsePath, response.text);
    const completedAt = now();
    const conversationId = response.conversationId || data.conversations[fieldKey]?.conversationId || existing?.conversationId || recovered?.conversationId || null;
    await writeJson(path.join(auditDir, "attempt.json"), {
      schemaVersion: 1,
      provider: "chatgpt-browser",
      kind: "natural_conversation",
      stage,
      field,
      requestId: attemptId,
      attemptId,
      status: "COMPLETE",
      promptSha256: promptHash,
      startedAt,
      completedAt,
      requestTimestamp: response.requestTimestamp || null,
      responseMessageId: response.responseMessageId || null,
      conversation: { id: conversationId, url: conversationUrl(conversationId), purpose, reused: Boolean(existing?.conversationId) },
      sentMessagePath,
      rawResponsePath,
      security: { credentialsReadOrSaved: false },
    });
    data.conversations[fieldKey] = { ...(data.conversations[fieldKey] || {}), conversationId, conversationUrl: conversationUrl(conversationId), purpose, updatedAt: completedAt };
    data.completedStages ||= {};
    data.completedStages[naturalStageKey] = { attemptId, rawResponsePath, completedAt, kind: "natural_conversation" };
    await markRequestCompleted(data, { field, stage, requestId: attemptId, promptSha256: promptHash, conversationId, rawResponsePath, completedAt });
    if (data.inFlightByFieldStage) delete data.inFlightByFieldStage[pendingKey];
    await saveRegistry(data);
    logger({ event: "CONVERSATION_MESSAGE_SUCCEEDED", provider: "chatgpt-browser", stage, field, attemptId, rawResponsePath, conversationId });
    return {
      text: response.text,
      conversationId,
      conversationUrl: conversationUrl(conversationId),
      requestId: response.requestId || attemptId,
      requestTimestamp: response.requestTimestamp || null,
      responseMessageId: response.responseMessageId || null,
      reused: false,
    };
  }
  async function waitForResponse(thread) {
    const opened = typeof thread === "string" ? await openThread({ field: thread }) : thread;
    if (!opened?.conversationId) return null;
    await guardRateLimit();
    try { return await invokeUi(() => ui.readLatest({ conversationId: opened.conversationId })); }
      catch (error) { if (isRateLimitError(error) && !error.rateLimitPersisted) await persistRateLimit(error, { field: opened.field, stage: "read_latest" }); throw error; }
  }
  async function readLatestResponse(thread) { return waitForResponse(thread); }
  async function getTranscript(thread, { refresh = false } = {}) {
    const opened = typeof thread === "string" ? await openThread({ field: thread }) : thread;
    if (refresh && opened?.conversationId && typeof ui.transcript === "function") {
      await guardRateLimit();
      try { return await invokeUi(() => ui.transcript({ conversationId: opened.conversationId })); }
      catch (error) { if (isRateLimitError(error) && !error.rateLimitPersisted) await persistRateLimit(error, { field: opened.field, stage: "transcript" }); throw error; }
    }
    const fieldKey = slug(opened?.field || thread || "unknown");
    const root = path.join(auditRoot, fieldKey);
    const entries = [];
    if (existsSync(root)) {
      for (const stage of await readdir(root).catch(() => [])) {
        const stageRoot = path.join(root, stage);
        for (const attempt of await readdir(stageRoot).catch(() => [])) {
          const responsePath = path.join(stageRoot, attempt, "raw-response.md");
          const sentMessagePath = path.join(stageRoot, attempt, "sent-message.md");
          if (existsSync(sentMessagePath)) entries.push({ stage, attempt, role: "user", text: (await readFile(sentMessagePath, "utf8")).trim() });
          if (existsSync(responsePath)) entries.push({ stage, attempt, role: "assistant", text: (await readFile(responsePath, "utf8")).trim() });
        }
      }
    }
    return { conversationId: opened?.conversationId || null, entries };
  }
  async function runEditorialJourney({ field, fieldName = null, prompts, context = {} }) {
    const thread = await openThread({ field, name: fieldName });
    const transcript = [];
    for (const [stage, message] of Object.entries(prompts?.conversation || {})) {
      if (!message) continue;
      const response = await sendMessage(thread, message, { stage, reuseCompleted: true, context: { ...context, fieldName, attemptId: `${context.attemptId || slug(field)}-${slug(stage)}` } });
      transcript.push({ stage, text: response.text, conversationId: response.conversationId, conversationUrl: response.conversationUrl || conversationUrl(response.conversationId), reused: response.reused === true });
      thread.conversationId = response.conversationId || thread.conversationId;
      thread.conversationUrl = response.conversationUrl || thread.conversationUrl || conversationUrl(thread.conversationId);
    }
    return { thread, transcript };
  }
  async function rateLimitStatus() {
    const data = await registry();
    const blocked = rateLimitFromState(data);
    const deadline = effectiveRateLimitDeadline(data.rateLimit);
    return {
      ...(data.rateLimit || { status: "CLEAR", attempt: 0 }),
      ...(deadline?.derived && !data.rateLimit?.retryAt ? { retryAt: deadline.retryAt, retryAfterMs: deadline.retryAfterMs, retryAtSource: "derived_detectedAt_backoff" } : {}),
      blocked: Boolean(blocked),
      cooldownExpired: data.rateLimit?.status === "CHATGPT_RATE_LIMITED" && Boolean(deadline) && deadline.retryAtMs <= Date.now(),
      recoveryProbePending: data.rateLimit?.probe?.status === "ATTEMPTED",
      channel: data.channel || null,
    };
  }
  return {
    config,
    healthCheck,
    rateLimitStatus,
    openThread,
    createThread,
    reuseThread,
    sendMessage,
    waitForResponse,
    readLatestResponse,
    getTranscript,
    runEditorialJourney,
    generateEditorialGuidance: (prompt, context) => call({ stage: "editorial_director", prompt, schemaName: "editorial-guidance", context }),
    critiqueEditorialGuidance: (prompt, context) => call({ stage: "editorial_critic", prompt, schemaName: "editorial-critique", context }),
    reviseEditorialGuidance: (prompt, context) => call({ stage: "editorial_reviser", prompt, schemaName: "editorial-guidance", context }),
    expandKnowledge: (prompt, context) => call({ stage: "knowledge_expander", prompt, schemaName: "knowledge-expansion", context }),
    reviewVideo: (prompt, context) => call({ stage: "video_reviewer", prompt, schemaName: "video-review", context }),
    diagnoseFailure: (prompt, context) => call({ stage: "failure_diagnoser", prompt, schemaName: "failure-diagnosis", context }),
  };
}
