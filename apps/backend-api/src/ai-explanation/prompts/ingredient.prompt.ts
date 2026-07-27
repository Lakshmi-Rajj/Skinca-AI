export function buildIngredientPrompt(inciName: string, displayName: string, benefits: string[]): string {
  return `Explain scientific benefits of ${displayName} (INCI: ${inciName}) focusing on: ${benefits.join(', ')}. Highlight application timing and UV precautions.`;
}
