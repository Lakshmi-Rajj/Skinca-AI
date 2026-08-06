import React, { useState } from 'react';
import type { useMobileState } from '../hooks/useMobileState';

type State = ReturnType<typeof useMobileState>;

const COMPATIBILITY_DB = [
  { a: 'Retinol', b: 'AHA/BHA', status: 'AVOID_TOGETHER' as const, reason: 'Both exfoliate aggressively — together causes irritation, barrier damage, and chemical burns.', advice: 'Use retinol at night, AHA/BHA on alternate nights.' },
  { a: 'Vitamin C', b: 'Niacinamide', status: 'USE_SEPARATELY' as const, reason: 'High concentrations may form niacin and cause flushing. Low doses are generally fine.', advice: 'If using both, apply Vitamin C in AM and niacinamide in PM.' },
  { a: 'Retinol', b: 'Vitamin C', status: 'USE_SEPARATELY' as const, reason: 'Both are active and can cause sensitivity when used together. Different pH levels reduce efficacy.', advice: 'Vitamin C in AM routine, retinol PM only.' },
  { a: 'Niacinamide', b: 'Hyaluronic Acid', status: 'SAFE_TO_LAYER' as const, reason: 'Perfect duo. Both are gentle, hydrating, and increase barrier function synergistically.', advice: 'Apply hyaluronic acid on damp skin first, then niacinamide.' },
  { a: 'Ceramides', b: 'Retinol', status: 'SAFE_TO_LAYER' as const, reason: 'Ceramides buffer retinol irritation significantly. Applying ceramides after retinol improves tolerance.', advice: 'Apply retinol, wait 20 minutes, then apply ceramide moisturiser.' },
  { a: 'AHA', b: 'BHA', status: 'USE_SEPARATELY' as const, reason: 'Using both simultaneously over-exfoliates. Results in severe irritation and sensitised skin.', advice: 'Alternate nights: AHA Monday/Wednesday/Friday, BHA Tuesday/Thursday.' },
  { a: 'Benzoyl Peroxide', b: 'Retinol', status: 'AVOID_TOGETHER' as const, reason: 'Benzoyl peroxide oxidises and deactivates retinol, while dramatically increasing irritation.', advice: 'Use benzoyl peroxide AM, retinol PM. Never on the same evening.' },
  { a: 'Vitamin C', b: 'SPF', status: 'SAFE_TO_LAYER' as const, reason: 'Vitamin C supercharges SPF efficacy by providing antioxidant protection against UV-induced free radicals.', advice: 'Apply Vitamin C first, let absorb, then SPF. Perfect AM stack.' },
];

const statusConfig = {
  SAFE_TO_LAYER: { color: '#326859', bg: '#f0faf7', border: '#b3ebd8', label: '✓ Safe to Layer', icon: '✅' },
  USE_SEPARATELY: { color: '#d97706', bg: '#fef9c3', border: '#fde68a', label: '⚠ Use Separately', icon: '⚠️' },
  AVOID_TOGETHER: { color: '#dc2626', bg: '#fef2f2', border: '#fca5a5', label: '✗ Avoid Together', icon: '🚫' },
};

export function LayeringCompatibilityScreen({ state }: { state: State }) {
  const [ingA, setIngA] = useState('');
  const [ingB, setIngB] = useState('');
  const [result, setResult] = useState<typeof COMPATIBILITY_DB[0] | 'not-found' | null>(null);

  const ingredients = [...new Set(COMPATIBILITY_DB.flatMap(r => [r.a, r.b]))].sort();

  function checkCompatibility() {
    if (!ingA || !ingB) return;
    const found = COMPATIBILITY_DB.find(r =>
      (r.a === ingA && r.b === ingB) || (r.a === ingB && r.b === ingA)
    );
    setResult(found ?? 'not-found');
  }

  return (
    <div style={{ background: '#f7faf9', minHeight: '100%', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '18px 20px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', color: '#111' }}>Layering Compatibility</h2>
        <p style={{ fontSize: 12, color: '#888', margin: 0 }}>Check ingredient pairings before applying</p>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {/* Selector Card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '18px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: 14 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>First Active Ingredient</label>
            <select
              value={ingA}
              onChange={e => setIngA(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #e0e0e0', fontSize: 13, outline: 'none', background: '#f8f9fa', color: '#111' }}
            >
              <option value="">Select ingredient A...</option>
              {ingredients.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div style={{ textAlign: 'center', color: '#326859', fontWeight: 800, fontSize: 16, margin: '4px 0' }}>+</div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Second Active Ingredient</label>
            <select
              value={ingB}
              onChange={e => setIngB(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #e0e0e0', fontSize: 13, outline: 'none', background: '#f8f9fa', color: '#111' }}
            >
              <option value="">Select ingredient B...</option>
              {ingredients.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <button
            onClick={checkCompatibility}
            disabled={!ingA || !ingB}
            style={{
              width: '100%', padding: '14px', borderRadius: 14, border: 'none',
              background: ingA && ingB ? '#326859' : '#e0e0e0',
              color: ingA && ingB ? '#fff' : '#aaa',
              fontWeight: 700, fontSize: 14, cursor: ingA && ingB ? 'pointer' : 'default', transition: 'all 0.2s',
            }}
          >
            Check Compatibility
          </button>
        </div>

        {/* Result Callout */}
        {result && result !== 'not-found' && (
          <div style={{
            background: statusConfig[result.status].bg,
            border: `1px solid ${statusConfig[result.status].border}`,
            borderRadius: 20, padding: '18px', marginBottom: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>{statusConfig[result.status].icon}</span>
              <span style={{ fontWeight: 800, fontSize: 15, color: statusConfig[result.status].color }}>{statusConfig[result.status].label}</span>
            </div>
            <div style={{ fontSize: 13, color: '#333', lineHeight: 1.5, marginBottom: 10 }}>{result.reason}</div>
            <div style={{ background: '#fff', borderRadius: 12, padding: '10px 12px', fontSize: 12, color: '#555', fontWeight: 600 }}>
              💡 {result.advice}
            </div>
          </div>
        )}

        {result === 'not-found' && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '18px', textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: 14 }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>❓</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>Pairing Not Found</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>This combination has no clinical conflict reported. Apply with general care.</div>
          </div>
        )}

        {/* Database List */}
        <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 10 }}>Common Ingredient Rules</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {COMPATIBILITY_DB.map((rule, idx) => {
            const cfg = statusConfig[rule.status];
            return (
              <div key={idx} style={{ background: '#fff', borderRadius: 16, padding: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{rule.a} + {rule.b}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '3px 8px', borderRadius: 12 }}>{cfg.label}</span>
                </div>
                <div style={{ fontSize: 12, color: '#666', lineHeight: 1.4 }}>{rule.reason}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
