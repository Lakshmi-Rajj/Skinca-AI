import React, { useState } from 'react';
import type { useMobileState } from '../hooks/useMobileState';
import { IconSun, IconMoon, IconCheck, IconShieldCheck } from '../components/Icons';

type State = ReturnType<typeof useMobileState>;

const STEP_IMAGES: Record<string, string> = {
  CLEANSE:  'https://images.unsplash.com/photo-1556228578-626ce49c31c0?w=80&h=80&fit=crop&auto=format',
  TREAT:    'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=80&h=80&fit=crop&auto=format',
  HYDRATE:  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80&h=80&fit=crop&auto=format',
  PROTECT:  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=80&h=80&fit=crop&auto=format',
  REPAIR:   'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=80&h=80&fit=crop&auto=format',
  NOURISH:  'https://images.unsplash.com/photo-1552693673-1bf958298935?w=80&h=80&fit=crop&auto=format',
};

export function PersonalizedRoutineScreen({ state }: { state: State }) {
  const { routine, profile, tracker, toggleStep } = state;
  const [activeTab, setActiveTab] = useState<'AM' | 'PM'>('AM');

  const steps = activeTab === 'AM' ? (routine?.am ?? []) : (routine?.pm ?? []);

  // Determine today's AM/PM completion from tracker
  const today = new Date().toISOString().slice(0, 10);
  const todayEntry = tracker.find(t => t.date === today);
  const amDone = todayEntry?.amCompleted ?? false;
  const pmDone = todayEntry?.pmCompleted ?? false;

  return (
    <div style={{ background: '#f7faf9', minHeight: '100%', paddingBottom: 90, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '18px 20px 0', borderBottom: '1px solid #f0f0f0' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 2px', color: '#111' }}>Your Routine</h2>
        <p style={{ fontSize: 12, color: '#888', margin: '0 0 14px' }}>{profile.skinType} skin · {profile.primaryConcern}</p>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 0 }}>
          {(['AM', 'PM'] as const).map(t => {
            const isActive = activeTab === t;
            const isDone = t === 'AM' ? amDone : pmDone;
            return (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                flex: 1, padding: '10px 0', border: 'none', background: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: isActive ? 700 : 500,
                color: isActive ? '#326859' : '#888',
                borderBottom: isActive ? '2.5px solid #326859' : '2.5px solid transparent',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                {t === 'AM'
                  ? <IconSun size={14} color={isActive ? '#326859' : '#aaa'} />
                  : <IconMoon size={14} color={isActive ? '#326859' : '#aaa'} />}
                {t === 'AM' ? 'Morning' : 'Evening'}
                {isDone && (
                  <span style={{ background: '#326859', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconCheck size={9} color="#fff" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {steps.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: '40px 20px', textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
              <IconShieldCheck size={40} color="#b3ebd8" />
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>No Routine Yet</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>Complete onboarding to generate your routine</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map((step, i) => {
              const stepKey = String(step.order);
              const isChecked = activeTab === 'AM' ? amDone : pmDone;
              return (
                <div key={i} style={{
                  background: '#fff', borderRadius: 18, padding: '14px 16px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  display: 'flex', gap: 12, alignItems: 'center',
                  border: isChecked ? '1px solid #b3ebd8' : '1px solid transparent',
                  transition: 'border 0.2s',
                }}>
                  {/* Step order */}
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: isChecked ? '#326859' : '#f0f0f0',
                    color: isChecked ? '#fff' : '#555',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 12, transition: 'all 0.2s',
                  }}>
                    {isChecked ? <IconCheck size={12} color="#fff" strokeWidth={3} /> : step.order}
                  </div>

                  {/* Step info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, color: '#326859', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 1 }}>{step.category}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{step.productName}</div>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{step.cosmeticBenefit}</div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <span style={{ background: '#f0faf7', color: '#326859', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>
                        {step.keyIngredient}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                        background: step.layeringSafety === 'SAFE' ? '#f0faf7' : '#fef9c3',
                        color: step.layeringSafety === 'SAFE' ? '#326859' : '#854d0e',
                      }}>
                        {step.layeringSafety === 'SAFE' ? 'Safe' : 'Caution'}
                      </span>
                    </div>
                  </div>

                  {/* Product image */}
                  <img
                    src={step.image || STEP_IMAGES[step.category] || STEP_IMAGES.HYDRATE}
                    alt={step.productName}
                    style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0, border: '1px solid #f0f0f0' }}
                    onError={e => { (e.target as HTMLImageElement).src = STEP_IMAGES.HYDRATE; }}
                  />
                </div>
              );
            })}

            {/* Mark done button — Bug 5 fix */}
            <button
              onClick={() => toggleStep(activeTab === 'AM' ? '1' : '1_pm')}
              style={{
                width: '100%', padding: '14px', borderRadius: 16, border: 'none', marginTop: 4,
                background: (activeTab === 'AM' ? amDone : pmDone) ? '#f0faf7' : '#326859',
                color: (activeTab === 'AM' ? amDone : pmDone) ? '#326859' : '#fff',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: (activeTab === 'AM' ? amDone : pmDone) ? 'none' : '0 4px 14px rgba(50,104,89,0.3)',
                outline: (activeTab === 'AM' ? amDone : pmDone) ? '1.5px solid #b3ebd8' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <IconCheck size={16} color={(activeTab === 'AM' ? amDone : pmDone) ? '#326859' : '#fff'} strokeWidth={2.5} />
              {(activeTab === 'AM' ? amDone : pmDone)
                ? `${activeTab === 'AM' ? 'Morning' : 'Evening'} Done`
                : `Mark ${activeTab === 'AM' ? 'Morning' : 'Evening'} as Done`}
            </button>
          </div>
        )}

        {/* Rationale */}
        {routine?.aiRationale && (
          <div style={{ background: '#f0faf7', borderRadius: 18, padding: '14px', marginTop: 12, border: '1px solid #b3ebd8' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#1a3c30', marginBottom: 4 }}>Why this routine?</div>
            <p style={{ fontSize: 12, color: '#2d6a4f', lineHeight: 1.6, margin: 0 }}>{routine.aiRationale}</p>
          </div>
        )}

        {/* Contraindications */}
        {routine?.contraindications && routine.contraindications.length > 0 && (
          <div style={{ background: '#fff9f0', borderRadius: 16, padding: '12px 14px', marginTop: 10, border: '1px solid #fed7aa' }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#9a3412', marginBottom: 6 }}>Notes</div>
            {routine.contraindications.map((c, i) => (
              <div key={i} style={{ fontSize: 11, color: '#9a3412', marginBottom: 3, lineHeight: 1.4 }}>· {c}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
