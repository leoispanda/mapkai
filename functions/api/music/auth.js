import { createFounderAccessCookie, getFounderAccessCode, hasValidFounderAccessCookie, isFounderAccessCode } from '../pdc/_shared.js';
import { checkRateLimit, getClientIp } from '../_shared/rate-limit.js';
import { errorResponse, inputError, json, readBoundedBody, requireSameOrigin, uploadConfigured } from './_shared.js';

export async function onRequest({ request, env = {} }) {
  if (!['GET', 'POST'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' });
  try {
    if (request.method === 'GET') return json({ owner: await hasValidFounderAccessCookie(request, env), uploadConfigured: uploadConfigured(env) });
    requireSameOrigin(request);
    if (!getFounderAccessCode(env) || typeof env.MAPKAI_DB?.prepare !== 'function') throw inputError('Owner sign-in is temporarily unavailable.', 503);
    const limit = await checkRateLimit(env.MAPKAI_DB, `music-owner:${getClientIp(request)}`, { limit: 5, windowSeconds: 15 * 60 });
    if (!limit.ok) return json({ error: 'Too many sign-in attempts. Please try again later.' }, 429, { 'Retry-After': String(limit.retryAfter) });
    if (!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type') || '')) throw inputError('Use the owner sign-in form.', 415);
    let body;
    try { body = JSON.parse(new TextDecoder().decode(await readBoundedBody(request, 4096))); }
    catch (error) {
      if (error?.musicInputError) throw error;
      throw inputError('Enter an owner access code.');
    }
    const code = typeof body?.code === 'string' ? body.code.trim() : '';
    if (!code || code.length > 256 || !isFounderAccessCode(env, code)) throw inputError('The owner access code is incorrect.', 401);
    const cookie = await createFounderAccessCookie(env, request);
    return json({ owner: true, uploadConfigured: uploadConfigured(env) }, 200, { 'Set-Cookie': cookie });
  } catch (error) { return errorResponse(error, 'Owner sign-in is temporarily unavailable.'); }
}
