import React from 'react';
import type { CatalogProduct } from '../types/mobile.types';
import type { useMobileState } from '../hooks/useMobileState';
import { formatCurrency } from '../utils/currencyUtils';
import {
  IconShieldCheck, IconLeaf, IconStar, IconHeart,
  IconChevronRight, IconCheck, IconAlertTriangle,
} from '../components/Icons';

type State = ReturnType<typeof useMobileState>;

const DEFAULT_PRODUCT_IMG = 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80';

function StarRow({ rating, count }: { rating?: number; count?: number }) {
  if (!rating) return null;
  const stars = Math.round(rating);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <IconStar key={i} size={13} color={i < stars ? '#f59e0b' : '#d1d5db'} fill={i < stars ? '#f59e0b' : 'none'} />
        ))}
      </div>
      <span style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>{rating.toFixed(1)}</span>
      {count && <span style={{ fontSize: 11, color: '#aaa' }}>({count.toLocaleString()} reviews)</span>}
    </div>
  );
}

export function ProductDetailScreen({
  product,
  state,
  onBack,
}: {
  product: CatalogProduct;
  state: State;
  onBack: () => void;
}) {
  const { isProductSaved, toggleSavedProduct, profile } = state;
  const saved = isProductSaved(product.id);
  const numPrice = product.priceINR || parseInt(product.priceRange.replace(/[^0-9]/g, ''), 10) || 0;
  const formattedPrice = formatCurrency(numPrice, profile.currency);
  const originalPrice = product.originalPriceINR ? formatCurrency(product.originalPriceINR, profile.currency) : null;
  const discount = product.originalPriceINR && product.priceINR
    ? Math.round((1 - product.priceINR / product.originalPriceINR) * 100)
    : 0;

  return (
    <div style={{ background: '#f7faf9', minHeight: '100%', paddingBottom: 100, fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Back button + hero image */}
      <div style={{ position: 'relative' }}>
        <img
          src={product.image || DEFAULT_PRODUCT_IMG}
          alt={product.name}
          style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }}
          onError={e => { (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMG; }}
        />
        {/* Back button overlay */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: 14, left: 14,
            background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '50%',
            width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
          }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Match score badge */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: '#326859', color: '#fff', fontWeight: 800, fontSize: 13,
          padding: '6px 14px', borderRadius: 20, boxShadow: '0 2px 8px rgba(50,104,89,0.4)',
        }}>
          {product.matchScore}% Match
        </div>
      </div>

      {/* Main card */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '18px', marginTop: -24, position: 'relative', zIndex: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: 11, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
            {product.brand} · {product.category}
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: '#111', margin: '0 0 4px', lineHeight: 1.3 }}>{product.name}</h1>

          <StarRow rating={product.rating} count={product.reviewCount} />

          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#111' }}>{formattedPrice}</span>
            {originalPrice && (
              <>
                <span style={{ fontSize: 14, color: '#aaa', textDecoration: 'line-through' }}>{originalPrice}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: 10 }}>
                  {discount}% off
                </span>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button
              onClick={() => toggleSavedProduct(product.id)}
              style={{
                flex: 1, padding: '13px', borderRadius: 14, border: saved ? '1.5px solid #326859' : '1.5px solid #e0e0e0',
                background: saved ? '#f0faf7' : '#fff', color: saved ? '#326859' : '#555',
                fontWeight: 700, fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.2s',
              }}
            >
              <IconHeart size={16} color={saved ? '#326859' : '#aaa'} fill={saved ? '#326859' : 'none'} />
              {saved ? 'Saved' : 'Save'}
            </button>

            {product.affiliateUrl ? (
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 2, padding: '13px', borderRadius: 14, border: 'none',
                  background: '#326859', color: '#fff', fontWeight: 700, fontSize: 13,
                  cursor: 'pointer', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  boxShadow: '0 4px 14px rgba(50,104,89,0.3)',
                }}
              >
                Buy Now <IconChevronRight size={16} color="#fff" />
              </a>
            ) : (
              <div style={{
                flex: 2, padding: '13px', borderRadius: 14,
                background: '#f0f0f0', color: '#aaa', fontWeight: 700, fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                Not Available
              </div>
            )}
          </div>
        </div>

        {/* Why Recommended */}
        {product.whyRecommended && (
          <div style={{ background: '#fff', borderRadius: 18, padding: '16px', marginTop: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <IconShieldCheck size={18} color="#326859" />
              <span style={{ fontWeight: 800, fontSize: 14, color: '#111' }}>Why It's Recommended</span>
            </div>
            <p style={{ fontSize: 13, color: '#444', lineHeight: 1.6, margin: 0 }}>{product.whyRecommended}</p>
          </div>
        )}

        {/* Key Ingredients */}
        {product.keyIngredients && product.keyIngredients.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 18, padding: '16px', marginTop: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <IconLeaf size={18} color="#326859" />
              <span style={{ fontWeight: 800, fontSize: 14, color: '#111' }}>Key Ingredients</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {product.keyIngredients.map((ing, i) => (
                <span key={i} style={{
                  background: '#f0faf7', color: '#326859', fontSize: 12, fontWeight: 600,
                  padding: '6px 12px', borderRadius: 20, border: '1px solid #b3ebd8',
                }}>
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Compatibility */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '16px', marginTop: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <span style={{ fontWeight: 800, fontSize: 14, color: '#111', display: 'block', marginBottom: 12 }}>Skin Compatibility</span>

          {/* Skin types */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Skin Types</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['OILY', 'DRY', 'COMBINATION', 'SENSITIVE', 'NORMAL'].map(type => {
                const compatible = product.skinTypes.map(s => s.toUpperCase()).includes(type);
                return (
                  <span key={type} style={{
                    fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 16,
                    background: compatible ? '#f0faf7' : '#f5f5f5',
                    color: compatible ? '#326859' : '#aaa',
                    border: compatible ? '1px solid #b3ebd8' : '1px solid #e0e0e0',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    {compatible ? <IconCheck size={10} color="#326859" strokeWidth={3} /> : null}
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Concerns */}
          <div>
            <div style={{ fontSize: 11, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Targets</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {product.skinConcerns.map((concern, i) => (
                <span key={i} style={{
                  fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 16,
                  background: '#f0faf7', color: '#326859', border: '1px solid #b3ebd8',
                }}>
                  {concern}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Budget tier */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '14px 16px', marginTop: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconAlertTriangle size={16} color="#f59e0b" />
          <span style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>
            Budget tier: <strong style={{ color: '#111' }}>{product.budgetTier}</strong>
            {product.isSponsored && <span style={{ marginLeft: 8, fontSize: 10, color: '#888', background: '#f0f0f0', padding: '2px 6px', borderRadius: 8 }}>Sponsored</span>}
          </span>
        </div>
      </div>
    </div>
  );
}
