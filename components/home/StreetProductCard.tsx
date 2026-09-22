'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight, Eye, X, Check } from 'lucide-react';
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

    addItem({
      productId: product.id,
      name: product.name,
      price: product.priceUSD,
      image: productImages[0] || product.image,
      size: size,
      color: product.colors[0]?.name || 'Standard',
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
        className="group relative flex flex-col bg-white hairline-border rounded-xl overflow-hidden hover:border-[#111111] hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Visual Canvas (Aspect 3:4) */}
        <div
          className="relative block aspect-[3/4] w-full bg-[#F6F5F2] overflow-hidden select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Link href={targetUrl} className="absolute inset-0 block cursor-pointer">
            <img
              src={currentImg}
              alt={`${product.name} - view ${activeImageIndex + 1}`}
              loading="lazy"
              className="w-full h-full object-contain p-2.5 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </Link>

          {/* Top Badges & Actions Overlay */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between pointer-events-none z-20">
            <div className="flex flex-col gap-1 items-start">
              <span className="bg-white/95 backdrop-blur-md text-[#482922] text-[10.5px] font-sans font-semibold px-2 py-0.5 rounded-full border border-[#D5D0C6] shadow-2xs">
                {product.tag || 'New In'}
              </span>
            </div>

            {/* Quick Action Buttons (Wishlist & Full Gallery View) */}
            <div className="flex items-center gap-1.5 pointer-events-auto">
              {hasMultipleImages && (
                <button
                  type="button"
                  onClick={handleOpenGallery}
                  aria-label="View all angles"
                  title="View all product angles"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md border border-[#EDEAE3] flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-colors shadow-2xs cursor-pointer active:scale-95 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label="Toggle wishlist"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md border border-[#EDEAE3] flex items-center justify-center text-[#482922] hover:bg-[#482922] hover:text-white transition-colors shadow-2xs cursor-pointer active:scale-95"
              >
                <Heart className={`w-3.5 h-3.5 stroke-[1.8] ${isLiked ? 'fill-[#482922] text-[#482922]' : ''}`} />
              </button>
            </div>
          </div>

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

          {/* Segmented Image Indicator Dots / Bars */}
          {hasMultipleImages && (
            <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1 z-20 pointer-events-auto px-4">
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                {productImages.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={(e) => handleSelectImage(e, dotIdx)}
                    onMouseEnter={(e) => handleSelectImage(e, dotIdx)}
                    aria-label={`View angle ${dotIdx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeImageIndex === dotIdx
                        ? 'w-4 bg-white shadow-xs'
                        : 'w-1.5 bg-white/45 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quick Size Selector Bar (Slides up on deep hover) */}
          <div
            className={`absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-all duration-300 z-30 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between text-white text-[10px] font-mono mb-1.5 px-0.5">
              <span className="uppercase tracking-wider">Quick Add</span>
              {justAdded ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Added to bag
                </span>
              ) : (
                <span className="opacity-75">Select size</span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={(e) => handleQuickAdd(e, size)}
                  className="bg-white/95 hover:bg-[#111111] hover:text-white text-[#111111] text-[11px] font-mono font-semibold py-1 rounded transition-colors duration-150 cursor-pointer shadow-sm active:scale-95"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-2">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#6B6B6B] uppercase mb-0.5">
              <span>{product.categoryLabel}</span>
              <span className="text-[#111111] font-semibold">{product.fit}</span>
            </div>

            <Link href={targetUrl} className="group-hover:text-[#111111] transition-colors">
              <h3 className="text-sm font-semibold tracking-tight text-[#111111] line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Mini Thumbnail Row when hovering */}
          {hasMultipleImages && (
            <div className="flex items-center gap-1 pt-0.5 overflow-x-auto no-scrollbar">
              {productImages.map((thumbUrl, tIdx) => (
                <button
                  key={tIdx}
                  type="button"
                  onClick={(e) => handleSelectImage(e, tIdx)}
                  onMouseEnter={(e) => handleSelectImage(e, tIdx)}
                  className={`w-7 h-8 rounded shrink-0 border overflow-hidden transition-all bg-[#F6F5F2] ${
                    activeImageIndex === tIdx
                      ? 'border-[#111111] ring-1 ring-[#111111] scale-105'
                      : 'border-neutral-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={thumbUrl}
                    alt={`Thumb ${tIdx + 1}`}
                    className="w-full h-full object-contain p-0.5"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Price & Color indicators */}
          <div className="pt-1.5 flex items-center justify-between border-t border-[#F0EFEA]">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-[#111111] font-mono">
                {formatPrice(product.priceUSD)}
              </span>
              {product.compareAtUSD && (
                <span className="text-xs text-[#999999] line-through font-mono">
                  {formatPrice(product.compareAtUSD)}
                </span>
              )}
            </div>

            {/* Color Dots */}
            <div className="flex items-center gap-1">
              {product.colors.map((c, i) => (
                <span
                  key={i}
                  title={c.name}
                  className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-2xs"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
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
