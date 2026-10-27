CREATE TABLE sources (
  source_id TEXT PRIMARY KEY,
  organization TEXT NOT NULL,
  base_url TEXT NOT NULL,
  terms_url TEXT,
  redistribution_status TEXT NOT NULL CHECK (
    redistribution_status IN ('pending_review', 'allowed', 'restricted', 'prohibited')
  ),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE datasets (
  dataset_id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES sources(source_id),
  name TEXT NOT NULL,
  scope TEXT NOT NULL,
  update_frequency TEXT,
  schema_version TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('candidate', 'active', 'paused', 'retired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE artifacts (
  artifact_id UUID PRIMARY KEY,
  dataset_id TEXT NOT NULL REFERENCES datasets(dataset_id),
  source_url TEXT NOT NULL,
  collected_at TIMESTAMPTZ NOT NULL,
  media_type TEXT NOT NULL,
  byte_size BIGINT NOT NULL CHECK (byte_size >= 0),
  sha256 TEXT NOT NULL UNIQUE CHECK (sha256 ~ '^[A-Fa-f0-9]{64}$'),
  storage_ref TEXT NOT NULL,
  retention_status TEXT NOT NULL CHECK (retention_status IN ('retained_local', 'retained_managed', 'purged')),
  publication_status TEXT NOT NULL CHECK (publication_status IN ('blocked_pending_terms_review', 'internal_only', 'approved_for_publication')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE processing_runs (
  run_id UUID PRIMARY KEY,
  artifact_id UUID NOT NULL REFERENCES artifacts(artifact_id),
  processor_name TEXT NOT NULL,
  processor_version TEXT NOT NULL,
  configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL CHECK (status IN ('started', 'succeeded', 'failed', 'partial')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  error_message TEXT,
  CHECK ((status IN ('started')) OR finished_at IS NOT NULL)
);

CREATE TABLE evidence (
  evidence_id UUID PRIMARY KEY,
  artifact_id UUID NOT NULL REFERENCES artifacts(artifact_id),
  locator JSONB NOT NULL,
  excerpt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE events (
  event_id UUID PRIMARY KEY,
  event_type TEXT NOT NULL,
  occurred_on DATE,
  payload JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('candidate', 'accepted', 'nao_confirmado', 'rejected')),
  run_id UUID REFERENCES processing_runs(run_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE event_evidence (
  event_id UUID NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
  evidence_id UUID NOT NULL REFERENCES evidence(evidence_id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'supports',
  PRIMARY KEY (event_id, evidence_id)
);

CREATE INDEX artifacts_dataset_collected_idx ON artifacts(dataset_id, collected_at DESC);
CREATE INDEX processing_runs_artifact_idx ON processing_runs(artifact_id, started_at DESC);
CREATE INDEX evidence_artifact_idx ON evidence(artifact_id);
CREATE INDEX events_run_idx ON events(run_id);
