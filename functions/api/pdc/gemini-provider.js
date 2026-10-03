// Gemini transport for PDC. Prompts, provider bodies and credentials are never logged.
export const defaultGeminiPdcModel = 'gemini-3.8-flash';
const deadlineKey = Symbol('pdc-provider-deadline');
const maxResponseBytes = 1024 * 1024;

export function withPdcProviderBudget(env = {}) {
  return { ...env, [deadlineKey]: Date.now() + 60000 };
}

export function pdcProviderError(code, status) {
  const error = new Error(code);
  error.code = code;
  error.status = status;
  return error;
}

export function safePdcProviderError(error) {
  if (/^MODEL_(NOT_CONFIGURED|TIMEOUT|RATE_LIMITED|UNAVAILABLE|INVALID_RESPONSE|BLOCKED)$/.test(error?.code || '')) return error;
  const message = String(error?.message || '');
  if (/timeout|abort/i.test(message)) return pdcProviderError('MODEL_TIMEOUT', 504);
  if (/429|rate limit/i.test(message)) return pdcProviderError('MODEL_RATE_LIMITED', 429);
  if (/missing.*key|not configured/i.test(message)) return pdcProviderError('MODEL_NOT_CONFIGURED', 503);
  return pdcProviderError('MODEL_INVALID_RESPONSE', 502);
}

export async function callGeminiJsonWithRetry(options) {
  try {
    return await callGeminiJson(options);
  } catch (error) {
    // Only repair malformed output. Busy, blocked, network and timeout errors are visible to the user.
    if (error.code !== 'MODEL_INVALID_RESPONSE') throw error;
    if (options.diagnostics) options.diagnostics.jsonRepairRetryUsed = true;
    return callGeminiJson({
      ...options,
      prompt: `${options.prompt}\n\nJSON repair: ${options.retryInstructions || 'Return one complete JSON object matching the schema, without markdown.'}`,
      maxOutputTokens: options.retryMaxOutputTokens || options.maxOutputTokens,
    });
  }
}

async function callGeminiJson({ env = {}, model, instructions, prompt, schemaName, schema, maxOutputTokens, diagnostics }) {
  const key = String(env.GEMINI_API_KEY || '').trim();
  if (!key) throw pdcProviderError('MODEL_NOT_CONFIGURED', 503);
  if (!/^gemini-[a-zA-Z0-9._-]+$/.test(model)) throw pdcProviderError('MODEL_NOT_CONFIGURED', 503);
  const configuredTimeout = Number(env.PDC_PROVIDER_TIMEOUT_MS) || 45000;
  const remaining = env[deadlineKey] ? env[deadlineKey] - Date.now() : 60000;
  if (remaining <= 0) throw pdcProviderError('MODEL_TIMEOUT', 504);
  const timeoutMs = Math.max(1, Math.min(configuredTimeout, remaining, 60000));
  const outputBudget = Math.min(16384, Math.max(maxOutputTokens || 0, Number(env.PDC_GEMINI_MAX_OUTPUT_TOKENS) || 8192));
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();
  let response;
  try {
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: instructions }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json', responseJsonSchema: schema,
          maxOutputTokens: outputBudget, thinkingConfig: { thinkingLevel: 'LOW' },
        },
        store: false,
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      await response.body?.cancel().catch(() => {});
      const error = pdcProviderError(response.status === 429 ? 'MODEL_RATE_LIMITED' : 'MODEL_UNAVAILABLE', response.status === 429 ? 429 : 502);
      if (Number.isInteger(response.status) && response.status >= 100 && response.status <= 599) error.upstreamStatus = response.status;
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        if (/^\d{1,5}$/.test(retryAfter || '')) error.retryAfter = retryAfter;
      }
      throw error;
    }
    const payload = await readProviderJson(response, controller.signal);
    const candidate = payload?.candidates?.[0];
    if (payload?.promptFeedback?.blockReason || ['SAFETY', 'BLOCKLIST', 'PROHIBITED_CONTENT', 'RECITATION', 'SPII'].includes(candidate?.finishReason)) {
      throw pdcProviderError('MODEL_BLOCKED', 422);
    }
    if (candidate?.finishReason !== 'STOP' || !Array.isArray(candidate?.content?.parts)) throw pdcProviderError('MODEL_INVALID_RESPONSE', 502);
    const text = candidate.content.parts.filter(part => !part.thought && typeof part.text === 'string').map(part => part.text).join('');
    // Do not expose an echoed credential even if the provider were to return one.
    if (!text || text.includes(key)) throw pdcProviderError('MODEL_INVALID_RESPONSE', 502);
    let parsed;
    try { parsed = JSON.parse(text); } catch { throw pdcProviderError('MODEL_INVALID_RESPONSE', 502); }
    if (!matchesSchema(parsed, schema)) throw pdcProviderError('MODEL_INVALID_RESPONSE', 502);
    if (diagnostics) Object.assign(diagnostics, {
      schemaName, strict: true, promptCharLength: prompt.length, maxOutputTokens: outputBudget,
      approximateInputTokenEstimate: Math.ceil((instructions.length + prompt.length) / 4),
      outputCharLength: text.length, geminiDurationMs: Date.now() - startedAt,
    });
    return parsed;
  } catch (error) {
    if (controller.signal.aborted) throw pdcProviderError('MODEL_TIMEOUT', 504);
    if (error?.code) throw error;
    throw pdcProviderError('MODEL_UNAVAILABLE', 502);
  } finally {
    clearTimeout(timer);
  }
}

async function readProviderJson(response, signal) {
  if (Number(response.headers.get('Content-Length')) > maxResponseBytes) {
    await response.body?.cancel().catch(() => {});
    throw pdcProviderError('MODEL_INVALID_RESPONSE', 502);
  }
  const reader = response.body?.getReader();
  if (!reader) throw pdcProviderError('MODEL_INVALID_RESPONSE', 502);
  const chunks = [];
  let size = 0;
  let onAbort;
  const aborted = new Promise((_, reject) => {
    onAbort = () => { reader.cancel().catch(() => {}); reject(pdcProviderError('MODEL_TIMEOUT', 504)); };
    signal.addEventListener('abort', onAbort, { once: true });
    if (signal.aborted) onAbort();
  });
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), aborted]);
      if (done) break;
      size += value.byteLength;
      if (size > maxResponseBytes) { await reader.cancel(); throw pdcProviderError('MODEL_INVALID_RESPONSE', 502); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    try { return JSON.parse(new TextDecoder().decode(bytes)); } catch { throw pdcProviderError('MODEL_INVALID_RESPONSE', 502); }
  } finally {
    signal.removeEventListener('abort', onAbort);
    reader.releaseLock();
  }
}

function matchesSchema(value, schema) {
  const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
  const allowedTypes = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (schema.type && !allowedTypes.includes(type)) return false;
  if (schema.enum && !schema.enum.includes(value)) return false;
  if (type === 'object') {
    if ((schema.required || []).some(key => !Object.hasOwn(value, key))) return false;
    const properties = schema.properties || {};
    if (schema.additionalProperties === false && Object.keys(value).some(key => !Object.hasOwn(properties, key))) return false;
    return Object.entries(properties).every(([key, child]) => !Object.hasOwn(value, key) || matchesSchema(value[key], child));
  }
  if (type === 'array') return value.every(item => matchesSchema(item, schema.items || {}));
  return true;
}
