import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST,
            port: Number(process.env.RABBITMQ_PORT),
            username: process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASSWORD,
        });

        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error: any) {
        console.error('RabbitMQ connection error:', error);
        throw error;
    }
}

export const publishToQueue = async (queueName: string, message: any) => {
    if (!channel) {
        console.error('RabbitMQ channel is not established');
        return;
    }

    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
}

export const invalidateCache = async (cacheKey: string[]) => {
    try {
        const message = {
            action: "invalidateCache",
            keys: cacheKey
        };

        await publishToQueue('invalidateCache', message);

        console.log('Cache invalidation message published for keys:', cacheKey);
    } catch (error: any) {
        console.error('Error invalidating cache:', error);
    }
}