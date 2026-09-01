import { createHash, randomUUID } from 'node:crypto';
import { createReadStream, constants } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { CANONICAL_MAJOR_FIELD_IDS, isCanonicalMajorField } from '../functions/api/factory/_major-fields.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DELIVERY = 'mapkai-video-factory/runtime/delivery';
export const CATALOG_KEY = 'catalog/review-v1.json';
export const PUBLIC_CATALOG_KEY = 'catalog/public-preview-v1.json';
export { CANONICAL_MAJOR_FIELD_IDS };
const HASH = /^[a-f0-9]{64}$/;
const ID = /^[a-zA-Z0-9_-]{1,180}$/;

export function publicPreviewSlug(fieldName) {
  return String(fieldName || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function local(relative, root = ROOT) {
  const resolved = path.resolve(root, relative);
  if (!resolved.startsWith(`${path.resolve(root)}${path.sep}`)) throw new Error('Path escapes workspace');
  return resolved;
}
export async function sha256File(file) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
}
const readJson = async file => JSON.parse(await fs.readFile(file, 'utf8'));
async function optionalJson(file) {
  try { return await readJson(file); } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
async function immutableJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const bytes = `${JSON.stringify(data, null, 2)}\n`;
  try { await fs.writeFile(file, bytes, { flag: 'wx' }); }
  catch (error) {
    if (error.code !== 'EEXIST' || await fs.readFile(file, 'utf8') !== bytes) throw error;
  }
}
async function atomicJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
  await fs.rename(tmp, file);
}

// Container validation only; it cannot determine educational quality or approve publication.
export async function inspectMp4(file) {
  const handle = await fs.open(file, 'r');
  try {
    const { size } = await handle.stat();
    const boxes = [];
    let offset = 0;
    while (offset < size) {
      if (size - offset < 8) throw new Error('Truncated MP4 header');
      const header = Buffer.alloc(16);
      await handle.read(header, 0, Math.min(16, size - offset), offset);
      let length = header.readUInt32BE(0);
      const type = header.toString('ascii', 4, 8);
      const minimum = length === 1 ? 16 : 8;
      if (length === 1) length = Number(header.readBigUInt64BE(8));
      if (length === 0) length = size - offset;
      if (!Number.isSafeInteger(length) || length < minimum || offset + length > size) throw new Error('Truncated or invalid MP4 box');
      boxes.push(type);
      offset += length;
    }
    if (!['ftyp', 'moov', 'mdat'].every(box => boxes.includes(box))) throw new Error('Not a complete MP4 container');
    return { fileSize: size, containerCheck: 'COMPLETE_TOP_LEVEL_BOXES', boxes };
  } finally { await handle.close(); }
}

export function remoteVideoKey(receipt) {
  if (!ID.test(receipt.generationAttemptId) || !/^\d{2}$/.test(receipt.fieldId) || !HASH.test(receipt.sha256)) throw new Error('Invalid media identity');
  return `raw/${receipt.fieldId}/${receipt.generationAttemptId}/${receipt.sha256}.mp4`;
}

export async function importVideo(entry, { root = ROOT, now = () => new Date().toISOString() } = {}) {
  const submissionPath = local(entry.submissionPath, root);
  const originalSubmission = await readJson(submissionPath);
  // Early receipts use fieldCode. Normalize in memory without rewriting the historical payload.
  const submission = { ...originalSubmission, fieldId: originalSubmission.fieldId ?? originalSubmission.fieldCode };
  const fieldDir = path.dirname(submissionPath);
  if (!submission.sourceFiles && Array.isArray(submission.submittedSourceFiles)) {
    submission.sourceFiles = submission.submittedSourceFiles.map(source => ({ ...source,
      file: path.basename(source.path), path: path.relative(root, path.resolve(fieldDir, source.path)) }));
  }
  if (!ID.test(submission.generationAttemptId) || !/^\d{2}$/.test(submission.fieldId)) throw new Error('Missing generation identity');
  if (entry.notebookUrl !== submission.notebookUrl || entry.fieldId !== submission.fieldId) throw new Error('Download/generation identity mismatch');
  if (submission.finalReviewDecision !== 'PASS') throw new Error('Source-pack submission gate was not PASS');
  for (const source of submission.sourceFiles || []) {
    if (!HASH.test(source.sha256) || await sha256File(local(source.path, root)) !== source.sha256) throw new Error(`Actual submission source changed: ${source.file}`);
  }
  if (!submission.sourceFiles?.length) throw new Error('Missing actual submission sources');
  for (const binding of [submission.policyBinding?.creatingPolicy, submission.policyBinding?.reviewPolicy]) {
    if (!binding?.path || !HASH.test(binding.sha256) || await sha256File(local(`mapkai-video-factory/${binding.path}`, root)) !== binding.sha256) throw new Error('Historical policy hash mismatch');
  }
  const decisionPath = path.join(fieldDir, 'final_review_decision.json');
  const decision = await readJson(decisionPath);
  if (decision.decision !== 'PASS' || decision.evidenceSufficient !== true || decision.reviewerRole === 'creator_self_check') throw new Error('Missing independent source review');
  for (const name of ['creatingPolicy', 'reviewPolicy']) {
    if (decision.policyBinding?.[name]?.sha256 !== submission.policyBinding?.[name]?.sha256) throw new Error('Submission/review policy mismatch');
  }
  const sourcePath = path.resolve(entry.sourcePath);
  const technical = await inspectMp4(sourcePath);
  const hash = await sha256File(sourcePath);
  const receiptPath = path.join(fieldDir, 'raw_video_delivery_receipt.json');
  const existing = await optionalJson(receiptPath);
  if (existing) {
    if (existing.generationAttemptId !== submission.generationAttemptId || existing.sha256 !== hash || await sha256File(local(existing.rawVideoPath, root)) !== hash) throw new Error('Existing receipt differs; refusing overwrite');
    return existing;
  }
  const historical = await optionalJson(path.join(fieldDir, 'raw_video_receipt.json'));
  const target = historical?.rawVideoPath ? local(historical.rawVideoPath, root) : path.join(fieldDir, `major-${submission.fieldId}-explainer-raw.mp4`);
  if (historical && historical.generationAttemptId !== submission.generationAttemptId) throw new Error('Historical file belongs to another attempt');
  if (sourcePath !== target) {
    try { await fs.copyFile(sourcePath, target, constants.COPYFILE_EXCL); }
    catch (error) {
      if (error.code !== 'EEXIST' || await sha256File(target) !== hash) throw error;
      // Equal bytes are safe for recovery after a copy succeeded but its receipt write failed.
    }
  }
  const sourceStat = await fs.stat(sourcePath);
  const observedAt = entry.observedReadyAt || now();
  const metadata = entry.metadata || {};
  const receipt = {
    schemaVersion: 'raw-video-delivery-receipt.v1',
    fieldId: submission.fieldId, fieldName: submission.fieldName,
    generationAttemptId: submission.generationAttemptId,
    localSubmissionId: submission.localSubmissionId || 'UNKNOWN',
    notebookUrl: submission.notebookUrl,
    contentVersion: submission.contentVersion || 'UNKNOWN',
    videoMode: submission.videoMode || 'UNKNOWN', narrativeEngine: submission.narrativeEngine || 'UNKNOWN',
    submittedAt: submission.submittedAt || 'UNKNOWN', completedAt: 'UNKNOWN',
    generationDurationMinutes: 'UNKNOWN',
    firstObservedReadyAt: historical?.downloadedAt || observedAt,
    latestReadinessObservationAt: observedAt,
    downloadedAt: historical?.downloadedAt || sourceStat.mtime.toISOString(),
    recordedAt: now(), rawVideoPath: path.relative(root, target),
    sha256: hash, ...technical,
    videoTitle: entry.title || submission.fieldName,
    videoDuration: Number.isFinite(metadata.duration) ? metadata.duration : historical?.videoDuration || 'UNKNOWN',
    resolution: metadata.width && metadata.height ? `${metadata.width}x${metadata.height}` : historical?.resolution || 'UNKNOWN',
    metadataProvenance: entry.metadataProvenance || 'NotebookLM visible video element; filesystem; MP4 container scan. No transcode.',
    completionTimingNote: 'Exact backend completion time was not exposed. For previously downloaded files the receipt is the earliest retained readiness evidence. Observation/download time is not generation duration.',
    submissionPayloadPath: entry.submissionPath,
    submissionPayloadSha256: await sha256File(submissionPath),
    actualSourceFiles: submission.sourceFiles,
    policyBinding: submission.policyBinding,
    sourceReview: { decision: decision.decision, path: path.relative(root, decisionPath), sha256: await sha256File(decisionPath) },
    status: 'HUMAN_REVIEW_PENDING', brandingStatus: 'NOT_APPLIED', publicationStatus: 'NOT_PUBLISHED',
    videoSemanticReview: 'NOT_PERFORMED',
    stateEvents: [{ state: 'VIDEO_READY', observedAt }, { state: 'VIDEO_DOWNLOADED', observedAt: historical?.downloadedAt || sourceStat.mtime.toISOString() }, { state: 'HUMAN_REVIEW_PENDING', observedAt: now() }],
  };
  await immutableJson(receiptPath, receipt);
  return receipt;
}

export function buildCatalog(receipts) {
  const identities = new Set();
  return {
    schemaVersion: 'mapkai-private-video-catalog.v1', visibility: 'FOUNDER_ONLY',
    items: receipts.map(receipt => {
      if (identities.has(receipt.generationAttemptId)) throw new Error('Duplicate attempt in catalog');
      identities.add(receipt.generationAttemptId);
      return { id: receipt.generationAttemptId, fieldId: receipt.fieldId, fieldName: receipt.fieldName,
        title: receipt.videoTitle, rawVideoPath: receipt.rawVideoPath, objectKey: remoteVideoKey(receipt),
        sha256: receipt.sha256, fileSize: receipt.fileSize, videoDuration: receipt.videoDuration, resolution: receipt.resolution,
        notebookUrl: receipt.notebookUrl, submittedAt: receipt.submittedAt, completedAt: receipt.completedAt,
        generationDurationMinutes: receipt.generationDurationMinutes, downloadedAt: receipt.downloadedAt,
        policyBinding: receipt.policyBinding, sourceReview: receipt.sourceReview,
        status: 'HUMAN_REVIEW_PENDING', publicationStatus: 'NOT_PUBLISHED', brandingStatus: 'NOT_APPLIED',
        auditKey: `audit/${receipt.generationAttemptId}/receipt.json`,
        sourceKeys: receipt.actualSourceFiles.map(source => ({ name: source.file, sha256: source.sha256, key: `audit/${receipt.generationAttemptId}/${source.file}` })),
      };
    }).sort((a, b) => a.fieldId.localeCompare(b.fieldId)),
  };
}

/**
 * Build a public-preview catalog from the delivered canonical major fields.
 * The delivery count may grow independently of the taxonomy; every included
 * item must still match a canonical identity and pass the review-preview gate.
 * The public API projects it without exposing IDs, hashes, object keys,
 * receipts, policy bindings or local paths.
 */
export function buildPublicPreviewCatalog(catalog) {
  if (catalog?.schemaVersion !== 'mapkai-private-video-catalog.v1' || catalog.visibility !== 'FOUNDER_ONLY' || !Array.isArray(catalog.items)) {
    throw new Error('Invalid private catalog for public preview');
  }
  const ids = new Set(catalog.items.map(item => item.fieldId));
  if (catalog.items.length > CANONICAL_MAJOR_FIELD_IDS.length || ids.size !== catalog.items.length
    || catalog.items.some(item => !isCanonicalMajorField(item?.fieldId, item?.fieldName))) {
    throw new Error('Public preview contains a duplicate or non-canonical major field');
  }
  const canonicalOrder = new Map(CANONICAL_MAJOR_FIELD_IDS.map((fieldId, index) => [fieldId, index]));
  const items = [...catalog.items]
    .sort((left, right) => canonicalOrder.get(left.fieldId) - canonicalOrder.get(right.fieldId))
    .map(item => {
      if (!ID.test(item.id) || !HASH.test(item.sha256)
        || item.objectKey !== `raw/${item.fieldId}/${item.id}/${item.sha256}.mp4`
        || !Number.isSafeInteger(item.fileSize) || item.fileSize <= 0
        || !['HUMAN_REVIEW_PENDING'].includes(item.status)
        || item.publicationStatus !== 'NOT_PUBLISHED' || item.brandingStatus !== 'NOT_APPLIED') {
        throw new Error(`Field ${item.fieldId} is not eligible for a public review preview`);
      }
      const slug = publicPreviewSlug(item.fieldName);
      if (!slug) throw new Error(`Field ${item.fieldId} has no stable public slug`);
      return {
        id: item.id,
        fieldId: item.fieldId,
        fieldName: item.fieldName,
        slug,
        title: item.title,
        objectKey: item.objectKey,
        sha256: item.sha256,
        fileSize: item.fileSize,
        videoDuration: item.videoDuration,
        resolution: item.resolution,
        status: 'HUMAN_REVIEW_PENDING',
        publicationStatus: 'NOT_PUBLISHED',
        brandingStatus: 'NOT_APPLIED',
        aiGenerated: true,
        publicPreviewStatus: 'VIDEO_CONTENT_UNDER_REVIEW',
      };
    });
  return { schemaVersion: 'mapkai-public-preview-catalog.v1', visibility: 'PUBLIC_PREVIEW', items };
}

function wranglerRun(wranglerPath, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [wranglerPath, ...args], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.on('data', chunk => { output += chunk; });
    child.on('error', reject);
    child.on('close', code => code === 0 ? resolve(output) : reject(Object.assign(new Error(output), { exitCode: code })));
  });
}
export function isMissingR2Object(error) {
  return /NoSuchKey|The specified key does not exist\./i.test(String(error?.message || ''));
}
export function mergeReviewCatalog(previous, incoming) {
  const items = new Map();
  for (const catalog of [previous, incoming]) {
    if (!catalog) continue;
    if (catalog.schemaVersion !== 'mapkai-private-video-catalog.v1' || catalog.visibility !== 'FOUNDER_ONLY' || !Array.isArray(catalog.items)) throw new Error('Invalid private catalog');
    for (const item of catalog.items) {
      const existing = items.get(item.id);
      if (existing && (existing.sha256 !== item.sha256 || existing.objectKey !== item.objectKey)) throw new Error('Catalog identity conflict; refusing overwrite');
      const { rawVideoPath, ...safe } = item;
      items.set(item.id, safe);
    }
  }
  return { schemaVersion: 'mapkai-private-video-catalog.v1', visibility: 'FOUNDER_ONLY', items: [...items.values()].sort((a, b) => a.fieldId.localeCompare(b.fieldId)) };
}

export async function uploadCatalog(catalog, { bucket, wranglerPath }) {
  if (!/^[a-z0-9-]+$/.test(bucket) || !wranglerPath) throw new Error('Explicit bucket and Wrangler path required');
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'mapkai-media-verify-'));
  const run = args => wranglerRun(wranglerPath, args);
  const uploadVerified = async (file, key, contentType) => {
    const hash = await sha256File(file);
    const checkPath = path.join(temporary, `${randomUUID()}.bin`);
    let exists = false;
    try { await run(['r2', 'object', 'get', `${bucket}/${key}`, '--remote', '--file', checkPath]); exists = true; }
    catch (error) {
      if (!isMissingR2Object(error)) throw error;
    }
    if (exists && await sha256File(checkPath) !== hash) throw new Error(`Remote object differs; refusing overwrite: ${key}`);
    if (!exists) {
      await run(['r2', 'object', 'put', `${bucket}/${key}`, '--remote', '--file', file, '--content-type', contentType, '--cache-control', 'private, no-store']);
      await run(['r2', 'object', 'get', `${bucket}/${key}`, '--remote', '--file', checkPath]);
      if (await sha256File(checkPath) !== hash) throw new Error(`Remote verification failed: ${key}`);
    }
    await fs.unlink(checkPath);
    return { key, sha256: hash, verifiedAt: new Date().toISOString(), reused: exists };
  };
  // A failed transfer stops this run. Retrying explicitly reuses content-addressed, verified objects.
  for (const item of catalog.items) {
    const dir = path.dirname(local(item.rawVideoPath));
    const receipt = await readJson(path.join(dir, 'raw_video_delivery_receipt.json'));
    if (await sha256File(local(item.rawVideoPath)) !== item.sha256 || receipt.generationAttemptId !== item.id) throw new Error('Local media changed after intake');
    const video = await uploadVerified(local(item.rawVideoPath), item.objectKey, 'video/mp4');
    const audit = await uploadVerified(path.join(dir, 'raw_video_delivery_receipt.json'), item.auditKey, 'application/json');
    for (const source of item.sourceKeys) {
      const file = path.join(dir, source.name);
      if (await sha256File(file) !== source.sha256) throw new Error('Submission source changed before upload');
      await uploadVerified(file, source.key, 'text/markdown; charset=utf-8');
    }
    const uploaded = { schemaVersion: 'mapkai-private-upload-receipt.v1', bucket, generationAttemptId: item.id,
      video, audit, visibility: 'PRIVATE', status: 'UPLOADED_FOR_HUMAN_REVIEW', publicationStatus: 'NOT_PUBLISHED' };
    const uploadReceiptPath = path.join(dir, 'mapkai_upload_receipt.json');
    const previous = await optionalJson(uploadReceiptPath);
    if (!previous) await immutableJson(uploadReceiptPath, uploaded);
    else if (previous.video.sha256 !== item.sha256 || previous.bucket !== bucket) throw new Error('Conflicting upload receipt');
    console.log(`${item.fieldId} ${item.fieldName}: verified private upload (${video.reused ? 'reused' : 'new'}), not published`);
  }
  const previousCatalogPath = path.join(temporary, 'previous-catalog.json');
  let previousCatalog = null;
  try {
    await run(['r2', 'object', 'get', `${bucket}/${CATALOG_KEY}`, '--remote', '--file', previousCatalogPath]);
    previousCatalog = await readJson(previousCatalogPath);
  } catch (error) { if (!isMissingR2Object(error)) throw error; }
  const publicCatalog = mergeReviewCatalog(previousCatalog, catalog);
  const catalogPath = path.join(temporary, 'catalog.json');
  await immutableJson(catalogPath, publicCatalog);
  const catalogHash = await sha256File(catalogPath);
  await uploadVerified(catalogPath, `catalog/history/${catalogHash}.json`, 'application/json');
  // Deliberately mutable pointer; immutable catalog snapshots and per-attempt receipts remain preserved.
  await run(['r2', 'object', 'put', `${bucket}/${CATALOG_KEY}`, '--remote', '--file', catalogPath, '--content-type', 'application/json', '--cache-control', 'private, no-store']);
  const catalogCheckPath = path.join(temporary, 'catalog-check.json');
  await run(['r2', 'object', 'get', `${bucket}/${CATALOG_KEY}`, '--remote', '--file', catalogCheckPath]);
  if (await sha256File(catalogCheckPath) !== catalogHash) throw new Error('Current remote catalog verification failed');
  await atomicJson(local(`${DELIVERY}/last-upload.json`), { bucket, catalogHash, itemCount: publicCatalog.items.length, uploadedAt: new Date().toISOString(), status: 'UPLOADED_FOR_HUMAN_REVIEW', published: 0 });
  await fs.unlink(catalogPath);
  await fs.unlink(catalogCheckPath);
  await fs.unlink(previousCatalogPath).catch(error => { if (error.code !== 'ENOENT') throw error; });
  await fs.rmdir(temporary);
  return { count: catalog.items.length, published: 0, reviewUrl: 'https://www.mapkai.com/factory-review.html' };
}

export async function uploadPublicPreviewCatalog(catalog, { bucket, wranglerPath }) {
  if (!/^[a-z0-9-]+$/.test(bucket) || !wranglerPath) throw new Error('Public catalog upload needs explicit bucket and Wrangler path');
  const publicCatalog = buildPublicPreviewCatalog(catalog);
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'mapkai-public-preview-'));
  const catalogPath = path.join(temporary, 'public-preview-catalog.json');
  await fs.writeFile(catalogPath, `${JSON.stringify(publicCatalog, null, 2)}\n`, { flag: 'wx' });
  const hash = await sha256File(catalogPath);
  const remotePath = path.join(temporary, 'remote-public-preview-catalog.json');
  const run = args => wranglerRun(wranglerPath, args);
  let exists = false;
  try {
    await run(['r2', 'object', 'get', `${bucket}/${PUBLIC_CATALOG_KEY}`, '--remote', '--file', remotePath]);
    exists = true;
  } catch (error) {
    if (!isMissingR2Object(error)) throw error;
  }
  if (exists) {
    if (await sha256File(remotePath) !== hash) throw new Error('Remote public preview catalog differs; refusing overwrite');
  } else {
    await run(['r2', 'object', 'put', `${bucket}/${PUBLIC_CATALOG_KEY}`, '--remote', '--file', catalogPath, '--content-type', 'application/json', '--cache-control', 'private, no-store']);
    await run(['r2', 'object', 'get', `${bucket}/${PUBLIC_CATALOG_KEY}`, '--remote', '--file', remotePath]);
    if (await sha256File(remotePath) !== hash) throw new Error('Remote public preview catalog verification failed');
  }
  await fs.rm(temporary, { recursive: true, force: true });
  return { key: PUBLIC_CATALOG_KEY, sha256: hash, itemCount: publicCatalog.items.length, status: 'PRIVATE_ALLOWLIST_UPLOADED', publicMediaDomain: 'DISABLED' };
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  const arg = name => args[args.indexOf(name) + 1];
  if (command === 'import') {
    if (!args.includes('--intake')) throw new Error('--intake is required');
    const intake = await readJson(path.resolve(arg('--intake')));
    const receipts = [];
    for (const entry of intake.items) { const receipt = await importVideo(entry); receipts.push(receipt); console.log(`${receipt.fieldId}: verified ${receipt.fileSize} bytes; HUMAN_REVIEW_PENDING`); }
    const existing = await optionalJson(local(`${DELIVERY}/review-catalog.json`));
    const incoming = buildCatalog(receipts);
    const byId = new Map((existing?.items || []).map(item => [item.id, item]));
    for (const item of incoming.items) {
      const previous = byId.get(item.id);
      if (previous && previous.sha256 !== item.sha256) throw new Error('Attempt already registered with another video');
      byId.set(item.id, item);
    }
    await atomicJson(local(`${DELIVERY}/review-catalog.json`), { ...incoming, items: [...byId.values()].sort((a, b) => a.fieldId.localeCompare(b.fieldId)) });
  } else if (command === 'upload') {
    if (!args.includes('--execute') || !args.includes('--bucket') || !args.includes('--wrangler-path')) throw new Error('Upload needs explicit --execute --bucket <private-bucket> --wrangler-path <cli>');
    console.log(await uploadCatalog(await readJson(local(`${DELIVERY}/review-catalog.json`)), { bucket: arg('--bucket'), wranglerPath: arg('--wrangler-path') }));
  } else if (command === 'prepare-public-preview') {
    const publicCatalog = buildPublicPreviewCatalog(await readJson(local(`${DELIVERY}/review-catalog.json`)));
    await atomicJson(local(`${DELIVERY}/public-preview-catalog.json`), publicCatalog);
    const deliveredFields = publicCatalog.items.map(item => item.fieldId).join(', ') || 'none';
    console.log(`Prepared ${publicCatalog.items.length} canonical public learning preview mappings: ${deliveredFields}.`);
  } else if (command === 'upload-public-preview') {
    if (!args.includes('--execute') || !args.includes('--bucket') || !args.includes('--wrangler-path')) throw new Error('Public catalog upload needs explicit --execute --bucket <private-bucket> --wrangler-path <cli>');
    console.log(await uploadPublicPreviewCatalog(await readJson(local(`${DELIVERY}/review-catalog.json`)), { bucket: arg('--bucket'), wranglerPath: arg('--wrangler-path') }));
  } else {
    console.log('Import verified raw videos: review-channel.mjs import --intake <json>\nUpload to private MapKAI review: review-channel.mjs upload --execute --bucket mapkai-video-review --wrangler-path <wrangler.js>\nPrepare public preview allowlist: review-channel.mjs prepare-public-preview\nUpload the private allowlist: review-channel.mjs upload-public-preview --execute --bucket mapkai-video-review --wrangler-path <wrangler.js>\nNo command in this channel generates, brands, or publishes videos.');
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
