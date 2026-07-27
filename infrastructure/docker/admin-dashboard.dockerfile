# Multi-stage production Dockerfile for Next.js Admin Dashboard

FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm@9.1.0

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json .editorconfig ./
COPY config ./config
COPY packages ./packages
COPY apps/admin-dashboard ./apps/admin-dashboard

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @platform/admin-dashboard build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/apps/admin-dashboard/public ./public
COPY --from=builder /app/apps/admin-dashboard/.next/standalone ./
COPY --from=builder /app/apps/admin-dashboard/.next/static ./.next/static

EXPOSE 3001

CMD ["node", "server.js"]
