'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrencyStore, SupportedCurrency, CURRENCY_CONFIGS } from '@/lib/currency/store';

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrencyStore();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="h-7 w-16 bg-neutral-100 rounded-lg animate-pulse" />
    );
  }

  const activeConfig = CURRENCY_CONFIGS[currency];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 py-1 px-2 text-[11px] font-mono uppercase font-semibold text-[#111111] bg-white hairline-border rounded-lg hover:border-[#111111] transition-all cursor-pointer shadow-2xs"
        aria-label="Change Currency"
      >
        <span className="text-[#6B6B6B]">{activeConfig.symbol}</span>
        <span>{currency}</span>
        <svg
          className={`w-3 h-3 text-[#6B6B6B] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-32 bg-white hairline-border rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1 border-b border-[#F0EFEA] text-[9px] font-mono uppercase tracking-wider text-[#999999]">
            Select Currency
          </div>
          {(Object.keys(CURRENCY_CONFIGS) as SupportedCurrency[]).map((curr) => {
            const isSelected = currency === curr;
            const item = CURRENCY_CONFIGS[curr];
            return (
              <button
                key={curr}
                onClick={() => {
                  setCurrency(curr);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs font-mono flex items-center justify-between transition-colors ${
                  isSelected ? 'bg-[#111111] text-white font-medium' : 'text-[#111111] hover:bg-[#F5F4EF]'
                }`}
              >
                <span>{item.code}</span>
                <span className={isSelected ? 'text-neutral-300' : 'text-[#6B6B6B]'}>{item.symbol}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
