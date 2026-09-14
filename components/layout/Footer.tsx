'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#FAFAF8] hairline-top mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand & Manifesto Column */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-block hover:opacity-85 transition-opacity"
              aria-label="WOCHA Home"
            >
              <Image
                src="/wocha.png"
                alt="WOCHA"
                width={140}
                height={34}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-[#6B6B6B] leading-relaxed max-w-sm">
              Heavyweight streetwear essentials made with premium cotton and comfortable relaxed fits. Built for everyday wear and long-lasting quality.
            </p>

            <div className="pt-4">
              <span className="text-[11px] font-mono text-[#111111] uppercase tracking-wider block mb-2">
                Newsletter // Drop Updates
              </span>
              {subscribed ? (
                <p className="text-xs font-mono text-[#111111] bg-white p-2.5 hairline-border rounded-lg inline-block">
                  You are subscribed! We will send you new drop updates.
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white hairline-border rounded-md px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
                  />
                  <button
                    type="submit"
                    className="wocha-btn rounded-md px-4 text-xs shrink-0"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Links Column 1: Categories */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-semibold text-[#111111] uppercase tracking-wide block">
              Categories
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop?category=hoodies" className="text-[#6B6B6B] hover:text-[#111111] transition-colors">
                  Heavyweight Hoodies
                </Link>
              </li>
              <li>
                <Link href="/shop?category=t-shirts" className="text-[#6B6B6B] hover:text-[#111111] transition-colors">
                  Drop-Shoulder Tees
                </Link>
              </li>
              <li>
                <Link href="/upcoming" className="text-[#6B6B6B] hover:text-[#111111] transition-colors">
                  Upcoming Drops
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: About Us */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs font-semibold text-[#111111] uppercase tracking-wide block">
              About Us
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-[#6B6B6B]">Our Fabrics</span>
              </li>
              <li>
                <span className="text-[#6B6B6B]">Sustainability</span>
              </li>
              <li>
                <span className="text-[#6B6B6B]">Quality Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Customer Support */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-semibold text-[#111111] uppercase tracking-wide block">
              Customer Support
            </span>
            <ul className="space-y-2 text-xs text-[#6B6B6B]">
              <li>Order Tracking & Shipping</li>
              <li>Free Returns & Exchanges</li>
              <li>Washing & Care Guide</li>
              <li className="font-mono text-[11px] pt-1 text-[#111111]">
                support@wocha.com
              </li>
            </ul>
          </div>
        </div>

        {/* Hairline Sub-Footer */}
        <div className="hairline-top mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6B6B]">
          <div className="flex items-center gap-6">
            <span className="font-mono text-[11px]">&copy; {new Date().getFullYear()} WOCHA.</span>
            <span>All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-[11px] font-mono">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Legal Notice</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
