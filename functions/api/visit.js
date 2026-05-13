function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function cleanVisitorId(value) {
  const visitorId = String(value || "").trim();
  return /^[a-zA-Z0-9-]{12,80}$/.test(visitorId) ? visitorId : "";
}

export async function onRequestPost({ request, env }) {
  if (!env.MAPKAI_DB) {
    return json({ error: "Visitor database is not configured." }, 500);
  }

  const { visitorId } = await request.json().catch(() => ({}));
  const cleanId = cleanVisitorId(visitorId);
  if (!cleanId) {
    return json({ error: "Missing visitor id." }, 400);
  }

  await env.MAPKAI_DB.prepare(
    "CREATE TABLE IF NOT EXISTS visitors (visitor_id TEXT PRIMARY KEY, first_seen TEXT NOT NULL)",
  ).run();

  await env.MAPKAI_DB.prepare(
    "INSERT OR IGNORE INTO visitors (visitor_id, first_seen) VALUES (?, ?)",
  ).bind(cleanId, new Date().toISOString()).run();

  const count = await env.MAPKAI_DB.prepare(
    "SELECT COUNT(*) AS total FROM visitors",
  ).first();

  return json({
    ok: true,
    totalVisitors: Number(count?.total || 0),
  });
}

export function onRequest() {
  return json({ error: "Method not allowed." }, 405);
}
