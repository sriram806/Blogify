import amqp from 'amqplib';
import redisClient from '../config/redisDB.js';
import { sql } from '../config/db.js';

interface CacheInvalidationMessage {
    action: string;
    keys: string[];
}

export const startCacheConsumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST,
            port: Number(process.env.RABBITMQ_PORT),
            username: process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASSWORD,
        });

        const channel = await connection.createChannel();

        const queueName = 'invalidateCache';
        await channel.assertQueue(queueName, { durable: true });
        console.log('Cache Consumer is waiting for messages...');
        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    const content = JSON.parse(msg.content.toString()) as CacheInvalidationMessage;
                    console.log('Received cache invalidation message for keys:', content.keys);

                    if (content.action === 'invalidateCache') {
                        for (const pattern of content.keys) {
                            const keys = await redisClient.keys(pattern);
                            if (keys.length > 0) {
                                await redisClient.del(keys);
                                console.log(`Invalidated cache for keys: ${keys}`);

                                const searchQuery = ""
                                const category = ""

                                const cacheKey = `blogs:${searchQuery}:${category}`;
                                const blogs = await sql`SELECT * FROM blogs ORDER BY created_at DESC;`;

                                await redisClient.set(cacheKey, JSON.stringify(blogs), { EX: 60 });
                                console.log(`Refreshed cache for key: ${cacheKey}`);
                            }
                        }
                    }
                    channel.ack(msg);
                } catch (error: any) {
                    console.error('Error processing cache invalidation message:', error);
                    channel.nack(msg, false, true);
                }
            }
        })
    } catch (error: any) {
        console.error('Failed to start cache consumer:', error);
    }
}