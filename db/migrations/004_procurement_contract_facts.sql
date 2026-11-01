CREATE TABLE procurement_records (
  procurement_id UUID PRIMARY KEY,
  artifact_id UUID NOT NULL REFERENCES artifacts(artifact_id),
  record_key TEXT NOT NULL UNIQUE,
  exercise_year INTEGER NOT NULL CHECK (exercise_year BETWEEN 2000 AND 2100),
  modality TEXT NOT NULL,
  procurement_process TEXT NOT NULL,
  administrative_process TEXT,
  object_description TEXT NOT NULL,
  status TEXT NOT NULL,
  published_on DATE,
  opening_on DATE,
  price_registration_total NUMERIC(16,2) NOT NULL,
  purchased_amount NUMERIC(16,2) NOT NULL,
  estimated_amount NUMERIC(16,2) NOT NULL,
  item_count INTEGER NOT NULL CHECK (item_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE contract_records (
  contract_id UUID PRIMARY KEY,
  artifact_id UUID NOT NULL REFERENCES artifacts(artifact_id),
  record_key TEXT NOT NULL UNIQUE,
  exercise_year INTEGER NOT NULL CHECK (exercise_year BETWEEN 2000 AND 2100),
  contract_number TEXT NOT NULL,
  contract_type TEXT NOT NULL,
  supplier_document_masked TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  starts_on DATE NOT NULL,
  ends_on DATE NOT NULL,
  contracted_amount NUMERIC(16,2) NOT NULL,
  committed_amount NUMERIC(16,2) NOT NULL,
  processed_amount NUMERIC(16,2) NOT NULL,
  paid_amount NUMERIC(16,2) NOT NULL,
  object_description TEXT NOT NULL,
  procurement_process TEXT,
  managing_secretariat TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE contract_procurement_links (
  contract_id UUID NOT NULL REFERENCES contract_records(contract_id) ON DELETE CASCADE,
  procurement_id UUID NOT NULL REFERENCES procurement_records(procurement_id) ON DELETE CASCADE,
  match_method TEXT NOT NULL CHECK (match_method IN ('normalized_process_exact')),
  confidence TEXT NOT NULL CHECK (confidence IN ('high', 'needs_review')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (contract_id, procurement_id)
);

CREATE INDEX procurement_records_exercise_idx ON procurement_records(exercise_year, modality);
CREATE INDEX contract_records_exercise_idx ON contract_records(exercise_year, managing_secretariat);
