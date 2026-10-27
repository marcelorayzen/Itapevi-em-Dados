import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createDatabasePool } from '../src/db/connection.js';

const migrationsDirectory = join(process.cwd(), 'db', 'migrations');

async function main(): Promise<void> {
  const pool = createDatabasePool();
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        migration_name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const migrations = (await readdir(migrationsDirectory))
      .filter((name) => name.endsWith('.sql'))
      .sort();

    for (const migrationName of migrations) {
      const applied = await pool.query<{ migration_name: string }>(
        'SELECT migration_name FROM schema_migrations WHERE migration_name = $1',
        [migrationName],
      );
      if (applied.rowCount) continue;

      const sql = await readFile(join(migrationsDirectory, migrationName), 'utf8');
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (migration_name) VALUES ($1)', [migrationName]);
        await client.query('COMMIT');
        console.log(`Migração aplicada: ${migrationName}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error('Falha ao aplicar migrações:', error);
  process.exitCode = 1;
});
