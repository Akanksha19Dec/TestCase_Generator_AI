import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  error: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Request error', error);

  let statusCode = 500;
  let message = 'Internal server error';

  if (error instanceof Error) {
    message = error.message;

    // Check for known error patterns
    if (message.includes('connection') || message.includes('Connection')) {
      statusCode = 503; // Service unavailable
    } else if (message.includes('API key') || message.includes('authentication')) {
      statusCode = 401; // Unauthorized
    } else if (message.includes('rate limit')) {
      statusCode = 429; // Too many requests
    } else if (message.includes('timeout')) {
      statusCode = 504; // Gateway timeout
    } else if (message.includes('Invalid') && !message.includes('API key')) {
      statusCode = 400; // Bad request
    }
  }

  if ('statusCode' in error && error.statusCode) {
    statusCode = error.statusCode;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    code: (error as any).code || 'INTERNAL_ERROR',
  });
};

/**
 * 404 handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`,
    code: 'NOT_FOUND',
  });
};

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.debug(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};
