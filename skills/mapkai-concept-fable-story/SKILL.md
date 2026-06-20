---
name: mapkai-concept-fable-story
description: Write developed, serious MapKAI allegorical stories for abstract concepts, theories, and relationship-based knowledge. Use for management theory, organization studies, psychology, education, sociology, philosophy, communication theory, strategy concepts, and abstract social-science ideas when no single historical scene is necessary; create late-reveal concept fables with narrative depth, repeated tension, metaphor mapping, boundaries, and reflection.
---

# MapKAI Concept Fable Story Writer

Use this skill for abstract concepts, theories, and relationship-based knowledge.

## Purpose

Explain a graduate-level concept through a serious allegorical story. The concept should not be named at the beginning. The reader should first experience the structure of the concept through the story, then recognize the concept near the end.

A concept fable should not feel like a short example with a label at the end. It should feel like a small world where the concept becomes necessary.

## Best For

- Management theory
- Organization studies
- Psychology
- Education
- Sociology
- Philosophy
- Communication theory
- Strategy concepts
- Abstract social-science ideas

## Core Structure

1. Fictional but concrete scene
2. Characters or objects that represent forces in the concept
3. Old way of acting
4. Tension created by the concept's core problem
5. First friction that can still be explained away
6. Repeated friction in a slightly different form
7. Character adjustment or changed behavior
8. A pattern that becomes visible
9. Late concept reveal
10. Short afterglow
11. Concept explanation
12. Metaphor mapping
13. Boundary of the analogy
14. Reflection question

## Story Length

The `寓言故事` section should normally be longer than a quick example.

- Chinese: aim for about 700-1100 Chinese characters.
- English: aim for about 600-900 words.
- Do not add length through filler, mood, or abstract explanation.
- Add length through scene progression, repeated tension, character decisions, visible adjustments, and pattern development.

The concept explanation, metaphor mapping, analogy boundary, and reflection question should stay concise.

## Narrative Development

Build the fable in several beats:

1. Open with a concrete place, group, task, rule, object, or routine.
2. Show why the old way of acting seems reasonable. Do not make it obviously wrong.
3. Let a first small problem appear while the old way can still explain it.
4. Let the same kind of problem appear again in a different form so the deeper structure begins to emerge.
5. Let someone change behavior: create a rule, avoid tension, connect groups, remove support, hide disagreement, search for another rhythm, or otherwise respond to the pressure.
6. Let the pattern become visible through action before naming the concept.
7. Reveal the concept only near the end. The reveal should feel like a click, not a label pasted onto the story.
8. After the reveal, allow one or two sentences for the central image to settle before moving to concept explanation.

Avoid rushed endings such as "Then they understood. This concept is X." Let the final image show the concept before naming it.

Example ending pattern:

```text
Only after the quietest apprentices began correcting the master's measurements did the workshop understand what had changed. It was not that mistakes had disappeared. It was that mistakes could now enter the room before they became disasters. Much later, this kind of room would be called psychological safety.
```

## Title And Reveal

For concept fables, the title should create curiosity without giving away the concept too early.

- Too obvious for scaffolding: "The Second Drawing Beside the Scaffold"
- Better: "The Lines That Slowly Disappeared"

The title may use the core metaphor, but it should not reveal the academic concept or its whole logic before the story begins.

## Four-Layer Self-Check

Run this check internally before output. Do not print the self-check unless the user asks for it. If any layer fails, revise the fable before final output.

### L1 Hard Scan

- All required output sections are present.
- The concept name does not appear in the title or early story.
- The reveal happens near the end of the `寓言故事`, not in the opening or middle.
- The story section is long enough to develop a small world, normally 700-1100 Chinese characters or 600-900 English words unless compact output is requested.
- The story does not use childish tone, fairy-tale morals, cute over-personification, or academic-paper summary language.
- The story does not add length through abstract filler such as "the structure became visible" or "the group changed its understanding."

### L2 Narrative Movement

The story must be able to answer these questions from visible actions:

- What old routine, rule, or assumption first seemed reasonable?
- What first friction appeared, and why could it still be explained away?
- What repeated friction made the same hidden pattern harder to ignore?
- What did someone change, remove, connect, hide, delay, repeat, or re-check?
- What final image lets the reader sense the concept before it is named?

If these cannot be answered, do not patch the ending. Add a real middle beat before the reveal.

### L3 Concept Fit

- The metaphor must express this concept's specific structure, not a generic "people learn/change/coordinate" story.
- The conflict must come from the concept's core tension, not random drama.
- The concept explanation must directly match the allegory.
- The metaphor mapping must identify the main forces in the concept.
- The analogy boundary must state what the story should not be used to overclaim.

### L4 Reader Effect

Before the explanation, the reader should feel: "I am following a situation." Near the end, the reader should feel: "Now I see what concept this was." If the reader would instead feel "this is a short example and now comes the label," rewrite for more narrative development.

## Hard Rules

- Do not make it childish.
- Do not write a fairy tale moral.
- Do not over-personify objects.
- Do not make the metaphor too cute.
- The conflict must come from the concept itself, not from random drama.
- The story should be understandable to general readers but still meaningful to graduate-level readers.
- Do not use real historical names unless the user explicitly asks for a historical version.
- Do not hide the concept so deeply that the explanation feels disconnected from the story.
- Do not reveal the concept too quickly.
- Do not write a one-scene example followed by a concept label.
- Do not lengthen the story with abstract sentences such as "the hidden structure became visible" or "the group changed its understanding."
- Use visible actions instead: someone returns to the same place, a rule works once but fails again, a quiet person changes behavior, a record is checked twice, a meeting repeats the same silence, a tool is removed slowly, or two groups misunderstand the same message differently.

## Output Format

```text
知识寓言
{field}

{title}

寓言故事
{A serious, developed allegorical story. Do not name the concept until late in the story. Normally 700-1100 Chinese characters or 600-900 English words. Include old way, first friction, repeated friction, character adjustment, visible pattern, late reveal, and a short afterglow.}

揭示的概念
{Concept name}

概念解释
{Explain the concept clearly and simply.}

隐喻对应

* {Story element}: {Concept element}
* {Story element}: {Concept element}
* {Story element}: {Concept element}

类比边界
{Explain what the metaphor should not be used to overclaim.}

反思问题
{A question that brings the concept back to real thinking.}
```
