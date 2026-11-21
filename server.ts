import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import app from './app.ts';

// Only the traditional local/Render server imports Vite.
// Vercel's /api functions import app.ts directly, without Vite or file serving.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SafeLens AI listening on http://localhost:${PORT}`);
  });
}

// Node.js server entrypoint for local development and Render.
startServer().catch((err) => {
  console.error('Failed to start SafeLens AI server:', err);
  process.exitCode = 1;
});
