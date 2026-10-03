import { json, model } from './_shared.js';

export function onRequest({ request, env }) {
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);
  return json({ configured: Boolean(env.GEMINI_API_KEY), provider: 'gemini', model, localOnly: false });
}
