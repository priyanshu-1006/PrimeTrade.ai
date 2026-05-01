import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { sendSuccess, sendError } from '../../utils/apiResponse';
import { env } from '../../config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);

      // Set refresh token as HttpOnly cookie
      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

      sendSuccess(res, 'Registration successful.', {
        user: result.user,
        accessToken: result.accessToken,
      }, 201);
    } catch (error: any) {
      if (error.statusCode) {
        sendError(res, error.message, error.statusCode);
        return;
      }
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);

      // Set refresh token as HttpOnly cookie
      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

      sendSuccess(res, 'Login successful.', {
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      if (error.statusCode) {
        sendError(res, error.message, error.statusCode);
        return;
      }
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

      if (!refreshToken) {
        sendError(res, 'Refresh token is required.', 400);
        return;
      }

      const result = await authService.refresh(refreshToken);

      // Rotate refresh token cookie
      res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

      sendSuccess(res, 'Token refreshed successfully.', {
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      if (error.statusCode) {
        sendError(res, error.message, error.statusCode);
        return;
      }
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required.', 401);
        return;
      }

      await authService.logout(req.user.userId);

      // Clear refresh token cookie
      res.clearCookie('refreshToken', { path: '/' });

      sendSuccess(res, 'Logged out successfully.');
    } catch (error: any) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        sendError(res, 'Authentication required.', 401);
        return;
      }

      const user = await authService.getProfile(req.user.userId);
      sendSuccess(res, 'Profile retrieved successfully.', user);
    } catch (error: any) {
      if (error.statusCode) {
        sendError(res, error.message, error.statusCode);
        return;
      }
      next(error);
    }
  }
}

export const authController = new AuthController();
