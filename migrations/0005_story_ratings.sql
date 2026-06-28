CREATE TABLE IF NOT EXISTS story_ratings (
  story_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  page_path TEXT,
  language TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (story_id, visitor_id)
);

CREATE INDEX IF NOT EXISTS idx_story_ratings_story_id
  ON story_ratings (story_id);

CREATE INDEX IF NOT EXISTS idx_story_ratings_updated_at
  ON story_ratings (updated_at);
