# Using alpine instead of debian because it's more lightweight
FROM nginx:alpine

COPY website /etc/nginx/html/index.html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
