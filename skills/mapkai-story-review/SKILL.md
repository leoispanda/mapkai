---
name: mapkai-story-review
description: Strictly review generated or rewritten MapKAI knowledge stories for discovery-based storytelling quality and make only safe micro-edits when the story already works. Use when checking whether a MapKAI story has concrete scene, old understanding, field-based tension, character action, changed question, evidence-grown insight, natural knowledge emergence, factual safety, non-AI style, and non-decorative literary language; also use for batch audits after MapKAI story generation or rewrite.
---

# MapKAI Story Review

## Purpose

Review MapKAI knowledge stories after generation or rewrite.

This is not a polishing skill. It is a strict story-quality review. A story should not pass because it is fluent, longer, emotional, literary, or conceptually correct. It passes only when knowledge grows from a concrete scene, real tension, observable action, and a clear shift in understanding.

Core question for every story:

```text
Is this truly a story of discovery, or is it still a knowledge explanation with decorative writing?
```

If it is mainly explanation, mark it `REVISE` or `REWRITE`.

## Decision Labels

- `PASS`: The story works as a discovery-based MapKAI story. Only tiny edits may be needed.
- `LOCAL EDIT`: The story basically works, but specific sentences or small sections need changes.
- `REVISE`: The story has potential, but one or more core elements are weak: tension, action, changed question, evidence-grown insight, knowledge emergence, or ending question.
- `REWRITE`: The story is still mainly a knowledge card, biography, or explanation. It should be rebuilt from the story arc.

## Micro-Edit Rule

The reviewer may make edits only when the story is already structurally working.

For `PASS` or `LOCAL EDIT`, provide a micro-edited version that directly applies safe sentence-level fixes. Micro-edits may:

- Replace vague literary phrasing with concrete action.
- Remove small AI-like transitions.
- Make an overclaim more cautious.
- Tighten an ending question.
- Clarify a local cause-and-effect link.
- Adjust one or two sentences so the story's existing logic is easier to follow.

Micro-edits must not:

- Invent new facts, scenes, dialogue, or private emotions.
- Change the story's core event, knowledge point, or historical support.
- Rebuild the story arc.
- Hide a structural problem by polishing around it.

For `REVISE` or `REWRITE`, do not provide a full micro-edited story as if the problem is solved. Give required sentence fixes only as examples, then send the story back to the rewrite step.

## Review Checklist

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

### 1A. Field Name Quarantine

Check whether the story body names the field, explains the field, or uses the field title as a bridge before the "hidden knowledge" section.

Fail or mark `REVISE` if the story body contains patterns like:

- "{fieldTitle}在这里..."
- "{fieldTitle}关注/研究/连接..."
- "{fieldTitle}形成共同语言..."
- "这个领域/这门学科..."
- "藏在这个故事里的..."
- "真正的意义在于..."

Reviewer question: Could the story body still be worth reading if the field title were hidden?

### 2. Delayed Naming

Check whether early naming helps the scene or turns the story into a biography.

For many MapKAI stories, especially famous-person discovery stories, it is often stronger to begin with "a doctor," "a young traveler," "a mathematician," "a student," or "an engineer," then reveal the name after the discovery begins to form or in historical support.

Do not automatically fail early naming. Fail it only when the name replaces observation, tension, or action.

Reviewer question: Does naming the person early weaken the discovery effect?

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

Reviewer question: What action moves the story forward?

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
- The knowledge point is pasted onto the story.
- The ending is a lecture.

Reviewer question: Could the reader follow the path from evidence to insight?

### 7A. Contribution Summary Risk

Check whether the story turns into "person did X and influenced Y" before the story's changed question has been earned.

Weak signs:

- The final third lists the person's contribution, book, institution, or historical impact.
- The story names the field and explains its importance instead of staying with the evidence.
- A famous person's name carries the authority that the scene should have carried.

Reviewer question: Is the ending still a discovery, or has it become a biography paragraph?

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

### 10. Environment Serving Knowledge

Environmental description must serve story logic.

Good environmental detail:

- Makes the observation understandable.
- Shows physical difficulty.
- Supports the tension.
- Helps the reader see why the discovery mattered.

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

### 12. Not Just Longer

Check whether the rewrite only made the story longer.

Mark as weak if the story has more words but still lacks old understanding, field tension, character action, changed question, evidence-grown insight, or natural knowledge emergence.

Reviewer question: Did the story gain structure, or only length?

### 13. Ending Question with Tension

The final question should invite thinking, not test memory.

Weak questions:

- Why is this important?
- What did you learn?
- Do you understand this concept?
- How can we apply this today?

Strong questions often include a tension:

- Facts vs relationships.
- Tool vs intention.
- Speed vs understanding.
- Local error vs system.
- Data vs judgment.
- Classification vs connection.
- Calculation vs expression.
- Memory vs interpretation.

Reviewer question: Does the final question leave the reader with a real choice or tension?

### 14. Batch Pattern Check

When reviewing multiple stories, also check repeated templates.

Flag if too many stories use:

- "某年某地，一个人……"
- "别人看到 A，他看到 B" with identical phrasing.
- "多年后……" as the main transition.
- "今天我们……" as the modern link.
- The same final question structure.
- The same emotional pause.
- The same sensory details.

Reviewer question: Are these stories beginning to sound like one template?

## Required Output Format

For each story, output:

```text
Review Decision
PASS / LOCAL EDIT / REVISE / REWRITE

Overall Judgment
{3 to 5 direct sentences. State whether the story truly works as discovery or only looks story-like.}

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
* Old understanding:
* Field tension:
* Character actions:
* Question change:
* New understanding:
* Missing or broken link:

Required Sentence Fixes
* Original:
* Problem:
* Suggested replacement:

Micro-Edited Version
{For PASS or LOCAL EDIT, provide the complete story with only safe micro-edits applied. For REVISE or REWRITE, write "Not applicable; return to rewrite."}

Factual Risk Notes
{Mention overclaims, unsupported historical details, invented scenes, or wording that should be more cautious.}

Fake Literary Risk Notes
{Mention sentences that sound poetic but are unclear, decorative, or unsupported.}

Most Important Revision Direction
{Give only one main direction.}

Final Recommendation
{State whether the story needs a small edit, local rewrite, or full rewrite.}
```

If there are no main problems, write `None` under that section rather than inventing issues.

## Batch Output Format

When reviewing a batch, add:

```text
Batch Summary
* Number of stories reviewed:
* PASS:
* LOCAL EDIT:
* REVISE:
* REWRITE:

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
5. What did the person do?
6. How did the question change?
7. How did the new understanding grow from evidence?
8. Did the knowledge point emerge naturally?
9. Does the final question contain real tension?
