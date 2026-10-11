# MapKAI Menu Reader · DishKAI

MapKAI-native menu tool at `/toolbox/dishkai/` and `/toolbox/dishkai/en/`. The Toolbox cards link to the matching language. It uses the site's navigation, light/dark themes and typography.

## Product behavior

- Live menu recognition is owner-only. The page checks its session before showing text/photo input. Visitors can follow a separate link to the fixed public DishKAI demo.
- Enter the existing DishKAI access password in the MapKAI form. The server verifies it through DishKAI; no password is embedded in source, browser storage or server configuration. Signing out clears this page's menu, photo and results.

- Paste up to 12,000 characters or upload a JPEG, PNG, WebP or GIF up to 8 MB.
- Choose Chinese, English or Dutch for the returned dish descriptions; the original language is detected by DishKAI.
- Results preserve the original menu order. Each row expands to show a reference image, description, estimated composition, taste, texture and watch-outs.
- Database references, universal guidance, unverified AI estimates and unmatched items have separate labels. Unknown dishes remain in their original position.
- No menu drafts, photos or results are stored by this MapKAI module. Requests go to DishKAI and its configured AI providers. DishKAI retains its existing policies, including its structured unmatched-dish backlog.

## Shared service

The interface calls these same-origin Pages Functions:

- `GET /api/dishkai/auth` — validate the current browser session
- `POST /api/dishkai/auth` — delegate the submitted password to DishKAI
- `DELETE /api/dishkai/auth` — clear this browser's menu session

- `POST /api/dishkai/analyze-menu-text`
- `POST /api/dishkai/analyze-menu-image`
- `GET /api/dishkai/image?path=/assets/dishes/...`

These use the fixed public upstream `https://dishkai.com`. They expose no administrative or database operations. Each browser receives its own upstream-signed session in a Secure, HttpOnly, SameSite=Strict cookie scoped to `/api/dishkai`. Only that token is relayed as `dishkai_session`; uploaded filenames, unrelated cookies, authorization and arbitrary extra fields are not forwarded. Every scan/image request validates the session before reading uploads or contacting analysis endpoints. Images are restricted to allowlisted dish asset paths and image content types. Requests and upstream responses are size-bounded, timed out and returned with predictable JSON errors. Auth, analysis and protected image responses are private and not cached. Unauthorized responses retain the explicit `PRIVATE_ACCESS_REQUIRED` status. Only explicit logout clears the cookie, so a delayed old failure cannot erase a fresh login.

Login uses the existing `MAPKAI_DB` binding for a persistent limit of five attempts per client per 15 minutes and fails closed if that binding is unavailable. This needs no additional AI key, stored service password or copied dish database in MapKAI. It depends on DishKAI availability and consumes the existing DishKAI service and quota. The upstream's rate limits remain in place. Before a high-traffic release, verify how the deployed Pages-to-Pages request is counted by the upstream and add an explicit shared rate-limit policy if needed. The local checks do not establish production per-visitor rate accounting.

No DishKAI source, private tools, database, settings or credentials were modified.

## Build and verify

`node scripts/build-toolbox.mjs` builds both languages into `public/toolbox/dishkai/` and updates the Toolbox cards. The regular public UI build already runs it. The asset version updater includes the new page. Production entry routes are in `public/_redirects`.

`node --test scripts/dishkai-adapter.test.mjs scripts/dishkai-auth.test.mjs` checks endpoint restrictions, body limits, origins, field filtering, uploads, upstream failures and image paths.

The local `server.js` maps all four adapters. Login requires D1; use `wrangler pages dev public` for the full local flow with isolated D1 storage. Start with `PORT=3092 node server.js` for the preview. Network access is needed for real recognition and images.

## Verification · 2026-09-26

- 12 adapter tests passed, including rejection of upstream redirects using the Cloudflare-supported `manual` mode.
- Real text scan: Boeuf Bourguignon, Pad Thai and Carbonara returned successfully in menu order.
- Real photo scan: a synthetic menu with Pad Thai and Carbonara returned successfully.
- Real dish thumbnails and detail images loaded through the MapKAI adapter.
- Browser checks passed for detail expansion, allergens, unknown and AI estimate labels, rate-limit recovery, invalid upload rejection and safe rendering of markup as text.
- Desktop, 390px mobile, English and dark theme checked; no page JavaScript errors.
- Published to `https://www.mapkai.com/toolbox/dishkai/` and `/toolbox/dishkai/en/` as v0.1.244 on 2026-09-26. Production deployment: `https://7a9ba039.mapkai.pages.dev`.
- The complete browser checks also passed against `www.mapkai.com`: real text and photo recognition, images, details, mobile layout, English, dark theme and error states. Receipt: `review/dishkai/production/browser-check.json`.

Screenshots and the browser check receipt are under `review/dishkai/`.

Deployment note: this active workspace has no Git metadata. Publication used the existing Cloudflare Pages `mapkai` project and its production branch `main`; no Git commit or Git push was made from the archived checkout.

## Private integration verification · 2026-10-11

- Root cause: DishKAI became owner-only; the old MapKAI public adapter had no session and hid the 401 as a temporary outage.
- 24 adapter/session checks pass, covering login, retained cookie, text/photo/images, CSRF, rate limits, malformed/forged/expired sessions, timeouts and delayed old responses. Functions compile and source/public mirrors match.
- Real local Pages-runtime checks passed for owner login, three-dish text recognition, two-dish synthetic menu photo recognition, protected images/detail cards, wrong-password rejection and logout clearing. Chinese, English and 390 px mobile layouts checked.
- The password remains solely with the existing DishKAI authentication service. No DishKAI source, credentials or access settings changed.
