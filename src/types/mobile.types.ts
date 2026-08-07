// ============================================================
// CONSUMER MOBILE APP - COMPLETE TYPE DEFINITIONS
// ============================================================

export type Gender = 'FEMALE' | 'MALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY';
export type SkinType = 'DRY' | 'OILY' | 'COMBINATION' | 'SENSITIVE' | 'NORMAL';
export type SkinConcern =
  | 'acne' | 'hyperpigmentation' | 'redness' | 'wrinkles'
  | 'dryness' | 'oiliness' | 'pores' | 'dullness'
  | 'blackheads' | 'sensitivity' | 'uneven_texture';
export type SensitivityLevel = 'LOW' | 'MODERATE' | 'HIGH';
export type AgeRange = '18-24' | '25-34' | '35-44' | '45-54' | '55+';
export type Climate = 'HUMID' | 'DRY' | 'COLD' | 'TROPICAL' | 'TEMPERATE';
export type BudgetTier = 'MASS' | 'MID' | 'LUXURY';
export type SubscriptionTier = 'FREE' | 'PREMIUM';


import type { Currency } from '../utils/currencyUtils';

export interface UserProfile {
  id?: string;
  userId?: string;
  avatarUrl?: string;
  gender: Gender;
  skinType: SkinType;
  primaryConcern: SkinConcern;
  secondaryConcern?: SkinConcern;
  sensitivity: SensitivityLevel;
  ageRange: AgeRange;
  climate: Climate;
  budget: BudgetTier;
  currency: Currency;
  budgetMinInINR: number;
  budgetMaxInINR: number;
  analysisMode: 'FULL_AI_SCAN' | 'QUESTIONNAIRE_ONLY';
  hasConsentedToDataCollection: boolean;
  isPregnant: boolean;
  allergies: string;
  ingredientPreferences: string;
  existingProducts: string;
  subscriptionTier: SubscriptionTier;
  onboardingDone?: boolean;
  isLoggedIn?: boolean;
}


export const defaultProfile: UserProfile = {
  gender: 'FEMALE',
  skinType: 'COMBINATION',
  primaryConcern: 'acne',
  sensitivity: 'MODERATE',
  ageRange: '25-34',
  climate: 'TEMPERATE',
  budget: 'MASS',
  currency: 'INR',
  budgetMinInINR: 300,
  budgetMaxInINR: 3000,
  analysisMode: 'FULL_AI_SCAN',
  hasConsentedToDataCollection: false,
  isPregnant: false,
  allergies: '',
  ingredientPreferences: '',
  existingProducts: '',
  subscriptionTier: 'FREE',
  onboardingDone: false,
};


// ─── ROUTINE ────────────────────────────────────────────────
export type RoutineTime = 'AM' | 'PM';
export type RoutineStepCategory = 'CLEANSE' | 'TREAT' | 'HYDRATE' | 'PROTECT' | 'REPAIR' | 'NOURISH';

export interface RoutineStep {
  order: number;
  category: RoutineStepCategory;
  productName: string;
  brand: string;
  image: string;
  keyIngredient: string;
  skinConcernAddressed: string;
  cosmeticBenefit: string;
  layeringSafety: 'SAFE' | 'CAUTION' | 'CONFLICT_AVOIDED';
  applicationInstruction: string;
}

export interface RoutineProtocol {
  userId?: string;
  generatedAt?: string;
  am: RoutineStep[];
  pm: RoutineStep[];
  matchConfidence: number;
  aiRationale: string;
  contraindications: string[];
}

// ─── PRODUCT CATALOG ────────────────────────────────────────
export interface CatalogProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  priceRange: string;
  priceINR?: number;
  originalPriceINR?: number;
  rating?: number;
  reviewCount?: number;
  budgetTier: BudgetTier;
  keyIngredients: string[];
  skinTypes: SkinType[];
  skinConcerns: SkinConcern[];
  matchScore: number;
  whyRecommended: string;
  image: string;
  affiliateUrl?: string;
  isSponsored?: boolean;
}


// ─── INGREDIENT INTELLIGENCE ────────────────────────────────
export interface IngredientInfo {
  commonName: string;
  inciName: string;
  purpose: string;
  suitableSkinTypes: SkinType[];
  sensitivityRisk: 'LOW' | 'MODERATE' | 'HIGH';
  synergyIngredients: string[];
  cautionIngredients: string[];
  explanation: string;
  pregnancySafe: boolean;
  comedogenicRating: 0 | 1 | 2 | 3 | 4 | 5;
  ecoScore?: 'LOW' | 'MEDIUM' | 'HIGH';
}

// ─── SCAN RESULT ────────────────────────────────────────────
export type IngredientSafety = 'SAFE' | 'CAUTION' | 'AVOID';

export interface ScanIngredient {
  name: string;
  safety: IngredientSafety;
  reason: string;
  pregnancyFlag?: boolean;
}

export interface ScanResult {
  productName: string;
  overallSafety: IngredientSafety;
  ingredients: ScanIngredient[];
  profileCompatibility: string;
  positives: string[];
  concerns: string[];
}

// ─── TRACKER ────────────────────────────────────────────────
export interface TrackerEntry {
  date: string;
  amCompleted: boolean;
  pmCompleted: boolean;
  irritationLevel: 0 | 1 | 2 | 3;
  notes: string;
}

export interface WeeklyAdherence {
  days: { label: string; date?: string; amDone: boolean; pmDone: boolean }[];
  weekScore: number;
  currentStreak: number;
}

// ─── PROGRESS JOURNAL ───────────────────────────────────────
export interface JournalEntry {
  id: string;
  date: string;
  skinStatus: 'WORSE' | 'SAME' | 'BETTER' | 'MUCH_BETTER';
  notes: string;
  routineChanges: string;
  photoPlaceholder: boolean;
}

// ─── COMPATIBILITY ──────────────────────────────────────────
export type CompatibilityStatus = 'SAFE_TO_LAYER' | 'USE_SEPARATELY' | 'AVOID_TOGETHER';

export interface CompatibilityReport {
  productA: string;
  productB: string;
  status: CompatibilityStatus;
  reason: string;
  advice: string;
}

// ─── AI CHAT ────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
