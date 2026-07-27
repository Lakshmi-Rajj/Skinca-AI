# Docker Architecture & Usage Guide

## Docker Architecture

The platform provides multi-stage production-ready Dockerfiles located under `infrastructure/docker/`:

- `backend-api.dockerfile`: NestJS API runner with multi-stage pnpm build
- `admin-dashboard.dockerfile`: Next.js standalone runner
- `recommendation-engine.dockerfile`: Python 3.11 FastAPI runner with NumPy & PyDantic
- `ai-worker.dockerfile`: Python 3.11 SQS worker daemon
- `storefront-widget.dockerfile`: Ultra-lightweight Nginx static distribution container

## Local Docker Compose Setup

Run the full platform stack locally:

```bash
# Build all local container images
pnpm docker:build

# Launch full stack in detached mode
pnpm docker:up

# View container logs
docker compose logs -f

# Stop and tear down local stack
pnpm docker:down
```
