import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (err: AppError, req: Request, res: Response, _next: NextFunction): void => {
  const statusCode = err.statusCode || 500;
  const message = env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal server error'
    : err.message || 'Something went wrong';

  console.error(`[Error] ${req.method} ${req.path}:`, err.message);

  if (env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
};
