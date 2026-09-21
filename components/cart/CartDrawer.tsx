'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cart/store';
import { useCurrencyStore } from '@/lib/currency/store';

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
    updateQuantity,
    removeItem,
    getSubtotal,
    getItemCount,
  } = useCartStore();
  const { formatPrice } = useCurrencyStore();

  if (!isDrawerOpen) return null;

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#FFFFFF] h-full shadow-2xl flex flex-col z-10 hairline-left">
        {/* Header */}
        <div className="p-5 hairline-bottom flex items-center justify-between bg-[#FAFAF8]">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight uppercase">Bag</h2>
            <span className="font-mono text-xs text-[#6B6B6B]">({itemCount})</span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1 text-[#6B6B6B] hover:text-[#111111] transition-colors text-lg leading-none"
            aria-label="Close bag"
          >
            &times;
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E5E3DD]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6B6B6B] mb-2">
                Your bag is empty
              </span>
              <p className="text-sm text-[#111111] max-w-[240px] mb-6">
                Explore our core silhouettes and technical essentials.
              </p>
              <button
                onClick={() => setDrawerOpen(false)}
                className="wocha-btn px-5 py-2.5 text-xs"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                {/* Image */}
                <div className="relative w-20 h-24 bg-[#FAFAF8] hairline-border rounded-lg shrink-0 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover object-center"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-medium text-[#111111] leading-tight">
                        {item.name}
                      </h4>
                      <span className="text-xs font-mono text-[#111111] ml-2">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-3 text-[11px] text-[#6B6B6B] mt-1 font-mono">
                      <span>Size: {item.size}</span>
                      <span>Color: {item.color}</span>
                    </div>

                    {/* Customization Note */}
                    {item.customization && (
                      <div className="mt-1.5 p-1.5 bg-[#FAFAF8] hairline-border rounded-md text-[10px] font-mono text-[#111111]">
                        <span className="text-[#6B6B6B] block">Customization:</span>
                        <span>"{item.customization.text}" &bull; {item.customization.placement} &bull; {item.customization.font}</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center hairline-border rounded-md bg-[#FAFAF8] overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-0.5 text-xs text-[#111111] hover:bg-white"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-mono text-[#111111]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-0.5 text-xs text-[#111111] hover:bg-white"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[11px] font-mono text-[#6B6B6B] hover:text-[#111111] underline underline-offset-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Subtotal & Actions */}
        {items.length > 0 && (
          <div className="p-5 hairline-top bg-[#FAFAF8] space-y-3">
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-[#6B6B6B] uppercase font-mono text-xs">Subtotal</span>
              <span className="font-mono font-medium text-[#111111] text-base">{formatPrice(subtotal)}</span>
            </div>

            <p className="text-[11px] text-[#6B6B6B]">
              Shipping and taxes calculated at checkout. Free shipping on orders over {formatPrice(200)}.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/cart"
                onClick={() => setDrawerOpen(false)}
                className="wocha-btn-secondary rounded-lg text-xs py-2.5 text-center"
              >
                View Full Bag
              </Link>
              <Link
                href="/checkout"
                onClick={() => setDrawerOpen(false)}
                className="wocha-btn rounded-lg text-xs py-2.5 text-center"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
