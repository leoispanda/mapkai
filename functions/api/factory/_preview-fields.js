import { CANONICAL_MAJOR_FIELDS } from './_major-fields.js';

// Explicit public-preview identities; this does not change the knowledge taxonomy.
export const PUBLIC_PREVIEW_FIELDS = Object.freeze({
  ...CANONICAL_MAJOR_FIELDS,
  '0031': 'Personal skills and development',
  '0542': 'Statistics',
});

export const PUBLIC_PREVIEW_FIELD_IDS = Object.freeze(
  Object.keys(PUBLIC_PREVIEW_FIELDS).sort((left, right) => left.localeCompare(right)),
);

export function isPublicPreviewField(fieldId, fieldName) {
  return Object.hasOwn(PUBLIC_PREVIEW_FIELDS, fieldId)
    && PUBLIC_PREVIEW_FIELDS[fieldId] === fieldName;
}
