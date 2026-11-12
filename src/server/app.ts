import express from 'express';
import bcrypt from 'bcryptjs';
import {
  findUserByUsername,
  createUser,
  createSupportMessage,
  getAllSupportMessages,
  markSupportMessageRead,
  deleteSupportMessage,
} from '../db/queries.ts';
import { initDatabase } from '../db/init.ts';
import {
  signAuthToken,
  requireAuth,
  requireAdmin,
  AuthenticatedRequest,
} from './auth.ts';

export function createExpressApp() {
  const app = express();

  app.use(express.json());

  // Ensure Neon database tables and admin account are initialized
  app.use(async (_req, _res, next) => {
    try {
      await initDatabase();
      next();
    } catch (err) {
      console.error('[Database Middleware Error]', err);
      next(err);
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'SurfPlay API',
      timestamp: new Date().toISOString(),
    });
  });

  // === Authentication Endpoints ===

  // Register new user with exclusive username and bcrypt hashed password
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || typeof username !== 'string' || !username.trim()) {
        return res.status(400).json({ error: 'O nome de jogador é obrigatório.' });
      }

      if (!password || typeof password !== 'string' || password.length < 3) {
        return res.status(400).json({ error: 'A senha deve ter pelo menos 3 caracteres.' });
      }

      const trimmedName = username.trim();

      // Check if username is already taken in Neon database
      const existing = await findUserByUsername(trimmedName);
      if (existing) {
        return res.status(409).json({
          error: `O nome "${trimmedName}" já está em uso por outro jogador. Escolha um nome exclusivo!`,
        });
      }

      // Hash password using bcrypt
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await createUser(trimmedName, passwordHash, 'user');

      // Issue signed JWT authentication token
      const token = signAuthToken({
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
      });

      return res.status(201).json({
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
        },
        token,
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      // Catch PostgreSQL unique constraint violation code (23505)
      if (err?.code === '23505' || err?.message?.includes('duplicate key') || err?.cause?.code === '23505') {
        return res.status(409).json({
          error: 'Este nome de jogador já está em uso. Por favor, escolha outro nome exclusivo!',
        });
      }
      return res.status(500).json({ error: err.message || 'Erro ao criar conta.' });
    }
  });

  // Login with username and password verification
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Nome de jogador e senha são obrigatórios.' });
      }

      const cleanName = String(username).trim();
      const user = await findUserByUsername(cleanName);
      if (!user) {
        return res.status(401).json({
          error: 'Jogador não encontrado. Verifique o nome ou crie uma nova conta.',
        });
      }

      // Validate password hash with bcrypt
      const isMatch = await bcrypt.compare(String(password), user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          error: 'Senha incorreta. Tente novamente.',
        });
      }

      // Issue signed JWT authentication token
      const token = signAuthToken({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      return res.json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        token,
      });
    } catch (err: any) {
      console.error('Login error:', err);
      return res.status(500).json({ error: err.message || 'Erro ao processar login.' });
    }
  });

  // Verify current session token
  app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
    return res.json({ user: req.user });
  });

  // Check username availability
  app.get('/api/auth/check-username', async (req, res) => {
    try {
      const username = req.query.name as string;
      if (!username) {
        return res.status(400).json({ error: 'Parâmetro name obrigatório.' });
      }
      const user = await findUserByUsername(username.trim());
      return res.json({ available: !user });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // === Support & Mailbox Endpoints ===

  // Submit a support message (saves to Neon)
  app.post('/api/support', async (req: AuthenticatedRequest, res) => {
    try {
      const { senderName, senderUserId, subject, message } = req.body;

      if (!senderName || !subject || !message) {
        return res.status(400).json({ error: 'Nome, assunto e mensagem são obrigatórios.' });
      }

      const created = await createSupportMessage({
        senderName: String(senderName).trim(),
        senderUserId: senderUserId ? Number(senderUserId) : undefined,
        subject: String(subject).trim(),
        message: String(message).trim(),
      });

      return res.status(201).json({ success: true, message: created });
    } catch (err: any) {
      console.error('Support message error:', err);
      return res.status(500).json({ error: err.message || 'Erro ao enviar mensagem de suporte.' });
    }
  });

  // Admin Mailbox: Get all support messages (STRICT SERVER-SIDE ADMIN TOKEN CHECK)
  app.get('/api/admin/messages', requireAdmin, async (_req: AuthenticatedRequest, res) => {
    try {
      const messages = await getAllSupportMessages();
      return res.json({ messages });
    } catch (err: any) {
      console.error('Admin messages error:', err);
      return res.status(500).json({ error: err.message || 'Erro ao carregar mensagens.' });
    }
  });

  // Admin Mailbox: Mark message as read (STRICT SERVER-SIDE ADMIN TOKEN CHECK)
  app.patch('/api/admin/messages/:id/read', requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID de mensagem inválido.' });
      }

      const updated = await markSupportMessageRead(id);
      return res.json({ success: true, message: updated });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Admin Mailbox: Delete message (STRICT SERVER-SIDE ADMIN TOKEN CHECK)
  app.delete('/api/admin/messages/:id', requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'ID de mensagem inválido.' });
      }

      await deleteSupportMessage(id);
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  return app;
}
