# MapKAI

MapKAI maps knowledge with AI into a living knowledge atlas.

Question-bank authoring and revisions follow [MapKAI Question Bank Principles](docs/mapkai-question-bank-principles.zh.md).
For GPT generation, provide those principles together with the [existing Map question reference](MAPKAI_QUESTION_BANK_FOR_GPT.txt); its old items are deduplication material, not approved writing examples. Explore's 20 preference questions use the separate rules in the principles document.
The [complete bilingual v2 candidate bank](question-banks/v2-2026-10-03/README.zh.md) contains the revised Explore 20 and Map 132, with blueprints and review records. It is editorially reviewed and awaiting user trials and website integration. Include it when deduplicating future candidates.


## Local Development

```bash
node server.js
```

Open:

```text
http://127.0.0.1:3000
```

When `RESEND_API_KEY` is not set locally, the server returns a temporary dev code in the browser so you can test the login flow without sending email.

## Cloudflare Deployment

MapKAI is set up for Cloudflare Pages:

- Static site output: `public`
- Pages Functions: `functions/api/auth/start.js` and `functions/api/auth/verify.js`
- Config: `wrangler.toml`

Set these Cloudflare Pages environment variables:

```bash
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM="MapKAI <your_verified_sender@mapkai.com>"
AUTH_SECRET=generate_a_long_random_secret
MAPKAI_FOUNDER_ACCESS_CODE=generate_a_private_founder_code
MAPKAI_PDC_SESSION_SECRET=generate_a_long_random_secret
```

Build settings in Cloudflare Pages:

- Framework preset: None
- Build command: leave empty
- Build output directory: `public`

## Publishing without regressions

The current production website and its editable sources are synchronized to the approved v0.1.291 release. Follow the [deployment policy](docs/mapkai-deployment-policy.md) before publishing; a newer direct-upload production release must be synchronized into Git before a website push.

Question-bank candidates and documentation-only pushes now skip the Cloudflare website build. The canonical bilingual framework story inputs are in `content/framework-stories/`; `npm run build` works without raw review directories. See the [restoration evidence](docs/releases/mapkai-restoration-2026-10-04.json).
