# Deploying with Node.js 22 to CapRover
FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3001

CMD npx prisma migrate deploy && npm start
