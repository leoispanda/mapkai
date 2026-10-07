-- Run once against the same D1 database bound to every protected gateway.
-- The first atomic reservation creates the shared row with a 3 GiB baseline.
CREATE TABLE IF NOT EXISTS cloudflare_cost_guard (
  guard_key TEXT PRIMARY KEY NOT NULL,
  cycle_start TEXT NOT NULL,
  class_a_used INTEGER NOT NULL CHECK (class_a_used >= 0),
  class_b_used INTEGER NOT NULL CHECK (class_b_used >= 0),
  upload_bytes_used INTEGER NOT NULL CHECK (upload_bytes_used >= 0),
  storage_bytes_reserved INTEGER NOT NULL CHECK (storage_bytes_reserved >= 0),
  updated_at INTEGER NOT NULL
);
