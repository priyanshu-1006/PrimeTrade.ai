import { Response } from 'express';

interface ApiResponseOptions {
  statusCode: number;
  success: boolean;
  message: string;
  data?: any;
  errors?: any;
}

export const sendResponse = (res: Response, options: ApiResponseOptions): void => {
  const { statusCode, success, message, data, errors } = options;

  res.status(statusCode).json({
    success,
    message,
    ...(data !== undefined && { data }),
    ...(errors !== undefined && { errors }),
    timestamp: new Date().toISOString(),
  });
};

export const sendSuccess = (res: Response, message: string, data?: any, statusCode = 200): void => {
  sendResponse(res, { statusCode, success: true, message, data });
};

export const sendError = (res: Response, message: string, statusCode = 500, errors?: any): void => {
  sendResponse(res, { statusCode, success: false, message, errors });
};
