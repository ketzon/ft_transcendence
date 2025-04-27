FROM node:20-alpine AS builder
WORKDIR /app
COPY website/package*.json ./
RUN npm install
COPY website/ .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /etc/nginx/html
COPY website/images /etc/nginx/html/images
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]