CREATE TABLE IF NOT EXISTS pdc_access_passes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pass_code TEXT UNIQUE NOT NULL,
  batch_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unused',
  allowed_uses INTEGER NOT NULL DEFAULT 1,
  used_count INTEGER NOT NULL DEFAULT 0,
  pdc_type TEXT NOT NULL DEFAULT 'both',
  mode_id TEXT,
  template_id TEXT,
  roster_id TEXT,
  persona_ids TEXT,
  allowed_modes TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT,
  started_at TEXT,
  used_at TEXT,
  last_error TEXT,
  input_char_count INTEGER
);

CREATE TABLE IF NOT EXISTS pdc_feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pass_code TEXT NOT NULL,
  pdc_type TEXT,
  mode_id TEXT,
  clarity_rating TEXT,
  most_useful_part TEXT,
  would_use_again TEXT,
  short_feedback TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
