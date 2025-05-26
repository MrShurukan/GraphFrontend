# Этап сборки
FROM node:20-alpine AS build
WORKDIR /app

# Копируем package.json и зависимости
COPY package*.json ./
RUN npm install

# Копируем остальной исходный код и билдим
COPY . .
RUN npm run build

# Этап для копирования билда — без запуска сервера
FROM alpine:3.18 AS export
WORKDIR /export
COPY --from=build /app/dist .

# Этот Dockerfile просто собирает dist/ — nginx его монтирует как volume