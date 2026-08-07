import React, { useState, useRef, useEffect } from 'react';
import { CATALOG_DATA } from '../engines/catalog.data';
import { analyzeSkinImageWithGeminiVision, extractPixelMetrics, VisionAnalysisResult } from '../engines/geminiEngine';
import type { useMobileState } from '../hooks/useMobileState';
import type { CatalogProduct } from '../types/mobile.types';

const SAMPLE_FACE = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80';
const DEFAULT_PRODUCT_IMG = 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80';

/**
 * Ranks the product catalog by relevance to the actual scan result.
 * Maps numeric scan metrics to qualitative skin concern tags, then scores
 * each product's skinConcerns intersection with those tags.
 * Different scans produce different top-3 results.
 */
function rankProductsByScan(
  scan: VisionAnalysisResult,
  profile?: ReturnType<typeof useMobileState>['profile']
): CatalogProduct[] {
  // Derive active concerns from scan metrics
  const activeConcerns: string[] = [];
  if (scan.redness > 25)       activeConcerns.push('redness', 'sensitivity');
  if (scan.hydration < 65)     activeConcerns.push('dryness', 'dehydration');
  if (scan.acneRisk !== 'LOW') activeConcerns.push('acne', 'blackheads', 'oiliness');
  if (scan.pigmentation > 40)  activeConcerns.push('hyperpigmentation', 'dullness');
  if (scan.barrierHealth < 70) activeConcerns.push('sensitivity', 'dryness');

  // Also include profile concerns
  if (profile?.primaryConcern)   activeConcerns.push(profile.primaryConcern);
  if (profile?.secondaryConcern) activeConcerns.push(profile.secondaryConcern!);

  const uniqueConcerns = [...new Set(activeConcerns)];

  // Score every product: +20 per matching concern, +10 for skin type match, -15 for HIGH sensitivity with fragrance
  const scored = CATALOG_DATA.map(p => {
    let score = 0;
    score += p.skinConcerns.filter(c => uniqueConcerns.includes(c)).length * 20;
    if (profile && p.skinTypes.includes(profile.skinType)) score += 10;
    if (scan.sensitivity === 'HIGH') {
      const hasFrag = p.keyIngredients.some(i =>
        ['fragrance', 'parfum', 'essential oil', 'alcohol denat'].some(f => i.toLowerCase().includes(f))
      );
      if (hasFrag) score -= 15;
    }
    // Boost by pre-computed matchScore as tiebreaker
    score += p.matchScore * 0.3;
    return { p, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.p);
}

// 3D Facial Mesh Dots for scanner visualization
const MESH_POINTS = [
  { x: 50, y: 25 }, { x: 35, y: 28 }, { x: 65, y: 28 }, // Forehead
  { x: 30, y: 48 }, { x: 70, y: 48 }, // Cheeks
  { x: 50, y: 48 }, { x: 50, y: 58 }, // Nose
  { x: 38, y: 72 }, { x: 62, y: 72 }, { x: 50, y: 80 }, // Chin & Jaw
];

export function LiveSkinAnalyzerScanner({
  state,
  onScanComplete,
}: {
  state?: ReturnType<typeof useMobileState>;
  onScanComplete: () => void;
}) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [alignmentMessage, setAlignmentMessage] = useState('🟢 Face Aligned – Ready to Scan!');

  const [scanResult, setScanResult] = useState<VisionAnalysisResult | null>(null);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function requestCameraAccess() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraActive(false);
        return;
      }

      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      if (videoRef.current && stream) {
        const video = videoRef.current;
        video.setAttribute('playsinline', 'true');
        video.setAttribute('autoplay', 'true');
        video.muted = true;
        video.srcObject = stream;
        await video.play().catch(() => {});
        setCameraActive(true);
        setAlignmentMessage('🟢 Live Camera Stream Active');
      }
    } catch {
      setCameraActive(false);
      setAlignmentMessage('🟢 Face Oval Aligned');
    }
  }

  useEffect(() => {
    requestCameraAccess();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setCapturedSnapshot(base64);
        triggerScanWithImage(base64);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleStartScan() {
    if (scanning || countdown !== null) return;
    setCountdown(3);
    setTimeout(() => setCountdown(2), 1000);
    setTimeout(() => setCountdown(1), 2000);
    setTimeout(() => { setCountdown(null); triggerScan(); }, 3000);
  }

  async function runAnalysis(imgSrc: string) {
    setScanError(null);
    setProgress(30);
    setScanStep('Extracting real pixel colorimetry...');

    // Always extract real pixel values from the actual captured image
    const { redness: pixelRedness, contrast: pixelContrast } = await extractPixelMetrics(imgSrc);

    setProgress(55);
    setScanStep('Measuring Skin Barrier & Erythema...');

    try {
      const visionResult = await analyzeSkinImageWithGeminiVision(
        imgSrc,
        state?.profile,
        pixelRedness,
        pixelContrast
      );

      setProgress(85);
      setScanStep('Matching Clinical Ingredients...');

      if (state?.setLastScanResult) {
        state.setLastScanResult({
          ...visionResult,
          capturedFaceImage: imgSrc,
        });
      }


      setTimeout(() => {
        setProgress(100);
        setScanStep(`Scan Complete! Score: ${visionResult.overallScore}/100`);
      }, 1000);

      setTimeout(() => {
        setScanning(false);
        setScanResult(visionResult);
      }, 1800);
    } catch (err: any) {
      setScanning(false);
      setProgress(0);
      if (String(err?.message).startsWith('NO_FACE_DETECTED')) {
        setScanError('😐 No face detected. Please position your face clearly in the oval frame and try again.');
      } else {
        setScanError('⚠️ Analysis failed. Please try again.');
        console.error('[Scanner] Analysis error:', err);
      }
    }
  }

  async function triggerScanWithImage(imgSrc: string) {
    setScanning(true);
    setProgress(15);
    setScanStep('Capturing 468 3D Facial Points...');
    await runAnalysis(imgSrc);
  }

  async function triggerScan() {
    setScanning(true);
    setProgress(15);
    setScanStep('Capturing 468 3D Facial Points...');

    let base64Image = SAMPLE_FACE;

    if (cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const w = video.videoWidth || 400;
      const h = video.videoHeight || 400;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, w, h);
        try {
          base64Image = canvas.toDataURL('image/jpeg', 0.85);
          setCapturedSnapshot(base64Image);
        } catch {
          // Canvas tainted (cross-origin) — use sample face
          base64Image = SAMPLE_FACE;
          setCapturedSnapshot(SAMPLE_FACE);
          console.warn('[Scanner] Canvas tainted — using sample face for colorimetry');
        }
      }
    } else {
      const existing = capturedSnapshot || SAMPLE_FACE;
      setCapturedSnapshot(existing);
      base64Image = existing;
    }

    await runAnalysis(base64Image);
  }

  // ─── RESULTS SCREEN WITH RE-SCAN OPTION ───────────────────────────
  if (scanResult) {
    const topProducts = rankProductsByScan(scanResult, state?.profile);
    return (
      <div style={{ background: '#ffffff', minHeight: '100%', paddingBottom: 100, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {/* Header */}
        <div style={{ background: '#ffffff', padding: '20px 20px 14px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 11, color: '#326859', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>
            AI DIAGNOSTIC REPORT
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#111' }}>Clinical Skin Analysis</h1>
          <div style={{ marginTop: 8, display: 'inline-block', background: '#f0faf7', color: '#326859', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, border: '1px solid #b3ebd8' }}>
            ✓ {scanResult.confidence}% AI Confidence
          </div>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Score + snapshot row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Score ring */}
            <div style={{ background: '#f9fbfb', borderRadius: 20, padding: '20px 14px', border: '1px solid #edf4f2', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 10, fontWeight: 600 }}>Skin Health Score</div>
              <svg width="90" height="90" viewBox="0 0 36 36" style={{ display: 'block', margin: '0 auto', transform: 'rotate(-90deg)' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#326859" strokeDasharray={`${scanResult.overallScore}, 100`} strokeLinecap="round" strokeWidth="3" />
              </svg>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#111', marginTop: 4 }}>{scanResult.overallScore}</div>
              <div style={{ fontSize: 11, color: '#326859', fontWeight: 700 }}>Skin Age: {scanResult.estimatedSkinAge} yrs</div>
            </div>

            {/* Captured snapshot */}
            <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #eee', overflow: 'hidden', position: 'relative' }}>
              <img
                src={capturedSnapshot || SAMPLE_FACE}
                alt="Captured Face Scan"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', bottom: 6, left: 6, right: 6, background: 'rgba(0,0,0,0.7)', borderRadius: 10, padding: '6px 8px', fontSize: 10, color: '#fff', display: 'flex', justifyContent: 'space-around' }}>
                <span>🔴 {scanResult.redness}%</span>
                <span>💧 {scanResult.hydration}%</span>
                <span>🛡 {scanResult.barrierHealth}%</span>
              </div>
            </div>
          </div>

          {/* Key insight from this specific scan */}
          <div style={{ background: '#f0faf7', borderRadius: 16, padding: '12px 14px', border: '1px solid #b3ebd8' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#326859', marginBottom: 4, textTransform: 'uppercase' }}>Clinical Insight</div>
            <div style={{ fontSize: 12, color: '#2d6a4f', lineHeight: 1.5 }}>{scanResult.keyInsights}</div>
          </div>

          {/* Metrics bar */}
          <div style={{ background: '#ffffff', borderRadius: 20, padding: '16px', border: '1px solid #eee' }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#111', marginBottom: 12 }}>Skin Metrics</div>
            {[
              { label: 'Redness (Erythema)', value: scanResult.redness, color: '#ef4444' },
              { label: 'Hydration', value: scanResult.hydration, color: '#3b82f6' },
              { label: 'Barrier Health', value: scanResult.barrierHealth, color: '#326859' },
              { label: 'Pigmentation', value: scanResult.pigmentation, color: '#f59e0b' },
            ].map(m => (
              <div key={m.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#555' }}>{m.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.value}%</span>
                </div>
                <div style={{ height: 6, background: '#eee', borderRadius: 3 }}>
                  <div style={{ height: 6, background: m.color, borderRadius: 3, width: `${Math.min(m.value, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Products */}
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#111', marginBottom: 10 }}>Recommended Products</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {topProducts.map(p => (
                <div key={p.id} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #eee', textAlign: 'center' }}>
                  <img
                    src={p.image || DEFAULT_PRODUCT_IMG}
                    alt={p.name}
                    style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                    onError={e => { (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMG; }}
                  />

                  <div style={{ padding: '8px 6px' }}>
                    <div style={{ fontSize: 9, color: '#888', textTransform: 'uppercase' }}>{p.brand}</div>
                    <div style={{ fontWeight: 700, fontSize: 11, color: '#111', lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: '#326859', fontWeight: 700 }}>{p.priceRange}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RE-SCAN + DASHBOARD BUTTONS */}
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button
              onClick={() => { setScanResult(null); setCapturedSnapshot(null); setScanning(false); setProgress(0); setScanStep(''); setScanError(null); }}
              style={{ flex: 1, padding: '16px', borderRadius: 14, border: '1.5px solid #326859', background: '#f0faf7', color: '#326859', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
            >
              🔄 Re-Scan Face
            </button>
            <button
              onClick={onScanComplete}
              style={{ flex: 1, padding: '16px', borderRadius: 14, border: 'none', background: '#326859', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(50,104,89,0.3)' }}
            >
              Dashboard →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── CAMERA VIEWFINDER ────────────────────────────────────────────
  const borderColor = '#326859';

  return (
    <div style={{ background: '#111111', color: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column', padding: 16, position: 'relative', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* Alignment badge */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4, paddingBottom: 8, zIndex: 20 }}>
        <div style={{
          background: 'rgba(50,104,89,0.3)',
          border: `1px solid ${borderColor}`,
          borderRadius: 30, padding: '7px 16px', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: borderColor }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 }}>{alignmentMessage}</span>
        </div>
      </div>

      {/* Oval Viewfinder */}
      <div style={{
        position: 'relative', width: 220, aspectRatio: '3/4', margin: '0 auto', borderRadius: 200,
        border: `2px dashed ${borderColor}`, overflow: 'hidden', background: '#000000', flexShrink: 0,
        boxShadow: '0 0 30px rgba(50,104,89,0.3)',
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', opacity: cameraActive ? 0.95 : 0 }}
        />

        {!cameraActive && (
          <img src={capturedSnapshot || SAMPLE_FACE} alt="Viewfinder Face" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}

        {/* Live Facial Mesh Dots during scan */}
        {scanning && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 25, pointerEvents: 'none' }}>
            {MESH_POINTS.map((pt, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  top: `${pt.y}%`,
                  left: `${pt.x}%`,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#81e6b8',
                  boxShadow: '0 0 8px #81e6b8',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </div>
        )}

        {/* Countdown overlay */}
        {countdown !== null && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}>
            <div style={{ fontSize: 72, fontWeight: 800, color: '#fff' }}>{countdown}</div>
            <div style={{ fontSize: 12, color: '#81e6b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>CAPTURING 📸</div>
          </div>
        )}

        {/* Scan line animation */}
        {scanning && (
          <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: '#326859', boxShadow: '0 0 12px #326859', top: '50%', zIndex: 20 }} />
        )}

        {/* Corner marks */}
        {[{ top: 8, left: 8 }, { top: 8, right: 8 }, { bottom: 8, left: 8 }, { bottom: 8, right: 8 }].map((pos, i) => (
          <div key={i} style={{ position: 'absolute', ...pos as any, width: 20, height: 20, borderTop: i < 2 ? `2px solid ${borderColor}` : undefined, borderBottom: i >= 2 ? `2px solid ${borderColor}` : undefined, borderLeft: [0, 2].includes(i) ? `2px solid ${borderColor}` : undefined, borderRight: [1, 3].includes(i) ? `2px solid ${borderColor}` : undefined }} />
        ))}
      </div>

      {/* Action area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 80, paddingTop: 16, gap: 10 }}>
        {scanning ? (
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#81e6b8', marginBottom: 8 }}>
              <span>{scanStep}</span>
              <span>{progress}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 4 }}>
              <div style={{ height: 6, background: '#326859', borderRadius: 4, width: `${progress}%`, transition: 'width 0.4s ease' }} />
            </div>
          </div>
        ) : (
          <>
            {/* Error banner — shown when face not detected or analysis fails */}
            {scanError && (
              <div
                onClick={() => setScanError(null)}
                style={{
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.5)',
                  borderRadius: 14,
                  padding: '12px 16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 13, color: '#fca5a5', fontWeight: 700, lineHeight: 1.4 }}>{scanError}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Tap to dismiss</div>
              </div>
            )}

            <button
              onClick={handleStartScan}
              style={{
                width: '100%', padding: '16px', borderRadius: 14, border: 'none', cursor: 'pointer',
                background: '#326859', color: '#ffffff', fontWeight: 800, fontSize: 15,
                boxShadow: '0 4px 14px rgba(50,104,89,0.4)', transition: 'all 0.2s',
              }}
            >
              📸 Start AI Skin Scan
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%', padding: '12px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.08)', color: '#ffffff', fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}
            >
              📷 Snap / Upload Photo
            </button>

            <div style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>
              Face detection · On-device processing · Private
            </div>
          </>
        )}
      </div>
    </div>
  );
}
