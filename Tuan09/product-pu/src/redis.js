import { createClient } from 'redis';

let client;

export async function getRedisClient() {
    if (!client) {
        client = createClient({ url: process.env.REDIS_URL || 'redis://127.0.0.1:6379' });
        client.on('error', (error) => {
            console.error('[product-pu] Redis error', error);
        });
        await client.connect();
    }

    return client;
}