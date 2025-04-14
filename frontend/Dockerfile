FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm i -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:22-alpine AS production

WORKDIR /app

RUN npm i -g serve

COPY --from=builder /app/dist ./dist

ENV PORT=3000

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]