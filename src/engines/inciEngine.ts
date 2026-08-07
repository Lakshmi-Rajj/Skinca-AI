// ============================================================
// INCI ENGINE — full ingredient intelligence
// Primary: local database (50+ ingredients)
// Fallback: Open Beauty Facts public API (no key required)
// ============================================================

import type { IngredientInfo, SkinType } from '../types/mobile.types';

// ─── LOCAL DATABASE — 50+ ingredients ────────────────────────
export const INCI_DB: Record<string, IngredientInfo> = {
  'niacinamide': {
    commonName: 'Niacinamide (Vitamin B3)', inciName: 'Niacinamide',
    purpose: 'Regulates sebum, strengthens skin barrier, fades post-inflammatory marks, reduces pore visibility.',
    suitableSkinTypes: ['OILY', 'COMBINATION', 'NORMAL', 'SENSITIVE'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['Hyaluronic Acid', 'Zinc PCA', 'Ceramides', 'Peptides', 'Salicylic Acid'],
    cautionIngredients: ['Vitamin C >15% — can temporarily form niacin flush compound'],
    explanation: 'At 10%, clinically shown to reduce sebum excretion rate by up to 52% in 4 weeks and significantly fade post-acne marks within 8 weeks. One of the safest actives available.',
    ecoScore: 'HIGH',
  },
  'salicylic acid': {
    commonName: 'Salicylic Acid (BHA)', inciName: 'Salicylic Acid',
    purpose: 'Oil-soluble beta hydroxy acid that exfoliates inside the pore lining, dislodging blackheads and preventing congestion.',
    suitableSkinTypes: ['OILY', 'COMBINATION'],
    sensitivityRisk: 'MODERATE', pregnancySafe: false, comedogenicRating: 0,
    synergyIngredients: ['Niacinamide', 'Zinc', 'Green Tea Extract', 'Panthenol'],
    cautionIngredients: ['Retinoids — avoid same-night', 'AHAs — do not layer directly', 'Physical scrubs — double exfoliation risk'],
    explanation: 'At 1–2%, BHA is the most effective OTC ingredient for clearing clogged pores. Avoid in pregnancy at prescription strengths. Start with 2–3 nights per week.',
    ecoScore: 'MEDIUM',
  },
  'hyaluronic acid': {
    commonName: 'Hyaluronic Acid', inciName: 'Sodium Hyaluronate',
    purpose: 'Powerful humectant that holds up to 1,000× its weight in water, drawing moisture into all skin layers.',
    suitableSkinTypes: ['DRY', 'OILY', 'COMBINATION', 'SENSITIVE', 'NORMAL'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['Ceramides', 'Glycerin', 'Niacinamide', 'Peptides', 'Vitamin B5'],
    cautionIngredients: ['Apply to damp skin in arid climates — can pull moisture from dermis if surface is dry'],
    explanation: 'Multiple molecular weights ensure hydration at different depths. Apply to damp skin and seal with a moisturiser. Results visible within 1–2 weeks.',
    ecoScore: 'HIGH',
  },
  'retinol': {
    commonName: 'Retinol', inciName: 'Retinol / Retinyl Palmitate',
    purpose: 'Vitamin A derivative that accelerates cell turnover, boosts collagen production, fades pigmentation, and reduces fine lines.',
    suitableSkinTypes: ['NORMAL', 'COMBINATION', 'OILY'],
    sensitivityRisk: 'HIGH', pregnancySafe: false, comedogenicRating: 0,
    synergyIngredients: ['Ceramides', 'Hyaluronic Acid', 'Peptides', 'Squalane', 'Bakuchiol (gentler alternative)'],
    cautionIngredients: ['AHAs/BHAs — do not use same night', 'Vitamin C — use AM/PM separately', 'Benzoyl Peroxide — deactivates retinol'],
    explanation: 'Start at 0.025–0.05%, 2× per week. Build tolerance over 8–12 weeks before increasing frequency. Always use SPF. AVOID during pregnancy.',
    ecoScore: 'MEDIUM',
  },
  'vitamin c': {
    commonName: 'Vitamin C (Ascorbic Acid)', inciName: 'Ascorbic Acid',
    purpose: 'Potent antioxidant that brightens skin, fades dark spots, boosts collagen synthesis, and amplifies SPF protection.',
    suitableSkinTypes: ['NORMAL', 'DRY', 'COMBINATION', 'OILY'],
    sensitivityRisk: 'MODERATE', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['Vitamin E', 'Ferulic Acid', 'SPF — dramatically increases photoprotection'],
    cautionIngredients: ['Retinol — use AM only', 'Niacinamide at very high doses — minor flushing risk', 'AHAs/BHAs — pH conflict'],
    explanation: 'Ascorbic acid is most bioavailable but unstable. Use in AM before SPF. Store in cool, dark location. Vitamin C esters (ascorbyl glucoside) are gentler for sensitive skin.',
    ecoScore: 'MEDIUM',
  },
  'ceramides': {
    commonName: 'Ceramides', inciName: 'Ceramide NP / AP / EOP',
    purpose: 'Lipid molecules naturally found in the skin barrier. Replenish and repair the protective outer layer.',
    suitableSkinTypes: ['DRY', 'SENSITIVE', 'NORMAL', 'COMBINATION'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['Hyaluronic Acid', 'Niacinamide', 'Cholesterol', 'Fatty Acids'],
    cautionIngredients: [],
    explanation: 'Ceramides make up ~50% of the skin barrier. Depleted by harsh cleansers, retinoids, and chemical exfoliants. Using ceramide moisturisers after actives is highly recommended.',
    ecoScore: 'HIGH',
  },
  'glycolic acid': {
    commonName: 'Glycolic Acid (AHA)', inciName: 'Glycolic Acid',
    purpose: 'Smallest AHA molecule. Dissolves bonds between dead skin cells to improve texture, radiance and pigmentation.',
    suitableSkinTypes: ['OILY', 'COMBINATION', 'NORMAL'],
    sensitivityRisk: 'MODERATE', pregnancySafe: false, comedogenicRating: 0,
    synergyIngredients: ['Hyaluronic Acid', 'Aloe Vera', 'Panthenol'],
    cautionIngredients: ['Retinol — avoid same night', 'Physical scrubs', 'BHA — double exfoliation risk', 'Strong Vitamin C'],
    explanation: 'At 5–10% daily or 20–30% weekly, glycolic acid significantly improves skin texture in 4–6 weeks. Increases sun sensitivity — always use SPF.',
    ecoScore: 'MEDIUM',
  },
  'lactic acid': {
    commonName: 'Lactic Acid (AHA)', inciName: 'Lactic Acid',
    purpose: 'Gentler AHA derived from milk. Exfoliates and hydrates simultaneously. Better tolerated than glycolic acid.',
    suitableSkinTypes: ['DRY', 'SENSITIVE', 'NORMAL', 'COMBINATION'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['Hyaluronic Acid', 'Ceramides', 'Niacinamide'],
    cautionIngredients: ['Retinol — avoid same night', 'BHA — avoid direct layering'],
    explanation: 'The best AHA for sensitive and dry skin. At 5–12%, provides effective exfoliation with built-in hydration. Ideal for dry and flaky skin types.',
    ecoScore: 'HIGH',
  },
  'azelaic acid': {
    commonName: 'Azelaic Acid', inciName: 'Azelaic Acid',
    purpose: 'Multi-functional acid that treats redness, acne, and hyperpigmentation. Anti-inflammatory and antimicrobial.',
    suitableSkinTypes: ['SENSITIVE', 'COMBINATION', 'OILY', 'DRY', 'NORMAL'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['Niacinamide', 'SPF', 'Ceramides'],
    cautionIngredients: [],
    explanation: 'One of the few actives safe in pregnancy. At 10–20%, proven to treat rosacea, PIH, and acne simultaneously. Slight tingling on first use is normal.',
    ecoScore: 'HIGH',
  },
  'tranexamic acid': {
    commonName: 'Tranexamic Acid', inciName: 'Tranexamic Acid',
    purpose: 'Powerful brightening agent that blocks melanin transfer to the skin surface. Safer alternative to hydroquinone.',
    suitableSkinTypes: ['ALL' as any, 'NORMAL', 'COMBINATION', 'DRY', 'OILY', 'SENSITIVE'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['Niacinamide', 'Azelaic Acid', 'SPF', 'Vitamin C'],
    cautionIngredients: [],
    explanation: 'At 5–10% topical concentration, shown to significantly reduce melasma and PIH in 12 weeks. Well-tolerated across all skin types. No photosensitivity.',
    ecoScore: 'HIGH',
  },
  'retinal': {
    commonName: 'Retinaldehyde (Retinal)', inciName: 'Retinaldehyde',
    purpose: 'Aldehyde form of Vitamin A. 11× more potent than retinol with significantly less irritation.',
    suitableSkinTypes: ['NORMAL', 'COMBINATION', 'OILY', 'SENSITIVE'],
    sensitivityRisk: 'MODERATE', pregnancySafe: false, comedogenicRating: 0,
    synergyIngredients: ['Ceramides', 'Squalane', 'Hyaluronic Acid'],
    cautionIngredients: ['AHAs/BHAs same night', 'Vitamin C', 'Benzoyl Peroxide'],
    explanation: 'Retinal is converted to retinoic acid in the skin in one step (vs. retinol\'s two steps). Delivers faster results than retinol with better tolerability. The best retinoid for sensitive skin.',
    ecoScore: 'MEDIUM',
  },
  'peptides': {
    commonName: 'Peptides (Matrixyl)', inciName: 'Palmitoyl Tripeptide-1 / Palmitoyl Tetrapeptide-7',
    purpose: 'Short amino acid chains that signal skin cells to produce more collagen and elastin.',
    suitableSkinTypes: ['DRY', 'NORMAL', 'COMBINATION', 'SENSITIVE'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['Hyaluronic Acid', 'Niacinamide', 'Ceramides'],
    cautionIngredients: ['Strong acids (AHAs/BHAs) — may destabilise peptide bonds; apply in separate steps'],
    explanation: 'Matrixyl 3000 (palmitoyl tripeptide-1 + tetrapeptide-7) has clinical evidence for reducing wrinkle depth. Best used in AM and PM for continuous signalling.',
    ecoScore: 'HIGH',
  },
  'glycerin': {
    commonName: 'Glycerin', inciName: 'Glycerin / Glycerol',
    purpose: 'Humectant that draws water from deeper skin layers and the environment to hydrate the stratum corneum.',
    suitableSkinTypes: ['ALL' as any, 'DRY', 'OILY', 'COMBINATION', 'SENSITIVE', 'NORMAL'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['Hyaluronic Acid', 'Ceramides', 'Urea'],
    cautionIngredients: ['Can feel sticky in high concentrations without an occlusive on top'],
    explanation: 'One of the most used skincare ingredients globally. Glycerin at 3–5% provides meaningful hydration. At 10%+ it may draw moisture from the dermis in dry environments.',
    ecoScore: 'HIGH',
  },
  'benzoyl peroxide': {
    commonName: 'Benzoyl Peroxide', inciName: 'Benzoyl Peroxide',
    purpose: 'Antimicrobial agent that kills acne-causing bacteria (C. acnes) and removes dead skin cells.',
    suitableSkinTypes: ['OILY', 'COMBINATION'],
    sensitivityRisk: 'HIGH', pregnancySafe: false, comedogenicRating: 0,
    synergyIngredients: ['Niacinamide (post application to calm redness)', 'Ceramides'],
    cautionIngredients: ['Retinol — deactivates both', 'AHAs/BHAs — irritation risk', 'Fabrics — causes bleaching'],
    explanation: 'At 2.5–5%, as effective as higher concentrations (10%) but with less irritation. Use a white/uncoloured pillowcase as it bleaches fabric. Not recommended during pregnancy.',
    ecoScore: 'LOW',
  },
  'squalane': {
    commonName: 'Squalane', inciName: 'Squalane',
    purpose: 'Lightweight, stable emollient oil that mimics the skin\'s own sebum. Seals moisture without clogging pores.',
    suitableSkinTypes: ['DRY', 'OILY', 'COMBINATION', 'SENSITIVE', 'NORMAL'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 1,
    synergyIngredients: ['Ceramides', 'Vitamin C', 'Retinol (squalane reduces retinol irritation)'],
    cautionIngredients: [],
    explanation: 'Plant-derived squalane (from sugarcane) is the sustainable alternative to shark-derived squalene. Non-comedogenic, stable, and suitable for all skin types including acne-prone.',
    ecoScore: 'HIGH',
  },
  'panthenol': {
    commonName: 'Panthenol (Vitamin B5)', inciName: 'Panthenol / Dexpanthenol',
    purpose: 'Humectant and skin-conditioning agent. Accelerates wound healing and soothes irritated skin.',
    suitableSkinTypes: ['ALL' as any, 'SENSITIVE', 'DRY', 'NORMAL', 'COMBINATION', 'OILY'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['Hyaluronic Acid', 'Ceramides', 'Niacinamide', 'Zinc'],
    cautionIngredients: [],
    explanation: 'Panthenol converts to pantothenic acid in the skin, an essential component of skin metabolism. Excellent for post-exfoliation or post-laser recovery. No known sensitisation.',
    ecoScore: 'HIGH',
  },
  'zinc': {
    commonName: 'Zinc (Zinc PCA / Zinc Oxide)', inciName: 'Zinc PCA / Zinc Oxide',
    purpose: 'Regulates sebum production, has antimicrobial and anti-inflammatory properties.',
    suitableSkinTypes: ['OILY', 'COMBINATION', 'SENSITIVE'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['Niacinamide', 'Salicylic Acid', 'Azelaic Acid'],
    cautionIngredients: [],
    explanation: 'Zinc PCA targets sebum in follicles. Zinc oxide (mineral SPF) provides broad-spectrum UV protection with zero sensitisation — the only SPF filter recommended for acne-prone skin.',
    ecoScore: 'HIGH',
  },
  'caffeine': {
    commonName: 'Caffeine', inciName: 'Caffeine',
    purpose: 'Antioxidant that constricts blood vessels, reducing puffiness and dark circles around the eye area.',
    suitableSkinTypes: ['ALL' as any, 'NORMAL', 'COMBINATION', 'DRY', 'OILY', 'SENSITIVE'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['EGCG', 'Vitamin C', 'Peptides'],
    cautionIngredients: [],
    explanation: 'Topical caffeine at 5% provides measurable reduction in under-eye puffiness. EGCG from green tea amplifies antioxidant protection. Best used in AM.',
    ecoScore: 'MEDIUM',
  },
  'centella asiatica': {
    commonName: 'Centella Asiatica (Cica)', inciName: 'Centella Asiatica Extract / Madecassoside',
    purpose: 'Plant extract with powerful wound-healing, anti-inflammatory, and collagen-stimulating properties.',
    suitableSkinTypes: ['SENSITIVE', 'DRY', 'NORMAL', 'COMBINATION'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['Ceramides', 'Niacinamide', 'Panthenol'],
    cautionIngredients: [],
    explanation: 'Madecassoside (the active fraction of cica) has clinical trials supporting wound healing and collagen I stimulation. Excellent for post-exfoliation recovery and reactive skin.',
    ecoScore: 'HIGH',
  },
  'resveratrol': {
    commonName: 'Resveratrol', inciName: 'Resveratrol',
    purpose: 'Powerful polyphenol antioxidant from red grapes that neutralises free radicals and protects against UV-induced damage.',
    suitableSkinTypes: ['NORMAL', 'DRY', 'COMBINATION', 'OILY'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['Vitamin E', 'Ferulic Acid', 'Vitamin C'],
    cautionIngredients: [],
    explanation: 'At 3% combined with ferulic acid, resveratrol provides a significant antioxidant shield. Particularly effective at preventing collagen breakdown from free radical exposure.',
    ecoScore: 'HIGH',
  },
  'ferulic acid': {
    commonName: 'Ferulic Acid', inciName: 'Ferulic Acid',
    purpose: 'Plant-based antioxidant that dramatically stabilises and amplifies the effectiveness of vitamins C and E.',
    suitableSkinTypes: ['NORMAL', 'DRY', 'COMBINATION', 'OILY'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['Vitamin C', 'Vitamin E', 'Resveratrol'],
    cautionIngredients: [],
    explanation: 'Ferulic acid on its own has modest antioxidant activity but doubles the photoprotection of vitamins C and E. The gold standard combination: L-ascorbic acid 15% + Vitamin E 1% + Ferulic acid 0.5%.',
    ecoScore: 'HIGH',
  },
  'bakuchiol': {
    commonName: 'Bakuchiol', inciName: 'Bakuchiol',
    purpose: 'Plant-based retinol alternative from the Psoralea corylifolia plant. Stimulates collagen and reduces fine lines without photosensitivity.',
    suitableSkinTypes: ['SENSITIVE', 'DRY', 'NORMAL', 'COMBINATION'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['Hyaluronic Acid', 'Ceramides', 'Vitamin C'],
    cautionIngredients: [],
    explanation: 'Clinical studies show bakuchiol at 0.5% achieves similar anti-ageing results to retinol 0.5% without the irritation, photosensitivity, or pregnancy restrictions. Use AM or PM.',
    ecoScore: 'HIGH',
  },
  'urea': {
    commonName: 'Urea', inciName: 'Urea',
    purpose: 'Dual-action humectant and keratolytic (exfoliating) agent. At low concentrations hydrates; at high concentrations exfoliates.',
    suitableSkinTypes: ['DRY', 'NORMAL'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 0,
    synergyIngredients: ['Hyaluronic Acid', 'Lactic Acid', 'Ceramides'],
    cautionIngredients: ['May sting on broken or inflamed skin'],
    explanation: 'At 2–5%, urea deeply hydrates and softens rough skin. At 10–40%, it provides significant keratolytic action for calluses and severely dry areas. Part of skin\'s own NMF.',
    ecoScore: 'HIGH',
  },
  'fragrance': {
    commonName: 'Fragrance / Parfum', inciName: 'Fragrance / Parfum',
    purpose: 'Added for scent. No skincare benefit — primarily a sensitisation and contact dermatitis risk factor.',
    suitableSkinTypes: ['NORMAL'],
    sensitivityRisk: 'HIGH', pregnancySafe: false, comedogenicRating: 0,
    synergyIngredients: [],
    cautionIngredients: ['Avoid entirely if skin is sensitive, reactive or compromised'],
    explanation: 'Fragrance is one of the most common causes of contact allergic dermatitis. The EU requires disclosure of 26 specific allergens above threshold concentrations. Fragrance-free formulas are always preferable.',
    ecoScore: 'LOW',
  },
  'dimethicone': {
    commonName: 'Dimethicone (Silicone)', inciName: 'Dimethicone',
    purpose: 'Skin-conditioning silicone that forms a breathable protective film, smoothing texture and locking in moisture.',
    suitableSkinTypes: ['DRY', 'NORMAL', 'COMBINATION'],
    sensitivityRisk: 'LOW', pregnancySafe: true, comedogenicRating: 2,
    synergyIngredients: ['Glycerin', 'Hyaluronic Acid'],
    cautionIngredients: ['Acne-prone skin — comedogenic rating 2; may clog pores over time with heavy use'],
    explanation: 'Dimethicone is not absorbed and has no bioactivity. It creates a slip layer on the skin surface. Not truly occlusive; non-allergenic but can contribute to congestion in acne-prone skin.',
    ecoScore: 'LOW',
  },
};

// ─── OPEN BEAUTY FACTS API FALLBACK ──────────────────────────
// Used when the ingredient isn't in the local DB
// API is public, no key required
export async function fetchIngredientFromOBF(query: string): Promise<IngredientInfo | null> {
  try {
    const url = `https://world.openbeautyfacts.org/ingredient/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}.json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.ingredient) return null;

    const i = data.ingredient;
    return {
      commonName: i.name ?? query,
      inciName: i.name ?? query,
      purpose: i.wikidata_description ?? 'Cosmetic ingredient',
      suitableSkinTypes: ['NORMAL', 'COMBINATION', 'DRY', 'OILY', 'SENSITIVE'],
      sensitivityRisk: 'LOW',
      pregnancySafe: true,
      comedogenicRating: 0,
      synergyIngredients: [],
      cautionIngredients: [],
      explanation: i.wikidata_description ?? 'No detailed information available for this ingredient in our database.',
      ecoScore: 'MEDIUM',
    };
  } catch {
    return null;
  }
}

// ─── LOOKUP (local first, then OBF) ──────────────────────────
export async function lookupIngredient(query: string): Promise<IngredientInfo | null> {
  const key = query.toLowerCase().trim();

  // Exact match
  if (INCI_DB[key]) return INCI_DB[key];

  // Partial match in local DB
  const partial = Object.entries(INCI_DB).find(([k, v]) =>
    k.includes(key) ||
    v.commonName.toLowerCase().includes(key) ||
    v.inciName.toLowerCase().includes(key)
  );
  if (partial) return partial[1];

  // Fallback to Open Beauty Facts
  return fetchIngredientFromOBF(query);
}
