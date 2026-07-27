# Production Dockerfile for Storefront Widget CDN bundle distribution

FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm@9.1.0

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json .editorconfig ./
COPY config ./config
COPY packages ./packages
COPY apps/storefront-widget ./apps/storefront-widget

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @platform/storefront-widget build

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/storefront-widget/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
