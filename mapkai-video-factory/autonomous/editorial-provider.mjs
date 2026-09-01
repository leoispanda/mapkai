import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chatgptBrowserConfig, createChatGPTBrowserProvider } from "./chatgpt-browser-provider.mjs";

/**
 * Runtime boundary between the factory and an editorial model.
 * It intentionally has no local prose fallback: an unavailable provider is a
 * persisted, actionable state rather than a fake successful editorial pass.
 */
export class EditorialProviderUnavailable extends Error {
  constructor(message) {
    super(message);
    this.name = "EDITORIAL_PROVIDER_UNAVAILABLE";
    this.code = "EDITORIAL_PROVIDER_UNAVAILABLE";
  }
}

export function providerConfig(env = process.env) {
  const provider = String(env.EDITORIAL_PROVIDER || "").trim().toLowerCase();
  const autoBrowser = !provider && /^(1|true|yes)$/i.test(String(env.EDITORIAL_PROVIDER_AUTO_DETECT_CHATGPT_BROWSER || ""));
  if (!provider || provider === "chatgpt-browser" || autoBrowser) return chatgptBrowserConfig(env);
  return {
    provider: provider || "unconfigured",
    model: env.EDITORIAL_MODEL || env.OPENAI_MODEL || "gpt-5.4-mini",
    reasoningModel: env.EDITORIAL_REASONING_MODEL || env.EDITORIAL_MODEL || env.OPENAI_MODEL || "gpt-5.4",
    reviewModel: env.EDITORIAL_REVIEW_MODEL || env.EDITORIAL_MODEL || env.OPENAI_MODEL || "gpt-5.4-mini",
    apiKeyConfigured: Boolean(env.OPENAI_API_KEY),
  };
}

function parseJson(text) {
  const raw = String(text || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  try { return JSON.parse(raw); } catch (error) {
    const wrapped = new Error(`Editorial provider returned invalid JSON: ${error.message}`);
    wrapped.code = "EDITORIAL_INVALID_JSON";
    throw wrapped;
  }
}

function responseText(payload) {
  if (typeof payload?.output_text === "string") return payload.output_text;
  const chunks = [];
  for (const output of payload?.output || []) {
    for (const part of output?.content || []) if (typeof part?.text === "string") chunks.push(part.text);
  }
  return chunks.join("\n");
}

export function createEditorialModelProvider({ env = process.env, logger = () => {} } = {}) {
  const cfg = providerConfig(env);
  if (cfg.provider === "chatgpt-browser") return createChatGPTBrowserProvider({ env, logger });
  async function callOnce({ stage, prompt, model = cfg.model, schemaName, correction = false }) {
    if (cfg.provider !== "openai" || !cfg.apiKeyConfigured) {
      throw new EditorialProviderUnavailable("Set EDITORIAL_PROVIDER=openai and OPENAI_API_KEY to run the editorial model stages. No placeholder guidance is generated.");
    }
    const startedAt = new Date().toISOString();
    logger({ stage, provider: cfg.provider, model, startedAt, correction, event: "MODEL_CALL_STARTED" });
    let responseSchema = { type: "object", additionalProperties: true };
    const schemaFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "schemas", `${schemaName || "editorial-output"}.schema.json`);
    if (existsSync(schemaFile)) {
      const loaded = JSON.parse(await readFile(schemaFile, "utf8"));
      const { $schema, $id, title, description, ...usable } = loaded;
      responseSchema = usable;
    }
    const body = {
      model,
      input: correction ? `${prompt}\n\nCORRECTION: The prior response was not valid JSON. Return only the requested JSON object; do not wrap it in Markdown.` : prompt,
      text: { format: { type: "json_schema", name: schemaName || "mapkai_editorial_output", strict: true, schema: responseSchema } },
    };
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${env.OPENAI_API_KEY}` },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = payload?.error?.message || `Editorial provider HTTP ${response.status}`;
      logger({ stage, provider: cfg.provider, model, startedAt, endedAt: new Date().toISOString(), event: "MODEL_CALL_FAILED", error: message.slice(0, 180) });
      throw new Error(message);
    }
    const text = responseText(payload);
    const result = parseJson(text);
    logger({ stage, provider: cfg.provider, model, startedAt, endedAt: new Date().toISOString(), correction, event: "MODEL_CALL_SUCCEEDED", usage: payload.usage || null });
    return result;
  }
  async function call(args) {
    try { return await callOnce(args); }
    catch (error) {
      if (error?.code !== "EDITORIAL_INVALID_JSON") throw error;
      logger({ stage: args.stage, provider: cfg.provider, model: args.model || cfg.model, event: "MODEL_JSON_RETRY" });
      return callOnce({ ...args, correction: true });
    }
  }
  return {
    config: cfg,
    generateEditorialGuidance: (prompt) => call({ stage: "editorial_director", prompt, model: cfg.reasoningModel, schemaName: "editorial-guidance" }),
    critiqueEditorialGuidance: (prompt) => call({ stage: "editorial_critic", prompt, model: cfg.reviewModel, schemaName: "editorial-critique" }),
    reviseEditorialGuidance: (prompt) => call({ stage: "editorial_reviser", prompt, model: cfg.reasoningModel, schemaName: "editorial-guidance" }),
    expandKnowledge: (prompt) => call({ stage: "knowledge_expander", prompt, model: cfg.model, schemaName: "knowledge-expansion" }),
    reviewVideo: (prompt) => call({ stage: "video_reviewer", prompt, model: cfg.reviewModel, schemaName: "video-review" }),
    diagnoseFailure: (prompt) => call({ stage: "failure_diagnoser", prompt, model: cfg.reviewModel, schemaName: "failure-diagnosis" }),
  };
}

export async function loadPrompt(file) {
  return readFile(path.resolve(file), "utf8");
}
