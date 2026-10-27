import { Pool } from 'pg';

export function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL é obrigatória para operações de persistência.');
  }
  return databaseUrl;
}

export function createDatabasePool(): Pool {
  return new Pool({ connectionString: getDatabaseUrl() });
}
