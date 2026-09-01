// Canonical MapKAI major-field identities. Public preview catalogs may contain
// any delivered subset of these fields; delivery count is never a taxonomy.
export const CANONICAL_MAJOR_FIELDS = Object.freeze({
  '00': 'Generic programmes and qualifications',
  '01': 'Education',
  '02': 'Arts and Humanities',
  '03': 'Social Sciences, Journalism and Information',
  '04': 'Business, Administration and Law',
  '05': 'Natural Sciences, Mathematics and Statistics',
  '06': 'Information and Communication Technologies',
  '07': 'Engineering, Manufacturing and Construction',
  '08': 'Agriculture, Forestry, Fisheries and Veterinary',
  '09': 'Health and Welfare',
  '10': 'Services',
});

export const CANONICAL_MAJOR_FIELD_IDS = Object.freeze(
  Object.keys(CANONICAL_MAJOR_FIELDS).sort((left, right) => left.localeCompare(right)),
);

export function isCanonicalMajorField(fieldId, fieldName) {
  return Object.hasOwn(CANONICAL_MAJOR_FIELDS, fieldId)
    && CANONICAL_MAJOR_FIELDS[fieldId] === fieldName;
}
