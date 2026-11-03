CREATE TABLE health_unit_commitment_links (
  commitment_record_id UUID NOT NULL REFERENCES detailed_commitment_records(commitment_record_id) ON DELETE CASCADE,
  health_unit TEXT NOT NULL,
  match_method TEXT NOT NULL CHECK (match_method IN ('description_explicit','application_explicit')),
  confidence TEXT NOT NULL CHECK (confidence IN ('high','needs_review')),
  PRIMARY KEY (commitment_record_id, health_unit)
);
CREATE INDEX health_unit_commitments_unit_idx ON health_unit_commitment_links(health_unit);
