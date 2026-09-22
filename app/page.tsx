import React from 'react';
import Link from 'next/link';
import {
  STREETWEAR_PRODUCTS,
  GYM_WEAR_PRODUCTS,
  WINTER_WEAR_PRODUCTS,
  NORMAL_WEAR_PRODUCTS,
} from '@/lib/data/showcase';
import { CollectionCarousel } from '@/components/home/CollectionCarousel';
import { HomeNewsletter } from '@/components/home/HomeNewsletter';

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
  return (
    <div className="w-full bg-[#FAFAF8] text-[#111111] selection:bg-[#111111] selection:text-white">
      
      {/* =========================================================================
          COLLECTION 1: STREETWEAR
          ========================================================================= */}
      <section className="relative w-full bg-white border-b border-[#EDEAE3]">
        {/* Full-size Banner Image (Unobstructed, full size top, bottom, and both sides) */}
        <div className="w-full max-w-[1780px] mx-auto px-3 sm:px-6 lg:px-10 pt-4 sm:pt-6">
          <div className="w-full overflow-hidden rounded-2xl bg-[#E9EBEA] shadow-xs">
            <img
              src="/hero-nude.jpg"
              alt="WOCHA Streetwear Collection"
              className="w-full h-auto object-contain block"
            />
          </div>
        </div>

        {/* Continuous Product Strip */}
        <div className="w-full max-w-[1780px] mx-auto px-3 sm:px-6 lg:px-10">
          <CollectionCarousel
            categorySlug="streetwear"
            products={STREETWEAR_PRODUCTS}
            autoplayIntervalMs={4500}
          />
        </div>
      </section>


      {/* =========================================================================
          COLLECTION 2: GYM WEAR
          ========================================================================= */}
      <section className="relative w-full bg-white border-b border-[#EDEAE3] pt-6 sm:pt-10">
        {/* Full-size Banner Image (Unobstructed, full size top, bottom, and both sides) */}
        <div className="w-full max-w-[1780px] mx-auto px-3 sm:px-6 lg:px-10 pt-2 sm:pt-4">
          <div className="w-full overflow-hidden rounded-2xl bg-[#161616] shadow-xs">
            <img
              src="/gym%20wear/gym%20wear%20banner%20-final%20.png"
              alt="WOCHA Gym Wear Collection"
              className="w-full h-auto object-contain block"
            />
          </div>
        </div>

        {/* Continuous Product Strip */}
        <div className="w-full max-w-[1780px] mx-auto px-3 sm:px-6 lg:px-10">
          <CollectionCarousel
            categorySlug="gym-wear"
            products={GYM_WEAR_PRODUCTS}
            autoplayIntervalMs={4500}
          />
        </div>
      </section>


      {/* =========================================================================
          COLLECTION 3: WINTER WEAR
          ========================================================================= */}
      <section className="relative w-full bg-white border-b border-[#EDEAE3] pt-6 sm:pt-10">
        {/* Full-size Banner Image (Unobstructed, full size top, bottom, and both sides) */}
        <div className="w-full max-w-[1780px] mx-auto px-3 sm:px-6 lg:px-10 pt-2 sm:pt-4">
          <div className="w-full overflow-hidden rounded-2xl bg-[#1f1f1f] shadow-xs">
            <img
              src="/WINTER%20WEAR/winter-wear-1/HOODIES%20-1.png"
              alt="WOCHA Winter Wear Collection"
              className="w-full h-auto object-contain block"
            />
          </div>
        </div>

        {/* Continuous Product Strip */}
        <div className="w-full max-w-[1780px] mx-auto px-3 sm:px-6 lg:px-10">
          <CollectionCarousel
            categorySlug="winter-wear"
            products={WINTER_WEAR_PRODUCTS}
            autoplayIntervalMs={4500}
          />
        </div>
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
      <HomeNewsletter />

    </div>
  );
}
