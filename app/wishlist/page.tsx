'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/lib/wishlist/store';
import { useCartStore } from '@/lib/cart/store';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-mono text-xs text-[#6B6B6B]">
        Loading Curated Wishlist...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block">
          Personal Archive
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
          Saved Garments & Form Studies
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-xl">
          Retained silhouettes for prioritized checkout and atelier customization reservation.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white hairline-border rounded-xl p-12 text-center space-y-4 max-w-md mx-auto">
          <p className="text-sm text-[#6B6B6B]">Your personal archive contains zero garments.</p>
          <Link
            href="/shop"
            className="wocha-btn rounded-lg px-6 py-2.5 text-xs uppercase tracking-wider text-white inline-flex items-center gap-2"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white hairline-border rounded-xl overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative aspect-[3/4] bg-[#F5F4F0] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#6B6B6B] tracking-wider block">
                    {item.category}
                  </span>
                  <Link href={`/product/${item.productId}`}>
                    <h3 className="text-sm font-semibold text-[#111111] hover:underline line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>
                  <span className="font-mono text-xs font-medium text-[#111111] block mt-1">
                    €{item.price}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 hairline-top">
                  <button
                    onClick={() => {
                      addItem({
                        productId: item.productId,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        size: 'M',
                        color: 'Pitch Black',
                        quantity: 1,
                      });
                    }}
                    className="flex-1 wocha-btn rounded-lg py-2 text-[11px] uppercase tracking-wider text-white flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Add to Bag</span>
                  </button>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-[#6B6B6B] hover:text-red-600 hairline-border rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
