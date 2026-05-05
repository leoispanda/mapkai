import {
  createChallengeCookie,
  createCode,
  normalizeEmail,
  requireEmailConfig,
  sendJson,
  sendLoginEmail,
} from "./_shared.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed." });
    return;
  }

  if (!requireEmailConfig(response)) return;

  const { email } = request.body || {};
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) {
    sendJson(response, 400, { error: "Enter a valid email address." });
    return;
  }

  const code = createCode();
  await sendLoginEmail(cleanEmail, code);
  sendJson(response, 200, { ok: true }, { "Set-Cookie": createChallengeCookie(cleanEmail, code) });
}
