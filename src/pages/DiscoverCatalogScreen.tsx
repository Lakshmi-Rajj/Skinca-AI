import React, { useState } from 'react';
import type { useMobileState } from '../hooks/useMobileState';
import { formatCurrency } from '../utils/currencyUtils';
import { IconHeart, IconCheck, IconSearch } from '../components/Icons';

type State = ReturnType<typeof useMobileState>;

const DEFAULT_PRODUCT_IMG = 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80';

export function DiscoverCatalogScreen({ state, onViewProduct }: { state: State; onViewProduct?: (id: string) => void }) {
  const { catalog, toggleSavedProduct, isProductSaved, profile } = state;
  const [activeTab, setActiveTab] = useState<'ALL' | 'SAVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const base = activeTab === 'ALL' ? catalog : catalog.filter(p => isProductSaved(p.id));
  const display = searchQuery.trim()
    ? base.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.skinConcerns.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : base;

  return (
    <div style={{ background: '#f7faf9', minHeight: '100%', paddingBottom: 90, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '16px 16px 12px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#111' }}>Product Catalog</h2>
          <span style={{ fontSize: 11, color: '#888' }}>Currency: <strong>{profile.currency || 'INR'}</strong></span>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <IconSearch size={15} color="#aaa" />
          </div>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products or concerns..."
            style={{
              width: '100%', padding: '9px 12px 9px 36px', borderRadius: 12,
              border: '1.5px solid #e8e8e8', fontSize: 13, outline: 'none',
              background: '#f8f9fa', boxSizing: 'border-box', color: '#111',
            }}
          />
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
            <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>No Products Found</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
              {activeTab === 'SAVED' ? 'Save products to see them here.' : 'Try a different search term.'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {display.map(p => {
              const savedStatus = isProductSaved(p.id);
              const numPrice = p.priceINR || parseInt(p.priceRange.replace(/[^0-9]/g, ''), 10) || 0;
              const formattedPrice = formatCurrency(numPrice, profile.currency);

              return (
                <div
                  key={p.id}
                  style={{
                    background: '#fff', borderRadius: 18, overflow: 'hidden',
                    border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    display: 'flex', flexDirection: 'column', cursor: 'pointer',
                  }}
                  onClick={() => onViewProduct?.(p.id)}
                >
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

                  <div style={{ padding: '10px 10px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 9, color: '#888', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>{p.brand}</div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: '#111', marginTop: 2, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: '#326859', fontWeight: 800, marginTop: 4 }}>{formattedPrice}</div>
                    </div>

                    <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                      {/* Save toggle */}
                      <button
                        onClick={e => { e.stopPropagation(); toggleSavedProduct(p.id); }}
                        style={{
                          width: 34, height: 34, borderRadius: 10, border: savedStatus ? '1.5px solid #326859' : '1.5px solid #e0e0e0',
                          background: savedStatus ? '#f0faf7' : '#fff', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          transition: 'all 0.2s',
                        }}
                      >
                        <IconHeart size={14} color={savedStatus ? '#326859' : '#aaa'} fill={savedStatus ? '#326859' : 'none'} />
                      </button>

                      {/* View details */}
                      <button
                        onClick={e => { e.stopPropagation(); onViewProduct?.(p.id); }}
                        style={{
                          flex: 1, padding: '6px', borderRadius: 10, border: 'none',
                          background: '#111', color: '#fff',
                          fontSize: 11, fontWeight: 700, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        View Details
                      </button>
                    </div>
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
