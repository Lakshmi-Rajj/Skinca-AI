import React, { useState } from 'react';
import type { useMobileState } from '../hooks/useMobileState';

type State = ReturnType<typeof useMobileState>;

// Ingredient icons - using appropriate image-like representations
const ING_ICONS: Record<string, string> = {
  'Ceramides': 'https://images.unsplash.com/photo-1629380824689-7af3c8a7c8a5?w=60&h=60&fit=crop&auto=format',
  'Hyaluronic Acid': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=60&h=60&fit=crop&auto=format',
  'Niacinamide': 'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=60&h=60&fit=crop&auto=format',
  'Centella Asiatica': 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=60&h=60&fit=crop&auto=format',
  'Alcohol': 'https://images.unsplash.com/photo-1614887252894-fce33dc8c19b?w=60&h=60&fit=crop&auto=format',
  'Strong Fragrance': 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=60&h=60&fit=crop&auto=format',
  'High AHA': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=60&h=60&fit=crop&auto=format',
};

const DEFAULT_ING_IMG = 'https://images.unsplash.com/photo-1570194065650-d99fb4b38e9a?w=60&h=60&fit=crop&auto=format';

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? '#f59e0b' : '#e0e0e0', fontSize: 12 }}>★</span>
      ))}
    </div>
  );
}

interface RecommendedIng {
  name: string;
  desc: string;
  stars: number;
  forType: string[];
  reason: string;
}

function computeDynamicRecommendedIngredients(profile: State['profile'], lastScanResult: State['lastScanResult']): RecommendedIng[] {
  const list: RecommendedIng[] = [
    {
      name: 'Ceramides',
      desc: 'Strengthens skin barrier lipid matrix and prevents moisture loss',
      stars: 5,
      forType: ['DRY', 'SENSITIVE', 'NORMAL', 'COMBINATION', 'OILY'],
      reason: lastScanResult && lastScanResult.barrierHealth < 75 ? 'Targeted repair for your current barrier health score' : 'Essential for maintaining skin barrier integrity',
    },
    {
      name: 'Hyaluronic Acid',
      desc: 'Multi-depth hydration matrix that retains 1000x its weight in water',
      stars: 5,
      forType: ['DRY', 'SENSITIVE', 'NORMAL', 'COMBINATION', 'OILY'],
      reason: lastScanResult && lastScanResult.hydration < 60 ? `Boosts your current hydration level (${lastScanResult.hydration}%)` : 'Supports daily skin moisture retention',
    },
    {
      name: 'Niacinamide (Vitamin B3)',
      desc: 'Reduces redness, regulates sebum production, and brightens hyperpigmentation',
      stars: profile.primaryConcern === 'redness' || profile.primaryConcern === 'acne' ? 5 : 4,
      forType: ['OILY', 'COMBINATION', 'SENSITIVE', 'NORMAL'],
      reason: lastScanResult && lastScanResult.redness > 20 ? `Calms your measured redness level (${lastScanResult.redness}%)` : 'Improves skin texture and tone',
    },
    {
      name: 'Centella Asiatica (Cica)',
      desc: 'Soothes inflammation, repairs micro-tears, and reduces facial redness',
      stars: profile.sensitivity === 'HIGH' ? 5 : 4,
      forType: ['SENSITIVE', 'DRY', 'NORMAL', 'COMBINATION'],
      reason: profile.sensitivity === 'HIGH' ? 'Optimal match for sensitive skin types' : 'Accelerates skin recovery and reduces irritation',
    },
    {
      name: 'Salicylic Acid (BHA)',
      desc: 'Pore-penetrating exfoliant that dissolves oil and prevents breakouts',
      stars: profile.primaryConcern === 'acne' || profile.skinType === 'OILY' ? 5 : 3,
      forType: ['OILY', 'COMBINATION'],
      reason: profile.primaryConcern === 'acne' ? 'Direct match for acne & pore clarity' : 'Helps manage sebum production',
    },
  ];

  return list.filter(i => i.forType.includes(profile.skinType));
}

const AVOID = [
  { name: 'Alcohol Denat', desc: 'Strips natural oils, causing severe dryness and rebound oiliness', img: ING_ICONS['Alcohol'] },
  { name: 'Synthetic Fragrance', desc: 'Leading cause of contact dermatitis and skin redness', img: ING_ICONS['Strong Fragrance'] },
  { name: 'High AHA Concentration', desc: 'Can over-exfoliate and compromise delicate skin barriers', img: ING_ICONS['High AHA'] },
];

export function RecommendedIngredientsScreen({ state }: { state: State }) {
  const { profile, lastScanResult } = state;
  const [selected, setSelected] = useState<RecommendedIng | null>(null);

  const relevant = computeDynamicRecommendedIngredients(profile, lastScanResult);


  if (selected) {
    return (
      <div style={{ background: '#f7faf9', minHeight: '100%', paddingBottom: 90 }}>
        <div style={{ background: '#fff', padding: '18px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#326859', padding: 0 }}>‹</button>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#111' }}>{selected.name}</h2>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', textAlign: 'center', marginBottom: 14 }}>
            <img src={ING_ICONS[selected.name] || DEFAULT_ING_IMG} alt={selected.name} style={{ width: 100, height: 100, borderRadius: 16, objectFit: 'cover', margin: '0 auto 12px' }} onError={e => { (e.target as HTMLImageElement).src = DEFAULT_ING_IMG; }} />
            <Stars rating={selected.stars} />
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, marginTop: 10 }}>{selected.desc}</p>
          </div>
          <div style={{ background: '#f0faf7', borderRadius: 16, padding: 16, border: '1px solid #b3ebd8' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a3c30', marginBottom: 8 }}>Why it's recommended for you</div>
            <p style={{ fontSize: 13, color: '#2d6a4f', lineHeight: 1.6, margin: 0 }}>
              Ideal for {profile.skinType.toLowerCase()} skin types with {profile.primaryConcern} concerns. Works gently without causing irritation at {profile.sensitivity.toLowerCase()} sensitivity levels.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f7faf9', minHeight: '100%', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '18px 20px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', color: '#111' }}>Recommended Ingredients</h2>
        <p style={{ fontSize: 12, color: '#888', margin: 0 }}>Curated for {profile.skinType.toLowerCase()} skin · {profile.primaryConcern}</p>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Best For You */}
        <div style={{ fontSize: 13, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Best for You</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {relevant.map(ing => (
            <button key={ing.name} onClick={() => setSelected(ing)} style={{ background: '#fff', borderRadius: 16, padding: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', gap: 14, alignItems: 'center', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <img
                src={ING_ICONS[ing.name] || DEFAULT_ING_IMG}
                alt={ing.name}
                style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0, border: '1px solid #f0f0f0' }}
                onError={e => { (e.target as HTMLImageElement).src = DEFAULT_ING_IMG; }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 3 }}>{ing.name}</div>
                <div style={{ fontSize: 11, color: '#777', marginBottom: 5 }}>{ing.desc}</div>
                <Stars rating={ing.stars} />
              </div>
              <span style={{ color: '#ccc', fontSize: 18 }}>›</span>
            </button>
          ))}
        </div>

        {/* Ingredients to Avoid */}
        <div style={{ fontSize: 13, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Ingredients to Avoid</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {AVOID.map(ing => (
            <div key={ing.name} style={{ background: '#fff', borderRadius: 16, padding: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img src={ing.img} alt={ing.name} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', filter: 'grayscale(40%)' }} onError={e => { (e.target as HTMLImageElement).src = DEFAULT_ING_IMG; }} />
                <div style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>✕</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 3 }}>{ing.name}</div>
                <div style={{ fontSize: 11, color: '#777' }}>{ing.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
