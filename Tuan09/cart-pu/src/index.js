import express from 'express';
import cors from 'cors';
import { getRedisClient } from './redis.js';

const app = express();
const port = Number(process.env.PORT || 8082);
const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8081';

app.use(cors());
app.use(express.json());

async function fetchProduct(productId) {
    const response = await fetch(`${productServiceUrl}/products/${encodeURIComponent(productId)}`);
    if (!response.ok) {
        return null;
    }

    const data = await response.json();
    return data.product || null;
}

app.get('/health', async(_request, response) => {
    response.json({ status: 'ok', service: 'cart-pu' });
});

app.post('/cart/add', async(request, response) => {
    try {
        const { userId, productId, quantity = 1 } = request.body || {};
        if (!userId || !productId || Number(quantity) <= 0) {
            return response.status(400).json({ message: 'userId, productId and quantity are required' });
        }

        const product = await fetchProduct(productId);
        if (!product) {
            return response.status(404).json({ message: 'Product not found' });
        }

        const redis = await getRedisClient();
        const cartKey = `cart:${userId}`;
        await redis.hIncrBy(cartKey, productId, Number(quantity));
        await redis.expire(cartKey, 60 * 60 * 24 * 7);

        response.json({ message: 'Added to cart', userId, productId, quantity: Number(quantity) });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

app.get('/cart', async(request, response) => {
    try {
        const userId = request.query.userId;
        if (!userId) {
            return response.status(400).json({ message: 'userId is required' });
        }

        const redis = await getRedisClient();
        const cartKey = `cart:${userId}`;
        const rawItems = await redis.hGetAll(cartKey);
        const entries = Object.entries(rawItems);

        if (entries.length === 0) {
            return response.json({ userId, items: [], totalItems: 0, totalPrice: 0 });
        }

        const enrichedItems = [];
        for (const [productId, quantityText] of entries) {
            const quantity = Number(quantityText);
            const product = await fetchProduct(productId);
            enrichedItems.push({
                productId,
                quantity,
                name: product ? .name || `Product ${productId}`,
                price: product ? .price || 0,
                subtotal: (product ? .price || 0) * quantity,
            });
        }

        const totalItems = enrichedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = enrichedItems.reduce((sum, item) => sum + item.subtotal, 0);

        response.json({ userId, items: enrichedItems, totalItems, totalPrice });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

app.delete('/cart', async(request, response) => {
    try {
        const userId = request.query.userId;
        if (!userId) {
            return response.status(400).json({ message: 'userId is required' });
        }

        const redis = await getRedisClient();
        await redis.del(`cart:${userId}`);
        response.json({ message: 'Cart cleared' });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

async function start() {
    await getRedisClient();
    app.listen(port, () => {
        console.log(`[cart-pu] running on port ${port}`);
    });
}

start().catch((error) => {
    console.error('[cart-pu] failed to start', error);
    process.exit(1);
});