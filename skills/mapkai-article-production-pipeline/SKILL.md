---
name: mapkai-article-production-pipeline
description: Orchestrate one-click MapKAI article production by combining Article Context Card, mapkai-knowledge-router, the correct MapKAI writing skill, writer self-check, MapKAI Story Review + Rewrite PDC, Rewrite Modify, and optional Codex website update. Use when the user asks to generate, create, rewrite, prepare, publish, or update a MapKAI article end-to-end; says "一键生成", "文章生产流程", "publish-ready MapKAI article", "用 writing skill 生成再 PDC review", "生成后直接审改", or wants a single agent-like skill that coordinates MapKAI writing and review skills.
---

# MapKAI Article Production Pipeline

## Purpose

Run MapKAI article creation as a controlled production pipeline, not as a one-shot writing task.

This skill is an orchestrator. It must coordinate the existing MapKAI skills instead of replacing them:

1. `mapkai-knowledge-router`
2. the selected writing skill
3. `mapkai-story-review-pdc`
4. optional Codex website update

The default production rule is:

```text
Article Context Card -> Router -> Writing Skill -> Writer Self-Check -> Story Review + Rewrite PDC -> Rewrite Modify -> Publish-Ready Output / Codex Update
```

## Non-Negotiable Rule

No MapKAI article should be treated as publish-ready until it has passed both:

1. the correct writing skill for its knowledge type;
2. `MapKAI Story Review + Rewrite PDC`, including Blue Whale Rewrite Brief and Rewrite Modify.

When the user asks for review in a production context, apply the current MapKAI working preference: review should directly modify the article, not only return comments, unless the user explicitly asks for review-only.

## Load Order

After this skill triggers, load skills in this order:

1. Read `mapkai-knowledge-router` before choosing any writing mode.
2. Based on router output, read the correct writing skill:
   - real person, event, discovery, reform, invention, historical movement: `mapkai-historical-discovery-story` or `mapkai-story-rewrite`;
   - Subject Origin / 学科起源 / 领域起源: `mapkai-story-rewrite` plus its Subject Origin reference;
   - abstract concept, education theory, psychology, management, sociology, philosophy: `mapkai-concept-fable-story`;
   - math, statistics, algorithm, computation, economics, finance, formula, mechanism: `mapkai-mechanism-explainer-story`;
   - lens, case pattern, or misconception correction: use the router's mode requirements and the closest existing MapKAI writing skill.
3. Read `mapkai-story-review-pdc` before judging or rewriting the draft.
4. If the task asks to update the website, inspect the existing code/content location before editing and keep the update scoped to article fields.

Do not skip the router because the article "seems obvious." The router prevents forcing every topic into the same story form.

## Step 1: Article Context Card

Before writing, build a MapKAI Article Context Card. Use user-provided facts first. If information is missing, infer only from the current article or repo content and mark it as `暂定`.

The card must cover:

- current or proposed title;
- one-line intro;
- category and field;
- page location if known;
- language version;
- publication status;
- core knowledge concept;
- related disciplines;
- what the reader should understand after reading;
- what the reader does not need to understand yet;
- difficulty: Beginner / Intermediate / Advanced;
- story type;
- target reader;
- likely reader confusion;
- why this story is worth reading;
- next reader action;
- MapKAI fit requirements;
- public website requirements;
- modification boundary;
- output requirement;
- uncertain information.

If uncertainty affects facts, history, sources, or public-release safety, do not silently fill the gap with invented detail.

## Step 2: Route The Knowledge Type

Use `mapkai-knowledge-router` to classify the article.

Output internally:

```text
Mode:
Selected writing skill:
Reason:
Hard constraints:
```

Reject the wrong mode:

- do not turn real history into a fictional fable unless the user explicitly asks;
- do not hide formulas or mechanisms inside vague metaphor;
- do not force abstract concepts into fake historical scenes;
- do not stretch a lens or misconception article into a false origin story.

## Step 3: Generate The First Draft

Use the selected writing skill's required structure.

For all modes:

- write story before explanation;
- show a concrete scene, task, object, rule, conflict, or repeated friction;
- separate the article into readable paragraphs; never output a normal MapKAI article body as one dense block unless the user explicitly requests a single-block draft;
- let the old way of seeing feel reasonable before it fails;
- make the knowledge turn visible before naming it;
- keep the tone clear, warm, premium, serious, and MapKAI-like;
- avoid childish tone, generic public-science filler, SEO stuffing, fake-deep sentences, and obvious AI transitions;
- avoid unsupported facts, fake dialogue, invented private emotion, and overclaims.

The first draft is not publish-ready. It is input for self-check and PDC.

## Global Paragraphing Rule

All MapKAI production drafts must be web-readable before PDC.

- Normal story bodies should use short paragraphs separated by blank lines.
- Historical / field-origin stories normally use 4-7 short paragraphs.
- Concept fables normally use 4-7 short paragraphs in `寓言故事`.
- Compact stories still need at least 2 paragraphs when the format allows it.
- Explanatory sections should avoid long blocks; split around about 180-220 Chinese characters when needed.
- Each story paragraph should carry one narrative job: scene entry, old practice, friction, changed action, changed question, or final image.
- One dense story block cannot enter publish-ready status. Send it back to writing or Rewrite Modify for paragraphing before approval.

## Step 4: Writer Self-Check

Before sending the draft into PDC, run a short internal self-check:

```text
Mode fit:
Story body removal test:
Concrete scene / camera test:
Paragraphing / mobile readability:
Old way -> friction -> changed question:
Concept / mechanism accuracy:
Factual and source safety:
AI voice risk:
Public website risk:
```

If a hard failure appears, revise the draft before PDC rather than asking the review council to rescue a broken article.

## Step 5: Run Story Review + Rewrite PDC

Use `mapkai-story-review-pdc` in **Review + Rewrite** mode by default for production.

Required sequence:

1. Article Context Card
2. hard MapKAI gates
3. 13-role Review Council
4. Blue Whale summary
5. Blue Whale Rewrite Brief
6. Rewrite Modify

Rewrite Modify may only modify according to the Blue Whale Rewrite Brief. It must not freewrite a new article, add unverified facts, or change the story into another piece.

## Step 6: Publish-Ready Output

The final article package must include:

```text
Revised Title
Revised One-line Intro
Revised Story
Knowledge Explanation
Metaphor Mapping
MapKAI Connection
SEO / Public Website Notes
Change Log
Final Approval Status
```

Use `APPROVED` only when Must Fix items are resolved. If local issues remain, use `NEEDS LOCAL EDIT`. If the story still depends on explanation, false facts, or weak mode fit, use `NEEDS FULL REWRITE`.

Do not include internal council notes in publishable article text.

## Step 7: Optional Codex Website Update

Only update website files when the user asks to update, publish, modify the site, or provides an existing article location to edit.

When updating the repo:

- preserve existing IDs, slugs, category codes, routes, quiz logic, founder-mode behavior, and taxonomy unless explicitly asked;
- update only the article fields needed: title, one-line intro, story, explanation, metaphor mapping, SEO/meta description;
- do not refactor unrelated modules;
- do not change the knowledge classification system;
- do not expose internal PDC notes on the public site;
- verify the page can display normally;
- check mobile readability when feasible;
- report `Changed`, `Verified`, and `Push status`.

Push only when the user explicitly asks to push.

## Short Commands

- `【MapKAI Article One-Key】`: run the full article production pipeline.
- `【MapKAI Generate Publish-Ready Article】`: generate article text through writing + PDC rewrite, without editing files unless requested.
- `【MapKAI Article Website Update】`: run the pipeline and update the specified website article/content location.
- `【MapKAI Article Pipeline Review】`: audit whether a produced article actually passed every pipeline step.

## Failure Rules

Return to the appropriate earlier step when:

- the Article Context Card contains unresolved facts that would affect accuracy;
- router mode and requested format conflict;
- the draft is a short example plus concept label;
- the story body collapses when the explanation is removed;
- the explanation rescues the story;
- a historical article lacks time/place/action consistency;
- a mechanism article cannot be checked with a small example;
- the PDC Must Fix list is not resolved;
- public website safety, copyright, dignity, or factual risk remains.

Do not call a piece publish-ready because it is fluent. Fluency is not a MapKAI quality gate.
