FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

FROM node:22-alpine

WORKDIR /app

# Install pnpm in final image (if app needs it at runtime)
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app ./

ENV PORT=8080
EXPOSE 8080

CMD ["pnpm", "start"]
