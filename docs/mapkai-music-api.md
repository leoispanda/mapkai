# MapKAI Music storage and access

MapKAI Music hosts uploaded English ElevenLabs songs; it does not generate songs or call the ElevenLabs API. The public page can list and play published English tracks. Publishing an upload requires the existing server-verified founder session. Song language is declared by the owner at upload; the service does not automatically detect lyrics or verify their language.

## Existing production prerequisites

- `MAPKAI_REVIEW_MEDIA`: private R2 bucket binding, also used by the existing video review service. Music uses only the separate `music/` namespace.
- `CLOUDFLARE_COST_DB`: the existing shared Cloudflare cost guard D1 binding. Every music R2 LIST, GET, HEAD and PUT reserves its allowance before accessing the bucket.
- `MAPKAI_FOUNDER_ACCESS_CODE`: existing server secret. Music reuses the signed, HttpOnly founder cookie; the frontend receives no secret or bearer token.
- `MAPKAI_DB`: existing application D1 binding, used for owner sign-in attempt limits. Owner login fails closed if this binding is missing.

No new public bucket access, API key, paid provider call or binding is required. The production environment must contain all these existing bindings; preview environments without the shared cost database cannot upload or read songs.

## Endpoints

- `GET /api/music/auth`: `{ owner, uploadConfigured }`. Checks the current founder cookie and binding availability without accessing R2.
- `POST /api/music/auth`: JSON `{ code }`. Uses the existing founder access code, with five attempts per client IP per 15 minutes. Success sets the signed founder cookie and returns `{ owner: true, uploadConfigured }`.
- `GET /api/music/tracks[?cursor=...]`: `{ tracks, nextCursor }`, with up to 50 tracks per page. Each public track contains `id`, `title`, `description`, `language` (always `en`), `url`, `durationSeconds` (initially null), `createdAt` and `filename`. Stored metadata in any other language is excluded from public list and playback.
- `POST /api/music/tracks`: multipart `file`, `title`, `description`, `language=en`. Other language values or a missing declaration are rejected. Requires the valid owner cookie and the same-origin `Origin` header. Success returns HTTP 201 `{ track }`; the uploaded song becomes public.
- `GET|HEAD /api/music/audio?id=...`: published audio only. Supports single byte ranges, HEAD and ETag validators for playback and seeking. Internal bucket keys cannot be requested.

Audio files are limited to 25 MiB and MP3, M4A or WAV. Extension, declared MIME type and actual format structure are validated. MP3 requires two complete, consistent MPEG frames. Conventional M4A requires an audio codec, sample tables, timed samples and complete media data, and rejects video handlers; fragmented M4A containers are not supported. WAV requires audio format and nonempty data chunks. Validation checks the container structure and does not decode every sample. Titles are limited to 120 characters and descriptions to 1,000. The actual request stream is bounded, including requests without Content-Length.

## Durable publication

Each upload receives a fresh UUID. Audio is written to `music/audio/{id}.{extension}`, then its complete metadata is written to `music/tracks/{id}.json`. Both writes are conditional creates. The metadata write is the publication point, so simultaneous uploads cannot overwrite a shared catalog and an incomplete audio upload cannot become public.

If metadata publication fails after the audio is saved, the audio remains unlisted and inaccessible through public playback. It can be inspected by the owner during a later storage audit. The API does not delete files or refund the shared conservative storage reservation.

Public JSON responses are uncached so new uploads appear immediately. Successful audio responses use immutable URLs and allow browser caching. Existing video catalogs and review records remain separate.

## Verification

Run `node --test scripts/music-api.test.mjs` with Node 22 or newer. Tests cover signed-cookie authorization, sign-in attempt limits, cross-origin rejection, file validation, durable upload ordering, simultaneous uploads, failed publication, pagination, protected R2 operations and audio seeking.
