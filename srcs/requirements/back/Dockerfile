# Uses alpine instead of debian because it is more lightweight
FROM node:23-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy requirements list to docker and install them
COPY package*.json ./
RUN npm install

# Copy remaining files to docker
COPY . .

RUN apk add curl
RUN curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
RUN chmod +x mkcert-v*-linux-amd64
RUN cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert
RUN mkcert -install
RUN mkcert localhost
RUN mv ./localhost.pem /usr/src/app/srcs/localhost.pem
RUN mv ./localhost-key.pem /usr/src/app/srcs/localhost-key.pem

RUN cd prisma ; npx prisma migrate reset

EXPOSE 3000

CMD ["npm", "start"]
