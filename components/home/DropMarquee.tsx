'use client';

import React from 'react';

interface DropMarqueeProps {
  items?: string[];
  speed?: 'normal' | 'fast' | 'slow';
  inverted?: boolean;
  border?: boolean;
  className?: string;
}

export function DropMarquee({
  items = [
    'DROP 04 IS LIVE',
    'BY CREATIVES FOR CREATIVES',
    '500 GSM FRENCH TERRY',
    'WORLDWIDE EXPRESS SHIPPING',
    'LIMITED EDITION BATCHES',
    'PRE-SHRUNK ORGANIC COTTON',
    'WOCHA ATELIER',
    'NO MASS PRODUCTION',
  ],
  speed = 'normal',
  inverted = false,
  border = true,
  className = '',
}: DropMarqueeProps) {
  // Speed mapping in seconds
  const speedClass =
    speed === 'fast'
      ? 'duration-[18s]'
      : speed === 'slow'
      ? 'duration-[38s]'
      : 'duration-[26s]';

  return (
    <div
      className={`relative w-full overflow-hidden select-none py-3 font-mono text-[11px] uppercase tracking-widest ${
        inverted
          ? 'bg-[#111111] text-[#FAFAF8]'
          : 'bg-[#F0EFEA] text-[#111111]'
      } ${border ? (inverted ? 'border-y border-neutral-800' : 'border-y border-[#E5E3DD]') : ''} ${className}`}
      aria-hidden="true"
    >
      <div className="flex w-max">
        {/* Track 1 */}
        <div className={`flex shrink-0 items-center gap-8 animate-marquee ${speedClass}`}>
          {items.map((item, idx) => (
            <div key={`t1-${idx}`} className="flex items-center gap-8 shrink-0">
              <span className="font-semibold tracking-[0.2em]">{item}</span>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${inverted ? 'bg-white/40' : 'bg-[#111111]/30'}`} />
            </div>
          ))}
        </div>

        {/* Track 2 (Clone for infinite loop) */}
        <div className={`flex shrink-0 items-center gap-8 animate-marquee ${speedClass}`}>
          {items.map((item, idx) => (
            <div key={`t2-${idx}`} className="flex items-center gap-8 shrink-0">
              <span className="font-semibold tracking-[0.2em]">{item}</span>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${inverted ? 'bg-white/40' : 'bg-[#111111]/30'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
