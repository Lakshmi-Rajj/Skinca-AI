import React from 'react';

export function ProPaywallModal({ onClose }: { onClose: () => void }) {
  const features = [
    { icon: '🔬', title: 'Unlimited AI Face Scans', desc: 'Daily precise tracking of hydration, redness, and barrier health.' },
    { icon: '💬', title: 'AI Chat Mentorship', desc: '24/7 access to your personal digital dermatologist.' },
    { icon: '📖', title: 'Full Ingredient Dictionary', desc: 'Deep-dive into ingredient science for 1000+ INCI compounds.' },
    { icon: '📈', title: 'Advanced Progress Analytics', desc: 'Month-over-month skin improvement tracking with photo comparison.' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={onClose}>
      <div
        style={{ background: '#fff', borderRadius: '28px 28px 0 0', width: '100%', maxWidth: 430, padding: '28px 24px 40px', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        {/* PRO badge */}
        <div style={{ position: 'absolute', top: 20, right: 20, background: '#f5bf22', color: '#222', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
          ★ PRO
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 6, marginTop: 0 }}>Unlock Skinca PRO</h2>
        <p style={{ fontSize: 13, color: '#666', marginBottom: 24, lineHeight: 1.5 }}>
          Elevate your skincare with clinical-grade AI analysis and unlimited access.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          {features.map(f => (
            <div key={f.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{f.title}</div>
                <div style={{ fontSize: 12, color: '#777', marginTop: 2 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{ width: '100%', padding: '16px', borderRadius: 14, border: 'none', background: '#111', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 10 }}>
          Go PRO — ₹499/month
        </button>
        <button onClick={onClose} style={{ width: '100%', padding: '12px', border: 'none', background: 'transparent', color: '#888', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
          Maybe Later
        </button>
      </div>
    </div>
  );
}
