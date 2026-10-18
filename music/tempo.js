/* Shared presentation of public, recording-bound BPM estimates. */
(() => {
  'use strict';
  const words = {
    zh: { unknown: 'BPM 待检测', half: '半/倍速待定', beat: '拍级待确认', section: '分段待核', running: '180 BPM · 跑步' },
    en: { unknown: 'BPM not analysed', half: 'Half/double-time uncertain', beat: 'Beat level unconfirmed', section: 'Section review', running: '180 BPM · Running' },
  };

  function sanitize(value) {
    if (!value || typeof value !== 'object' || !Array.isArray(value.bpmCandidates)
      || value.bpmCandidates.length < 1 || value.bpmCandidates.length > 6
      || !value.bpmCandidates.every(bpm => typeof bpm === 'number' && Number.isFinite(bpm) && bpm >= 20 && bpm <= 360)
      || !['strong', 'moderate', 'review'].includes(value.confidence)
      || typeof value.metricalAmbiguity !== 'boolean' || typeof value.sectionAmbiguity !== 'boolean'
      || typeof value.near180 !== 'boolean' || typeof value.analyzedAt !== 'string'
      || !/^\d{4}-\d{2}-\d{2}$/.test(value.analyzedAt)) return null;
    const date = new Date(`${value.analyzedAt}T00:00:00Z`);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value.analyzedAt) return null;
    const bpmCandidates = [...new Set(value.bpmCandidates)].sort((a, b) => a - b);
    // A server-issued eligibility flag is required. A title or creation target
    // cannot make a song eligible, nor can a conflicting section be overlooked.
    const near180 = value.near180 && !value.sectionAmbiguity && value.confidence !== 'review'
      && bpmCandidates.some(bpm => Math.abs(bpm - 180) <= 5 || Math.abs(bpm * 2 - 180) <= 5);
    return { bpmCandidates, confidence: value.confidence, metricalAmbiguity: value.metricalAmbiguity,
      sectionAmbiguity: value.sectionAmbiguity, near180, analyzedAt: value.analyzedAt };
  }

  function describe(track, language = 'zh') {
    const copy = words[language === 'zh' ? 'zh' : 'en'];
    if (!track) return { label: '', note: '', text: '', near180: false, estimated: false, unknown: false, confidence: null };
    if (track.tempoBpm === 180) return { label: copy.running, note: '', text: copy.running, near180: true, estimated: false, unknown: false, confidence: null };
    const estimate = sanitize(track.tempoEstimate);
    if (typeof track.tempoBpm === 'number' && Number.isFinite(track.tempoBpm) && track.tempoBpm >= 20 && track.tempoBpm <= 300) {
      const label = `${track.tempoBpm} BPM`;
      return { label, note: '', text: label, near180: estimate?.near180 === true,
        estimated: false, unknown: false, confidence: null };
    }
    if (!estimate) return { label: copy.unknown, note: '', text: copy.unknown, near180: false, estimated: false, unknown: true, confidence: null };
    const label = `≈${estimate.bpmCandidates.map(bpm => String(Math.round(bpm * 10) / 10)).join(' / ')} BPM`;
    const hasOctavePair = estimate.bpmCandidates.some((bpm, index, candidates) => candidates.slice(index + 1).some(other => Math.abs(other / bpm - 2) <= 0.06));
    const note = [estimate.metricalAmbiguity && (hasOctavePair ? copy.half : copy.beat), estimate.sectionAmbiguity && copy.section].filter(Boolean).join(' · ');
    return { label, note, text: [label, note].filter(Boolean).join(' · '), near180: estimate.near180,
      estimated: true, unknown: false, confidence: estimate.confidence };
  }

  globalThis.MapKAIMusicTempo = Object.freeze({ sanitize, describe });
})();
