import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Ensure local container dev fallback if Neon connection string isn't set yet in local environment
if (!process.env.POSTGRES_PRISMA_URL && !process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
  if (process.env.SQL_USER && process.env.SQL_HOST) {
    const user = process.env.SQL_USER;
    const pass = encodeURIComponent(process.env.SQL_PASSWORD || '');
    const host = encodeURIComponent(process.env.SQL_HOST);
    const dbName = process.env.SQL_DB_NAME || 'postgres';
    process.env.POSTGRES_URL = `postgresql://${user}:${pass}@localhost/${dbName}?host=${host}`;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const { createExpressApp } = await import('./src/server/app.ts');
  const app = createExpressApp();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Mount Vite SPA or serve static files in local/standalone environment
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const { default: express } = await import('express');
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  // Only start listening if NOT in a Vercel serverless function environment
  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[SurfPlay] Server running locally on http://0.0.0.0:${PORT}`);
    });
  }

  return app;
}

startServer().catch((err) => {
  console.error('[SurfPlay] Failed to start server:', err);
  process.exit(1);
});

export default startServer;
