# Etapa de construcción
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:website

# Etapa de ejecución
FROM nginx:alpine
COPY --from=builder /app/dist/siscope/*.html /usr/share/nginx/html
#COPY --from=builder /app/dist/siscope/*.js /usr/share/nginx/html
COPY --from=builder /app/dist/ /usr/share/nginx/html
EXPOSE 80

