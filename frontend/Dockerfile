FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm i -g pnpm

RUN pnpm install

COPY . .

ARG VITE_BACKEND_URL

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN pnpm run build

FROM node:22-alpine AS production

WORKDIR /app

RUN npm i -g serve

COPY --from=builder /app/dist ./dist

ENV PORT=8080

EXPOSE 8080

CMD [ "serve", "-s", "dist" ]