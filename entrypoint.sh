#!/bin/sh
set -e

echo "==> Generating Prisma Client..."
./node_modules/.bin/prisma generate

echo "==> Waiting for postgres-db to accept connections..."
sleep 4

echo "==> Running Prisma migration deploy..."
./node_modules/.bin/prisma migrate deploy

echo "==> Running Prisma seed..."
npx ts-node prisma/seed.ts || echo "Seed finished"

echo "==> Starting backend application on port ${PORT:-3001}..."
exec node dist/index.js
