import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const context = vm.createContext({});
vm.runInContext(await readFile(new URL('../music/tempo.js', import.meta.url), 'utf8'), context);
const tempo = context.MapKAIMusicTempo;
const estimate = { bpmCandidates: [89.96, 179.92], confidence: 'strong', metricalAmbiguity: true,
  sectionAmbiguity: false, near180: true, analyzedAt: '2026-10-18' };

test('an estimate displays approximate candidates and explicit metrical uncertainty', () => {
  const description = tempo.describe({ tempoEstimate: estimate }, 'en');
  assert.equal(description.label, '≈90 / 179.9 BPM');
  assert.equal(description.note, 'Half/double-time uncertain');
  assert.equal(description.near180, true);
  assert.equal(description.estimated, true);
  assert.equal(tempo.describe({ tempoEstimate: estimate }, 'zh').note, '半/倍速待定');
});

test('only typed complete public estimates are accepted, without coercing strings or non-finite BPM', () => {
  for (const malformed of [null, {}, { ...estimate, confidence: undefined }, { ...estimate, analyzedAt: '2026-02-30' },
    { ...estimate, near180: 'true' }, { ...estimate, bpmCandidates: [] }, { ...estimate, bpmCandidates: [NaN] },
    { ...estimate, bpmCandidates: [Infinity] }, { ...estimate, bpmCandidates: ['180'] },
    { ...estimate, bpmCandidates: [10] }, { ...estimate, bpmCandidates: [361] },
    { ...estimate, bpmCandidates: [80, 90, 100, 110, 120, 130, 140] }]) {
    assert.equal(tempo.sanitize(malformed), null);
    assert.equal(tempo.describe({ tempoEstimate: malformed }).near180, false);
  }
});

test('a single numerical candidate does not manufacture a half/double-time partner', () => {
  for (const bpmCandidates of [[192], [180], [80, 120]]) {
    const track = { tempoEstimate: { ...estimate, bpmCandidates } };
    assert.equal(tempo.describe(track, 'en').note, 'Beat level unconfirmed');
    assert.equal(tempo.describe(track, 'zh').note, '拍级待确认');
  }
});

test('near-180 eligibility requires the server flag, supporting candidates, and no section conflict', () => {
  for (const change of [{ near180: false }, { bpmCandidates: [95, 190] },
    { sectionAmbiguity: true }, { confidence: 'review' }]) {
    assert.equal(tempo.describe({ tempoEstimate: { ...estimate, ...change } }).near180, false);
  }
  assert.equal(tempo.describe({ tempoEstimate: { ...estimate, sectionAmbiguity: true } }).note, '半/倍速待定 · 分段待核');
  for (const requestedTempoBpm of [180, '180']) {
    assert.equal(tempo.describe({ title: '180 BPM', description: '180 running', requestedTempoBpm }).near180, false);
  }
});

test('a verified API value retains the exact running badge; other values never gain it', () => {
  assert.equal(tempo.describe({ tempoBpm: 180 }, 'en').text, '180 BPM · Running');
  assert.equal(tempo.describe({ tempoBpm: 180 }).estimated, false);
  for (const tempoBpm of ['180', NaN, undefined]) {
    const description = tempo.describe({ tempoBpm }, 'en');
    assert.equal(description.unknown, true);
    assert.equal(description.near180, false);
  }
  for (const tempoBpm of [90, 179.8]) {
    const description = tempo.describe({ tempoBpm }, 'en');
    assert.equal(description.text, `${tempoBpm} BPM`);
    assert.equal(description.near180, false);
    assert.equal(description.estimated, false);
  }
  assert.equal(tempo.describe({ tempoBpm: 90, tempoEstimate: estimate }).near180, true);
  assert.equal(tempo.describe(null).text, '');
});
