# Flash Sale Space-Based Architecture

This workspace contains 5 independent apps that you can copy to 5 different machines:

- `frontend/` - ReactJS UI on port `3000`
- `product-pu/` - Product Processing Unit on port `8081`
- `cart-pu/` - Cart Processing Unit on port `8082`
- `order-pu/` - Order Processing Unit on port `8083`
- `inventory-pu/` - Inventory Processing Unit on port `8084`

All backend services share the same Redis Data Grid.

## LAN layout

```text
Redis          192.168.x.x:6379
PU1 Product    192.168.x.x:8081
PU2 Cart       192.168.x.x:8082
PU3 Order      192.168.x.x:8083
PU4 Inventory  192.168.x.x:8084
Frontend       192.168.x.x:3000
```

## Run each service

Install dependencies in each folder separately:

```bash
cd frontend && npm install
cd ../product-pu && npm install
cd ../cart-pu && npm install
cd ../order-pu && npm install
cd ../inventory-pu && npm install
```

Set environment variables in each machine:

- `REDIS_URL=redis://192.168.x.x:6379`
- `PORT=8081` / `8082` / `8083` / `8084`
- `PRODUCT_SERVICE_URL=http://192.168.x.x:8081`
- `CART_SERVICE_URL=http://192.168.x.x:8082`
- `ORDER_SERVICE_URL=http://192.168.x.x:8083`
- `INVENTORY_SERVICE_URL=http://192.168.x.x:8084`
- `VITE_PRODUCT_API_URL=http://192.168.x.x:8081`
- `VITE_CART_API_URL=http://192.168.x.x:8082`
- `VITE_ORDER_API_URL=http://192.168.x.x:8083`

You can copy the matching `.env.example` file in each folder and rename it to `.env`.

Start commands:

```bash
cd product-pu && npm run dev
cd cart-pu && npm run dev
cd order-pu && npm run dev
cd inventory-pu && npm run dev
cd frontend && npm run dev
```

## Docker

Each service now has its own `Dockerfile`. Build them from the service folder, for example:

```bash
cd frontend && docker build -t flash-sale-frontend .
cd ../product-pu && docker build -t product-pu .
cd ../cart-pu && docker build -t cart-pu .
cd ../order-pu && docker build -t order-pu .
cd ../inventory-pu && docker build -t inventory-pu .
```

## API summary

### Product PU

- `GET /products`
- `GET /products/:id`

### Cart PU

- `POST /cart/add`
- `GET /cart?userId=...`

### Order PU

- `POST /checkout`

### Inventory PU

- `GET /stock/:productId`
- `POST /inventory/reserve`
