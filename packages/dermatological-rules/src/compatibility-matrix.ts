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
];

export function isConflictingActivePair(inci1: string, inci2: string): boolean {
  const norm1 = inci1.toLowerCase().trim();
  const norm2 = inci2.toLowerCase().trim();

  return CONFLICTING_ACTIVE_PAIRS.some(([a, b]) => {
    const normA = a.toLowerCase();
    const normB = b.toLowerCase();
    return (norm1 === normA && norm2 === normB) || (norm1 === normB && norm2 === normA);
  });
}
