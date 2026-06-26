# Deploying with Node.js 22 to CapRover
FROM node:22-slim

WORKDIR /usr/src/app

# Install OpenSSL for Prisma engine
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install && npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3001

CMD npx prisma migrate deploy && npm start
