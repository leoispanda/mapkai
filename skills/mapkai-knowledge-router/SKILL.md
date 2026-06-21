---
name: mapkai-knowledge-router
description: Route MapKAI knowledge-story inputs to the correct storytelling mode before generation. Use before writing any MapKAI knowledge story when the input may be historical, abstract, mechanism-based, lens-like, case-pattern-based, or misconception-correction-based; prevents forcing all knowledge into one universal story structure.
---

# MapKAI Knowledge Skill Router

Use this router before generating any MapKAI knowledge story or Subject Origin page.

The goal is to select the correct storytelling mode based on the type of knowledge point. Do not force all knowledge points into one story structure.

## Step 0: Check For Subject Origin Page

If the user asks for "学科起源", "领域起源", "Subject Origin page", "discipline origin page", "field origin page", or a page explaining how a discipline emerged and later developed, route to:

- `skills/mapkai-story-rewrite/SKILL.md`
- `skills/mapkai-story-rewrite/references/subject-origin-page-standard.md`

This is a page-level article mode, not the normal single `知识故事` format.

First-pass Subject Origin pages must output only article text and knowledge structure. Do not generate image prompts, visual module suggestions, illustration descriptions, layout notes, hero image text, or timeline image prompts until after the article has passed review.

If the page needs a historical origin scene, the writer may use `skills/mapkai-historical-discovery-story/SKILL.md` to shape the `起源故事` section, but the final output still follows the Subject Origin page format.

Do not route Subject Origin pages to Concept Fable or Mechanism Explainer unless the user explicitly asks for a fable or a formula/mechanism-first explanation instead of a discipline-origin page.

## Step 1: Classify The Knowledge Point

If Step 0 does not apply, classify the input into one of these six knowledge types.

### 1. Historical Discovery Story

Use when the knowledge point is connected to a real person, historical event, scientific discovery, invention, reform, expedition, observation, or social movement.

Typical examples:

- Humboldt and plant distribution
- Florence Nightingale and statistical graphics
- Leeuwenhoek and microscopic life
- Keeling Curve
- Wangari Maathai and Green Belt Movement
- John Snow and cholera mapping
- Ada Lovelace and symbolic computation

Core structure:

```text
Time/place -> person action -> old method -> evidence pressure -> changed question -> new understanding -> historical support
```

Do not use fable mode for these unless the user explicitly asks for allegory.

Use `skills/mapkai-historical-discovery-story/SKILL.md` when available. For field-origin pages, combine it with `skills/mapkai-story-rewrite/SKILL.md`.

### 2. Concept Fable Story

Use when the knowledge point is an abstract concept, theory, relationship, or social-science idea without one necessary historical scene.

Typical examples:

- Path dependence
- Psychological safety
- Cognitive load
- Scaffolding
- Institutional isomorphism
- Social capital
- Dynamic capabilities
- Absorptive capacity
- Bounded rationality

Core structure:

```text
Fictional but serious scene -> old way of acting -> conflict produced by the concept's core tension -> new pattern appears -> concept revealed -> metaphor mapping
```

Do not make it childish. Do not over-personify. Do not use fairy-tale moral endings.

Use `skills/mapkai-concept-fable-story/SKILL.md` when available.

### 3. Mechanism Explainer Story

Use when the knowledge point is mathematical, statistical, computational, economic, algorithmic, or formula-based.

Typical examples:

- Derivative
- Matrix multiplication
- Regression to the mean
- Bayes' theorem
- Gradient descent
- Sampling bias
- Normal distribution
- Correlation vs causation
- Opportunity cost
- Compound interest

Core structure:

```text
Why the concept is needed -> concrete problem -> step-by-step mechanism -> small checkable example -> concept name -> boundary
```

Do not hide the mechanism too much. Do not replace accuracy with metaphor.

Use `skills/mapkai-mechanism-explainer-story/SKILL.md` when available.

### 4. Lens Story / Knowledge Lens

Use when the knowledge point is best understood as a way of seeing a familiar situation differently.

Typical examples:

- Systems thinking
- Feedback loop
- Trade-off
- Second-order effect
- Incentive alignment
- Boundary object
- Local optimum vs global optimum
- Problem framing

Core structure:

```text
Daily scene -> ordinary interpretation -> lens shift -> hidden structure becomes visible -> return to the scene with a better question
```

This mode is suitable for MapKAI Knowledge Lens pages.

### 5. Case Pattern Story

Use when the knowledge point is a business, organization, technology, or social pattern that appears across cases.

Typical examples:

- Platform strategy
- Network effects
- Organizational inertia
- Digital transformation prioritization
- Product-market fit
- Flywheel growth
- Supply chain resilience
- Standardization vs localization

Core structure:

```text
Concrete organizational situation -> repeated pattern -> old explanation fails -> pattern logic becomes visible -> practical implication
```

Do not make it a generic business essay. Use a specific scene, decision, constraint, or trade-off.

### 6. Misconception Correction Story

Use when the main goal is to correct a common misunderstanding.

Typical examples:

- Correlation is not causation
- Average does not mean typical
- AI does not understand like a human
- More data does not always mean better insight
- Efficiency is not always resilience
- Innovation is not only invention

Core structure:

```text
Common belief -> concrete situation where it seems right -> contradiction or counterexample -> correction -> better mental model
```

This mode should be clear and direct. Do not make the story too mysterious.

## Step 2: Reject Wrong Mode

Before writing, check:

1. Is this a real historical person or event? If yes, prefer Historical Discovery Story.
2. Is this an abstract theoretical concept? If yes, prefer Concept Fable Story.
3. Is this a mathematical, statistical, algorithmic, or formula-based idea? If yes, prefer Mechanism Explainer Story.
4. Is this a way of seeing familiar situations? If yes, prefer Lens Story.
5. Is this a repeated organizational or business pattern? If yes, prefer Case Pattern Story.
6. Is the main goal to correct a misunderstanding? If yes, prefer Misconception Correction Story.

When two modes seem plausible, choose the mode that best matches what the reader must understand:

- If historical fact and scene accuracy matter most, choose Historical Discovery Story.
- If conceptual relationship matters most and no single historical scene is necessary, choose Concept Fable Story.
- If the reader must be able to calculate, use, or check the mechanism, choose Mechanism Explainer Story.
- If the concept is primarily a way of noticing a familiar situation differently, choose Lens Story.
- If the important part is a pattern across organizations or cases, choose Case Pattern Story.
- If the task is to remove a misconception, choose Misconception Correction Story.

## Step 3: Core Rule

Each mode must still follow MapKAI's core standard:

A MapKAI knowledge story should be clear enough for general readers, serious enough for advanced students, and sharp enough that graduate-level readers can see the deeper knowledge structure.

Clarity first, story movement second, poetic quality last.

## Step 3A: Leo CEO Consultation Layer

For any MapKAI story or article generation task, use `leo-ceo` as an additional product and reader-value judgment layer after the mode-specific draft is structurally complete and before final output.

This layer must not replace MapKAI factual review, mode routing, historical accuracy checks, mechanism accuracy, or concept-fit review. It should answer a narrower question:

```text
From Leo's CEO/product lens, is this story worth a reader's time, does the metaphor or scene compound into clearer understanding, and what is the highest-leverage next revision?
```

Apply the Leo CEO lens to the `编辑评论（供迭代，不属于正文）` section, not to the publishable article body unless the lens exposes a real clarity, metaphor, product-value, or reader-trust problem that requires rewriting before output.

## Step 4: Iteration Comments

After generating any MapKAI story or article, include a separate section named:

```text
编辑评论（供迭代，不属于正文）
```

Use it as a candid revision layer, not as part of the publishable article. Include 3-5 short comments that help improve the next version:

- whether the core metaphor or historical scene is clear enough;
- where a reader may feel "说得不明不白";
- whether a stronger metaphor, object, scene, or case could replace the current one;
- which paragraph should be rewritten first;
- one concrete next-revision direction.
- a `Leo CEO 视角` comment: whether the piece has enough reader value, long-term MapKAI quality, metaphor strength, and concrete next action from Leo's principles.

If the output is meant for publication or export, remove this section after the article passes review.
