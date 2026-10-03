export const model = 'gemini-3.8-live';

export function json(data, status = 200) {
  return Response.json(data, { status, headers: {
    'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
  } });
}

// No accounts or usage quotas: the site owner sponsors public conversations.
// A single-use Live token is the only credential ever returned to a visitor.
export async function createSession(env) {
  const key = env.GEMINI_API_KEY;
  if (!key) return json({ error: '语音服务正在准备中，请稍后再试。' }, 503);
  try {
    const expiresAt = Date.now() + 30 * 60 * 1000;
    const upstream = await fetch('https://generativelanguage.googleapis.com/v1beta/auth_tokens', {
      method: 'POST',
      headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uses: 1,
        expireTime: new Date(expiresAt).toISOString(),
        newSessionExpireTime: new Date(Date.now() + 60000).toISOString(),
        // REST wire names verified with this model; voice and story remain client-selected.
        bidiGenerateContentSetup: { model: `models/${model}` }, fieldMask: 'model',
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!upstream.ok) {
      // Provider errors may contain credentials. Never forward or log their body.
      await upstream.body?.cancel();
      return json({ error: upstream.status === 429
        ? '语音服务暂时达到 Google 的可用额度或并发上限，请稍后再试。'
        : '语音服务暂时无法连接，请稍后再试。' }, upstream.status === 429 ? 429 : 502);
    }
    const result = await upstream.json();
    if (typeof result.name !== 'string' || !result.name.startsWith('auth_tokens/') || result.name.includes(key)) {
      return json({ error: '语音授权未完成，请重新连接。' }, 502);
    }
    return json({ token: result.name, model, expiresAt });
  } catch {
    return json({ error: '连接语音服务超时或暂时不可用，请稍后再试。' }, 502);
  }
}
