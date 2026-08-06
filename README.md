# ✦ Skinca AI — Personalized Dermal Science for Your Skin

> An AI-powered skincare companion app built with React + TypeScript + Capacitor (Android), featuring on-device skin analysis, personalized routines, ingredient scanning, and Google OAuth authentication.

---

## 📱 App Overview

Skinca AI is a mobile-first skincare application that combines clinical AI intelligence with a beautiful, premium UI to give users:

- **AI Face Scan** — On-device colorimetry and 3D facial zone analysis
- **Personalized Skincare Routines** — AM/PM routines tailored to your skin profile
- **Ingredient Scanner** — Barcode scan to analyze product ingredients
- **Skin Progress Tracker** — 30-day skin score analytics & journal
- **Google OAuth Sign-In** — Secure Clerk-powered authentication
- **Skin Age Diagnostic** — Chronological vs AI-estimated skin age
- **Discover Catalog** — Curated product recommendations by skin type

---

## 🗂️ Project Structure

```
apps/consumer-mobile/
├── android/                        # Capacitor Android native project
├── public/
│   └── assets/                     # Product & UI images
├── src/
│   ├── App.tsx                     # Root app with tab-based navigation
│   ├── main.tsx                    # React entry point + ClerkProvider
│   ├── design-system.css           # Global design tokens & styles
│   │
│   ├── pages/                      # All 17 app screens
│   │   ├── LoginScreen.tsx         # Welcome & Google OAuth login
│   │   ├── OnboardingScreen.tsx    # 9-step skin questionnaire
│   │   ├── SkinAnalysisDashboard.tsx  # Home dashboard
│   │   ├── ScanScreen.tsx          # AI face scanner
│   │   ├── SkinAnalysisMapScreen.tsx  # 3D facial zone map
│   │   ├── PersonalizedRoutineScreen.tsx
│   │   ├── RecommendedIngredientsScreen.tsx
│   │   ├── RecommendedProductsScreen.tsx
│   │   ├── ProgressTrackerScreen.tsx
│   │   ├── SkinAgeDiagnosticScreen.tsx
│   │   ├── SkinAIChatScreen.tsx    # 24/7 AI dermatologist chat
│   │   ├── DiscoverCatalogScreen.tsx
│   │   ├── LayeringCompatibilityScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── MySpaceJournalScreen.tsx
│   │   └── RecommendationRationaleScreen.tsx
│   │
│   ├── engines/                    # Core AI & business logic
│   │   ├── clerkAuthEngine.ts      # Clerk OAuth authentication
│   │   ├── geminiEngine.ts         # Gemini AI skin analysis
│   │   ├── skinDiagnosticEngine.ts # Skin type diagnosis logic
│   │   ├── routineEngine.ts        # AM/PM routine generation
│   │   ├── ingredientEngine.ts     # Ingredient compatibility engine
│   │   ├── catalogEngine.ts        # Product catalog filtering
│   │   ├── progressEngine.ts       # Skin score & tracker engine
│   │   ├── barcodeEngine.ts        # Barcode/QR scanner engine
│   │   └── inciEngine.ts           # INCI ingredient parser
│   │
│   ├── hooks/
│   │   ├── useMobileState.ts       # Global state + localStorage persistence
│   │   └── useAssessment.ts        # Skin assessment hook
│   │
│   ├── components/
│   │   ├── Icons.tsx               # Custom SVG icons
│   │   ├── LiveSkinAnalyzerScanner.tsx  # Camera scanner component
│   │   ├── ProPaywallModal.tsx     # PRO subscription modal
│   │   └── ProductImage.tsx        # Smart product image loader
│   │
│   ├── types/
│   │   └── mobile.types.ts         # All TypeScript interfaces & types
│   │
│   └── utils/
│       ├── currencyUtils.ts        # Multi-currency (INR/USD/EUR) formatting
│       ├── avatarUtils.ts          # User avatar helper
│       ├── premium.ts              # PRO feature gate logic
│       └── storage.ts              # LocalStorage helpers
│
├── .env.example                    # Environment variable template
├── index.html                      # Vite HTML entry
├── package.json
└── vite.config.ts                  # Vite + React build config
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js >= 18
- pnpm >= 9

### 2. Clone & Install
```bash
git clone https://github.com/Lakshmi-Rajj/Skinca-AI.git
cd Skinca-AI/apps/consumer-mobile
```

### 3. Configure Environment
```bash
cp .env.example .env
# Fill in your Clerk Publishable Key and API Base URL
```

### 4. Run Dev Server
```bash
npx vite --port 3000
```

Open **http://localhost:3000** in your browser.

---

## 🔐 Authentication (Clerk)

This app uses **[Clerk](https://clerk.com)** for authentication.

- Supports **Google OAuth** and **Email + Password**
- Session tokens stored securely via Clerk SDK
- After sign-in, users are redirected to the onboarding questionnaire

To configure:
1. Create a project at [dashboard.clerk.com](https://dashboard.clerk.com)
2. Copy your **Publishable Key** into `.env`:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```

---

## 🧬 Tech Stack

| Layer | Technology |
|---|---|
| **UI Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Mobile** | Capacitor 6 (Android) |
| **Auth** | Clerk React SDK |
| **AI Engine** | Google Gemini API |
| **State** | Custom hooks + localStorage |
| **Styling** | Vanilla CSS + inline styles |
| **Toast Alerts** | react-hot-toast |

---

## 📸 Key Screens

| Screen | Description |
|---|---|
| Welcome & Login | Glassmorphic hero with Google OAuth |
| Skin Questionnaire | 9-step diagnostic onboarding |
| AI Dashboard | Personalized skin analysis results |
| Face Scanner | Live camera-based skin colorimetry |
| Ingredient Scanner | Barcode scan + INCI analysis |
| Skin Journal | Daily condition log with photos |
| Routine Planner | AM/PM routine with product cards |

---

## 🏗️ Android APK Build

```bash
cd apps/consumer-mobile
npx vite build          # Build production bundle
npx cap sync android    # Sync to Android project
npx cap open android    # Open in Android Studio
```

---

## 👤 Author

**Lakshmi Raj** — [github.com/Lakshmi-Rajj](https://github.com/Lakshmi-Rajj)

---

> Built with ✦ Skinca AI — Clinical AI Intelligence for Every Skin Type
