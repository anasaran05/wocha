import React from 'react';
import Link from 'next/link';
import {
  STREETWEAR_PRODUCTS,
  GYM_WEAR_PRODUCTS,
  DESIGNER_CHOICE_PRODUCTS,
  NORMAL_WEAR_PRODUCTS,
} from '@/lib/data/showcase';
import { CollectionCarousel } from '@/components/home/CollectionCarousel';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

import { DesignerCurtainCollage } from '@/components/home/DesignerCurtainCollage';
import { AppEntryLoader } from '@/components/home/AppEntryLoader';

export default function HomePage() {
  return (
    <AppEntryLoader>
      <div className="w-full bg-[#FAFAF8] text-[#111111] selection:bg-[#111111] selection:text-white">
      
      {/* =========================================================================
          COLLECTION 1: STREETWEAR (Hero Landing Section)
          ========================================================================= */}
      <section className="relative w-full bg-white border-b border-[#EDEAE3]">
        {/* Full-size Banner Image with luxury entrance animation */}
        <div className="w-full max-w-[1780px] mx-auto px-0 sm:px-6 lg:px-10 pt-0 sm:pt-6 animate-landing-hero">
          <div className="w-full overflow-hidden rounded-none sm:rounded-2xl bg-[#E9EBEA] shadow-xs">
            <img
              src="/street%20wear/street%20wear%20banner.png"
              alt="WOCHA Streetwear Collection"
              className="w-full h-auto object-cover sm:object-contain block"
            />
          </div>
        </div>

        {/* Continuous Product Strip with staggered card cascade entrance */}
        <div className="w-full max-w-[1780px] mx-auto px-0 sm:px-6 lg:px-10">
          <CollectionCarousel
            categorySlug="streetwear"
            products={STREETWEAR_PRODUCTS}
            autoplayIntervalMs={4500}
            animateEntry={true}
          />
        </div>
      </section>


      {/* =========================================================================
          COLLECTION 2: GYM WEAR
          ========================================================================= */}
      <ScrollReveal className="w-full">
        <section className="relative w-full bg-white border-b border-[#EDEAE3] pt-0 sm:pt-10">
          {/* Full-size Banner Image */}
          <div className="w-full max-w-[1780px] mx-auto px-0 sm:px-6 lg:px-10 pt-0 sm:pt-4">
            <div className="w-full overflow-hidden rounded-none sm:rounded-2xl bg-[#161616] shadow-xs">
              <img
                src="/gym%20wear/gym%20wear%20banner%20-final%20.png"
                alt="WOCHA Gym Wear Collection"
                className="w-full h-auto object-cover sm:object-contain block"
              />
            </div>
          </div>

          {/* Continuous Product Strip */}
          <div className="w-full max-w-[1780px] mx-auto px-0 sm:px-6 lg:px-10">
            <CollectionCarousel
              categorySlug="gym-wear"
              products={GYM_WEAR_PRODUCTS}
              autoplayIntervalMs={4500}
            />
          </div>
        </section>
      </ScrollReveal>


      {/* =========================================================================
          COLLECTION 3: DESIGNER'S CHOICE & RISING CURTAIN COLLAGE
          ========================================================================= */}
      <section className="relative w-full bg-white border-b border-[#EDEAE3] pt-0 sm:pt-10">
        {/* Full-size Banner Image */}
        <div className="w-full max-w-[1780px] mx-auto px-0 sm:px-6 lg:px-10 pt-0 sm:pt-4">
          <div className="w-full overflow-hidden rounded-none sm:rounded-2xl bg-[#111111] shadow-xs">
            <img
              src="/Desing%20wear/designer%20wear%20banner%20-final%20.png"
              alt="WOCHA Designer's Choice Collection"
              className="w-full h-auto object-cover sm:object-contain block"
            />
          </div>
        </div>

        {/* Sticky Product Strip & Rising Curtain Grid Collage */}
        <DesignerCurtainCollage products={DESIGNER_CHOICE_PRODUCTS} />
      </section>

      </div>
    </AppEntryLoader>
  );
}
