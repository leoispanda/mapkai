import { authorize, factoryMedia, readCatalog, responseJson, safeItem } from './_media.js';
import { readReview, reviewKey, reviewTransition, validateReview } from './_reviews.js';
import { costResponse } from '../../_shared/cost-guard.js';

async function boundedJson(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('A JSON review is required.');
  const chunks = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32768) { await reader.cancel(); throw new Error('Review exceeds 32 KB.'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}
export async function onRequest({ request, env }) {
  if (!['GET', 'POST'].includes(request.method)) return responseJson({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' });
  const denied = await authorize(request, env);
  if (denied) return denied;
  const url = new URL(request.url);
  if (request.method === 'POST' && (request.headers.get('Origin') !== url.origin || !/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type') || ''))) return responseJson({ error: 'Same-origin JSON request required.' }, 403);
  try {
    const catalog = await readCatalog(env);
    const item = catalog.items.find(entry => entry.id === url.searchParams.get('id'));
    if (!item || !safeItem(item)) return responseJson({ error: 'Video not found.' }, 404);
    const bucket = factoryMedia(env);
    const { record: previous, etag } = await readReview(bucket, item);
    if (request.method === 'GET') return responseJson({ record: previous, revision: previous?.revision || 0 });
    let input, review;
    try {
      input = await boundedJson(request);
      if (!/^[a-zA-Z0-9_-]{16,100}$/.test(input.commandId || '') || !Number.isSafeInteger(input.expectedRevision) || input.expectedRevision < 0) throw new Error('Command identity and expected revision are required.');
      review = validateReview(input.review, item);
    } catch (error) { return responseJson({ error: error.message }, 400); }
    // A retry after a lost response returns the original outcome; it cannot queue twice.
    const priorCommand = [previous, ...(previous?.history || [])].find(entry => entry?.commandId === input.commandId);
    if (priorCommand) {
      if (JSON.stringify(priorCommand.review) !== JSON.stringify(review)) return responseJson({ error: 'Command ID was already used for different review content.' }, 409);
      return responseJson({ record: previous, revision: previous.revision, replayed: true });
    }
    if (previous && JSON.stringify(previous.review) === JSON.stringify(review)) return responseJson({ record: previous, revision: previous.revision, replayed: true });
    if (input.expectedRevision !== (previous?.revision || 0)) return responseJson({ error: 'Review changed in another session. Reload it before saving.', revision: previous?.revision || 0 }, 409);
    if ((previous?.history?.length || 0) >= 49) return responseJson({ error: 'Review history is full; archive it before another revision.' }, 409);
    const record = { schemaVersion: 'mapkai-review-record.v1', revision: (previous?.revision || 0) + 1, commandId: input.commandId, review, recordedAt: new Date().toISOString(), ...reviewTransition(review, input.commandId), history: previous ? [...(previous.history || []), { revision: previous.revision, commandId: previous.commandId, review: previous.review, recordedAt: previous.recordedAt, nextAction: previous.nextAction }] : [] };
    // Decision and queue transition are one conditional write, so they cannot diverge.
    const saved = await bucket.put(reviewKey(item), JSON.stringify(record), { onlyIf: etag ? { etagMatches: etag } : { etagDoesNotMatch: '*' }, httpMetadata: { contentType: 'application/json', cacheControl: 'private, no-store' } });
    if (!saved) return responseJson({ error: 'A concurrent review was saved first. Reload before saving.' }, 409);
    return responseJson({ record, revision: record.revision });
  } catch (error) { return costResponse(error) || responseJson({ error: 'Review storage temporarily unavailable. Your local draft is retained.' }, 503); }
}
