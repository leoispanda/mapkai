import { cleanText, ensurePdcTables, getPass, json } from "./_shared.js";

const clarityOptions = new Set(["Yes", "Somewhat", "No"]);
const usefulOptions = new Set(["Council Highlights", "Debate Snapshot", "Final Recommendation", "Next Actions", "What Not To Do", "Other"]);
const againOptions = new Set(["Yes", "Maybe", "No"]);

export async function onRequest({ request, env }) {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405);
  if (!env.MAPKAI_DB) return json({ ok: false, error: "PDC database is not configured." }, 500);

  await ensurePdcTables(env.MAPKAI_DB);
  const body = await request.json().catch(() => ({}));
  const passCode = cleanText(body.pass, 80);
  const pass = passCode ? await getPass(env.MAPKAI_DB, passCode) : null;
  if (!pass || pass.status !== "used") return json({ ok: false, error: "Feedback is available after a completed PDC experience." }, 403);

  const pdcType = ["personal", "company"].includes(body.pdc_type) ? body.pdc_type : pass.mode_id || "";
  const clarityRating = clarityOptions.has(body.clarity_rating) ? body.clarity_rating : "";
  const mostUsefulPart = usefulOptions.has(body.most_useful_part) ? body.most_useful_part : "";
  const wouldUseAgain = againOptions.has(body.would_use_again) ? body.would_use_again : "";
  const shortFeedback = cleanText(body.short_feedback, 300);

  await env.MAPKAI_DB.prepare(
    `INSERT INTO pdc_feedback
      (pass_code, pdc_type, mode_id, clarity_rating, most_useful_part, would_use_again, short_feedback, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(passCode, pdcType, pass.mode_id || pdcType, clarityRating, mostUsefulPart, wouldUseAgain, shortFeedback, new Date().toISOString()).run();

  return json({ ok: true });
}
