import express from 'express';
import cors from 'cors';
import { getRedisClient } from './redis.js';
import { STOCK_SEED } from './products.js';

const app = express();
const port = Number(process.env.PORT || 8084);

app.use(cors());
app.use(express.json());

async function seedStock(redis) {
    for (const product of STOCK_SEED) {
        const key = `stock:${product.id}`;
        const exists = await redis.exists(key);
        if (!exists) {
            await redis.set(key, String(product.stock));
        }
    }
}

app.get('/health', async(_request, response) => {
    response.json({ status: 'ok', service: 'inventory-pu' });
});

app.get('/stock/:productId', async(request, response) => {
    try {
        const redis = await getRedisClient();
        await seedStock(redis);
        const stock = Number((await redis.get(`stock:${request.params.productId}`)) || 0);
        response.json({ productId: request.params.productId, stock });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

app.post('/inventory/reserve', async(request, response) => {
    try {
        const items = Array.isArray(request.body ? .items) ? request.body.items : [];
        if (items.length === 0) {
            return response.status(400).json({ message: 'items are required' });
        }

        const redis = await getRedisClient();
        await seedStock(redis);

        const script = `
      local count = tonumber(ARGV[1])
      for i = 1, count do
        local productId = ARGV[2 + ((i - 1) * 2)]
        local quantity = tonumber(ARGV[3 + ((i - 1) * 2)])
        local key = 'stock:' .. productId
        local current = tonumber(redis.call('GET', key) or '0')
        if current < quantity then
          return {0, productId, current}
        end
      end
      for i = 1, count do
        local productId = ARGV[2 + ((i - 1) * 2)]
        local quantity = tonumber(ARGV[3 + ((i - 1) * 2)])
        local key = 'stock:' .. productId
        redis.call('DECRBY', key, quantity)
      end
      return {1}
    `;

        const scriptArgs = [String(items.length)];
        for (const item of items) {
            scriptArgs.push(String(item.productId), String(item.quantity));
        }

        const result = await redis.eval(script, {
            keys: [],
            arguments: scriptArgs,
        });

        if (Array.isArray(result) && result[0] === 0) {
            return response.status(409).json({
                message: 'Not enough stock',
                productId: result[1],
                currentStock: Number(result[2] || 0),
            });
        }

        response.json({
            message: 'Stock reserved',
            reserved: items,
        });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

async function start() {
    const redis = await getRedisClient();
    await seedStock(redis);
    app.listen(port, () => {
        console.log(`[inventory-pu] running on port ${port}`);
    });
}

start().catch((error) => {
    console.error('[inventory-pu] failed to start', error);
    process.exit(1);
});