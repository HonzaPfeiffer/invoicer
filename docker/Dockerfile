FROM node:20-alpine AS base

WORKDIR /app

COPY ../package.json ../package-lock.json* ./

RUN npm ci --omit=dev

COPY ../ ./

RUN npx prisma generate

RUN npm run build

FROM node:20-alpine AS prod

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/package.json ./package.json

ENV PORT 3000

CMD ["npm", "start"]