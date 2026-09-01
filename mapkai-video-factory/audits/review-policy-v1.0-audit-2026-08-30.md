# MapKAI Review Policy v1.0 — Video Factory Audit

- Audit date: 2026-08-30
- Review baseline: policy/mapkai-review-policy-v1.0.md
- Creating baseline: policy/mapkai-creating-policy-v1.1.md
- Scope: current repository state of mapkai-video-factory
- Method: static inspection of runner.ts, autonomous/factory.mjs, prompts, schemas, generated packs, manifests, runtime reports and review dashboards
- Boundary: this audit did not call ChatGPT, Gemini or NotebookLM; it did not submit or regenerate a video; it did not modify prompts, validation, pipeline, taxonomy or runtime

## Version-history / alignment addendum — 2026-08-30

This file preserves the original Review Policy v1.0 audit snapshot above and below. The current policy alignment is recorded here without rewriting that historical assessment:

- **Review Policy v1.0 — immutable historical baseline**
  - Path: `policy/mapkai-review-policy-v1.0.md`
  - SHA-256: `2f56f3e2c46a00e2fbfc5314a3a57009e020839ebf933838a329b48ee0ea0f8c`
- **Review Policy v1.1 — current canonical review policy**
  - Path: `policy/mapkai-review-policy-v1.1.md`
  - SHA-256: `718562701d147a5194548e58352c4e7ad38b262f8be78d41448357c142369020`
  - Preserves the v1.0 review architecture and adds the `TAXONOMY_METADATA_LEAK` learner-facing compliance requirement.
- **Creating Policy v1.2 — current canonical creating policy dependency**
  - Path: `policy/mapkai-creating-policy-v1.2.md`
  - SHA-256: `28deb28a8da63372e52e981d34579c8cabce3b5f3de91fc88f26476599144058`

Runtime policy locks now point to Review Policy v1.1 and Creating Policy v1.2 for new runs. Existing run records and historical NotebookLM submission records remain bound to the versions recorded at their creation; they are not retroactively rewritten.

The original audit findings remain evidence of the pre-alignment state. They should not be read as a claim that the newly aligned runtime still lacks the bindings described in those historical sections.

## Policy status and interpretation

The original v1.0 audit snapshot established Review Policy v1.0 as the independent review standard and recorded that runtime enforcement was not yet implemented at that time. The alignment addendum above records the current v1.1/v1.2 binding and enforcement state.

The statuses below describe the current factory's review capability:

- ALIGNED — the requirement is materially represented and reviewable;
- PARTIAL — some supporting mechanism exists, but outcome evidence, independence, coverage or enforcement is incomplete;
- MISSING — no meaningful implementation of the review requirement was found;
- CONFLICT — current design actively undermines the requirement.

A missing runtime capability is not, by itself, a declaration that every existing artifact has failed. This audit does not issue PASS, REVISE, REBUILD or BLOCKED for any individual field artifact. It records the policy baseline and the current enforcement gap.

## A. Canonical Review Policy

Canonical file:

policy/mapkai-review-policy-v1.0.md

SHA-256:

2f56f3e2c46a00e2fbfc5314a3a57009e020839ebf933838a329b48ee0ea0f8c

In the original snapshot, the policy was independent from, and subordinate to, Creating Policy v1.1. The current canonical dependency is Creating Policy v1.2 under Review Policy v1.1. The review standard verifies outcomes rather than copying creator intentions or redefining MapKAI's learning philosophy.

The original snapshot recorded Creating Policy v1.1 as the content standard:

policy/mapkai-creating-policy-v1.1.md

SHA-256:

ea27858cd695f20c06b4e85b2eac3e1dfc4442cb36e6eccf596fab609cb0af4b

## B. Current factory architecture

    policy layer
    Creating Policy v1.1 + Review Policy v1.0
            |
            |  intended to govern and independently verify outcomes
            |  (no runtime policy binding yet)
            |
    MapKAI script.js taxonomy
            |
            +--> legacy runner.ts
            |      taxonomy snapshot + approved fables
            |      -> 80 v2-intellectual-journey packs
            |         (overview / blueprint / video_prompt / validation)
            |      -> lexical preflight and hard-coded QA fields
            |      -> Gemini Notebook submit
            |      -> monitor / download / pilot human review / branding
            |
            +--> autonomous/factory.mjs
                   taxonomy snapshot + controlled editorial profiles
                   -> persistent ChatGPT editorial stages
                      Explore -> Challenge -> Select -> Develop -> Self-review
                   -> editorial guidance and Critic / bounded revision
                   -> factual overview expansion
                   -> blueprint + prompt + structural checks + hashes
                   -> phase gates / quota / Notebook submission
                   -> monitor / download / automatic video review / repair
                   -> human review gate

The architecture contains several useful preparation and review surfaces, but the canonical Review Policy is not loaded, hashed, or acknowledged as a runtime input.

## Inventory evidence

- Legacy runner has 80 formal field packs and 80 content_validation.json files.
- Legacy validationFor writes knowledgeCoverage PASS 10, narrativeQuality PASS 9, intellectualInsight PASS 9, adultTone PASS 9 and fieldMapClarity PASS 9 for every generated pack (runner.ts:508–516). A repository scan finds all 80 validation files with score 10 and score 9.
- Legacy validateContent checks required files, headings, landmark counts, prompt phrases and those pre-written QA scores (runner.ts:606–633). It does not inspect the truth, learner outcome, field fidelity or evidence behind the score.
- Legacy defaultSpine supplies category-level thesis, question, history, applications and four generic branches for 77 of 80 fields; only the three pilot fields have field-specific pilotSpines.
- Autonomous v5 materializes seven package validations including the General Overview, five controlled field packages and the AI-era overlay.
- Autonomous knowledgeChecks verifies headings, keyword presence, branch counts, landmark markers, fact/fiction phrases and a few opening heuristics (autonomous/factory.mjs:289–355). Editorial Critic and video-review stages exist, but their output is score- and decision-oriented rather than an evidence-bound review record.
- Autonomous normaliseCritique and videoReviewPass accept thresholded model scores and a decision (autonomous/factory.mjs:721–724 and 1185–1193); normaliseCritique also writes status PASS regardless of the incoming decision, so status is not independent evidence.
- prompts/editorial-critic.md includes replace-three-nouns and delete-story tests. prompts/video-reviewer.md requests transcript, metadata and frames and says to record UNKNOWN when evidence is unavailable. Neither prompt establishes the full Review Policy evidence contract.
- schemas/editorial-critique.schema.json and schemas/video-review.schema.json do not require finding code, severity, artifact location, evidence excerpt, policy dimension, required change or decision impact.
- Human pilot review materials contain blank manual score fields and an intentionally unreviewed decision. This is a useful human gate surface, not an independent completed review.
- runtime/test-report.json reports factory integrity tests, queue/resumability checks and package presence; it is not a Review Policy compliance result. The current report's pass=true therefore cannot be treated as Review Policy PASS.

## C. Compliance audit

| Review Policy requirement | Legacy v2 | Autonomous v5 | Overall | Evidence / finding |
|---|---|---|---|---|
| Review Policy authority | MISSING | MISSING | MISSING | The canonical review file is not loaded, versioned or hashed by either runner. No component is required to acknowledge the review standard. |
| Verify outcomes, not intentions | MISSING | PARTIAL | PARTIAL | Legacy trusts pre-written QA fields. Autonomous has Critic and video-review stages, but scores and decisions are accepted without the required prior-model, transition, evidence-location and outcome record. |
| Five-layer review architecture | MISSING | PARTIAL | PARTIAL | No implementation names or completes Hard Gates → Quality Review → Adversarial Review → Creating Policy Verification → Final Decision. Autonomous has adjacent Critic and video-review stages, but not the full ordered architecture. |
| Factual / Epistemic Integrity hard gate | MISSING | PARTIAL | PARTIAL | Legacy has no factual or provenance gate. Autonomous prompts say no invented evidence and videoReviewPass rejects non-empty factualConcerns, but no source-backed claim review or evidence-bound finding is required. |
| Real-World Field Fidelity hard gate | CONFLICT | PARTIAL | PARTIAL | Legacy defaultSpine replaces mature field structure with category scaffolding for 77 fields. Autonomous controlled profiles describe real maps but are not independently checked against authoritative field representations. |
| Artifact Integrity hard gate | PARTIAL | PARTIAL | PARTIAL | Legacy validates Overview-shaped headings but has no artifact-level contract for Curriculum, Subject or Lesson. Autonomous records artifact types and package stages, but does not independently verify whether the cognitive job was completed. |
| Sensitive Content Governance hard gate | MISSING | MISSING | MISSING | No Sensitive Content Policy gate, sensitive-topic classification, SENSITIVE_TOPIC_REVIEW_REQUIRED state or human hold is present in runner, autonomous code, prompts or schemas. |
| Orientation Gain | PARTIAL | PARTIAL | PARTIAL | Required map sections and learner-model fields exist, but review checks headings or presence rather than whether the learner can locate the field and choose a next route. |
| Field Specificity | CONFLICT | PARTIAL | CONFLICT | The legacy category template can be reused by changing field nouns. Autonomous profiles are more specific, but there is no independent replacement test tied to evidence. |
| Existing-Intuition Leverage | PARTIAL | PARTIAL | PARTIAL | Prompts request familiar entry points and allow historical puzzles or thought experiments, but no reviewer records whether the selected doorway is natural or forced. |
| Discovery Value | PARTIAL | PARTIAL | PARTIAL | Narrative engines, opening hooks and editorial turns are specified. No review artifact demonstrates an actual discovery in the learner's understanding. |
| Genuine Intellectual Turn / Aha | PARTIAL | PARTIAL | PARTIAL | Legacy only stores an intellectualInsight score. Autonomous stores primaryAha and turn fields and applies thresholds, but no reviewer must state prior model → tension → new model. |
| Appropriate Depth | MISSING | PARTIAL | PARTIAL | Legacy has no too-shallow or too-deep review. Autonomous thresholds and prompts mention depth, but no evidence identifies assumed prior knowledge, removed complexity or layer drift. |
| Structural Clarity | PARTIAL | PARTIAL | PARTIAL | Branch headings and branch reasons are checked structurally. The checks do not establish that branches are real field territories or that their relationships form a usable map. |
| Terminology Timing | MISSING | PARTIAL | PARTIAL | Legacy has no timing check. Autonomous has knowledge-leak and delayed-name instructions, but no review of when a learner actually understands a concept relative to its term. |
| Compression Quality | MISSING | PARTIAL | PARTIAL | No implementation tests whether compression removed information while preserving causal relationships, distinctions, limits and disagreements. |
| Mental Model Usability | MISSING | PARTIAL | PARTIAL | Learner outcome and finalMentalModel fields exist, but no reviewer tests whether the learner can use the model on a future problem. |
| Human Naturalness / Anti-Template Quality | PARTIAL | PARTIAL | PARTIAL | Legacy generic-pattern scan and autonomous diversityAudit provide warning signals. Neither performs the ten-video template test with evidence-bound findings. |
| Adult Tone | PARTIAL | PARTIAL | PARTIAL | Prompts and QA fields request adult tone, but legacy scores are self-issued and autonomous scores are not independently evidenced against a first-pass adult learner test. |
| Narrative Function | PARTIAL | PARTIAL | PARTIAL | Prompts say the story reveals structure and Critic asks whether story deletion damages explanation. No completed independent Story Removal finding is required. |
| Map Continuity | MISSING | PARTIAL | PARTIAL | Legacy has no canonical field-map artifact across Overview → Curriculum → Lesson. Autonomous embeds a modernFieldMap in guidance, but no adjacent artifact continuity contract exists. |
| Evidence-bound findings | MISSING | PARTIAL | PARTIAL | Legacy has notes and scores without locations. Autonomous preserves hashes, transcripts and arrays of weaknesses, but review schemas lack finding code, severity, location, excerpt and decision impact. |
| Adversarial Review | MISSING | PARTIAL | PARTIAL | No deliberate adversarial stage or result set exists. Autonomous Critic includes a few genericity questions, but it is not the complete adversarial battery and independence is not established. |
| Creating Policy v1.1 compliance verification | MISSING | PARTIAL | PARTIAL | Legacy does not verify the current Creating Policy. Autonomous structural checks cover several principles but do not bind the v1.1 hash or independently verify sensitive boundaries, field architecture and outcomes. |
| Final decision vocabulary | MISSING | PARTIAL | PARTIAL | Legacy has status and QA fields but no PASS / REVISE / REBUILD / BLOCKED decision contract. Autonomous accepts PASS or REVISE in editorial critique and PASS, FAIL or UNKNOWN in video review, but has no complete REBUILD / BLOCKED review decision path. |
| Repairability and consequence routing | PARTIAL | PARTIAL | PARTIAL | Legacy retry statuses are operational and do not distinguish local repair from structural rebuild. Autonomous has bounded repair diagnoses and human-review holds, but no hard-gate consequence matrix tied to the Review Policy. |

## D. Current hard-gate and quality interpretation

### Hard Gates

The current factory has preparation signals for some gates but does not yet have independent gate decisions.

- Factual integrity: source-pack prompts and factualConcerns are safeguards, not proof of factual review.
- Field fidelity: controlled seeds are stronger than legacy defaults, but no authoritative comparison is recorded.
- Artifact integrity: Overview-oriented checks do not establish the correct cognitive task for every artifact level.
- Sensitive governance: no autonomous gate exists. A potentially sensitive field or example is not automatically classified, held, or routed to human review.

### Quality Review

The current factory can carry fields such as central question, Aha, branches, methods, learner model and connections. These fields are useful inputs. They are not evidence that the finished artifact produced the intended learner outcome.

### Adversarial Review

The diversity audit and Critic genericity tests are useful early warning mechanisms. They do not yet run the full Generic, Aha, Knowledge Removal, Story Removal, Label Removal, Map, Depth, Terminology, AI Template, Forced Profundity, Redundancy, Natural Question, Sensitive Example and Real Field Return tests as an evidence-bound review.

### Creating Policy compliance

Creating Policy v1.1 is established as the canonical content standard. Current runtime checks do not bind its file hash or independently verify all applicable principles. This is a runtime-enforcement gap, not a change to the policy baseline.

## E. Major implementation gaps

### P0

1. No Review Policy binding or policy-hash reference exists in runtime metadata.
2. No evidence-bound review record is required by either review schema.
3. Legacy hard-coded PASS values allow an artifact to appear reviewed without outcome evidence.
4. No factual/epistemic claim review or authoritative field-fidelity comparison is required before promotion.
5. No Sensitive Content Boundary or least-sensitive-example gate exists.
6. No complete independent review path separates creator/editorial generation from outcome verification.

### P1

7. No artifact-level review contract distinguishes Overview, Curriculum, Subject, Lesson and Deep Dive outcomes.
8. No review checks prove genuine Aha, Orientation Gain, Mental Model Usability or appropriate depth.
9. No complete adversarial review result set is persisted.
10. No canonical field-map continuity verification connects Overview → Curriculum → Subject → Lesson → Deep Dive.
11. Final decisions do not support the full PASS / REVISE / REBUILD / BLOCKED semantics.
12. Human pilot review is prepared but remains blank and does not yet feed a policy-defined decision record.

## F. Review status

Policy baseline established:

- Review Policy v1.0 exists and is canonical for review-layer design.
- Creating Policy v1.1 remains the canonical content standard.

Runtime enforcement not yet implemented:

- The audit records gaps only.
- No prompts, validation, pipeline, taxonomy or runtime changes were made.
- No content artifact was automatically declared PASS, REVISE, REBUILD or BLOCKED.
