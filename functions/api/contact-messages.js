function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

async function ensureContactMessagesTable(database) {
  await database.prepare(
    `CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      message TEXT NOT NULL,
      page_path TEXT,
      language TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
  ).run();
}

export async function onRequest({ request, env }) {
  if (request.method !== "GET") {
    return json({ ok: false, error: "Method not allowed." }, 405);
  }

  if (!env.MAPKAI_DB) {
    return json({ ok: false, error: "Message database is not configured." }, 500);
  }

  if (request.headers.get("X-MapKAI-Founder") !== "true") {
    return json({ ok: false, error: "Founder mode required." }, 403);
  }

  await ensureContactMessagesTable(env.MAPKAI_DB);
  const result = await env.MAPKAI_DB.prepare(
    `SELECT id, name, email, message, page_path, language, created_at
     FROM contact_messages
     ORDER BY created_at DESC, id DESC
     LIMIT 100`,
  ).all();

  return json({ ok: true, messages: result.results || [] });
}
