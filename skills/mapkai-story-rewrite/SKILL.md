---
name: mapkai-story-rewrite
description: Generate or rewrite MapKAI knowledge stories as historically situated, scene-consistent, discovery-based stories rather than encyclopedia cards, fake scenes, or direct event summaries. Use when creating, rewriting, or improving MapKAI story content from inputs such as selected language, field title, story title, person/event, time/place, knowledge point, historical support, and reflection direction; especially when the story must open with a reliable scene, show an initially useful old method, evidence pressure, changed question, field-method fit, delayed abstract knowledge, and cautious factual support.
---

# MapKAI Story Rewrite

## Purpose

Write MapKAI knowledge stories as readable scenes of discovery. Do not write encyclopedia introductions, concept cards, biographies, or direct event summaries with decorative atmosphere.

The reader should first enter a concrete place, follow a person observing, struggling, acting, and changing the question, and only later recognize the field or knowledge point.

The output must read like a story, not a correct synopsis of a discovery. Passing the arc checklist is not enough if the reader only receives a neat explanation.

A knowledge story cannot pass only because it is atmospheric or elegant. It must be historically situated, scene-consistent, and epistemically sharp. Time, place, action, and knowledge transition must align.

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

## Story, Not Synopsis Gate

Before drafting, identify the story's lived sequence:

- Who is the one person the reader follows?
- What is in that person's hands, notebook, instrument, room, street, field, table, or route?
- What old habit initially feels reasonable?
- What detail blocks that habit from being enough?
- What does the person do next, and then what do they do after that?
- How does the question change only after those actions?

The story body must include at least:

- **Two concrete actions** separated in time, such as measuring and then comparing, walking and then marking, interviewing and then mapping, testing and then rechecking.
- **One moment of resistance or obstruction** from the scene: a repeated mismatch, damp paper, an exception on a map, a failed result, a tool limit, a patient who does not fit the explanation, a number that refuses the old story.
- **One slow turn of the question** that is earned by the obstruction, not merely announced with "问题从...变成...".

Do not compress a discovery into a clean paragraph. If the body can be summarized as "a person observed X and this led to field Y," it is still a synopsis and must be rebuilt.

Default body length is 500 to 800 Chinese characters for a full MapKAI knowledge story. Do not shorten to 150 to 250 Chinese characters unless the user explicitly asks for a compact teaser. A short body must still have scene, old habit, obstruction, two actions, changed question, and evidence-grown understanding.

The title and summary must not reveal the abstract conclusion too early. They may create curiosity, pressure, or a concrete puzzle; they should not say "this pushed the field from X to Y" before the reader has entered the scene.

## Historical Scene Preflight

Before writing any historical knowledge story, internally answer this table. Do not output the table unless the user asks.

1. Who is the main person or group?
2. When does the main scene happen?
3. Where does the main scene happen?
4. What is the person doing in that time and place?
5. What old method or old question is being used?
6. Why did that old method originally feel reasonable?
7. What evidence, anomaly, repeated result, number, object, or failure creates pressure?
8. What new method appears: reclassifying, measuring, comparing, mapping, graphing, modeling, testing, interpreting, or deciding?
9. How does the question change?
10. Can the knowledge turn be stated as one sentence?
11. Which facts belong only in "历史支撑" because they happened later or elsewhere?
12. Which later impacts must not be written as if they happened in the main scene?

Choose one primary scene axis:

- **Field observation scene**: the person is observing, collecting, nursing, measuring, recording, testing, or inspecting in the field, hospital, street, classroom, workshop, ship, lab, or route.
- **Later analysis scene**: the person is sorting records, comparing data, drawing a chart, building a model, writing a report, preparing a lecture, or persuading others from a desk, archive, meeting room, lab, or office.

The two axes may echo each other, but do not merge different years, places, or phases into one attractive false scene. If the knowledge turn mainly happens during later analysis, do not write it as an immediate field epiphany.

Example: for a Florence Nightingale statistical story, do not blend Scutari wartime nursing, later British data整理, report publication, and sanitary reform into one night beside hospital beds. Choose the main axis. If the knowledge turn is about statistical graphics, build the story around ledgers, months, causes of death, counts, proportions, chart shapes, and the report or persuasion setting; let the hospital appear as remembered evidence, not as the place where the chart was suddenly born.

Approved Nightingale pattern: a strong version can open around "1857 年前后，伦敦一张工作桌上摊着军队医院的死亡记录." The old method is the reasonable ledger habit: classify deaths and total them for officials. The evidence pressure is that disease deaths, when separated by month and cause, repeatedly outweigh battle wounds. The actions are copying months, recalculating categories, drawing a circular chart, and comparing colored areas. The question turns from "How many people did the war take?" to "Which deaths were hidden by totals, and which conditions could change them?" The final knowledge turn is that rearranged numbers can reveal a preventable cause, not merely decorate a report.

Add a minimal time anchor in the opening or early body: a year, war period, expedition period, season, "after the experiment," "after the war," "before the report," or another concrete historical marker. Avoid floating openings such as "one night," "a room," or "a hillside" unless the next sentence anchors time and place.

Use this core turn formula before finalizing:

```text
Originally X was only recorded, classified, named, counted, or treated as Y; through Z, it began to point toward W.
```

If this sentence cannot be completed clearly, rebuild the story before final output.

## Knowledge Turn Sharpness

Every story must make the knowledge turn specific enough that a reader can name what changed in method, not only what changed in feeling.

Before writing, state the old question and the new question in plain language:

- Weak: "People saw nature as connected."
- Strong: "Old question: What is this plant called? New question: Under what altitude, temperature, moisture, and terrain conditions does this plant tend to appear?"

For broad field titles, make the story fit the full field, not only the easiest part of it. If the field includes mathematics, statistics, data, models, engineering, law, communication, or similar method words, the body must show those methods in action.

For `自然科学、数学与统计`, do not merely show a natural observation. The story should visibly include:

- measured variables such as altitude, temperature, pressure, moisture, time, count, distance, or position;
- comparison across cases, heights, routes, populations, samples, or repeated observations;
- a pattern, distribution, scale, table, map, graph, coordinate, or visual arrangement that turns scattered observations into evidence.

The hidden knowledge section should name the precise turn. Avoid generic turns like "everything is connected." Prefer turns such as:

- from naming isolated specimens to comparing variables across a distribution;
- from one case to a pattern across cases;
- from a list of facts to a visual model that lets relationships be checked.

## Useful Literary Language

Literary sentences are allowed only when they carry knowledge.

If a metaphor appears, make its meaning clear in the same sentence or the next sentence.

- Weak: "The names began to question each other."
- Better: "Placed on the same page, the names exposed a sharper question: why did similar plants keep appearing at similar heights?"

- Weak: "The specimen folder became incomplete testimony."
- Better: "The specimen folder kept the leaf shape, but not the altitude, temperature, moisture, or surrounding plants that made the leaf meaningful."

If a beautiful sentence can be removed without weakening the knowledge turn, replace it with a concrete observation, measurement, comparison, or action.

## Surprise And Reveal

Keep the hidden knowledge hidden long enough for the reader to experience the turn.

In the first half, focus on the old habit, its seriousness, and its limit. Do not announce the final relationship too early.

For example, in a Humboldt-style story, do not start by saying the mountain showed that environment shapes plants. Start with the specimen method working well enough to feel reasonable, then let measurements and repeated altitude patterns make the method insufficient.

The final reveal should feel like the reader's view has clicked into a sharper structure. It should not merely confirm what the title, summary, or first paragraph already said.

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

Every scene object must serve the knowledge turn. A ledger, specimen folder, thermometer, bed, lamp, map, chart, classroom board, or instrument should show the old method, expose a problem, or enable the new method. Do not let props become decoration.

## Readability Rules

- Give the reader one human thread to follow. Even when the field is abstract, anchor it in one person's workbench, route, notebook, instrument, classroom, or decision.
- Make the person thick enough to follow: a role, constraint, task, tool, or pressure must be visible. "A young traveler" is too thin unless the story shows what the traveler carries, loses, checks, doubts, or changes.
- Keep paragraphs doing different jobs: scene, old habit, friction, action, turn, new understanding.
- Prefer small cause-and-effect steps over grand transitions.
- Use short concrete sentences when the story turns. Do not bury the question change in a long abstract sentence.
- If a sentence could appear in any story, replace it with a detail from this story.
- After drafting, remove the field name and famous person's name. The story should still be readable and worth continuing.
- If the ending sounds like a definition, move that material to "藏在里面的知识" and end the body on the earned new way of seeing.
- Make the old/new question contrast sharp and short. Long abstract rewrites weaken the turn.

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
- Do not let the final third become a neat conceptual wrap-up. Stay with the changed question and the evidence that changed it.
- Do not use atmosphere as a substitute for event. Light, dampness, noise, or shadow can support a scene, but the story still needs a cognitive action: finding an anomaly, separating categories, comparing records, changing a question, drawing a new form, or proposing a new explanation.
- Historical support should reveal or anchor the person/event and carry the story's evidence forward. It may be concise, but it should not read like a disconnected encyclopedia card.
- Reflection questions should keep the story's exact tension. Avoid absolute words such as "only" or "always" unless historically or scientifically justified; prefer "under what conditions," "tends to appear with," "what else must be recorded," or similar phrasing when the story is about variables and patterns.

Use these final checks:

- No evidence pressure means the piece is an explanation, not a story.
- No time-scene consistency means the piece is a false scene.
- No changed question means the piece is a knowledge introduction.
- No initially reasonable old method means there is no real discovery.

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
