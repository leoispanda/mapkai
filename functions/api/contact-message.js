function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function isValidEmail(value) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
    // Column already exists.
  }
}

export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed." }, 405);
  }

  if (!env.MAPKAI_DB) {
    return json({ ok: false, error: "Message database is not configured." }, 500);
  }

  const body = await request.json().catch(() => ({}));
  const name = cleanText(body.name, 120);
  const email = cleanText(body.email, 180);
  const message = cleanText(body.message, 2000);
  const pagePath = cleanText(body.page_path, 240);
  const language = cleanText(body.language, 24);

  if (!message) return json({ ok: false, error: "Message is required." }, 400);
  if (!isValidEmail(email)) return json({ ok: false, error: "Invalid email." }, 400);

  await ensureContactMessagesTable(env.MAPKAI_DB);
  await env.MAPKAI_DB.prepare(
    `INSERT INTO contact_messages (name, email, message, page_path, language, created_at, status, is_read, is_important, founder_note, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'new', 0, 0, '', ?)`,
  ).bind(name, email, message, pagePath, language, new Date().toISOString(), new Date().toISOString()).run();

  return json({ ok: true });
}
