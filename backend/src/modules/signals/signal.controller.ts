import { Request, Response, NextFunction } from 'express';
import { signalService } from './signal.service';
import { sendSuccess, sendError } from '../../utils/apiResponse';

export class SignalController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required.', 401);
        return;
      }

      const signal = await signalService.create(req.body, req.user.userId);
      sendSuccess(res, 'Signal created successfully.', signal, 201);
    } catch (error: any) {
      if (error.statusCode) {
        sendError(res, error.message, error.statusCode);
        return;
      }
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, status, sortBy, order } = req.query;
      const result = await signalService.findAll({
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 10,
        status: status as string,
        sortBy: sortBy as string,
        order: order as string,
      });
      sendSuccess(res, 'Signals retrieved successfully.', result);
    } catch (error: any) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const signal = await signalService.findById(req.params.id as string);
      sendSuccess(res, 'Signal retrieved successfully.', signal);
    } catch (error: any) {
      if (error.statusCode) {
        sendError(res, error.message, error.statusCode);
        return;
      }
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const signal = await signalService.update(req.params.id as string, req.body);
      sendSuccess(res, 'Signal updated successfully.', signal);
    } catch (error: any) {
      if (error.statusCode) {
        sendError(res, error.message, error.statusCode);
        return;
      }
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await signalService.delete(req.params.id as string);
      sendSuccess(res, result.message);
    } catch (error: any) {
      if (error.statusCode) {
        sendError(res, error.message, error.statusCode);
        return;
      }
      next(error);
    }
  }
}

export const signalController = new SignalController();
