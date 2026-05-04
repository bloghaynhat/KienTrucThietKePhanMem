FROM node:20-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

ARG VITE_PRODUCT_API_URL=http://localhost:8081
ARG VITE_CART_API_URL=http://localhost:8082
ARG VITE_ORDER_API_URL=http://localhost:8083
ENV VITE_PRODUCT_API_URL=${VITE_PRODUCT_API_URL}
ENV VITE_CART_API_URL=${VITE_CART_API_URL}
ENV VITE_ORDER_API_URL=${VITE_ORDER_API_URL}

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
