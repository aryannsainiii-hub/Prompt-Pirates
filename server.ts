import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { CANDIDATE_PROFILES } from './src/data/candidates';
import { AI_COHORT_CURRICULUM, AI_COHORT_MODULES } from './src/data/curriculum';
import { startInterview, processAnswer, handleApiInterview } from './src/services/interviewEngine';
import { sessionManager } from './src/services/sessionManager';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '1mb' }));

  // API Routes
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      name: 'AI Interview Agent',
      docs: '/api/docs',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/candidates', (req: Request, res: Response) => {
    res.json(CANDIDATE_PROFILES);
  });

  app.get('/api/curriculum', (req: Request, res: Response) => {
    res.json(AI_COHORT_CURRICULUM);
  });

  app.get('/api/modules', (req: Request, res: Response) => {
    res.json(AI_COHORT_MODULES);
  });

  /**
   * Technical Specification Endpoint
   * POST /api/interview
   */
  app.post('/api/interview', async (req: Request, res: Response) => {
    try {
      const response = await handleApiInterview(req.body);
      res.json(response);
    } catch (err: any) {
      console.error('Error in /api/interview endpoint:', err);
      res.status(400).json({ error: err.message || 'Invalid interview request' });
    }
  });

  app.post('/api/interview/start', async (req: Request, res: Response) => {
    try {
      const { candidateId } = req.body;
      if (!candidateId) {
        res.status(400).json({ error: 'candidateId is required' });
        return;
      }

      const session = await startInterview(candidateId);
      res.json(session);
    } catch (err: any) {
      console.error('Error starting interview:', err);
      res.status(500).json({ error: err.message || 'Failed to start interview' });
    }
  });

  app.post('/api/interview/answer', async (req: Request, res: Response) => {
    try {
      const { sessionId, answer } = req.body;
      if (!sessionId) {
        res.status(400).json({ error: 'sessionId is required' });
        return;
      }

      const result = await processAnswer(sessionId, answer ?? '');
      res.json(result);
    } catch (err: any) {
      console.error('Error processing answer:', err);
      res.status(500).json({ error: err.message || 'Failed to process answer' });
    }
  });

  app.get('/api/interview/session/:sessionId', (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const session = sessionManager.getSession(sessionId);

    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    res.json(session);
  });

  app.post('/api/interview/reset', (req: Request, res: Response) => {
    const { sessionId } = req.body;
    if (sessionId) {
      sessionManager.deleteSession(sessionId);
    }
    res.json({ status: 'reset_successful' });
  });

  // Vite Middleware / Static File Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Interview Agent] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
