import 'dotenv/config';
import { createDatabasePool } from '../src/db/connection.js';

async function main(): Promise<void> {
  const pool = createDatabasePool();
  try {
    const result = await pool.query(`WITH p AS (SELECT procurement_id, regexp_replace(procurement_process, '[^0-9/]', '', 'g') AS k, count(*) OVER (PARTITION BY regexp_replace(procurement_process, '[^0-9/]', '', 'g')) AS n FROM procurement_records), c AS (SELECT contract_id, regexp_replace(procurement_process, '[^0-9/]', '', 'g') AS k FROM contract_records WHERE procurement_process IS NOT NULL AND procurement_process <> '') INSERT INTO contract_procurement_links (contract_id, procurement_id, match_method, confidence) SELECT c.contract_id, p.procurement_id, 'normalized_process_exact', 'high' FROM c JOIN p ON p.k=c.k AND p.n=1 ON CONFLICT DO NOTHING`);
    const count = await pool.query<{ count:string }>('SELECT count(*) FROM contract_procurement_links');
    console.log(JSON.stringify({ inserted: result.rowCount, highConfidenceLinks: Number(count.rows[0].count) }));
  } finally { await pool.end(); }
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
