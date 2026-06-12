import { hasFounderApiAccess } from "./pdc/_shared.js";

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
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'new',
      is_read INTEGER DEFAULT 0,
      is_important INTEGER DEFAULT 0,
      founder_note TEXT,
      updated_at TEXT
    )`,
  ).run();
  await ensureColumn(database, "status", "TEXT DEFAULT 'new'");
  await ensureColumn(database, "is_read", "INTEGER DEFAULT 0");
  await ensureColumn(database, "is_important", "INTEGER DEFAULT 0");
  await ensureColumn(database, "founder_note", "TEXT");
  await ensureColumn(database, "updated_at", "TEXT");
}

async function ensureColumn(database, name, definition) {
  try {
    await database.prepare(`ALTER TABLE contact_messages ADD COLUMN ${name} ${definition}`).run();
  } catch {
    // D1 throws if the column already exists; that is the desired steady state.
  }
}

function cleanStatus(value) {
  const allowed = new Set(["new", "reviewed", "replied", "archived"]);
  const status = String(value || "new").trim().toLowerCase();
  return allowed.has(status) ? status : "new";
}

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

export async function onRequest({ request, env }) {
  if (!["GET", "PATCH"].includes(request.method)) {
    return json({ ok: false, error: "Method not allowed." }, 405);
  }

  if (!(await hasFounderApiAccess(request, env))) {
    return json({ ok: false, error: "Founder mode required." }, 403);
  }

  if (!env.MAPKAI_DB) {
    return json({ ok: true, messages: [], warning: "Message database is not configured." });
  }

  await ensureContactMessagesTable(env.MAPKAI_DB);
  if (request.method === "PATCH") {
    const body = await request.json().catch(() => ({}));
    const id = Number(body.id || 0);
    if (!id) return json({ ok: false, error: "Message id is required." }, 400);
    await env.MAPKAI_DB.prepare(
      `UPDATE contact_messages
       SET status = ?, is_read = ?, is_important = ?, founder_note = ?, updated_at = ?
       WHERE id = ?`,
    ).bind(
      cleanStatus(body.status),
      1,
      body.is_important ? 1 : 0,
      cleanText(body.founder_note, 2000),
      new Date().toISOString(),
      id,
    ).run();
    return json({ ok: true });
  }

  const result = await env.MAPKAI_DB.prepare(
    `SELECT id, name, email, message, page_path, language, created_at, status, is_read, is_important, founder_note, updated_at
     FROM contact_messages
     ORDER BY created_at DESC, id DESC
     LIMIT 100`,
  ).all();

  return json({ ok: true, messages: result.results || [] });
}
