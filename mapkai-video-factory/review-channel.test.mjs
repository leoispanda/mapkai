import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { importVideo, sha256File, inspectMp4, buildCatalog, remoteVideoKey, isMissingR2Object, mergeReviewCatalog } from './review-channel.mjs';
import { onRequest as listVideos } from '../functions/api/factory/videos.js';
import { onRequest as serveVideo } from '../functions/api/factory/video.js';
import { onRequest as serveSource } from '../functions/api/factory/source.js';
import { parseRange, CATALOG_KEY } from '../functions/api/factory/_media.js';
import { createFounderAccessCookie } from '../functions/api/pdc/_shared.js';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const box = (type, bytes = Buffer.alloc(0)) => { const head = Buffer.alloc(8); head.writeUInt32BE(8 + bytes.length); head.write(type, 4); return Buffer.concat([head, bytes]); };
const mp4 = Buffer.concat([box('ftyp', Buffer.from('mp42')), box('moov'), box('mdat', Buffer.alloc(20))]);
test('only a missing object permits first upload; auth/network errors fail closed', () => {
  assert.equal(isMissingR2Object(new Error('The specified key does not exist.')), true);
  assert.equal(isMissingR2Object(new Error('API route not found 404')), false);
  assert.equal(isMissingR2Object(new Error('Unauthorized 403')), false);
  assert.equal(isMissingR2Object(new Error('Network timeout')), false);
});
test('catalog updates retain previous attempts, strip local paths, and reject identity conflicts', () => {
  const catalog = items => ({ schemaVersion: 'mapkai-private-video-catalog.v1', visibility: 'FOUNDER_ONLY', items });
  const first = { id: 'old-attempt', fieldId: '00', sha256: 'hash-a', objectKey: 'a' };
  const second = { id: 'new-attempt', fieldId: '02', sha256: 'hash-b', objectKey: 'b', rawVideoPath: '/local/raw.mp4' };
  const merged = mergeReviewCatalog(catalog([first]), catalog([second]));
  assert.equal(merged.items.length, 2); assert.equal(merged.items[1].rawVideoPath, undefined);
  assert.throws(() => mergeReviewCatalog(catalog([first]), catalog([{ ...first, sha256: 'different' }])), /identity conflict/);
});
async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'mapkai-intake-test-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const dir = 'mapkai-video-factory/runtime/test/04-business';
  await fs.mkdir(path.join(root, dir), { recursive: true });
  await fs.mkdir(path.join(root, 'mapkai-video-factory/policy'), { recursive: true });
  const binding = { creatingPolicy: { version: 'v1.2', path: 'policy/creating.md', sha256: digest('historical creating') }, reviewPolicy: { version: 'v1.1', path: 'policy/review.md', sha256: digest('historical review') } };
  await fs.writeFile(path.join(root, 'mapkai-video-factory/policy/creating.md'), 'historical creating');
  await fs.writeFile(path.join(root, 'mapkai-video-factory/policy/review.md'), 'historical review');
  await fs.writeFile(path.join(root, dir, 'overview.md'), 'Actual submitted source');
  const submission = { fieldId: '04', fieldName: 'Business', generationAttemptId: 'test-attempt-04', notebookUrl: 'https://notebook.google.com/notebook/test', policyBinding: binding,
    finalReviewDecision: 'PASS', sourceFiles: [{ file: 'overview.md', path: `${dir}/overview.md`, sha256: digest('Actual submitted source') }] };
  await fs.writeFile(path.join(root, dir, 'submission_payload.json'), JSON.stringify(submission));
  await fs.writeFile(path.join(root, dir, 'final_review_decision.json'), JSON.stringify({ decision: 'PASS', evidenceSufficient: true, reviewerRole: 'independent_reviewer', policyBinding: binding }));
  const sourcePath = path.join(root, 'download.mp4'); await fs.writeFile(sourcePath, mp4);
  const entry = { fieldId: '04', notebookUrl: submission.notebookUrl, sourcePath, submissionPath: `${dir}/submission_payload.json`, metadata: { duration: 600, width: 1280, height: 720 } };
  return { root, dir, entry, submission };
}
test('intake preserves exact old submission binding and does not publish', async t => {
  const { root, entry } = await fixture(t);
  const originalHash = await sha256File(path.join(root, entry.submissionPath));
  const receipt = await importVideo(entry, { root });
  assert.equal(receipt.policyBinding.creatingPolicy.version, 'v1.2');
  assert.equal(receipt.status, 'HUMAN_REVIEW_PENDING');
  assert.equal(receipt.publicationStatus, 'NOT_PUBLISHED');
  assert.equal(receipt.completedAt, 'UNKNOWN');
  assert.equal(receipt.sha256, digest(mp4));
  assert.equal(await sha256File(path.join(root, entry.submissionPath)), originalHash);
  assert.deepEqual(await importVideo(entry, { root }), receipt);
  assert.equal(buildCatalog([receipt]).items[0].publicationStatus, 'NOT_PUBLISHED');
  assert.throws(() => buildCatalog([receipt, receipt]), /Duplicate/);
});
test('intake refuses wrong attempt, changed source, truncated MP4 and conflicting raw file', async t => {
  const { root, dir, entry } = await fixture(t);
  await assert.rejects(importVideo({ ...entry, notebookUrl: 'wrong' }, { root }), /identity mismatch/);
  await fs.writeFile(path.join(root, dir, 'overview.md'), 'Later version');
  await assert.rejects(importVideo(entry, { root }), /Actual submission source changed/);
  await fs.writeFile(path.join(root, dir, 'overview.md'), 'Actual submitted source');
  await fs.writeFile(entry.sourcePath, mp4.subarray(0, mp4.length - 1));
  await assert.rejects(inspectMp4(entry.sourcePath), /Truncated/);
  await fs.writeFile(entry.sourcePath, mp4);
  await fs.writeFile(path.join(root, dir, 'major-04-explainer-raw.mp4'), 'do not overwrite');
  await assert.rejects(importVideo(entry, { root }), /EEXIST/);
  assert.equal(await fs.readFile(path.join(root, dir, 'major-04-explainer-raw.mp4'), 'utf8'), 'do not overwrite');
});
test('legacy fieldCode payload is read without changing historical bytes', async t => {
  const { root, entry, submission } = await fixture(t);
  submission.fieldCode = submission.fieldId; delete submission.fieldId;
  const file = path.join(root, entry.submissionPath);
  await fs.writeFile(file, JSON.stringify(submission));
  const original = await sha256File(file);
  assert.equal((await importVideo(entry, { root })).fieldId, '04');
  assert.equal(await sha256File(file), original);
});
test('relative submittedSourceFiles schema retains actual hashes and historical bytes', async t => {
  const { root, entry, submission } = await fixture(t);
  submission.submittedSourceFiles = submission.sourceFiles.map(source => ({ path: source.file, sha256: source.sha256 }));
  delete submission.sourceFiles;
  const file = path.join(root, entry.submissionPath);
  await fs.writeFile(file, JSON.stringify(submission));
  const original = await sha256File(file);
  assert.equal((await importVideo(entry, { root })).actualSourceFiles[0].file, 'overview.md');
  assert.equal(await sha256File(file), original);
});

async function apiFixture() {
  const keyHash = digest(mp4);
  const item = { id: 'test-attempt', fieldId: '04', fieldName: 'Business', sha256: keyHash, fileSize: mp4.length, status: 'HUMAN_REVIEW_PENDING', sourceKeys: [{ name: 'overview.md', key: 'audit/test-attempt/overview.md' }] };
  item.objectKey = remoteVideoKey({ fieldId: item.fieldId, generationAttemptId: item.id, sha256: item.sha256 });
  const env = { MAPKAI_FOUNDER_ACCESS_CODE: 'test-only-not-a-real-secret', MAPKAI_REVIEW_MEDIA: {
    head: async key => key === item.objectKey ? { size: mp4.length } : null,
    get: async (key, options) => {
      if (key === CATALOG_KEY) return { json: async () => ({ schemaVersion: 'mapkai-private-video-catalog.v1', visibility: 'FOUNDER_ONLY', items: [item] }) };
      if (key === item.objectKey) { const bytes = options?.range ? mp4.subarray(options.range.offset, options.range.offset + options.range.length) : mp4; return { body: new Response(bytes).body }; }
      if (key === 'audit/test-attempt/overview.md') return { body: new Response('source').body };
      throw new Error('Unexpected object access: ' + key);
    },
  } };
  const cookie = (await createFounderAccessCookie(env, new Request('https://www.mapkai.com'))).split(';')[0];
  const request = (url, options = {}) => new Request(`https://www.mapkai.com${url}`, { ...options, headers: { Cookie: cookie, ...options.headers } });
  return { env, request, item };
}
test('private library, media and sources reject anonymous access', async () => {
  for (const handler of [listVideos, serveVideo, serveSource]) {
    const response = await handler({ request: new Request('https://www.mapkai.com/api/factory/videos'), env: {} });
    assert.equal(response.status, 401); assert.match(response.headers.get('Cache-Control'), /no-store/);
  }
});
test('authenticated video listing exposes URLs but never arbitrary storage access', async () => {
  const { env, request } = await apiFixture();
  const response = await listVideos({ env, request: request('/api/factory/videos') });
  const data = await response.json(); assert.equal(data.items.length, 1); assert.equal(data.items[0].objectKey, undefined);
  assert.equal(data.publicationStatus, 'NOT_PUBLISHED');
  assert.equal((await serveSource({ env, request: request('/api/factory/source?id=test-attempt&file=../../secret') })).status, 404);
  assert.equal((await serveVideo({ env, request: request('/api/factory/video?id=another-attempt') })).status, 404);
  assert.equal(await (await serveSource({ env, request: request('/api/factory/source?id=test-attempt&file=overview.md') })).text(), 'source');
});
test('video serves exact ranges, supports seek/HEAD, and rejects invalid ranges', async () => {
  const { env, request } = await apiFixture();
  const response = await serveVideo({ env, request: request('/api/factory/video?id=test-attempt', { headers: { Range: 'bytes=3-11' } }) });
  assert.equal(response.status, 206); assert.equal(response.headers.get('Content-Length'), '9');
  assert.equal(response.headers.get('Content-Range'), `bytes 3-11/${mp4.length}`);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), mp4.subarray(3, 12));
  const head = await serveVideo({ env, request: request('/api/factory/video?id=test-attempt', { method: 'HEAD' }) });
  assert.equal(head.status, 200); assert.equal((await head.arrayBuffer()).byteLength, 0);
  const invalid = await serveVideo({ env, request: request('/api/factory/video?id=test-attempt', { headers: { Range: 'bytes=999999-' } }) });
  assert.equal(invalid.status, 416);
  assert.deepEqual(parseRange('bytes=-5', 100), { start: 95, end: 99, length: 5 });
  assert.throws(() => parseRange('bytes=1-2,4-5', 100));
  assert.throws(() => parseRange('bytes=-0', 100));
});
