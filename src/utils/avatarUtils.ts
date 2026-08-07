import type { UserProfile } from '../types/mobile.types';
import type { VisionAnalysisResult } from '../engines/geminiEngine';

export const DEFAULT_HERO_FEMALE = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80';

/**
 * Returns the user's actual profile image.
 * Returns null if no custom photo was uploaded and no AI face scan has been performed.
 */
export function getResolvedUserAvatar(profile?: UserProfile | null, lastScanResult?: VisionAnalysisResult | null): string | null {
  // 1. Custom user uploaded profile avatar
  if (profile?.avatarUrl) {
    return profile.avatarUrl;
  }
  // 2. Real scanned face image from AI scan
  if (lastScanResult?.capturedFaceImage) {
    return lastScanResult.capturedFaceImage;
  }
  // 3. No face scan or upload done yet -> return null (render SVG placeholder)
  return null;
}
