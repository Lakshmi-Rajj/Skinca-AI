import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import type { UserProfile, SkinType, SkinConcern, SensitivityLevel, AgeRange, Climate, Gender } from '../types/mobile.types';
import { CURRENCIES, formatCurrency, type Currency } from '../utils/currencyUtils';
import {
  IconCamera, IconBookOpen, IconUser, IconSparkles, IconDroplets,
  IconActivity, IconLeaf, IconShieldCheck, IconShield, IconCircleDot,
  IconAlertTriangle, IconClock, IconSearch, IconMeh, IconSun, IconCheck,
} from '../components/Icons';

interface Props {
  onComplete: (data: Partial<UserProfile>) => void;
}

export function OnboardingScreen({ onComplete }: Props) {
  const { user: clerkUser, isSignedIn } = useUser();
  const [step, setStep] = useState(0);

  const [analysisMode, setAnalysisMode] = useState<'FULL_AI_SCAN' | 'QUESTIONNAIRE_ONLY'>('FULL_AI_SCAN');
  const [gender, setGender] = useState<Gender>('FEMALE');
  const [skinType, setSkinType] = useState<SkinType>('COMBINATION');
  const [primaryConcern, setPrimaryConcern] = useState<SkinConcern>('acne');
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>('MODERATE');
  const [ageRange, setAgeRange] = useState<AgeRange>('25-34');
  const [climate, setClimate] = useState<Climate>('TEMPERATE');
  const [currency, setCurrency] = useState<Currency>('INR');
  const [budgetMaxInINR, setBudgetMaxInINR] = useState<number>(3000);
  const [hasConsented, setHasConsented] = useState<boolean>(true);

  const stepsCount = 9;

  function handleFinish() {
    if (!hasConsented) return;
    onComplete({
      gender,
      skinType,
      primaryConcern,
      sensitivity,
      ageRange,
      climate,
      currency,
      budgetMinInINR: 200,
      budgetMaxInINR,
      analysisMode,
      hasConsentedToDataCollection: hasConsented,
      onboardingDone: true,
    });
  }

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', padding: '24px 20px 40px', fontFamily: 'system-ui, -apple-system, sans-serif', boxSizing: 'border-box' }}>
      
      {/* Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#326859' }}>STEP {step + 1} OF {stepsCount}</span>
        <div style={{ flex: 1, height: 6, background: '#eaf2ee', borderRadius: 3, margin: '0 12px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((step + 1) / stepsCount) * 100}%`, background: '#326859', borderRadius: 3, transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>{Math.round(((step + 1) / stepsCount) * 100)}%</span>
      </div>

      {/* User Signed In Confirmation Banner */}
      {isSignedIn && clerkUser && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 16,
          padding: '12px 16px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 12px rgba(16, 185, 129, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {clerkUser.imageUrl ? (
              <img src={clerkUser.imageUrl} alt="Profile Avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #16a34a' }} />
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconCheck size={16} color="#fff" strokeWidth={3} />
              </div>
            )}
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#15803d' }}>
                Signed In as {clerkUser.firstName || clerkUser.fullName || 'Member'}
              </div>
              <div style={{ fontSize: 11, color: '#166534', marginTop: 1 }}>
                {clerkUser.primaryEmailAddress?.emailAddress || 'user@gmail.com'}
              </div>
            </div>
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, background: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: 12, border: '1px solid #86efac', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 4 }}>
            <IconCheck size={11} color="#15803d" strokeWidth={3} /> Verified
          </span>
        </div>
      )}

      {/* STEP 0: Diagnostic Analysis Mode Selection */}
      {step === 0 && (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 6px' }}>Choose Diagnostic Mode</h2>
          <p style={{ fontSize: 13, color: '#666', margin: '0 0 20px', lineHeight: 1.4 }}>How would you like SKINCA to analyze your dermal profile?</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              onClick={() => setAnalysisMode('FULL_AI_SCAN')}
              style={{
                background: analysisMode === 'FULL_AI_SCAN' ? '#f0faf7' : '#ffffff',
                border: analysisMode === 'FULL_AI_SCAN' ? '2px solid #326859' : '1px solid #e5e7eb',
                borderRadius: 16, padding: '16px', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center'
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eaf2ee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconCamera size={22} color="#326859" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#111' }}>AI Face Scan + Questionnaire Analysis</div>
                <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>Full clinical colorimetry, 3D facial zone map, & automatic metric tracking.</div>
              </div>
            </div>

            <div
              onClick={() => setAnalysisMode('QUESTIONNAIRE_ONLY')}
              style={{
                background: analysisMode === 'QUESTIONNAIRE_ONLY' ? '#f0faf7' : '#ffffff',
                border: analysisMode === 'QUESTIONNAIRE_ONLY' ? '2px solid #326859' : '1px solid #e5e7eb',
                borderRadius: 16, padding: '16px', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center'
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eaf2ee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconBookOpen size={22} color="#326859" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#111' }}>Questionnaire Analysis Only</div>
                <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>Privacy-focused baseline diagnostic. Zero camera scans required.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Gender / Biological Sex */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 6px' }}>Gender / Biological Sex</h2>
          <p style={{ fontSize: 13, color: '#666', margin: '0 0 20px', lineHeight: 1.4 }}>Hormones & skin thickness directly impact sebum and barrier biology.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { value: 'FEMALE' as Gender, label: 'Female', icon: <IconUser size={20} color="#326859" />, desc: 'Estrogen dynamics & pregnancy safety' },
              { value: 'MALE' as Gender, label: 'Male', icon: <IconUser size={20} color="#326859" />, desc: 'Thicker skin, higher sebum & shaving care' },
              { value: 'NON_BINARY' as Gender, label: 'Non-Binary', icon: <IconSparkles size={20} color="#326859" />, desc: 'Tailored analysis without assumptions' },
              { value: 'PREFER_NOT_TO_SAY' as Gender, label: 'Prefer Not To Say', icon: <IconShieldCheck size={20} color="#326859" />, desc: 'Standard clinical skin type analysis' },
            ].map(o => (
              <div
                key={o.value}
                onClick={() => setGender(o.value)}
                style={{
                  background: gender === o.value ? '#f0faf7' : '#ffffff',
                  border: gender === o.value ? '2px solid #326859' : '1px solid #e5e7eb',
                  borderRadius: 16, padding: '14px', cursor: 'pointer', textAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#eaf2ee', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                  {o.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{o.label}</div>
                <div style={{ fontSize: 11, color: '#777', marginTop: 2 }}>{o.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Skin Type */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 6px' }}>What is your skin type?</h2>
          <p style={{ fontSize: 13, color: '#666', margin: '0 0 20px', lineHeight: 1.4 }}>This is the foundation of your clinical analysis.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { value: 'DRY' as SkinType, label: 'Dry', icon: <IconSun size={20} color="#f59e0b" />, desc: 'Tight, flaky, craves moisture' },
              { value: 'OILY' as SkinType, label: 'Oily', icon: <IconDroplets size={20} color="#326859" />, desc: 'Shiny, prone to breakouts' },
              { value: 'COMBINATION' as SkinType, label: 'Combination', icon: <IconActivity size={20} color="#326859" />, desc: 'Oily T-zone, dry cheeks' },
              { value: 'SENSITIVE' as SkinType, label: 'Sensitive', icon: <IconLeaf size={20} color="#ef4444" />, desc: 'Easily irritated, reactive' },
              { value: 'NORMAL' as SkinType, label: 'Normal', icon: <IconShieldCheck size={20} color="#326859" />, desc: 'Balanced, few concerns' },
            ].map(o => (
              <div
                key={o.value}
                onClick={() => setSkinType(o.value)}
                style={{
                  background: skinType === o.value ? '#f0faf7' : '#ffffff',
                  border: skinType === o.value ? '2px solid #326859' : '1px solid #e5e7eb',
                  borderRadius: 14, padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {o.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{o.label}</div>
                  <div style={{ fontSize: 11, color: '#666' }}>{o.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Primary Skin Concern */}
      {step === 3 && (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 6px' }}>Primary skin concern?</h2>
          <p style={{ fontSize: 13, color: '#666', margin: '0 0 20px', lineHeight: 1.4 }}>We will prioritize active ingredients targeting this.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { value: 'acne' as SkinConcern, label: 'Acne & Blemishes', icon: <IconAlertTriangle size={20} color="#ef4444" /> },
              { value: 'hyperpigmentation' as SkinConcern, label: 'Dark Spots & Pigment', icon: <IconCircleDot size={20} color="#f59e0b" /> },
              { value: 'redness' as SkinConcern, label: 'Redness & Rosacea', icon: <IconActivity size={20} color="#ef4444" /> },
              { value: 'wrinkles' as SkinConcern, label: 'Fine Lines & Aging', icon: <IconClock size={20} color="#326859" /> },
              { value: 'dryness' as SkinConcern, label: 'Dehydration & Dullness', icon: <IconDroplets size={20} color="#326859" /> },
              { value: 'pores' as SkinConcern, label: 'Enlarged Pores', icon: <IconSearch size={20} color="#326859" /> },
            ].map(o => (
              <div
                key={o.value}
                onClick={() => setPrimaryConcern(o.value)}
                style={{
                  background: primaryConcern === o.value ? '#f0faf7' : '#ffffff',
                  border: primaryConcern === o.value ? '2px solid #326859' : '1px solid #e5e7eb',
                  borderRadius: 14, padding: '14px', cursor: 'pointer', textAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                  {o.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{o.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: Skin Sensitivity Level */}
      {step === 4 && (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 6px' }}>Sensitivity level?</h2>
          <p style={{ fontSize: 13, color: '#666', margin: '0 0 20px', lineHeight: 1.4 }}>Sets safe active ingredient concentration thresholds.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { value: 'LOW' as SensitivityLevel, label: 'Low Sensitivity', icon: <IconShieldCheck size={20} color="#326859" />, desc: 'Tolerates active acids & retinoids well' },
              { value: 'MODERATE' as SensitivityLevel, label: 'Moderate Sensitivity', icon: <IconMeh size={20} color="#f59e0b" />, desc: 'Occasional mild flushing or tingling' },
              { value: 'HIGH' as SensitivityLevel, label: 'High Sensitivity', icon: <IconAlertTriangle size={20} color="#ef4444" />, desc: 'Very reactive — requires fragrance-free & soothing actives' },
            ].map(o => (
              <div
                key={o.value}
                onClick={() => setSensitivity(o.value)}
                style={{
                  background: sensitivity === o.value ? '#f0faf7' : '#ffffff',
                  border: sensitivity === o.value ? '2px solid #326859' : '1px solid #e5e7eb',
                  borderRadius: 14, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {o.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{o.label}</div>
                  <div style={{ fontSize: 11, color: '#666' }}>{o.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: Age Range & Climate */}
      {step === 5 && (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 6px' }}>Age Range & Environment</h2>
          <p style={{ fontSize: 13, color: '#666', margin: '0 0 20px', lineHeight: 1.4 }}>Affects cellular turnover speed & atmospheric moisture loss.</p>
          
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 8 }}>Age Bracket</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(['18-24', '25-34', '35-44', '45-54', '55+'] as AgeRange[]).map(a => (
                <button
                  key={a}
                  onClick={() => setAgeRange(a)}
                  style={{
                    padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                    background: ageRange === a ? '#326859' : '#f0f0f0', color: ageRange === a ? '#fff' : '#555'
                  }}
                >{a}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 8 }}>Climate Environment</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { value: 'TEMPERATE' as Climate, label: 'Temperate', icon: <IconSun size={16} color="#f59e0b" /> },
                { value: 'HUMID' as Climate, label: 'Humid', icon: <IconDroplets size={16} color="#326859" /> },
                { value: 'DRY' as Climate, label: 'Dry / Arid', icon: <IconSun size={16} color="#ef4444" /> },
                { value: 'COLD' as Climate, label: 'Cold / Wind', icon: <IconShield size={16} color="#3b82f6" /> },
              ].map(c => (
                <button
                  key={c.value}
                  onClick={() => setClimate(c.value)}
                  style={{
                    padding: '12px', borderRadius: 12, border: climate === c.value ? '2px solid #326859' : '1px solid #e5e7eb',
                    background: climate === c.value ? '#f0faf7' : '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', color: '#111',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                  }}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: Multi-Currency Selection */}
      {step === 6 && (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 6px' }}>Select Preferred Currency</h2>
          <p style={{ fontSize: 13, color: '#666', margin: '0 0 20px', lineHeight: 1.4 }}>All catalog prices & budget filters will automatically convert to your local currency.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(Object.keys(CURRENCIES) as Currency[]).map(cKey => {
              const c = CURRENCIES[cKey];
              return (
                <div
                  key={cKey}
                  onClick={() => setCurrency(cKey)}
                  style={{
                    background: currency === cKey ? '#f0faf7' : '#ffffff',
                    border: currency === cKey ? '2px solid #326859' : '1px solid #e5e7eb',
                    borderRadius: 14, padding: '14px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f0faf7', border: '1px solid #b3ebd8', color: '#326859', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {c.symbol}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: '#111' }}>{c.name} ({c.symbol})</div>
                      <div style={{ fontSize: 11, color: '#777' }}>ISO Code: {c.code}</div>
                    </div>
                  </div>
                  {currency === cKey && <IconCheck size={18} color="#326859" strokeWidth={3} />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 7: Interactive Range Bar Budget Selection */}
      {step === 7 && (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 6px' }}>Max Product Budget Limit</h2>
          <p style={{ fontSize: 13, color: '#666', margin: '0 0 24px', lineHeight: 1.4 }}>Drag the range bar to set your preferred maximum product budget.</p>

          <div style={{ background: '#f9fbfb', borderRadius: 20, padding: '24px 20px', border: '1px solid #e5e7eb', textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', fontWeight: 700 }}>Maximum Target Price</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#326859', margin: '8px 0' }}>
              {formatCurrency(budgetMaxInINR, currency)}
            </div>
            <div style={{ fontSize: 12, color: '#555' }}>
              Filtering products from {formatCurrency(200, currency)} up to {formatCurrency(budgetMaxInINR, currency)}
            </div>

            {/* Interactive Range Slider Bar */}
            <div style={{ marginTop: 24 }}>
              <input
                type="range"
                min={400}
                max={8000}
                step={200}
                value={budgetMaxInINR}
                onChange={e => setBudgetMaxInINR(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#326859', cursor: 'pointer', height: 8 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888', marginTop: 8 }}>
                <span>Budget ({formatCurrency(400, currency)})</span>
                <span>Masstige ({formatCurrency(2500, currency)})</span>
                <span>Luxury ({formatCurrency(8000, currency)}+)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 8: Mandatory HIPAA Data Processing Consent Agreement */}
      {step === 8 && (
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 6px' }}>Data Privacy & Clinical Consent</h2>
          <p style={{ fontSize: 13, color: '#666', margin: '0 0 20px', lineHeight: 1.4 }}>Please review and confirm data collection terms to initialize your clinical diagnostic.</p>

          <div style={{ background: '#f0faf7', borderRadius: 16, padding: '16px 18px', border: '1px solid #b3ebd8', marginBottom: 20 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#326859', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconShieldCheck size={18} color="#326859" /> Clinical Data Handling Commitment
            </div>
            <div style={{ fontSize: 12, color: '#444', lineHeight: 1.5 }}>
              • All colorimetric face scans are processed 100% on-device or via encrypted HIPAA-compliant endpoints.<br />
              • Your dermal diagnostic responses are strictly used to recommend compatible ingredients and will never be shared with 3rd parties.
            </div>
          </div>

          {/* Consent Checkbox */}
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', background: '#ffffff', padding: 14, borderRadius: 14, border: '1px solid #e5e7eb' }}>
            <input
              type="checkbox"
              checked={hasConsented}
              onChange={e => setHasConsented(e.target.checked)}
              style={{ width: 20, height: 20, accentColor: '#326859', cursor: 'pointer', marginTop: 2 }}
            />
            <span style={{ fontSize: 13, color: '#111', fontWeight: 600, lineHeight: 1.4 }}>
              I agree to the collection and clinical analysis of my questionnaire responses and facial skin photos for AI skin diagnostic purposes in accordance with Terms & Privacy Policy.
            </span>
          </label>
        </div>
      )}

      {/* Navigation Footer */}
      <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            style={{ padding: '14px 20px', borderRadius: 30, border: '1px solid #ddd', background: '#fff', color: '#555', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
          >Back</button>
        )}
        
        {step < stepsCount - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            style={{ flex: 1, padding: '14px 20px', borderRadius: 30, border: 'none', background: '#326859', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
          >Next Step →</button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={!hasConsented}
            style={{ flex: 1, padding: '14px 20px', borderRadius: 30, border: 'none', background: hasConsented ? '#326859' : '#ccc', color: '#fff', fontWeight: 800, fontSize: 14, cursor: hasConsented ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            Finish & Build Clinical Profile <IconSparkles size={16} color="#fff" />
          </button>
        )}
      </div>
    </div>
  );
}
