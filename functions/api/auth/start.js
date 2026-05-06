import {
  createChallengeCookie,
  createCode,
  json,
  normalizeEmail,
  requireEmailConfig,
  sendLoginEmail,
} from "./_shared.js";

export async function onRequestPost({ request, env }) {
  if (!requireEmailConfig(env)) {
    return json(
      {
        error:
          "Email login is not configured yet. Set RESEND_API_KEY, EMAIL_FROM, and AUTH_SECRET in Cloudflare.",
      },
      500,
    );
  }

  const { email } = await request.json().catch(() => ({}));
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) {
    return json({ error: "Enter a valid email address." }, 400);
  }

  const code = createCode();
  await sendLoginEmail(env, cleanEmail, code);

  return json(
    { ok: true },
    200,
    { "Set-Cookie": await createChallengeCookie(env, cleanEmail, code) },
  );
}

export function onRequest() {
  return json({ error: "Method not allowed." }, 405);
}
