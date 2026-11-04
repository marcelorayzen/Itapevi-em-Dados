import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH ?? '.env' });

const connectionString = process.env.API_READ_DATABASE_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Defina API_READ_DATABASE_URL ou DATABASE_URL fora do Git antes de executar esta inspeção.');
}

const client = new Client({ connectionString });

const checks = [
  {
    id: 'budget_execution',
    sql: `SELECT COUNT(*)::integer AS rows, COUNT(DISTINCT responsible_body)::integer AS bodies,
      COALESCE(SUM(planned_amount), 0)::text AS planned_amount,
      COALESCE(SUM(realized_amount), 0)::text AS realized_amount,
      ARRAY_REMOVE(ARRAY_AGG(DISTINCT checksum), NULL) AS checksums
      FROM public_api.budget_execution_summary
      CROSS JOIN LATERAL UNNEST(artifact_sha256s) AS checksum`,
  },
  {
    id: 'contracts',
    sql: `SELECT COALESCE(SUM(contract_count), 0)::integer AS contracts,
      COUNT(DISTINCT managing_secretariat)::integer AS secretariats,
      COALESCE(SUM(contracted_amount), 0)::text AS contracted_amount,
      ARRAY_REMOVE(ARRAY_AGG(DISTINCT checksum), NULL) AS checksums
      FROM public_api.contract_summary
      CROSS JOIN LATERAL UNNEST(artifact_sha256s) AS checksum`,
  },
  {
    id: 'procurement',
    sql: `SELECT COALESCE(SUM(procurement_count), 0)::integer AS procurements,
      COALESCE(SUM(purchased_amount), 0)::text AS purchased_amount,
      COALESCE(SUM(estimated_amount), 0)::text AS estimated_amount,
      ARRAY_REMOVE(ARRAY_AGG(DISTINCT checksum), NULL) AS checksums
      FROM public_api.procurement_summary
      CROSS JOIN LATERAL UNNEST(artifact_sha256s) AS checksum`,
  },
  {
    id: 'health_units',
    sql: `SELECT COUNT(*)::integer AS rows, ARRAY_AGG(DISTINCT month ORDER BY month) AS months,
      ARRAY_REMOVE(ARRAY_AGG(DISTINCT checksum), NULL) AS checksums
      FROM public_api.health_unit_monthly_summary
      CROSS JOIN LATERAL UNNEST(artifact_sha256s) AS checksum`,
  },
];

async function main() {
  await client.connect();
  try {
    const views = await client.query(`SELECT table_name
      FROM information_schema.views
      WHERE table_schema = 'public_api'
      ORDER BY table_name`);
    const definitions = await client.query(`SELECT table_name, pg_get_viewdef(format('%I.%I', table_schema, table_name)::regclass, true) AS definition
      FROM information_schema.views
      WHERE table_schema = 'public_api'
      ORDER BY table_name`);
    const results: Record<string, unknown> = {
      publicViews: views.rows.map((row) => row.table_name),
      publicViewDefinitions: definitions.rows,
    };

    for (const check of checks) {
      const result = await client.query(check.sql);
      results[check.id] = result.rows[0] ?? null;
    }

    const budgetPeriods = await client.query(`SELECT period_start, period_end, temporal_filter,
      COUNT(*)::integer AS rows,
      COUNT(DISTINCT responsible_body)::integer AS bodies,
      COALESCE(SUM(planned_amount), 0)::text AS planned_amount,
      COALESCE(SUM(realized_amount), 0)::text AS realized_amount,
      ARRAY_REMOVE(ARRAY_AGG(DISTINCT checksum), NULL) AS checksums
      FROM public_api.budget_execution_summary
      CROSS JOIN LATERAL UNNEST(artifact_sha256s) AS checksum
      GROUP BY period_start, period_end, temporal_filter
      ORDER BY period_start`);
    results.budgetPeriods = budgetPeriods.rows;

    console.log(JSON.stringify(results, null, 2));
  } finally {
    await client.end();
  }
}

void main().catch((error: unknown) => {
  const details = error as { name?: string; message?: string; code?: string; detail?: string; hint?: string };
  console.error(JSON.stringify({
    name: details.name ?? 'UnknownError',
    message: details.message ?? 'No message returned by the database client.',
    code: details.code,
    detail: details.detail,
    hint: details.hint,
  }));
  process.exitCode = 1;
});
