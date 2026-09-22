'use client';

import React from 'react';
import { ShowcaseProduct } from '@/lib/data/showcase';
import { CollectionCarousel } from './CollectionCarousel';
import { CommunityCollage } from './CommunityCollage';

interface DesignerCurtainCollageProps {
  products: ShowcaseProduct[];
}

export function DesignerCurtainCollage({ products }: DesignerCurtainCollageProps) {
  return (
    <div className="relative w-full">
      {/* Sticky Designer's Choice Product Strip:
          Stays pinned in place as the user scrolls */}
      <div className="sticky top-[64px] sm:top-[72px] z-10 w-full bg-white border-b border-[#EDEAE3] shadow-xs">
        <div className="w-full max-w-[1780px] mx-auto px-0 sm:px-6 lg:px-10 py-2 sm:py-4">
          <CollectionCarousel
            categorySlug="designer-choice"
            products={products}
            autoplayIntervalMs={4500}
          />
        </div>
      </div>

      {/* Rising Curtain Grid Collage:
          Slides up over the pinned product strip to fit to the top, then scrolls cleanly */}
      <div className="relative z-20 w-full bg-[#FAFAF8] shadow-[0_-25px_50px_rgba(0,0,0,0.16)]">
        <CommunityCollage />
      </div>
    </div>
  );
}
