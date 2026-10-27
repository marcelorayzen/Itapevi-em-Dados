ALTER TABLE processing_runs
  ADD COLUMN deduplication_key TEXT;

ALTER TABLE processing_runs
  ADD CONSTRAINT processing_runs_deduplication_key_unique UNIQUE (deduplication_key);
