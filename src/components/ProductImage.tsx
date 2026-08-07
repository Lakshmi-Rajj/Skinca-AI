import React, { useState } from 'react';

// Brand color map for fallback pill display
const BRAND_COLORS: Record<string, string> = {
  'CeraVe':         '#0066B3',
  'The Ordinary':   '#000000',
  'La Roche-Posay': '#005BAC',
  'Paula\'s Choice': '#C8102E',
  'The Inkey List': '#2C2C2C',
  'COSRX':          '#8B4513',
  'Neutrogena':     '#F7A81B',
  'Kiehl\'s':       '#2B5F3D',
  'Medik8':         '#1B4D6E',
  'Avène':          '#7BB4D8',
  'Supergoop!':     '#FF6B35',
  'Altruist':       '#4CAF50',
};

// Abbreviation for fallback text — first letter of each word
function abbrev(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

interface ProductImageProps {
  src: string;
  alt: string;
  brand: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export function ProductImage({ src, alt, brand, width = 56, height = 56, style }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const brandColor = BRAND_COLORS[brand] ?? '#8E8E93';

  if (failed) {
    // Clean branded fallback tile
    return (
      <div style={{
        width, height,
        borderRadius: 10,
        background: `${brandColor}15`,
        border: `1.5px solid ${brandColor}30`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        flexShrink: 0,
        ...style,
      }}>
        <div style={{
          width: width * 0.5,
          height: width * 0.5,
          borderRadius: '50%',
          background: brandColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: width * 0.18,
          fontWeight: 700,
          letterSpacing: 0.5,
        }}>
          {abbrev(brand)}
        </div>
        <div style={{ fontSize: 8, color: brandColor, fontWeight: 600, textAlign: 'center', maxWidth: width - 8, lineHeight: 1.2 }}>
          {brand.split(' ').slice(0, 2).join(' ')}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width, height, borderRadius: 10, overflow: 'hidden', background: '#F5F5F5', flexShrink: 0, ...style }}>
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
      />
    </div>
  );
}
