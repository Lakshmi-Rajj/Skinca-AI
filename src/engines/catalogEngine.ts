import type { CatalogProduct, UserProfile } from '../types/mobile.types';
import { CATALOG_DATA } from './catalog.data';
import { scoreProduct } from './routineEngine';

export function rankCatalogForProfile(profile: UserProfile): CatalogProduct[] {
  return CATALOG_DATA
    .map(p => ({
      ...p,
      matchScore: Math.min(99, Math.max(40, scoreProduct(p, profile))),
    }))
    .filter(p => p.matchScore >= 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function findProductByName(name: string): CatalogProduct | undefined {
  const lower = name.toLowerCase();
  return CATALOG_DATA.find(p =>
    lower.includes(p.name.toLowerCase()) ||
    lower.includes(`${p.brand} ${p.name}`.toLowerCase()) ||
    `${p.brand} ${p.name}`.toLowerCase().includes(lower),
  );
}

export function buildAffiliateUrl(url: string, productId: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'skinca');
    u.searchParams.set('utm_medium', 'app');
    u.searchParams.set('utm_campaign', 'product_rec');
    u.searchParams.set('utm_content', productId);
    return u.toString();
  } catch {
    return url;
  }
}
