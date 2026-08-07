import React, { useState } from 'react';
import type { useMobileState } from '../hooks/useMobileState';
import { formatCurrency } from '../utils/currencyUtils';

type State = ReturnType<typeof useMobileState>;

const DEFAULT_PRODUCT_IMG = 'https://images.unsplash.com/photo-1608248597260-9f5a7d32d0b5?auto=format&fit=crop&w=600&q=80';

function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#f59e0b' : '#e0e0e0', fontSize: 12 }}>★</span>
      ))}
      <span style={{ fontSize: 11, color: '#888', marginLeft: 2 }}>{rating.toFixed(1)} ({reviews})</span>
    </div>
  );
}

export function RecommendedProductsScreen({ state }: { state: State }) {
  const { catalog, toggleSavedProduct, isProductSaved, profile } = state;
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Moisturiser', 'Cleanser', 'Serum', 'SPF'];

  const filtered = catalog.filter(p => {
    const matchCat = filter === 'All' || p.category === filter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ background: '#f7faf9', minHeight: '100%', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '18px 20px 14px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#111' }}>Recommended for You</h2>
          <span style={{ fontSize: 11, color: '#888' }}>Currency: <strong>{profile.currency || 'INR'}</strong></span>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          style={{ width: '100%', marginTop: 10, padding: '9px 14px', borderRadius: 25, border: '1px solid #e8e8e8', fontSize: 13, outline: 'none', background: '#f8f9fa', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', gap: 6, marginTop: 10, overflowX: 'auto', paddingBottom: 2 }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
              background: filter === c ? '#326859' : '#f0f0f0', color: filter === c ? '#fff' : '#555',
            }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {/* Promo banner */}
        <div style={{ background: 'linear-gradient(135deg, #fff9e6 0%, #fff3cc 100%)', borderRadius: 16, padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #fde68a' }}>
          <span style={{ fontSize: 24 }}>🎁</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#92400e' }}>Save {formatCurrency(250, profile.currency)} on your routine today!</div>
            <div style={{ fontSize: 11, color: '#b45309', marginTop: 2 }}>Use code: <strong>SKINCA250</strong></div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No products found</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(p => {
              const ratingVal = p.rating ?? 4.5;
              const reviewsVal = p.reviewCount ?? 90;
              const saved = isProductSaved(p.id);
              const ogNum = parseInt(p.priceRange.replace(/[^0-9]/g, ''), 10) || 899;
              const formattedPrice = formatCurrency(ogNum, profile.currency);
              const formattedStrike = formatCurrency(Math.round(ogNum * 1.25), profile.currency);

              return (
                <div key={p.id} style={{ background: '#fff', borderRadius: 20, padding: '16px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', gap: 14 }}>
                    <img
                      src={p.image || DEFAULT_PRODUCT_IMG}
                      alt={p.name}
                      style={{ width: 90, height: 90, borderRadius: 14, objectFit: 'cover', flexShrink: 0, border: '1px solid #f0f0f0' }}
                      onError={e => { (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMG; }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#111', lineHeight: 1.3 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{p.brand}</div>
                      <div style={{ marginTop: 5 }}>
                        <Stars rating={ratingVal} reviews={reviewsVal} />
                      </div>

                      <div style={{ fontSize: 11, color: '#555', marginTop: 4, lineHeight: 1.4 }}>
                        {p.keyIngredients.slice(0, 2).join(' · ')} · {p.skinConcerns.slice(0, 1).join(', ')}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: 18, color: '#111' }}>{formattedPrice}</span>
                      <span style={{ fontSize: 13, color: '#bbb', textDecoration: 'line-through', marginLeft: 8 }}>{formattedStrike}</span>
                    </div>
                    <button
                      onClick={() => toggleSavedProduct(p.id)}
                      style={{ padding: '9px 20px', borderRadius: 25, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, background: saved ? '#326859' : '#111', color: '#fff', transition: 'all 0.2s' }}
                    >
                      {saved ? '✓ Saved' : 'Add to Cart'}
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

