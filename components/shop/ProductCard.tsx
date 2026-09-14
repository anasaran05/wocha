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
      href={`/product/${product.id}`}
      className="group block bg-[#FFFFFF] hairline-border rounded-xl overflow-hidden transition-all duration-200 hover:border-[#111111] hover:shadow-sm"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full bg-[#F5F4EF] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
        />

        {/* Tag / Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.customizable && (
            <span className="bg-[#111111] text-white text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded">
              Custom Studio
            </span>
          )}
          {product.onSale && (
            <span className="bg-[#B85C3E] text-white text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded">
              Sale
            </span>
          )}
          {product.isNew && !product.customizable && (
            <span className="bg-white text-[#111111] hairline-border text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded">
              New
            </span>
          )}
        </div>
      </div>

      {/* Info Block */}
      <div className="p-4 bg-white hairline-top">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono text-[#6B6B6B] uppercase tracking-wider block mb-1">
              {product.categoryLabel} &bull; {product.weight}
            </span>
            <h3 className="text-xs font-medium text-[#111111] group-hover:text-[#6B6B6B] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-mono font-medium text-[#111111] block">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[11px] font-mono text-[#6B6B6B] line-through block">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 hairline-top">
          {product.colors.map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="w-2.5 h-2.5 rounded-full hairline-border"
              style={{ backgroundColor: c.hex }}
            />
          ))}
          <span className="text-[10px] font-mono text-[#6B6B6B] ml-auto">
            {product.sizes.length} sizes
          </span>
        </div>
      </div>
    </Link>
  );
}
