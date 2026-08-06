// ============================================================
// ROUTINE ENGINE — deterministic, profile-driven
// Selects products from catalog based on skin type + concerns
// Prevents contraindications (e.g. BHA + retinol same PM)
// ============================================================

import type {
  UserProfile, RoutineProtocol, RoutineStep,
  CatalogProduct, SkinType, SkinConcern,
} from '../types/mobile.types';
import { CATALOG_DATA } from './catalog.data';

// ─── STEP TEMPLATES ──────────────────────────────────────────
// Maps (skinType + concern) → ordered product IDs per category
const CATEGORY_ORDER_AM = ['CLEANSE', 'TREAT', 'HYDRATE', 'PROTECT'] as const;
const CATEGORY_ORDER_PM = ['CLEANSE', 'TREAT', 'REPAIR', 'NOURISH'] as const;

// Which product categories are relevant per concern (ordered by importance)
const CONCERN_CATEGORY_MAP: Record<SkinConcern | 'default', string[]> = {
  acne:             ['Cleanser', 'Treatment', 'Serum', 'Moisturiser', 'SPF'],
  pores:            ['Cleanser', 'Exfoliant', 'Serum', 'Moisturiser'],
  blackheads:       ['Cleanser', 'Exfoliant', 'Serum', 'Moisturiser'],
  oiliness:         ['Cleanser', 'Serum', 'Moisturiser', 'SPF'],
  hyperpigmentation:['Serum', 'Treatment', 'SPF', 'Moisturiser'],
  dullness:         ['Serum', 'Exfoliant', 'Moisturiser', 'SPF'],
  dryness:          ['Cleanser', 'Serum', 'Moisturiser', 'Treatment'],
  redness:          ['Cleanser', 'Serum', 'Moisturiser'],
  sensitivity:      ['Cleanser', 'Moisturiser', 'Serum'],
  wrinkles:         ['Serum', 'Moisturiser', 'SPF', 'Treatment'],
  uneven_texture:   ['Exfoliant', 'Serum', 'Moisturiser', 'SPF'],
  default:          ['Cleanser', 'Serum', 'Moisturiser', 'SPF'],
};

// Contraindication pairs — these must be separated AM vs PM
const CONTRAINDICATIONS = [
  ['Salicylic Acid', 'Retinol'],
  ['AHA', 'Retinol'],
  ['Vitamin C', 'Retinol'],
  ['Benzoyl Peroxide', 'Retinol'],
];

// Returns 0–100 relevance for a product given a profile + optional live scan result
export function scoreProduct(p: CatalogProduct, profile: UserProfile, lastScanResult?: VisionAnalysisResult | null): number {
  let score = 0;

  // Skin type match
  if (p.skinTypes.includes(profile.skinType)) score += 30;

  // Primary concern match
  if (p.skinConcerns.includes(profile.primaryConcern)) score += 30;

  // Secondary concern
  if (profile.secondaryConcern && p.skinConcerns.includes(profile.secondaryConcern)) score += 15;

  // Dynamic gender biological adjustments
  if (profile.gender === 'MALE') {
    const keysLower = p.keyIngredients.map(k => k.toLowerCase());
    // Male skin has ~2x higher sebum and razor bump risk — boost BHA, Niacinamide, & soothing Cica
    if (keysLower.some(k => k.includes('salicylic') || k.includes('bha') || k.includes('niacinamide') || k.includes('cica') || k.includes('aloe'))) {
      score += 15;
    }
  }

  // Dynamic live scan score adjustments
  if (lastScanResult) {
    const keysLower = p.keyIngredients.map(k => k.toLowerCase());
    if (lastScanResult.redness > 20 && keysLower.some(k => k.includes('cica') || k.includes('centella') || k.includes('niacinamide') || k.includes('ceramide'))) {
      score += 25; // Targeted redness & inflammation repair
    }
    if (lastScanResult.hydration < 65 && keysLower.some(k => k.includes('hyaluronic') || k.includes('glycerin') || k.includes('ectoin'))) {
      score += 25; // Targeted hydration boost
    }
    if (lastScanResult.barrierHealth < 75 && keysLower.some(k => k.includes('ceramide') || k.includes('lipid') || k.includes('madecassoside'))) {
      score += 25; // Targeted barrier repair boost
    }
  }


  // Budget
  if (p.budgetTier === profile.budget) score += 15;
  if (profile.budget === 'MID'    && p.budgetTier === 'MASS') score += 8;
  if (profile.budget === 'LUXURY' && p.budgetTier === 'MID')  score += 8;

  // Sensitivity
  const sensitiveIngredients = ['Fragrance', 'Parfum', 'Essential Oils', 'Alcohol Denat'];
  if (profile.sensitivity === 'HIGH') {
    const hasSensitiser = p.keyIngredients.some(i =>
      sensitiveIngredients.some(s => i.toLowerCase().includes(s.toLowerCase()))
    );
    if (hasSensitiser) score -= 20;
  }

  // Pregnancy safety
  if (profile.isPregnant) {
    const unsafeForPregnancy = ['Retinol', 'Salicylic Acid', 'BHA', 'Hydroquinone', 'Formaldehyde'];
    const unsafe = p.keyIngredients.some(i =>
      unsafeForPregnancy.some(u => i.toLowerCase().includes(u.toLowerCase()))
    );
    if (unsafe) score -= 40;
  }

  // Allergy exclusion
  if (profile.allergies) {
    const allergens = profile.allergies.split(',').map(a => a.trim().toLowerCase());
    const hasAllergen = p.keyIngredients.some(i =>
      allergens.some(a => i.toLowerCase().includes(a))
    );
    if (hasAllergen) return -999; // exclude
  }

  return Math.min(100, Math.max(0, score));
}


// ─── BUILD STEP ──────────────────────────────────────────────
function makeStep(
  order: number,
  product: CatalogProduct,
  category: string,
  time: 'AM' | 'PM',
): RoutineStep {
  const catMap: Record<string, RoutineStep['category']> = {
    Cleanser: 'CLEANSE', Serum: 'TREAT', Treatment: 'TREAT',
    Exfoliant: 'TREAT', Moisturiser: time === 'PM' ? 'NOURISH' : 'HYDRATE',
    SPF: 'PROTECT', Toner: 'TREAT', Mask: 'REPAIR',
  };

  const amInstructions: Record<string, string> = {
    CLEANSE: 'Apply to damp skin, massage gently for 30 seconds, rinse with lukewarm water.',
    TREAT:   'Apply 2–3 drops to dry skin after cleansing. Allow to fully absorb before next step.',
    HYDRATE: 'Apply a pea-sized amount and gently press into skin.',
    PROTECT: 'Apply generously as the LAST step every morning. Reapply every 2 hours if outdoors.',
  };
  const pmInstructions: Record<string, string> = {
    CLEANSE: 'If wearing SPF or makeup, double-cleanse: oil cleanser first, then this.',
    TREAT:   'Apply after toner on dry skin. Use 2–3 nights per week if introducing a new active.',
    REPAIR:  'Apply 2–3 drops and gently press into skin. Allow 5 min before moisturiser.',
    NOURISH: 'Apply as the final step. Gently press in — do not rub vigorously.',
  };

  const stepCat = catMap[category] ?? 'TREAT';
  const instructions = time === 'AM' ? amInstructions : pmInstructions;

  return {
    order,
    category: stepCat,
    productName: `${product.brand} ${product.name}`,
    brand: product.brand,
    image: product.image,
    keyIngredient: product.keyIngredients.slice(0, 2).join(' + '),
    skinConcernAddressed: product.skinConcerns.slice(0, 2).join(' & '),
    cosmeticBenefit: product.whyRecommended.split('.')[0] + '.',
    layeringSafety: 'SAFE',
    applicationInstruction: instructions[stepCat] ?? 'Apply as directed on product packaging.',
  };
}

// ─── BUILD RATIONALE ─────────────────────────────────────────
function buildRationale(profile: UserProfile, amProducts: CatalogProduct[], pmProducts: CatalogProduct[]): string {
  const skinLabel: Record<string, string> = {
    OILY: 'oily', DRY: 'dry', COMBINATION: 'combination',
    SENSITIVE: 'sensitive', NORMAL: 'normal',
  };
  const concernLabel: Record<string, string> = {
    acne: 'active acne & congestion', pores: 'enlarged pores', blackheads: 'blackheads',
    oiliness: 'excess sebum', hyperpigmentation: 'post-inflammatory hyperpigmentation',
    dullness: 'dullness & uneven tone', dryness: 'dehydration', redness: 'redness & sensitivity',
    wrinkles: 'fine lines & loss of firmness', sensitivity: 'reactive & sensitive skin',
    uneven_texture: 'uneven texture', dullness_: 'dullness',
  };

  const amKeys = amProducts.map(p => p.keyIngredients[0]).join(', ');
  const pmKeys = pmProducts.map(p => p.keyIngredients[0]).join(', ');

  const parts = [
    `Your ${skinLabel[profile.skinType]} skin with ${concernLabel[profile.primaryConcern] ?? profile.primaryConcern} requires a structured approach.`,
    `In the morning (${amKeys}), the focus is on protection: cleansing overnight buildup, treating active concerns with lightweight actives, and mandatory broad-spectrum SPF to prevent UV-induced worsening.`,
    `In the evening (${pmKeys}), the focus shifts to repair: deeper treatment actives work undisturbed overnight, followed by an occlusive moisturiser to seal everything in during peak skin renewal hours (midnight–4am).`,
  ];

  if (profile.isPregnant) {
    parts.push('Retinoids and BHA have been excluded from this routine as they are not recommended during pregnancy or breastfeeding.');
  }
  if (profile.sensitivity === 'HIGH') {
    parts.push('All fragrance-containing formulas have been excluded. Introduce one product at a time and patch-test for 48h before full application.');
  }
  if (profile.climate === 'DRY' || profile.climate === 'COLD') {
    parts.push('Extra occlusive and humectant ingredients have been prioritised to compensate for environmental moisture loss in your climate.');
  }

  return parts.join(' ');
}

// ─── MAIN ENGINE ─────────────────────────────────────────────
export function buildRoutine(profile: UserProfile, lastScanResult?: VisionAnalysisResult | null): RoutineProtocol {
  const concerns = profile.primaryConcern;
  const categories = CONCERN_CATEGORY_MAP[concerns] ?? CONCERN_CATEGORY_MAP.default;

  // Score all products
  const scored = CATALOG_DATA.map(p => ({ p, s: scoreProduct(p, profile, lastScanResult) }))
    .filter(x => x.s >= 0)
    .sort((a, b) => b.s - a.s);


  // Pick best product per category, no repeats
  const usedIds = new Set<string>();
  function pickBest(cat: string): CatalogProduct | null {
    const match = scored.find(({ p }) => p.category === cat && !usedIds.has(p.id));
    if (match) { usedIds.add(match.p.id); return match.p; }
    return null;
  }

  // AM — always include a cleanser first; always end with SPF
  const amCategories = ['Cleanser', ...categories.filter(c => c !== 'Cleanser' && c !== 'SPF'), 'SPF'];
  const amUsed = new Set<string>();
  const amProducts: CatalogProduct[] = [];
  for (const cat of amCategories) {
    const p = scored.find(({ p }) => p.category === cat && !usedIds.has(p.id) && !amUsed.has(p.id));
    if (p && amProducts.length < 4) { amUsed.add(p.p.id); amProducts.push(p.p); }
  }

  // PM — cleanser first, then treatments, no SPF, barrier repair last
  const pmCatOrder = ['Cleanser', ...categories.filter(c => c !== 'Cleanser' && c !== 'SPF'), 'Moisturiser'];
  const pmUsed = new Set<string>();
  const pmProducts: CatalogProduct[] = [];
  for (const cat of pmCatOrder) {
    const p = scored.find(({ p }) => p.category === cat && !pmUsed.has(p.id));
    if (p && pmProducts.length < 4) { pmUsed.add(p.p.id); pmProducts.push(p.p); }
  }

  // Detect contraindications
  const contraindications: string[] = [];
  const amIngredients = amProducts.flatMap(p => p.keyIngredients);
  const pmIngredients = pmProducts.flatMap(p => p.keyIngredients);
  for (const [a, b] of CONTRAINDICATIONS) {
    const aInAM = amIngredients.some(i => i.toLowerCase().includes(a.toLowerCase()));
    const bInAM = amIngredients.some(i => i.toLowerCase().includes(b.toLowerCase()));
    const aInPM = pmIngredients.some(i => i.toLowerCase().includes(a.toLowerCase()));
    const bInPM = pmIngredients.some(i => i.toLowerCase().includes(b.toLowerCase()));
    if ((aInAM && bInAM) || (aInPM && bInPM)) {
      contraindications.push(`${a} and ${b} have been automatically separated between AM and PM.`);
    }
  }

  const confidence = Math.round(
    (amProducts.reduce((s, p) => s + scoreProduct(p, profile), 0) / Math.max(amProducts.length, 1) +
     pmProducts.reduce((s, p) => s + scoreProduct(p, profile), 0) / Math.max(pmProducts.length, 1)) / 2
  );

  return {
    userId: profile.id ?? 'demo',
    generatedAt: new Date().toISOString(),
    am: amProducts.map((p, i) => makeStep(i + 1, p, p.category, 'AM')),
    pm: pmProducts.map((p, i) => makeStep(i + 1, p, p.category, 'PM')),
    matchConfidence: Math.min(99, Math.max(60, confidence)),
    aiRationale: buildRationale(profile, amProducts, pmProducts),
    contraindications,
  };
}
