CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  message TEXT NOT NULL,
  page_path TEXT,
  language TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
