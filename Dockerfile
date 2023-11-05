# Etapa de construcción
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de ejecución
FROM nginx:alpine
COPY --from=builder /app/dist/devui-admin /usr/share/nginx/html
EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
