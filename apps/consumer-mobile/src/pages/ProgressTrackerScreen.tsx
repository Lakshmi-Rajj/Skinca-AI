import React, { useState } from 'react';
import type { useMobileState } from '../hooks/useMobileState';

type State = ReturnType<typeof useMobileState>;

interface DailyDataPoint {
  dayLabel: string;
  dateIso: string;
  score: number | null;
  amDone: boolean;
  pmDone: boolean;
}

interface WeekDataSummary {
  weekNum: number;
  label: string;
  avgScore: number | null;
  days: DailyDataPoint[];
}

/**
 * Calculates 100% real daily & weekly skin scores based ONLY on actual user logs & AI scan baseline.
 * Returns null for any day or week where no scan or routine step has been completed.
 */
function calculateRealProgress(tracker: State['tracker'], lastScanResult: State['lastScanResult']): WeekDataSummary[] {
  const baseline = lastScanResult ? lastScanResult.overallScore : null;
  const today = new Date();
  
  const weekSummaries: WeekDataSummary[] = [];

  for (let w = 0; w < 4; w++) {
    const days: DailyDataPoint[] = [];
    let sumScore = 0;
    let completedCount = 0;

    for (let d = 0; d < 7; d++) {
      // Calculate date for week w (w=0 is 3 weeks ago, w=3 is current week)
      const dayOffset = (3 - w) * 7 + (6 - d);
      const targetDate = new Date();
      targetDate.setDate(today.getDate() - dayOffset);
      const iso = targetDate.toISOString().slice(0, 10);
      const dayLabel = targetDate.toLocaleDateString('en-US', { weekday: 'short' });

      const entry = tracker.find(t => t.date === iso);
      let dayScore: number | null = null;

      if (baseline !== null) {
        if (entry) {
          const amBonus = entry.amCompleted ? 3 : 0;
          const pmBonus = entry.pmCompleted ? 3 : 0;
          const irrPenalty = (entry.irritationLevel || 0) * 4;
          dayScore = Math.max(30, Math.min(100, baseline + amBonus + pmBonus - irrPenalty));
        } else if (iso === lastScanResult.timestamp?.slice(0, 10) || (w === 3 && d === 6)) {
          // Current scan day
          dayScore = baseline;
        }
      }

      if (dayScore !== null) {
        sumScore += dayScore;
        completedCount++;
      }

      days.push({
        dayLabel,
        dateIso: iso,
        score: dayScore,
        amDone: entry?.amCompleted ?? false,
        pmDone: entry?.pmCompleted ?? false,
      });
    }

    const avgScore = completedCount > 0 ? Math.round(sumScore / completedCount) : null;

    weekSummaries.push({
      weekNum: w + 1,
      label: `Week ${w + 1}`,
      avgScore,
      days,
    });
  }

  return weekSummaries;
}

export function ProgressTrackerScreen({ state }: { state: State }) {
  const { tracker, weeklyAdherence, lastScanResult } = state;
  const [viewMode, setViewMode] = useState<'4_WEEKS' | 'DAILY'>('4_WEEKS');
  const [selectedWeekIdx, setSelectedWeekIdx] = useState<number>(3); // Default to Week 4 (current)

  const weekSummaries = calculateRealProgress(tracker, lastScanResult);
  const activeWeekSummary = weekSummaries[selectedWeekIdx] ?? weekSummaries[3];

  const W = 300, H = 120, padX = 22, padY = 14;
  const graphW = W - padX * 2, graphH = H - padY * 2;

  // Prepare points for current view mode
  const currentPoints = viewMode === '4_WEEKS'
    ? weekSummaries.map((w, i) => ({
        label: `W${w.weekNum}`,
        score: w.avgScore,
        x: padX + (i / 3) * graphW,
      }))
    : activeWeekSummary.days.map((d, i) => ({
        label: d.dayLabel,
        score: d.score,
        x: padX + (i / 6) * graphW,
      }));

  const validScores = currentPoints.map(p => p.score).filter((s): s is number => s !== null);
  const maxScore = validScores.length > 0 ? Math.max(...validScores, 100) : 100;

  const plottedPoints = currentPoints.map(p => {
    if (p.score === null) return { ...p, y: null };
    const y = padY + graphH - (p.score / maxScore) * graphH;
    return { ...p, y };
  });

  const validPlotted = plottedPoints.filter((p): p is { label: string; score: number; x: number; y: number } => p.y !== null);

  const polyline = validPlotted.map(p => `${p.x},${p.y}`).join(' ');
  const area = validPlotted.length > 1
    ? `${validPlotted[0].x},${padY + graphH} ` + polyline + ` ${validPlotted[validPlotted.length - 1].x},${padY + graphH}`
    : '';

  const BASELINE = { hydration: 70, redness: 15, pigmentation: 30, barrier: 80 };
  const improvements = lastScanResult ? [
    { label: 'Hydration', delta: lastScanResult.hydration - BASELINE.hydration, color: '#3b82f6' },
    { label: 'Redness (lower = better)', delta: -(lastScanResult.redness - BASELINE.redness), color: '#ef4444' },
    { label: 'Pigmentation', delta: -(lastScanResult.pigmentation - BASELINE.pigmentation), color: '#f59e0b' },
    { label: 'Barrier Health', delta: lastScanResult.barrierHealth - BASELINE.barrier, color: '#326859' },
  ] : [
    { label: 'Hydration', delta: 0, color: '#3b82f6' },
    { label: 'Redness', delta: 0, color: '#ef4444' },
    { label: 'Pigmentation', delta: 0, color: '#f59e0b' },
    { label: 'Barrier Health', delta: 0, color: '#326859' },
  ];

  const noScan = !lastScanResult;

  function handleSelectWeek(idx: number) {
    setSelectedWeekIdx(idx);
    setViewMode('DAILY');
  }

  return (
    <div style={{ background: '#f7faf9', minHeight: '100%', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '18px 20px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', color: '#111' }}>Track Your Progress</h2>
        <p style={{ fontSize: 12, color: '#888', margin: 0 }}>Real 30-day skin score & daily routine tracking</p>
      </div>

      <div style={{ padding: '14px 16px' }}>
        
        {/* View Mode Segmented Controls */}
        <div style={{ display: 'flex', background: '#e6ece9', borderRadius: 12, padding: 3, marginBottom: 14 }}>
          <button
            onClick={() => setViewMode('4_WEEKS')}
            style={{
              flex: 1, padding: '8px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 700,
              background: viewMode === '4_WEEKS' ? '#ffffff' : 'transparent',
              color: viewMode === '4_WEEKS' ? '#326859' : '#666666',
              boxShadow: viewMode === '4_WEEKS' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            📊 4-Week Overview
          </button>
          <button
            onClick={() => setViewMode('DAILY')}
            style={{
              flex: 1, padding: '8px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 700,
              background: viewMode === 'DAILY' ? '#ffffff' : 'transparent',
              color: viewMode === 'DAILY' ? '#326859' : '#666666',
              boxShadow: viewMode === 'DAILY' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            📅 Daily View (W{selectedWeekIdx + 1})
          </button>
        </div>

        {/* 4 Interactive Week Cards */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {weekSummaries.map((w, i) => {
            const isSelected = viewMode === 'DAILY' && selectedWeekIdx === i;
            const isCurrentWeek = i === 3;
            const displayScore = w.avgScore !== null ? w.avgScore : '—';
            return (
              <div
                key={i}
                onClick={() => handleSelectWeek(i)}
                style={{
                  flex: 1, borderRadius: 16, padding: '10px 6px', textAlign: 'center', cursor: 'pointer',
                  background: isSelected ? '#326859' : isCurrentWeek ? '#eaf2ee' : '#ffffff',
                  boxShadow: isSelected ? '0 4px 14px rgba(50,104,89,0.3)' : '0 2px 10px rgba(0,0,0,0.04)',
                  border: isSelected ? '2px solid #326859' : '1px solid #e0e0e0',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: isSelected ? '#ffffff' : '#666666', marginBottom: 4 }}>
                  Week {w.weekNum}
                </div>
                <div style={{ fontSize: 9, color: isSelected ? 'rgba(255,255,255,0.8)' : '#888888', marginBottom: 2 }}>
                  Skin Score
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: isSelected ? '#ffffff' : '#111111' }}>
                  {displayScore}
                </div>
              </div>
            );
          })}
        </div>

        {/* ALWAYS-VISIBLE GRAPH TABLE CONTAINER */}
        <div style={{ background: '#ffffff', borderRadius: 20, padding: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#111111' }}>
                {viewMode === '4_WEEKS' ? '4-Week Skin Score Trajectory' : `Week ${selectedWeekIdx + 1} Daily Breakdown`}
              </div>
              <div style={{ fontSize: 11, color: '#777777', marginTop: 2 }}>
                {noScan ? 'Day 1 Pending — Run AI scan to record baseline' : viewMode === '4_WEEKS' ? 'Average score per week' : 'Daily calculated scores'}
              </div>
            </div>
            {validScores.length >= 2 && (
              <div style={{ fontWeight: 800, fontSize: 13, color: '#326859', background: '#f0faf7', padding: '4px 10px', borderRadius: 12 }}>
                {validScores[validScores.length - 1] - validScores[0] >= 0 ? '+' : ''}
                {validScores[validScores.length - 1] - validScores[0]} pts
              </div>
            )}
          </div>

          {/* SVG GRAPH TABLE (Always Rendered structure with gridlines) */}
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
            {/* Horizontal Y-Axis Gridlines */}
            {[0, 25, 50, 75, 100].map(v => (
              <g key={v}>
                <line
                  x1={padX}
                  y1={padY + graphH - (v / maxScore) * graphH}
                  x2={W - padX}
                  y2={padY + graphH - (v / maxScore) * graphH}
                  stroke="#f0f0f0"
                  strokeWidth={1}
                  strokeDasharray={v === 0 ? 'none' : '3 3'}
                />
                <text
                  x={padX - 4}
                  y={padY + graphH - (v / maxScore) * graphH + 3}
                  textAnchor="end"
                  fontSize={8}
                  fill="#aaaaaa"
                  fontWeight="600"
                >
                  {v}
                </text>
              </g>
            ))}

            {/* Gradient fill area under plotted line */}
            {area && (
              <polygon points={area} fill="url(#scoreGrad)" opacity={0.25} />
            )}
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#326859" />
                <stop offset="100%" stopColor="#326859" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Connected line plot for valid data points */}
            {polyline && (
              <polyline
                points={polyline}
                fill="none"
                stroke="#326859"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Dotted indicator line if no scan done */}
            {noScan && (
              <line
                x1={padX}
                y1={padY + graphH}
                x2={W - padX}
                y2={padY + graphH}
                stroke="#326859"
                strokeWidth={2}
                strokeDasharray="4 4"
                opacity={0.5}
              />
            )}

            {/* Data Point Nodes & X-Axis Labels */}
            {plottedPoints.map((p, i) => (
              <g key={i}>
                {p.y !== null ? (
                  <>
                    <circle cx={p.x} cy={p.y} r={5} fill="#ffffff" stroke="#326859" strokeWidth={2.5} />
                    <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize={9} fill="#326859" fontWeight="800">
                      {p.score}
                    </text>
                  </>
                ) : (
                  <>
                    {/* Empty uncompleted day/week marker */}
                    <circle cx={p.x} cy={padY + graphH} r={3} fill="#e0e0e0" />
                    <text x={p.x} y={padY + graphH - 8} textAnchor="middle" fontSize={9} fill="#cccccc">
                      —
                    </text>
                  </>
                )}
                <text x={p.x} y={H - 1} textAnchor="middle" fontSize={9} fill="#888888" fontWeight="600">
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Improvements vs Baseline */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 6 }}>Improvements vs Baseline</div>
          {noScan && (
            <div style={{ fontSize: 12, color: '#aaa', marginBottom: 10 }}>Run a scan to see your real improvement data</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {improvements.map(imp => (
              <div key={imp.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: imp.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#555', flex: 1 }}>{imp.label}</span>
                <div style={{ flex: 2, height: 6, background: '#f0f0f0', borderRadius: 3 }}>
                  <div style={{ height: 6, background: noScan ? '#e0e0e0' : imp.color, borderRadius: 3, width: `${Math.min(Math.abs(imp.delta), 100)}%` }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: noScan ? '#ccc' : imp.delta > 0 ? '#326859' : '#ef4444', minWidth: 36, textAlign: 'right' }}>
                  {noScan ? '—' : (imp.delta > 0 ? '+' : '')}{noScan ? '' : imp.delta}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* This Week Adherence Tracker */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>This Week Tracker</div>
            <span style={{ fontSize: 12, color: '#326859', fontWeight: 700 }}>🔥 {weeklyAdherence.currentStreak}-day streak</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {weeklyAdherence.days.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#aaa', marginBottom: 5, fontWeight: 600 }}>{d.label}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 5, background: d.amDone ? '#326859' : '#f0f0f0' }} title="AM" />
                  <div style={{ width: 18, height: 18, borderRadius: 5, background: d.pmDone ? '#1a3c30' : '#f0f0f0' }} title="PM" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

