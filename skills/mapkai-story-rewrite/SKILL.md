---
name: mapkai-story-rewrite
description: Generate or rewrite MapKAI knowledge stories as readable discovery-based stories rather than encyclopedia cards or direct event summaries. Use when creating, rewriting, or improving MapKAI story content from inputs such as selected language, field title, story title, person/event, time/place, knowledge point, historical support, and reflection direction; especially when the story must open with scene, reveal background through action, show old understanding, field tension, human pressure, changed question, evidence-grown insight, delayed abstract knowledge, and cautious factual support.
---

# MapKAI Story Rewrite

## Purpose

Write MapKAI knowledge stories as readable scenes of discovery. Do not write encyclopedia introductions, concept cards, biographies, or direct event summaries with decorative atmosphere.

The reader should first enter a concrete place, follow a person observing, struggling, acting, and changing the question, and only later recognize the field or knowledge point.

## Inputs

Use the provided values when available:

- `selectedLanguage`
- `fieldTitleInSelectedLanguage`
- `storyTitle`
- `personOrEvent`
- `timeAndPlace`
- `knowledgePoint`
- `historicalSupport`
- `reflectionQuestionIdea`

If rewriting an existing MapKAI story in the codebase, preserve IDs, codes, slugs, category relationships, quiz logic, founder mode behavior, and non-story fields unless the user explicitly asks for structural changes.

## Story Arc

Follow this order unless the user gives a stronger structure:

1. **Scene entry**: Open with a concrete environment, object, action, tool, material, sound, temperature, smell, weight, room, street, field, body sensation, or working surface. Do not begin by explaining the field.
2. **Old understanding**: Show what people at the time commonly thought, did, assumed, or looked for. Make it specific, not abstract.
3. **Scene-based tension**: Let a detail in the scene refuse the old explanation. The contradiction must come from observation, comparison, measurement, repeated error, or material evidence.
4. **Character action**: Make someone do things: observe, measure, record, compare, ask, test, draw, dismantle, wait, return, mark, calculate, or recheck.
5. **Changed question**: Let the central question change. The change should be visible, not merely announced.
6. **New understanding**: Let the new understanding grow from accumulated actions and evidence.
7. **Delayed knowledge point**: Put the field name and abstract knowledge in the second half or in the required "hidden knowledge" section. Use the selected language's field title.

## Field Name Quarantine

Keep the field name, field category name, and abstract knowledge vocabulary out of the story body unless the story would become factually unclear without a single term.

The story body must not contain sentences shaped like:

- "{fieldTitle}在这里..."
- "{fieldTitle}关注/研究/连接..."
- "{fieldTitle}形成共同语言..."
- "这个领域/这门学科..."
- "藏在这个故事里的..."
- "真正的意义在于..."

Put that explanatory material in the "藏在里面的知识" section instead. The story body should read as a scene and a changed question even if the reader has not seen the field title.

## Storytelling Craft

Write the story as a chain of lived moments, not as a report of what happened.

Use this sentence-level method:

1. Put an object, surface, tool, body, or place in front of the reader.
2. Let a person handle it, move through it, or compare it with something else.
3. Let the background appear because the action needs it.
4. Let the old understanding appear as something people do or say, not as a lecture.
5. Let the contradiction interrupt the person's work.
6. Let the changed question come from the interruption.

Avoid direct event-writing:

- Weak: "In 1802, he studied plant distribution and began to see the relation between altitude and vegetation."
- Better: "He wrote the height beside each pressed leaf. Lower down, the page held broad leaves; higher up, the names were crowded beside smaller, harder plants."

- Weak: "At the time, people misunderstood disease transmission."
- Better: "Neighbors opened windows, washed sheets in lime, and pointed to the smell rising from the drains."

- Weak: "This led to a new way of thinking about systems."
- Better: "When the same error returned on a different desk, the notebook stopped looking like a list of mistakes and started looking like a path through the process."

## Scene and Background

Background should arrive in layers:

1. **Immediate scene**: Where is the reader standing, and what can be touched, heard, carried, opened, marked, counted, or compared?
2. **Local pressure**: What problem makes the scene matter to the person there: illness, failed calculation, a broken tool, a missing pattern, a crop failure, a disagreement, a repeated result?
3. **Old habit**: What would people normally do next, and why does that habit feel reasonable at first?

Do not stop the story to explain the historical background. Smuggle background through a gesture, tool, rule, routine, label, map, ledger, instrument, classroom, market, field, street, or conversation fragment.

## Readability Rules

- Give the reader one human thread to follow. Even when the field is abstract, anchor it in one person's workbench, route, notebook, instrument, classroom, or decision.
- Keep paragraphs doing different jobs: scene, old habit, friction, action, turn, new understanding.
- Prefer small cause-and-effect steps over grand transitions.
- Use short concrete sentences when the story turns. Do not bury the question change in a long abstract sentence.
- If a sentence could appear in any story, replace it with a detail from this story.
- After drafting, remove the field name and famous person's name. The story should still be readable and worth continuing.

## Naming Guidance

For famous-person discovery stories, usually delay the person's full name. Start with "a doctor," "a traveler," "a mathematician," "a student," or another role when it helps the reader follow the observation before the biography.

Do not treat delayed naming as an absolute rule. Early naming is acceptable when it helps orientation or when the event itself requires it. Fail early naming only when the name replaces scene, tension, or action.

## Factual Safety

Use only reliable facts in the historical support section.

Sensory detail may be used as plausible scene reconstruction when it does not assert unverifiable exact facts. Avoid exact dialogue, private emotion, exact weather, room layout, or causal claims unless the source input supports them.

Use cautious wording for complex historical claims: "often considered," "later became associated with," "helped push," "is an important early example," or the selected-language equivalent. Avoid overclaims such as "proved forever," "first in history," "single-handedly changed the world," or "from then on everyone understood."

## Output Format

Use this format exactly:

```text
知识故事
{fieldTitleInSelectedLanguage}

{storyTitle}

故事场景
{1 to 2 concrete scene sentences, not a summary}

{story body, about 500 to 800 Chinese characters or comparable length in the selected language. It must include scene, old understanding, tension, action, changed question, and evidence-grown new understanding.}

历史支撑
{Reliable facts only. Briefly state time, person/event, action, and impact. Do not exaggerate or invent.}

藏在里面的知识
藏在这个故事里的，是{fieldTitleInSelectedLanguage}的一个关键转向：{Explain the knowledge point in language that naturally grows from the story. Do not write a textbook definition.}

{One reflection question grown from the story's changed question.}
```

## Style Rules

- Let concrete detail earn every abstract sentence.
- Prefer verbs of action over verbs of realization.
- Do not say "he realized," "she discovered," or "they understood" unless the preceding actions have already made the realization visible.
- Do not use decorative atmosphere that can be removed without changing the knowledge logic.
- Do not make the final question a memory check. It should hold a real tension, such as fact vs relationship, tool vs intention, local error vs system, data vs judgment, or classification vs connection.
- Do not write a historical summary paragraph and call it a story. If the paragraph can be summarized as "person did X and influenced Y," rebuild it around a tool, object, notebook, room, route, list, instrument, argument, or failed expectation.
- Do not let the final third become a contribution list. The name, work, and historical influence belong in historical support unless the reveal is narratively earned.

## Forbidden Patterns

Avoid these exact Chinese sentence patterns and their close equivalents:

- "这个小现场也提醒人"
- "不是书页上的名称"
- "某某学科关注……"
- "这说明……"
- "通过这个故事我们知道……"
- "这就是……的重要性"
- "可是这件事不太配合这种理解"

Also avoid empty clever transitions, AI-like summary turns, and poetic lines whose factual meaning is unclear.

## Rewrite Rule

If the result reads like an encyclopedia entry, a concept explanation, or a biography with scenery added, rebuild it from the scene and action. Do not merely polish.
