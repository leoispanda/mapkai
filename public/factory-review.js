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
  const draft = readDraft(item);
  for (const [key] of scoreLabels) byId('review').elements.namedItem(key).value = draft.scores?.[key] ?? '';
  for (const key of ['strengths','weaknesses','missingKnowledge','openingApproach','genericAiFeeling','keepWatching','decision']) if (draft[key] !== undefined) byId('review').elements.namedItem(key).value = draft[key];
  byId('review-status').textContent = draft.recordedAt ? 'Saved draft from ' + new Date(draft.recordedAt).toLocaleString() : 'Not reviewed yet.';
  byId('viewer').hidden = false;
}
async function loadLibrary() {
  try {
    const response = await fetch('/api/factory/videos', { credentials: 'same-origin', cache: 'no-store' });
    if (response.status === 401) { byId('login').hidden = false; byId('library').hidden = true; message('Sign in to view the private library.'); return; }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Video library unavailable.');
    byId('login').hidden = true; byId('library').hidden = false; byId('video-list').replaceChildren();
    byId('summary').textContent = data.items.length + ' verified original videos uploaded · Human review pending · 0 published by this channel';
    message('Private library ready. Choose a video to review.');
    for (const item of data.items) {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = item.fieldName; button.setAttribute('aria-current', 'false');
      const meta = document.createElement('small'); meta.textContent = duration(item.videoDuration) + ' · Review pending'; button.append(meta);
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
byId('review').addEventListener('submit', event => {
  event.preventDefault();
  if (!selected || !byId('review').reportValidity()) return;
  try { const draft = reviewData(); localStorage.setItem(draftKey(selected), JSON.stringify(draft)); byId('review-status').textContent = 'Saved on this device. No publication or regeneration was triggered.'; }
  catch { byId('review-status').textContent = 'Browser storage is unavailable. Export the review instead.'; }
});
byId('export-review').addEventListener('click', () => {
  if (!selected || !byId('review').reportValidity()) return;
  const url = URL.createObjectURL(new Blob([JSON.stringify(reviewData(), null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = 'mapkai-review-' + selected.fieldId + '-' + selected.sha256.slice(0, 12) + '.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
loadLibrary();
