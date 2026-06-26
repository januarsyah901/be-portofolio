# Deploying with Node.js 22 to CapRover
FROM node:22-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install && npx prisma generate

RUN npm run build

EXPOSE 3001

CMD npx prisma migrate deploy && npm start
