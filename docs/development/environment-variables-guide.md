# Environment Variables Guide

## Overview

Environment variables are validated at application runtime using Zod in `config/environment/env.schema.ts`.

## Variable Matrix

| Variable | Description | Default / Example | Required |
| :--- | :--- | :--- | :---: |
| `NODE_ENV` | Application environment (`development`, `staging`, `production`) | `development` | Yes |
| `PORT` | Listening HTTP port for backend service | `3000` | Yes |
| `DATABASE_URL` | PostgreSQL connection string with schema context | `postgresql://...` | Yes |
| `REDIS_URL` | Redis cache connection string | `redis://localhost:6379` | Yes |
| `AUTH0_DOMAIN` | Auth0 tenant domain identifier | `auth.skincareplatform.com` | Yes |
| `AUTH0_AUDIENCE` | Auth0 API identifier audience | `https://api.skincareplatform.com/v1/` | Yes |
| `WIDGET_JWT_PUBLIC_KEY` | RS256 public key for verifying storefront widget sessions | `-----BEGIN PUBLIC KEY...` | Yes |
| `AWS_REGION` | Primary AWS region | `us-east-1` | No |
| `ANTHROPIC_API_KEY` | Anthropic Claude API Key for AI Explanation Worker | `sk-ant-api...` | No |
