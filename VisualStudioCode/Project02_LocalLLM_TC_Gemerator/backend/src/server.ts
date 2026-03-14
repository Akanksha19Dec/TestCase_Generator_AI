import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { logger } from './utils/logger';
import testGenerationRoutes from './routes/testGeneration';
import { errorHandler, notFoundHandler, requestLogger } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json({
  limit: '10kb', // Limit request size
}));

app.use(requestLogger);

// Routes
app.use('/api', testGenerationRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.server.port;

async function startServer() {
  try {
    app.listen(PORT, () => {
      logger.info(
        `🚀 Backend server running on http://localhost:${PORT}`,
        {
          nodeEnv: config.server.nodeEnv,
          port: PORT,
        }
      );
      logger.info('Available endpoints:');
      logger.info('  POST   /api/generate-tests  - Generate test cases');
      logger.info('  GET    /api/health          - Health check');
      logger.info('  GET    /api/providers       - List providers');
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at promise', { reason, promise });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  process.exit(1);
});

startServer();

export default app;
