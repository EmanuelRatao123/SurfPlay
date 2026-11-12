import express from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  findUserByUsername,
  createUser,
  createSupportMessage,
  getAllSupportMessages,
  markSupportMessageRead,
  deleteSupportMessage,
} from './src/db/queries.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // === Authentication Endpoints ===

  // Register new user (must have unique username)
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || typeof username !== 'string' || !username.trim()) {
        return res.status(400).json({ error: 'O nome de usuário é obrigatório.' });
      }

      if (!password || typeof password !== 'string' || password.length < 3) {
        return res.status(400).json({ error: 'A senha deve ter pelo menos 3 caracteres.' });
      }

      const trimmedName = username.trim();

      // Check if username is already taken
      const existing = await findUserByUsername(trimmedName);
      if (existing) {
        return res.status(409).json({
          error: `O nome "${trimmedName}" já está em uso por outro jogador. Escolha um nome exclusivo!`,
        });
      }

      // Hash password and store
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await createUser(trimmedName, passwordHash, 'user');

      return res.status(201).json({
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
        },
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      return res.status(500).json({ error: err.message || 'Erro ao criar conta.' });
    }
  });

  // Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios.' });
      }

      const user = await findUserByUsername(username.trim());
      if (!user) {
        return res.status(401).json({ error: 'Jogador não encontrado. Verifique o nome ou crie uma nova conta.' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Senha incorreta. Tente novamente.' });
      }

      return res.json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (err: any) {
      console.error('Login error:', err);
      return res.status(500).json({ error: err.message || 'Erro ao processar login.' });
    }
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

  // Submit a support message
  app.post('/api/support', async (req, res) => {
    try {
      const { senderName, senderUserId, subject, message } = req.body;

      if (!senderName || !subject || !message) {
        return res.status(400).json({ error: 'Nome, assunto e mensagem são obrigatórios.' });
      }

      const created = await createSupportMessage({
        senderName: senderName.trim(),
        senderUserId: senderUserId ? Number(senderUserId) : undefined,
        subject: subject.trim(),
        message: message.trim(),
      });

      return res.status(201).json({ success: true, message: created });
    } catch (err: any) {
      console.error('Support message error:', err);
      return res.status(500).json({ error: err.message || 'Erro ao enviar mensagem de suporte.' });
    }
  });

  // Admin Mailbox: Get all support messages
  app.get('/api/admin/messages', async (req, res) => {
    try {
      const username = req.headers['x-admin-user'] as string;
      const role = req.headers['x-admin-role'] as string;

      if (role !== 'admin' || !username) {
        return res.status(403).json({ error: 'Acesso restrito à caixa postal do Administrador.' });
      }

      const messages = await getAllSupportMessages();
      return res.json({ messages });
    } catch (err: any) {
      console.error('Admin messages error:', err);
      return res.status(500).json({ error: err.message || 'Erro ao carregar mensagens.' });
    }
  });

  // Admin Mailbox: Mark message as read
  app.patch('/api/admin/messages/:id/read', async (req, res) => {
    try {
      const id = Number(req.params.id);
      const role = req.headers['x-admin-role'] as string;

      if (role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado.' });
      }

      const updated = await markSupportMessageRead(id);
      return res.json({ success: true, message: updated });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Admin Mailbox: Delete message
  app.delete('/api/admin/messages/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      const role = req.headers['x-admin-role'] as string;

      if (role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado.' });
      }

      await deleteSupportMessage(id);
      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // === Vite / Static Hosting ===
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SurfPlay server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
