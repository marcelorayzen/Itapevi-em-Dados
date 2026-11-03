CREATE TABLE school_catalog_records (
  school_record_id UUID PRIMARY KEY,
  artifact_id UUID NOT NULL REFERENCES artifacts(artifact_id),
  record_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  source_position INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX school_catalog_artifact_idx ON school_catalog_records(artifact_id);
CREATE INDEX school_catalog_name_idx ON school_catalog_records(name);
