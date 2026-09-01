import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('rerunning the coordinator preserves legacy manifest and run records without a provider request', async t => {
  const original = path.dirname(fileURLToPath(import.meta.url));
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'mapkai-legacy-run-test-'));
  t.after(() => fs.rm(temp, { recursive: true, force: true }));
  const factory = path.join(temp, 'mapkai-video-factory');
  for (const file of ['major-fields-run.mjs', 'governance.mjs', 'factory-config.json', 'taxonomy.json',
    'autonomous/editorial-provider.mjs', 'autonomous/chatgpt-browser-provider.mjs',
    'policy/mapkai-creating-policy-v1.3.md', 'policy/mapkai-review-policy-v1.2.md']) {
    await fs.mkdir(path.dirname(path.join(factory, file)), { recursive: true });
    await fs.copyFile(path.join(original, file), path.join(factory, file));
  }
  const runtime = path.join(factory, 'runtime/major-fields');
  await fs.mkdir(path.join(runtime, 'run-records/legacy-batch'), { recursive: true });
  const historical = JSON.stringify({ batchRunId: 'legacy-batch', policyBinding: { creatingPolicy: { version: 'v1.2' }, reviewPolicy: { version: 'v1.1' } }, items: [{ fieldId: '02', status: 'SENSITIVE_TOPIC_REVIEW_REQUIRED' }] });
  const record = '{"runId":"legacy-batch-02","status":"BLOCKED","immutableTest":true}\n';
  await fs.writeFile(path.join(runtime, 'latest-manifest.json'), historical);
  await fs.writeFile(path.join(runtime, 'run-records/legacy-batch/02.json'), record);
  const result = spawnSync(process.execPath, [path.join(factory, 'major-fields-run.mjs')], { cwd: temp, encoding: 'utf8', env: { ...process.env, EDITORIAL_PROVIDER: 'chatgpt-browser' }, timeout: 10000 });
  assert.equal(result.status, 0, result.stderr); assert.match(result.stdout, /Preserved existing batch legacy-batch/);
  assert.equal(await fs.readFile(path.join(runtime, 'latest-manifest.json'), 'utf8'), historical);
  assert.equal(await fs.readFile(path.join(runtime, 'run-records/legacy-batch/02.json'), 'utf8'), record);
  await assert.rejects(fs.stat(path.join(factory, 'runtime/chatgpt-browser/conversations.json')), /ENOENT/);
});
