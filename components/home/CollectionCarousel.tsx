'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { ShowcaseProduct } from '@/lib/data/showcase';
import { StreetProductCard } from './StreetProductCard';

interface CollectionCarouselProps {
  title: string;
  categorySlug: 'streetwear' | 'gym-wear' | 'normal-wear';
  products: ShowcaseProduct[];
  autoplayIntervalMs?: number; // default 4500ms (4.5s)
}

export function CollectionCarousel({
  title,
  categorySlug,
  products,
  autoplayIntervalMs = 4500,
}: CollectionCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [cardsPerView, setCardsPerView] = useState<number>(5);

  const touchStartX = useRef<number | null>(null);

  // Responsive cards-per-view tracking
  useEffect(() => {
    function handleResize() {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) {
        setCardsPerView(2); // exactly 2 cards on mobile
      } else if (window.innerWidth < 1024) {
        setCardsPerView(3); // 3 cards on tablet
      } else {
        setCardsPerView(5); // exactly 5 cards on desktop
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - cardsPerView);

  // Auto-advance with 4.5s standby timing
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, autoplayIntervalMs);

    return () => clearInterval(timer);
  }, [isPaused, maxIndex, autoplayIntervalMs]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  // Calculate translateX percentage: each step translates by (100 / cardsPerView)%
  const stepPercent = 100 / cardsPerView;
  const transformStyle = {
    transform: `translateX(-${currentIndex * stepPercent}%)`,
  };

  return (
    <section className="w-full max-w-[1780px] mx-auto px-3 sm:px-6 lg:px-10 py-6 sm:py-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4 pb-3 sm:pb-4 border-b border-[#E5E3DD]">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-tight text-[#111111] font-sans">
            {title}
          </h2>
        </div>

        {/* Action Button & Carousel Controls */}
        <div className="flex items-center gap-3 self-start sm:self-end">
          {/* Arrow Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous products"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#EDEAE3] hover:border-black flex items-center justify-center text-[#111111] transition-colors shadow-2xs active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next products"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#EDEAE3] hover:border-black flex items-center justify-center text-[#111111] transition-colors shadow-2xs active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View More Button */}
          <Link
            href={`/shop?category=${categorySlug}`}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-[#111111] text-white hover:bg-neutral-800 text-xs font-mono uppercase tracking-wider font-semibold rounded-lg transition-colors cursor-pointer shadow-xs active:scale-95"
          >
            <span>View More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Product Strip Carousel Canvas */}
      <div
        className="relative w-full overflow-hidden pt-4 sm:pt-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out will-change-transform"
          style={transformStyle}
        >
          {products.map((product, idx) => (
            <div
              key={product.id}
              className="w-1/2 md:w-1/3 lg:w-1/5 shrink-0 px-1.5 sm:px-2.5"
            >
              <StreetProductCard product={product} index={idx} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
