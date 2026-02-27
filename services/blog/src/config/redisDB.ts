import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const getRedisUrl = () => {
  const rawUrl = process.env.REDIS_DB;

  if (!rawUrl) {
    throw new Error('REDIS_DB is not configured');
  }

  if (rawUrl.startsWith('redis://') && rawUrl.includes('upstash.io')) {
    const secureUrl = rawUrl.replace('redis://', 'rediss://');
    console.warn('Redis URL updated to use TLS (rediss://) for Upstash');
    return secureUrl;
  }

  return rawUrl;
};

const redisClient = createClient({
  url: getRedisUrl(),
    socket: {
    connectTimeout: 10000,
    keepAlive: true,
        reconnectStrategy: (retries) => {
      if (retries > 20) {
        console.error('Redis: reconnecting for a while, continuing with 5s backoff');
            }

      return Math.min(250 * 2 ** retries, 5000);
        },
    },
});

redisClient.on('connect', () => {
  console.log('Redis socket connected');
});

redisClient.on('ready', () => {
  console.log('Redis client ready');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err.message);
});

export default redisClient;

export const clearBlogCache = async () => {
  try {
    const keys = await redisClient.keys("blogs:*");

    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log("Blog cache cleared");
    }
  } catch (err: any) {
    console.error("Cache clear error:", err.message);
  }
};