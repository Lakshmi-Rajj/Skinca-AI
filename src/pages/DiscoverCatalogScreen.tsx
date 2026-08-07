import React, { useState } from 'react';
import type { useMobileState } from '../hooks/useMobileState';
import { formatCurrency } from '../utils/currencyUtils';

type State = ReturnType<typeof useMobileState>;

const DEFAULT_PRODUCT_IMG = 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80';

export function DiscoverCatalogScreen({ state }: { state: State }) {
  const { catalog, toggleSavedProduct, isProductSaved, profile } = state;
  const [activeTab, setActiveTab] = useState<'ALL' | 'SAVED'>('ALL');

  const display = activeTab === 'ALL' ? catalog : catalog.filter(p => isProductSaved(p.id));

  return (
    <div style={{ background: '#f7faf9', minHeight: '100%', paddingBottom: 90 }}>
      {/* Top Navigation */}
      <div style={{ background: '#fff', padding: '16px 20px 12px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#111' }}>Product Catalog</h2>
          <span style={{ fontSize: 11, color: '#888' }}>Currency: <strong>{profile.currency || 'INR'}</strong></span>
        </div>
        <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: 20, padding: 3 }}>
          <button
            onClick={() => setActiveTab('ALL')}
            style={{
              flex: 1, padding: '7px', borderRadius: 17, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
              background: activeTab === 'ALL' ? '#326859' : 'transparent',
              color: activeTab === 'ALL' ? '#fff' : '#555',
            }}
          >All ({catalog.length})</button>
          <button
            onClick={() => setActiveTab('SAVED')}
            style={{
              flex: 1, padding: '7px', borderRadius: 17, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
              background: activeTab === 'SAVED' ? '#326859' : 'transparent',
              color: activeTab === 'SAVED' ? '#fff' : '#555',
            }}
          >Saved ({catalog.filter(p => isProductSaved(p.id)).length})</button>
        </div>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {display.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: '30px 20px', textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🛍️</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>No Products in this Category</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Save products from the Shop tab to see them here.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {display.map(p => {
              const savedStatus = isProductSaved(p.id);
              const numPrice = parseInt(p.priceRange.replace(/[^0-9]/g, ''), 10) || 899;
              const formattedPrice = formatCurrency(numPrice, profile.currency);

              return (
                <div key={p.id} style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={p.image || DEFAULT_PRODUCT_IMG}
                      alt={p.name}
                      style={{ width: '100%', height: 120, objectFit: 'cover' }}
                      onError={e => { (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMG; }}
                    />

                    <div style={{ position: 'absolute', top: 8, right: 8, background: '#326859', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 10 }}>
                      {p.matchScore}%
                    </div>
                  </div>

                  <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>{p.brand}</div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#111', marginTop: 2, lineHeight: 1.3 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: '#326859', fontWeight: 800, marginTop: 4 }}>{formattedPrice}</div>
                    </div>

                    <button
                      onClick={() => toggleSavedProduct(p.id)}
                      style={{
                        width: '100%', marginTop: 10, padding: '8px', borderRadius: 10, border: 'none', cursor: 'pointer',
                        fontSize: 11, fontWeight: 700,
                        background: savedStatus ? '#326859' : '#111',
                        color: '#fff', transition: 'all 0.2s',
                      }}
                    >
                      {savedStatus ? '✓ Saved' : '+ Save'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
