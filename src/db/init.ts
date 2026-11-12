import bcrypt from 'bcryptjs';
import { pool, db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

let initPromise: Promise<void> | null = null;

export async function initDatabase(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // 1. Attempt to create tables on Neon if they do not exist
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            created_at TIMESTAMP DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS support_messages (
            id SERIAL PRIMARY KEY,
            sender_name TEXT NOT NULL,
            sender_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            is_read BOOLEAN NOT NULL DEFAULT FALSE,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT NOW()
          );

          CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
          CREATE INDEX IF NOT EXISTS idx_support_messages_created ON support_messages(created_at DESC);
        `);
      } catch (ddlErr: any) {
        // In environments where schema/tables are managed by migrations or restricted, log and proceed
        console.warn('[Database] Table DDL check:', ddlErr.message);
      }

      // 2. Ensure admin account 'Ratão' exists with hashed password 'Rato123Legal'
      const adminUsername = 'Ratão';
      const existingAdmin = await db
        .select()
        .from(users)
        .where(eq(users.username, adminUsername))
        .limit(1);

      if (existingAdmin.length === 0) {
        const hashedPassword = await bcrypt.hash('Rato123Legal', 10);
        await db.insert(users).values({
          username: adminUsername,
          passwordHash: hashedPassword,
          role: 'admin',
        });
        console.log(`[Database] Conta administrativa '${adminUsername}' criada automaticamente com senha hash.`);
      }
    } catch (error) {
      console.error('[Database] Erro na inicialização:', error);
      initPromise = null;
      throw error;
    }
  })();

  return initPromise;
}
