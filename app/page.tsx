'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import {
  STREETWEAR_PRODUCTS,
  GYM_WEAR_PRODUCTS,
  NORMAL_WEAR_PRODUCTS,
} from '@/lib/data/showcase';
import { CollectionCarousel } from '@/components/home/CollectionCarousel';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// Lookbook Street Gallery Images
const STREET_LOOKBOOK = [
  {
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
    title: 'Fleece Pullover',
    city: 'Berlin',
    tag: '@niko_berlin',
    productLink: '/shop?category=streetwear',
  },
  {
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    title: 'Boxy Cotton Tee',
    city: 'Madrid',
    tag: '@carlos_m',
    productLink: '/shop?category=streetwear',
  },
  {
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
    title: 'Training Stringer',
    city: 'London',
    tag: '@dan_trains',
    productLink: '/shop?category=gym-wear',
  },
  {
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
    title: 'Everyday Crewneck',
    city: 'Paris',
    tag: '@lucas_marais',
    productLink: '/shop?category=normal-wear',
  },
  {
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
    title: 'Oversized Street Hoodie',
    city: 'Tokyo',
    tag: '@kenji_shibuya',
    productLink: '/shop?category=streetwear',
  },
  {
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
    title: 'Relaxed Daily Tee',
    city: 'Seoul',
    tag: '@seoul_fits',
    productLink: '/shop?category=normal-wear',
  },
];

export default function HomePage() {
  const [emailInput, setEmailInput] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmailInput('');
    }, 3500);
  };

  return (
    <div className="w-full bg-[#FAFAF8] text-[#111111] selection:bg-[#111111] selection:text-white">
      
      {/* =========================================================================
          COLLECTION 1: STREETWEAR
          ========================================================================= */}
      <section className="relative w-full bg-white border-b border-[#EDEAE3]">
        <div className="max-w-[1780px] mx-auto px-3 sm:px-6 lg:px-10 py-4 sm:py-6">
          {/* Streetwear Billboard Banner */}
          <div className="relative w-full h-[62vh] min-h-[480px] max-h-[720px] rounded-2xl overflow-hidden bg-[#E9EBEA] flex flex-col justify-end p-6 sm:p-10 lg:p-14 shadow-xs">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="/hero-nude.jpg"
                alt="WOCHA Streetwear Collection"
                className="w-full h-full object-cover object-[center_18%] sm:object-[center_20%] lg:object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent lg:from-black/45 lg:via-transparent lg:to-transparent pointer-events-none" />
            </div>

            {/* Bottom Content & Buttons */}
            <div className="relative z-10 space-y-3 sm:space-y-4 text-white max-w-xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md font-sans">
                Streetwear
              </h1>

              {/* Action Buttons */}
              <div className="flex flex-row flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                <Link
                  href="/shop?category=streetwear"
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-[#111111] hover:bg-neutral-100 text-xs sm:text-sm font-semibold rounded-full transition-all shadow-md active:scale-95 cursor-pointer font-sans"
                >
                  Shop Streetwear
                </Link>

                <Link
                  href="/shop"
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white text-xs sm:text-sm font-medium rounded-full transition-all active:scale-95 cursor-pointer font-sans"
                >
                  View All
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Streetwear Moving Product Strip */}
        <CollectionCarousel
          title="Streetwear"
          categorySlug="streetwear"
          products={STREETWEAR_PRODUCTS}
          autoplayIntervalMs={4500}
        />
      </section>


      {/* =========================================================================
          COLLECTION 2: GYM WEAR
          ========================================================================= */}
      <section className="relative w-full bg-white border-b border-[#EDEAE3] pt-6 sm:pt-10">
        <div className="max-w-[1780px] mx-auto px-3 sm:px-6 lg:px-10 py-4 sm:py-6">
          {/* Gym Wear Billboard Banner */}
          <div className="relative w-full h-[55vh] min-h-[440px] max-h-[620px] rounded-2xl overflow-hidden bg-[#161616] flex flex-col justify-end p-6 sm:p-10 lg:p-14 shadow-xs">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=80"
                alt="WOCHA Gym Wear Collection"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none" />
            </div>

            {/* Bottom Content & Buttons */}
            <div className="relative z-10 space-y-3 sm:space-y-4 text-white max-w-xl">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md font-sans">
                Gym Wear
              </h2>

              {/* Action Buttons */}
              <div className="flex flex-row flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                <Link
                  href="/shop?category=gym-wear"
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-[#111111] hover:bg-neutral-100 text-xs sm:text-sm font-semibold rounded-full transition-all shadow-md active:scale-95 cursor-pointer font-sans"
                >
                  Shop Gym Wear
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Gym Wear Moving Product Strip */}
        <CollectionCarousel
          title="Gym Wear"
          categorySlug="gym-wear"
          products={GYM_WEAR_PRODUCTS}
          autoplayIntervalMs={4500}
        />
      </section>


      {/* =========================================================================
          COLLECTION 3: NORMAL WEAR
          ========================================================================= */}
      <section className="relative w-full bg-white border-b border-[#EDEAE3] pt-6 sm:pt-10">
        <div className="max-w-[1780px] mx-auto px-3 sm:px-6 lg:px-10 py-4 sm:py-6">
          {/* Normal Wear Billboard Banner */}
          <div className="relative w-full h-[55vh] min-h-[440px] max-h-[620px] rounded-2xl overflow-hidden bg-[#1f1f1f] flex flex-col justify-end p-6 sm:p-10 lg:p-14 shadow-xs">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=2000&q=80"
                alt="WOCHA Normal Wear Collection"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none" />
            </div>

            {/* Bottom Content & Buttons */}
            <div className="relative z-10 space-y-3 sm:space-y-4 text-white max-w-xl">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md font-sans">
                Normal Wear
              </h2>

              {/* Action Buttons */}
              <div className="flex flex-row flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                <Link
                  href="/shop?category=normal-wear"
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-[#111111] hover:bg-neutral-100 text-xs sm:text-sm font-semibold rounded-full transition-all shadow-md active:scale-95 cursor-pointer font-sans"
                >
                  Shop Normal Wear
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Normal Wear Moving Product Strip */}
        <CollectionCarousel
          title="Normal Wear"
          categorySlug="normal-wear"
          products={NORMAL_WEAR_PRODUCTS}
          autoplayIntervalMs={4500}
        />
      </section>


      {/* =========================================================================
          COMMUNITY LOOKBOOK GALLERY
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E3DD] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <InstagramIcon className="w-4 h-4 text-[#111111]" />
              <span className="text-[11px] font-mono text-[#6B6B6B] uppercase tracking-widest">
                @wocha.clothing &bull; Community
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#111111]">
              Worn In The Streets
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1">
              Real people wearing WOCHA pieces around the world.
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs font-mono uppercase text-[#111111] underline underline-offset-4 hover:text-[#6B6B6B] shrink-0"
          >
            Shop All Outfits &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {STREET_LOOKBOOK.map((item, idx) => (
            <Link
              key={idx}
              href={item.productLink}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-[#F5F4EF] hairline-border block"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
                <span className="text-[10px] font-mono text-neutral-300">{item.city}</span>
                <span className="text-xs font-bold truncate">{item.tag}</span>
                <span className="text-[10px] font-mono text-white/90 mt-1 underline">
                  Shop Collection &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>


      {/* =========================================================================
          NEWSLETTER & DROP UPDATES
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <div className="bg-white hairline-border rounded-2xl p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-6 shadow-sm">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] block">
            Stay Updated &bull; Early Access
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[#111111]">
            Get Updates On New Drops
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-md mx-auto leading-relaxed">
            Enter your email to hear about new collections, restocks, and exclusive deals before anyone else.
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 px-4 py-3 rounded-lg bg-[#FAFAF8] border border-[#E5E3DD] text-xs font-mono text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#111111] text-white hover:bg-neutral-800 text-xs font-mono uppercase tracking-wider font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Sign Up
            </button>
          </form>

          {subscribed && (
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>You are subscribed. We will keep you updated.</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-center gap-6 text-[11px] font-mono text-[#6B6B6B]">
            <span>✓ No spam</span>
            <span>✓ Unsubscribe anytime</span>
            <span>✓ Early drop notifications</span>
          </div>
        </div>
      </section>

    </div>
  );
}
