# Creating v1.3 / Review v1.2 alignment addendum

This addendum preserves and supplements the original Creating and Review Policy audit history.

## Founder clarification

Unnecessary references to religion or politics should be avoided. When those subjects are themselves part of the knowledge being explained, simple, necessary references should be permitted with fair, objective, non-extreme treatment.

## Evidence of the previous conflict

`major-fields-run.mjs:sensitiveStatus` returned `SENSITIVE_TOPIC_REVIEW_REQUIRED` solely when a taxonomy subject matched religion/theology or political science/civics. `governance.mjs:classifySensitiveContent` also held a field by its identifier/name or a bare word such as elections. Neither path required a creator artifact or evidence of advocacy. The Arts and Humanities and Social Sciences runs were therefore held before creation; their empty review findings were not evidence of harmful content.

## Alignment

| Area | Finding | Update |
|---|---|---|
| Topic-based scope | CONFLICT with clarified intent | Field IDs and taxonomy inventories cannot be the sole reason for a sensitive hold. |
| Necessary neutral knowledge | PARTIAL | Creating v1.3 explicitly permits proportionate, attributed, well-sourced educational coverage under full independent review. |
| Unnecessary sensitive examples | ALIGNED | Least-sensitive-equally-effective-example rule retained. |
| High-risk central topics | ALIGNED | Advocacy, campaigning, persuasion, inflammatory conflict and unresolved high-risk scope still require human decision. |
| Independent evidence | PARTIAL | Review v1.2 requires a scoped assessment, passage evidence, necessity, neutrality, factual status and source references for necessary sensitive coverage. |
| Backend taxonomy | ALIGNED | No codes, subjects or branches removed or altered. |
| Version integrity | ALIGNED | New immutable releases; historical policy files, prior run bindings and NotebookLM submissions are not rewritten. |

The keyword screen is only triage. `CLEAR` means no deterministic hold; it never means semantic PASS or public release. A creator cannot supply their own final review approval.

## Version handling

Creating v1.3 is canonical and Review v1.2 depends on it. The exact digests and immutable historical versions are recorded in `policy/README.md` and the current lock in `factory-config.json`.

## Delivery boundary

Downloaded raw video, uploaded media, human review and public publication are separate stages. Source-pack PASS authorises NotebookLM submission, not an assertion that the generated video's content has independently passed review. The MapKAI delivery channel must retain the actual submission binding and generation attempt and must not expose internal audit materials in learner-facing content.

## Implementation and regression evidence

- New run binding: Creating v1.3 / Review v1.2, verified against canonical file SHA-256. Old policy digests are regression-checked.
- The deterministic classifier no longer holds religion/theology or political science solely because of names/codes. Signals from actual high-risk treatment still hold; CLEAR is never a semantic PASS.
- New PASS decisions require the independent review's `sensitiveContentAssessment`. Necessary neutral coverage needs passage/location, necessity, neutrality, factual status and source references. Creator self-approval is invalid.
- The Major Fields coordinator now refuses to reinitialize an existing batch. Separate policy-bound continuation records put Arts and Humanities / Social Sciences at CREATOR_PENDING without changing their old BLOCKED decisions or fabricating content.
- Nine existing raw videos were linked to their exact generation attempts. Original source hashes, policy hashes and MP4 containers were checked. Existing payloads/receipts are preserved; missing completion times remain UNKNOWN.
- The private delivery channel has no Generate, Brand or Publish action. The site API requires the signed founder cookie for catalog, raw video and source/audit access, resolves keys only from the catalog and supports byte ranges for playback.
- Human scores and final review decisions remain blank until a person fills them in; device-local drafts and export are explicitly labelled.

Production website deployment is a separate operational permission boundary. Private storage uploads do not mean the new page has been deployed, and a preview is not evidence of live-site availability.
