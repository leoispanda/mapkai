# Raw video delivery to MapKAI

This channel downloads/imports **existing** generations and uploads them to a private MapKAI library. A separately allowlisted projection can place those exact files on their existing Field pages as clearly labelled experimental learning previews. It does not create a NotebookLM generation, apply branding, make a semantic quality decision, or mark content formally published.

## State boundary

`GENERATING → VIDEO_READY → VIDEO_DOWNLOADED → HUMAN_REVIEW_PENDING`

The delivery status `UPLOADED_FOR_HUMAN_REVIEW` is independent of the public-preview projection and formal publication. The private library is at `https://www.mapkai.com/factory-review.html`, using the existing MapKAI founder sign-in cookie. The R2 bucket `mapkai-video-review` has no public domain or public-development endpoint enabled by this channel; public pages stream only catalogued objects through Pages Functions.

## Import a browser download

Use the existing NotebookLM notebook and video card; never click Generate during monitoring or download recovery. A browser-managed download may save to Downloads without a same-tab download event. Inspect the destination before clicking again. Two generated videos can have the same title: correlate notebook URL, click timestamp, actual destination file and attempt ID, not just the filename.

Create an intake file with `items`, each including:

- `fieldId`, `notebookUrl`, `submissionPath` for the **actual** generation;
- `sourcePath` for the received raw MP4;
- `observedReadyAt`, `title`, and optionally measured `metadata.duration/width/height` with a provenance note.

Run `npm run video:delivery:import -- --intake <path>`.

Intake verifies the original submitted source hashes, historical policy hashes, independent source-review binding, MP4 top-level box integrity and raw SHA-256. Copying never overwrites different bytes. Repeating intake for the same attempt and hash reuses the existing receipt. `fieldCode` and relative `submittedSourceFiles` historical formats are normalized only in memory; original payloads stay unchanged.

Each attempt gains an immutable `raw_video_delivery_receipt.json`. Existing `raw_video_receipt.json`, `submission_payload.json`, historical policy versions and run records are not rewritten. Unknown backend completion times remain UNKNOWN; a late readiness observation is not represented as exact generation duration.

The local current delivery catalog is `runtime/delivery/review-catalog.json`.

## Private upload

Run `npm run video:delivery:upload -- --execute --bucket mapkai-video-review --wrangler-path <absolute-path-to-wrangler.js>` using the existing authenticated Cloudflare CLI. No Google password, browser cookie or API token is saved in factory code.

Video keys include generation attempt and SHA-256. Existing remote objects are read and compared; conflicting bytes stop the channel. A new upload is read back in full and SHA-256 verified before its immutable upload receipt is recorded. Source documents and receipt are uploaded with that same attempt. Errors stop execution; an explicit resume safely reuses verified objects.

The catalog is published to the **private bucket** only after its listed objects are available. Catalog history snapshots are immutable; the current catalog pointer is mutable. No video bytes are stored in the static Pages build or Git.

## Public learning previews

`prepare-public-preview` derives a learner-safe public catalog from whichever canonical Major Field videos have been delivered into the private review catalog. The count is dynamic: it can grow from the current delivered subset to all canonical Major Fields without changing the public API. Every included item must match its canonical field identity and pass the review-preview eligibility checks. `upload-public-preview --execute` stores that catalog as a private, no-store R2 object; it does not change private receipts or review decisions.

The existing `/categories/<field>` pages resolve their natural-language field slug through `GET /api/factory/public-videos`. `GET/HEAD /api/factory/public-video?field=<slug>` accepts only an allowlisted slug, verifies the content-addressed object and receipt size, and streams single byte ranges for seeking. The response never exposes field/subject codes, hashes, object keys, source packs, notebook URLs or audit metadata. Every preview displays: “Video content under review · Not yet approved for formal publication” and the AI-generated-content disclosure. Public preview visibility does not change `HUMAN_REVIEW_PENDING`, `NOT_PUBLISHED` or `NOT_APPLIED` internal state.

## Review and access control

`GET /api/factory/videos`, `GET/HEAD /api/factory/video` and `GET /api/factory/source` all require the existing signed founder cookie. Video/source keys are resolved from the verified private catalog; caller-supplied arbitrary object paths are not accepted. Raw playback is streamed with single-byte-range support for seeking. Private responses have `no-store` and same-origin resource policy.

The page leaves ratings empty. Human review drafts are explicitly device-local and keyed by generation attempt + raw SHA-256. Export makes them portable. Selecting Accept/Regenerate is a **draft decision**, not an automated publication or quota-consuming action.

Local preview: set a local-only `MAPKAI_FOUNDER_ACCESS_CODE` and run `npm run video:delivery:preview`. It binds only to `127.0.0.1` and uses the same API/auth handlers, with a read-only local storage adapter.

Tests: `npm run video:delivery:test` and `npm run video:delivery:public-preview-test`. They cover historical preservation, byte conflicts, incompatible attempts, incomplete containers, authentication, source allowlists, public allowlists, learner-safe projections, 206/416 ranges and the no-publication boundary.

## Policy relationship

New production attempts bind the canonical registry in `policy/README.md` (Creating v1.3 / Review v1.2). Historical videos retain the versions actually used at submission. Delivery metadata must not retroactively upgrade those bindings.

Necessary, neutral educational coverage of religion or politics is not a blanket field hold. It still requires explicit independent necessity/neutrality/source assessment under the current Review Policy before a **new** submission can PASS. Download/upload is not that semantic review.
