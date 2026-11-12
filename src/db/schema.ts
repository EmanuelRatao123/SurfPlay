import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('user'), // 'admin' | 'user'
  createdAt: timestamp('created_at').defaultNow(),
});

export const supportMessages = pgTable('support_messages', {
  id: serial('id').primaryKey(),
  senderName: text('sender_name').notNull(),
  senderUserId: integer('sender_user_id').references(() => users.id),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  status: text('status').notNull().default('pending'), // 'pending' | 'resolved'
  createdAt: timestamp('created_at').defaultNow(),
});
