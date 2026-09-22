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
      <div className="relative aspect-[3/4] w-full bg-[#F4F4F2] overflow-hidden p-3 sm:p-4 flex items-center justify-center">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-contain object-center p-3 sm:p-4 transition-all duration-500 ease-out ${
            product.images[1]
              ? 'opacity-100 group-hover:opacity-0 group-hover:scale-[1.03]'
              : 'group-hover:scale-[1.03]'
          }`}
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} hover view`}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain object-center p-3 sm:p-4 opacity-0 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500 ease-out"
          />
        )}
      </div>

      {/* Info Block */}
      <div className="pt-2.5 pb-3 px-3 bg-white hairline-top flex flex-col space-y-1">
        <h3 className="text-xs sm:text-[13px] font-medium text-[#111111] group-hover:text-neutral-500 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-xs sm:text-[13px] font-mono font-semibold text-[#111111]">
            {formatPrice(product.price, product.priceINR ? { INR: product.priceINR } : undefined)}
          </span>
          {product.compareAtPrice && (
            <span className="text-[11px] font-mono text-neutral-400 line-through">
              {formatPrice(product.compareAtPrice, product.compareAtINR ? { INR: product.compareAtINR } : undefined)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
