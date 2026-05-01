import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import signalRoutes from './modules/signals/signal.routes';

import { setupSwagger } from './config/swagger';

const app = express();

// ─── Swagger Documentation ────────────────────────────────
setupSwagger(app);

// ─── Security ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Parsers ──────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Rate Limiting ────────────────────────────────────────
app.use('/api/', apiLimiter);

// ─── Health Check ─────────────────────────────────────────
app.get('/api/v1/health', (_req, res) => {
  res.json({
    success: true,
    message: 'PrimeTrade API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ─── API Routes ───────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/signals', signalRoutes);

// ─── Error Handling ───────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
