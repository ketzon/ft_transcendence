FROM node:20-alpine AS builder
WORKDIR /app
COPY website/package*.json ./
RUN npm install
COPY website/ .
RUN npm run build

FROM nginx:alpine
RUN curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
RUN chmod +x mkcert-v*-linux-amd64
RUN cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert
RUN mkcert -install
RUN mkcert localhost 127.0.0.1 ::1
RUN mv localhost+2.pem /etc/nginx
RUN mv localhost+2-key.pem /etc/nginx
COPY --from=builder /app/dist /etc/nginx/html
COPY website/images /etc/nginx/html/images
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
EXPOSE 443
COPY --from=builder /app/dist /etc/nginx/html
CMD ["nginx", "-g", "daemon off;"]
