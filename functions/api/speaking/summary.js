import { createSummary } from './_summary.js';

// Public, owner-sponsored feedback; no visitor accounts or usage quotas.
export function onRequest({ request, env }) {
  return createSummary(request, env);
}
