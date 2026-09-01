# MapKAI Creating Policy — Video Factory Audit

- Audit date: 2026-08-30
- Scope: current repository state of `mapkai-video-factory`
- Policy history: `policy/mapkai-creating-policy-v1.0.md` (original), `policy/mapkai-creating-policy-v1.1.md` (historical v1.1), and `policy/mapkai-creating-policy-v1.2.md` (current canonical)
- Current canonical version: **v1.2**
- Method: static inspection of `runner.ts`, `autonomous/factory.mjs`, prompts, schemas, generated packs, manifests and dashboards
- Boundary: this audit did not call ChatGPT/Gemini/NotebookLM, submit a video, or consume quota; it did not modify prompts, validation logic, or pipeline code

## Version history

| Version | Role | Path | SHA-256 | Status |
|---|---|---|---|---|
| v1.0 | Original pre-governance, pre-architecture-addition baseline | `policy/mapkai-creating-policy-v1.0.md` | `dd69eb74809f7bf39c624f071c64e478649ad0014998166d69568be95db48152` | Immutable historical baseline |
| v1.1 | Governance and architecture additions, including the three binding governance principles and the two-layer knowledge-architecture clarification | `policy/mapkai-creating-policy-v1.1.md` | `ea27858cd695f20c06b4e85b2eac3e1dfc4442cb36e6eccf596fab609cb0af4b` | Immutable historical policy baseline |
| v1.2 | Global learner-facing presentation rule: taxonomy metadata remains backend-only by default; adds `TAXONOMY_METADATA_LEAK` finding and the three learner/factory principles | `policy/mapkai-creating-policy-v1.2.md` | `28deb28a8da63372e52e981d34579c8cabce3b5f3de91fc88f26476599144058` | **Current canonical Creating Policy** |

The hashes are for the repository files as stored. The restored v1.0 file has the same policy content as the original baseline, with the repository's conventional trailing newline.

## A. Canonical policy

The original v1.0, v1.1 and current v1.2 are preserved as independent Markdown sources. v1.0 and v1.1 remain historical and immutable; v1.2 is the canonical production baseline:

- `mapkai-video-factory/policy/mapkai-creating-policy-v1.0.md`
- `mapkai-video-factory/policy/mapkai-creating-policy-v1.1.md`
- `mapkai-video-factory/policy/mapkai-creating-policy-v1.2.md`

All policy files contain no model-, provider-, API-, NotebookLM-, Gemini- or GPT-specific instructions or implementation recipe. v1.1's governance clauses are provider-neutral authority and content-boundary rules, not machinery design. v1.0 preserves the original baseline; v1.1 adds the architecture clarification and governance clauses; v1.2 adds the learner-facing taxonomy-metadata boundary described below.

## v1.1 Addendum — Knowledge Architecture Clarification

The v1.1 canonical policy formally distinguishes two layers that must not be conflated:

1. **Real-World Knowledge Architecture**

   This is MapKAI's knowledge substrate. It should faithfully represent existing human knowledge: real disciplines, branches, subjects, concepts, methods, applications, and cross-field relationships. MapKAI should not invent a new academic ontology merely for teaching convenience.

2. **MapKAI Learning Representation**

   This is the learner-facing path into that substrate. MapKAI may redesign the entry point, begin from familiar experience or modern technology, select a useful problem, hidden connection, or Aha, and choose a cognitive order for revealing the structure—provided that the path ends in the real field rather than replacing it.

The governing principle is:

> **MapKAI does not redesign human knowledge. It redesigns the learner's path into human knowledge.**

> **Start from the learner's world, end in the real field.**

Sharing high-level structural concepts across fields is not itself a defect. The Field Specificity requirement applies to the underlying field representation: it must remain faithful to the mature real-world structure of that field, while the learner-facing narrative may be redesigned for accessibility, discovery, and continuity.

## v1.1 Addendum — Governance additions recorded in the canonical policy

The v1.1 canonical policy now formally adds three binding governance requirements:

1. **Policy Authority.** The Creating Policy is a binding production standard for every factory component. Implementation machinery must follow it, must not define or weaken it, and must mark uncovered questions as `OPEN_QUESTION` or `POLICY_CLARIFICATION_REQUIRED` rather than improvising.
2. **Sensitive Content Boundary.** The current factory prioritises broadly useful, educational, durable and non-polarising general knowledge. Highly sensitive or highly contested topics require a separate approved Sensitive Content Policy; unclear cases must be marked `SENSITIVE_TOPIC_REVIEW_REQUIRED` and must not proceed to autonomous generation.
3. **Sensitive Examples Should Be Necessary, Not Convenient.** Use the least sensitive example that explains an idea equally well. Sensitive examples require substantive necessity, factual and neutral treatment, clear separation of established and contested claims, and higher sourcing and review.

### Compatibility with existing policy clauses

These additions do not conflict with the learning principles. They establish precedence for implementation and constrain example selection. Existing references to politics or elections in Principle 15 (cross-field connections) and Principle 17 (modern reality) remain possible only when they satisfy the new boundary and necessity rules; they are not blanket permission to center sensitive content. Principle 12's commitment to mapping real human knowledge also remains intact: sensitive fields are not removed from the map, but their autonomous production is gated until the required policy and review standards exist.

### Version note

The original v1.0 and v1.1 remain immutable historical baselines. The v1.2 file is the current canonical Creating Policy because the learner-facing taxonomy-metadata rule is a substantive policy change.

## v1.2 Addendum — Taxonomy Metadata Presentation Boundary

The v1.2 canonical policy adds a global learner-facing presentation rule without changing the underlying taxonomy or real-world knowledge architecture.

### Backend / factory layer

The factory may and should retain Major Field IDs, Subject IDs, classification codes, internal taxonomy numbers, run identifiers, canonical mapping identifiers, filenames, directory identifiers and machine-readable relationships. These coordinates support knowledge architecture, mapping, governance, validation, continuity and production tracking.

### Learner-facing layer

Overview, video narration, video prompts intended for narration, learner articles, curriculum explanations, subject introductions, lessons, Deep Dives, learner-facing titles and section headings must not expose those internal identifiers by default. An exception requires an explicitly approved educational purpose in which the learner is studying the classification system itself.

The governing principles are:

> **Taxonomy guides the factory. Knowledge guides the learner.**

> **Do not expose internal knowledge-map coordinates unless those coordinates are themselves educationally meaningful.**

> **Do not teach the identifier. Teach the knowledge.**

This is consistent with the v1.1 two-layer architecture: real-world taxonomy remains authoritative in the backend, while the MapKAI Learning Representation presents the knowledge and relationships a learner needs. A learner-facing identifier leak is a repairable policy/presentation finding:

`TAXONOMY_METADATA_LEAK`

### Application to current artifacts

No existing content was rewritten in this audit. The current Major Field 00 learner-facing `overview.md` and `video_prompt.md` were created before this v1.2 rule and visibly contain internal labels such as `Field 00` and `0011`–`0031`. They should therefore be treated as **TAXONOMY_METADATA_LEAK / repair pending** in a future revision, while the backend manifest, audit and policy-binding metadata may continue to retain those coordinates.

### Version note

The new rule is substantive policy, so v1.2 is a new canonical version. v1.1 remains an immutable historical baseline. At the time of this policy-only audit snapshot, runtime and prompt bindings were intentionally not changed; their v1.1 references were recorded as a follow-up implementation-alignment item. The existing Review Policy v1.0's descriptive references to Creating Policy v1.1 were likewise left unchanged in that snapshot.

## B. Current factory architecture

```text
MapKAI script.js taxonomy
        |
        +--> legacy runner.ts
        |      taxonomy snapshot + approved fables
        |      -> 80 v2-intellectual-journey packs
        |         (overview / blueprint / video_prompt / validation)
        |      -> lexical preflight
        |      -> Gemini Notebook submit
        |      -> monitor / download / human review / branding
        |
        +--> autonomous/factory.mjs (additive v5)
               taxonomy snapshot + controlled editorial profiles
               -> persistent ChatGPT editorial stages
                  Explore -> Challenge -> Select -> Develop -> Self-review
               -> Director guidance JSON
               -> Critic / bounded revision
               -> factual overview expansion
               -> blueprint + prompt + validation + hashes
               -> phase gates / quota / Notebook submission
               -> monitor / download / video review / repair
               -> human review gate
```

Governance overlay: the canonical Creating Policy is intended to constrain every component shown above; the current implementation does not consume it as a runtime input or gate.

The optional `directors-cut` Remotion project is a proof-of-style renderer, not a connected content-production stage.

## Inventory evidence

- Legacy: 80 formal field packs. Only 3 have field-specific `pilotSpines` (0533 Physics, 0311 Economics, 0313 Psychology); the other 77 use `defaultSpine` and category-level scaffolding. That scaffolding may help organize a learner-facing path, but it is not by itself evidence of a faithful real-world field architecture.
- Legacy: all 80 validation files carry the same hard-coded QA values (`knowledgeCoverage=10`, `narrativeQuality=9`, `intellectualInsight=9`, `adultTone=9`, `fieldMapClarity=9`).
- Legacy: all 80 packs contain three fable summaries, while the fables are appended after the knowledge structure.
- Autonomous v5: six production packages (General Overview plus 0311, 0533, 0313, 0542 and 0421) plus an explicit AI-era overlay. Economics has a model-produced guidance/critique; the other controlled packages are directional seed previews.
- The earlier batch audit recorded a persisted ChatGPT rate-limit state; this policy-only update made no provider request and did not alter runtime state.

## C. Compliance audit

Status meanings: ALIGNED = materially represented; PARTIAL = present but incomplete or not reliably enforced; MISSING = no meaningful implementation; CONFLICT = current design actively undermines the policy principle.

| Creating Policy principle | Legacy v2 | Autonomous v5 | Overall | Evidence / finding |
|---|---|---|---|---|
| Orientation before depth | PARTIAL | ALIGNED | PARTIAL | Both emit a map-first spine and learner model; legacy default fields use generic orientation rather than a field-validated real-world representation. |
| Build from existing intuition | PARTIAL | ALIGNED | PARTIAL | v5 profiles name concrete familiar entry points; legacy defaults contain no field-specific learner doorway. |
| Familiar first, abstract later | PARTIAL | ALIGNED | PARTIAL | Blueprints delay definitions, but legacy source packs begin with template definitions and no semantic order check exists. |
| Discovery rather than passive explanation | PARTIAL | ALIGNED | PARTIAL | Engines and turns are specified; legacy defaults reduce discovery to a reusable template. |
| Genuine Wait—why? / Aha | PARTIAL | ALIGNED | PARTIAL | Aha fields and prompt language exist; automatic checks verify headings/strings, not whether the turn changes the learner’s model. |
| Problem first, discipline later | PARTIAL | ALIGNED | PARTIAL | Narrative prompts require a problem-first opening; the legacy source and default spine still lead with generic field language. |
| Story reveals structure | ALIGNED | ALIGNED | ALIGNED | Canon, blueprint and director/expander prompts explicitly say the story reveals necessity and does not replace the knowledge map. |
| Knowledge structure has reasons | PARTIAL | ALIGNED | PARTIAL | Pilot/v5 branch records include reasons; legacy default branches are “Foundations / methods / Applied / Boundary questions” for almost every field. |
| Simple without becoming shallow | PARTIAL | PARTIAL | PARTIAL | Mature tone is requested, but no readability/complexity or shallow-simplification check is implemented; boilerplate makes packs longer without adding field understanding. |
| Compress information, not intellectual structure | PARTIAL | ALIGNED | PARTIAL | v5 preserves branches, landmarks, limits and connections; legacy compression is mostly repeated prose around generic slots. |
| Terminology arrives when useful | PARTIAL | ALIGNED | PARTIAL | Knowledge-leak and delayed naming are explicit in v5; no validator confirms terminology order in generated output, especially legacy packs. |
| Real knowledge structure of our civilisation | ALIGNED | ALIGNED | ALIGNED | Taxonomy is extracted from `script.js`; the AI-era overlay is explicitly kept outside the formal taxonomy; no World K taxonomy is created. |
| Field specificity | CONFLICT | ALIGNED for controlled profiles | CONFLICT | The issue is not shared high-level structure. `defaultSpine` uses category-level questions, methods, history, applications and four generic branches for 77/80 fields, so the underlying representation may not faithfully capture each field's mature real-world structure. The learner-facing path may still be redesigned. |
| Epistemic integrity | PARTIAL | PARTIAL | PARTIAL | Fact/fiction firewall and “no invented evidence” instructions are strong; legacy validation writes PASS without factual or semantic evidence, and no claim/provenance ledger is required. |
| Cross-field connections | PARTIAL | ALIGNED | PARTIAL | v5 records named connections with differences; legacy connections are often generic neighbouring-field sentences. |
| Map continuity | PARTIAL | PARTIAL | PARTIAL | Pack artifacts are versioned and hashed, but no canonical field-map artifact is consumed by Overview → Curriculum → Lesson, and policy is not linked from runtime metadata. |
| Modern reality as a learning asset | PARTIAL | ALIGNED | PARTIAL | v5 uses real modern systems/applications; default legacy profiles mostly inherit category examples rather than field-specific learner doorways. |
| Adult, curious, respectful tone | PARTIAL | ALIGNED | PARTIAL | Prompts set the right tone; repeated scaffold prose and academic filler in legacy packs can feel like a template or lecture. |
| Usable mental model at the end | PARTIAL | ALIGNED | PARTIAL | Learner-model fields exist; no check tests whether a learner could use the model to recognise a future problem. |
| Curiosity / next step orientation | PARTIAL | PARTIAL | PARTIAL | Legacy has a “Reading the Map Beyond This Overview” section; v5 points to a map but has no explicit next-route artifact or validator. |
| Policy/implementation separation | ALIGNED as a file | MISSING as a binding | PARTIAL | The v1.2 canonical file is provider-neutral, but no factory code references or records its policy version/hash; active prompts/canon remain implementation-oriented. |
| Policy Authority | MISSING | MISSING | MISSING | The v1.2 canonical policy exists, but factory components are not required to load, acknowledge, or enforce it, and no `OPEN_QUESTION` / `POLICY_CLARIFICATION_REQUIRED` gate is wired. |
| Sensitive Content Boundary | MISSING | MISSING | MISSING | No separate Sensitive Content Policy or sensitive-topic scope gate exists. The taxonomy includes potentially sensitive fields such as Religion and theology, Political sciences and civics, and Military and defence, but no review status prevents autonomous generation when the boundary is unclear. |
| Sensitive examples should be necessary, not convenient | MISSING | MISSING | MISSING | Prompts and artifacts contain no least-sensitive-example rule, necessity rationale, or escalation field; no validator checks that politics, religion, ideology, or other sensitive material is essential rather than a convenient hook or analogy. |
| Taxonomy metadata must not leak into learner-facing content | CONFLICT | MISSING | CONFLICT | Backend metadata is necessary and present, but learner-facing artifacts are not separated from it. The current Major Field 00 `overview.md` and `video_prompt.md` expose `Field 00` and `0011`–`0031` without an approved educational purpose; this is a repairable `TAXONOMY_METADATA_LEAK`. |

## D. Main gaps and conflicts

### P0 — direct policy conflicts

1. **Canonical real-world representation gap (CONFLICT / field specificity).** `defaultSpine` supplies one category-level thesis, central question, branch pattern, history, applications and generic learner outcome to 77 fields. Shared structural patterns are not the problem; the problem is that the resulting representation may not faithfully encode each field's actual mature disciplines, branches, subjects, concepts, methods, applications and relationships. Replacing the field name does not produce a faithful canonical field representation, even though the learner-facing path may be redesigned later.
2. **Hard-coded editorial PASS (CONFLICT / epistemic assurance).** `validationFor` unconditionally writes passing scores for every legacy pack. The later preflight therefore checks the presence of a self-issued score rather than the quality or truth of the artifact.
3. **Repeated expansion boilerplate (high generic-AI/textbook risk).** `expandBullets` appends the same explanation to every branch, landmark, application and connection. Static scan: all 80 legacy packs contain this repeated phrase.
4. **Policy Authority is not a binding input (MISSING).** The v1.2 canonical policy now exists, but the active runners neither load it nor persist a policy hash/version, and no gate requires components to defer uncovered questions to `OPEN_QUESTION` or `POLICY_CLARIFICATION_REQUIRED`. Compliance can drift silently.
5. **Sensitive Content Boundary is not enforced (MISSING).** No separate Sensitive Content Policy, topic-scope classification, or `SENSITIVE_TOPIC_REVIEW_REQUIRED` hold exists before autonomous generation. Potentially sensitive taxonomy fields therefore have no policy-level production gate.
6. **Sensitive-example necessity is not enforced (MISSING).** Artifacts do not record why a sensitive example is materially necessary, whether a lower-sensitivity example was considered, or whether the higher sourcing and review standard was met.
7. **Learner-facing taxonomy metadata leak (CONFLICT).** The new v1.2 rule requires backend/frontend separation, but current Field 00 learner-facing artifacts contain internal Field/Subject codes. This is a presentation-compliance issue, not a reason to delete or alter backend taxonomy metadata; it should be repaired before learner-facing promotion.

### P1 — material partial implementations

8. **Semantic validation is too lexical.** Heading presence, keyword matching, branch counts and `BEFORE:` counts can pass a mechanically generated artifact; they do not test faithful real-world field representation, field-specific causal explanation, genuine discovery, terminology timing, readability or mental-model usability.
9. **Prompt wiring drift.** `runner.ts` actively reads `master_video_director.md`; `mapkai-intellectual-journey.md` is not used by that runner. Autonomous v5 checks that `master_video_director_v5.md` exists but renders its active prompt inline, so file edits can become non-operative.
10. **Map continuity is not yet a product contract.** There is no canonical field-map artifact shared with Curriculum/Lesson generation.
11. **Evidence/provenance is advisory.** “No invented evidence” is stated, but source claims, simplifications, disagreements and analogy boundaries are not represented in a structured, auditable artifact.
12. **Adult accessibility has no gate.** Tone is instructed, not measured; the legacy boilerplate increases word count (roughly 2,515–2,917 words) without guaranteeing clarity.

## E. Recommended next steps (not executed)

### Priority P0

- Bind the current canonical Creating Policy v1.2 as the recorded policy baseline: load the canonical file, persist a read-only policy version/hash reference, and require every factory component to defer uncovered questions to `OPEN_QUESTION` or `POLICY_CLARIFICATION_REQUIRED`.
- Establish for each field a canonical field knowledge representation grounded in existing, mature real-world knowledge architecture, and explicitly separate it from the MapKAI learner-facing presentation path. Do not invent a new discipline ontology for pedagogical convenience.
- Add a pre-generation sensitive-content boundary gate. Until a separate Sensitive Content Policy is approved, unclear or in-scope topics must be held as `SENSITIVE_TOPIC_REVIEW_REQUIRED` and must not proceed to autonomous generation.
- Replace hard-coded QA PASS values with evidence-bound checks; unknown/unreviewed content must remain non-promotable.
- Enforce the v1.2 backend/frontend boundary: retain taxonomy identifiers in factory artifacts, but block learner-facing promotion when `TAXONOMY_METADATA_LEAK` is found without an approved educational purpose.

### Priority P1

- Extend validation beyond headings: test field-specificity, causal branch reasons, real Aha/reversal, familiar doorway, terminology order, fact/fiction boundaries, usable mental model and next-route orientation.
- Establish one canonical real-world field representation and continuity checks for Overview → Curriculum → Lesson, with learner-facing paths derived from it rather than replacing it.
- Select and wire one authoritative prompt source per stage; persist its version/hash.
- Require a least-sensitive-example decision and necessity rationale in content provenance; sensitive examples should trigger the higher sourcing and review standard specified by the policy.
- Add structured provenance/claim-status notes for historical facts, current interpretations, disagreements, simplifications and thought experiments.
- Add a learner-facing metadata scan that reports `TAXONOMY_METADATA_LEAK` separately from backend taxonomy validation.

### Priority P2

- Add a lightweight readability/depth check and a human calibration rubric for “generic AI” risk.
- Decide whether the Remotion directors-cut proof becomes a downstream renderer or remains a separate experiment.
- Wait for the artifact-specific Overview/Curriculum/Lesson specifications and Review Policy before changing production behavior.

No recommended change above was applied in this audit.

## v1.2 Implementation Alignment Addendum — 2026-08-30

The follow-up policy dependency alignment has now been implemented without rewriting this audit's historical evidence or any prior run record:

- `factory-config.json` and governance loading bind new runs to Creating Policy v1.2 (`28deb28a8da63372e52e981d34579c8cabce3b5f3de91fc88f26476599144058`) and Review Policy v1.1 (`718562701d147a5194548e58352c4e7ad38b262f8be78d41448357c142369020`).
- Review Policy v1.1 preserves the v1.0 architecture and adds the `TAXONOMY_METADATA_LEAK` compliance requirement.
- Deterministic preflight now detects explicit learner-facing taxonomy coordinates while allowing the same identifiers in backend metadata; semantic review remains mandatory.
- Existing v1.0/v1.1 policy files and historical run/submission metadata remain immutable. The earlier matrix and recommendations above describe the pre-alignment implementation state; this addendum records the current binding/enforcement state.
