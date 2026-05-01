import bcrypt from 'bcryptjs';
import prisma from '../../config/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../../utils/jwt';
import { safeRedisSet, safeRedisGet } from '../../config/redis';
import { RegisterInput, LoginInput } from './auth.schema';

const BCRYPT_ROUNDS = 12;
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

export class AuthService {
  /**
   * Register a new user
   */
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw { statusCode: 409, message: 'An account with this email already exists.' };
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token in Redis
    await safeRedisSet(`refresh:${user.id}`, refreshToken, REFRESH_TOKEN_TTL);

    return { user, accessToken, refreshToken };
  }

  /**
   * Login an existing user
   */
  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw { statusCode: 401, message: 'Invalid email or password.' };
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw { statusCode: 401, message: 'Invalid email or password.' };
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token in Redis
    await safeRedisSet(`refresh:${user.id}`, refreshToken, REFRESH_TOKEN_TTL);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refresh(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);

    // Check if refresh token is stored in Redis (if available)
    const storedToken = await safeRedisGet(`refresh:${decoded.userId}`);
    if (storedToken && storedToken !== refreshToken) {
      throw { statusCode: 401, message: 'Invalid refresh token. Please login again.' };
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw { statusCode: 401, message: 'User no longer exists.' };
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // Rotate refresh token
    await safeRedisSet(`refresh:${user.id}`, newRefreshToken, REFRESH_TOKEN_TTL);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  /**
   * Logout — blacklist refresh token
   */
  async logout(userId: string) {
    await safeRedisSet(`refresh:${userId}`, 'blacklisted', 1); // Immediately expire
    return { message: 'Logged out successfully.' };
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw { statusCode: 404, message: 'User not found.' };
    }

    return user;
  }
}

export const authService = new AuthService();
