FROM node:20-alpine AS builder
WORKDIR /app
COPY website/package*.json ./
RUN npm install
COPY website/ .
RUN npm run build

FROM nginx:alpine
RUN apk add python3 py3-virtualenv augeas-libs
RUN python3 -m venv /opt/certbot/
RUN /opt/certbot/bin/pip install --upgrade pip
RUN /opt/certbot/bin/pip install certbot certbot-nginx
RUN ln -s /opt/certbot/bin/certbot /usr/bin/certbot
COPY --from=builder /app/dist /etc/nginx/html
COPY website/images /etc/nginx/html/images
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
COPY --from=builder /app/dist /etc/nginx/html
CMD ["nginx", "-g", "daemon off;"]
