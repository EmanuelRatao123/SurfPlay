import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

/**
 * Retrieves the PostgreSQL / Neon connection string from standard environment variables.
 * Compatible with Neon on Vercel (POSTGRES_PRISMA_URL, POSTGRES_URL, or DATABASE_URL).
 */
export function getNeonConnectionString(): string {
  return (
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    ''
  );
}

export const createPool = () => {
  if (!global._postgresPool) {
    const connectionString = getNeonConnectionString();

    // Enable SSL for secure Neon connections, unless connecting to an unencrypted localhost
    const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
    const ssl = isLocalhost ? undefined : { rejectUnauthorized: false };

    global._postgresPool = new Pool({
      connectionString,
      ssl,
      // For Vercel Serverless Functions, limit pool size to prevent exhausting Neon connection limits
      max: process.env.VERCEL ? 3 : 10,
      connectionTimeoutMillis: 15000,
      idleTimeoutMillis: 30000,
    });

    global._postgresPool.on('error', (err) => {
      console.error('[Neon/Postgres Pool] Unexpected error on idle client:', err);
    });
  }
  return global._postgresPool;
};

export const pool = createPool();

export const db = drizzle(pool, { schema });
