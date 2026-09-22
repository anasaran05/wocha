'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { ShowcaseProduct } from '@/lib/data/showcase';
import { useCartStore } from '@/lib/cart/store';
import { useWishlistStore } from '@/lib/wishlist/store';
import { useCurrencyStore } from '@/lib/currency/store';

interface StreetProductCardProps {
  product: ShowcaseProduct;
  index?: number;
}

export function StreetProductCard({ product, index = 0 }: StreetProductCardProps) {
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { formatPrice } = useCurrencyStore();

  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [galleryOpen, setGalleryOpen] = useState<boolean>(false);

  const touchStartX = useRef<number | null>(null);

  // Normalize all product images from subfolder or fallback
  const productImages: string[] =
    product.images && product.images.length > 0
      ? product.images
      : [product.image, ...(product.hoverImage ? [product.hoverImage] : [])];

  const hasMultipleImages = productImages.length > 1;
  const isLiked = isInWishlist(product.id);
  const targetUrl = product.productSlug ? `/product/${product.productSlug}` : '/shop';

  // Keyboard navigation for full gallery modal
  useEffect(() => {
    if (!galleryOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setGalleryOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev <= 0 ? productImages.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev >= productImages.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryOpen, productImages.length]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev <= 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev >= productImages.length - 1 ? 0 : prev + 1));
  };

  const handleSelectImage = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex(idx);
  };

  const handleOpenGallery = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setGalleryOpen(true);
  };

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedSize(size);
    addItem({
      productId: product.id,
      name: product.name,
      price: product.priceUSD,
      image: productImages[0] || product.image,
      size: size,
      color: product.colors[selectedColorIndex]?.name || product.colors[0]?.name || 'Standard',
      quantity: 1,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.priceUSD,
        image: productImages[0] || product.image,
        category: product.category,
      });
    }
  };

  // Touch Swipe for mobile image switching
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 35 && hasMultipleImages) {
      if (diff > 0) {
        setActiveImageIndex((prev) => (prev >= productImages.length - 1 ? 0 : prev + 1));
      } else {
        setActiveImageIndex((prev) => (prev <= 0 ? productImages.length - 1 : prev - 1));
      }
    }
    touchStartX.current = null;
  };

  const currentImg = productImages[activeImageIndex] || product.image;

  return (
    <>
      <div
        className="group relative flex flex-col h-full bg-white transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Visual Canvas (Fixed Aspect 3:4, attached edge-to-edge) */}
        <div
          className="relative block aspect-[3/4] w-full bg-[#F5F4EF] overflow-hidden select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Link href={targetUrl} prefetch={true} className="absolute inset-0 block cursor-pointer">
            <img
              src={currentImg}
              alt={`${product.name} - view ${activeImageIndex + 1}`}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </Link>

          {/* Top Left Tag / Badge - Distinctive WOCHA frosted pill */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 pointer-events-none z-10 max-w-[85%]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[10px] font-mono font-medium uppercase tracking-wider text-[#111111] shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
              {product.tag || (product.isNewRelease ? 'NEW RELEASE' : 'STUDIO')}
            </span>
            {product.isNewRelease && product.tag && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-neutral-900/90 backdrop-blur-md text-white text-[9px] font-mono tracking-wider uppercase font-semibold">
                HOT
              </span>
            )}
          </div>

          {/* Top Right: Sleek Frosted Wishlist Roundel */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label="Toggle wishlist"
            className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/85 backdrop-blur-md border border-black/5 flex items-center justify-center text-[#111111] hover:bg-white hover:scale-110 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Heart className={`w-3.5 h-3.5 stroke-[1.75] ${isLiked ? 'fill-[#111111] text-[#111111]' : 'text-[#111111]'}`} />
          </button>

          {/* Left & Right Arrow Controls to cycle images one by one */}
          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous angle"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200/80 shadow-md flex items-center justify-center text-[#111111] hover:bg-black hover:text-white transition-all cursor-pointer active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next angle"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200/80 shadow-md flex items-center justify-center text-[#111111] hover:bg-black hover:text-white transition-all cursor-pointer active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Size Buttons (Minimal floating capsule on hover, smaller buttons without text) */}
          <div
            className={`absolute bottom-2.5 inset-x-0 flex justify-center z-10 transition-all duration-300 pointer-events-auto ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5 pointer-events-none'
            }`}
          >
            <div className="inline-flex items-center gap-1 p-1 rounded-md bg-white/95 backdrop-blur-md border border-black/10 shadow-sm">
              {(product.sizes || ['S', 'M', 'L', 'XL']).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={(e) => handleQuickAdd(e, size)}
                  aria-label={`Select size ${size}`}
                  className={`h-5 min-w-[22px] px-1 text-[9px] font-mono font-medium rounded transition-all cursor-pointer ${
                    justAdded && selectedSize === size
                      ? 'bg-black text-white'
                      : 'text-neutral-700 hover:bg-black hover:text-white bg-neutral-100/70'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Distinctive WOCHA Product Information */}
        <div className="pt-2.5 pb-3 px-3 flex flex-col space-y-1.5 bg-white">
          {/* Fit & Specs Ticker */}
          <div className="flex items-center justify-between gap-1 text-[9.5px] font-mono uppercase tracking-[0.14em] text-neutral-400">
            <span className="truncate">{product.fit || 'Oversized Fit'}</span>
            {product.weight && <span className="shrink-0">{product.weight}</span>}
          </div>

          {/* Product Title */}
          <Link href={targetUrl} prefetch={true} className="group/title block">
            <h3 className="text-[13px] font-medium text-[#111111] line-clamp-1 leading-snug group-hover/title:text-neutral-500 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Price & Discount Indicator */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-xs sm:text-[13px] font-mono font-semibold text-[#111111]">
                {formatPrice(product.priceUSD, { INR: product.priceINR })}
              </span>
              {product.compareAtUSD && (
                <span className="text-[11px] text-neutral-400 line-through font-mono">
                  {formatPrice(product.compareAtUSD, product.compareAtINR ? { INR: product.compareAtINR } : undefined)}
                </span>
              )}
            </div>
            {product.compareAtUSD && (
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-xs bg-[#111111]/5 text-[#111111] font-medium tracking-tight">
                SALE
              </span>
            )}
          </div>

          {/* Interactive Circular Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center justify-between pt-1.5 border-t border-neutral-100/90">
              <div className="flex items-center gap-1.5">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedColorIndex(i);
                    }}
                    title={c.name}
                    aria-label={`Select color ${c.name}`}
                    className={`w-3.5 h-3.5 rounded-full border border-black/15 transition-all cursor-pointer relative ${
                      selectedColorIndex === i
                        ? 'ring-2 ring-black ring-offset-1 scale-110'
                        : 'hover:scale-110 opacity-75 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-neutral-500 tracking-tight">
                {product.colors[selectedColorIndex]?.name || `${product.colors.length} shades`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          FULL PRODUCT GALLERY MODAL / LIGHTBOX (Inspect all angles one by one)
          ========================================================================= */}
      {galleryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6"
          onClick={() => setGalleryOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setGalleryOpen(false)}
              className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-white/90 border border-neutral-200 flex items-center justify-center text-neutral-800 hover:bg-black hover:text-white transition-colors cursor-pointer shadow-md"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left: Main Large Image View with Prev/Next buttons */}
            <div className="relative flex-1 bg-[#F5F4EF] flex items-center justify-center min-h-[360px] sm:min-h-[480px] p-4 select-none">
              <img
                src={currentImg}
                alt={`${product.name} angle ${activeImageIndex + 1}`}
                className="max-h-[65vh] w-auto max-w-full object-contain drop-shadow-md"
              />

              {/* Prev / Next Buttons */}
              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border border-neutral-300 shadow-lg flex items-center justify-center text-black hover:bg-black hover:text-white transition-all cursor-pointer active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border border-neutral-300 shadow-lg flex items-center justify-center text-black hover:bg-black hover:text-white transition-all cursor-pointer active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Bottom Angle Indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/75 text-white text-xs font-mono px-3 py-1 rounded-full">
                Shot {activeImageIndex + 1} of {productImages.length}
              </div>
            </div>

            {/* Right: Sidebar with all Thumbnails & Specifications */}
            <div className="w-full md:w-80 p-5 sm:p-6 flex flex-col justify-between bg-white border-t md:border-t-0 md:border-l border-neutral-200">
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
                    {product.categoryLabel} &bull; {product.fit}
                  </span>
                  <h3 className="text-lg font-extrabold text-neutral-900 mt-0.5">
                    {product.name}
                  </h3>
                  <div className="text-base font-bold font-mono text-neutral-900 mt-1">
                    {formatPrice(product.priceUSD)}
                  </div>
                </div>

                {/* Thumbnails Reel */}
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-2">
                    All Product Angles ({productImages.length})
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {productImages.map((thumbUrl, tIdx) => (
                      <button
                        key={tIdx}
                        type="button"
                        onClick={(e) => handleSelectImage(e, tIdx)}
                        className={`aspect-square rounded-lg border-2 overflow-hidden transition-all bg-[#F6F5F2] ${
                          activeImageIndex === tIdx
                            ? 'border-black ring-2 ring-black/20 scale-105'
                            : 'border-neutral-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={thumbUrl}
                          alt={`Angle ${tIdx + 1}`}
                          className="w-full h-full object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Garment Details */}
                <div className="pt-2 border-t border-neutral-100 text-xs text-neutral-600 space-y-1 font-sans">
                  <div><strong className="text-neutral-900">Composition:</strong> {product.composition}</div>
                  <div><strong className="text-neutral-900">Cut:</strong> {product.fit}</div>
                  {product.weight && (
                    <div><strong className="text-neutral-900">Weight:</strong> {product.weight}</div>
                  )}
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="pt-4 border-t border-neutral-200 space-y-2">
                <Link
                  href={targetUrl}
                  className="w-full py-2.5 text-center text-xs font-mono uppercase tracking-wider font-semibold rounded-lg bg-neutral-900 text-white hover:bg-black transition-colors block cursor-pointer"
                >
                  View Full Product Details &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
