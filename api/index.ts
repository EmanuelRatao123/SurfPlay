import { createExpressApp } from '../src/server/app.ts';

// Create Express application instance for Vercel Serverless Functions
const app = createExpressApp();

// Vercel serverless entry point: does NOT use app.listen
export default app;
