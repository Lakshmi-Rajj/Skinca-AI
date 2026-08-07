import React from 'react';
import { CATALOG_DATA } from '../engines/catalog.data';
import type { VisionAnalysisResult } from '../engines/geminiEngine';
import type { useMobileState } from '../hooks/useMobileState';
import type { CatalogProduct } from '../types/mobile.types';
import { getResolvedUserAvatar } from '../utils/avatarUtils';
import {
  IconDroplets, IconActivity, IconAlertTriangle, IconLeaf, IconShield,
  IconCircleDot, IconSparkles, IconFlame, IconChevronRight,
} from '../components/Icons';

type State = ReturnType<typeof useMobileState>;

function topScanProduct(scan: VisionAnalysisResult, profile: State['profile']): CatalogProduct | null {
  if (!CATALOG_DATA.length) return null;
  const active: string[] = [];
  if (scan.redness > 25)       active.push('redness', 'sensitivity');
  if (scan.hydration < 65)     active.push('dryness', 'dehydration');
  if (scan.acneRisk !== 'LOW') active.push('acne', 'blackheads', 'oiliness');
  if (scan.pigmentation > 40)  active.push('hyperpigmentation', 'dullness');
  if (scan.barrierHealth < 70) active.push('sensitivity', 'dryness');
  active.push(profile.primaryConcern);
  if (profile.secondaryConcern) active.push(profile.secondaryConcern);
  const unique = [...new Set(active)];
  return CATALOG_DATA
    .map(p => ({
      p,
      score: p.skinConcerns.filter(c => unique.includes(c)).length * 20
        + (p.skinTypes.includes(profile.skinType) ? 10 : 0)
        + p.matchScore * 0.3,
    }))
    .sort((a, b) => b.score - a.score)[0]?.p ?? null;
}

const DEFAULT_PRODUCT_IMG = 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80';

function ScoreRing({ score }: { score: number }) {
  const r = 32, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: 'relative', width: 76, height: 76, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={76} height={76} viewBox="0 0 76 76" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={38} cy={38} r={r} fill="none" stroke="#e6f4ef" strokeWidth={6} />
        <circle cx={38} cy={38} r={r} fill="none" stroke="#326859" strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#111', lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 9, color: '#888', fontWeight: 600 }}>/100</div>
      </div>
    </div>
  );
}

// SVG-based metric icons replacing all text emojis
const METRIC_ICONS: Record<string, React.ReactNode> = {
  'Hydration':     <IconDroplets size={16} color="#326859" />,
  'Redness':       <IconActivity size={16} color="#ef4444" />,
  'Pigmentation':  <IconCircleDot size={16} color="#f59e0b" />,
  'Acne Risk':     <IconAlertTriangle size={16} color="#f59e0b" />,
  'Sensitivity':   <IconLeaf size={16} color="#326859" />,
  'Barrier Health':<IconShield size={16} color="#326859" />,
};

export function SkinAnalysisDashboard({ state, onNavigate }: { state: State; onNavigate: (tab: string) => void }) {
  const { profile, weeklyAdherence, catalog, lastScanResult } = state;

  const hasScan = lastScanResult !== null;
  const score = hasScan ? lastScanResult!.overallScore : 0;

  const metrics = hasScan ? [
    { label: 'Hydration',     value: lastScanResult!.hydration,     color: '#326859', isBar: true },
    { label: 'Redness',       value: lastScanResult!.redness,       color: '#ef4444', isBar: true },
    { label: 'Pigmentation',  value: lastScanResult!.pigmentation,  color: '#f59e0b', isBar: true },
    { label: 'Acne Risk',     textVal: lastScanResult!.acneRisk,    color: lastScanResult!.acneRisk === 'HIGH' ? '#ef4444' : lastScanResult!.acneRisk === 'MODERATE' ? '#f59e0b' : '#326859', isBar: false },
    { label: 'Sensitivity',   textVal: lastScanResult!.sensitivity, color: lastScanResult!.sensitivity === 'HIGH' ? '#ef4444' : '#326859', isBar: false },
    { label: 'Barrier Health',value: lastScanResult!.barrierHealth, color: '#326859', isBar: true },
  ] : [
    { label: 'Hydration',     value: 0, color: '#326859', isBar: true,  placeholder: true },
    { label: 'Redness',       value: 0, color: '#f59e0b', isBar: true,  placeholder: true },
    { label: 'Pigmentation',  value: 0, color: '#f59e0b', isBar: true,  placeholder: true },
    { label: 'Acne Risk',     textVal: '—', color: '#888', isBar: false },
    { label: 'Sensitivity',   textVal: profile.sensitivity, color: '#888', isBar: false },
    { label: 'Barrier Health',value: 0, color: '#326859', isBar: true,  placeholder: true },
  ];

  const scoreLabel = hasScan
    ? score >= 80 ? 'Great skin health'
      : score >= 65 ? 'Good — keep going'
      : 'Needs attention'
    : 'Run a scan to start';

  // Bug fix: null-safe catalog fallback
  const topRecommendation = hasScan
    ? topScanProduct(lastScanResult!, profile)
    : (catalog && catalog.length > 0 ? catalog[0] : null);

  // Bug fix: use real user avatar, proper placeholder if none
  const heroImage = lastScanResult?.capturedFaceImage || getResolvedUserAvatar(profile, lastScanResult);

  return (
    <div style={{ background: '#ffffff', minHeight: '100%', paddingBottom: 90, fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Header */}
      <div style={{ padding: '16px 20px 0', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ maxWidth: '58%' }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', lineHeight: 1.25, margin: '0 0 6px' }}>
              {hasScan
                ? <>Analysis <span style={{ color: '#81e6b8' }}>Complete</span></>
                : <>Welcome to <span style={{ color: '#81e6b8' }}>Skinca</span></>}
            </h1>
            <p style={{ fontSize: 12, color: '#888', margin: 0, lineHeight: 1.4 }}>
              {hasScan ? 'Your personalised skin report' : 'Run your first AI scan to begin'}
            </p>
          </div>

          {/* Hero — user's real face or abstract placeholder */}
          <div style={{ width: 120, height: 140, overflow: 'hidden', borderRadius: 20, flexShrink: 0, background: '#f0faf7' }}>
            {heroImage ? (
              <img
                src={heroImage}
                alt="Skin snapshot"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconSparkles size={40} color="#326859" />
              </div>
            )}
          </div>
        </div>

        {/* Score card */}
        <div style={{
          background: '#ffffff', borderRadius: 20, padding: '14px 18px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.07)', border: '1px solid #f0f0f0',
          marginTop: -24, position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          {hasScan ? (
            <ScoreRing score={score} />
          ) : (
            <div style={{ width: 76, height: 76, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconSparkles size={28} color="#aaa" />
            </div>
          )}
          <div>
            <div style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>Overall Skin Score</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#111', margin: '2px 0' }}>
              {hasScan
                ? <>{score} <span style={{ fontSize: 13, color: '#999', fontWeight: 500 }}>/100</span></>
                : <span style={{ fontSize: 14, color: '#aaa' }}>No scan yet</span>}
            </div>
            <div style={{ fontSize: 12, color: '#326859', fontWeight: 700 }}>{scoreLabel}</div>
          </div>
          {hasScan && (
            <div style={{ marginLeft: 'auto', background: '#f0faf7', borderRadius: 12, padding: '6px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: '#888' }}>Skin Age</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#326859' }}>{lastScanResult!.estimatedSkinAge}</div>
            </div>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#111' }}>Skin Metrics</span>
          <button
            onClick={() => onNavigate(hasScan ? 'map' : 'scan')}
            style={{ fontSize: 12, color: '#326859', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 2 }}
          >
            {hasScan ? 'Details' : 'Scan Now'} <IconChevronRight size={14} color="#326859" />
          </button>
        </div>

        {!hasScan && (
          <div style={{ background: '#f0faf7', borderRadius: 14, padding: '12px 14px', border: '1px solid #b3ebd8', marginBottom: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#326859', fontWeight: 700, marginBottom: 2 }}>No scan data yet</div>
            <div style={{ fontSize: 11, color: '#555' }}>Tap Analysis in the bottom nav to scan</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {metrics.map(m => (
            <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {METRIC_ICONS[m.label]}
              </div>
              <span style={{ fontSize: 12, color: '#555', fontWeight: 600, width: 96, flexShrink: 0 }}>{m.label}</span>
              <div style={{ flex: 1 }}>
                {m.isBar ? (
                  <div style={{ height: 6, background: '#f2f3f4', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(m as any).value}%`, background: (m as any).placeholder ? '#e0e0e0' : m.color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                  </div>
                ) : (
                  <div style={{ textAlign: 'right', fontSize: 12, fontWeight: 700, color: m.color }}>
                    {(m as any).textVal}
                  </div>
                )}
              </div>
              {m.isBar && (
                <span style={{ fontSize: 12, fontWeight: 700, color: '#111', width: 34, textAlign: 'right', flexShrink: 0 }}>
                  {(m as any).placeholder ? '—' : `${(m as any).value}%`}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Clinical insight */}
        {hasScan && lastScanResult!.keyInsights && (
          <div style={{ background: '#f0faf7', borderRadius: 14, padding: '12px 14px', border: '1px solid #b3ebd8', marginTop: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#326859', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 }}>AI Insight</div>
            <div style={{ fontSize: 12, color: '#2d6a4f', lineHeight: 1.55 }}>{lastScanResult!.keyInsights}</div>
          </div>
        )}
      </div>

      {/* Weekly streak */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ background: '#f9fbfb', borderRadius: 20, padding: '16px', border: '1px solid #edf4f2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconFlame size={16} color="#f59e0b" />
              <span style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>Weekly Routine</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#326859' }}>{weeklyAdherence.weekScore}%</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {weeklyAdherence.days.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  height: 36, borderRadius: 10,
                  background: d.amDone && d.pmDone ? '#326859' : d.amDone || d.pmDone ? '#b3ebd8' : '#eaf2ee',
                  marginBottom: 5, transition: 'all 0.2s',
                }} />
                <span style={{ fontSize: 10, color: '#888', fontWeight: 600 }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top product */}
      {topRecommendation && (
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Top Pick For You</div>
          <div
            onClick={() => onNavigate('shop')}
            style={{
              background: '#ffffff', borderRadius: 20, padding: '14px', border: '1px solid #eee',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', gap: 14, alignItems: 'center', cursor: 'pointer',
            }}
          >
            <img
              src={topRecommendation.image || DEFAULT_PRODUCT_IMG}
              alt={topRecommendation.name}
              style={{ width: 60, height: 60, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }}
              onError={e => { (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMG; }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>{topRecommendation.brand}</div>
              <div style={{ fontWeight: 800, fontSize: 13, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{topRecommendation.name}</div>
              <div style={{ fontSize: 12, color: '#326859', fontWeight: 700, marginTop: 2 }}>{topRecommendation.priceRange}</div>
            </div>
            <div style={{ background: '#326859', color: '#fff', fontSize: 11, fontWeight: 800, padding: '6px 12px', borderRadius: 20, flexShrink: 0 }}>
              {topRecommendation.matchScore}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
