import { clearChallengeCookie, normalizeEmail, readChallenge, sendJson } from "./_shared.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed." });
    return;
  }

  const { email, code } = request.body || {};
  const cleanEmail = normalizeEmail(email);
  const cleanCode = String(code || "").replace(/\D/g, "");
  const challenge = readChallenge(request);

  if (!challenge || challenge.expiresAt < Date.now()) {
    sendJson(response, 400, { error: "This code expired. Request a new one." }, { "Set-Cookie": clearChallengeCookie() });
    return;
  }

  if (challenge.email !== cleanEmail || challenge.code !== cleanCode) {
    sendJson(response, 400, { error: "That code is not correct." });
    return;
  }

  sendJson(
    response,
    200,
    { ok: true, email: cleanEmail },
    { "Set-Cookie": clearChallengeCookie() },
  );
}
