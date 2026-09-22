'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/data/products';
import { useCurrencyStore } from '@/lib/currency/store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { formatPrice } = useCurrencyStore();
  return (
    <Link
      href={`/product/${product.slug || product.id}`}
      className="group block bg-[#FFFFFF] hairline-border rounded-xl overflow-hidden transition-all duration-200 hover:border-[#111111] hover:shadow-sm"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full bg-[#F5F4EF] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
        />

        {/* Tag / Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 pointer-events-none z-10">
          {product.customizable && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900/90 backdrop-blur-md text-white text-[9.5px] font-mono uppercase tracking-wider shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
              Custom Studio
            </span>
          )}
          {product.onSale && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#B85C3E] text-white text-[9.5px] font-mono uppercase tracking-wider shadow-xs">
              Sale
            </span>
          )}
          {product.isNew && !product.customizable && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[9.5px] font-mono uppercase tracking-wider text-[#111111] shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
              New Drop
            </span>
          )}
        </div>
      </div>

      {/* Info Block */}
      <div className="p-3.5 sm:p-4 bg-white hairline-top">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[9.5px] font-mono text-[#888888] uppercase tracking-[0.14em] block mb-1">
              {product.categoryLabel} &bull; {product.weight}
            </span>
            <h3 className="text-xs sm:text-[13px] font-medium text-[#111111] group-hover:text-neutral-500 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs sm:text-[13px] font-mono font-semibold text-[#111111] block">
              {formatPrice(product.price, product.priceINR ? { INR: product.priceINR } : undefined)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[11px] font-mono text-neutral-400 line-through block">
                {formatPrice(product.compareAtPrice, product.compareAtINR ? { INR: product.compareAtINR } : undefined)}
              </span>
            )}
          </div>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center justify-between gap-1.5 mt-3 pt-2.5 border-t border-neutral-100/90">
          <div className="flex items-center gap-1.5">
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-3 h-3 rounded-full border border-black/15 transition-transform group-hover:scale-105"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-neutral-400">
            {product.sizes.length} sizes
          </span>
        </div>
      </div>
    </Link>
  );
}
