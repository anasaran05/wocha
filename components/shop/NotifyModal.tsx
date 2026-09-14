'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ComingSoonProduct } from '@/lib/data/showcase';
import { useCurrencyStore } from '@/lib/currency/store';

interface NotifyModalProps {
  product: ComingSoonProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NotifyModal({ product, isOpen, onClose }: NotifyModalProps) {
  const { formatPrice } = useCurrencyStore();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSize, setSelectedSize] = useState('L');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setTimeout(() => {
      // Save locally to simulate notification registry
      const existing = JSON.parse(localStorage.getItem('wocha-drop-alerts') || '[]');
      existing.push({
        productId: product.id,
        productName: product.name,
        email,
        phone,
        size: selectedSize,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('wocha-drop-alerts', JSON.stringify(existing));

      setSubmitting(false);
      setSubmitted(true);
    }, 500);
  };

  const handleReset = () => {
    setSubmitted(false);
    setEmail('');
    setPhone('');
    onClose();
  };

  const priceFormatted = formatPrice(product.estimatedPriceUSD, {
    INR: product.estimatedPriceINR,
    USD: product.estimatedPriceUSD,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#FAFAF8] hairline-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white hairline-border flex items-center justify-center text-[#111111] hover:bg-neutral-100 transition-colors"
          aria-label="Close modal"
        >
          &times;
        </button>

        {submitted ? (
          <div className="p-8 sm:p-10 text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] block">
                Notification Saved
              </span>
              <h3 className="text-2xl font-bold text-[#111111] tracking-tight">
                You&apos;re on the list!
              </h3>
              <p className="text-xs text-[#6B6B6B] max-w-sm mx-auto leading-relaxed">
                We will email <strong className="text-[#111111]">{email}</strong> as soon as this item is available to order.
              </p>
            </div>

            <div className="p-4 bg-white hairline-border rounded-xl font-mono text-xs text-[#111111] space-y-1">
              <div className="flex justify-between text-[#6B6B6B] text-[10px]">
                <span>PRODUCT</span>
                <span>SIZE</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="truncate max-w-[220px]">{product.name}</span>
                <span>{selectedSize}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="wocha-btn w-full py-3 rounded-lg text-xs uppercase tracking-wider text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            {/* Header with Product Preview */}
            <div className="p-6 bg-white hairline-bottom flex items-center gap-4">
              <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-[#F5F4EF] shrink-0 hairline-border">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-center"
                />
              </div>

              <div className="space-y-1 pr-6">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-[#111111] text-white px-2 py-0.5 rounded">
                    {product.previewTag}
                  </span>
                  <span className="text-[10px] font-mono text-[#6B6B6B]">
                    {product.weight}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#111111] leading-snug line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3 pt-0.5 text-xs font-mono">
                  <span className="font-semibold text-[#111111]">
                    Est. {priceFormatted}
                  </span>
                  <span className="text-[#6B6B6B]">&bull;</span>
                  <span className="text-[#111111]">{product.launchWindow}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] block">
                  Drop Alert
                </span>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Enter your email or phone number below. We will send you a message the minute this item is ready to order.
                </p>
              </div>

              {/* Size Selection */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#111111] block mb-2">
                  Choose Your Size:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 text-xs font-mono rounded-lg hairline-border transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#111111] text-white font-semibold border-[#111111]'
                          : 'bg-white text-[#111111] hover:border-[#111111]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#111111] block">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white hairline-border rounded-lg px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                />
              </div>

              {/* Phone / WhatsApp Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#111111] block">
                  Phone / WhatsApp <span className="text-[#6B6B6B] text-[10px] lowercase">(optional, for instant text alerts)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+91 or phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white hairline-border rounded-lg px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="wocha-btn w-full py-3 rounded-lg text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Notify Me When Ready &rarr;</span>
                )}
              </button>

              <span className="text-[10px] font-mono text-[#888888] text-center block">
                No spam. We will only message you when this item is launched.
              </span>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
