import Redis from 'ioredis';
import { env } from './env';

let redis: Redis | null = null;

export const getRedis = (): Redis => {
  if (!redis) {
    try {
      redis = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > 3) {
            console.warn('[Redis] Max retries reached, operating without Redis');
            return null;
          }
          return Math.min(times * 200, 2000);
        },
        lazyConnect: true,
      });

      redis.on('error', (err) => {
        console.warn('[Redis] Connection error:', err.message);
      });

      redis.on('connect', () => {
        console.log('[Redis] Connected successfully');
      });
    } catch (err) {
      console.warn('[Redis] Failed to initialize:', err);
    }
  }
  return redis!;
};

// Graceful fallback: if Redis is unavailable, these become no-ops
export const safeRedisSet = async (key: string, value: string, ttlSeconds?: number): Promise<void> => {
  try {
    const client = getRedis();
    if (ttlSeconds) {
      await client.set(key, value, 'EX', ttlSeconds);
    } else {
      await client.set(key, value);
    }
  } catch {
    console.warn('[Redis] SET failed, skipping');
  }
};

export const safeRedisGet = async (key: string): Promise<string | null> => {
  try {
    const client = getRedis();
    return await client.get(key);
  } catch {
    console.warn('[Redis] GET failed, returning null');
    return null;
  }
};

export const safeRedisDel = async (key: string): Promise<void> => {
  try {
    const client = getRedis();
    await client.del(key);
  } catch {
    console.warn('[Redis] DEL failed, skipping');
  }
};
