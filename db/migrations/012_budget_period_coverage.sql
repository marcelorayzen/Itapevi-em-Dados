ALTER TABLE budget_execution_records
  ADD COLUMN IF NOT EXISTS period_start DATE,
  ADD COLUMN IF NOT EXISTS period_end DATE,
  ADD COLUMN IF NOT EXISTS temporal_filter TEXT;

UPDATE budget_execution_records record
SET period_start = DATE '2026-09-01',
    period_end = DATE '2026-09-30',
    temporal_filter = 'Data de Empenho'
FROM artifacts artifact
WHERE artifact.artifact_id = record.artifact_id
  AND artifact.sha256 = '32EBD6B957F9D142E99A24EB802DD8A8DCDAE5ED2349FEE0A380EB7F6B9A7E70'
  AND record.period_start IS NULL;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM budget_execution_records WHERE period_start IS NULL OR period_end IS NULL OR temporal_filter IS NULL) THEN
    RAISE EXCEPTION 'Todos os fatos orcamentarios existentes precisam de periodo e filtro antes de publicar a visao temporal.';
  END IF;
END
$$;

ALTER TABLE budget_execution_records
  ALTER COLUMN period_start SET NOT NULL,
  ALTER COLUMN period_end SET NOT NULL,
  ALTER COLUMN temporal_filter SET NOT NULL;

ALTER TABLE budget_execution_records
  DROP CONSTRAINT IF EXISTS budget_execution_records_record_key_key;

CREATE UNIQUE INDEX IF NOT EXISTS budget_execution_records_artifact_record_key_idx
  ON budget_execution_records (artifact_id, record_key);

CREATE INDEX IF NOT EXISTS budget_execution_records_period_idx
  ON budget_execution_records (period_start, period_end);

CREATE OR REPLACE VIEW public_api.budget_execution_summary AS
SELECT
  budget.responsible_body,
  COUNT(*)::integer AS record_count,
  SUM(budget.planned_amount) AS planned_amount,
  SUM(budget.realized_amount) AS realized_amount,
  ARRAY_AGG(DISTINCT artifact.sha256 ORDER BY artifact.sha256) AS artifact_sha256s,
  budget.period_start,
  budget.period_end,
  budget.temporal_filter
FROM budget_execution_records budget
JOIN artifacts artifact ON artifact.artifact_id = budget.artifact_id
GROUP BY budget.responsible_body, budget.period_start, budget.period_end, budget.temporal_filter;
