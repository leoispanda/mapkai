---
name: mapkai-subject-story-song
description: Create MapKAI subject or subfield story songs by writing a culturally grounded story, adapting that same story into lyrics, selecting music from the narrative, balancing the saved genre preferences, and reviewing the complete song package. Use for 学科故事歌曲, 故事改编成歌, or continuing a MapKAI subject music batch; ordinary articles use the article pipeline.
---

# MapKAI Subject Story Song

Each requested subject gets a story that can be understood on its own and a song that tells that same story. The listener should recognize the field through what the characters observe, choose, test, interpret or coordinate. A subject name in the chorus is not enough.

Default to English, a clear adult lead and roughly two minutes, following existing user preferences. Give the ending enough time; adjust duration and lyrical density to the story rather than losing its final action. Respect any later language, duration or sound request.

## Scope and context

- Work from the active MapKAI repository and its `AGENTS.md`, `MAPKAI_MEMORY.md` and deployment policy. The current project is `/Users/leoyang/Documents/mapkai`; compatibility paths are not separate checkouts.
- Read the requested subject's existing origin/context and taxonomy. Choose a specific cultural core and knowledge point. A broad administrative category contains multiple traditions; one song need not claim a single origin or explain every branch.
- Preserve existing article, song and question-bank IDs. A new source story belongs in the song package; publishing it as a new website article or replacing a Subject Origin requires that scope in the user's request.
- Editing this skill or its preferences is authoring work. Start paid generation or website publication only within the current request or an unfinished, already authorized production scope. Carry existing authorization forward without asking again.

## Story first

Read `mapkai-knowledge-router`, then the writing skill it selects: historical discovery, concept fable, mechanism explainer, or the applicable lens/case/misconception requirements. Use their knowledge-specific discipline rather than forcing every subject into invented history.

Build a compact story context card with subject/subfield, selected core, reader takeaway, story mode, fiction/history status, protagonist, concrete task, initially reasonable old approach, friction, changed action/question, outcome/limit, sources and uncertainties.

Write a developed, connected source story before composing lyrics. Keep a concrete object or task through its middle. The character must do something that makes the selected field's way of thinking visible; a lecture after a decorative opening does not qualify. For mechanisms, retain the checkable causal steps. For real history, verify the specific people, setting and claims; invented sung dialogue must not masquerade as a documented quotation.

Keep these internally:

1. The complete source story.
2. Its essential narrative beats and knowledge boundary.
3. A short cultural-core statement explaining what the actions show.

## Choose music from the story

Read [the sound guide](references/story-and-sound.md) and [the genre policy](references/genre-policy.json). The sound description is more important than an exact genre label. The user's bell-like, ethereal preference must not be automatically replaced with ordinary folk-pop.

For each story, identify two or three plausible musical directions from its pace, emotional distance, voice, conflict and turn. Select the best fit while balancing the series. Record `primaryGenre`, `storyFitReason`, `quotaReason` and concrete tempo/pulse, instruments, voice, hook and arrangement instructions. BPM and section windows are composition directions, not measured properties of generated audio.

For a batch, the optional offline planner is:

```text
python scripts/plan_genres.py 20
python scripts/plan_genres.py 20 --counts /absolute/path/to/current-series-counts.json
```

The counts file maps the policy's genre IDs to nonnegative counts. Use only known accepted songs in the active story-song series; do not invent a ledger or automatically count/rework the older library. Save planned reservations separately from completed songs. Failed variants do not count as extra songs.

The planner returns integer quotas, not subject-to-genre assignments. Match the already written stories to those slots. Short batches approximate percentages; report the actual allocation and carry deficits into later batches. A single story uses narrative fit and the existing series balance. Do not force an unsuitable genre, regenerate a good track, or cut lyrics to make a quota exact. Count hybrids once under their primary musical direction. Reclassify a performed style only with actual evidence, not merely its generation prompt.

## Adapt the same story into lyrics

Read the adaptation guidance in [story-and-sound.md](references/story-and-sound.md). Preserve the protagonist, object/task, pressure, decisive action, knowledge turn and bounded ending. Compress exposition; preserve the action that explains why the field matters.

Use verses to move the story forward. Make the chorus a question, need or image earned by that story; its final return should mean more after the character's changed action. Flexible verse/chorus/bridge structures are allowed. Avoid a string of subject slogans, disconnected metaphors or a universal inspirational ending.

Build a beat-to-lyric mapping so the final turn cannot silently vanish during musical compression. Keep the full ordered `customLyrics` separate from a style-only generation prompt. Section labels, sources, editing notes and PDC reports are not sung.

## Review the story-song pair

Before PDC, self-check that the source story works without its explanation and that the lyrics still contain its decisive action and knowledge turn. Fix a broken narrative before council review.

Use `mapkai-story-review-pdc` in Review + Rewrite mode, loading its evidence protocol, council and output references when doing production. Extend the story context into its required Article Context Card using known information, marking uncertainties. Retain its existing 13 roles, Blue Whale issue tracking and Rewrite Modify. Adapt article-only output requirements to a song package; do not put historical support, SEO notes or council discussion into the lyrics.

Run at least three recorded review rounds and two real rewrite passes on the developing story-song pair. Each round checks both the source story and its lyrical adaptation, plus story-to-music fit. A revision to a plot or knowledge step must propagate to the lyrics and their mapping. Save actual versions/diffs and issue closure; do not manufacture review counts or label simulated roles as independent people.

The final text gate requires: a developed story, visible field method, retained narrative turn, accurate boundaries, clear singable English, a distinctive earned hook, appropriate emotional proportion, source/copyright safety and no unresolved Critical/Major issue. Text approval does not approve an unheard or incomplete recording.

## Generate, verify and deliver together

When generation is authorized, use ElevenLabs through an available supported tool or the established browser workflow. Confirm the current available credits and the authorized cost/variant scope from actual account state. Default to one variant per approved package. Preserve the exact submitted lyrics/style, provider identity and original recording. Further paid attempts require scope remaining in the existing authorization.

Verify the actual performance against the approved story-song pair. Preserve source lyrics separately from the complete performed lyrics; account for genuine additions, omissions or changes. Unsupported recognition output remains uncertain. Use a bounded local verification plan; unresolved words are not solved by endless inference or regeneration.

Produce genuine complete line cues from the exact publication audio. Preserve native evidence and any crop offsets; do not evenly space timestamps or delete words to satisfy a timing validator. A display-only line join is acceptable when every ordered word is retained and its complete native phrase is independently checkable. An edited edition must preserve verified content, disclose the edit and be verified against its own final audio.

Keep the source story, cultural core, genre reasoning, approved lyrics, complete actual lyrics, audio identity, timing and review state in one package. For an authorized website delivery, publish audio plus full actual lyrics and accepted timing together through the established guarded Music path. Compare current production assets, stage only this task's files, preserve private evidence outside Git/public output, read back the full published record, and verify actual playback and lyric seeking on the subject page. Use the existing AI label and keep internal audit/provider details private.

Report the song title, story/core, chosen sound, actual delivery status and meaningful limitations. Distinguish text-ready, generated, audio-verified and published states.
