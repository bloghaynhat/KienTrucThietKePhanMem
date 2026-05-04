import express from 'express';
import cors from 'cors';
import { getRedisClient } from './redis.js';
import { PRODUCTS } from './products.js';

const app = express();
const port = Number(process.env.PORT || 8081);

app.use(cors());
app.use(express.json());

async function seedProducts(redis) {
    const listExists = await redis.exists('products:list');
    if (listExists) {
        return;
    }

    const pipeline = redis.multi();
    pipeline.set('products:list', JSON.stringify(PRODUCTS));
    for (const product of PRODUCTS) {
        pipeline.set(`product:${product.id}`, JSON.stringify(product));
    }
    await pipeline.exec();
}

app.get('/health', async(_request, response) => {
    response.json({ status: 'ok', service: 'product-pu' });
});

app.get('/products', async(_request, response) => {
    try {
        const redis = await getRedisClient();
        await seedProducts(redis);
        const products = JSON.parse((await redis.get('products:list')) || '[]');
        response.json({ products });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

app.get('/products/:id', async(request, response) => {
    try {
        const redis = await getRedisClient();
        await seedProducts(redis);
        const product = await redis.get(`product:${request.params.id}`);
        if (!product) {
            return response.status(404).json({ message: 'Product not found' });
        }

        response.json({ product: JSON.parse(product) });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

async function start() {
    const redis = await getRedisClient();
    await seedProducts(redis);
    app.listen(port, () => {
        console.log(`[product-pu] running on port ${port}`);
    });
}

start().catch((error) => {
    console.error('[product-pu] failed to start', error);
    process.exit(1);
});