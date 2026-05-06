import { clearChallengeCookie, json, normalizeEmail, readChallenge } from "./_shared.js";

export async function onRequestPost({ request, env }) {
  const { email, code } = await request.json().catch(() => ({}));
  const cleanEmail = normalizeEmail(email);
  const cleanCode = String(code || "").replace(/\D/g, "");
  const challenge = await readChallenge(env, request);

  if (!challenge || challenge.expiresAt < Date.now()) {
    return json(
      { error: "This code expired. Request a new one." },
      400,
      { "Set-Cookie": clearChallengeCookie() },
    );
  }

  if (challenge.email !== cleanEmail || challenge.code !== cleanCode) {
    return json({ error: "That code is not correct." }, 400);
  }

  return json(
    { ok: true, email: cleanEmail },
    200,
    { "Set-Cookie": clearChallengeCookie() },
  );
}

export function onRequest() {
  return json({ error: "Method not allowed." }, 405);
}
