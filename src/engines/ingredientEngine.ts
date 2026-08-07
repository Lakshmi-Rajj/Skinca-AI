// ============================================================
// INGREDIENT ENGINE — Clinical Active Ingredient & Conflict Engine
// Categorizes active formulas into "Best For You" (1-5 stars)
// vs "Ingredients to Avoid" (with ❌ hazard icons) and rationale.
// ============================================================

import type { UserProfile } from '../types/mobile.types';
import type { DiagnosticResult } from './skinDiagnosticEngine';

export interface RecommendedIngredient {
  name: string;
  category: 'Best For You' | 'Ingredients to Avoid';
  rating?: number; // 1 to 5 stars
  reason: string;
  icon: string;
}

export interface RecommendationRationale {
  title: string;
  explanation: string;
  primaryActive: string;
  secondaryActive: string;
  timeframe: string;
}

export function generateIngredientAnalysis(
  profile: UserProfile,
  diagnostic: DiagnosticResult
): {
  bestForYou: RecommendedIngredient[];
  ingredientsToAvoid: RecommendedIngredient[];
  rationale: RecommendationRationale;
} {
  const bestForYou: RecommendedIngredient[] = [
    {
      name: 'Ceramides',
      category: 'Best For You',
      rating: 5,
      reason: 'Strengthens skin barrier and locks in deep dermal moisture.',
      icon: 'shield',
    },
    {
      name: 'Hyaluronic Acid',
      category: 'Best For You',
      rating: 5,
      reason: 'Deeply hydrates cellular matrix and plumps the skin.',
      icon: 'water_drop',
    },
    {
      name: 'Niacinamide',
      category: 'Best For You',
      rating: 4.5,
      reason: 'Reduces redness, regulates sebum, and improves uneven tone.',
      icon: 'sparkles',
    },
    {
      name: 'Centella Asiatica',
      category: 'Best For You',
      rating: 5,
      reason: 'Calms superficial irritation and accelerates barrier healing.',
      icon: 'spa',
    },
  ];

  const ingredientsToAvoid: RecommendedIngredient[] = [
    {
      name: 'Alcohol (Denatured)',
      category: 'Ingredients to Avoid',
      reason: 'Can cause severe dryness, stinging, and moisture barrier breakdown.',
      icon: 'warning',
    },
    {
      name: 'Strong Fragrance (Parfum)',
      category: 'Ingredients to Avoid',
      reason: 'May trigger superficial sensitivity, redness, and contact dermatitis.',
      icon: 'do_not_disturb_on',
    },
    {
      name: 'High AHA Concentration',
      category: 'Ingredients to Avoid',
      reason: 'Can over-exfoliate and weaken the stratum corneum barrier.',
      icon: 'error',
    },
  ];

  const rationale: RecommendationRationale = {
    title: 'Why this recommendation?',
    explanation: `We detected increased dryness around your cheeks with moderate barrier stress. Ceramides and Hyaluronic Acid are recommended to improve hydration and strengthen your skin barrier over the next 2–4 weeks.`,
    primaryActive: 'Ceramides',
    secondaryActive: 'Hyaluronic Acid',
    timeframe: '2–4 weeks',
  };

  return { bestForYou, ingredientsToAvoid, rationale };
}
