'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type SupportedCurrency = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  label: string;
  rateAgainstUSD: number; // Conversion multiplier from base USD
  decimals: number;
}

export const CURRENCY_CONFIGS: Record<SupportedCurrency, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    label: 'INR (₹)',
    rateAgainstUSD: 84.0,
    decimals: 0, // e.g. ₹2,499
  },
  USD: {
    code: 'USD',
    symbol: '$',
    label: 'USD ($)',
    rateAgainstUSD: 1.0,
    decimals: 0, // e.g. $48
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    label: 'EUR (€)',
    rateAgainstUSD: 0.92,
    decimals: 0, // e.g. €45
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    label: 'GBP (£)',
    rateAgainstUSD: 0.79,
    decimals: 0, // e.g. £39
  },
};

interface CurrencyStore {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  formatPrice: (priceUSD: number, explicitPrices?: Partial<Record<SupportedCurrency, number>>) => string;
  getRawPrice: (priceUSD: number, explicitPrices?: Partial<Record<SupportedCurrency, number>>) => number;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: 'INR', // Default to INR as requested for luxury Indian streetwear & international

      setCurrency: (currency) => set({ currency }),

      getRawPrice: (priceUSD, explicitPrices) => {
        const { currency } = get();
        if (explicitPrices && explicitPrices[currency] !== undefined) {
          return explicitPrices[currency]!;
        }
        const config = CURRENCY_CONFIGS[currency];
        const converted = priceUSD * config.rateAgainstUSD;
        // Round cleanly for aesthetic luxury pricing
        if (currency === 'INR') {
          // Round to nearest 99 or clean round
          return Math.round(converted / 50) * 50 - 1 > 0 ? Math.round(converted / 50) * 50 - 1 : Math.round(converted);
        }
        return Math.round(converted);
      },

      formatPrice: (priceUSD, explicitPrices) => {
        const { currency, getRawPrice } = get();
        const config = CURRENCY_CONFIGS[currency];
        const raw = getRawPrice(priceUSD, explicitPrices);

        const formatted = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
          maximumFractionDigits: config.decimals,
          minimumFractionDigits: config.decimals,
        }).format(raw);

        return `${config.symbol}${formatted}`;
      },
    }),
    {
      name: 'wocha-currency-storage',
      version: 1,
      migrate: () => ({ currency: 'INR' as SupportedCurrency }),
      storage: createJSONStorage(() => localStorage),
    }
  )
);
