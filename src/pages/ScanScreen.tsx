import React, { useState } from 'react';
import { LiveSkinAnalyzerScanner } from '../components/LiveSkinAnalyzerScanner';
import type { useMobileState } from '../hooks/useMobileState';

export function ScanScreen({ onScanComplete, state }: { onScanComplete: () => void; state?: ReturnType<typeof useMobileState> }) {
  const [isScanningLive, setIsScanningLive] = useState(false);

  if (isScanningLive) {
    return <LiveSkinAnalyzerScanner state={state} onScanComplete={onScanComplete} />;
  }

  return (
    <div style={{ background: '#ffffff', minHeight: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Title Header */}
      <div style={{ padding: '16px 20px 0' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 4px' }}>AI Face Scanner</h1>
        <p style={{ fontSize: 12, color: '#666', margin: 0 }}>468 3D facial landmark & colorimetry analysis</p>
      </div>

      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        {/* Face Scanner Card */}
        <div style={{
          background: '#f9fbfb',
          borderRadius: 24,
          border: '1.5px solid #326859',
          padding: '28px 20px',
          textAlign: 'center',
          boxShadow: '0 6px 24px rgba(50,104,89,0.08)',
          marginBottom: 20,
        }}>
          {/* Face scan graphic icon */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: '#eaf2ee', color: '#326859',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 38, margin: '0 auto 16px', border: '2px solid #b3ebd8',
          }}>
            🔬
          </div>

          <div style={{ fontWeight: 800, fontSize: 18, color: '#111', marginBottom: 8 }}>
            Real-Time Clinical Face Scan
          </div>

          <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, margin: '0 0 24px', maxWidth: 280, marginLeft: 'auto', marginRight: 'auto' }}>
            Position your face inside the oval frame.<br />
            Measures hydration, erythema redness, lipid barrier health & estimated skin age.
          </p>

          <button
            onClick={() => setIsScanningLive(true)}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 14,
              border: 'none',
              background: '#326859',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(50,104,89,0.3)',
              transition: 'all 0.2s',
            }}
          >
            Launch Camera Scanner →
          </button>
        </div>

        {/* Quick Skip to Dashboard */}
        <button
          onClick={onScanComplete}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: 14,
            border: '1px solid #e0e0e0',
            background: '#ffffff',
            color: '#777777',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Skip Scan & View Dashboard
        </button>

      </div>
    </div>
  );
}
