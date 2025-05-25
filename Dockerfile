# 1. Build stage
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 2. Serve stage (статические файлы в nginx)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html