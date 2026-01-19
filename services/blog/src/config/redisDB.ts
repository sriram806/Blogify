import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();
const redisClient = createClient({
    url: process.env.REDIS_DB,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 3) {
                console.error('Redis: Max reconnection attempts');
                return new Error('Max retries');
            }
            return Math.min(retries * 100, 3000);
        },
    },
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