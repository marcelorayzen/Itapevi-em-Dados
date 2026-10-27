CREATE TABLE entities (
  entity_id UUID PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('public_body', 'municipal_secretariat')),
  canonical_name TEXT NOT NULL,
  confidence TEXT NOT NULL CHECK (confidence IN ('high', 'medium', 'needs_review')),
  resolution_status TEXT NOT NULL CHECK (resolution_status IN ('accepted', 'needs_review', 'rejected')),
  valid_from DATE,
  valid_to DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (entity_type, canonical_name)
);

CREATE TABLE entity_aliases (
  alias_id UUID PRIMARY KEY,
  entity_id UUID REFERENCES entities(entity_id),
  artifact_id UUID NOT NULL REFERENCES artifacts(artifact_id),
  alias_text TEXT NOT NULL,
  proposed_canonical_name TEXT,
  locator JSONB NOT NULL,
  deduplication_key TEXT NOT NULL UNIQUE,
  confidence TEXT NOT NULL CHECK (confidence IN ('high', 'medium', 'needs_review')),
  resolution_status TEXT NOT NULL CHECK (resolution_status IN ('accepted', 'needs_review', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((resolution_status = 'accepted' AND entity_id IS NOT NULL) OR resolution_status <> 'accepted')
);

CREATE TABLE entity_resolution_decisions (
  decision_id UUID PRIMARY KEY,
  alias_id UUID NOT NULL REFERENCES entity_aliases(alias_id),
  decision_type TEXT NOT NULL CHECK (decision_type IN ('case_normalization', 'manual_merge', 'deferred_ambiguous', 'rejected')),
  rationale TEXT NOT NULL,
  decided_by TEXT NOT NULL,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (alias_id, decision_type, rationale)
);

CREATE INDEX entity_aliases_entity_idx ON entity_aliases(entity_id);
CREATE INDEX entity_aliases_artifact_idx ON entity_aliases(artifact_id);
