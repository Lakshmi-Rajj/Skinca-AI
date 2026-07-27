# B2B SaaS Multi-Tenant Skincare Recommendation Platform Monorepo

Enterprise-grade B2B multi-tenant skincare recommendation platform engineered with NestJS, FastAPI, Prisma ORM, PostgreSQL, Redis, Next.js, and Turborepo.

## System Architecture

```
skincare-platform/
├── apps/
│   ├── backend-api/               # NestJS API Gateway & Operations Monolith (Port 3000)
│   ├── recommendation-engine/     # Python FastAPI 6-Stage Deterministic Recommendation Engine (Port 8000)
│   ├── ai-explanation-worker/     # Python AI Routine Explanation Worker (Port 8001)
│   ├── storefront-widget/         # Production JavaScript Storefront Embed SDK (Port 5173)
│   └── admin-dashboard/           # Next.js 14 App Router B2B Operations Portal (Port 3001)
└── packages/
    ├── database-client/           # Prisma Client ORM & Repositories
    ├── dermatological-rules/     # Shared Dermatological Compatibility Rules
    ├── api-contracts/             # Shared TypeScript DTOs
    ├── proto-contracts/           # gRPC Protobuf Engine Specifications
    ├── config/                    # Shared Environment Configurations
    ├── logger/                    # Structured Logger Package
    └── ui-components/             # Shared Design System Components
```

## Quick Start & Local Setup

### 1. Prerequisites
- Node.js >= 18.0.0
- pnpm >= 9.0.0
- Python >= 3.11
- Docker & Docker Compose

### 2. Installation
```bash
# Install monorepo dependencies
pnpm install

# Start local PostgreSQL 16 & Redis 7 infrastructure
pnpm docker:up

# Generate Prisma Client ORM
pnpm prisma:generate

# Run development servers across monorepo
pnpm dev
```

### 3. Build & Verification
```bash
# Run Turborepo build pipeline
pnpm run build
```
