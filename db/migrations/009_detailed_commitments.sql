CREATE TABLE detailed_commitment_records (
  commitment_record_id UUID PRIMARY KEY,
  artifact_id UUID NOT NULL REFERENCES artifacts(artifact_id),
  record_key TEXT NOT NULL UNIQUE,
  commitment_number TEXT NOT NULL,
  process_number TEXT,
  committed_on DATE NOT NULL,
  description TEXT NOT NULL,
  function_name TEXT,
  subfunction_name TEXT,
  application_name TEXT,
  budget_unit TEXT NOT NULL,
  program TEXT NOT NULL,
  action TEXT NOT NULL,
  original_amount NUMERIC(16,2) NOT NULL,
  processed_amount NUMERIC(16,2) NOT NULL,
  paid_amount NUMERIC(16,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX detailed_commitments_date_idx ON detailed_commitment_records(committed_on);
CREATE INDEX detailed_commitments_unit_idx ON detailed_commitment_records(budget_unit);
