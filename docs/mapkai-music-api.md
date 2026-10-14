# MapKAI Music storage and access

MapKAI Music hosts uploaded English, Dutch and Chinese ElevenLabs songs; it does not generate songs or call the ElevenLabs API. The public page can list and play published tracks in any supported language. Publishing an upload requires the existing server-verified founder session. Song language is declared by the owner at upload; the service does not automatically detect lyrics or verify their language. The owner upload form is for verified ElevenLabs music: new uploads store `aiGenerated: true` and `generationProvider: "ElevenLabs"`, which the public catalog preserves as provenance; the visible card label states AI generation without provider branding. The service does not independently detect or verify the generation provider from audio bytes.

## Existing production prerequisites

- `MAPKAI_REVIEW_MEDIA`: private R2 bucket binding, also used by the existing video review service. Music uses only the separate `music/` namespace.
- `CLOUDFLARE_COST_DB`: the existing shared Cloudflare cost guard D1 binding. Every music R2 LIST, GET, HEAD and PUT reserves its allowance before accessing the bucket.
- `MAPKAI_FOUNDER_ACCESS_CODE`: existing server secret. Music reuses the signed, HttpOnly founder cookie; the frontend receives no secret or bearer token.
- `MAPKAI_DB`: existing application D1 binding, used for owner sign-in attempt limits. Owner login fails closed if this binding is missing.

No new public bucket access, API key, paid provider call or binding is required. The production environment must contain all these existing bindings; preview environments without the shared cost database cannot upload or read songs.

## Shared cumulative song votes

Like and Not for me (点赞 / 不喜欢) are cumulative actions, not personal toggles. Every explicit accepted click contributes one vote to the shared website total, including another click from the same browser or from a different browser/app opening MapKAI. Both counts are visible. Ranking uses `score = likes - dislikes` descending, then the fixed song number ascending for ties. Cards, Play all and the site-wide dock use the same shared ordering without changing song numbers or replacing the current audio.

Totals live in the existing `MAPKAI_DB` D1 database. The vote-event request UUID is unique, and SQLite triggers update the aggregate atomically only for a newly inserted event. Repeating an uncertain submission with the same UUID cannot add another vote; reusing it with a different song/reaction returns a conflict. No API deletes or resets votes. Only currently public songs validated through the existing guarded metadata reader can receive votes. Voting never writes R2 song/audio objects or rewrites original lyrics, cues, IDs or the numbering ledger. There is no account requirement, per-browser one-vote cap, unique-person claim or cross-service import of votes from unrelated music platforms.

The older `mapkaiMusicReactions.v1` local preference data is left untouched and is not automatically counted as server votes. The client displays server-confirmed totals only. It refreshes when a listener returns and every 30 seconds while the page is visible after the voting store has been activated. Network errors show an unavailable/retry state instead of inventing locally saved totals. An unknown POST outcome retains its request UUID and permits explicit retry of that same action; it never auto-resubmits or silently creates a fresh vote. Votes in progress disable duplicate clicks until the response returns. Ordinary request-rate protection still applies.

Endpoints:

- `GET /api/music/votes` returns `{ totals: [{ id, likes, dislikes, score }] }` from the shared database with no-store responses. Missing zero-vote rows represent zero after a successful complete response.
- `POST /api/music/votes` accepts exactly `{ id, reaction: "like" | "dislike", requestId }`, requires the website's same-origin Origin proof and bounded JSON, and returns `{ total, requestId, duplicate }`. Counters are shared across browser software and updated by the server, not by localStorage.

## Song creation entry

The Music page's bilingual Create a song dialog prepares a prompt locally from the title, theme, language, style, 1- or 2-minute duration, and optional original lyrics. It validates the result against the provider's 4,100-character prompt limit. It does not send draft text to MapKAI or generate audio itself. Copying uses the clipboard with a selectable-text fallback; an explicit external link opens the existing music creator at `https://elevenlabs.io/app/music/history` without embedding draft text in its URL. The page names that destination and explains account-credit use before the user leaves. After generating and downloading a song in their own account, the owner can return to the existing authenticated upload studio.

No music-generation API key is configured in MapKAI. This entry is a prompt-preparation and external-account workflow, not an in-site automatic generation connection. Public listening and owner upload controls retain their existing access rules. Draft text stays in the current page and is cleared on reload; only the existing interface-language preference is persisted.

The default title is `MapKAI — Look Again`, with a theme introducing MapKAI's curiosity, knowledge maps, stories, learning paths and Toolbox. The default creation direction is upbeat Memphis hip-hop with clear vocals and light guitar accents, following the owner's stated preference. Rock, symphonic, folk rap and acoustic remain available; the rock prompt calls for melodic vocals and moderate guitars. The two-minute MapKAI brand preview is featured before the existing Dutch Horizons versions; the earlier city-name experiments retain their audio and IDs but are no longer featured.

## Paired song and lyric production

The owner requires every MapKAI song to retain its original recording and be published together with its original lyrics. The 2026-10-13 instruction supersedes the earlier synchronization prerequisite: do not regenerate, rerecord, trim or otherwise edit audio solely for lyric synchronization, uncertain recognition, minor singing differences or failed alignment. Existing original versions remain available; all already-generated unpublished recordings are authorized for publication as their actual historical versions.

For agent-led production, review lyrics before generation and retain the submitted text, provider song ID and full original audio SHA-256. Real, validated sentence timing is an optional enhancement. When timing cannot be completed reliably, publish the playable original and its original lyrics with a truthful synchronization-unavailable notice. Do not invent cues, guess words, remove source text to satisfy validation, or claim an exact performed-word PASS. Keep observed performance differences and substantive content uncertainties recorded separately. New audio editing or regeneration requires a specific owner request for that audio change.

Use the existing guarded storage route and verify public playback. The API already accepts plain lyrics without timing; no new provider call, transcription service or in-site automatic alignment service is implied.

## Endpoints

- `GET /api/music/auth`: `{ owner, uploadConfigured }`. Checks the current founder cookie and binding availability without accessing R2.
- `POST /api/music/auth`: JSON `{ code }`. Uses the existing founder access code, with five attempts per client IP per 15 minutes. Success sets the signed founder cookie and returns `{ owner: true, uploadConfigured }`.
- `GET /api/music/tracks[?cursor=...]`: `{ tracks, nextCursor }`, with up to 50 tracks per page. Each public track contains `id`, `title`, `description`, `language` (`en`, `nl` or `zh`), `lyrics` (a plain-text string, empty when unavailable), `lyricsTiming` (validated line cues, empty when unavailable), `aiGenerated`, `generationProvider`, `url`, `durationSeconds` (initially null), `createdAt` and `filename`. Stored metadata in any other language, or without a language declaration, is excluded from public list and playback.
- `POST /api/music/tracks`: multipart `file`, `title`, `description`, `language=en`, `language=nl` or `language=zh`, and optional `lyrics`. Other language values or a missing declaration are rejected. Requires the valid owner cookie and the same-origin `Origin` header. The server sets the AI disclosure fields; multipart fields that attempt to override them are rejected. Success returns HTTP 201 `{ track }`; the uploaded song becomes public.
- `GET|HEAD /api/music/audio?id=...`: published audio only. Supports single byte ranges, HEAD and ETag validators for playback and seeking. Internal bucket keys cannot be requested.

Audio files are limited to 25 MiB and MP3, M4A or WAV. Extension, declared MIME type and actual format structure are validated. MP3 requires two complete, consistent MPEG frames. Conventional M4A requires an audio codec, sample tables, timed samples and complete media data, and rejects video handlers; fragmented M4A containers are not supported. WAV requires audio format and nonempty data chunks. Validation checks the container structure and does not decode every sample. Titles are limited to 120 characters and descriptions to 1,000. The actual request stream is bounded, including requests without Content-Length.

## Lyrics metadata

The existing `mapkai-music-track.v1` schema accepts optional plain-text `lyrics`. Public track responses always include a string; older metadata without the field remains playable and returns `lyrics: ""` without rewriting the stored record. New uploads store the supplied lyrics, or an empty string if omitted. Lyrics are normalized from CRLF or CR line breaks to LF and trimmed at the outer edges, preserving internal line breaks and blank sections. They are limited to 12,000 JavaScript characters after normalization; malformed values, duplicate upload fields, control characters other than supported line breaks, and over-limit lyrics are rejected with HTTP 400 instead of being truncated.

Metadata objects are limited to 64 KiB so complete Chinese and English lyrics fit. Multipart requests allow 64 KiB of additional text and framing while the audio file limit remains 25 MiB. Lyrics are sourced from the owner or verified original generation records; this storage change does not invoke a provider API, transcribe audio or guess missing words. Imported source lyrics should pass `normalizeLyrics` before a guarded metadata-only update, preserving each song's original ID and audio object.

### Optional playback timing

The same v1 metadata schema accepts optional `lyricsTiming` and `lyricsTimingSha256` through a verified private metadata import. These are not multipart upload fields. `lyricsTiming` is an array of `{ line, start, end }` cues. `line` is the zero-based index in `normalizeLyrics(lyrics).split('\n')`; `start` and `end` are seconds in the audio. Blank lines and lines whose trimmed text is a complete bracketed section name, such as `[Verse 1]` or `[副歌]`, are not sung lines and receive no cue. Every other line must have exactly one cue, in strictly increasing line order. Cues must use finite numbers, `0 <= start < end <= 7200`, and must not overlap; gaps and adjacent boundaries are allowed. There may be at most 600 cues, with no extra cue fields. The exported `normalizeLyricsTiming(lyrics, value)` validates full coverage and returns a fresh array, rejecting malformed or incomplete timing.

`lyricsTimingSha256` is the lowercase SHA-256 hex digest of the exact normalized lyrics encoded as UTF-8. `readTrack` validates structure and this digest with WebCrypto before exposing any cues. A lyric edit that changes the normalized text invalidates its old timing, even if the line count stays the same. Public responses include only the verified cue array, never the internal digest. Direct calls to `publicTrack` with raw metadata do not bypass the asynchronous verification. Missing, malformed, incomplete, overlapping or stale timing falls back to `lyricsTiming: []` while preserving ordinary lyrics, catalog access, audio playback and byte-range seeking; stored metadata is not rewritten during reads. `safeTrack` validates the base song independently of optional timing.

Timing must come from real audio alignment against the original lyrics. This API does not perform alignment, call a transcription provider or estimate line timestamps by distributing the song duration evenly. Future private backfills must validate exact lyric hashes and keep the complete metadata object within the existing 64 KiB limit.

## Durable publication

Each upload receives a fresh UUID. Audio is written to `music/audio/{id}.{extension}`, then its complete metadata is written to `music/tracks/{id}.json`. Both writes are conditional creates. The metadata write is the publication point, so simultaneous uploads cannot overwrite a shared catalog and an incomplete audio upload cannot become public.

If metadata publication fails after the audio is saved, the audio remains unlisted and inaccessible through public playback. It can be inspected by the owner during a later storage audit. The API does not delete files or refund the shared conservative storage reservation.

Public JSON responses are uncached so new uploads appear immediately. Successful audio responses use immutable URLs and allow browser caching. Existing video catalogs and review records remain separate.

An owner-authorized private metadata update can reversibly set an otherwise valid v1 song's `visibility` to `ARCHIVED`. The catalog omits archived songs, and new GET or HEAD playback requests return HTTP 404 after reading their metadata, without accessing the audio object. The complete base song record, requested ID and schema version still require validation; malformed archived records fail closed. `safeTrack` remains restricted to public records. Archiving does not delete or rewrite audio, lyrics or timing, and no public archive or delete endpoint is provided. Original metadata backups permit an authorized restoration. Audio already cached by a browser may remain available until its existing cache expires.

Existing track metadata without both AI disclosure fields remains playable during rollout. Its public disclosure values are `null`, indicating unknown provenance, and the frontend must not infer an AI label from its title or language. The four verified initial imports can be updated with the explicit `true` / `"ElevenLabs"` pair while retaining their IDs and audio objects. Metadata containing partial disclosure, a non-boolean AI flag, a false flag or a provider other than `"ElevenLabs"` fails validation; this module currently supports only declared ElevenLabs generation or unknown legacy provenance.

## AI disclosure review (2026-10-11)

Verified ElevenLabs tracks display a permanent `AI-generated` label on each card before playback, translated for the Chinese interface and associated with the play button for assistive technology. A page notice explains AI creation. Original audio bytes and existing embedded metadata are preserved.

The owner confirms these songs were self-generated on a paid subscription. The current [Music Terms](https://elevenlabs.io/music-terms), Exhibit A, list no attribution requirement for paid plans. The UI therefore uses MapKAI branding across the Music page, song cards, Toolbox, About and AI Transparency. Internal/provider metadata and existing audio markings are preserved. Supplier attribution is distinct from AI disclosure and does not establish copyright ownership or unrestricted redistribution rights. MapKAI currently hosts listening to the owner’s songs; it does not offer a stock-music licensing library or access to a generation model. Streaming distribution and other uses still depend on the applicable plan and agreement.

The current [AI Act Article 50](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02024R1689-20260727) requires deployer disclosure for audio that constitutes a deepfake; it does not classify every synthetic song as a deepfake. Artistic works permit disclosure that preserves enjoyment. Applicable notices must be clear, accessible and present by first exposure. The [Commission FAQ](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act) confirms that hidden machine-readable markings alone do not provide audience disclosure. Our visible card text implements those principles; this is an implementation assessment, not certification of all legal requirements or music rights.

Article 50 applies from 2 August 2026. The adopted [2026/1744 amendment](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32026R1744) grants providers of qualifying pre-existing generation systems until 2 December 2026 for Article 50(2) machine-readable marking. It does not postpone deployer disclosure. Hosting previously generated audio does not itself turn this module into a music-generation-system provider.

## Verification

Run `node --test scripts/music-api.test.mjs` with Node 22 or newer. Tests cover signed-cookie authorization, sign-in attempt limits, cross-origin rejection, declared English, Dutch and Chinese publication/playback, multilingual lyrics storage and normalization, complete long Chinese lyrics, legacy songs without lyrics, malformed and over-limit lyrics rejection, complete timed-line coverage, normalized UTF-8 timing hashes, stale and malformed timing fallback without playback or seeking failures, AI disclosure persistence and legacy compatibility, unsupported-language exclusion, file validation, durable upload ordering, simultaneous uploads, failed publication, pagination, protected R2 operations and audio seeking. Archive tests verify seven remaining songs and their exact lyrics/timing, retained metadata and audio bytes, GET/HEAD 404 without audio access, and malformed archive rejection.
