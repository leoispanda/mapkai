---
name: mapkai-historical-discovery-story
description: Write MapKAI stories for real historical people, discoveries, inventions, scientific observations, reforms, expeditions, and social movements. Use when the input names or depends on a real person/event and needs a historically situated scene with concrete time/place/action, old method, evidence pressure, changed question, historical support, hidden knowledge, and a reflection question.
---

# MapKAI Historical Discovery Story Writer

Use this skill for real historical people, discoveries, inventions, scientific observations, reforms, expeditions, or social movements.

## Purpose

Write a historically situated MapKAI knowledge story. The story should not be an encyclopedia card, biography, or decorative summary. It should show how a concrete scene, tool, object, record, or repeated observation pushed someone to ask a different question.

For MapKAI field pages, make the person/event an entrance into how a discipline or knowledge field began to need its own object, question, or method. Do not stop at "this person discovered X."

Do not imply that a broad discipline was created in one scene by one person. Many fields formed through many people, institutions, tools, disputes, and teaching practices. Use the historical person/event as an origin window or formation turn unless the input is genuinely about a narrow invention or named approach.

## Reference Files

Use `references/examples.md` when a historical field-origin story feels correct but summary-like, especially for education or Reggio Emilia-style stories.

For a full Subject Origin page, first use `skills/mapkai-story-rewrite/references/subject-origin-page-standard.md`. This historical skill may shape the `起源故事` section, but it should not collapse the full page into the normal `知识故事` output format.

## Story-First Product Promise

MapKAI stories must work as small stories before they work as explanations.

Before finalizing the story body, mentally remove the field title, famous person name if possible, historical support, hidden knowledge section, and explanation section. Ask:

```text
Would a reader still want to continue because something is happening?
```

If no, rewrite the body. A story body must have a concrete situation, a reasonable old way of acting, friction through action/object/repetition/material, at least one second beat of friction or adjustment, a changed practice or question, and a final image that already contains the turn before the label appears.

## Best For

- Science history
- Technology history
- Medical history
- Environmental history
- Social action history
- Discovery stories
- Invention stories
- Reform stories

## Core Structure

1. Concrete time and place
2. Main person or group
3. Object, tool, material, record, route, sample, or working surface
4. Old method or old question
5. Why the old method was reasonable
6. Evidence pressure
7. New action or method
8. Changed question
9. New understanding
10. Historical support
11. Hidden knowledge
12. Reflection question

## One Scene, Three Beats

Develop one main scene through at least three beats:

1. **Opening action**: someone handles a concrete object, material, tool, room, route, record, child, graph, sample, or surface.
2. **Friction or repetition**: the old interpretation still seems reasonable, but something repeats, resists, fails, becomes heavier, changes shape, or does not fit.
3. **Changed practice or question**: someone records differently, rearranges a room, adds material, returns later, compares another case, asks a different question, or waits longer.

If the story only stages one action and then jumps to explanation, it is too thin. Add length through visible action and repeated friction, not through abstract explanation.

## Paragraphing

Do not output the `故事场景` body as one dense paragraph. Use 3-5 short paragraphs separated by blank lines, with each paragraph carrying one beat: opening action, friction, changed action, changed question, or final image.

Do not add headings inside the story body. Paragraph breaks should improve web reading without turning the scene into notes.

## Final Image Before Concept

Before naming the approach, field label, or historical importance, end the story body on a final image that already contains the knowledge turn.

Weak:

```text
This became the Reggio Emilia approach.
```

Better:

```text
The classroom no longer looked like a place where children waited for lessons. It looked like a workshop where drawings, blocks, teachers' notes, and parents' questions could all become part of thinking.
```

Only after that should historical support or hidden knowledge name the person, approach, or field.

## No Feature Lists In Story Body

Do not put lists of correct features inside the story body.

Weak:

```text
The school used art, community, documentation, environment, and project learning.
```

Better:

```text
The teacher pinned the children's drawings beside her notes. Parents stood around them after work, not to admire the pictures, but to ask what the children were trying to solve. The next morning, more blocks sat near the window, clay lay beside the paper, and mirrors waited where children had argued about light.
```

Stage features through action. Put feature names in historical support or hidden knowledge.

## Hard Rules

- Do not invent false scenes.
- Do not merge fieldwork, later analysis, publication, and impact into one moment.
- Do not use a historical support section to rescue a weak story body.
- Do not turn the person into a hero biography.
- Do not reveal the abstract concept too early.
- The key object in the title must do real work in the story.
- The story body must still show a meaningful change if historical support and hidden knowledge are removed.
- Do not default to "what is this called?" unless the story is actually about naming, classification, or natural-history collecting.
- Do not force measurement, comparison, tables, or charts onto stories whose pressure comes from scale, action, reform, tool use, or social movement.
- Do not write the story body as a feature list, contribution list, or approach summary.
- Keep high-risk details out unless supported: exact weather, private emotion, direct dialogue, room layout, named bystanders, or dramatic gestures.

## Output Format

```text
知识故事
{field}

{title}

一句简介
{A concrete sentence that creates curiosity without revealing the whole abstract conclusion.}

故事场景
{500-800 Chinese characters. Start with time, place, object, and action. Show old question, evidence pressure, new action, changed question, and new understanding. Use 3-5 short paragraphs separated by blank lines unless the user explicitly requests compact single-block output.}

历史支撑
{Brief and accurate historical context. Do not exaggerate causality.}

藏在里面的知识
{1-2 sentences explaining the knowledge turn. For field-origin pages, explain what older way of seeing reached its limit and what new object/question/method began to define the field.}

{Reflection question}
```
