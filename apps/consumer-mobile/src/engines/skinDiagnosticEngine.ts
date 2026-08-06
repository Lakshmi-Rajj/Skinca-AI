// ============================================================
// SKIN DIAGNOSTIC ENGINE — Multi-Zone Facial & Dermal Intelligence
// Calculates 6 dermal health metrics, facial heatmap zones,
// Overall Skin Score (0-100), and Biological vs Estimated Skin Age.
// ============================================================

import type { UserProfile } from '../types/mobile.types';

export interface DermalMetrics {
  hydration: number;      // 0-100%
  redness: number;        // 0-100%
  pigmentation: number;   // 0-100%
  acneRisk: 'Low' | 'Medium' | 'High';
  sensitivity: 'Low' | 'Medium' | 'High';
  barrierHealth: 'Good' | 'Fair' | 'Poor';
}

export interface FacialZone {
  zone: 'Forehead' | 'Left Cheek' | 'Right Cheek' | 'Chin';
  status: 'Redness' | 'Dryness' | 'Healthy' | 'Congested';
  colorHex: string;
  severity: number; // 0.0 to 1.0
  description: string;
}

export interface DiagnosticResult {
  overallScore: number;         // e.g. 84
  aiConfidence: number;         // e.g. 92%
  metrics: DermalMetrics;
  faceMapZones: FacialZone[];
  actualAge: number;
  estimatedSkinAge: number;
  benchmarkPercentile: number;   // e.g. 68% younger
  keyInsights: string;
  scannedAt: string;
}

/**
 * Deterministically generates skin diagnostic results based on UserProfile
 * and simulated facial computer vision analysis.
 */
export function analyzeSkinProfile(profile: UserProfile): DiagnosticResult {
  const actualAge = profile.actualAge ?? 34;

  // Compute metrics based on skinType & sensitivity baseline
  let hydration = 72;
  let redness = 18;
  let pigmentation = 44;
  let acneRisk: 'Low' | 'Medium' | 'High' = 'Low';
  let sensitivity: 'Low' | 'Medium' | 'High' = 'Medium';
  let barrierHealth: 'Good' | 'Fair' | 'Poor' = 'Good';

  if (profile.skinType === 'DRY') {
    hydration = 54;
    barrierHealth = 'Fair';
  } else if (profile.skinType === 'OILY') {
    hydration = 80;
    acneRisk = 'High';
  } else if (profile.skinType === 'COMBINATION') {
    hydration = 72;
    acneRisk = 'Medium';
  } else if (profile.skinType === 'SENSITIVE') {
    redness = 38;
    sensitivity = 'High';
    barrierHealth = 'Fair';
  }

  if (profile.primaryConcern === 'acne') {
    acneRisk = 'High';
  } else if (profile.primaryConcern === 'hyperpigmentation') {
    pigmentation = 62;
  } else if (profile.primaryConcern === 'redness') {
    redness = 42;
    sensitivity = 'High';
  } else if (profile.primaryConcern === 'wrinkles') {
    hydration = Math.max(45, hydration - 10);
  }

  // Calculate Overall Skin Health Score (0 - 100)
  const barrierScore = barrierHealth === 'Good' ? 95 : barrierHealth === 'Fair' ? 75 : 50;
  const overallScore = Math.min(98, Math.max(50, Math.round(
    (hydration * 0.25) +
    ((100 - redness) * 0.25) +
    ((100 - pigmentation) * 0.20) +
    (barrierScore * 0.30)
  )));

  // Estimated Dermal Skin Age Algorithm
  const ageDelta = Math.round((overallScore - 70) / 5);
  const estimatedSkinAge = Math.max(18, actualAge - ageDelta);

  // Benchmark Percentile Algorithm
  const benchmarkPercentile = Math.min(95, Math.max(50, Math.round(50 + (overallScore - 70) * 1.2)));

  // Heatmap Facial Zones
  const faceMapZones: FacialZone[] = [
    {
      zone: 'Forehead',
      status: 'Dryness',
      colorHex: '#eab308', // Yellow
      severity: 0.45,
      description: 'Mild dehydration & elevated moisture loss.',
    },
    {
      zone: 'Left Cheek',
      status: 'Redness',
      colorHex: '#ef4444', // Red
      severity: 0.62,
      description: 'Erythema and superficial micro-vascular flushing.',
    },
    {
      zone: 'Right Cheek',
      status: 'Redness',
      colorHex: '#ef4444', // Red
      severity: 0.58,
      description: 'Moderate barrier sensitivity and surface dryness.',
    },
    {
      zone: 'Chin',
      status: 'Healthy',
      colorHex: '#10b981', // Emerald Green
      severity: 0.15,
      description: 'Balanced sebum production and calm dermal texture.',
    },
  ];

  const keyInsights = `AI has detected increased dryness around your cheeks and mild redness. Your skin barrier needs support.`;

  return {
    overallScore,
    aiConfidence: 92,
    metrics: {
      hydration,
      redness,
      pigmentation,
      acneRisk,
      sensitivity,
      barrierHealth,
    },
    faceMapZones,
    actualAge,
    estimatedSkinAge,
    benchmarkPercentile,
    keyInsights,
    scannedAt: new Date().toISOString(),
  };
}
