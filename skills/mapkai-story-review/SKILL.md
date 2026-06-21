---
name: mapkai-story-review
description: Strictly review generated or rewritten MapKAI knowledge stories and Subject Origin pages for field-origin fit, historical scene consistency, evidence pressure, narrative movement, section clarity, and field-method fit. Use when checking whether a MapKAI story or origin page shows why a discipline or knowledge field began to need its own object, question, and method through reliable time/place/action alignment, concrete scene, initially reasonable old method, field-based tension, character action, changed question, evidence-grown insight, factual safety, non-AI style, non-decorative literary language, and, for Subject Origin pages, page-level article structure with images deferred until after text approval; also use for batch audits after MapKAI story generation or rewrite.
---

# MapKAI Story Review

## Purpose

Review MapKAI knowledge stories after generation or rewrite. Use `skills/mapkai-knowledge-router/SKILL.md` first when the output mode is unclear. The review must be mode-aware: a historical field-origin story, concept fable, mechanism explainer, lens story, case pattern story, and misconception correction story should not be judged by one universal structure.

For historical discovery, field-origin, or integrated reader-facing knowledge stories, use `skills/mapkai-story-rewrite/references/approved-story-quality-patterns.md` as the baseline for object-based discovery, reasonable old explanation, visible evidence pressure, changed question, and cautious historical support.

For historical or field-origin stories, a concrete scene should reveal why a discipline or knowledge field began to need its own object, question, and method. For non-historical modes, review the structure promised by that mode instead.

This is not a polishing skill. It is a strict story-quality review. A story should not pass because it is fluent, longer, emotional, literary, or conceptually correct. It passes only when knowledge grows from a concrete scene, real tension, observable action, and a clear shift in understanding.

Passing the visible arc labels is not enough. If the story still reads like a tidy synopsis, encyclopedia teaser, false scene, or "correct but thin" discovery summary, mark it `LOCAL EDIT` or `FAIL`.

A knowledge story cannot pass only because it is atmospheric or elegant. It must be historically situated, scene-consistent, and epistemically sharp. If time, place, action, and knowledge transition do not align, the story must be marked `LOCAL EDIT` or `FAIL`.

Core question for every story:

```text
Does this story use the correct MapKAI mode for the knowledge type, and does it make the deeper knowledge structure clear without becoming a template, fable-for-everything, or dry explanation?
```

If it is mainly explanation, mark it `FAIL`.

## Leo CEO Product Lens

After the MapKAI review gates are complete, consult `leo-ceo` as a final product and reader-value lens. This is an advisory layer, not a replacement for historical, factual, mechanism, or concept-fit review.

Use the Leo CEO lens to judge:

- whether the story is worth a serious reader's time, not only technically correct;
- whether the scene or metaphor has enough compounding value for MapKAI's long-term quality bar;
- whether the piece feels like real human writing rather than safe AI output;
- whether the next revision should focus on a stronger metaphor, a clearer object, a sharper opening action, or a more useful final reflection.

If the hard MapKAI gates fail, keep the stricter MapKAI label. If the hard gates pass but the Leo CEO lens says the piece is forgettable, vague, or low-upside, mark at most `PASS / LOCAL EDIT` and record the concern in `编辑评论（供迭代，不属于正文）` or the review notes.

Audience standard:

```text
Readable for curious general adults and advanced students; sharp enough that graduate-level readers can see the method shift.
```

Do not pass a story just because it is "easy." It must not become childish, fairy-tale-like, over-personified, or moralizing. Do not pass a story just because it is "serious." It must not become an academic abstract, a concept stack, or a disguised literature-review paragraph.

Do not punish a story only because it is simple or short if the scene, evidence pressure, and field-origin turn are clear. The goal is not complexity. The goal is earned clarity.

A simple story still needs:

- concrete scene;
- old understanding;
- evidence pressure;
- character action;
- changed question;
- new understanding.

Strict scoring formula:

```text
No evidence pressure = explanation.
No time-scene consistency = false scene.
No changed question = knowledge introduction.
No initially reasonable old method = no real discovery.
```

## Readability And Paragraphing Gate

Review web readability before approving publication.

For a normal 500-800 Chinese character `故事场景`, the body should normally use 3-5 short paragraphs separated by blank lines. For Subject Origin pages, `起源故事` should normally use 2-4 short paragraphs, and the explanatory sections should avoid long uninterrupted blocks.

Mark `PASS / LOCAL EDIT` or `LOCAL EDIT` when the story is structurally sound but appears as one dense text wall. The fix should preserve the prose and add paragraph breaks around narrative beats:

- scene entry and old practice;
- friction or evidence pressure;
- changed action or comparison;
- changed question and final image.

Do not mark a story `FAIL` only because it lacks paragraph breaks if the underlying story works. But do not give clean `PASS` to a full public-page story that is hard to scan because it is one uninterrupted block.

## Subject Origin Page Review

When the user requested a Subject Origin page, or the output begins with `学科起源`, review it as a page-level article, not as a normal single `知识故事`.

Use `skills/mapkai-story-rewrite/references/subject-origin-page-standard.md`.

First-pass Subject Origin pages must contain only:

- `学科起源`
- `一句简介`
- `起源故事`
- `为什么这个学科需要出现`
- `核心转向`
- `关键人物 / 事件 / 工具`
- `后来长出的分支`
- `反思问题 / 小测`

Do not require images for first-pass approval. A Subject Origin article can pass without images.

For a first-pass article, mark `LOCAL EDIT` or `FAIL` if it includes image prompts, visual module suggestions, illustration descriptions, layout notes, hero image text, timeline image prompts, or other visual planning before the article itself has passed review.

Review the article for:

- origin problem;
- old question or old way of working;
- friction or evidence pressure;
- new question;
- core knowledge turn;
- later branches;
- readability;
- section clarity.

A passable Subject Origin page normally uses 900-1500 Chinese characters, with an origin story of 500-800 Chinese characters. Do not fail only because the exact counts vary, but fail or mark `LOCAL EDIT` if the page collapses into a short encyclopedia card, a long undivided essay, a biography list, or a single-discovery summary.

Quality gate:

- What problem made this field necessary?
- What older way of thinking or working was not enough?
- What changed in the central question?
- What object, method, tool, event, or practice made the change visible?
- What later branches grew from this origin?
- If visuals are present in a later visual stage, do they explain structure, sequence, contrast, or relationships rather than decorate?

Fail if the page only defines the discipline, only tells history without showing the knowledge turn, implies one person or scene created a broad field, has no clear old question -> new question shift, or uses images to compensate for weak article structure.

## Story Body Removal Test

Before approving a story, mentally remove:

- final historical anchor;
- final field-name point;
- concept explanation;
- field title;
- famous person name if possible.

Ask:

```text
Does the story body still show a meaningful change?
```

If the answer is no, the story is relying on explanation to rescue it.

Decision guidance:

- `PASS`: story body works independently and the explanation only clarifies.
- `PASS / LOCAL EDIT`: story body works but one local paragraph needs more action.
- `LOCAL EDIT`: story body has the right scene but not enough friction or changed practice.
- `FAIL`: story body is mostly summary, feature list, or conceptual explanation.

## Decision Labels

- `PASS`: Structure, facts, scene, action, and field-origin turn all work. Only tiny language edits may be needed.
- `PASS / LOCAL EDIT`: The story is basically passable, but one local time, scene, terminology, causality, or sentence-level risk should be fixed before publication.
- `LOCAL EDIT`: The direction is right, but at least one important piece of time, scene, action, evidence pressure, field fit, or field-origin turn needs visible local rewriting.
- `FAIL`: The story mainly relies on atmosphere, biography, explanation, a false scene, or a pasted knowledge point. It must return to rewrite.

Use the harder label when uncertain. Do not let "beautiful but maybe unclear" pass.

## Micro-Edit Rule

The reviewer may make edits only when the story is already structurally working.

For `PASS` or `PASS / LOCAL EDIT`, provide a micro-edited version that directly applies safe sentence-level fixes. Micro-edits may:

- Replace vague literary phrasing with concrete action.
- Remove small AI-like transitions.
- Make an overclaim more cautious.
- Tighten an ending question.
- Clarify a local cause-and-effect link.
- Adjust one or two sentences so the story's existing logic is easier to follow.

Micro-edits must not:

- Invent new facts, scenes, dialogue, or private emotions.
- Change the story's core event, knowledge point, or historical anchor.
- Rebuild the story arc.
- Hide a structural problem by polishing around it.

For `LOCAL EDIT`, provide only focused replacements for the broken sentence, paragraph, or section if the rest of the story works. Do not pretend a structural issue is solved by polishing.

For `FAIL`, do not provide a full micro-edited story. Give required fixes only as examples, then send the story back to the rewrite step.

## Template-Shell Failure Rule

Before reviewing sentence quality, decide whether the story is a real story or a template shell. A template shell cannot be rescued by micro-editing.

Common failing template:

```text
old method = naming/classification/single record -> evidence mismatch -> measurement/comparison -> table/chart -> checkable explanation
```

This template may fit classification, measurement, statistics, or visualization stories. It fails when the actual topic is scale change, ecological relation and community action, long-term trend, tool redesign, institutional reform, artistic perception, organizational decision, proof, or problem reframing.

Mark `FAIL` and return to rewrite when:

- the body is mostly generic method prose that could fit many topics after replacing names;
- the title promises a concrete object, event, or puzzle, but the body barely stages it;
- the old question and new question are pasted formulas rather than topic-specific pressure;
- the old question defaults to naming or classification even though the actual person/event is about scale, attribution, trend, uncertainty, proof, calibration, representation, coordination, decision, or another method turn;
- the field-origin turn could have been attached to almost any historical figure because it comes from a generic science-method template rather than this story's person/event;
- the story forces measurement, comparison, tables, charts, or visualization onto a topic whose real pressure is ecological action, tool change, institutional reform, artistic perception, or community organizing;
- abstract method words such as scale, repetition, position, time, evidence, system, relationship, model, variable, or condition appear without the exact object, tool, record, sample, chart, or action that makes them necessary;
- the final historical anchor or field-name point is doing the work the story body should have done.

Do not mark these as `PASS / LOCAL EDIT`. Use `LOCAL EDIT` only when the scene already exists and one local paragraph or sentence is broken. If the main scene must be rebuilt, it is `FAIL`.

## Correct Keywords, No Story Failure Pattern

Do not pass a story only because it contains the right vocabulary, historical facts, or approach components.

Symptoms:

- The story contains the right topic vocabulary.
- The concept or historical facts are technically correct.
- The body lists features, principles, methods, outcomes, or approach components.
- There is no concrete action sequence.
- The reader does not experience friction before the concept appears.
- The story would collapse if the final field-name point, historical anchor, concept explanation, or metaphor mapping were removed.

Common weak pattern:

```text
Children draw, build, debate, listen, shape, measure, perform, and return to their ideas.
```

Problem: this lists features of Reggio Emilia but does not stage children thinking through materials.

Better direction:

```text
One child used charcoal to draw a broken street. Another used scrap wood to build a bridge and argued that the bridge needed a shadow because people had to know where to wait. The teacher did not correct the model. She wrote down the argument and brought more wood, paper, clay, and mirrors the next day.
```

Repair strategy:

- Replace keyword lists with one concrete scene.
- Require at least three beats: opening action, repeated or deepening friction, changed practice.
- End the story body on a final image before naming the concept, field, historical approach, or person.
- Move theory vocabulary out of the scene and into the final earned point, concept explanation, or metaphor mapping.

Decision guidance:

- Mark `LOCAL EDIT` if the scene exists but needs expansion.
- Mark `FAIL` if the story is mostly a feature list or explanation.

Topic-specific checks:

- **Leeuwenhoek** stories must center the scale shift: water/sample, lens, tiny moving life, repeated looking, and the question of whether invisible life can become evidence.
- **Nightingale** stories must center attribution: ledgers, causes of death, months, counts/proportions, chart shape, and the question of which deaths point to changeable conditions.
- **Humboldt** stories must center spatial distribution: specimen, height, temperature/pressure/moisture, comparison across places or elevations, and the question of why life appears there.
- **Keeling** stories must center long-term trend: repeated air samples/readings, calibration or continuity, and the question of whether separate readings form a direction.
- **Wangari Maathai** stories must center ecological relation and community action: women, seedlings, water, firewood, soil, local repetition across villages, and the question of whether tree planting can become an action point for connected problems.

## Review Checklist

### -1. Mode Fit Gate

Classify the story mode before applying detailed checks:

- **Historical Discovery / Field-Origin Story**: real person, event, discovery, invention, reform, expedition, observation, or social movement.
- **Subject Origin Page**: a sectioned page explaining why a discipline or field emerged, what old question became insufficient, what new way of seeing appeared, and how later branches developed.
- **Concept Fable Story**: abstract concept, theory, relationship, or social-science idea without one necessary historical scene.
- **Mechanism Explainer Story**: mathematical, statistical, computational, algorithmic, economic, or formula-based idea.
- **Lens Story / Knowledge Lens**: a way of seeing a familiar situation differently.
- **Case Pattern Story**: business, organization, technology, or social pattern across cases.
- **Misconception Correction Story**: correcting a common misunderstanding.

Fail or mark `LOCAL EDIT` if:

- a historical person/event is turned into a fictional allegory without the user asking for allegory;
- a formula-based mechanism is hidden inside a vague metaphor;
- an abstract theory is forced into a fake historical scene;
- a lens or misconception story is padded into a false origin story;
- the output format does not match the selected mode.

Reviewer question: Did the writer choose the right mode before writing?

### -1A. Mode-Specific Minimums

For **Historical Discovery / Field-Origin Story**, require concrete time/place/action, old method, evidence pressure, changed question, integrated historical anchoring, an earned final field-name point, and an optional reflection question. Do not require separate "历史支撑" or "藏在里面的知识" sections in reader-facing output.

For **Subject Origin Page**, require the page-level sections from `subject-origin-page-standard.md`, a 500-800 Chinese character `起源故事`, a clear "why this field became necessary" section, a `从 X，转向 Y` core turn, 2-3 key anchors, later branches, and a reflection or mini-check. In first-pass review, images must be absent and should not block approval.

For **Concept Fable Story**, require a serious fictional scene, enough narrative development before the reveal, concept-driven tension, more than one beat of friction, late concept reveal, clear concept explanation, metaphor mapping, analogy boundary, and reflection question.

For **Mechanism Explainer Story**, require why the concept is needed, concrete problem, old intuitive approach, step-by-step mechanism, small checkable example, concept name, boundary or common mistake, and reflection question.

For **Lens Story**, require daily scene, ordinary interpretation, lens shift, hidden structure becoming visible, and return to the scene with a better question.

For **Case Pattern Story**, require concrete organizational situation, repeated pattern, old explanation failing, pattern logic becoming visible, and practical implication.

For **Misconception Correction Story**, require common belief, situation where it seems right, contradiction/counterexample, correction, and better mental model.

Reviewer question: Does the piece satisfy the minimum structure for its selected mode?

### -1B. Concept Fable Narrative Depth Check

Apply this check to **Concept Fable Story** mode.

Check whether the fable gives the reader enough time to enter the metaphor before the concept is revealed. A correct metaphor is not enough if the story reads like a short example with a label at the end.

Good signs:

- The old way of acting first seems reasonable.
- Tension appears more than once.
- The first friction can still be explained away, then a repeated friction makes the deeper pattern harder to ignore.
- A character changes behavior, creates a new rule, avoids tension, connects groups, removes support, hides disagreement, or searches for another rhythm.
- The metaphor develops across several actions or moments.
- The reader can sense the concept before it is named.
- The reveal near the end feels earned.
- The story has enough narrative space to be engaging without becoming long-winded.

Weak signs:

- The story has only one scene and one quick turn.
- The concept is revealed too soon.
- The story feels like an example rather than a fable.
- The metaphor is correct but underdeveloped.
- The reader understands the explanation but does not feel the concept unfolding.
- The ending rushes from one problem directly to the concept name.
- Extra length comes from abstract explanation rather than visible actions.
- The story body exposes the outline with phrases like "第一处麻烦", "第二次，问题换了样子", "这个规矩一开始很合理", "共同点是", or "这说明".
- Paragraphs contain correct but unfilmable analysis that belongs in `概念解释`, not the fable body.
- Abstract concept terms leak into the early story, such as "风险", "团队状态", "暴露", "反馈机制", "系统", "模式", "结构", "学习机制", "认知", or "激励", before the concrete scene has earned them.

For generated concept fables, the `寓言故事` section should normally be about 700-1100 Chinese characters or 600-900 English words unless the user explicitly asked for compact output. Do not apply this as a mechanical word-count rule; use it as a depth signal. If the concept fable is structurally correct but too short or rushed, mark it `PASS / LOCAL EDIT` or `LOCAL EDIT` depending on severity, with the main recommendation: "expand narrative development before concept reveal."

Reviewer question: Did the reader follow a small world until the concept became necessary, or did the writer give a short illustrative example and then name the concept?

### -1B-1. Concept Fable Camera Test / Human Story Gate

Apply this check to the `寓言故事` body before giving a clean `PASS`.

For each paragraph, ask:

```text
If this paragraph were filmed, what would the camera see or hear?
```

Good signs:

- A person handles a tool, record, note, object, surface, room, schedule, or unfinished task.
- A silence, delay, repeated action, changed rule, returned object, or visible mark carries the tension.
- The paragraph lets the reader infer why the old way worked or failed instead of announcing it.
- The sentence could be remembered as a scene, not only as a correct idea.

Weak signs:

- The paragraph mainly explains the story structure: "first friction", "second pressure", "the common pattern", "the deeper issue".
- The writer tells the reader the rule was reasonable instead of showing why people followed it.
- The writer names abstract forces before the reveal instead of staging them through objects and action.
- The story sounds like an AI-generated outline wearing narrative details.

Decision rule:

- If the concept fable is structurally correct but contains several outline-signpost or unfilmable sentences, do not mark clean `PASS`; use `PASS / LOCAL EDIT` at best.
- If the story body depends on those abstract sentences to make sense, mark `LOCAL EDIT`.
- If removing the explanation leaves no readable story, mark `FAIL`.

Reviewer question: Is this a story a human could read for its own movement, or a well-structured concept example?

### -1C. Concept Fable Four-Layer Review

Apply this layered review to **Concept Fable Story** mode. Name the failed layer in the review when useful.

**L1 Hard Scan**

- Required output sections are present: story, concept reveal, explanation, metaphor mapping, analogy boundary, and reflection.
- The concept name is not revealed in the title or early story.
- The reveal happens near the end of the story.
- The story section has enough space to develop a small world, normally 700-1100 Chinese characters or 600-900 English words unless compact output was requested.
- The story avoids childish tone, fairy-tale morals, cute over-personification, academic-paper summary language, and abstract filler.
- The story body passes the camera test: each paragraph contains something concrete a reader can see or hear.
- The story body does not leak outline scaffolding such as "第一处麻烦", "第二次", "共同点", or "这个规矩合理" as a substitute for action.

If L1 fails because the output format or reveal timing is broken, mark `LOCAL EDIT` or `FAIL` depending on whether the existing body can be repaired locally.

**L2 Narrative Movement**

Check whether visible actions answer:

- What old routine, rule, or assumption first seemed reasonable?
- What first friction appeared, and why could it still be explained away?
- What repeated friction made the hidden pattern harder to ignore?
- What did someone change, remove, connect, hide, delay, repeat, or re-check?
- What final image lets the reader sense the concept before it is named?

If L2 fails, do not call for a nicer ending. Recommend expanding the middle of the fable before the concept reveal.

**L3 Concept Fit**

Check whether the metaphor expresses this concept's specific structure rather than a generic story about change, learning, conflict, or coordination. The concept explanation, metaphor mapping, and analogy boundary must all match the same structure.

If L3 fails because the allegory could fit many unrelated concepts, mark `LOCAL EDIT` if the metaphor can be tightened, or `FAIL` if a new allegory is needed.

**L4 Reader Effect**

Ask whether a reader can follow the situation before knowing the concept, then experience a late "click" when the concept is named. If the piece feels like a short example with a label, mark `PASS / LOCAL EDIT` for mild underdevelopment or `LOCAL EDIT` for a rushed story that needs a fuller middle.

Also ask whether the piece reads like a human story rather than a tidy AI explanation. If the scene is correct but the prose keeps announcing the outline, mark `PASS / LOCAL EDIT` or `LOCAL EDIT` and request camera-test rewriting.

Reviewer question: Which layer failed: hard format/reveal, narrative movement, concept fit, or reader effect?

### -1D. Concept Fable Reference Review

When reviewing concept fables, use:

- `skills/mapkai-concept-fable-story/references/examples.md`
- `skills/mapkai-concept-fable-story/references/failure-patterns.md`
- `skills/mapkai-story-review/references/concept-fable-review-examples.md`

Use these references when:

- the story is structurally correct but feels weak;
- the reveal feels rushed;
- the metaphor is attractive but possibly generic;
- the review decision is between `PASS / LOCAL EDIT` and `LOCAL EDIT`;
- the story is intended as a sample or benchmark.

Do not judge concept fables only with historical discovery standards. Concept fables may be fictional, but they still need narrative depth, concept-driven tension, delayed reveal, accurate metaphor mapping, and meaningful analogy boundaries.

### -1E. Benchmark Comparison Check

Ask:

- Is this closer to a weak example, pass example, or excellent example?
- Does the story give the reader enough time inside the metaphor?
- Does the concept become necessary before it is named?
- Could the metaphor explain many other concepts? If yes, it is too generic.
- Is the explanation rescuing the story? If yes, mark `LOCAL EDIT` or `FAIL`.

### 0. Historical Scene Consistency Gate

Review this before judging language for historical and field-origin stories. For non-historical modes, use this gate only to catch accidental fake historical claims.

Check:

- Is there a clear time anchor: year, period, war, expedition, experiment stage, report stage, or "after/before" marker?
- Is the place clear enough for the story's action?
- Could the named or implied person plausibly be there at that time?
- Could the person plausibly be doing the action described there?
- Do the discovery, chart, report, theory, policy, or concept belong to the same historical phase?

Fail or mark `LOCAL EDIT` if:

- The story has no time anchor but uses a historical person or event.
- Different years, places, or phases are compressed into one attractive scene.
- Field work, later data analysis, report publication, and policy impact are written as if they happened in one continuous moment.
- The final historical anchor tries to fix a scene that was confused in the story body.

Reviewer question: Is this a reliable scene, or a good-looking scene assembled from later facts?

### 0A. Main Scene Axis

Identify the story's main axis:

- field observation;
- data sorting;
- chart or model making;
- theory formation;
- policy or public persuasion;
- classroom/workshop/lab testing.

Fail or mark `LOCAL EDIT` if several axes are mixed without clear sequence. A story may refer back to an earlier scene, but the reader must know which scene carries the field-origin turn.

Reviewer question: Where does the field-origin turn actually happen?

### 0B. Evidence Pressure Gate

Find the pressure point that forces the story to change question.

Acceptable pressure points include:

- a number that does not fit the expected category;
- repeated cases with the same shape;
- a comparison across time, place, height, route, sample, or group;
- a chart shape that makes a hidden pattern visible;
- an instrument limit, failed result, exception, or missing record.

Fail or mark `LOCAL EDIT` if:

- the first half only has mood or suffering;
- the author tells the reader the old method was limited, but no evidence pushes back;
- the old question changes only because the prose announces it.

Reviewer question: What fact, number, object, or repeated pattern forced the new question?

### 0B-2. Approved Pattern Gate

For historical discovery or field-origin stories, check the approved quality pattern:

- **Object-based discovery**: Does one concrete object appear early, get handled or used, make the old question insufficient, help produce the new question, and return in the final image or reflection?
- **Reasonable old explanation**: Is the old explanation made plausible before it becomes insufficient?
- **Visible evidence pressure**: Does the story show the pressure through dots, counts, readings, exceptions, marks, samples, routes, or repeated observations instead of announcing "the evidence challenged the theory"?
- **Changed question**: Can the reader state the shift in a concrete sentence, such as "from where the air was worst to where the sick drew water"?
- **Cautious historical support**: Does the ending avoid overclaims such as "proved forever," "single-handedly created," "for the first time in history," or "immediately solved"?

Mark `LOCAL EDIT` if a structurally good story misses one pattern locally. Mark `FAIL` if the story has no working object, no visible pressure, and no concrete changed question.

### 0C. Field Origin Fit Gate

Apply this gate to historical / field-origin stories. Check whether the story explains the origin of a knowledge field, not only one person's achievement.

Good signs:

- The story shows what people relied on before the field had a clear shape.
- A concrete scene exposes the limit of that older practice.
- A new object of attention appears: a route, organism, pattern, risk, relation, process, sign, record, tool, behavior, or environment.
- The story shows the kind of question the emerging field begins to ask.
- The final field-name point names how the field starts to need its own method, rather than defining the whole discipline.

Weak signs:

- The story is only a biography, discovery anecdote, reform story, or invention story.
- The field title could be swapped for another field without changing the body.
- The person/event is interesting, but the field's object, question, or method never becomes necessary.
- The final historical anchor supplies the field-origin meaning because the body only staged an event.

Reviewer question: What older way of working reached its limit, and what new object/question/method began to belong to this field?

If this cannot be answered from the story body, mark `LOCAL EDIT` if a clear origin frame can be added locally; mark `FAIL` if the body must be rebuilt.

### 0D. Narrative Pressure Check

Check whether the story has movement, not only correct structure.

Good signs:

- The old way of seeing feels reasonable at first.
- A concrete object, number, tool, route, record, or repeated difficulty pushes back.
- The reader can feel why the old question cannot comfortably continue.
- The key object changes meaning by the end.
- The turn feels earned rather than announced.

Weak signs:

- The story is accurate but flat.
- The body reads like a safe summary.
- The old question and new question are stated, but the reader does not feel the pressure between them.
- The story avoids false drama but also loses all tension.
- The object in the title appears, but it does not create movement.

Reviewer question: What exactly made the story move?

If there is no movement, mark `LOCAL EDIT` if the scene is otherwise strong and can be improved locally; mark `FAIL` if the story is mostly synopsis or explanation.

### 0E. Red Line Checklist

Apply historical/field-origin-specific red lines only to Historical Discovery / Field-Origin stories. Apply general red lines such as template leakage, fake scene, unsupported claims, childish tone, academic-paper tone, decorative title objects, and mode mismatch to every mode.

The following cannot receive `PASS`:

1. No time anchor in a historical-person story.
2. Different years, places, or phases compressed into one false scene.
3. A person performs an action that was impossible or unsupported for that time and place.
4. The first half has atmosphere but no cognitive obstruction.
5. The body does not show the field-origin turn; the final explanation supplies it instead.
6. Abstract words such as "system," "variable," "relationship," "model," or "mechanism" appear without concrete action or evidence.
7. The selected field label does not match the story's actual method.
8. Old and new questions are slogans, not pressure from evidence.
9. Charts, numbers, tools, ledgers, maps, or instruments are decorative rather than causal.
10. Historical support repairs factual confusion that should have been clear in the body.
11. Causality is overstated with "directly led to," "proved," "first discovered," or similar claims without reliable support.
12. The final question is generic and does not return to the story's central object, evidence, or metaphor.
13. The title promises a concrete object, event, place, or puzzle, but the story body barely uses it or never lets it affect the field-origin turn.
14. The body contains internal scaffolding or template language such as "旧办法并不荒唐," "如果只求先有秩序," "材料不再各说各话," "让证据自己排队," or similarly generic review-skill prose.
15. The old question and new question could be pasted into many unrelated stories without changing the nouns.
16. The final field-name point introduces concepts not supported by the story, such as adding genetics to a microscope-scale observation story that never shows inheritance.
17. The field-method fit is satisfied only by generic words like "measure," "compare," "graph," "system," or "relationship," without topic-specific evidence.
18. The supplied page image, image alt text, or image prompt contradicts the title/body enough to mislead the reader.
19. The tone infantilizes the reader: childish wonder, fairy-tale framing, over-personified objects, or moral-of-the-story endings.
20. The tone becomes academic-paper-like: stacked abstractions, thesis-summary endings, or concept terms used before concrete evidence prepares them.
21. The story tries to explain the whole field instead of one core field-origin turn.
22. The old question is a generic "what is this called?" when the topic is not actually about naming, classification, or natural-history categorization.
23. The story uses high-risk invented details such as exact weather, private emotion, dialogue, named bystanders, room layout, or dramatic gestures without support.
24. The final point supplies a field-origin turn that the story body itself did not stage.
25. The story forces a measurement/table/chart turn onto a topic whose evidence pressure is not numerical or visualized data.
26. Title objects such as seedlings, buckets, rainwater, ledgers, pumps, curves, tools, or maps appear as decoration instead of changing what the person can ask or do.
27. The body contains abstract template phrases such as "尺度、次数、位置或时间一变," "数量、尺度、位置、时间和重复观察," "先重新测量数值," or "同一张可检查的图" without concrete scene-specific evidence.
28. The story only shows a discovery, invention, reform, or biography, but not why the selected field began to need its own object, question, or method.
29. The field title is only a label; the story body would still work under another field name.
30. The story uses a separate "历史支撑" or "藏在里面的知识" reader-facing section even though the requested final format is an integrated story.
31. The body contains correct keywords, approach features, or concept vocabulary but no action sequence that lets the reader experience friction and changed practice.
32. For broad disciplines, the story implies that one person or one scene created the entire field rather than presenting a historically cautious origin window or formation turn.

When any red line appears, choose `LOCAL EDIT` if it is isolated and fixable without rebuilding the story, otherwise choose `FAIL`.

### 0F. Title Promise And Template Leakage Gate

Before language review, check the title against the body.

Ask:

- What concrete thing does the title make the reader expect?
- Does that thing appear in the main scene, not just in the title?
- Does the person handle, inspect, mark, compare, test, count, wait for, or recheck it?
- Does the old-to-new question turn depend on that thing?

If the answer is no, mark `FAIL` unless the body only needs one local insertion to restore an already-working story.

Also scan for template leakage. Phrases such as "旧办法并不荒唐," "如果只求先有秩序," "旧答案轻松过关," "材料不再各说各话," "证据自己排队," "现场细节开始获得发言权," and "真正改变问题的常常不是大词" are not literary style. They are internal scaffolding accidentally printed as story. If they appear in the story body, mark `FAIL` unless the rest of the story is already strong and the phrase is a single removable sentence.

Reviewer question: If the title were "雨水里的小动物," where are the rainwater, the lens, the tiny moving organisms, the repeated observation, and the change from "clear water" to "invisible life can become evidence"?

If page media is included in the review, check it against the same promise. A balcony basil image on a Leeuwenhoek microscope story is a page-level mismatch: the text may be locally passable, but the rendered story cannot receive full `PASS` until the visual asset is replaced or field-level images are supported.

### 0G. Boundary Example: Nightingale

A Florence Nightingale story about wartime hospitals and statistical charts should usually be judged `PASS / LOCAL EDIT` or `LOCAL EDIT`, not clean `PASS`, if it mixes Scutari hospital atmosphere with later London data analysis as one continuous scene.

Check especially:

- Is the scene 1854-1856 field nursing at Scutari, or later analysis/report work in Britain?
- Are bed rows, hospital smells, and wheels on stone serving the data question, or only making the scene cinematic?
- Does the story show how deaths were separated by cause, month, proportion, and chart shape?
- Does the chart make preventable death visible as evidence, rather than merely "making numbers pretty"?
- Does the story avoid implying that one chart alone caused reform?

Better main axis for the statistical knowledge turn: a later desk/report scene where ledgers, months, causes of death, counts, proportions, and polar-area charting turn scattered deaths into a visible argument for sanitary reform.

Approved benchmark for this pattern:

- Time/scene: "1857 年前后" or another clear postwar analysis/report anchor, not an unanchored hospital night.
- Old method: a ledger reasonably classifies and totals deaths for officials.
- Evidence pressure: when deaths are separated by month and cause, disease categories repeatedly outweigh battle wounds or swell in particular months.
- Actions: recopy months, recalculate categories, compare causes, draw a circular/polar-area chart, inspect which color or area expands.
- Changed question: from "How many did the war take?" to "Which deaths did the total hide, and what conditions made them change?"
- Knowledge turn: rearranged numbers become evidence for a preventable cause; the chart is a method of seeing, not decoration.

### 0H. Boundary Example: Leeuwenhoek

A Leeuwenhoek story titled "雨水里的小动物" must not pass if it only says he made lenses and saw tiny life. It must show the promised scene.

Required story ingredients:

- Time/place: 1670s Delft or another cautious 17th-century Dutch anchor.
- Object: a drop or sample of rainwater, pond water, pepper water, tooth scrapings, or similar observed material.
- Tool: a small single-lens microscope or handmade lens.
- Old question: "Is this water clear or spoiled?" "Can something invisible to the naked eye count as real?" or another topic-specific old question.
- Evidence pressure: the clear-looking drop shows moving specks under the lens, and the observation is repeated with samples or time.
- Actions: adjust light or lens, place the drop, look again, compare another sample, wait, describe movement, write to others.
- New question: "Can invisible life become part of natural knowledge through tools and repeated observation?"

Fail this story if:

- "rainwater" or "animalcules" appears only in title/support.
- The body becomes generic method prose about naming, measuring, comparing, or scale.
- The final field-name point adds unsupported concepts such as heredity.
- The final historical anchor is used to compensate for a body that never actually staged the observation.

### 1. Scene Before Explanation

Check whether the story opens with a concrete situation rather than a concept, biography, field definition, or historical contribution.

Good signs:

- Time, place, object, action, material, tool, or atmosphere appears early.
- The reader can imagine the first moment.
- The story does not explain the concept immediately.

Weak signs:

- The first sentence defines the knowledge area.
- The story starts with historical importance.
- The opening reads like an encyclopedia entry.
- The opening is generic mood-setting.

Reviewer question: Does the reader enter a scene before being told what the story means?

### 1A. Audience And Register Fit

Check whether the story is serious without becoming stiff, and accessible without becoming childish.

Good signs:

- A general adult reader can follow the sequence of scene, old method, evidence pressure, action, and changed question.
- A more advanced reader can identify the method shift: scale, attribution, distribution, trend, classification, modeling, measurement, visualization, interpretation, or decision.
- Concept words appear after concrete objects, records, tools, samples, or actions have earned them.
- The story keeps one core field-origin turn instead of explaining the whole field.

Weak signs:

- The tone sounds like children's science writing: cute wonder, fairy-tale rhythm, over-personified objects, easy morals, or "little discovery" framing.
- The tone sounds like academic prose: stacked abstract nouns, definitional sentences, thesis-summary language, or unexplained concept clusters.
- The story is readable only because it removes the real knowledge method, or serious only because it hides the scene behind terminology.

Reviewer question: Could a curious adult enjoy the story while a graduate student still sees the knowledge method changing?

### 1B. Field Name Quarantine

Check whether the story body names or explains the field too early. In integrated reader-facing output, the field name may appear near the end as a point of recognition after the scene has earned it.

Fail or mark `LOCAL EDIT` if the story body contains patterns like:

- "{fieldTitle}在这里..."
- "{fieldTitle}关注/研究/连接..."
- "{fieldTitle}形成共同语言..."
- "这个领域/这门学科..."
- "藏在这个故事里的..."
- "真正的意义在于..."

Reviewer question: Could the story body still be worth reading if the field title were hidden?

### 1C. Story, Not Synopsis Gate

Check whether the story has enough lived sequence to be readable as a story.

Fail or mark `LOCAL EDIT` or `FAIL` if:

- The person is only a role label, such as "a young traveler," without visible task, pressure, tool, or constraint.
- The body has fewer than two concrete actions separated in time.
- The tension appears and resolves in one smooth explanatory jump.
- "问题从...变成..." is present, but the prior scene has not made that change necessary.
- The story can be reduced to "person observed X, compared Y, and the field changed Z" without losing much.
- The title or summary reveals the abstract conclusion before the scene begins.
- The body is shorter than 350 Chinese characters for a full knowledge story, unless the user explicitly requested compact mode; even compact mode still needs scene, old habit, obstruction, action, and turn.

Good signs:

- The reader can follow a body moving through time: first handling one thing, then checking or comparing another.
- There is a small resistance: damp paper, an exception, a failed explanation, a measurement that does not fit, a tool limit, a patient or object that refuses the old category.
- The changed question feels like a result of what happened, not a sentence inserted by the writer.

Reviewer question: If the field title and final historical anchor were removed, would this still feel like a scene worth reading rather than a summary paragraph?

### 1D. Field Fit And Method Fit

Check whether the story fits the selected field, not just a nearby easier field.

Fail or mark `LOCAL EDIT` or `FAIL` if:

- The story is about the right topic but not the right knowledge method.
- A broad field title is satisfied only by name, not by evidence in the body.
- The field includes mathematics, statistics, models, data, law, engineering, or communication, but those methods do not materially shape the story.

For `自然科学、数学与统计`, a story should not stop at "nature is connected." It should show why measurement and comparison matter:

- variables such as altitude, temperature, pressure, moisture, time, count, distance, or position;
- comparison across heights, routes, places, samples, people, or repeated observations;
- a pattern, distribution, scale, table, map, graph, coordinate, or visual arrangement that lets evidence be checked.

Reviewer question: What exact method changed here: naming, measuring, comparing, modeling, visualizing, testing, calculating, classifying, or deciding?

### 1E. Knowledge Turn Sharpness

Check whether the old and new questions are sharp enough.

Weak:

- Old: "What is this?" New: "Everything is connected."
- Old: "People misunderstood nature." New: "They saw relationships."

Stronger:

- Old: "Which cabinet does this specimen belong in?" New: "Under what height, temperature, moisture, and terrain conditions does this life form tend to appear?"
- Old: "Where are the deaths?" New: "Which routes brought the same water into different bodies?"

Fail or mark `LOCAL EDIT` or `FAIL` if:

- The new question is long but vague.
- The new question uses broad words such as "system," "relationship," "meaning," or "conditions" without naming the concrete variables or evidence.
- The final field-name point says the correct concept, but the body does not make that concept visible.

Reviewer question: After reading, can the reader state the precise field-origin turn in one sentence?

### 2. Delayed Naming

Check whether early naming helps the scene or turns the story into a biography.

For many MapKAI stories, especially famous-person field-origin stories, it is often stronger to begin with "a doctor," "a young traveler," "a mathematician," "a student," or "an engineer," then reveal the name after the field-level question begins to form or in the final historical anchor.

Do not automatically fail early naming. Fail it only when the name replaces observation, tension, or action.

Reviewer question: Does naming the person early weaken the field-origin effect?

### 3. Specific Old Understanding

Identify the old view, common assumption, or earlier way of working. It must be concrete.

Weak:

- People lacked systems thinking.
- Science was not advanced enough.
- Society had limited knowledge.

Better:

- Naturalists often collected plants, named them, classified them, and placed them in specimen cabinets.
- People treated machines mainly as tools for faster arithmetic.
- Doctors often looked for illness inside individual bodies, not in streets, pumps, and water routes.
- Teams thought the error was a local bug, not a process problem.

Reviewer question: What exactly did people used to think or do?

### 4. Field-Based Tension

Check whether the tension comes from the scene or evidence, not from author commentary.

Good tension comes from:

- An observation that does not fit.
- A measurement.
- A repeated error.
- A comparison.
- An unexpected pattern.
- A missing piece.
- A tool behaving differently than expected.

Weak signs:

- The author simply says "but this view was limited."
- The story has no concrete contradiction.
- The tension is abstract or invented.

Reviewer question: What happened in the scene that made the old understanding insufficient?

### 5. Character Action

Check whether the character actually does something.

Good actions include observing, measuring, recording, comparing, testing, drawing, asking, waiting, rechecking, turning a page, marking a map, opening a notebook, changing a process, or dismantling a tool.

Weak signs:

- Too many lines say "he realized," "she understood," or "they discovered."
- The character is only a name attached to an idea.
- There is no physical or mental movement.
- There is only one action, followed immediately by explanation.

Reviewer question: What two or more actions move the story forward?

### 6. Change of Question

A strong story changes the question.

Examples:

- From "What plants grow here?" to "Why do plants change with height, temperature, and moisture?"
- From "Can this machine calculate faster?" to "Can a machine process rules, symbols, and human intention?"
- From "Who is sick?" to "What in the environment is making people sick?"
- From "Where is the error?" to "What system allowed this error to appear?"

Weak signs:

- The story says the person "saw something differently," but the actual question does not change.
- The story jumps from action to contribution without showing the shift.
- The story uses the formula "问题从...变成..." without enough prior obstruction to earn it.

Reviewer question: What was the original question, and what did it become?

### 7. Evidence-Grown Understanding

Check whether the new understanding grows from evidence.

Good signs:

- Observations accumulate.
- Actions lead to comparison.
- The conclusion is earned.
- Abstract knowledge appears after concrete evidence.

Weak signs:

- The story jumps to "this shows..." or "therefore..." without enough support.
- The field-origin meaning is pasted onto the story.
- The ending is a lecture.
- The final sentence turns the scene into a definition instead of staying with the changed way of seeing.

Reviewer question: Could the reader follow the path from evidence to insight?

### 7A. Contribution Summary Risk

Check whether the story turns into "person did X and influenced Y" before the story's changed question has been earned.

Weak signs:

- The final third lists the person's contribution, book, institution, or historical impact.
- The story names the field and explains its importance instead of staying with the evidence.
- A famous person's name carries the authority that the scene should have carried.

Reviewer question: Is the ending still a field-origin story, or has it become a biography paragraph?

### 8. Abstract Sentence Support

Every abstract sentence must be supported by concrete detail before it.

Watch for unsupported phrases:

- Changed the way people understood.
- Opened a new possibility.
- Revealed the system.
- Showed the relationship.
- Became a foundation.
- Had important influence.
- Created a new way of thinking.

Reviewer question: What concrete detail gives this abstract sentence the right to exist?

### 8A. Useful Literary Language

Check whether beautiful sentences do real knowledge work.

Fail or mark `LOCAL EDIT` or `FAIL` if:

- A metaphor sounds good but hides the actual question.
- A phrase such as "互相追问," "不完整的证词," "重新阅读," or "看见关系" appears without specifying what is being asked, missing, compared, or re-read.
- The sentence creates mood but does not move the evidence, action, tension, or changed question.

Examples:

- Weak: "低处的名字、高处的名字，单独看都像答案；排在同一页上，却像在互相追问。"
- Better: "低处的名字、高处的名字，单独看都像答案；排在同一页上，却露出一个问题：为什么相似的植物总在相似的高度出现？"

- Weak: "标本夹越来越像一份不完整的证词。"
- Better: "标本夹留下了叶片形状，却留下不了它出现时的高度、温度、湿度和周围植物。"

Reviewer question: Does the literary sentence clarify the field-origin turn, or merely decorate it?

### 9. Fake Literary Sentences

Detect sentences that sound beautiful but do not clearly say what happened.

Fake literary sentences may:

- Use symbolism without factual clarity.
- Give an object emotion without reason.
- Sound poetic but hide logic.
- Make the reader feel something happened, but not know what.

Example:

```text
The water pump became silent.
```

Problem: This is unclear. Did people stop using it? Was the handle removed? Did illness decline? Is this metaphor?

Better:

```text
After the handle was removed, the pump could no longer draw water from that source.
```

Reviewer question: Is this sentence meaningful, or just atmospheric?

### 9AA. False Agency / Wrong Causal Subject

Check whether the sentence gives vague intellectual agency to an object when the real causal pressure should come from a concrete mark, reading, mismatch, repeated result, route, sample, category, or comparison.

Mark `PASS / LOCAL EDIT` or `LOCAL EDIT` when the story is otherwise structurally sound but contains a sentence like this:

```text
按键旁的纸条开始制造麻烦。
```

Problem: the paper did not create the problem. The pressure came from the recorded differences on the paper.

Better:

```text
记录纸上的读数开始对不上原来的解释。
```

Better:

```text
纸上反复出现的差异让“他只是注意到了”这个说法不够用了。
```

Flag these patterns unless they are immediately made concrete:

- "材料拒绝..."
- "现场不配合..."
- "证据开始发言..."
- "纸条制造麻烦..."
- "名字互相追问..."
- "图形提出问题..."
- "数字自己说明..."

Accept object-as-subject sentences only when the verb is literal or visibly grounded:

- Good: "计时器留下一个数字。"
- Good: "地图上的黑线在同一只水泵旁聚拢。"
- Good: "账本里的疾病死亡数反复压过战伤数字。"

Reviewer question: What exactly created pressure: the object itself, or a specific reading, mismatch, mark, route, or repeated pattern on it?

### 9A. Compressed Expression Check

Check whether any sentence sounds vivid but requires the reader to fill in missing logic.

Risky compression examples:

- "Firewood became farther away."
- "Soil became thinner."
- "Numbers began to speak."
- "The problem changed position."
- "The chart forced the truth out."
- "镇子慢慢长大。"
- "市场逐渐成熟。"
- "团队变大以后。"
- "需求越来越复杂。"

These are not always forbidden, but the first mention of a key problem must be literal and clear.

Vague growth or complexity sentences must be flagged unless the next clause immediately specifies what changed in visible terms: more carts at the gate, a second warehouse, new stalls opening, orders doubling, ledgers adding columns, a queue reaching the street, a tool no longer fitting a doorway, or a schedule needing another shift.

Better pattern:

1. First explain the concrete reality.
2. Then, if useful, use a shorter metaphor later.

Example:

- First: "Women had to walk farther to find firewood for cooking."
- Later: "By then, firewood had become a longer road."
- Weak: "镇子慢慢长大。"
- Better: "货车开始排到桥外，账房在登记簿上添了两栏，旧仓库后墙被拆开，才勉强塞下第三排货架。"

If a compressed phrase appears before the concrete situation is clear, mark it as a sentence-level issue. If the story relies on many compressed phrases instead of actions and evidence, mark `LOCAL EDIT` or `FAIL`.

### 10. Environment Serving Knowledge

Environmental description must serve story logic.

Good environmental detail:

- Makes the observation understandable.
- Shows physical difficulty.
- Supports the tension.
- Helps the reader see why the field-level question mattered.

Weak environmental detail:

- Decorative light, wind, smell, or color that can be deleted without changing the story.
- Over-poetic description.
- Generic mood-setting.

Reviewer question: Does the environment help the discovery, or is it decoration?

### 11. Factual Safety

Check whether factual claims are cautious and verifiable.

Avoid:

- Exact dialogue unless sourced.
- Exact private emotion unless sourced.
- Exact weather, room layout, or event details unless supported.
- Exaggerated "first," "only," "proved," or "changed the world forever" claims.
- Reducing complex history to one hero.

Sensory details may be plausible scene reconstruction when they do not assert unverifiable exact facts. Prefer cautious wording such as "often considered," "later became associated with," "helped push," "is an important early example," or the selected-language equivalent.

Reviewer question: Would this sentence survive fact-checking?

### 11A. Historical Anchor Bridge

Check whether the integrated historical anchor is reliable and connected to the story.

Good historical anchor:

- Reveals or anchors the person/event if the body delayed naming.
- States time, person/event, action, and influence without exaggeration.
- Carries forward the story's evidence: tools, measurements, maps, publication, experiment, report, or institutional change.

Weak signs:

- It reads like a detached encyclopedia card after a narrative body.
- It ends with a generic academic phrase such as "被视为...的重要象征" without explaining what concrete artifact or practice made it important.
- It names influence but not the specific method, evidence, or artifact.

Reviewer question: Does the final anchor help the reader connect the story to verifiable history without exposing a separate support section?

### 12. Not Just Longer

Check whether the rewrite only made the story longer.

Mark as weak if the story has more words but still lacks old understanding, field tension, character action, changed question, evidence-grown insight, or natural knowledge emergence.

Also mark as weak if the story is shorter and cleaner but has become a synopsis. Brevity is not quality when it removes struggle, obstruction, and sequence.

Reviewer question: Did the story gain structure, or only length?

### 12A. Readability And Narrative Thickness

Check whether the story gives the reader enough time inside the origin turn.

Weak signs:

- The body feels like a polished caption under a museum object.
- The person has no felt pressure, task, constraint, or repeated attempt.
- Scene details are present but static; they do not change what the person does.
- The old understanding, contradiction, action, and new understanding all appear in compressed summary form.

Strong signs:

- The reader can name what the person did first, what interrupted that, and what they did next.
- The story lets confusion or insufficiency last for at least a few sentences.
- The ending changes what the reader is looking at, rather than telling the reader what the field means.

Reviewer question: Would a non-expert keep reading because something is happening, not because the topic is important?

### 12B. Surprise And Reveal

Check whether the story reveals its knowledge too early.

Weak signs:

- The title or summary already says the abstract transformation.
- The first half announces the final relationship before the old habit has had time to feel reasonable.
- The body tells the reader "this is about systems/relationships/environment" before the scene earns it.
- The final field-name point only repeats what was already obvious from the opening.

Strong signs:

- The first half lets the old method work well enough to feel plausible.
- The obstruction makes the old method insufficient.
- The reader reaches the final field-name point with a sharper structure than they had at the start.

Reviewer question: Did the reader experience the field-origin turn, or did the title and early sentences spoil it?

### 13. Ending Question with Tension

The final question should invite thinking, not test memory.

Weak questions:

- Why is this important?
- What did you learn?
- Do you understand this concept?
- How can we apply this today?
- Questions using unjustified absolutes such as "only," "always," or "must" when the story is about tendencies, variables, or patterns.

Strong questions often include a tension:

- Facts vs relationships.
- Tool vs intention.
- Speed vs understanding.
- Local error vs system.
- Data vs judgment.
- Classification vs connection.
- Calculation vs expression.
- Memory vs interpretation.
- Naming vs mapping relationships.
- Single fact vs variable pattern.

Reviewer question: Does the final question leave the reader with a real choice or tension?

### 14. Batch Pattern Check

When reviewing multiple stories, also check repeated templates.

Flag if too many stories use:

- "某年某地，一个人……"
- "别人看到 A，他看到 B" with identical phrasing.
- "多年后……" as the main transition.
- "问题从...变成..." without a different earned setup in each story.
- "今天我们……" as the modern link.
- The same final question structure.
- The same emotional pause.
- The same sensory details.

Reviewer question: Are these stories beginning to sound like one template?

## Review Mode

Support two review modes.

### Quick Review Mode

Use Quick Review Mode by default unless the user asks for a full audit, batch audit, strict audit, or detailed review.

Output:

```text
Review Decision
PASS | PASS / LOCAL EDIT | LOCAL EDIT | FAIL

Biggest Issue
{1 to 2 direct sentences explaining the main weakness.}

What Works
* {1 to 3 bullets.}

Required Fixes
* Fix 1:
* Fix 2:
* Fix 3:

编辑评论（供迭代，不属于正文）
* 比喻/场景清晰度:
* 读者疑惑点:
* 更好的替代方向:
* 下一版优先修改:
* Leo CEO 视角:

Final Recommendation
{Small edit, local rewrite, or full rewrite.}
```

Quick Review should still be strict. Do not use it to soften judgment. It is shorter, not easier.

### Full Audit Mode

Use the existing full "Required Output Format" when:

- the user asks for strict review, full review, audit, batch review, or detailed review;
- the story receives `FAIL`;
- the story has historical-scene risk;
- the story shows template-shell risk;
- the story is intended as a sample or benchmark;
- the review needs a micro-edited version.

Keep the existing full output format for Full Audit Mode.

## Required Output Format

For each story, output:

```text
Review Decision
PASS | PASS / LOCAL EDIT | LOCAL EDIT | FAIL

Overall Judgment
{3 to 5 direct sentences. State whether the story truly works as a field-origin story or only looks story-like.}

Main Problems
* Problem 1:
  * Original:
  * Why it fails:
  * Rule:
* Problem 2:
  * Original:
  * Why it fails:
  * Rule:

Logic Chain Check
* Time anchor:
* Main scene axis:
* Time/place/action consistency:
* Old understanding:
* Why old method originally worked:
* Field tension:
* Character actions:
* Evidence pressure point:
* Obstruction or resistance:
* Question change:
* Field/method fit:
* Knowledge turn sharpness:
* New understanding:
* Missing or broken link:

Required Sentence Fixes
* Original:
* Problem:
* Suggested replacement:

Micro-Edited Version
{For PASS or PASS / LOCAL EDIT, provide the complete story with only safe micro-edits applied. For LOCAL EDIT, provide only the focused replacement section if safe; otherwise write "Not applicable; return to local rewrite." For FAIL, write "Not applicable; return to rewrite."}

Factual Risk Notes
{Mention overclaims, unsupported historical details, invented scenes, or wording that should be more cautious.}

Fake Literary Risk Notes
{Mention sentences that sound poetic but are unclear, decorative, or unsupported.}

Field Fit Notes
{Mention whether the story fits the selected field's actual method, especially for broad fields such as 自然科学、数学与统计.}

Most Important Revision Direction
{Give only one main direction.}

编辑评论（供迭代，不属于正文）
* 比喻/场景清晰度: {Candidly state whether the central metaphor, object, or scene is strong, adequate, or weak.}
* 读者疑惑点: {Name the most likely reader confusion in plain language.}
* 更好的替代方向: {Suggest one stronger metaphor, scene, object, historical anchor, or case if available.}
* 下一版优先修改: {Give one concrete rewrite action.}
* Leo CEO 视角: {Using `leo-ceo`, state whether the piece is worth the reader's time, whether it supports long-term MapKAI quality, and the highest-leverage next action.}

Final Recommendation
{State whether the story needs a small edit, local rewrite, or full rewrite.}
```

If there are no main problems, write `None` under that section rather than inventing issues.

## Iteration Comment Rule

Every review should include `编辑评论（供迭代，不属于正文）` unless the user explicitly asks for publication-only output.

This section should be written like useful reader/editor comments below an article. It may say the article is structurally passable but the metaphor is not the best available one. Do not hide weak metaphor fit behind a positive `PASS`.

Use comments to capture issues such as:

- "这个比喻说得不明不白";
- "核心物件没有承载概念";
- "可以用更好的日常场景";
- "读者看完知道概念名，但没有真正感到概念";
- "下一版应该换比喻，而不是只润色句子".
- "Leo CEO 视角认为它正确但不够值得读，需要换更高价值的场景或比喻".

When the central metaphor is weak but the structure is otherwise working, mark at most `PASS / LOCAL EDIT` and recommend metaphor replacement or local rewrite.

## Batch Output Format

When reviewing a batch, add:

```text
Batch Summary
* Number of stories reviewed:
* PASS:
* PASS / LOCAL EDIT:
* LOCAL EDIT:
* FAIL:

Common Problems
{Repeated weaknesses across stories.}

Repeated Pattern Warning
{Repeated openings, transitions, discovery patterns, sensory details, or ending questions.}

Stories That Can Become Samples
{Story IDs or titles and why.}

Stories Requiring Full Rewrite
{Story IDs or titles and why.}

Next Step
{Approve, run targeted revision, or rewrite weak stories.}
```

## Final Approval Rule

A story cannot be approved unless these questions are clearly answered:

1. Where is the reader standing?
2. Who is observing?
3. What was the old understanding?
4. What field-based tension appeared?
5. What concrete obstruction or resistance made the old understanding insufficient?
6. What two or more actions did the person take?
7. How did the question change?
8. What exact field method became visible: measuring, comparing, modeling, visualizing, testing, calculating, classifying, interpreting, or deciding?
9. How did the new understanding grow from evidence?
10. Did each literary sentence carry information, not just mood?
11. Did the integrated historical anchor connect the story to verifiable facts without becoming a disconnected encyclopedia card?
12. Did the title and summary avoid spoiling the abstract conclusion?
13. Did the field-origin turn emerge naturally and sharply?
14. Does the final question contain real tension?
