export const SCORE_KEYS = ['narrativeEngagement', 'intellectualInsight', 'knowledgeCoverage', 'mentalMapClarity', 'matureTone', 'visualQuality', 'differentiation'];
const TEXT_KEYS = ['strengths', 'weaknesses', 'missingKnowledge', 'openingApproach'];
export const reviewKey = item => `reviews/${item.id}/${item.sha256}/decision.json`;
export function validateReview(input, item) {
  if (input?.schemaVersion !== 'mapkai-human-video-review.v1' || input.generationAttemptId !== item.id || input.fieldId !== item.fieldId || input.rawVideoSha256 !== item.sha256) throw new Error('Review must refer to this exact video attempt and hash.');
  if (!['Accept', 'Regenerate'].includes(input.decision)) throw new Error('Choose Accept or Regenerate before submitting.');
  const scores = {};
  for (const key of SCORE_KEYS) {
    const score = input.scores?.[key];
    if (!Number.isInteger(score) || score < 0 || score > 10) throw new Error('Complete every score with an integer from 0 to 10.');
    scores[key] = score;
  }
  const review = { schemaVersion: input.schemaVersion, generationAttemptId: item.id, rawVideoSha256: item.sha256, fieldId: item.fieldId, decision: input.decision, scores };
  for (const key of TEXT_KEYS) {
    if (typeof input[key] !== 'string' || input[key].length > 4000) throw new Error('Review notes must be text of at most 4,000 characters each.');
    review[key] = input[key].trim();
  }
  if (!review.strengths && !review.weaknesses) throw new Error('Include evidence from the video in strengths or weaknesses.');
  if (review.decision === 'Regenerate' && !review.weaknesses) throw new Error('Describe what must change before regeneration.');
  if (!['None', 'Low', 'Medium', 'High'].includes(input.genericAiFeeling) || !['Yes', 'Maybe', 'No'].includes(input.keepWatching)) throw new Error('Complete the viewing assessment.');
  return { ...review, genericAiFeeling: input.genericAiFeeling, keepWatching: input.keepWatching, publicationAction: 'NONE' };
}
export async function readReview(bucket, item) {
  const object = await bucket.get(reviewKey(item));
  if (!object) return { record: null, etag: null };
  const record = await object.json();
  if (record.schemaVersion !== 'mapkai-review-record.v1' || !Number.isSafeInteger(record.revision) || record.revision < 1) throw new Error('Invalid stored review.');
  validateReview(record.review, item);
  return { record, etag: object.etag };
}
export function reviewTransition(review, commandId) {
  const regenerate = review.decision === 'Regenerate';
  return { status: regenerate ? 'REGENERATION_PENDING' : 'BRANDING_PENDING', nextAction: { id: commandId, type: regenerate ? 'REGENERATE' : 'BRAND', state: 'QUEUED', generationAttemptId: review.generationAttemptId, rawVideoSha256: review.rawVideoSha256 } };
}
