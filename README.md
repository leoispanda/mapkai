# MapKai

MapKai maps knowledge with AI into simple learning cards.

## Local development

```bash
npm start
```

Open:

```text
http://127.0.0.1:3000
```

## Email login

MapKai uses email codes for passwordless login. Configure these environment variables before deploying:

```bash
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM="MapKai <your_verified_sender@mapkai.com>"
```

## Deployment

Recommended stack:

- GitHub for source code
- Vercel for hosting and API routes/server
- Resend for email codes

