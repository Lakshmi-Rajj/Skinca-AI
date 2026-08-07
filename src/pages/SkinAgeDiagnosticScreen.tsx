import React from 'react';
import type { useMobileState } from '../hooks/useMobileState';
import { getResolvedUserAvatar } from '../utils/avatarUtils';

type State = ReturnType<typeof useMobileState>;

export function SkinAgeDiagnosticScreen({ state }: { state: State }) {
  const { profile, lastScanResult } = state;
  // Prefer the actual scanned face image — only fall back to profile avatar if no scan
  const ageFaceImage = lastScanResult?.capturedFaceImage || getResolvedUserAvatar(profile, lastScanResult);




  const ageMap: Record<string, number> = { '18-24': 21, '25-34': 29, '35-44': 38, '45-54': 48, '55+': 58 };
  const chronologicalAge = ageMap[profile.ageRange] ?? 34;
  const modifiers: Record<string, number> = {
    DRY: 2, OILY: 1, COMBINATION: 0, SENSITIVE: 3, NORMAL: -1,
    acne: 1, hyperpigmentation: 2, redness: 1, wrinkles: 3, dryness: 2,
    LOW: -2, MODERATE: 0, HIGH: 2,
    HUMID: -1, DRY_CLIMATE: 2, TEMPERATE: 0, COLD: 1, TROPICAL: 0,
  };
  const delta =
    (modifiers[profile.skinType] ?? 0) +
    (modifiers[profile.primaryConcern] ?? 0) +
    (modifiers[profile.sensitivity] ?? 0) +
    (modifiers[profile.climate] ?? 0);
  // If we have a real scan result, use the scan-derived skin age (more accurate)
  // otherwise fall back to profile-formula
  const skinAge = lastScanResult ? lastScanResult.estimatedSkinAge : chronologicalAge + delta;
  const ageDiff = skinAge - chronologicalAge;
  const isYounger = ageDiff <= 0;

  // barPct: smoothly interpolate — younger by 5+ = 90%, same age = 68%, older by 5+ = 40%
  const barPct = Math.round(Math.max(20, Math.min(95, 68 - ageDiff * 5)));

  const factors = [
    {
      label: 'UV Exposure',
      score: profile.climate === 'TROPICAL' || profile.climate === 'DRY' ? 'HIGH' : 'MODERATE',
      impact: profile.climate === 'TROPICAL' ? 'Accelerates photoaging 2–3 yrs' : 'Moderate UV load',
      color: profile.climate === 'TROPICAL' ? '#ef4444' : '#f59e0b',
    },
    {
      label: 'Hydration Level',
      score: profile.skinType === 'DRY' ? 'LOW' : 'GOOD',
      impact: profile.skinType === 'DRY' ? 'Dehydration accentuates fine lines' : 'Adequate moisture retention',
      color: profile.skinType === 'DRY' ? '#f59e0b' : '#326859',
    },
    {
      label: 'Skin Barrier',
      score: profile.sensitivity === 'HIGH' ? 'COMPROMISED' : profile.sensitivity === 'LOW' ? 'STRONG' : 'MODERATE',
      impact: profile.sensitivity === 'HIGH' ? 'Increased TEWL, accelerates aging' : 'Barrier function within normal range',
      color: profile.sensitivity === 'HIGH' ? '#ef4444' : profile.sensitivity === 'LOW' ? '#326859' : '#f59e0b',
    },
    {
      label: 'Inflammation',
      score: ['acne', 'redness'].includes(profile.primaryConcern) ? 'ELEVATED' : 'NORMAL',
      impact: ['acne', 'redness'].includes(profile.primaryConcern) ? 'Chronic inflammation breaks down collagen' : 'Low systemic inflammation',
      color: ['acne', 'redness'].includes(profile.primaryConcern) ? '#ef4444' : '#326859',
    },
  ];

  const recommendations = [
    { ing: 'Broad Spectrum SPF 50+', why: 'Non-negotiable — prevents further photoaging daily' },
    ...(skinAge > chronologicalAge ? [{ ing: 'Retinol 0.5%', why: 'Accelerates cell turnover, reduces apparent age' }] : []),
    { ing: 'Hyaluronic Acid + Ceramides', why: 'Restores moisture matrix and plumping effect' },
    ...(profile.sensitivity !== 'HIGH' ? [{ ing: 'Vitamin C 15%', why: 'Antioxidant + collagen synthesis stimulation' }] : []),
  ];

  return (
    <div style={{ background: '#f7faf9', minHeight: '100%', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ padding: '18px 20px 16px', borderBottom: '1px solid #f0f0f0', background: '#fff' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', color: '#111' }}>Your Skin Age</h2>
        <p style={{ fontSize: 12, color: lastScanResult ? '#326859' : '#d97706', fontWeight: 600, margin: 0 }}>
          {lastScanResult ? '✦ Measured from live AI face scan analysis' : '⚠ Questionnaire Baseline Estimate — Run AI face scan for exact clinical score'}
        </p>
      </div>


      <div style={{ padding: '14px 16px' }}>
        {/* Hero card with face */}
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 0 }}>
            {ageFaceImage ? (
              <img
                src={ageFaceImage}
                alt="Your scanned face"
                style={{ width: 140, height: 200, objectFit: 'cover', objectPosition: 'top center', flexShrink: 0 }}
              />
            ) : (
              <div style={{ width: 140, height: 200, background: '#f0faf7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 48 }}>🔬</span>
              </div>
            )}

            {/* Age info */}
            <div style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Actual Age</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#111', lineHeight: 1.1 }}>{chronologicalAge}</div>
              </div>
              <div style={{ width: '100%', height: 1, background: '#f0f0f0', marginBottom: 14 }} />
              <div>
                <div style={{ fontSize: 11, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Estimated Skin Age</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#326859', lineHeight: 1.1 }}>{skinAge}</div>
                <div style={{ fontSize: 12, color: isYounger ? '#326859' : '#f59e0b', fontWeight: 700, marginTop: 4 }}>
                  {isYounger ? `You're aging beautifully! ✦` : `+${ageDiff} yrs ahead — fixable`}
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar below */}
          <div style={{ padding: '12px 16px', background: '#f8f9fa', borderTop: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#555' }}>Younger than {barPct}% of people your age</span>
            </div>
            <div style={{ height: 6, background: '#e8e8e8', borderRadius: 4 }}>
              <div style={{ height: 6, background: 'linear-gradient(to right, #326859, #52b788)', borderRadius: 4, width: `${barPct}%` }} />
            </div>
          </div>
        </div>

        {/* Contributing Factors */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 14 }}>Contributing Factors</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {factors.map(f => (
              <div key={f.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 12, background: '#f8f9fa' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.color, marginTop: 4, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{f.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: f.color }}>{f.score}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#777' }}>{f.impact}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anti-Aging Protocol */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 14 }}>Anti-Aging Protocol</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recommendations.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#326859', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{r.ing}</div>
                  <div style={{ fontSize: 12, color: '#777', marginTop: 3 }}>{r.why}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
