# MapKAI Review Policy
## Version 1.1 — Independent Quality-Control Standard

### Status and relationship

MapKAI Review Policy v1.1 is an independent quality-control standard for the MapKAI Content Factory.

The immutable v1.0 baseline remains available for historical review records. This v1.1 release preserves its review architecture and adds an explicit learner-facing taxonomy compliance requirement.

It operates under the current canonical Creating Policy:

**policy/mapkai-creating-policy-v1.2.md**

Creating Policy defines what MapKAI content should be.

Review Policy independently verifies what was actually built.

Review Policy does not replace, reinterpret, or extend MapKAI's learning philosophy. It verifies outcomes against the canonical policy and against the requirements of the artifact being reviewed.

The governing review principles are:

> **Verify outcomes, not intentions.**

> **Creating Policy defines what should be built. Review Policy independently verifies what was actually built.**

A creator's statement that “this has an Aha” is not evidence. A reviewer must identify the learner's prior mental model, the point at which it becomes inadequate, and the new understanding that replaces or qualifies it.

A creator's statement that “this is accessible” is not evidence. A reviewer must judge whether an intelligent adult with ordinary modern knowledge and no specialist training can understand the artifact on a first pass.

# 1. Purpose

MapKAI Review Policy decides whether generated content has reached the MapKAI standard and may enter the next production stage or be released.

The reviewer protects:

- factual and epistemic integrity;
- fidelity to real-world knowledge;
- learner understanding;
- appropriate depth;
- field specificity;
- mental-map quality;
- compliance with Creating Policy;
- MapKAI editorial identity;
- sensitive-content boundaries;
- natural, non-template communication.

Review must not lower its standard because content is polished, entertaining, model-generated, or difficult to revise.

The policy applies to every substantive MapKAI artifact, including:

- General Overview;
- field Overview;
- Curriculum;
- Subject;
- Lesson;
- Deep Dive;
- narrative blueprint;
- video prompt;
- generated video;
- supporting source or guidance artifact.

The reviewer must first identify the artifact level and the cognitive job it claims to perform. A review cannot approve an artifact that performs the wrong job well.

# 2. Review principles

## 2.1 Verify outcomes, not intentions

Reviewers inspect the final artifact and its evidence.

They do not infer compliance from:

- a prompt that requested an Aha;
- a creator's explanation of the intended structure;
- a field named in metadata;
- a score written by the generator;
- a claim that a model “understood” the source.

## 2.2 Preserve the two knowledge layers

Review must distinguish:

1. **Real-World Knowledge Architecture** — the mature human structure of disciplines, branches, subjects, concepts, methods, applications, and cross-field relationships.
2. **MapKAI Learning Representation** — the learner-facing path, examples, narrative order, discovery route, and cognitive reveal sequence.

A redesigned learner path is allowed.

A redesigned human knowledge ontology is not.

The reviewer must verify:

> **MapKAI does not redesign human knowledge. It redesigns the learner's path into human knowledge.**

> **Start from the learner's world, end in the real field.**

## 2.3 No average-score escape

Review uses evidence and gates, not a single average score.

A severe hard-gate violation cannot be offset by strong narrative, visual quality, or high scores elsewhere.

# 3. Review architecture

Every substantive review uses five layers in order.

## Layer 1 — Hard Gates

Check defects that cannot be outweighed by other strengths.

A hard-gate violation prevents PASS. Depending on severity and evidence, the result is REVISE, REBUILD, or BLOCKED.

## Layer 2 — Quality Review

Inspect whether the artifact actually produces MapKAI's intended learning and communication quality.

## Layer 3 — Adversarial Review

Actively try to disprove a polished artifact that may be generic, shallow, templated, or empty.

## Layer 4 — Creating Policy Compliance Verification

Independently check the final artifact against the current canonical Creating Policy v1.2. This is not a creator self-check.

## Layer 5 — Final Decision

Issue exactly one primary decision:

- PASS
- REVISE
- REBUILD
- BLOCKED

Do not replace these decisions with an unqualified numeric score.

# 4. Hard Gates

Hard gates protect conditions that must be true before quality strengths can be considered.

For every hard gate, the review record must state:

- what it protects;
- the violation condition;
- the consequence;
- whether the problem is repairable or requires rebuild;
- the evidence supporting the finding.

## 4.1 Factual and Epistemic Integrity

### What it protects

It protects the learner from fabricated history, false authority, invented evidence, and unjustified certainty.

### Violation condition

The artifact must not contain:

- fabricated scholars;
- fabricated quotations;
- invented evidence;
- invented experiments;
- invented dates;
- invented historical events;
- fictional narrative presented as real history;
- knowingly unsupported strong causal claims;
- contested interpretations presented as established fact.

A factual statement is also a violation when its wording creates a materially false impression of certainty, consensus, or causality.

### Evidence requirement

The reviewer must identify the exact claim or passage and, where relevant, the supporting source, missing source, uncertainty, or conflict in interpretation.

A creator's “no invented evidence” instruction is not evidence that the final artifact is accurate.

### Repairability

A local claim that can be removed, qualified, or sourced without changing the central structure is repairable. Fabricated authority, fabricated history, or a false factual foundation requires rebuild. Missing evidence is not repaired by inference; it is blocked until the evidence is available.

### Consequence

- A local unsupported or overstated claim may result in REVISE when it can be removed, qualified, or sourced without changing the central structure.
- Fabricated authority, fabricated history, or a false factual foundation normally requires REBUILD.
- If the reviewer cannot obtain the evidence needed for a reliable decision, use BLOCKED rather than guessing.

A clear fabrication must never PASS.

## 4.2 Real-World Field Fidelity

### What it protects

It protects the integrity of MapKAI's knowledge map and the learner's ability to recognise the real field.

### Violation condition

The artifact must not:

- invent a standard branch for storytelling convenience;
- treat a learner-facing narrative as the field's ontology;
- seriously distort the field's boundaries;
- remove essential structure and leave a false map;
- present a MapKAI-designed entry route as if it were the real academic structure;
- replace a mature field representation with a category-level template that does not faithfully encode the field.

The reviewer must distinguish a valid accessibility redesign from an invented knowledge architecture.

### Repairability

A local boundary, label, or omission that does not change the field map may be repaired. A field-wide generic structure, invented ontology, or material distortion requires rebuild. An unverified real-world structure is blocked until a reliable basis exists.

### Evidence requirement

Check the artifact against an authoritative or well-established representation of the field and identify:

- the real structure being represented;
- the passage that supports each major branch or relationship;
- any omitted structure that changes the learner's map;
- any invented or mislabelled branch;
- the boundary between real field structure and editorial route.

### Consequence

- A local missing boundary or misleading label may result in REVISE.
- A field-wide generic structure, invented ontology, or materially distorted map requires REBUILD.
- If the real-world structure cannot yet be verified, use BLOCKED.

## 4.3 Artifact Integrity

### What it protects

It protects the cognitive purpose of each artifact level.

### Violation condition

Each artifact must complete its own task.

- An Overview should create orientation, curiosity, and a first mental map.
- A Curriculum should create direction and a learning path.
- A Lesson should create real understanding of a specific subject or concept.
- A Deep Dive should extend depth without forcing the learner to reconstruct the map.

An artifact violates this gate when it performs the wrong cognitive job, for example:

- an Overview quietly becomes a detailed Lesson;
- a Curriculum becomes a catalogue with no route;
- a Lesson remains only a definition or slogan;
- a narrative replaces the knowledge structure;
- the learner cannot tell what level they are viewing.

### Repairability

A contained level drift or missing local explanation is repairable. An artifact built around the wrong cognitive task requires rebuild. An unknown or ambiguous artifact level is blocked until clarified.

### Evidence requirement

Record the declared artifact level, its intended cognitive job, and the passages or omissions showing whether that job was completed.

### Consequence

- A contained level drift may result in REVISE.
- A structure built around the wrong artifact purpose requires REBUILD.
- If the intended artifact level is missing or ambiguous, use BLOCKED until clarified.

## 4.4 Sensitive Content Governance

### What it protects

It protects learners from unnecessary polarisation, ideological persuasion, and unreviewable claims while preserving truthful coverage of real knowledge when sensitive content is genuinely necessary.

### Violation condition

The artifact violates this gate when it:

- centres a highly sensitive or highly contested topic without an approved Sensitive Content Policy;
- uses contemporary partisan politics, elections, political parties, ideological conflict, religious doctrine, religious identity, polarising culture-war material, or geopolitical advocacy without the required scope and review;
- introduces sensitive material for drama, hook, conflict, storytelling, familiarity, or intellectual tension when a normal modern low-sensitivity example explains the idea equally well;
- uses a sensitive example as persuasion, advocacy, or identity conflict rather than education;
- hides a contested interpretation behind factual-sounding language;
- proceeds despite an unresolved sensitivity classification.

### Repairability

An unnecessary sensitive example that can be replaced with an equally effective lower-sensitivity example is repairable. Advocacy, a boundary violation, or materially misleading sensitive treatment may require rebuild. Unresolved necessity, neutrality, factuality, or sourcing is blocked pending human review.

### Evidence requirement

For every sensitive example, record:

- what the example is;
- what concept or field claim it is intended to explain;
- why it is materially necessary;
- whether a lower-sensitivity example would explain the idea equally well;
- the sources and factual status;
- the neutrality and non-persuasion check;
- the distinction between established facts and contested interpretations.

### Consequence

- An unnecessary sensitive example that can be replaced locally may result in REVISE.
- A boundary violation, advocacy, or materially misleading sensitive treatment requires REBUILD or BLOCKED depending on whether a reliable repair path exists.
- If necessity, neutrality, factuality, or sourcing cannot be judged, mark SENSITIVE_TOPIC_REVIEW_REQUIRED and issue BLOCKED pending human review.

A sensitive field is not permanently excluded from MapKAI. It is not autonomously releasable until the required policy and review standards exist.

## 4.5 Taxonomy Metadata Compliance

### What it protects

This gate protects the boundary between MapKAI's backend knowledge architecture and learner-facing presentation. Canonical taxonomy identifiers may remain authoritative and useful to the factory without becoming unnecessary cognitive load for the learner.

### Violation condition

Record the finding code `TAXONOMY_METADATA_LEAK` when a learner-facing artifact unnecessarily exposes:

- Major Field IDs;
- Subject IDs;
- classification codes;
- internal taxonomy numbers; or
- internal knowledge-map coordinates.

The check applies to learner-facing Overviews, video narration, narration-directed video prompts, learner articles, curriculum explanations, subject introductions, lessons, Deep Dives, learner-facing titles, and section headings. It does not prohibit identifiers in backend metadata, manifests, filenames, validation records, or canonical knowledge representation.

An identifier may appear in learner-facing content only when the identifier itself has an explicitly approved educational purpose, such as teaching the classification system. Otherwise the reviewer must treat the leak as a repairable presentation and policy-compliance issue and block promotion until it is repaired.

### Evidence requirement

Record:

- the exact identifier and learner-facing location;
- the surrounding passage showing that the identifier is exposed;
- whether an approved educational purpose exists;
- the corresponding backend purpose, if relevant; and
- the required learner-facing replacement that teaches the knowledge rather than the coordinate.

The reviewer must distinguish a deterministic metadata finding from semantic quality. Absence of a detected identifier is not evidence that the artifact is otherwise sound.

### Core principles

> **Taxonomy guides the factory. Knowledge guides the learner.**

> **Do not teach the identifier. Teach the knowledge.**

> **Do not expose internal knowledge-map coordinates unless those coordinates are themselves educationally meaningful.**

# 5. Quality Review dimensions

Hard Gates must be resolved before these dimensions determine the final quality decision.

| Dimension | Reviewer test | Evidence of a strong result |
|---|---|---|
| Orientation Gain | Does the learner know where they are in the field after reading or watching? | The learner can state what the field studies, why it exists, its major territories, their relationships, and a plausible next direction. |
| Field Specificity | Could the opening, Aha, and structure be moved to five unrelated fields by changing a few nouns? | The central tension, concepts, methods, branches, and consequences arise from this field's actual problem. |
| Existing-Intuition Leverage | Does the artifact use something a modern adult already knows, has seen, or has used when that is a natural doorway? | Familiar experience exposes the real intellectual problem without forcing a weak everyday analogy. Historical puzzles, observations, contradictions, and thought experiments remain valid doorways when more natural. |
| Discovery Value | Does the learner discover a connection or a changed framing rather than receive a passive summary? | The artifact moves from recognisable experience through a real question and limitation to a useful new pattern. |
| Genuine Intellectual Turn / Aha | What was the prior model, what tension broke it, and what new model replaced it? | The reviewer can point to all three: prior model → tension → new model. A delayed term, dramatic sentence, or slogan alone does not qualify. |
| Appropriate Depth | Is it simple enough for a first pass but deep enough to change how the learner sees the subject? | The artifact avoids specialist overload without removing causal structure, meaningful distinctions, field boundaries, or limits. |
| Structural Clarity | Do concepts have positions, branches have reasons, and relationships form a map rather than a list? | Each major territory is introduced because a distinct pressure in the central question made it necessary. |
| Terminology Timing | Does the concept become understandable before the specialist term arrives? | The movement is experience → observation → distinction → concept → term. |
| Compression Quality | Did the artifact remove information without removing intellectual structure? | Causal relationships, essential distinctions, major limitations, disagreements, and connections survive compression. |
| Mental Model Usability | Can the learner use the final model to recognise or interpret a future problem? | The ending is a usable structure, not merely a memorable slogan. |
| Human Naturalness / Anti-Template Quality | Does it sound like understanding rather than a model executing an educational prompt? | Rhythm varies where the field requires it; transitions are caused by ideas; the artifact does not manufacture profundity or repeat a visible formula. |
| Adult Tone | Is the communication clear, curious, intelligent, conversational, respectful, and serious? | No childish characters, patronising explanation, classroom lecturing, fake excitement, or unnecessary drama. |
| Narrative Function | Does the story help the learner understand why the knowledge exists? | Removing the narrative would remove context or discovery, but the substantive field structure would still remain. |
| Map Continuity | Does this artifact zoom into the same canonical field representation as the adjacent layers? | Overview → Curriculum → Subject → Lesson → Deep Dive feels like one map becoming more detailed. If the canonical representation is not yet enforceable, mark NOT_YET_ENFORCEABLE. |
| Next-Step Orientation | Where applicable, does the artifact leave the learner oriented for further study? | The learner knows what is understood, what remains deeper, and where a sensible next route begins. |

Reviewers should record a concrete passage, omission, or observable behaviour for every non-trivial finding.

# 6. Adversarial review

After Quality Review, the reviewer must deliberately try to disprove the artifact.

The first question is not “How can this be improved?” It is:

> **What is wrong with this even if it initially feels good?**

Run the following tests where applicable:

- **Generic Test:** Can the opening be copied to unrelated fields?
- **Aha Test:** Is the Aha only a delayed definition?
- **Knowledge Removal Test:** If the polished narrative is removed, does substantive knowledge remain?
- **Story Removal Test:** If the story is removed, does the field structure still stand?
- **Label Removal Test:** If academic labels are removed, does the intellectual journey still make sense?
- **Map Test:** Can a learner draw or explain the first mental map in their own words?
- **Depth Test:** Did the artifact become easy only by deleting necessary complexity?
- **Terminology Test:** Did terminology arrive before understanding?
- **AI Template Test:** Would ten MapKAI artifacts reveal the same recurring narrative formula?
- **Forced Profundity Test:** Are any sentences present only to sound deep?
- **Redundancy Test:** Could 20–30 percent be removed with almost no loss of meaning?
- **Natural Question Test:** Are the questions ones a learner might genuinely ask, rather than prompts invented to move narration?
- **Sensitive Example Test:** Was politics, religion, ideology, or another sensitive case used when a lower-sensitivity example worked equally well?
- **Real Field Return Test:** Does the learner return to the real field rather than remain inside a story or MapKAI-created concept?

An adversarial failure is recorded with evidence and routed through the final decision logic. A polished artifact is not presumed sound because no surface error is obvious.

# 7. Creating Policy compliance verification

The reviewer must perform a final independent verification against canonical Creating Policy v1.2.

At minimum inspect:

- orientation before depth;
- real-world knowledge fidelity;
- separation of Real-World Knowledge Architecture and MapKAI Learning Representation;
- appropriate use of existing intuition;
- familiar-first sequencing when naturally appropriate;
- discovery;
- genuine Aha;
- problem before discipline where appropriate;
- story reveals structure;
- knowledge structure has reasons;
- simple without becoming shallow;
- appropriate depth;
- compression without intellectual damage;
- terminology timing;
- field specificity;
- epistemic integrity;
- usable mental model;
- map continuity;
- adult tone;
- human naturalness;
- Sensitive Content Boundary;
- least-sensitive-example rule;
- necessary-sensitive-content handling;
- learner-facing taxonomy metadata boundary and any `TAXONOMY_METADATA_LEAK` finding;
- artifact-level integrity;
- next-step orientation where applicable.

Each item receives exactly one of:

- COMPLIANT
- PARTIAL
- VIOLATION
- NOT_APPLICABLE
- NOT_YET_ENFORCEABLE

NOT_YET_ENFORCEABLE is appropriate only when the required canonical architecture, adjacent artifact, source, or review basis does not yet exist. It must not be used to hide a visible violation, and it must not be converted into PASS by assumption.

This verification is based on the final artifact, not on creator intention or prompt wording.

# 8. Evidence-bound review

Every substantive finding must be tied to evidence.

The following statements are incomplete without location and reasoning:

- “The Aha could be stronger.”
- “This feels generic.”
- “Consider making it more accessible.”

Each important finding must contain:

- finding code;
- severity;
- artifact location;
- evidence excerpt or precise summary;
- why it matters;
- policy or review dimension;
- required change;
- decision impact.

### Required evidence for common findings

**WEAK_AHA** must identify:

- the learner's prior model;
- the tension or observation that challenges it;
- the passage where the transition is attempted;
- why the transition does not produce a meaningful model change.

**GENERIC_PREMISE** must identify:

- the opening or passage;
- why it transfers to unrelated fields;
- the field-specific tension that is missing.

**TOO_DEEP** must identify:

- the technical concepts;
- the prior knowledge the artifact assumes but does not provide;
- why the material belongs in a deeper layer.

**SENSITIVE_EXAMPLE_UNNECESSARY** must identify:

- the sensitive example;
- the concept it is meant to explain;
- an equally effective lower-sensitivity alternative, if one exists;
- why the chosen example violates the least-sensitive-example rule.

If evidence is unavailable, record INSUFFICIENT_EVIDENCE and do not infer a PASS.

# 9. Final decision logic

The final record contains one primary decision.

## PASS

Use PASS only when:

- all Hard Gates pass;
- no unresolved critical violation remains;
- the artifact's core cognitive job is complete;
- Creating Policy's applicable requirements are met;
- Quality Review is at the required standard;
- Adversarial Review finds no structural failure;
- evidence is sufficient for the decision.

PASS does not mean perfect. Minor copy improvements may remain, but no core regeneration is required.

## REVISE

Use REVISE when:

- the intellectual direction is correct;
- the real field structure is materially correct;
- the artifact performs the correct job;
- the problems are local and repairable.

Examples include:

- a weak example;
- terminology introduced too early;
- a section that is too deep;
- minor AI-style repetition;
- a weak transition;
- insufficient discovery in one passage;
- one branch whose reason is unclear;
- one unnecessary sensitive example that can be replaced.

A revised artifact must be reviewed again.

## REBUILD

Use REBUILD when the problem is structural rather than cosmetic.

Examples include:

- a wrong central premise;
- a materially distorted field structure;
- an invented ontology;
- a generic intellectual engine;
- narrative replacing knowledge;
- no usable mental map;
- the wrong artifact-level task;
- pervasive shallowness;
- a structure built on fabricated or unsupported historical logic.

REBUILD means reworking the central intellectual structure, not polishing sentences.

## BLOCKED

Use BLOCKED when the reviewer cannot make a reliable autonomous decision.

Examples include:

- factual evidence unavailable;
- real-world field structure cannot yet be verified;
- a sensitive topic requires human or policy review;
- a canonical source is missing;
- policy ambiguity;
- artifact identity or version cannot be established;
- required evidence is absent.

BLOCKED is not FAIL. It means the basis for an autonomous release decision is insufficient.

A review must not use PASS as a substitute for missing evidence.

# 10. Controlled failure taxonomy

Use a small, clear, actionable, extensible vocabulary. Do not create a new code for every wording issue.

### Integrity and field structure

- FACTUAL_FABRICATION
- UNSUPPORTED_HISTORY
- UNSUPPORTED_CAUSAL_CLAIM
- FIELD_STRUCTURE_DISTORTION
- INVENTED_ONTOLOGY
- ARTIFACT_LEVEL_DRIFT
- INSUFFICIENT_EVIDENCE

### Premise, discovery, and map

- GENERIC_PREMISE
- GENERIC_FIELD_STRUCTURE
- WEAK_AHA
- NO_GENUINE_AHA
- NO_ORIENTATION_GAIN
- MECHANICAL_BRANCH_LIST
- MENTAL_MODEL_TOO_VAGUE
- NARRATIVE_OVERSHADOWS_KNOWLEDGE
- MAP_CONTINUITY_BREAK

### Depth, language, and naturalness

- PREMATURE_TERMINOLOGY
- TOO_SHALLOW
- TOO_DEEP
- OVER_SIMPLIFIED
- GENERIC_AI_STYLE
- FORCED_PROFUNDITY
- EXCESSIVE_REDUNDANCY
- CHILDISH_TONE

### Sensitive-content and governance

- SENSITIVE_BOUNDARY_VIOLATION
- SENSITIVE_EXAMPLE_UNNECESSARY
- SENSITIVE_TOPIC_REVIEW_REQUIRED
- POLICY_CLARIFICATION_REQUIRED
- TAXONOMY_METADATA_LEAK

A finding may carry more than one code only when the evidence shows distinct failures. Do not inflate severity by duplicating one problem under several labels.

# 11. Review Policy Authority

Review machinery—including reviewers, agents, models, prompts, validators, schemas, dashboards, and orchestration—must follow this Review Policy and the canonical Creating Policy.

Review machinery must not:

- redesign Creating Policy;
- add a new MapKAI learning philosophy;
- change passing criteria because of personal or model preference;
- ignore an explicit policy requirement because the artifact feels good;
- weaken a requirement because the current implementation cannot test it;
- treat an implementation limitation as permission to redefine the standard.

When a policy conflict or uncovered question is found, mark:

OPEN_QUESTION

or

POLICY_CLARIFICATION_REQUIRED

Do not silently convert the gap into a new canonical rule.

# 12. Review record requirements

A review record should preserve:

- artifact identity, level, version, and content hash;
- source and evidence references;
- reviewer mode and independence status;
- Hard-Gate results;
- Quality Review findings;
- Adversarial Review results;
- Creating Policy compliance results;
- all substantive findings with evidence;
- unresolved questions and missing evidence;
- repairability assessment;
- final decision;
- decision timestamp.

Automated checks may assist discovery and consistency. They do not replace outcome-based review, independent judgement, or human review where this policy requires it.

No review result by itself authorises branding or publishing when another human gate is required.

# 13. Review status discipline

A review may be complete while the artifact remains non-promotable.

Use the final decisions exactly as defined:

- PASS — evidence-backed release or next-stage eligibility;
- REVISE — local repair required;
- REBUILD — central structure must be reworked;
- BLOCKED — reliable judgement is not currently possible.

Keep findings, evidence, and decision separate. A score is not a decision, and a decision without evidence is not a valid review.

# 14. Final review standard

A successful MapKAI review does not ask whether the artifact sounds intelligent.

It asks whether the learner actually received:

- a truthful view of the real field;
- a natural route from their world into that field;
- a genuine discovery or mental-model change;
- the right amount of depth;
- a connected map rather than a list;
- a usable model for future learning;
- an adult, non-template explanation;
- and, where applicable, a safe and necessary treatment of sensitive material.

The final standard is:

> **Sound like understanding, not generation.**

> **Do not manufacture profundity.**

> **Do not repeat once the idea is clear.**
