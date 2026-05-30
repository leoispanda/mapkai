ALTER TABLE contact_messages ADD COLUMN status TEXT DEFAULT 'new';
ALTER TABLE contact_messages ADD COLUMN is_read INTEGER DEFAULT 0;
ALTER TABLE contact_messages ADD COLUMN is_important INTEGER DEFAULT 0;
ALTER TABLE contact_messages ADD COLUMN founder_note TEXT;
ALTER TABLE contact_messages ADD COLUMN updated_at TEXT;
