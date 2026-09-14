'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { COMING_SOON_PRODUCTS, ComingSoonProduct } from '@/lib/data/showcase';
import { NotifyModal } from '@/components/shop/NotifyModal';
import { useCurrencyStore } from '@/lib/currency/store';

export default function UpcomingDropsPage() {
  const { formatPrice } = useCurrencyStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeNotifyProduct, setActiveNotifyProduct] = useState<ComingSoonProduct | null>(null);

  const categories = [
    { id: 'all', label: 'All Upcoming' },
    { id: 'drop-shoulder', label: 'Drop-Shoulder Tees' },
    { id: 'hoodies', label: 'Hoodies' },
    { id: 'anime-prints', label: 'Anime Graphic Tees' },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? COMING_SOON_PRODUCTS
    : COMING_SOON_PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* 1. HEADER */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] block">
          Upcoming Releases
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111111] leading-tight">
          New Drops Coming Soon.
        </h1>
        <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed">
          Take a look at what we are making next: 280–300 GSM oversized drop-shoulder t-shirts, extra-thick 520 GSM hoodies, and clean anime graphic tees. Click &quot;Notify Me&quot; on any item to get an email or text message the moment ordering goes live.
        </p>
      </div>

      {/* 2. CATEGORY TABS */}
      <div className="flex flex-wrap items-center gap-2 pb-4 hairline-bottom">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#111111] text-white font-semibold'
                : 'bg-white hairline-border text-[#6B6B6B] hover:text-[#111111] hover:border-[#111111]'
            }`}
          >
            {cat.label}
          </button>
        ))}
        <span className="text-xs font-mono text-[#888888] ml-auto self-center">
          {filteredProducts.length} items
        </span>
      </div>

      {/* 3. PRODUCTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProducts.map((item) => {
          const formattedEst = formatPrice(item.estimatedPriceUSD, {
            INR: item.estimatedPriceINR,
            USD: item.estimatedPriceUSD,
          });

          return (
            <div
              key={item.id}
              className="group bg-white hairline-border rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#111111] transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full bg-[#F5F4EF] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  <span className="bg-[#111111] text-white text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded">
                    {item.previewTag}
                  </span>
                  <span className="bg-white/90 backdrop-blur-sm text-[#111111] hairline-border text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded">
                    {item.weight}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg hairline-border text-[11px] font-mono text-[#111111]">
                  Est. {formattedEst}
                </div>
              </div>

              {/* Information */}
              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between bg-white hairline-top">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#888888]">
                      {item.categoryLabel} &bull; {item.fit}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded hairline-border">
                      {item.launchWindow}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#111111] leading-snug">
                    {item.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
                    {item.description}
                  </p>

                  {item.printTechnique && (
                    <div className="pt-2 font-mono text-[11px] text-[#444444] bg-[#FAFAF8] p-2.5 rounded-lg hairline-border">
                      <span className="text-[#888888]">PRINT: </span>
                      {item.printTechnique}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-6 hairline-top flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#888888] block">
                      Estimated Price
                    </span>
                    <span className="text-base font-mono font-bold text-[#111111]">
                      {formattedEst}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveNotifyProduct(item)}
                    className="wocha-btn rounded-lg px-5 py-2.5 text-xs uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>Notify Me</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. BANNER */}
      <div className="p-8 sm:p-12 bg-[#111111] text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 max-w-lg">
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
            Limited Quantities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Never miss a new release.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            We make our clothes in small batches so every piece is made right. Once a design sells out, it rarely comes back in stock.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link
            href="/shop"
            className="px-6 py-3 bg-white text-[#111111] rounded-lg text-xs font-mono uppercase font-semibold text-center hover:bg-neutral-200 transition-colors"
          >
            Shop Available Items
          </Link>
        </div>
      </div>

      {/* Notification Modal */}
      <NotifyModal
        product={activeNotifyProduct}
        isOpen={!!activeNotifyProduct}
        onClose={() => setActiveNotifyProduct(null)}
      />
    </div>
  );
}
