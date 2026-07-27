export const SKIN_TYPE_COMPATIBILITY_MATRIX: Record<string, string[]> = {
  DRY: ['HUMECTANT', 'EMOLLIENT', 'OCCLUSIVE', 'CONDITIONING_AGENT'],
  OILY: ['HUMECTANT', 'EXFOLIANT', 'SOLVENT', 'BUFFERING_AGENT'],
  COMBINATION: ['HUMECTANT', 'EMOLLIENT', 'EXFOLIANT', 'ANTIOXIDANT'],
  SENSITIVE: ['HUMECTANT', 'CONDITIONING_AGENT', 'ANTIOXIDANT'],
  NORMAL: ['HUMECTANT', 'EMOLLIENT', 'ANTIOXIDANT', 'CONDITIONING_AGENT'],
};

export const CONFLICTING_ACTIVE_PAIRS: [string, string][] = [
  ['Retinol', 'Salicylic Acid'],
  ['Retinol', 'Glycolic Acid'],
  ['Ascorbic Acid', 'Glycolic Acid'],
  ['Ascorbic Acid', 'Salicylic Acid'],
  ['Benzoyl Peroxide', 'Retinol'],
  ['Retinol', 'L-Ascorbic Acid'],
  ['Hydroquinone', 'Retinol'],
];

export const SYNERGISTIC_ACTIVE_PAIRS: [string, string][] = [
  ['Niacinamide', 'Sodium Hyaluronate'],
  ['Ascorbic Acid', 'Tocopherol'],
  ['Ascorbic Acid', 'Ferulic Acid'],
  ['Ceramide NP', 'Cholesterol'],
  ['Centella Asiatica Extract', 'Panthenol'],
];

export const PREGNANCY_UNSAFE_INGREDIENTS: string[] = [
  'Retinol',
  'Tretinoin',
  'Isotretinoin',
  'Hydroquinone',
  'High-dose Salicylic Acid',
];

export const PHOTOSENSITIVE_INGREDIENTS: string[] = [
  'Retinol',
  'Glycolic Acid',
  'Lactic Acid',
  'Salicylic Acid',
  'Hydroquinone',
];

export const RECOMMENDED_TIME_OF_DAY: Record<string, 'AM' | 'PM' | 'BOTH'> = {
  Retinol: 'PM',
  'Glycolic Acid': 'PM',
  'Ascorbic Acid': 'AM',
  'Tocopherol': 'BOTH',
  'Sodium Hyaluronate': 'BOTH',
  Niacinamide: 'BOTH',
};

export function isConflictingActivePair(inci1: string, inci2: string): boolean {
  const norm1 = inci1.toLowerCase().trim();
  const norm2 = inci2.toLowerCase().trim();

  return CONFLICTING_ACTIVE_PAIRS.some(([a, b]) => {
    const normA = a.toLowerCase();
    const normB = b.toLowerCase();
    return (norm1 === normA && norm2 === normB) || (norm1 === normB && norm2 === normA);
  });
}

export function isSynergisticPair(inci1: string, inci2: string): boolean {
  const norm1 = inci1.toLowerCase().trim();
  const norm2 = inci2.toLowerCase().trim();

  return SYNERGISTIC_ACTIVE_PAIRS.some(([a, b]) => {
    const normA = a.toLowerCase();
    const normB = b.toLowerCase();
    return (norm1 === normA && norm2 === normB) || (norm1 === normB && norm2 === normA);
  });
}

export function isPregnancySafe(inciName: string): boolean {
  const norm = inciName.toLowerCase().trim();
  return !PREGNANCY_UNSAFE_INGREDIENTS.some((unsafe) => unsafe.toLowerCase() === norm);
}
