import { json } from './_shared.js';

// Public visitors cannot replace or clear the owner's service credential.
export function onRequest() {
  return json({ error: 'Not found' }, 404);
}
