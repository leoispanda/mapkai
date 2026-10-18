import { CANONICAL_MAJOR_FIELDS } from './_major-fields.js';

// Explicit public-preview identities; this does not change the knowledge taxonomy.
export const PUBLIC_PREVIEW_FIELDS = Object.freeze({
  ...CANONICAL_MAJOR_FIELDS,
  '0031': 'Personal skills and development',
  '0111': 'Education science',
  '0112': 'Training for pre-school teachers',
  '0113': 'Teacher training without subject specialisation',
  '0114': 'Teacher training with subject specialisation',
  '0211': 'Audio-visual techniques and media production',
  '0212': 'Fashion, interior and industrial design',
  '0214': 'Handicrafts',
  '0215': 'Music and performing arts',
  '0311': 'Economics',
  '0313': 'Psychology',
  '0533': 'Physics',
  '0542': 'Statistics',
});

export const PUBLIC_PREVIEW_FIELD_IDS = Object.freeze(
  Object.keys(PUBLIC_PREVIEW_FIELDS).sort((left, right) => left.localeCompare(right)),
);

export function isPublicPreviewField(fieldId, fieldName) {
  return Object.hasOwn(PUBLIC_PREVIEW_FIELDS, fieldId)
    && PUBLIC_PREVIEW_FIELDS[fieldId] === fieldName;
}
