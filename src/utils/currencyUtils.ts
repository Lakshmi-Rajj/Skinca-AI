// ============================================================
// MULTI-CURRENCY CONVERSION & FORMATTING ENGINE
// ============================================================

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rateToINR: number; // 1 Currency Unit = X INR
  name: string;
  flag: string;
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rateToINR: 1, name: 'Indian Rupee', flag: '🇮🇳' },
  USD: { code: 'USD', symbol: '$', rateToINR: 83.5, name: 'US Dollar', flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', rateToINR: 90.2, name: 'Euro', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', rateToINR: 106.0, name: 'British Pound', flag: '🇬🇧' },
  AED: { code: 'AED', symbol: 'د.إ', rateToINR: 22.7, name: 'UAE Dirham', flag: '🇦🇪' },
};

/**
 * Formats a base price in INR to the selected target currency string
 */
export function formatCurrency(priceInINR: number, currency: Currency = 'INR'): string {
  const conf = CURRENCIES[currency] || CURRENCIES.INR;
  const converted = priceInINR / conf.rateToINR;

  if (currency === 'INR') {
    return `₹${Math.round(converted).toLocaleString('en-IN')}`;
  }
  if (currency === 'AED') {
    return `${Math.round(converted)} د.إ`;
  }
  return `${conf.symbol}${converted.toFixed(2)}`;
}

/**
 * Converts price from INR to selected target currency numeric value
 */
export function convertFromINR(priceInINR: number, currency: Currency = 'INR'): number {
  const conf = CURRENCIES[currency] || CURRENCIES.INR;
  return Math.round((priceInINR / conf.rateToINR) * 100) / 100;
}

/**
 * Converts selected target currency value back to base INR value
 */
export function convertToINR(amount: number, currency: Currency = 'INR'): number {
  const conf = CURRENCIES[currency] || CURRENCIES.INR;
  return Math.round(amount * conf.rateToINR);
}
