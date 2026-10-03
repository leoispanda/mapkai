import { createSession, json } from './_shared.js';

export function onRequest({ request, env }) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (request.headers.get('Origin') !== new URL(request.url).origin ||
      request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') {
    return json({ error: '请从 MapKAI 语音访谈页面开始对话。' }, 403);
  }
  // We need no request payload, user identity, story text or IP storage here.
  return createSession(env);
}
