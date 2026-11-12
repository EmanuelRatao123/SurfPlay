import { eq, desc } from 'drizzle-orm';
import { db } from './index.ts';
import { users, supportMessages } from './schema.ts';

export async function findUserByUsername(username: string) {
  try {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0] || null;
  } catch (error) {
    console.error('Database query failed in findUserByUsername:', error);
    throw new Error('Falha ao consultar usuário no banco de dados.', { cause: error });
  }
}

export async function createUser(username: string, passwordHash: string, role: string = 'user') {
  try {
    const result = await db
      .insert(users)
      .values({
        username,
        passwordHash,
        role,
      })
      .returning({
        id: users.id,
        username: users.username,
        role: users.role,
        createdAt: users.createdAt,
      });
    return result[0];
  } catch (error) {
    console.error('Database query failed in createUser:', error);
    throw new Error('Falha ao registrar novo usuário.', { cause: error });
  }
}

export async function createSupportMessage(data: {
  senderName: string;
  senderUserId?: number;
  subject: string;
  message: string;
}) {
  try {
    const result = await db
      .insert(supportMessages)
      .values({
        senderName: data.senderName,
        senderUserId: data.senderUserId,
        subject: data.subject,
        message: data.message,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in createSupportMessage:', error);
    throw new Error('Falha ao registrar mensagem de suporte.', { cause: error });
  }
}

export async function getAllSupportMessages() {
  try {
    return await db.select().from(supportMessages).orderBy(desc(supportMessages.createdAt));
  } catch (error) {
    console.error('Database query failed in getAllSupportMessages:', error);
    throw new Error('Falha ao buscar mensagens de suporte.', { cause: error });
  }
}

export async function markSupportMessageRead(id: number) {
  try {
    const result = await db
      .update(supportMessages)
      .set({ isRead: true })
      .where(eq(supportMessages.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in markSupportMessageRead:', error);
    throw new Error('Falha ao atualizar status da mensagem.', { cause: error });
  }
}

export async function deleteSupportMessage(id: number) {
  try {
    const result = await db
      .delete(supportMessages)
      .where(eq(supportMessages.id, id))
      .returning();
    return result[0];
  } catch (error) {
    console.error('Database query failed in deleteSupportMessage:', error);
    throw new Error('Falha ao excluir mensagem.', { cause: error });
  }
}
