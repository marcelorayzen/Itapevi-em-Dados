CREATE TABLE budget_execution_records (
  budget_execution_id UUID PRIMARY KEY,
  artifact_id UUID NOT NULL REFERENCES artifacts(artifact_id),
  record_key TEXT NOT NULL UNIQUE,
  program TEXT NOT NULL,
  action TEXT NOT NULL,
  responsible_body TEXT NOT NULL,
  planned_amount NUMERIC(16,2) NOT NULL,
  realized_amount NUMERIC(16,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX budget_execution_records_body_idx ON budget_execution_records(responsible_body);
