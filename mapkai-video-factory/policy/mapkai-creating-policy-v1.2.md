# MapKAI Creating Policy
## Version 1.2 — Content Factory Standard

### Governance Principles

The following governance principles are binding across MapKAI content production. They govern how the Creating Policy is interpreted and implemented; they do not replace the learning principles below.

#### Policy Authority

MapKAI Creating Policy is the binding production standard, not optional guidance.

All factory components—including models, agents, prompts, validators, reviewers and orchestration—must follow the canonical policy.

Implementation machinery must not independently:

- redefine MapKAI's learning philosophy;
- invent new editorial principles and treat them as canonical;
- weaken an existing policy principle for execution convenience;
- replace the policy with a model's own preferences;
- change MapKAI's knowledge philosophy;
- establish a new ontology or learning framework.

If the policy does not clearly cover a question, implementation machinery must not improvise. The question should be marked:

`OPEN_QUESTION`

or

`POLICY_CLARIFICATION_REQUIRED`

and held for a policy decision.

The core principle is:

> **Implementation machinery follows policy. Implementation machinery does not define policy.**

#### Taxonomy Metadata Must Not Leak Into Learner-Facing Content

MapKAI's factory and backend may—and should—retain canonical taxonomy metadata, including:

- Major Field IDs;
- Subject IDs;
- classification codes;
- internal taxonomy numbers;
- run identifiers;
- canonical mapping identifiers;
- filenames, directory identifiers and machine-readable relationships.

These identifiers are used for knowledge architecture, field/subject mapping, governance, validation, continuity and production tracking. They belong to the factory/backend layer.

Learner-facing MapKAI content must not expose taxonomy codes or internal classification identifiers by default. This rule applies to:

- Overview;
- video narration;
- video prompts intended for narration;
- learner articles;
- curriculum explanations;
- subject introductions;
- lessons;
- Deep Dives;
- learner-facing titles and section headings.

Learner-facing content should not ordinarily contain labels such as `Field 00`, `Field 01`, `0011`, `0021`, `0031`, `0311`, or other taxonomy/classification codes. The only exception is an explicitly approved learning purpose in which the learner is being taught the classification system itself.

The default rule is:

> **Do not teach the identifier. Teach the knowledge.**

In the learner-facing layer, use the real subject names and natural explanations a learner needs—for example, “Basic programmes and qualifications,” “Literacy and numeracy,” and “Personal skills and development”—without adding internal coordinates. Keeping those coordinates in backend artifacts does not hide or change the real knowledge structure. It preserves the authority of the Real-World Knowledge Architecture while keeping the MapKAI Learning Representation focused on useful understanding.

If a taxonomy or classification identifier enters learner-facing content without an approved educational purpose, mark:

`TAXONOMY_METADATA_LEAK`

This is a repairable presentation and policy-compliance finding. It must be corrected before the learner-facing artifact is promoted.

The governing principles are:

> **Taxonomy guides the factory. Knowledge guides the learner.**

> **Do not expose internal knowledge-map coordinates unless those coordinates are themselves educationally meaningful.**

> **Do not teach the identifier. Teach the knowledge.**


#### Sensitive Content Boundary

At its current stage, MapKAI prioritises general knowledge content that is:

- broadly useful;
- educational;
- durable;
- non-polarising.

Until a separate Sensitive Content Policy has been created and approved, the factory must not autonomously generate content centred on highly sensitive or highly contested topics.

This includes, in particular:

- contemporary partisan politics;
- elections and political campaigning;
- ideological advocacy;
- religious doctrine or religious persuasion;
- claims about which religion is true or superior;
- political or religious identity conflicts;
- extremist ideologies;
- geopolitical propaganda or advocacy;
- highly polarising contemporary culture-war topics.

These areas are not permanently excluded from MapKAI. If MapKAI later covers Political Science, Religion, Geopolitics or another sensitive field, the project must first establish and approve separate standards for:

- scope;
- neutrality;
- sources;
- contested claims;
- review.

When it is unclear whether a proposed artifact or topic falls within this boundary, mark:

`SENSITIVE_TOPIC_REVIEW_REQUIRED`

and do not proceed with autonomous generation.

This boundary also qualifies the use of potentially sensitive examples listed elsewhere in this policy, including the modern-reality examples in Principle 17.

The core principle is:

> **Coverage grows with quality-control capability, not merely with generation capability.**

#### Sensitive Examples Should Be Necessary, Not Convenient

Even when the field itself is not sensitive, MapKAI should not introduce politics, religion, ideology or another highly sensitive issue merely for:

- a hook;
- storytelling;
- drama;
- analogy;
- familiarity;
- intellectual tension.

Use the least sensitive example that explains the idea equally well.

For example:

- Economics should prefer rent, prices, transport, work, consumption, supply and demand over elections or religious groups when those ordinary situations explain the idea clearly.
- Psychology should prefer ordinary life, work or social situations when they are sufficient, rather than using political polarisation to manufacture conflict.
- Statistics should not select a religious or political controversy to explain sampling, bias or correlation when a low-sensitivity case works equally well.

Only use political, religious, ideological or other sensitive content when it is materially necessary for understanding:

- the field;
- the concept;
- the field's real historical development;
- a real application.

When such content is necessary, it must be:

- factual;
- educational;
- neutral;
- non-persuasive;
- explicit about the difference between established facts and contested interpretations;
- held to a higher standard of sourcing and review.

MapKAI should not create controversy where the knowledge itself does not require it.

### Knowledge Architecture Clarification

MapKAI separates two layers of knowledge architecture:

#### Real-World Knowledge Architecture

This is MapKAI's knowledge foundation. It should faithfully represent existing human knowledge, including real disciplines, branches, subjects, concepts, methods, applications and cross-field relationships. MapKAI should not invent a new academic ontology merely for teaching convenience.

#### MapKAI Learning Representation

This is the learner-facing path into that foundation. MapKAI may redesign the entry point, begin from existing intuition, familiar modern phenomena or technology, choose a worthwhile question or discovery, and reveal the structure in a useful cognitive order. It must still end in the real field rather than replacing it.

The core principle is:

> **MapKAI does not redesign human knowledge. It redesigns the learner's path into human knowledge.**

> **Start from the learner's world, end in the real field.**

Every field should therefore have a canonical field knowledge representation grounded in the mature structure of real-world knowledge, alongside a learner-facing presentation path derived from it. The underlying field representation must remain faithful to the real structure of that field; the learner-facing narrative may be redesigned for accessibility, discovery and continuity.

Sharing high-level structural concepts across fields is not itself a defect. The defect is replacing a field's actual knowledge architecture with a category-level template.
### 1. Purpose

MapKAI exists to help intelligent general learners quickly understand unfamiliar fields of knowledge by first building a clear mental map before going deep.

MapKAI is not designed to reproduce textbooks, encyclopedias, university lectures, or generic educational videos.

Its first job is orientation.

A learner should first understand:

- What kind of problem is this field trying to understand or solve?
- Why did this field of knowledge become necessary?
- What are its major parts?
- Why are those parts different?
- How do they connect?
- Where does this field sit within the wider map of human knowledge?
- Where should the learner go next if they want to understand more?

The central principle is:

> **Learn enough to see the map. Go deeper when it matters.**

---

# 2. Core Learning Goal

MapKAI aims to gradually build a broad general knowledge map in every learner.

The goal is not to make every learner an expert in every field.

The goal is to help learners develop enough understanding of major fields to recognise:

- what they study;
- why they exist;
- how they think;
- how their important concepts connect;
- how they influence modern life;
- how they relate to other fields.

Depth should grow from this map.

The learning architecture should therefore generally follow:

**Human Knowledge Map**

→ **Field**

→ **Subject**

→ **Curriculum**

→ **Lesson**

→ **Deep Dive**

Each layer should prepare the learner for the next layer without unnecessarily teaching material that belongs deeper in the hierarchy.

---

# 3. Audience Assumption

MapKAI learners are intelligent adults.

They are not blank slates.

They already live inside modern civilisation and interact every day with the results of science, technology, economics, psychology, law, medicine, engineering, business and many other fields.

They may already know many isolated facts without knowing how those facts connect.

Therefore:

> **MapKAI should build from what the learner already understands whenever this creates a faster and clearer path to the underlying knowledge structure.**

The content should not treat adults like children.

It should also not assume prior academic training.

---

# 4. The MapKAI Learning Experience

A strong MapKAI learning experience should often create the following feeling:

**“I know this.”**

↓

**“Wait — I never thought about it like that.”**

↓

**“These things are actually connected.”**

↓

**“Now I understand why this field needs to exist.”**

↓

**“Now I can see the first map of the field.”**

This is the preferred intellectual rhythm of MapKAI.

It is not a rigid storytelling template.

Different fields may require completely different openings, examples and narrative forms.

The factory should preserve:

> **the same intellectual rhythm, but not the same surface formula.**

---

# 5. Principle 1 — Orientation Before Depth

Every MapKAI artifact must know what level of the knowledge hierarchy it belongs to.

An Overview should not quietly become a Lesson.

A Lesson should not attempt to explain an entire field.

A Curriculum should provide a route through knowledge, not reproduce the full content of every lesson.

Before including information, ask:

> **Does the learner need this information to see the map at this stage?**

If not, it may belong at a deeper layer.

MapKAI should prefer meaningful orientation over completeness.

---

# 6. Principle 2 — Begin From a Worthwhile Question

Whenever possible, content should begin from a question, phenomenon, tension or recurring human problem that makes the knowledge field meaningful.

Do not begin simply because a topic exists.

Avoid default openings such as:

> “Economics is the study of…”

> “Psychology is defined as…”

> “Automation refers to…”

Instead ask:

> What repeatedly happens in reality that makes ordinary intuition insufficient?

The question must be genuinely connected to the field.

It should not be a dramatic hook added only to make the video feel interesting.

---

# 7. Principle 3 — Build From Existing Intuition

Modern learners already understand many useful pieces of the world.

Use them.

Whenever appropriate, begin with:

- familiar experiences;
- everyday technologies;
- common decisions;
- ordinary observations;
- widely encountered systems;
- recognisable modern situations.

Then reveal the deeper structure already hiding inside them.

Preferred movement:

**Familiar phenomenon**

→ **hidden pattern**

→ **general idea**

→ **concept**

→ **knowledge structure**

Example:

An air conditioner already gives the learner an intuitive entry into:

**measurement → decision → action → feedback**

before introducing formal automation concepts.

However:

> **Do not force everyday-life examples when they do not naturally represent the field.**

Some fields may be better introduced through a historical puzzle, visual phenomenon, scientific observation, social contradiction, thought experiment, real event or conceptual mystery.

Use the simplest natural doorway into the real intellectual problem.

---

# 8. Principle 4 — Create Discovery, Not Just Explanation

MapKAI should be enjoyable because the learner discovers something.

Entertainment should primarily come from intellectual discovery, not from jokes, exaggerated storytelling or superficial excitement.

Strong content should produce moments such as:

> “I have seen this many times, but I never noticed the pattern.”

or:

> “I thought these were separate things, but they are connected.”

or:

> “I thought the problem was X, but the deeper problem is actually Y.”

This discovery experience is central to MapKAI.

---

# 9. Principle 5 — Include a Genuine Intellectual Turn

Whenever appropriate, important MapKAI content should contain at least one meaningful change in how the learner understands the problem.

A good Aha is not simply:

> introducing the correct academic term.

It should change the learner's mental model.

For example:

Weak:

> “This is called opportunity cost.”

Stronger:

> “The real cost of a choice is not only what you pay, but also the best alternative you give up.”

The new idea should make something previously confusing become more understandable.

---

# 10. Principle 6 — Problem First, Discipline Later

Reality contains phenomena, not academic departments.

Do not make academic categories appear before the learner can understand why those distinctions became useful.

Preferred movement:

**Reality**

→ **repeated observation**

→ **problem**

→ **limits of ordinary understanding**

→ **need for a distinction or method**

→ **concept**

→ **field or branch**

Academic terminology should feel like a useful name for something the learner has already begun to understand.

---

# 11. Principle 7 — Story Reveals Structure

Narrative may be used to make knowledge understandable.

But:

> **The story is not the knowledge structure.**

The purpose of narrative is to reveal:

- why a problem matters;
- why ordinary intuition becomes insufficient;
- why a new concept becomes useful;
- why a branch of knowledge appears;
- why a particular structure exists.

The learner should finish remembering the intellectual map, not merely the story.

Narrative must eventually give way to the real field.

---

# 12. Principle 8 — Knowledge Structure Must Have Reasons

Never present a field as a mechanical list of branches.

Avoid:

> “Economics consists of microeconomics, macroeconomics, econometrics and behavioural economics.”

Instead reveal why different kinds of questions required different levels, approaches or methods.

For important divisions, the learner should ideally understand:

> **Why does this part exist?**

A map is more than a table of contents.

It should reveal relationships.

---

# 13. Principle 9 — Simple Without Becoming Shallow

MapKAI should be easy to understand.

This is a core intellectual requirement, not merely a writing style.

Use the simplest language that preserves the correct idea.

Prefer:

- clear sentences;
- common words;
- concrete explanation;
- one major new idea at a time;
- familiar examples;
- visible cause-and-effect relationships.

Avoid unnecessary:

- jargon;
- abstraction;
- academic language;
- complex sentence structures;
- terminology clusters;
- expert shorthand.

Core rule:

> **If something can be explained more simply without changing its meaning, explain it more simply.**

But also:

> **If simplification damages the learner's mental model, do not simplify it that far.**

---

# 14. Principle 10 — Compress Information, Not Intellectual Structure

MapKAI is designed for fast understanding.

Therefore content must be compressed.

But compression should remove:

- unnecessary details;
- excessive examples;
- minor historical facts;
- technical edge cases;
- advanced derivations;
- specialist terminology.

Compression should not remove:

- important causal relationships;
- essential distinctions;
- major limitations;
- meaningful disagreements;
- structural connections.

The objective is:

> **the minimum complexity required to preserve the correct mental map.**

---

# 15. Principle 11 — Terminology Should Arrive When It Becomes Useful

Avoid teaching terminology before understanding.

Preferred sequence:

**experience**

→ **observation**

→ **distinction**

→ **concept**

→ **term**

The learner should often experience:

> “So there is a name for this.”

rather than:

> “Here is another word I need to memorise.”

Technical terms remain important.

MapKAI does not remove specialist language.

It introduces it at the moment when the language helps organise understanding.

---

# 16. Principle 12 — Map the Real Knowledge of Our Civilisation

MapKAI maps real modern knowledge.

It does not create a fictional alternative academic system.

The Parallel Civilization lens may be used when useful to explore:

> Why might humans eventually need this kind of specialised knowledge?

But Parallel Civilization is only an editorial lens.

It is not:

- a fictional historical claim;
- a product ontology;
- an alternative taxonomy;
- a replacement for real disciplines.

Content must return clearly to:

- real fields;
- real branches;
- real concepts;
- real methods;
- real debates;
- real modern applications.

---

# 17. Principle 13 — Field Specificity

Every field must feel like itself.

A strong MapKAI Overview of economics should not be reusable as an Overview of psychology after changing a few nouns.

The central problem, intellectual tension, concepts and map must arise from the particular nature of the field.

Generic philosophical claims may support the story.

They cannot replace field-specific knowledge.

---

# 18. Principle 14 — Preserve Epistemic Integrity

MapKAI may simplify.

It may not fabricate.

Never invent:

- scholars;
- quotations;
- experiments;
- evidence;
- dates;
- historical events;
- academic consensus.

Clearly distinguish where appropriate between:

- established knowledge;
- current interpretation;
- disagreement;
- simplification;
- analogy;
- illustrative examples;
- fictional thought experiments.

A beautiful narrative must never be achieved by creating false history.

---

# 19. Principle 15 — Show Connections Across Knowledge

Knowledge fields are not isolated islands.

When useful, show meaningful relationships to other fields.

For example:

Electrical automation may connect to:

- electrical engineering;
- control engineering;
- computer science;
- mechanical engineering;
- robotics.

Economics may connect to:

- psychology;
- politics;
- mathematics;
- history;
- sociology.

But cross-field connections should help orientation.

Do not add connections merely to make the map appear larger.

---

# 20. Principle 16 — Maintain Map Continuity

All MapKAI content about the same field should share a coherent underlying mental model.

The Overview, Curriculum and Lessons should not independently reinvent the field.

Ideally:

**Canonical Field Map**

→ informs the **Overview**

→ informs the **Curriculum**

→ informs individual **Lessons**

→ supports later **Deep Dives**

Every deeper artifact should feel like zooming further into the same map.

The learner should not need to rebuild their mental model every time they enter a new layer.

---

# 21. Principle 17 — Modern Reality Is a Learning Asset

MapKAI learners live in modern civilisation.

Use this advantage.

They already interact with:

- smartphones;
- algorithms;
- banking;
- hospitals;
- elections;
- cars;
- logistics;
- online markets;
- electricity;
- climate systems;
- social networks;
- AI;
- automated machines.

These can often provide powerful shortcuts into complex knowledge.

Instead of rebuilding civilisation from zero, ask:

> **What does the learner already encounter that contains the structure we want to reveal?**

---

# 22. Principle 18 — Adult, Curious and Respectful Tone

MapKAI should never make the learner feel stupid.

Avoid:

- childish storytelling;
- artificial excitement;
- excessive rhetorical questions;
- exaggerated claims;
- patronising explanations;
- classroom-style lecturing.

The ideal tone is:

**clear + curious + intelligent + conversational + intellectually serious**

The learner should feel:

> “Someone is helping me see something clearly.”

not:

> “Someone is simplifying this because they assume I cannot understand it.”

---

# 23. Principle 19 — Every Artifact Should Leave a Mental Model

At the end of important content, the learner should be able to retain a small number of ideas that organise everything else.

For example:

Electrical automation:

**Sense → Decide → Act → Feedback**

Economics:

**People make choices under constraints, and those choices interact.**

A mental model is not necessarily a slogan.

It is a structure the learner can use to recognise future information.

---

# 24. Principle 20 — Leave the Learner Oriented for the Next Step

MapKAI content should not end with:

> “Now you understand this field.”

Instead the learner should understand:

- what they now know;
- what remains deeper;
- which directions exist;
- where they might go next.

Every layer should create both:

**satisfaction**

and

**curiosity.**

The learner should feel:

> “Now I can see the territory.”

and then:

> “I know where I want to explore next.”

---

# 25. Preferred Intellectual Rhythm

When appropriate, MapKAI content may follow this general movement:

### 1. Familiar

Begin from something the learner can already understand.

### 2. Question

Reveal something that is not as obvious as it first appears.

### 3. Tension

Show where ordinary intuition becomes insufficient.

### 4. Discovery

Reveal the deeper pattern.

### 5. Concept

Introduce the idea that helps explain the pattern.

### 6. Structure

Show how this idea connects to the wider field.

### 7. Map

Give the learner orientation inside the real knowledge structure.

### 8. Return

Return to modern reality so the learner can now see familiar things differently.

This sequence is guidance, not a mandatory script template.

---

# 26. What MapKAI Content Should Not Become

The factory should actively avoid generating:

### Textbook summaries

Definition → terminology → chapters → conclusion.

### Wikipedia-style encyclopedic entries

Accurate but without intellectual movement or orientation.

### Generic AI explainers

Polished language with little genuine insight.

### Mechanical lists

Branches, concepts and applications presented without reasons or relationships.

### Children's educational stories

Artificial characters and simplified narratives that reduce intellectual seriousness.

### Documentary entertainment without structure

Interesting stories that fail to leave a usable mental map.

### Academic lectures

Correct but unnecessarily difficult for a general learner.

### Motivational content

Claims that knowledge is “important”, “powerful” or “fascinating” without showing why.

### Fake historical narratives

Neat stories invented to make knowledge development appear simpler than it really was.

---

# 27. Pre-Generation Questions

Before generating substantial MapKAI content, the creator should be able to answer:

1. Who is this artifact for?

2. What level of the MapKAI knowledge hierarchy is this?

3. What should the learner understand after consuming it that they do not understand before?

4. What is the central worthwhile question?

5. What does the learner probably already know from ordinary modern life?

6. Can that existing intuition provide a natural doorway?

7. What is the central intellectual tension?

8. What is the main Aha?

9. Why did this particular knowledge structure become necessary?

10. What are the minimum concepts required for the learner to see the map?

11. Which details should be deliberately left for deeper layers?

12. What simple mental model should remain afterward?

---

# 28. Creator Self-Check

Before sending generated content to independent review, ask:

### Understanding

Can an intelligent adult with no prior training understand the main idea on the first pass?

### Simplicity

Is anything harder to understand than it needs to be?

### Depth

Has simplification removed anything essential?

### Discovery

Does the learner actually discover something?

### Specificity

Could this content only meaningfully belong to this field?

### Structure

Does the learner understand why the major parts exist and how they relate?

### Terminology

Were technical terms introduced only when useful?

### Narrative

Did the story reveal the knowledge, or did it replace the knowledge?

### Accuracy

Are factual and historical claims supportable?

### Orientation

Does the learner leave with a clearer map?

### Continuity

Does this fit the canonical MapKAI knowledge structure?

### Curiosity

Is there a natural reason to continue learning?

---

# 29. Final Creating Standard

Good MapKAI content should make an unfamiliar field feel:

**recognisable**

before it feels academic,

**interesting**

before it feels difficult,

**structured**

before it becomes detailed,

and

**useful**

before it becomes specialised.

The learner should repeatedly experience:

> **“I already knew pieces of this world. MapKAI helped me see how they fit together.”**

The final objective is not simply to transfer information.

It is to help the learner construct an increasingly coherent map of human knowledge.
