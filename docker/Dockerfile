FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:20-alpine AS prod

RUN apk add --no-cache nginx

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/prisma.config.ts ./prisma.config.ts
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/start.sh /start.sh

RUN chmod +x /start.sh

ENV PORT=3000

EXPOSE 80

CMD ["/start.sh"]