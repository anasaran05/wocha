'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cart/store';
import { useCurrencyStore } from '@/lib/currency/store';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getShippingCost,
    getTotal,
    promoCode,
    promoDiscount,
    applyPromo,
  } = useCartStore();
  const { formatPrice } = useCurrencyStore();

  const [mounted, setMounted] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ success: boolean; text: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const total = getTotal();
  const discountAmount = subtotal * promoDiscount;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const res = await applyPromo(inputCode);
    setPromoMessage({ success: res.success, text: res.message });
    if (res.success) setInputCode('');
  };

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <span className="font-mono text-xs text-[#6B6B6B]">Loading Bag...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-md mx-auto bg-white hairline-border rounded-xl p-12 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block">
            Shopping Bag
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Your Bag is Empty
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6B6B]">
            There are currently no garments in your selection. Explore our permanent catalog of heavyweight knits and outer garments.
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="wocha-btn rounded-lg px-6 py-3 text-xs uppercase tracking-wider text-white inline-block"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 hairline-bottom pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block">
            Order Review
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-[#111111]">
            Shopping Bag
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-mono text-[#6B6B6B] hover:text-[#111111] underline underline-offset-4"
        >
          Clear Entire Bag
        </button>
      </div>

      {/* Grid: Line Items (8 cols) + Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Line Items List */}
        <div className="lg:col-span-8 bg-white hairline-border rounded-xl divide-y divide-[#E5E3DD] overflow-hidden">
          {items.map((item) => (
            <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
              {/* Product Image */}
              <div className="relative w-28 aspect-[3/4] bg-[#F5F4EF] hairline-border rounded-lg shrink-0 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="120px"
                  className="object-cover object-center"
                />
              </div>

              {/* Info & Adjustments */}
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <Link
                      href={`/product/${item.productId}`}
                      className="text-sm font-semibold text-[#111111] hover:underline leading-snug"
                    >
                      {item.name}
                    </Link>
                    <span className="text-sm font-mono font-medium text-[#111111] ml-4">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-mono text-[#6B6B6B] mt-1.5">
                    <span>Size: <strong className="text-[#111111]">{item.size}</strong></span>
                    <span>Color: <strong className="text-[#111111]">{item.color}</strong></span>
                    <span>Unit: {formatPrice(item.price)}</span>
                  </div>

                  {/* Customization Details */}
                  {item.customization && (
                    <div className="mt-3 p-2.5 bg-[#FAFAF8] hairline-border rounded-md text-xs font-mono text-[#111111] space-y-1">
                      <span className="text-[10px] text-[#6B6B6B] uppercase tracking-wider block">
                        Bespoke Customization Spec:
                      </span>
                      <div>Inscription: <strong>"{item.customization.text}"</strong></div>
                      <div>Placement: {item.customization.placement} &bull; Font: {item.customization.font}</div>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2 hairline-top">
                  {/* Quantity Stepper */}
                  <div className="flex items-center hairline-border rounded-md bg-[#FAFAF8] overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-3 py-1 text-xs text-[#111111] hover:bg-white"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-xs font-mono text-[#111111] font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-3 py-1 text-xs text-[#111111] hover:bg-white"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove CTA */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs font-mono text-[#6B6B6B] hover:text-[#111111] underline underline-offset-2"
                  >
                    Remove Item
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white hairline-border rounded-xl p-6 space-y-6 sticky top-24">
          <div className="hairline-bottom pb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6B6B] block">
              Financial Summary
            </span>
            <h2 className="text-lg font-bold tracking-tight text-[#111111]">
              Order Breakdown
            </h2>
          </div>

          {/* Pricing breakdown */}
          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between text-[#6B6B6B]">
              <span>Subtotal</span>
              <span className="text-[#111111]">{formatPrice(subtotal)}</span>
            </div>

            {promoDiscount > 0 && (
              <div className="flex justify-between text-[#B85C3E]">
                <span>Promo Code ({promoCode})</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#6B6B6B]">
              <span>Standard Courier</span>
              <span className="text-[#111111]">
                {shipping === 0 ? 'Complimentary' : formatPrice(shipping)}
              </span>
            </div>

            {subtotal < 200 && (
              <p className="text-[11px] text-[#6B6B6B] font-sans">
                Add {formatPrice(Math.max(0, 200 - subtotal))} more to unlock complimentary global shipping.
              </p>
            )}

            <div className="hairline-top pt-4 flex justify-between items-baseline text-sm font-semibold">
              <span className="text-[#111111] uppercase tracking-wide">Estimated Total</span>
              <span className="text-base text-[#111111] font-mono">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Promo code form */}
          <form onSubmit={handleApplyPromo} className="space-y-2 pt-2">
            <span className="text-[10px] font-mono uppercase text-[#6B6B6B] block">
              Promo Code (Try: WOCHA10 or STUDIO20)
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO CODE"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="flex-1 bg-[#FAFAF8] hairline-border rounded-md px-3 py-2 text-xs font-mono uppercase text-[#111111] focus:outline-none focus:border-[#111111]"
              />
              <button
                type="submit"
                className="wocha-btn rounded-md px-4 text-xs uppercase font-mono shrink-0"
              >
                Apply
              </button>
            </div>
            {promoMessage && (
              <p
                className={`text-[11px] font-mono ${
                  promoMessage.success ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {promoMessage.text}
              </p>
            )}
          </form>

          {/* Checkout CTA */}
          <div className="pt-2 space-y-2">
            <Link
              href="/checkout"
              className="w-full wocha-btn rounded-lg py-3.5 text-xs uppercase tracking-wider text-center text-white block"
            >
              Proceed to Checkout &bull; {formatPrice(total)}
            </Link>
            <Link
              href="/shop"
              className="w-full wocha-btn-secondary rounded-lg py-2.5 text-xs uppercase tracking-wider text-center text-[#111111] block"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Guarantee Badges */}
          <div className="hairline-top pt-4 space-y-1.5 text-[11px] text-[#6B6B6B] font-mono">
            <div>&bull; 30-day global complimentary returns</div>
            <div>&bull; Insured DHL / FedEx express tracking</div>
            <div>&bull; Made in Portugal with fair labor guarantee</div>
          </div>
        </div>
      </div>
    </div>
  );
}
