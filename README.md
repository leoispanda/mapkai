# MapKAI

MapKAI maps knowledge with AI into a living knowledge atlas.

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
```

Build settings in Cloudflare Pages:

- Framework preset: None
- Build command: leave empty
- Build output directory: `public`
