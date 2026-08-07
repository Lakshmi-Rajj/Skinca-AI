import React, { useState } from 'react';
import type { useMobileState } from '../hooks/useMobileState';
import { getResolvedUserAvatar } from '../utils/avatarUtils';

type State = ReturnType<typeof useMobileState>;

const TABS = ['Overview', 'Concerns', 'Strengths', 'Skin Map'];

// Facial zone positions for overlay map
const ZONES = [
  { id: 'forehead', name: 'Forehead', type: 'dryness', label: 'Dryness', color: 'rgba(245, 158, 11, 0.45)', x: 34, y: 14, w: 32, h: 18 },
  { id: 'left-cheek', name: 'Left Cheek', type: 'redness', label: 'Redness', color: 'rgba(239, 68, 68, 0.45)', x: 22, y: 44, w: 24, h: 22 },
  { id: 'right-cheek', name: 'Right Cheek', type: 'redness', label: 'Redness', color: 'rgba(239, 68, 68, 0.45)', x: 54, y: 44, w: 24, h: 22 },
  { id: 'nose', name: 'T-Zone Nose', type: 'healthy', label: 'Healthy', color: 'rgba(34, 197, 94, 0.45)', x: 41, y: 42, w: 18, h: 20 },
  { id: 'chin', name: 'Chin & Jaw', type: 'healthy', label: 'Healthy', color: 'rgba(34, 197, 94, 0.45)', x: 36, y: 72, w: 28, h: 16 },
];

export function SkinAnalysisMapScreen({ state }: { state: State }) {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedZone, setSelectedZone] = useState<typeof ZONES[0] | null>(null);
  const { profile, lastScanResult } = state;

  const analysisFaceImage = getResolvedUserAvatar(profile, lastScanResult);
  const hasScan = lastScanResult !== null;


  // Build zone details dynamically from scan result — EMPTY when no scan exists
  const zoneDetails: Record<string, string> = hasScan ? {
    'forehead': `Hydration ${Math.max(30, lastScanResult!.hydration - 15)}% • ${lastScanResult!.hydration < 60 ? 'Mild dehydration lines detected' : 'Adequate moisture levels'}`,
    'left-cheek': `Erythema level ${lastScanResult!.redness}% • ${lastScanResult!.redness > 25 ? 'Elevated capillary reactivity' : 'Slight capillary reactivity'}`,
    'right-cheek': `Erythema level ${Math.max(5, lastScanResult!.redness - 2)}% • ${lastScanResult!.redness > 30 ? 'Ceramides strongly recommended' : 'Calming ceramides recommended'}`,
    'nose': `Sebum ${lastScanResult!.acneRisk === 'HIGH' ? 'elevated — pore congestion risk' : 'balanced • Normal pore congestion'}`,
    'chin': `Lipid barrier ${lastScanResult!.barrierHealth}% • ${lastScanResult!.barrierHealth > 70 ? 'Strong texture' : 'Barrier support recommended'}`,
  } : {
    'forehead': 'No scan data. Run an AI face scan to analyze forehead hydration.',
    'left-cheek': 'No scan data. Run an AI face scan to analyze cheek redness.',
    'right-cheek': 'No scan data. Run an AI face scan to analyze cheek barrier health.',
    'nose': 'No scan data. Run an AI face scan to analyze T-zone sebum.',
    'chin': 'No scan data. Run an AI face scan to analyze chin barrier function.',
  };

  // Build concern list from scan result — EMPTY when no scan exists
  const concernsList = hasScan ? [
    lastScanResult!.redness > 20 && {
      title: 'Cheek Erythema (Redness)',
      severity: `${lastScanResult!.redness > 40 ? 'High' : lastScanResult!.redness > 25 ? 'Moderate' : 'Mild'} (${lastScanResult!.redness}%)`,
      zone: 'Cheeks',
      advice: lastScanResult!.redness > 35
        ? 'Use Centella Asiatica and 4% Niacinamide twice daily. Avoid strong acids.'
        : 'Use Cica & Niacinamide to calm capillary dilation.',
    },
    lastScanResult!.hydration < 70 && {
      title: 'Moisture Depletion',
      severity: `${lastScanResult!.hydration < 50 ? 'Moderate' : 'Mild'} (${lastScanResult!.hydration}%)`,
      zone: 'Forehead & Cheeks',
      advice: 'Layer Hyaluronic Acid on damp skin before cream.',
    },
    lastScanResult!.pigmentation > 35 && {
      title: 'Pigmentation Sensitivity',
      severity: `${lastScanResult!.pigmentation > 60 ? 'High' : 'Low'} (${lastScanResult!.pigmentation}%)`,
      zone: 'Cheeks & Temple',
      advice: 'Apply daily Broad Spectrum SPF 50+ to protect.',
    },
    lastScanResult!.acneRisk !== 'LOW' && {
      title: 'Acne Risk',
      severity: lastScanResult!.acneRisk,
      zone: 'T-Zone',
      advice: 'Salicylic Acid 2% BHA cleanser. Avoid pore-clogging occlusives.',
    },
  ].filter(Boolean) as { title: string; severity: string; zone: string; advice: string }[]
  : [];

  // Build strengths from scan — EMPTY when no scan exists
  const strengthsList = hasScan ? [
    lastScanResult!.barrierHealth > 60 && {
      title: 'Epidermal Lipid Barrier',
      score: `${lastScanResult!.barrierHealth}%`,
      status: lastScanResult!.barrierHealth > 80 ? 'Strong' : 'Moderate',
      desc: lastScanResult!.barrierHealth > 80
        ? 'Resilient against environmental pollutants and moisture loss.'
        : 'Adequate barrier function. Ceramides will strengthen it further.',
    },
    lastScanResult!.hydration > 60 && {
      title: 'Skin Hydration',
      score: `${lastScanResult!.hydration}%`,
      status: lastScanResult!.hydration > 75 ? 'Optimal' : 'Good',
      desc: `Hydration at ${lastScanResult!.hydration}%. Hyaluronic Acid is maintaining your moisture matrix.`,
    },
    lastScanResult!.redness < 30 && {
      title: 'Low Inflammatory Reactivity',
      score: `${100 - lastScanResult!.redness}%`,
      status: 'Balanced',
      desc: 'Minimal erythema. Capillary walls are stable.',
    },
  ].filter(Boolean) as { title: string; score: string; status: string; desc: string }[]
  : [];

  const confidence = hasScan ? lastScanResult!.confidence : null;
  const keyInsight = hasScan
    ? lastScanResult!.keyInsights
    : 'No AI face scan recorded yet. Perform your first AI scan to analyze regional face map zones, hydration, redness, and barrier health!';


  return (
    <div style={{ background: '#ffffff', minHeight: '100%', paddingBottom: 90, fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Page Title */}
      <div style={{ padding: '16px 20px 0' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 14px' }}>Skin Analysis</h1>

        {/* Navigation Sub-Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #eeeeee' }}>
          {TABS.map((tabName, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tabName}
                onClick={() => { setActiveTab(idx); setSelectedZone(null); }}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#326859' : '#888888',
                  borderBottom: isActive ? '2.5px solid #326859' : '2.5px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                {tabName}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '16px 20px 0' }}>

        {/* Main Face Card Overlay */}
        <div style={{
          background: '#f9fbfb',
          borderRadius: 24,
          padding: '16px',
          border: '1px solid #edf4f2',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          marginBottom: 16,
        }}>
          {/* Face Photo Container */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 280, height: 320, margin: '0 auto', overflow: 'hidden', borderRadius: 20 }}>
            <img
              src={analysisFaceImage}
              alt="Skin Diagnostic Map"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />


            {/* Filtered Zone Overlays based on Tab (Only when scan has been performed) */}
            {hasScan ? ZONES.filter(z => {
              if (activeTab === 1) return z.type === 'redness' || z.type === 'dryness'; // Concerns only
              if (activeTab === 2) return z.type === 'healthy'; // Strengths only
              return true; // Overview & Skin Map show all
            }).map(z => {
              const isSelected = selectedZone?.id === z.id;
              return (
                <div
                  key={z.id}
                  onClick={() => setSelectedZone(z)}
                  style={{
                    position: 'absolute',
                    top: `${z.y}%`,
                    left: `${z.x}%`,
                    width: `${z.w}%`,
                    height: `${z.h}%`,
                    background: z.color,
                    borderRadius: 40,
                    border: isSelected ? '2px solid #ffffff' : '1.5px solid rgba(255,255,255,0.6)',
                    boxShadow: isSelected ? '0 0 12px rgba(0,0,0,0.3)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                />
              );
            }) : (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center', backdropFilter: 'blur(2px)' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>📸</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>No AI Scan Recorded</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', marginBottom: 12, lineHeight: 1.4 }}>
                  Take your first AI face scan to generate regional face map overlays & clinical metrics.
                </div>
              </div>
            )}
          </div>


          {/* Color Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ fontSize: 12, color: '#555555', fontWeight: 600 }}>Redness</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ fontSize: 12, color: '#555555', fontWeight: 600 }}>Dryness</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: 12, color: '#555555', fontWeight: 600 }}>Healthy</span>
            </div>
          </div>
        </div>

        {/* TAB 0: OVERVIEW */}
        {activeTab === 0 && (
          <>
            {/* Key Insights Card — from real scan */}
            <div style={{ background: '#f9fbfb', borderRadius: 20, padding: '16px 18px', border: '1px solid #edf4f2', marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#111111', marginBottom: 8 }}>Key Insights</div>
              <p style={{ fontSize: 13, color: '#555555', lineHeight: 1.6, margin: 0 }}>{keyInsight}</p>
              {!hasScan && <p style={{ fontSize: 11, color: '#aaa', margin: '8px 0 0', fontStyle: 'italic' }}>Run a scan for personalized insights</p>}
            </div>

            {/* Scan metrics summary if available */}
            {hasScan && (
              <div style={{ background: '#fff', borderRadius: 20, padding: '16px 18px', border: '1px solid #eee', marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 12 }}>Scan Summary</div>
                {[
                  { label: 'Overall Score', val: `${lastScanResult!.overallScore}/100` },
                  { label: 'Redness', val: `${lastScanResult!.redness}%` },
                  { label: 'Hydration', val: `${lastScanResult!.hydration}%` },
                  { label: 'Barrier Health', val: `${lastScanResult!.barrierHealth}%` },
                  { label: 'Pigmentation', val: `${lastScanResult!.pigmentation}%` },
                  { label: 'Acne Risk', val: lastScanResult!.acneRisk },
                  { label: 'Skin Age', val: `${lastScanResult!.estimatedSkinAge} yrs` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f5f5f5', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#666' }}>{item.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#326859' }}>{item.val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* AI Confidence */}
            <div style={{ background: '#ffffff', borderRadius: 20, padding: '16px 18px', border: '1px solid #eeeeee', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111111' }}>AI Confidence</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#326859' }}>{confidence !== null ? `${confidence}%` : '—'}</span>
              </div>
              <div style={{ height: 6, background: '#eaf2ee', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${confidence ?? 0}%`, background: '#326859', borderRadius: 3 }} />
              </div>
              {hasScan && confidence !== null && confidence < 90 && (
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>
                  Using on-device colorimetry. Add a valid Gemini API key for higher confidence analysis.
                </div>
              )}
            </div>

          </>
        )}

        {/* TAB 1: CONCERNS */}
        {activeTab === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#111111' }}>Detected Skin Concerns</div>
            {concernsList.length === 0 ? (
              <div style={{ background: '#f0faf7', borderRadius: 16, padding: '16px', border: '1px solid #b3ebd8', textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: '#326859', fontWeight: 700 }}>No major concerns detected! 🎉</div>
                <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>Your skin is in good shape. Maintain your routine.</div>
              </div>
            ) : concernsList.map((c, i) => (
              <div key={i} style={{ background: '#fff9f9', borderRadius: 16, padding: '14px', border: '1px solid #fee2e2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>{c.title}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', background: '#fef2f2', padding: '2px 8px', borderRadius: 10 }}>{c.severity}</span>
                </div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Target Zone: <strong>{c.zone}</strong></div>
                <div style={{ fontSize: 12, color: '#444', lineHeight: 1.5, background: '#ffffff', padding: '8px 10px', borderRadius: 10, border: '1px solid #fee2e2' }}>
                  💡 {c.advice}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: STRENGTHS */}
        {activeTab === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#111111' }}>Key Skin Strengths</div>
            {strengthsList.length === 0 ? (
              <div style={{ background: '#fff9f9', borderRadius: 16, padding: '16px', border: '1px solid #fee2e2', textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: '#888' }}>Run a scan to identify your skin strengths</div>
              </div>
            ) : strengthsList.map((s, i) => (
              <div key={i} style={{ background: '#f0faf7', borderRadius: 16, padding: '14px', border: '1px solid #b3ebd8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>{s.title}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#326859', background: '#ffffff', padding: '2px 8px', borderRadius: 10 }}>{s.score} ({s.status})</span>
                </div>
                <div style={{ fontSize: 12, color: '#2d6a4f', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SKIN MAP */}
        {activeTab === 3 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#111111', marginBottom: 8 }}>Interactive Facial Zone Inspection</div>
            <p style={{ fontSize: 12, color: '#666', margin: '0 0 12px' }}>Tap any highlighted zone on the face portrait above to inspect localized diagnostic data.</p>

            {selectedZone ? (
              <div style={{ background: '#f0faf7', borderRadius: 16, padding: '14px 16px', border: '1px solid #326859' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#326859', marginBottom: 4 }}>📍 {selectedZone.name} ({selectedZone.label})</div>
                <div style={{ fontSize: 13, color: '#111', fontWeight: 600 }}>{zoneDetails[selectedZone.id]}</div>
                {!hasScan && <div style={{ fontSize: 11, color: '#aaa', marginTop: 6, fontStyle: 'italic' }}>Run a scan for real zone data</div>}
              </div>
            ) : (
              <div style={{ background: '#f8f9fa', borderRadius: 16, padding: '14px', fontSize: 12, color: '#888', textAlign: 'center', border: '1px dashed #cccccc' }}>
                Tap on forehead, cheeks, nose, or chin zones above to view metrics
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
