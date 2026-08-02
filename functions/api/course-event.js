const allowedEvents = new Set([
  "homepage_explore_clicked",
  "homepage_finance_clicked",
  "finance_course_viewed",
  "finance_day_started",
  "finance_day_completed",
  "finance_course_completed",
  "finance_content_shared",
  "pdc_clicked_after_course",
]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8" } });
}

export async function onRequestPost({ request, env }) {
  const payload = await request.json().catch(() => ({}));
  const event = String(payload.event || "");
  const day = Number(payload.day || 0);
  const language = payload.language === "zh" ? "zh" : "en";
  const channel = ["copy", "linkedin", "x", "whatsapp"].includes(payload.channel) ? payload.channel : "";

  if (!allowedEvents.has(event) || (day && (day < 1 || day > 5))) return json({ error: "Invalid course event." }, 400);
  if (!env.MAPKAI_DB) return json({ ok: true, stored: false }, 202);

  const eventDate = new Date().toISOString().slice(0, 10);
  await env.MAPKAI_DB.prepare(
    `INSERT INTO course_event_counts (event_date, event_name, course_day, language, channel, event_count)
     VALUES (?, ?, ?, ?, ?, 1)
     ON CONFLICT(event_date, event_name, course_day, language, channel)
     DO UPDATE SET event_count = event_count + 1`,
  ).bind(eventDate, event, day || 0, language, channel).run();

  return json({ ok: true, stored: true });
}

export function onRequest() {
  return json({ error: "Method not allowed." }, 405);
}
