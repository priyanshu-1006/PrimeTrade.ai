import { z } from 'zod';

export const createSignalSchema = z.object({
  symbol: z
    .string()
    .min(1, 'Symbol is required')
    .max(20, 'Symbol must be 20 characters or fewer')
    .transform((val) => val.toUpperCase()),
  entryPrice: z.number().positive('Entry price must be positive'),
  targetPrice: z.number().positive('Target price must be positive'),
  stopLoss: z.number().positive('Stop loss must be positive'),
});

export const updateSignalSchema = z.object({
  symbol: z
    .string()
    .min(1)
    .max(20)
    .transform((val) => val.toUpperCase())
    .optional(),
  entryPrice: z.number().positive().optional(),
  targetPrice: z.number().positive().optional(),
  stopLoss: z.number().positive().optional(),
  status: z.enum(['ACTIVE', 'CLOSED', 'CANCELLED']).optional(),
});

export const signalIdSchema = z.object({
  id: z.string().min(1, 'Signal ID is required'),
});

export const signalQuerySchema = z.object({
  page: z.string().optional().transform((val) => parseInt(val || '1', 10)),
  limit: z.string().optional().transform((val) => parseInt(val || '10', 10)),
  status: z.enum(['ACTIVE', 'CLOSED', 'CANCELLED']).optional(),
  sortBy: z.enum(['createdAt', 'symbol', 'entryPrice']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export type CreateSignalInput = z.infer<typeof createSignalSchema>;
export type UpdateSignalInput = z.infer<typeof updateSignalSchema>;
