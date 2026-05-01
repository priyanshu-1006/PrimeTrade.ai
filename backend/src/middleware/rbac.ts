import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(res, 'Insufficient permissions. Admin access required.', 403);
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole('ADMIN');
