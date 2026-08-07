import React from 'react';
import { CATALOG_DATA } from '../engines/catalog.data';
import type { VisionAnalysisResult } from '../engines/geminiEngine';
import type { useMobileState } from '../hooks/useMobileState';

type State = ReturnType<typeof useMobileState>;

const DEFAULT_PRODUCT_IMG = 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80';

const INGREDIENT_VISUALS = [
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=160&h=160&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=160&h=160&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=160&h=160&fit=crop&auto=format',
];

export function RecommendationRationaleScreen({ state }: { state: State }) {
  const { routine, profile, catalog, lastScanResult } = state;

  // Use scan-aware ranking if a scan has been completed
  function rankByScan(scan: VisionAnalysisResult) {
    const active: string[] = [profile.primaryConcern];
    if (profile.secondaryConcern) active.push(profile.secondaryConcern);
    if (scan.redness > 25)       active.push('redness', 'sensitivity');
    if (scan.hydration < 65)     active.push('dryness', 'dehydration');
    if (scan.acneRisk !== 'LOW') active.push('acne', 'blackheads');
    if (scan.pigmentation > 40)  active.push('hyperpigmentation', 'dullness');
    const unique = [...new Set(active)];
    return CATALOG_DATA
      .map(p => ({ p, score: p.skinConcerns.filter(c => unique.includes(c)).length * 20 + p.matchScore * 0.3 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => s.p);
  }

  const topProducts = lastScanResult ? rankByScan(lastScanResult) : catalog.slice(0, 3);

  return (
    <div style={{ background: '#f7faf9', minHeight: '100%', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '18px 20px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', color: '#111' }}>Why this recommendation?</h2>
        <p style={{ fontSize: 12, color: '#888', margin: 0 }}>Clinical AI breakdown for your profile</p>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {/* Main Recommendation Callout Card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '18px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: 14 }}>
          <p style={{ fontSize: 13, color: '#444', lineHeight: 1.7, margin: 0 }}>
            {routine?.aiRationale ||
              `We detected increased dryness around your cheeks with moderate barrier stress. Ceramides and Hyaluronic Acid are recommended to improve hydration and strengthen your skin barrier over the next 2-4 weeks.`}
          </p>

          {/* Graphic Images Row */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'center' }}>
            {INGREDIENT_VISUALS.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Ingredient science"
                style={{ width: 72, height: 72, borderRadius: 14, objectFit: 'cover', border: '1px solid #f0f0f0' }}
              />
            ))}
          </div>
        </div>

        {/* Profile Attributes grid */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 12 }}>Matched Profile Attributes</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Skin Type', val: profile.skinType },
              { label: 'Primary Concern', val: profile.primaryConcern },
              { label: 'Sensitivity Level', val: profile.sensitivity },
              { label: 'Climate Type', val: profile.climate },
            ].map(item => (
              <div key={item.label} style={{ background: '#f8f9fa', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#326859', marginTop: 3 }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Rationale List */}
        <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 10 }}>Product Matching Science</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topProducts.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: 16, padding: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', gap: 12, alignItems: 'center' }}>
              <img
                src={p.image || DEFAULT_PRODUCT_IMG}
                alt={p.name}
                style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', flexShrink: 0, border: '1px solid #f0f0f0' }}
                onError={e => { (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMG; }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{p.name}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#326859', background: '#f0faf7', padding: '2px 8px', borderRadius: 12 }}>{p.matchScore}% Match</span>
                </div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{p.brand}</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 4, lineHeight: 1.4 }}>{p.whyRecommended}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
