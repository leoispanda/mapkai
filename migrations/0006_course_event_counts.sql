CREATE TABLE IF NOT EXISTS course_event_counts (
  event_date TEXT NOT NULL,
  event_name TEXT NOT NULL,
  course_day INTEGER NOT NULL DEFAULT 0,
  language TEXT NOT NULL DEFAULT 'en',
  channel TEXT NOT NULL DEFAULT '',
  event_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (event_date, event_name, course_day, language, channel)
);

CREATE INDEX IF NOT EXISTS idx_course_event_counts_event
  ON course_event_counts (event_name, event_date);
