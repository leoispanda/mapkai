import {
  createFounderAccessCookie,
  createPdcSessionCookie,
  ensurePdcTables,
  getPass,
  hasValidFounderAccessCookie,
  INVALID_PDC_LINK_MESSAGE,
  isFounderAccessCode,
  isPassUsable,
  json,
} from "./_shared.js";
import { pdcModes } from "./pdc-service.js";

export async function onRequest({ request, env }) {
  if (!["GET", "POST"].includes(request.method)) return json({ ok: false, error: "Method not allowed." }, 405);

  const url = new URL(request.url);
  if (request.method === "GET" && url.searchParams.get("founderPreview") === "1") {
    const validFounderAccess = await hasValidFounderAccessCookie(request, env);
    return json({
      ok: true,
      valid: validFounderAccess,
      founder_preview: validFounderAccess,
      ...(validFounderAccess ? {} : { message: INVALID_PDC_LINK_MESSAGE }),
    });
  }
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405);

  const body = await request.json().catch(() => ({}));
  const passCode = String(body.pass || "").trim();

  if (request.method === "POST" && isFounderAccessCode(env, passCode)) {
    const founderCookie = await createFounderAccessCookie(env, request);
    return json(
      { ok: true, valid: true, founder_preview: true },
      200,
      founderCookie ? { "Set-Cookie": founderCookie } : {},
    );
  }

  if (!env.MAPKAI_DB) return json({ ok: false, valid: false, message: INVALID_PDC_LINK_MESSAGE }, 200);

  await ensurePdcTables(env.MAPKAI_DB);
  const pass = passCode ? await getPass(env.MAPKAI_DB, passCode) : null;

  if (!isPassUsable(pass)) {
    if (pass?.expires_at && new Date(pass.expires_at).getTime() < Date.now() && pass.status !== "expired") {
      await env.MAPKAI_DB.prepare(
        `UPDATE pdc_access_passes SET status = 'expired' WHERE pass_code = ? AND status != 'used'`,
      ).bind(passCode).run();
    }
    return json({ ok: true, valid: false, message: INVALID_PDC_LINK_MESSAGE });
  }

  const allowedModes = pass.allowed_modes ? pass.allowed_modes.split(",").map((mode) => mode.trim()).filter(Boolean) : ["personal", "company"];
  const sessionCookie = await createPdcSessionCookie(env, request, pass.pass_code);
  if (!sessionCookie) {
    return json({ ok: false, valid: false, message: "PDC session is not configured." }, 500);
  }
  return json(
    {
      ok: true,
      valid: true,
      pass: {
        pdc_type: pass.pdc_type,
        allowed_modes: allowedModes,
        modes: allowedModes.map((modeId) => pdcModes[modeId]).filter(Boolean),
      },
    },
    200,
    { "Set-Cookie": sessionCookie },
  );
}
