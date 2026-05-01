import prisma from '../../config/prisma';
import { CreateSignalInput, UpdateSignalInput } from './signal.schema';
import { SignalStatus } from '@prisma/client';

export class SignalService {
  /**
   * Create a new trade signal (Admin only)
   */
  async create(input: CreateSignalInput, userId: string) {
    const signal = await prisma.signal.create({
      data: {
        symbol: input.symbol,
        entryPrice: input.entryPrice,
        targetPrice: input.targetPrice,
        stopLoss: input.stopLoss,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: { id: true, email: true },
        },
      },
    });

    return signal;
  }

  /**
   * Get all signals with pagination and filtering
   */
  async findAll(options: {
    page: number;
    limit: number;
    status?: string;
    sortBy?: string;
    order?: string;
  }) {
    const { page = 1, limit = 10, status, sortBy = 'createdAt', order = 'desc' } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status as SignalStatus;
    }

    const [signals, total] = await Promise.all([
      prisma.signal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
          createdBy: {
            select: { id: true, email: true },
          },
        },
      }),
      prisma.signal.count({ where }),
    ]);

    return {
      signals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  /**
   * Get a single signal by ID
   */
  async findById(id: string) {
    const signal = await prisma.signal.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, email: true },
        },
      },
    });

    if (!signal) {
      throw { statusCode: 404, message: 'Signal not found.' };
    }

    return signal;
  }

  /**
   * Update a signal (Admin only)
   */
  async update(id: string, input: UpdateSignalInput) {
    // Verify signal exists
    await this.findById(id);

    const signal = await prisma.signal.update({
      where: { id },
      data: input,
      include: {
        createdBy: {
          select: { id: true, email: true },
        },
      },
    });

    return signal;
  }

  /**
   * Delete a signal (Admin only)
   */
  async delete(id: string) {
    // Verify signal exists
    await this.findById(id);

    await prisma.signal.delete({
      where: { id },
    });

    return { message: 'Signal deleted successfully.' };
  }
}

export const signalService = new SignalService();
