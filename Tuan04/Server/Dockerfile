# Sử dụng image Node.js 18
FROM node:18

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file package.json vào container
COPY package.json .

# Cài dependencies (không có cũng vẫn chạy nhưng nên giữ chuẩn)
RUN npm install

# Copy toàn bộ source code
COPY . .

# Mở cổng 3000
EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "start"]