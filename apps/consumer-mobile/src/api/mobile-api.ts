// ============================================================
// CONSUMER MOBILE APP - BACKEND API SERVICE LAYER
// Connects all mobile screens to NestJS backend endpoints
// ============================================================

import type {
  UserProfile,
  RoutineProtocol,
  CatalogProduct,
  IngredientInfo,
  ScanResult,
  CompatibilityReport,
  ChatMessage,
} from '../types/mobile.types';

const BASE_URL = 'http://localhost:3000/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) throw new Error(`API Error ${res.status}`);
    return res.json();
  } catch {
    // Return mock data when backend is unavailable (offline/dev mode)
    throw new Error('OFFLINE');
  }
}

// ─── PROFILE ────────────────────────────────────────────────

export async function saveProfile(profile: UserProfile): Promise<{ id: string }> {
  return request('/customers', {
    method: 'POST',
    body: JSON.stringify({ skinType: profile.skinType, concerns: [profile.primaryConcern] }),
  });
}

// ─── ROUTINE ────────────────────────────────────────────────

export async function generateRoutine(profile: UserProfile): Promise<RoutineProtocol> {
  return request('/routines/generate', {
    method: 'POST',
    body: JSON.stringify({
      skinType: profile.skinType,
      concerns: [profile.primaryConcern, profile.secondaryConcern].filter(Boolean),
      sensitivity: profile.sensitivity,
      isPregnant: profile.isPregnant,
      allergies: profile.allergies.split(',').map(s => s.trim()).filter(Boolean),
    }),
  });
}

// ─── PRODUCT CATALOG ────────────────────────────────────────

export async function fetchCatalog(filters?: {
  concern?: string;
  budget?: string;
  search?: string;
}): Promise<CatalogProduct[]> {
  const params = new URLSearchParams();
  if (filters?.concern) params.set('concern', filters.concern);
  if (filters?.budget) params.set('budget', filters.budget);
  if (filters?.search) params.set('search', filters.search);
  return request(`/products?${params.toString()}`);
}

// ─── INGREDIENT INTELLIGENCE ────────────────────────────────

export async function lookupIngredient(query: string): Promise<IngredientInfo> {
  return request(`/ingredients/lookup?q=${encodeURIComponent(query)}`);
}

// ─── SCANNER ────────────────────────────────────────────────

export async function scanIngredients(
  inciList: string,
  profile: UserProfile,
): Promise<ScanResult> {
  return request('/products/scan', {
    method: 'POST',
    body: JSON.stringify({
      ingredients: inciList,
      skinType: profile.skinType,
      sensitivity: profile.sensitivity,
      allergies: profile.allergies,
    }),
  });
}

// ─── COMPATIBILITY ──────────────────────────────────────────

export async function checkCompatibility(
  productA: string,
  productB: string,
  profile: UserProfile,
): Promise<CompatibilityReport> {
  return request('/recommendations/compatibility', {
    method: 'POST',
    body: JSON.stringify({ productA, productB, skinType: profile.skinType, sensitivity: profile.sensitivity }),
  });
}

// ─── AI ASSISTANT ───────────────────────────────────────────

export async function askAiAssistant(
  question: string,
  profile: UserProfile,
): Promise<{ answer: string }> {
  return request('/ai/explain', {
    method: 'POST',
    body: JSON.stringify({ question, skinType: profile.skinType, concern: profile.primaryConcern }),
  });
}
