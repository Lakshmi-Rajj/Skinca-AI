# Multi-stage production Dockerfile for NestJS Backend API

# Stage 1: Build & Prune Workspace
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm@9.1.0

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json .editorconfig ./
COPY config ./config
COPY packages ./packages
COPY apps/backend-api ./apps/backend-api

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @platform/backend-api... build

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm@9.1.0
ENV NODE_ENV=production

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/backend-api/package.json ./apps/backend-api/package.json
COPY --from=builder /app/apps/backend-api/dist ./apps/backend-api/dist

RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["node", "apps/backend-api/dist/main.js"]
