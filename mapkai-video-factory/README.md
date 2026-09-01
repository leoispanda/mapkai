# MapKAI Video Factory

Current policy binding: **Creating v1.3 / Review v1.2**. See [canonical registry](policy/README.md) and the [sensitivity clarification audit](audits/creating-policy-v1.3-alignment-2026-08-31.md). Historical runs keep their actual prior versions.

The [raw-video delivery channel](DELIVERY.md) imports existing generations, verifies their exact submission audit and uploads to a private MapKAI review library. It never generates or publishes video. Current Major Fields status is available in `runtime/major-fields/latest-dashboard.html`; the original batch ledger is preserved, with explicit continuation records for the two former taxonomy-only holds.

The factory turns MapKAI's formal-field taxonomy into full editorial knowledge packs, then maintains a resumable video-production manifest. Approved fables are optional narrative inspiration; they never determine the Knowledge Spine.

It deliberately uses a connected local Chrome session instead of the Gemini API. No Google credential is saved in this repository.

## First-time setup

```bash
npm install
npm run video:bootstrap
npm run video:plan -- --fields=0533,0311,0313
open mapkai-video-factory/dashboard.html
```

`bootstrap` exports the 80 existing named MapKAI formal fields from `script.js` and produces, for each field:

- `overview.md` — 2,500–4,000 word editorial knowledge pack.
- `narrative_blueprint.md` — the field's intellectual dramaturgy and selected narrative engine.
- `video_prompt.md` — a compiled prompt combining the master creative direction, field blueprint, and coverage requirements.
- `content_validation.json` — deterministic preflight plus an explicit hold for independent semantic review. Any historical QA scores are marked `LEGACY_NON_AUTHORITATIVE`.

Every new formal run is bound to the canonical Creating Policy v1.2 and Review Policy v1.1 hashes in `factory-config.json`. Historical run records retain the policy versions recorded when they were created. Run records are written under `runtime/run-records/`; package folders also expose `deterministic_validation.json`, `final_review_decision.json`, a field-representation interface, and an artifact-contract placeholder.

The global creative standard is [master_video_director.md](prompts/master_video_director.md). Existing generation state is preserved on later runs. The runner uses Node's built-in TypeScript support, so Node 22.6+ is required.

## Connect Chrome

Close Chrome completely, then open it with remote debugging enabled and your normal signed-in profile. On macOS:

```bash
open -na "Google Chrome" --args --remote-debugging-port=9222
```

Sign in to Gemini Notebook in that Chrome window if needed. The factory attaches to that existing local browser session; it never reads passwords, cookies, or profile files.

## Safe rehearsal, then real submission

The plan and submit commands are dry runs unless `--execute` is supplied. Start with the three pilot fields:

```bash
npm run video:plan -- --fields=0533,0311,0313
npm run video:submit -- --fields=0533,0311,0313 --limit=3 --execute
```

`submit` runs deterministic preflight before it ever connects to Gemini Notebook. Missing Knowledge Spine coverage becomes `CONTENT_INCOMPLETE`; missing narrative coverage becomes `NARRATIVE_INCOMPLETE`; missing evidence-bound independent review becomes `EDITORIAL_REVIEW_REQUIRED`/`SEMANTIC_REVIEW_REQUIRED`; sensitive or uncertain content is held for review. Creator self-check scores never authorize submission. It stops before the configured daily allowance or active-generation limit.

## Monitoring and downloads

```bash
npm run video:check
```

This checks known notebook URLs, records failed/quota states, and downloads finished videos where Gemini Notebook exposes a visible download action. A completed download becomes `VIDEO_DOWNLOADED`, not published.

## Branding pipeline

```bash
npm run video:brand
```

The post-download state flow is `VIDEO_DOWNLOADED → BRANDING → READY_TO_PUBLISH`. The current pipeline deliberately stops in `BRANDING` until an approved logo is supplied in `factory-config.json` as `branding.logoPath`; it never invents a substitute logo. The reserved outro is: intellectual conclusion → fade out → MapKAI logo and `Explore the map of human knowledge.` for 2–3 seconds → fade out.

The static dashboard is rebuilt after every command at `mapkai-video-factory/dashboard.html`.

## Autonomous editorial factory (v5)

The additive autonomous system lives in `autonomous/factory.mjs` and uses the existing taxonomy as its only field source. Its framework is `v5-autonomous-emergent-lens` / `autonomous-emergent-lens-1.0`. The old `video-manifest.json`, legacy packs, and completed pilot notebooks are not rewritten.

Run a local, non-submitting package preview:

```bash
npm run video:factory:seed-preview
npm run video:factory:test
npm run video:factory:plan
```

This creates the General Overview plus Economics, Physics, Psychology, Statistics, and Law under `packs/v5-autonomous-emergent-lens/`. The preview is explicitly marked `EDITORIAL_PROVIDER_UNAVAILABLE`; it is useful for inspecting the structure, but it cannot submit a video.

For production editorial work, MapKAI now prefers the built-in `chatgpt-browser` channel over an API. It reuses the visible, signed-in ChatGPT session and creates one durable conversation per field—such as `MapKAI Editorial — General Overview` or `MapKAI Editorial — Economics`. It never reads passwords, exports cookies, saves credentials, or handles CAPTCHA/2FA. If the session is unavailable, the field becomes `CHATGPT_LOGIN_REQUIRED` or `SECURITY_PAUSED` rather than falling back to made-up copy.

The conversation policy is intentionally stateful: one field maps to one persistent ChatGPT thread. Explore, Challenge, Select, Develop, Critique, Repair, Finalize, and Knowledge Guidance continue in that same thread; a completed stage is reused from its audit record after restart and is never sent again accidentally. A new thread is only created lazily for a genuinely new field, an unrecoverable thread, an explicitly independent review, or an explicit fresh-conversation request. If the registry is missing but an audit attempt still contains a conversation ID, the provider recovers that ID before it ever considers opening a new thread. The saved `conversationId` is used to open the known URL directly—there is no sidebar scan or conversation-list search on each stage.

Requests are serialized and throttled. After a response is stable and its raw text is saved, the provider waits the configured gap (`CHATGPT_BROWSER_MIN_REQUEST_INTERVAL_MS`, default 30 seconds) before the next send; health checks are cached for five minutes. Historical `Too many requests` text retained in a conversation is informational only. After a persisted cooldown expires, the first real pending editorial request is the recovery probe: a newly inserted or newly changed rate-limit element tied to that request (with request timestamp, message IDs, and DOM-mutation evidence) starts a new exponential cooldown (5, 10, then 20 minutes, or longer when the page explicitly requires it). A normal response clears the channel and marks it recovered. No refresh, meaningless test message, or duplicate completed stage is sent. If an old in-flight record lacks a request hash, the provider marks it `CHATGPT_STAGE_INDETERMINATE` and refuses to guess or resend.

The channel is deliberately conversational: it explores, challenges, selects, develops, and self-reviews a field in natural language. JSON/schema output is requested only when the factory needs a final guidance, critique, knowledge-pack, or review artifact. The full natural-language transcript and final structured artifacts are retained under `runtime/chatgpt-browser/audit/` and the field package.

`chatgpt-browser` is the default editorial channel (you may set `EDITORIAL_PROVIDER=chatgpt-browser` explicitly if you prefer), then use:

```bash
npm run video:factory:editorial -- --general-overview --fields=0311
```

The initial production scope is intentionally limited to General Overview and Economics. Both stop at the creator-output/independent-review boundary (`SEMANTIC_REVIEW_REQUIRED`, with human tone review where applicable); inspect the packs and their dedicated ChatGPT conversations before any downstream approval:

```bash
npm run video:factory -- --approve-editorial-tone
```

Only after that approval can Physics, Psychology, Statistics, and Law begin editorial work. NotebookLM remains a separate, explicit downstream action: `npm run video:factory:execute` is the bounded phase-one submission command and will stop safely on missing browser access, security challenges, quota limits, or failed editorial gates.

The autonomous dashboard is `autonomous-dashboard.html`. It keeps human scores and decisions blank and never brands or publishes a video. Downloaded videos, transcripts, metadata, review JSON, and diagnoses belong under `review/` and the versioned package directory.
