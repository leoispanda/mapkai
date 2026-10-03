const byId = id => document.getElementById(id);
const scoreLabels = [
  ['narrativeEngagement', 'Narrative Engagement'],
  ['intellectualInsight', 'Aha / Intellectual Insight'],
  ['knowledgeCoverage', 'Knowledge Coverage'],
  ['mentalMapClarity', 'Mental Map Clarity'],
  ['matureTone', 'Adult / Mature Tone'],
  ['visualQuality', 'Visual Quality'],
  ['differentiation', 'MapKAI Differentiation'],
];
let selected = null;
let saving = false;
const pendingCommands = new Map();
const duration = seconds => Number.isFinite(seconds) ? Math.floor(seconds / 60) + ':' + String(Math.floor(seconds) % 60).padStart(2, '0') : 'Unknown duration';
function message(text, error = false) { byId('status').textContent = text; byId('status').classList.toggle('error', error); }
function draftKey(item) { return 'mapkai:raw-video-review:' + item.id + ':' + item.sha256; }
function readDraft(item) {
  try { return JSON.parse(localStorage.getItem(draftKey(item)) || '{}'); } catch { return {}; }
}
for (const [key, title] of scoreLabels) {
  const label = document.createElement('label');
  label.append(document.createTextNode(title));
  const input = document.createElement('input');
  input.type = 'number'; input.min = '0'; input.max = '10'; input.step = '1'; input.placeholder = '/10'; input.name = key;
  label.append(input); byId('scores').append(label);
}
function reviewData() {
  const form = Object.fromEntries(new FormData(byId('review')));
  const scores = {};
  for (const [key] of scoreLabels) { scores[key] = form[key] === '' ? null : Number(form[key]); delete form[key]; }
  return { schemaVersion: 'mapkai-human-video-review.v1', generationAttemptId: selected.id, rawVideoSha256: selected.sha256, fieldId: selected.fieldId, scores, ...form, recordedAt: new Date().toISOString(), publicationAction: 'NONE' };
}
function selectVideo(item, button) {
  selected = item;
  for (const child of byId('video-list').children) child.setAttribute('aria-current', String(child === button));
  byId('field-title').textContent = item.fieldName;
  byId('video-meta').textContent = duration(item.videoDuration) + ' · ' + item.resolution + ' · ' + (item.fileSize / 1024 / 1024).toFixed(1) + ' MB · ' + item.title;
  const player = byId('player'); player.pause(); player.src = item.videoUrl; player.load();
  byId('links').replaceChildren();
  const links = [['Download original MP4', item.videoUrl + '&download=1'], ['Notebook', item.notebookUrl], ...item.sources.map(source => [source.name, source.url]), ['Exact submission receipt', item.auditUrl]];
  for (const [label, url] of links) {
    const anchor = document.createElement('a'); anchor.textContent = label; anchor.href = url; anchor.target = '_blank'; anchor.rel = 'noopener'; byId('links').append(anchor);
  }
  const p = item.policyBinding;
  byId('provenance').textContent = 'Submitted ' + item.submittedAt + '. Creating ' + p.creatingPolicy.version + ' / Review ' + p.reviewPolicy.version + '. Raw SHA-256: ' + item.sha256 + '. Backend completion time was not exposed; generation duration remains UNKNOWN. Historical policy bindings are preserved.';
  byId('review').reset();
  const local = readDraft(item);
  const draft = local.recordedAt ? local : item.humanReview?.review || {};
  selected.listButton = button;
  for (const [key] of scoreLabels) byId('review').elements.namedItem(key).value = draft.scores?.[key] ?? '';
  for (const key of ['strengths','weaknesses','missingKnowledge','openingApproach','genericAiFeeling','keepWatching','decision']) if (draft[key] !== undefined) byId('review').elements.namedItem(key).value = draft[key];
  byId('review-status').textContent = local.recordedAt ? 'Local draft from ' + new Date(local.recordedAt).toLocaleString() : item.humanReview ? 'Saved · ' + item.humanReview.status + ' · revision ' + item.humanReview.revision : 'Not reviewed yet.';
  byId('viewer').hidden = false;
}
async function loadLibrary() {
  try {
    const response = await fetch('/api/factory/videos', { credentials: 'same-origin', cache: 'no-store' });
    if (response.status === 401) { byId('login').hidden = false; byId('library').hidden = true; message('Sign in to view the private library.'); return; }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Video library unavailable.');
    byId('login').hidden = true; byId('library').hidden = false; byId('video-list').replaceChildren();
    byId('summary').textContent = data.items.length + ' original videos · ' + data.items.filter(item => !item.humanReview).length + ' awaiting review';
    message('Private library ready. Choose a video to review.');
    for (const item of data.items) {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = item.fieldName; button.setAttribute('aria-current', 'false');
      const meta = document.createElement('small'); meta.textContent = duration(item.videoDuration) + ' · ' + (item.humanReview?.status || 'Review pending'); button.append(meta);
      button.addEventListener('click', () => selectVideo(item, button)); byId('video-list').append(button);
    }
    if (data.items.length) selectVideo(data.items[0], byId('video-list').firstElementChild);
  } catch (error) { message(error.message, true); }
}
byId('login').addEventListener('submit', async event => {
  event.preventDefault(); const button = event.submitter; button.disabled = true;
  try {
    const pass = byId('access-code').value; byId('access-code').value = '';
    const response = await fetch('/api/pdc/validate-pass', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pass }) });
    const data = await response.json();
    if (!data.founder_preview) throw new Error('Founder access code was not accepted.');
    await loadLibrary();
  } catch (error) { message(error.message, true); }
  finally { button.disabled = false; }
});
byId('save-draft').addEventListener('click', () => {
  if (!selected) return;
  try { localStorage.setItem(draftKey(selected), JSON.stringify(reviewData())); byId('review-status').textContent = 'Draft saved on this device.'; }
  catch { byId('review-status').textContent = 'Browser storage unavailable. Export your draft.'; }
});
byId('review').addEventListener('submit', async event => {
  event.preventDefault();
  if (!selected || saving || !byId('review').reportValidity()) return;
  const item = selected, draft = reviewData();
  if (draft.decision === 'Undecided') { byId('review-status').textContent = 'Choose Accept or Regenerate, or save a draft.'; return; }
  saving = true;
  const button = event.submitter; button.disabled = true;
  try {
    try { localStorage.setItem(draftKey(item), JSON.stringify(draft)); } catch {}
    const canonical = { ...draft }; delete canonical.recordedAt;
    const signature = JSON.stringify(canonical);
    let command = pendingCommands.get(item.id);
    if (!command || command.signature !== signature) {
      command = { signature, commandId: crypto.randomUUID(), expectedRevision: item.humanReview?.revision || 0 };
      pendingCommands.set(item.id, command);
    }
    const response = await fetch('/api/factory/review?id=' + encodeURIComponent(item.id), { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ commandId: command.commandId, expectedRevision: command.expectedRevision, review: draft }) });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 409) {
        const latestResponse = await fetch('/api/factory/review?id=' + encodeURIComponent(item.id), { credentials: 'same-origin', cache: 'no-store' });
        if (latestResponse.ok) item.humanReview = (await latestResponse.json()).record;
        pendingCommands.delete(item.id);
      }
      throw new Error(data.error || 'Review could not be saved.');
    }
    item.humanReview = data.record;
    pendingCommands.delete(item.id);
    try { localStorage.removeItem(draftKey(item)); } catch {}
    item.listButton.querySelector('small').textContent = duration(item.videoDuration) + ' · ' + data.record.status;
    if (selected.id === item.id) byId('review-status').textContent = 'Saved · ' + data.record.status + ' · revision ' + data.revision;
  } catch (error) { if (selected?.id === item.id) byId('review-status').textContent = error.message; }
  finally { saving = false; button.disabled = false; }
});
byId('export-review').addEventListener('click', () => {
  if (!selected || !byId('review').reportValidity()) return;
  const url = URL.createObjectURL(new Blob([JSON.stringify(reviewData(), null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = 'mapkai-review-' + selected.fieldId + '-' + selected.sha256.slice(0, 12) + '.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
loadLibrary();
