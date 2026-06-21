# MapKAI Story Standard

MapKAI stories are not explanations with decorative scenes. They are small, concrete moments that let a reader feel why a knowledge lens matters. For field-level lens stories, the preferred direction is now a grounded origin story, founder story, or classic case from the discipline.

## Quality Bar

Every lens story should pass these checks:

- One everyday object, place, or action appears in the first sentence.
- The source should be a common social-life problem, awkward moment, or small anecdote: waiting in line, a group-chat misunderstanding, a receipt, a repair, a clinic visit, a family rule, a school activity, a missed notice, a shared bill, a noisy neighbor, a delayed bus, a meal, a form, a lost item, or a small service failure.
- When the field has a famous founder, origin moment, classic experiment, or canonical case, prefer that over a purely invented anecdote.
- Introduce the person before fame through ordinary work, place, tools, doubts, or small observations. Give enough background for a student to recognize the person as human before they become famous.
- Show the concrete discovery path: what the person noticed, what felt wrong, what they tried, and how the field slowly became visible.
- Reveal the person's name and main contribution only in the final sentence of the story body. No biographical name reveal should appear earlier in the narrative.
- Keep historical support visible enough to trust: dates, places, works, institutions, or what the person actually did.
- A person initially misreads the situation or reaches for the easiest explanation.
- Someone observes, asks, tests, compares, or listens before the meaning changes.
- The knowledge point emerges from the story instead of being pasted on after it.
- The ending leaves a reflective question, not a moral lesson.
- The story serves one field only. It should not try to cover every related perspective.
- The Chinese version must read naturally as original writing, not translated documentation.

## Mandatory Review Gate

Every generated MapKAI article, origin page, knowledge story, or concept fable must receive a strict review after writing before it can be treated as final or publication-ready.

Use the relevant writing skill first, then run `mapkai-story-review` against the finished text. For batches, record the review in a report under `docs/` with:

- scope and source files;
- mechanical checks such as story count, section count, and story-body length;
- one decision per article or story: `PASS`, `PASS / LOCAL EDIT`, `LOCAL EDIT`, or `FAIL`;
- common pattern risks across the batch;
- required revision direction before the next generation or publishing pass.

Do not call a generated article complete only because it has the right sections, fluent prose, or correct concepts. A story is complete only when the story body itself survives review: concrete scene, reasonable old way, repeated friction, changed action or question, late concept or field reveal, and a reflection question with real tension.

## Avoid

- "This field helps people..." as the whole story.
- Generic words without sensory detail: situation, issue, system, context, problem.
- Teaching from above, slogans, inspirational endings, or textbook summaries.
- Reusing the same story body structure across many fields.
- Making every story about a teacher, meeting, or community project.
- Starting from abstract "big issues" when a small social-life incident would carry the same idea better.
- Grand tribute language before the reader has met the person as a human being.
- Inventing dramatic childhood scenes, dialogue, or emotions that are not supported by the historical record.
- Calling a contested contribution absolute when a more careful phrase is available.

## Preferred Shape

1. Scene: a concrete moment, object, room, street, tool, or repeated action.
2. Before fame: the person is shown as someone working, observing, doubting, or trying.
3. Turn: a detail changes the interpretation and opens the field.
4. Field insight: the sublens becomes visible through action.
5. Human turn: the reader can feel why this person cared before knowing the name.
6. Final reveal: "这个人叫..." plus the person's role and contribution, as the final sentence of the story body.
7. Today/support: dates, works, institutions, or factual anchors may appear after the story as support, not before the reveal.
8. Reflection: one question the reader can carry away.

## Rewrite Policy

Generated placeholder stories are acceptable only as scaffolding. Public-facing stories should be manually rewritten in batches, one lens at a time, and reviewed against this standard before being treated as final.
