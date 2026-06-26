# Deploying with Node.js 22 to CapRover
FROM node:22-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
