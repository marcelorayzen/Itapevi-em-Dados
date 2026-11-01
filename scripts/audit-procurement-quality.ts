import 'dotenv/config';
import { createDatabasePool } from '../src/db/connection.js';

async function main(): Promise<void> {
  const pool = createDatabasePool();
  try {
    const [contracts, procurements, links, withoutProcess, withoutLink] = await Promise.all([
      pool.query('SELECT exercise_year, count(*)::int AS count FROM contract_records GROUP BY exercise_year ORDER BY exercise_year'),
      pool.query('SELECT a.sha256, count(*)::int AS count, sum(p.purchased_amount)::text AS purchased_amount, sum(p.estimated_amount)::text AS estimated_amount FROM procurement_records p JOIN artifacts a ON a.artifact_id=p.artifact_id GROUP BY a.sha256 ORDER BY a.sha256'),
      pool.query('SELECT count(*)::int AS count FROM contract_procurement_links'),
      pool.query("SELECT count(*)::int AS count FROM contract_records WHERE procurement_process IS NULL OR procurement_process = ''"),
      pool.query('SELECT count(*)::int AS count FROM procurement_records p WHERE NOT EXISTS (SELECT 1 FROM contract_procurement_links l WHERE l.procurement_id = p.procurement_id)'),
    ]);
    console.log(JSON.stringify({ contractsByYear: contracts.rows, procurementsByYear: procurements.rows, highConfidenceLinks: links.rows[0].count, contractsWithoutProcess: withoutProcess.rows[0].count, procurementsWithoutLinkedContract: withoutLink.rows[0].count }, null, 2));
  } finally { await pool.end(); }
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
