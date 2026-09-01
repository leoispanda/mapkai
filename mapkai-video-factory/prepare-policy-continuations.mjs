import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPolicyBinding, classifySensitiveContent } from './governance.mjs';
import { sha256File } from './review-channel.mjs';

const FACTORY = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(FACTORY, '..');
const read = async file => JSON.parse(await fs.readFile(file, 'utf8'));
const relative = file => path.relative(ROOT, file);
async function optional(file) { try { return await read(file); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } }
async function immutable(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
}
const escape = text => String(text ?? '').replace(/[&<>"']/g, value => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[value]));

// A governance continuation is a new attempt, not permission to rewrite a historical run.
export async function prepareContinuations() {
  const cfg = await read(path.join(FACTORY, 'factory-config.json'));
  const binding = await loadPolicyBinding({ factoryDir: FACTORY, expected: cfg.policyBinding });
  const historicalFile = path.join(FACTORY, 'runtime/major-fields/latest-manifest.json');
  const manifest = await read(historicalFile);
  const manifestHash = await sha256File(historicalFile);
  const taxonomy = await read(path.join(FACTORY, 'taxonomy.json'));
  const catalog = await optional(path.join(FACTORY, 'runtime/delivery/review-catalog.json'));
  const continuations = [];
  for (const fieldId of ['02', '03']) {
    const previous = manifest.items.find(item => item.fieldId === fieldId);
    if (!previous || previous.creatorAttempts || previous.notebookUrl || previous.videoSubmissionStatus === 'GENERATING') throw new Error(`${fieldId}: previous state is not the known pre-creation hold; inspect instead of duplicating work`);
    const priorPath = path.resolve(ROOT, previous.runRecordPath);
    const priorHash = await sha256File(priorPath);
    const attemptId = `${previous.runId}-creating-${binding.creatingPolicy.version}-attempt-1`;
    const destination = path.join(FACTORY, 'runtime/major-fields/continuations', attemptId, 'run_record.json');
    let continuation = await optional(destination);
    if (continuation) {
      if (continuation.policyBinding.creatingPolicy.sha256 !== binding.creatingPolicy.sha256 || continuation.policyBinding.reviewPolicy.sha256 !== binding.reviewPolicy.sha256 || continuation.previousRun.sha256 !== priorHash) throw new Error('Continuation binding/history changed; explicit new attempt required');
    } else {
      const subjects = taxonomy.fields.filter(field => field.categoryCode === fieldId);
      const triage = classifySensitiveContent({ fieldId, fieldName: previous.fieldName, text: subjects.map(field => field.title).join('\n'), inputKind: 'taxonomy' });
      if (triage.status !== 'CLEAR') throw new Error('Policy clarification still unresolved');
      continuation = {
        schemaVersion: 'major-field-policy-continuation.v1', runId: attemptId,
        fieldId, fieldName: previous.fieldName, artifactType: 'FIELD_OVERVIEW', scope: 'EXISTING_11_MAJOR_FIELDS',
        createdAt: new Date().toISOString(), status: 'CREATOR_PENDING', policyBinding: binding,
        previousRun: { runId: previous.runId, path: relative(priorPath), sha256: priorHash, originalStatus: previous.status, originalPolicyBinding: previous.policyBinding },
        parentBatch: { id: manifest.batchRunId, manifestPath: relative(historicalFile), manifestSha256AtContinuation: manifestHash },
        changeReason: 'Founder approved necessary, simple, fair, objective, non-extreme educational coverage; taxonomy membership alone was an overbroad hold.',
        currentScopeAssessment: triage,
        canonicalTaxonomy: { path: 'mapkai-video-factory/taxonomy.json', sha256: await sha256File(path.join(FACTORY, 'taxonomy.json')), subjects: subjects.map(field => ({ code: field.code, name: field.title })) },
        productionEligible: false,
        creator: { status: 'NOT_STARTED', attempts: 0 },
        independentReview: { status: 'NOT_STARTED', decision: null, requiredSensitiveAssessment: 'Necessary passages must be justified and reviewed for neutral treatment, factual status and reliable sources.' },
        notebookSubmission: { status: 'NOT_SUBMITTED', attemptId: null },
        conversationGovernance: { default: 'REUSE_EXISTING_FIELD_ROLE_CONVERSATION', checkRegistryBeforeSend: true, effectiveCycleThreshold: 20, stageTransitionCreatesChat: false },
        nextAction: 'Continue with a real creator request under this binding, then self-check, deterministic validation and independent semantic review. Only a valid independent PASS can submit NotebookLM.',
        noAutomaticPass: true,
      };
      await immutable(destination, continuation);
    }
    continuations.push({ ...continuation, path: relative(destination) });
  }
  if (await sha256File(historicalFile) !== manifestHash) throw new Error('Historical batch changed during continuation preparation');
  const rows = [];
  for (const previous of manifest.items) {
    const continuation = continuations.find(item => item.fieldId === previous.fieldId);
    const media = catalog?.items.find(item => item.fieldId === previous.fieldId);
    const upload = media ? await optional(path.join(path.dirname(path.resolve(ROOT, media.rawVideoPath)), 'mapkai_upload_receipt.json')) : null;
    rows.push({ fieldId: previous.fieldId, fieldName: previous.fieldName,
      activeRunId: continuation?.runId || previous.runId,
      activePolicyBinding: continuation?.policyBinding || previous.policyBinding,
      status: continuation ? continuation.status : media ? 'HUMAN_REVIEW_PENDING' : previous.status,
      scopeHold: continuation ? 'TAXONOMY_ONLY_HOLD_RESOLVED' : previous.sensitiveContentStatus,
      sourceReviewDecision: continuation ? 'NOT_REVIEWED' : previous.finalReviewDecision,
      videoStatus: media ? 'VIDEO_DOWNLOADED' : previous.videoSubmissionStatus,
      mapkaiUploadStatus: upload ? 'UPLOADED_FOR_HUMAN_REVIEW' : media ? 'UPLOAD_PENDING' : 'NOT_GENERATED',
      publicationStatus: 'NOT_PUBLISHED',
      rawVideoPath: media?.rawVideoPath || null, continuationPath: continuation?.path || null,
    });
  }
  const view = { schemaVersion: 'major-field-current-status-view.v1', updatedAt: new Date().toISOString(),
    canonicalPolicyBinding: binding, originalBatchId: manifest.batchRunId, historicalManifestUnchanged: true,
    items: rows, newVideoSubmissionsDuringThisUpdate: 0,
    note: 'Read-only historical ledger plus explicit new continuation attempts and delivery receipts. Source approval is not raw-video approval.' };
  const viewPath = path.join(FACTORY, 'runtime/major-fields/current-production-status.json');
  await fs.writeFile(viewPath, `${JSON.stringify(view, null, 2)}\n`);
  const table = rows.map(row => `<tr><td>${escape(row.fieldName)}</td><td>${escape(row.status)}</td><td>${escape(row.sourceReviewDecision)}</td><td>${escape(row.videoStatus)}</td><td>${escape(row.mapkaiUploadStatus)}</td><td>${escape(row.activePolicyBinding.creatingPolicy.version)} / ${escape(row.activePolicyBinding.reviewPolicy.version)}</td></tr>`).join('\n');
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MapKAI Current Production</title><style>body{font:14px/1.6 system-ui;background:#f5f6f0;color:#1b352c;padding:32px}main{max-width:1450px;margin:auto}table{border-collapse:collapse;width:100%;background:white}th,td{border-bottom:1px solid #dce4db;padding:12px;text-align:left}a{color:#24694f}.notice{padding:16px;background:#e5eee2}</style><main><h1>MapKAI Major Fields — Current Status</h1><p>Canonical new attempts: Creating ${escape(binding.creatingPolicy.version)} / Review ${escape(binding.reviewPolicy.version)}. Historical submissions retain their original binding.</p><p class="notice">Arts and Humanities / Social Sciences: eligible to begin creation, not approved for submission. Necessary neutral knowledge is allowed; full independent review remains mandatory. Uploaded videos await human review; none published.</p><p><a href="https://www.mapkai.com/factory-review.html">MapKAI private review library (production deployment requires approval)</a> · <a href="http://127.0.0.1:4398/factory-review.html">Local review preview</a> · <a href="current-production-status.json">Current status data</a></p><table><thead><tr><th>Field</th><th>Stage</th><th>Source review</th><th>Video</th><th>MapKAI upload</th><th>Actual policy binding</th></tr></thead><tbody>${table}</tbody></table><p>Updated ${escape(view.updatedAt)}. Source files and historical run records were not rewritten.</p></main></html>`;
  const latestDashboard = path.join(FACTORY, 'runtime/major-fields/latest-dashboard.html');
  const backup = path.join(FACTORY, 'runtime/major-fields/dashboard-before-v1.3-clarification.html');
  try { await fs.copyFile(latestDashboard, backup, 1); } catch (error) { if (!['EEXIST', 'ENOENT'].includes(error.code)) throw error; }
  await fs.writeFile(latestDashboard, html);
  console.log(JSON.stringify({ prepared: continuations.map(item => ({ fieldId: item.fieldId, status: item.status, path: item.path })), historicalManifestUnchanged: true, downloaded: rows.filter(item => item.videoStatus === 'VIDEO_DOWNLOADED').length, uploaded: rows.filter(item => item.mapkaiUploadStatus === 'UPLOADED_FOR_HUMAN_REVIEW').length, published: 0 }, null, 2));
  return view;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) prepareContinuations().catch(error => { console.error(error.message); process.exitCode = 1; });
