# ✦ Skinca AI — Master System Prompt & Architecture Specs

> **For Developers & AI Assistants**: This document contains the complete system prompt, architectural specifications, tech stack details, and feature guidelines for the **Skinca AI** application.

---

## 🎯 Master Prompt / Product Vision

```markdown
You are building Skinca AI — a premium, clinical-grade mobile skincare companion web & native Android app.

The application leverages on-device colorimetry, computer vision, and AI diagnostics to analyze user skin health, calculate clinical metrics (hydration, redness, pigmentation, acne risk, sensitivity, barrier health), generate personalized AM/PM skincare routines, guide ingredient compatibility, and track skin progress over time.

### Core Principles & Aesthetic Requirements:
1. Mobile-first responsive UX: Designed primarily for smartphone viewports (390-430px) with clean bottom navigation and optional desktop container wrapper.
2. Premium Clinical Aesthetic: Deep dark-teal and jade-green accent themes (#0a1210 dark background, #326859 primary jade, #6ee7b7 mint accents, glassmorphic card overlays, smooth gradients, crisp typography).
3. Zero Emojis in Core UI: Use clean, vector SVG icons (defined in src/components/Icons.tsx) across all screens, questionnaires, and navigation elements.
4. Rich Functionality over MVPs: Complete end-to-end user flows including Google OAuth login (Clerk), 9-step clinical onboarding questionnaire, live camera skin scanner, 3D dermal zone map, ingredient barcode/INCI compatibility checker, multi-currency shop catalog, and skin progress tracking.
```

---

## 🔗 Repository Information

- **GitHub Repository**: [https://github.com/Lakshmi-Rajj/Skinca-AI](https://github.com/Lakshmi-Rajj/Skinca-AI)
- **Live Demo (Vercel)**: [https://skinca-ai.vercel.app](https://skinca-ai.vercel.app)
- **Branch**: `main`

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Native Wrapper** | Capacitor 6 (Android) |
| **Authentication** | Clerk React SDK (`@clerk/clerk-react`) |
| **AI Intelligence** | Google Gemini API (`@google/genai`) |
| **State Management** | Custom hooks (`useMobileState.ts`) + `localStorage` persistence |
| **Styling** | Vanilla CSS (`design-system.css`) + React inline styles |
| **Icons** | Custom inline SVG icon system (`Icons.tsx`) |
| **Notifications** | `@capacitor/local-notifications` |
| **In-App Browser** | `@capacitor/browser` |
| **Toast Alerts** | `react-hot-toast` |

---

## 📁 Key File Map & Architecture

```
skincare-platform/
├── android/                        # Native Android Gradle Project
├── public/                         # Public assets & product images
├── src/
│   ├── App.tsx                     # Main app router, tab navigation & deep link listener
│   ├── main.tsx                    # React entry point + ClerkProvider
│   ├── design-system.css           # Global design tokens, scroll resets & animations
│   │
│   ├── pages/                      # Application Screens (17 total)
│   │   ├── LoginScreen.tsx         # Welcome hero & Google OAuth / Email sign-in
│   │   ├── OnboardingScreen.tsx    # 9-step clinical questionnaire flow
│   │   ├── SkinAnalysisDashboard.tsx  # Main Home screen & score breakdown
│   │   ├── ScanScreen.tsx          # Real-time camera face scanner
│   │   ├── SkinAnalysisMapScreen.tsx  # Interactive 3D skin zone map
│   │   ├── PersonalizedRoutineScreen.tsx # AM/PM routine planner & cards
│   │   ├── RecommendedIngredientsScreen.tsx # Ingredient guide & compatibility
│   │   ├── RecommendedProductsScreen.tsx    # Skincare product recommendations
│   │   ├── ProgressTrackerScreen.tsx       # 30-day adherence graph & metrics
│   │   ├── SkinAgeDiagnosticScreen.tsx     # Chronological vs Dermal Age card
│   │   ├── SkinAIChatScreen.tsx            # AI Dermatologist chat interface
│   │   ├── DiscoverCatalogScreen.tsx       # Product shop with search & details
│   │   ├── ProductDetailScreen.tsx         # Full product detail view with buy links
│   │   ├── LayeringCompatibilityScreen.tsx # Ingredient layering conflict checker
│   │   ├── MySpaceJournalScreen.tsx        # Daily skin log & photo journal
│   │   ├── ProfileScreen.tsx               # Clinical profile & settings
│   │   └── RecommendationRationaleScreen.tsx
│   │
│   ├── engines/                    # Core Clinical & Business Logic
│   │   ├── clerkAuthEngine.ts      # Auth normalization & user profiles
│   │   ├── geminiEngine.ts         # Google Gemini AI skin diagnostic calls
│   │   ├── skinDiagnosticEngine.ts # Diagnostic scoring logic
│   │   ├── routineEngine.ts        # Dynamic AM/PM routine generator
│   │   ├── ingredientEngine.ts     # Ingredient safety & conflict analyzer
│   │   ├── catalogEngine.ts        # Product catalog filtering & search
│   │   ├── progressEngine.ts       # Adherence tracking & score calculations
│   │   ├── barcodeEngine.ts        # Product barcode & QR code parser
│   │   └── inciEngine.ts           # INCI ingredient list analyzer
│   │
│   ├── hooks/
│   │   ├── useMobileState.ts       # Global state manager & local storage sync
│   │   └── useAssessment.ts        # Questionnaire assessment state
│   │
│   ├── components/
│   │   ├── Icons.tsx               # Reusable clean SVG icon components
│   │   ├── LiveSkinAnalyzerScanner.tsx  # Camera video stream & canvas overlay
│   │   ├── ProPaywallModal.tsx     # Skinca PRO subscription modal
│   │   └── ProductImage.tsx        # Fallback image loader for products
│   │
│   └── types/
│       └── mobile.types.ts         # Global TypeScript interfaces & data models
│
├── capacitor.config.json           # Capacitor Android configuration
├── package.json
└── vite.config.ts
```

---

## ⚡ Setup & Development Instructions

### 1. Local Web Development
```bash
git clone https://github.com/Lakshmi-Rajj/Skinca-AI.git
cd Skinca-AI
npm install
npm run dev
```
Dev server will start at `http://localhost:5173`.

### 2. Building for Web (Production / Vercel)
```bash
npm run build
```

### 3. Android Native Development & APK Build
```bash
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```
Output APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📋 Recommended Next Steps for Saturday
1. **Google OAuth Production Client ID**: Ensure your Clerk Dashboard contains the production Android SHA-1 fingerprint for seamless native Google Sign-In.
2. **Push Notifications**: Backend integration for background scheduling via `@capacitor/local-notifications`.
3. **Product Catalog Expansion**: Expand `catalogEngine.ts` with more skincare brand SKUs.
