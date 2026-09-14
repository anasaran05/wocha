'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
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

  const isLiked = isInWishlist(product.id);
  const targetUrl = product.productSlug ? `/product/${product.productSlug}` : '/shop';

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      name: product.name,
      price: product.priceUSD,
      image: product.image,
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
        image: product.image,
        category: product.category,
      });
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white hairline-border rounded-xl overflow-hidden hover:border-[#111111] hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Canvas (Aspect 3:4) */}
      <Link href={targetUrl} className="relative block aspect-[3/4] w-full bg-[#F5F4EF] overflow-hidden">
        {/* Primary Image */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            isHovered && product.hoverImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />

        {/* Secondary / Hover Image */}
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={`${product.name} alternate angle`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none z-10">
          <div className="flex flex-col gap-1">
            {product.tag ? (
              <span className="bg-[#111111] text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded tracking-wider shadow-sm">
                {product.tag}
              </span>
            ) : product.isNewRelease ? (
              <span className="bg-[#111111] text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded tracking-wider shadow-sm">
                Drop 04
              </span>
            ) : null}

            {product.weight && (
              <span className="bg-white/90 backdrop-blur-sm text-[#111111] text-[10px] font-mono px-2 py-0.5 rounded border border-[#E5E3DD] tracking-wide w-max">
                {product.weight}
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label="Toggle wishlist"
            className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#E5E3DD] flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-colors shadow-sm cursor-pointer"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#111111] text-[#111111]' : ''}`} />
          </button>
        </div>

        {/* Quick Size Selector Bar (Slides up on hover) */}
        <div
          className={`absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 z-10 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between text-white text-[10px] font-mono mb-1.5 px-0.5">
            <span className="uppercase tracking-wider">Quick Add</span>
            {justAdded ? (
              <span className="text-emerald-400 font-bold">Added to bag ✓</span>
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
      </Link>

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

        {/* Price & Color indicators */}
        <div className="pt-1 flex items-center justify-between border-t border-[#F0EFEA]">
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
  );
}
