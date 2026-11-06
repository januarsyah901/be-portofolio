FROM node:22-slim

WORKDIR /usr/src/app

# Install OpenSSL for Prisma engine
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
# The schema must exist before `prisma generate` (also run by the postinstall hook).
COPY prisma ./prisma

RUN npm ci && npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3001

CMD ./node_modules/.bin/prisma generate && ./node_modules/.bin/prisma migrate deploy && npx ts-node prisma/seed.ts && PORT=80 npm start
