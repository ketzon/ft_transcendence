# Uses alpine instead of debian because it is more lightweight
FROM node:23-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy requirements list to docker and install them
COPY package*.json .
RUN npm install

# Copy remaining files to docker
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
