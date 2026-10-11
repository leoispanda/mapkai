# MapKAI Music storage and access

MapKAI Music hosts uploaded English, Dutch and Chinese ElevenLabs songs; it does not generate songs or call the ElevenLabs API. The public page can list and play published tracks in any supported language. Publishing an upload requires the existing server-verified founder session. Song language is declared by the owner at upload; the service does not automatically detect lyrics or verify their language. The owner upload form is for verified ElevenLabs music: new uploads store `aiGenerated: true` and `generationProvider: "ElevenLabs"`, which the public catalog preserves as provenance; the visible card label states AI generation without provider branding. The service does not independently detect or verify the generation provider from audio bytes.

## Existing production prerequisites

- `MAPKAI_REVIEW_MEDIA`: private R2 bucket binding, also used by the existing video review service. Music uses only the separate `music/` namespace.
- `CLOUDFLARE_COST_DB`: the existing shared Cloudflare cost guard D1 binding. Every music R2 LIST, GET, HEAD and PUT reserves its allowance before accessing the bucket.
- `MAPKAI_FOUNDER_ACCESS_CODE`: existing server secret. Music reuses the signed, HttpOnly founder cookie; the frontend receives no secret or bearer token.
- `MAPKAI_DB`: existing application D1 binding, used for owner sign-in attempt limits. Owner login fails closed if this binding is missing.

No new public bucket access, API key, paid provider call or binding is required. The production environment must contain all these existing bindings; preview environments without the shared cost database cannot upload or read songs.

## Song creation entry

The Music page's bilingual Create a song dialog prepares a prompt locally from the title, theme, language, style, 1- or 2-minute duration, and optional original lyrics. It validates the result against the provider's 4,100-character prompt limit. It does not send draft text to MapKAI or generate audio itself. Copying uses the clipboard with a selectable-text fallback; an explicit external link opens the existing music creator at `https://elevenlabs.io/app/music/history` without embedding draft text in its URL. The page names that destination and explains account-credit use before the user leaves. After generating and downloading a song in their own account, the owner can return to the existing authenticated upload studio.

No music-generation API key is configured in MapKAI. This entry is a prompt-preparation and external-account workflow, not an in-site automatic generation connection. Public listening and owner upload controls retain their existing access rules. Draft text stays in the current page and is cleared on reload; only the existing interface-language preference is persisted.

The default creation direction is upbeat Memphis hip-hop with clear vocals and light guitar accents, following the owner's stated preference. Rock, symphonic, folk rap and acoustic remain available; the rock prompt calls for melodic vocals and moderate guitars. The two-minute Memphis Groove preview is featured before the existing Dutch Horizons versions; the earlier rock experiment retains its audio and ID but is no longer featured.

## Endpoints

- `GET /api/music/auth`: `{ owner, uploadConfigured }`. Checks the current founder cookie and binding availability without accessing R2.
- `POST /api/music/auth`: JSON `{ code }`. Uses the existing founder access code, with five attempts per client IP per 15 minutes. Success sets the signed founder cookie and returns `{ owner: true, uploadConfigured }`.
- `GET /api/music/tracks[?cursor=...]`: `{ tracks, nextCursor }`, with up to 50 tracks per page. Each public track contains `id`, `title`, `description`, `language` (`en`, `nl` or `zh`), `aiGenerated`, `generationProvider`, `url`, `durationSeconds` (initially null), `createdAt` and `filename`. Stored metadata in any other language, or without a language declaration, is excluded from public list and playback.
- `POST /api/music/tracks`: multipart `file`, `title`, `description`, `language=en`, `language=nl` or `language=zh`. Other language values or a missing declaration are rejected. Requires the valid owner cookie and the same-origin `Origin` header. The server sets the AI disclosure fields; multipart fields that attempt to override them are rejected. Success returns HTTP 201 `{ track }`; the uploaded song becomes public.
- `GET|HEAD /api/music/audio?id=...`: published audio only. Supports single byte ranges, HEAD and ETag validators for playback and seeking. Internal bucket keys cannot be requested.

Audio files are limited to 25 MiB and MP3, M4A or WAV. Extension, declared MIME type and actual format structure are validated. MP3 requires two complete, consistent MPEG frames. Conventional M4A requires an audio codec, sample tables, timed samples and complete media data, and rejects video handlers; fragmented M4A containers are not supported. WAV requires audio format and nonempty data chunks. Validation checks the container structure and does not decode every sample. Titles are limited to 120 characters and descriptions to 1,000. The actual request stream is bounded, including requests without Content-Length.

## Durable publication

Each upload receives a fresh UUID. Audio is written to `music/audio/{id}.{extension}`, then its complete metadata is written to `music/tracks/{id}.json`. Both writes are conditional creates. The metadata write is the publication point, so simultaneous uploads cannot overwrite a shared catalog and an incomplete audio upload cannot become public.

If metadata publication fails after the audio is saved, the audio remains unlisted and inaccessible through public playback. It can be inspected by the owner during a later storage audit. The API does not delete files or refund the shared conservative storage reservation.

Public JSON responses are uncached so new uploads appear immediately. Successful audio responses use immutable URLs and allow browser caching. Existing video catalogs and review records remain separate.

Existing track metadata without both AI disclosure fields remains playable during rollout. Its public disclosure values are `null`, indicating unknown provenance, and the frontend must not infer an AI label from its title or language. The four verified initial imports can be updated with the explicit `true` / `"ElevenLabs"` pair while retaining their IDs and audio objects. Metadata containing partial disclosure, a non-boolean AI flag, a false flag or a provider other than `"ElevenLabs"` fails validation; this module currently supports only declared ElevenLabs generation or unknown legacy provenance.

## AI disclosure review (2026-10-11)

Verified ElevenLabs tracks display a permanent `AI-generated` label on each card before playback, translated for the Chinese interface and associated with the play button for assistive technology. A page notice explains AI creation. Original audio bytes and existing embedded metadata are preserved.

The owner confirms these songs were self-generated on a paid subscription. The current [Music Terms](https://elevenlabs.io/music-terms), Exhibit A, list no attribution requirement for paid plans. The UI therefore uses MapKAI branding across the Music page, song cards, Toolbox, About and AI Transparency. Internal/provider metadata and existing audio markings are preserved. Supplier attribution is distinct from AI disclosure and does not establish copyright ownership or unrestricted redistribution rights. MapKAI currently hosts listening to the owner’s songs; it does not offer a stock-music licensing library or access to a generation model. Streaming distribution and other uses still depend on the applicable plan and agreement.

The current [AI Act Article 50](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02024R1689-20260727) requires deployer disclosure for audio that constitutes a deepfake; it does not classify every synthetic song as a deepfake. Artistic works permit disclosure that preserves enjoyment. Applicable notices must be clear, accessible and present by first exposure. The [Commission FAQ](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act) confirms that hidden machine-readable markings alone do not provide audience disclosure. Our visible card text implements those principles; this is an implementation assessment, not certification of all legal requirements or music rights.

Article 50 applies from 2 August 2026. The adopted [2026/1744 amendment](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32026R1744) grants providers of qualifying pre-existing generation systems until 2 December 2026 for Article 50(2) machine-readable marking. It does not postpone deployer disclosure. Hosting previously generated audio does not itself turn this module into a music-generation-system provider.

## Verification

Run `node --test scripts/music-api.test.mjs` with Node 22 or newer. Tests cover signed-cookie authorization, sign-in attempt limits, cross-origin rejection, declared English, Dutch and Chinese publication/playback, AI disclosure persistence and legacy compatibility, unsupported-language exclusion, file validation, durable upload ordering, simultaneous uploads, failed publication, pagination, protected R2 operations and audio seeking.
