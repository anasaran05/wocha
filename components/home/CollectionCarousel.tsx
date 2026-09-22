'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ShowcaseProduct } from '@/lib/data/showcase';
import { StreetProductCard } from './StreetProductCard';

interface CollectionCarouselProps {
  title?: string;
  categorySlug?: string;
  products: ShowcaseProduct[];
  autoplayIntervalMs?: number; // default 4500ms (4.5s)
  animateEntry?: boolean;
}

export function CollectionCarousel({
  categorySlug,
  products,
  autoplayIntervalMs = 4500,
  animateEntry = false,
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
    <div className="relative w-full pt-2 pb-6 sm:pb-8">
      {/* Product Strip Carousel Canvas */}
      <div
        className="relative w-full group/carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Floating Navigation Controls Inside the Strip */}
        {maxIndex > 0 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous products"
              className="absolute -left-2 sm:left-1 md:left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md border border-neutral-300/90 shadow-xl flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-all duration-200 cursor-pointer active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next products"
              className="absolute -right-2 sm:right-1 md:right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md border border-neutral-300/90 shadow-xl flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-all duration-200 cursor-pointer active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Carousel Tracks */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out will-change-transform"
            style={transformStyle}
          >
            {products.map((product, idx) => (
              <div
                key={product.id}
                className={`w-1/2 md:w-1/3 lg:w-1/5 shrink-0 px-1.5 sm:px-2.5 ${
                  animateEntry && idx < 6
                    ? `animate-landing-card stagger-delay-${idx}`
                    : ''
                }`}
              >
                <StreetProductCard product={product} index={idx} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
