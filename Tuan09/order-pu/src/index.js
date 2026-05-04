import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { getRedisClient } from './redis.js';

const app = express();
const port = Number(process.env.PORT || 8083);
const inventoryServiceUrl = process.env.INVENTORY_SERVICE_URL || 'http://localhost:8084';

app.use(cors());
app.use(express.json());

app.get('/health', async(_request, response) => {
    response.json({ status: 'ok', service: 'order-pu' });
});

app.post('/checkout', async(request, response) => {
    try {
        const { userId } = request.body || {};
        if (!userId) {
            return response.status(400).json({ message: 'userId is required' });
        }

        const redis = await getRedisClient();
        const cartKey = `cart:${userId}`;
        const rawCart = await redis.hGetAll(cartKey);
        const cartEntries = Object.entries(rawCart);

        if (cartEntries.length === 0) {
            return response.status(400).json({ message: 'Cart is empty' });
        }

        const items = cartEntries.map(([productId, quantityText]) => ({
            productId,
            quantity: Number(quantityText),
        }));

        const reserveResponse = await fetch(`${inventoryServiceUrl}/inventory/reserve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
        });

        const reserveJson = await reserveResponse.json();
        if (!reserveResponse.ok) {
            return response.status(409).json({ message: reserveJson.message || 'Not enough stock' });
        }

        const orderId = randomUUID();
        const order = {
            orderId,
            userId,
            items,
            status: 'CONFIRMED',
            createdAt: new Date().toISOString(),
        };

        await redis.set(`order:${orderId}`, JSON.stringify(order));
        await redis.lPush(`orders:${userId}`, orderId);
        await redis.del(cartKey);

        response.json({
            message: 'Checkout success',
            orderId,
            reserved: reserveJson.reserved,
            order,
        });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

app.get('/orders/:userId', async(request, response) => {
    try {
        const redis = await getRedisClient();
        const orderIds = await redis.lRange(`orders:${request.params.userId}`, 0, -1);
        const orders = [];

        for (const orderId of orderIds) {
            const rawOrder = await redis.get(`order:${orderId}`);
            if (rawOrder) {
                orders.push(JSON.parse(rawOrder));
            }
        }

        response.json({ orders });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

async function start() {
    await getRedisClient();
    app.listen(port, () => {
        console.log(`[order-pu] running on port ${port}`);
    });
}

start().catch((error) => {
    console.error('[order-pu] failed to start', error);
    process.exit(1);
});