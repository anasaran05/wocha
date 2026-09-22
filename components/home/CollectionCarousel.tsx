'use client';

import React, { useRef } from 'react';
import { ShowcaseProduct } from '@/lib/data/showcase';
import { StreetProductCard } from './StreetProductCard';

interface CollectionCarouselProps {
  title?: string;
  categorySlug?: string;
  products: ShowcaseProduct[];
  autoplayIntervalMs?: number;
  animateEntry?: boolean;
}

export function CollectionCarousel({
  products,
  animateEntry = false,
}: CollectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const isMoved = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const scrollLeft = useRef<number>(0);

  // Desktop Mouse Drag to Scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    isMoved.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.3;
    if (Math.abs(walk) > 6) {
      isMoved.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Prevent accidental link clicking if user was dragging
  const handleClickCapture = (e: React.MouseEvent) => {
    if (isMoved.current) {
      e.preventDefault();
      e.stopPropagation();
      isMoved.current = false;
    }
  };

  return (
    <div className="relative w-full pt-1 pb-4 sm:pt-2 sm:pb-8">
      {/* Product Strip - Continuous Curious Peek Reel (Flush edge-to-edge on mobile, Swipeable, Peek Edge, No Arrows) */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onClickCapture={handleClickCapture}
        className="w-full overflow-x-auto scroll-smooth snap-x snap-mandatory overscroll-x-contain touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-y sm:border border-[#EDEAE3] bg-white rounded-none sm:rounded-2xl cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex w-max min-w-full">
          {products.map((product, idx) => (
            <div
              key={product.id}
              className={`w-[44vw] sm:w-[32vw] md:w-[26vw] lg:w-[20%] shrink-0 border-r border-[#EDEAE3] last:border-r-0 snap-start ${
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
  );
}
