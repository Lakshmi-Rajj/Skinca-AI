import React, { useState } from 'react';
import type { useMobileState } from '../hooks/useMobileState';

type State = ReturnType<typeof useMobileState>;

// Product images for steps
const STEP_IMAGES: Record<string, string> = {
  CLEANSE: 'https://images.unsplash.com/photo-1556228578-626ce49c31c0?w=80&h=80&fit=crop&auto=format',
  TREAT: 'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=80&h=80&fit=crop&auto=format',
  HYDRATE: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80&h=80&fit=crop&auto=format',
  PROTECT: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=80&h=80&fit=crop&auto=format',
  REPAIR: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=80&h=80&fit=crop&auto=format',
  NOURISH: 'https://images.unsplash.com/photo-1552693673-1bf958298935?w=80&h=80&fit=crop&auto=format',
};

export function PersonalizedRoutineScreen({ state }: { state: State }) {
  const { routine, profile } = state;
  const [activeTab, setActiveTab] = useState<'AM' | 'PM'>('AM');

  const steps = activeTab === 'AM' ? (routine?.am ?? []) : (routine?.pm ?? []);

  return (
    <div style={{ background: '#f7faf9', minHeight: '100%', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '18px 20px 0', borderBottom: '1px solid #f0f0f0' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px', color: '#111' }}>Your Personalized Routine</h2>
        <p style={{ fontSize: 12, color: '#888', margin: '0 0 14px' }}>Tailored for {profile.skinType.toLowerCase()} skin</p>

        <div style={{ display: 'flex', gap: 0 }}>
          {(['AM', 'PM'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              flex: 1, padding: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13,
              fontWeight: activeTab === t ? 700 : 500,
              color: activeTab === t ? '#326859' : '#888',
              borderBottom: activeTab === t ? '2.5px solid #326859' : '2.5px solid transparent',
              transition: 'all 0.2s',
            }}>
              {t === 'AM' ? '☀️ Morning Routine' : '🌙 Evening Routine'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {steps.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: '40px 20px', textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🧴</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>Routine Not Generated</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>Complete the onboarding to get your personalized routine</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 18, padding: '14px 16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', gap: 14, alignItems: 'center' }}>
                {/* Step number circle */}
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#326859', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                  {step.order}
                </div>

                {/* Step info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: '#326859', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{step.category}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 2 }}>{step.productName}</div>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>{step.cosmeticBenefit}</div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    <span style={{ background: '#f0faf7', color: '#326859', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>
                      {step.keyIngredient}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                      background: step.layeringSafety === 'SAFE' ? '#f0faf7' : '#fef9c3',
                      color: step.layeringSafety === 'SAFE' ? '#326859' : '#854d0e',
                    }}>
                      {step.layeringSafety === 'SAFE' ? '✓ Safe Layer' : '⚠ Caution'}
                    </span>
                  </div>
                </div>

                {/* Product image */}
                <img
                  src={step.image || STEP_IMAGES[step.category] || STEP_IMAGES.HYDRATE}
                  alt={step.productName}
                  style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', flexShrink: 0, border: '1px solid #f0f0f0' }}
                  onError={e => { (e.target as HTMLImageElement).src = STEP_IMAGES.HYDRATE; }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Why This Routine */}
        {routine?.aiRationale && (
          <div style={{ background: '#f0faf7', borderRadius: 18, padding: '16px', marginTop: 14, border: '1px solid #b3ebd8' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>🌿</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1a3c30', marginBottom: 6 }}>Why this routine?</div>
                <p style={{ fontSize: 12, color: '#2d6a4f', lineHeight: 1.6, margin: 0 }}>{routine.aiRationale}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contraindications */}
        {routine?.contraindications && routine.contraindications.length > 0 && (
          <div style={{ background: '#fff9f0', borderRadius: 18, padding: '14px', marginTop: 12, border: '1px solid #fed7aa' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#9a3412', marginBottom: 8 }}>⚠️ Notes</div>
            {routine.contraindications.map((c, i) => (
              <div key={i} style={{ fontSize: 12, color: '#9a3412', marginBottom: 4 }}>• {c}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
