'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cart/store';
import { useAuth } from '@/lib/auth/auth';

export default function CheckoutPage() {
  const { items, getSubtotal, getShippingCost, getTotal, promoCode, promoDiscount, clearCart } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    country: 'Germany',
    postalCode: '',
    cardNumber: '4242 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242',
    cardExpiry: '12/28',
    cardCvc: '888',
    sameBilling: true,
  });

  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const baseShipping = getShippingCost();
  const expressSurcharge = deliveryMethod === 'express' ? 25 : 0;
  const finalShipping = baseShipping + expressSurcharge;
  const discountAmount = subtotal * promoDiscount;
  const grandTotal = Math.max(0, subtotal - discountAmount + finalShipping);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          shippingAddress: {
            address: formData.address,
            apartment: formData.apartment,
            city: formData.city,
            country: formData.country,
            postalCode: formData.postalCode,
          },
          items,
          subtotal,
          discountTotal: discountAmount,
          shippingTotal: finalShipping,
          grandTotal,
          couponCode: promoCode,
        }),
      });

      const data = await res.json();
      const confirmedNumber = data.orderNumber || `WOCHA-${Math.floor(10000 + Math.random() * 90000)}`;
      setOrderConfirmed(confirmedNumber);
      setConfirmedOrderId(data.orderId || null);
      clearCart();
    } catch {
      const fallbackNumber = `WOCHA-${Math.floor(10000 + Math.random() * 90000)}`;
      setOrderConfirmed(fallbackNumber);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <span className="font-mono text-xs text-[#6B6B6B]">Loading Checkout...</span>
      </div>
    );
  }

  // ORDER CONFIRMATION VIEW
  if (orderConfirmed) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white hairline-border rounded-xl p-8 sm:p-12 space-y-8">
          <div className="space-y-3 hairline-bottom pb-6">
            <h1 className="text-3xl font-bold tracking-tight text-[#111111]">
              Thank You for Your Patronage
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6B6B]">
              A dispatch confirmation and consignment tracking number have been generated for your records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
            <div className="p-4 bg-[#FAFAF8] hairline-border rounded-lg space-y-2">
              <span className="text-[#6B6B6B] uppercase tracking-wider text-[10px] block">
                Reference Order ID
              </span>
              <strong className="text-base text-[#111111]">{orderConfirmed}</strong>
              <span className="text-[#6B6B6B] block text-[11px]" suppressHydrationWarning>Placed on {new Date().toLocaleDateString()}</span>
            </div>

            <div className="p-4 bg-[#FAFAF8] hairline-border rounded-lg space-y-2">
              <span className="text-[#6B6B6B] uppercase tracking-wider text-[10px] block">
                Estimated Delivery Window
              </span>
              <strong className="text-sm text-[#111111]">
                {deliveryMethod === 'express' ? '1–2 Business Days (Express Air)' : '3–5 Business Days (Standard DHL)'}
              </strong>
              <span className="text-[#6B6B6B] block text-[11px]">Destination: {formData.city || 'Berlin'}, {formData.country}</span>
            </div>
          </div>

          <div className="p-4 bg-[#FAFAF8] hairline-border rounded-lg text-xs text-[#6B6B6B] leading-relaxed">
            <span className="text-[#111111] font-semibold block mb-1">Notice: Frontend Simulation Demo</span>
            This order was simulated locally. No actual transaction was charged to any payment method. All product data, seams, and cart state are cleanly prepared for full Supabase and Stripe integration.
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href={`/account/orders/${confirmedOrderId || orderConfirmed}`}
              className="wocha-btn rounded-lg px-6 py-3 text-xs uppercase tracking-wider text-white text-center flex items-center justify-center gap-2"
            >
              <span>Live Consignment Tracking</span>
              <span>&rarr;</span>
            </Link>
            <Link
              href="/shop"
              className="wocha-btn-secondary rounded-lg px-6 py-3 text-xs uppercase tracking-wider text-[#111111] text-center"
            >
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY STATE FALLBACK
  if (items.length === 0 && !orderConfirmed) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="text-xl font-bold text-[#111111]">No Items In Checkout</h1>
        <p className="text-xs text-[#6B6B6B]">
          Please select pieces from our catalog before attempting checkout.
        </p>
        <Link href="/shop" className="wocha-btn rounded-lg px-6 py-2.5 text-xs text-white inline-block">
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="hairline-bottom pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block">
          Secure Acquisition
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-[#111111]">
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Checkout Form (7 cols) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8">
          {/* Step 1: Contact Information */}
          <div className="bg-white hairline-border rounded-xl p-6 space-y-4">
            <div className="hairline-bottom pb-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold">
                1. Contact Details
              </h2>
            </div>
            <div>
              <label className="text-xs font-mono uppercase text-[#6B6B6B] block mb-1">
                Email Address for Dispatch Tracking
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="atelier@domain.com"
                className="w-full bg-[#FAFAF8] hairline-border rounded-md px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="bg-white hairline-border rounded-xl p-6 space-y-4">
            <div className="hairline-bottom pb-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold">
                2. Consignment Address
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase text-[#6B6B6B] block mb-1">First Name</label>
                <input
                  type="text"
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Johann"
                  className="w-full bg-[#FAFAF8] hairline-border rounded-md px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-[#6B6B6B] block mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Kranz"
                  className="w-full bg-[#FAFAF8] hairline-border rounded-md px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-[#6B6B6B] block mb-1">Street Address</label>
              <input
                type="text"
                required
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Torstraße 140"
                className="w-full bg-[#FAFAF8] hairline-border rounded-md px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono uppercase text-[#6B6B6B] block mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="10119"
                  className="w-full bg-[#FAFAF8] hairline-border rounded-md px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-[#6B6B6B] block mb-1">City</label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Berlin"
                  className="w-full bg-[#FAFAF8] hairline-border rounded-md px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-[#6B6B6B] block mb-1">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-[#FAFAF8] hairline-border rounded-md px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                >
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Delivery Options */}
          <div className="bg-white hairline-border rounded-xl p-6 space-y-4">
            <div className="hairline-bottom pb-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold">
                3. Dispatch Method
              </h2>
            </div>

            <div className="space-y-3">
              <label
                onClick={() => setDeliveryMethod('standard')}
                className={`flex items-center justify-between p-3.5 hairline-border rounded-lg cursor-pointer transition-colors ${
                  deliveryMethod === 'standard' ? 'bg-[#FAFAF8] ring-1 ring-[#111111]' : 'hover:bg-[#FAFAF8]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'standard'}
                    onChange={() => setDeliveryMethod('standard')}
                    className="accent-[#111111]"
                  />
                  <div>
                    <span className="text-xs font-medium text-[#111111] block">Standard Courier (DHL Carbon Neutral)</span>
                    <span className="text-[11px] font-mono text-[#6B6B6B]">3 to 5 business days</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#111111]">
                  {baseShipping === 0 ? 'Complimentary' : `$${baseShipping}`}
                </span>
              </label>

              <label
                onClick={() => setDeliveryMethod('express')}
                className={`flex items-center justify-between p-3.5 hairline-border rounded-lg cursor-pointer transition-colors ${
                  deliveryMethod === 'express' ? 'bg-[#FAFAF8] ring-1 ring-[#111111]' : 'hover:bg-[#FAFAF8]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'express'}
                    onChange={() => setDeliveryMethod('express')}
                    className="accent-[#111111]"
                  />
                  <div>
                    <span className="text-xs font-medium text-[#111111] block">Priority Express Air (FedEx Priority)</span>
                    <span className="text-[11px] font-mono text-[#6B6B6B]">1 to 2 business days</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#111111]">
                  ${baseShipping + 25}
                </span>
              </label>
            </div>
          </div>

          {/* Step 4: Payment Info (Mock UI) */}
          <div className="bg-white hairline-border rounded-xl p-6 space-y-4">
            <div className="hairline-bottom pb-3 flex justify-between items-center">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#111111] font-semibold">
                4. Payment (Frontend Mock Seam)
              </h2>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">
                Demo Mode &bull; Test Card Pre-filled
              </span>
            </div>

            <div className="p-4 bg-[#FAFAF8] hairline-border rounded-lg space-y-3">
              <div>
                <label className="text-xs font-mono uppercase text-[#6B6B6B] block mb-1">Card Number</label>
                <input
                  type="text"
                  readOnly
                  value="4242 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242"
                  className="w-full bg-white hairline-border rounded-md px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#6B6B6B] block mb-1">Expiry</label>
                  <input
                    type="text"
                    readOnly
                    value="12 / 28"
                    className="w-full bg-white hairline-border rounded-md px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-[#6B6B6B] block mb-1">CVC</label>
                  <input
                    type="text"
                    readOnly
                    value="888"
                    className="w-full bg-white hairline-border rounded-md px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full wocha-btn rounded-lg py-4 text-xs uppercase tracking-wider text-white disabled:opacity-50"
          >
            {isSubmitting ? 'Authorizing Mock Transaction...' : `Place Order &bull; $${grandTotal.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary Sticky Sidebar (5 cols) */}
        <div className="lg:col-span-5 bg-white hairline-border rounded-xl p-6 space-y-6 sticky top-24">
          <div className="hairline-bottom pb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6B6B] block">
              Cart Summary
            </span>
            <h3 className="text-base font-bold text-[#111111]">
              Items in Dispatch ({items.length})
            </h3>
          </div>

          <div className="divide-y divide-[#E5E3DD] max-h-80 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex gap-4">
                <div className="relative w-14 aspect-[3/4] bg-[#F5F4EF] hairline-border rounded-lg shrink-0 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="60px"
                    className="object-cover object-center"
                  />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex justify-between font-medium text-[#111111]">
                    <span className="line-clamp-1">{item.name}</span>
                    <span className="font-mono ml-2">${item.price * item.quantity}</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#6B6B6B] mt-0.5">
                    Qty: {item.quantity} &bull; {item.size} &bull; {item.color}
                  </div>
                  {item.customization && (
                    <div className="text-[10px] font-mono text-[#111111] mt-1 bg-[#FAFAF8] p-1 hairline-border rounded">
                      Custom: "{item.customization.text}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="hairline-top pt-4 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-[#6B6B6B]">
              <span>Subtotal</span>
              <span className="text-[#111111]">${subtotal}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-[#B85C3E]">
                <span>Promo Discount ({promoCode})</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#6B6B6B]">
              <span>Shipping ({deliveryMethod})</span>
              <span className="text-[#111111]">
                {finalShipping === 0 ? 'Complimentary' : `$${finalShipping}`}
              </span>
            </div>
            <div className="hairline-top pt-3 flex justify-between items-baseline text-sm font-semibold">
              <span className="uppercase text-[#111111]">Total Charged</span>
              <span className="text-base text-[#111111] font-mono">${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
