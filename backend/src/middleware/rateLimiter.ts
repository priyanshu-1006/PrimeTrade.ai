import rateLimit from 'express-rate-limit';

// Auth routes: strict rate limiting (5 req/min per IP)
export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    success: false,
    message: 'Too many requests. Please try again after 1 minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API routes: moderate rate limiting
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
