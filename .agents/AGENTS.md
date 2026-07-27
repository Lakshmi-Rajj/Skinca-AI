# Skincare Platform Project Memory & Guidelines

## Target Repository & Git Remote
- **Workspace Path**: `D:\skincare-platform`
- **Git Remote Repository**: `https://github.com/Lakshmi-Rajj/skincare.git` (Branch: `main`)
- **Auto-Push Policy**: Automatically execute `git add .`, `git commit`, and `git push origin main` after completing work batches.

## Architectural Mandates
1. **NestJS Dependency Injection**:
   - Register all repositories and child services in NestJS `@Module({ providers: [...] })`.
   - Use constructor injection only. Zero manual `new Repository()` instantiations across module bounds.
2. **Service Boundary Isolation**:
   - Consume CustomerModule only via CustomerService.
   - Consume RecommendationModule only via RecommendationService.
   - Consume AIExplanationModule only via AIExplanationService.
   - Consume RoutineModule only via RoutineService.
   - Never access another module's repositories directly.

## Platform Monorepo Applications & Packages
- **`apps/backend-api`**: NestJS REST API server connected to Prisma (PostgreSQL) and Redis cache.
- **`apps/consumer-web`**: B2C Customer Portal React Web Application.
- **`apps/storefront-widget`**: Embeddable Web Component widget (`<skincare-recommendation-widget>`).
- **`apps/admin-dashboard`**: Next.js App Router Executive Analytics Command Center.
- **`apps/consumer-mobile`**: Personal Skincare Companion Mobile Application with native **Android Studio Project** generated at `apps/consumer-mobile/android` (Capacitor).

## Design System & Aesthetics
- **Headings & Titles**: *Playfair Display* / *Cinzel* serif font family (Aesop luxury editorial elegance).
- **Body, Controls & Badges**: *Inter* / *Neue Haas Grotesk* sans-serif (The Ordinary clinical precision).
- **Palette**: Warm Alabaster canvas `#FAF8F5`, Obsidian slate `#1C1917`, 1px hairline dividers (`border-stone-200`).
