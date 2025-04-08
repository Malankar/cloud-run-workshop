FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i -g pnpm

RUN pnpm install

RUN npm i -g serve

COPY . .

RUN pnpm run build

ENV PORT=8080

EXPOSE 8080

CMD [ "serve", "-s", "dist" ]