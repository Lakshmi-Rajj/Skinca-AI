import type { SubscriptionTier } from '../types/mobile.types';
import { getUsageCount } from './storage';

export const PREMIUM_LIMITS = {
  INCI_LOOKUP: 5,
  PRODUCT_SCAN: 3,
  COMPAT_CHECK: 3,
  AI_MESSAGE: 5,
} as const;

export type PremiumFeature = keyof typeof PREMIUM_LIMITS;

export function isPremium(tier: SubscriptionTier): boolean {
  return tier === 'PREMIUM';
}

export function canUseFeature(tier: SubscriptionTier, feature: PremiumFeature): boolean {
  if (isPremium(tier)) return true;
  return getUsageCount(feature) < PREMIUM_LIMITS[feature];
}

export function remainingUses(tier: SubscriptionTier, feature: PremiumFeature): number | null {
  if (isPremium(tier)) return null;
  return Math.max(0, PREMIUM_LIMITS[feature] - getUsageCount(feature));
}

export function featureLabel(feature: PremiumFeature): string {
  const labels: Record<PremiumFeature, string> = {
    INCI_LOOKUP: 'ingredient lookups',
    PRODUCT_SCAN: 'product scans',
    COMPAT_CHECK: 'compatibility checks',
    AI_MESSAGE: 'AI assistant messages',
  };
  return labels[feature];
}
