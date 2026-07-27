# Local Development Setup Guide

Welcome to the B2B SaaS Skincare Recommendation Platform monorepo local setup guide.

## Prerequisites

- **Node.js**: v20.0.0 or higher
- **pnpm**: v9.1.0 or higher (`npm install -g pnpm@9.1.0`)
- **Docker & Docker Desktop**: Installed and running
- **Python**: v3.11 or higher (for engine/worker local development)

## Quick Start (Single Command Infrastructure)

Start PostgreSQL database and Redis cache locally via Docker Compose:

```bash
# Start local containers
pnpm docker:up

# Check container status
docker compose ps
```

## Running Applications Locally

```bash
# Install workspace dependencies
pnpm install

# Run build across all packages and apps
pnpm build

# Start local development servers across monorepo
pnpm dev
```

## Local Port Mappings

| Service | Port | Endpoint / Target |
| :--- | :--- | :--- |
| **PostgreSQL Database** | `5432` | `localhost:5432/skincare_db` |
| **Redis Cache** | `6379` | `localhost:6379` |
| **NestJS Backend API** | `3000` | `http://localhost:3000` |
| **Next.js Admin Dashboard** | `3001` | `http://localhost:3001` |
| **Python FastAPI Engine** | `8000` | `http://localhost:8000/health` |
| **Storefront Widget CDN Host** | `8080` | `http://localhost:8080/widget.js` |
