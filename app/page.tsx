'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  AVAILABLE_SHOWCASE_PRODUCTS,
  COMING_SOON_PRODUCTS,
  ShowcaseProduct,
  ComingSoonProduct,
} from '@/lib/data/showcase';
import { NotifyModal } from '@/components/shop/NotifyModal';
import { useCurrencyStore } from '@/lib/currency/store';
import { ReactLenis } from 'lenis/react';
import StackSpread from '@/components/ui/stack-spread';
import { CoverflowCarousel, type CoverflowSlide } from '@/components/ui/coverflow-carousel';

interface StickyGalleryItem {
  id: string;
  name: string;
  category: string;
  weight: string;
  fit: string;
  image: string;
  slug?: string;
}

const STICKY_GALLERY_COL_LEFT: StickyGalleryItem[] = [
  {
    id: 'ds-tee-01',
    name: 'Heavyweight Drop-Shoulder Tee',
    category: 'Drop Shoulder',
    weight: '280 GSM Cotton',
    fit: 'Relaxed Boxy Cut',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    slug: 'tee-01',
  },
  {
    id: 'anime-tee-01',
    name: 'Phantom Ronin Anime Graphic Tee',
    category: 'Anime Art Series',
    weight: '290 GSM Bio-Washed',
    fit: 'Oversized Streetwear',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
    slug: 'tee-02',
  },
  {
    id: 'ds-tee-02',
    name: 'Acid Wash Vintage Mineral Tee',
    category: 'Acid Wash Series',
    weight: '280 GSM Soft Wash',
    fit: 'Washed Boxy Fit',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
    slug: 'tee-04',
  },
  {
    id: 'blank-tee-01',
    name: 'Clean Minimalist Heavyweight Blank',
    category: 'Minimal Essentials',
    weight: '300 GSM Combed Cotton',
    fit: 'Classic Heavy Cut',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
    slug: 'tee-01',
  },
];

const STICKY_GALLERY_COL_CENTER: StickyGalleryItem[] = [
  {
    id: 'hoodie-01',
    name: 'Heavyweight Boxy Loopback Hoodie',
    category: 'Heavy Hoodies',
    weight: '480 GSM French Terry',
    fit: 'Double-Layer Warm Hood',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    slug: 'hoodie-01',
  },
  {
    id: 'anime-tee-02',
    name: 'Mecha Unit High-Density Anime Tee',
    category: 'Anime Art Series',
    weight: '270 GSM Pure Cotton',
    fit: 'Relaxed Drop Shoulder',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80',
    slug: 'tee-03',
  },
  {
    id: 'hoodie-02',
    name: 'Thermal Double-Zip Heavy Fleece',
    category: 'Zip-Up Outerwear',
    weight: '500 GSM Heavy Fleece',
    fit: 'Silver YKK Hardware',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
    slug: 'hoodie-02',
  },
];

const STICKY_GALLERY_COL_RIGHT: StickyGalleryItem[] = [
  {
    id: 'tee-chalk',
    name: 'Raw Hem Drop-Shoulder Oversized Tee',
    category: 'Drop Shoulder',
    weight: '280 GSM Cotton',
    fit: 'Drop Shoulder Cut',
    image: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1000&q=80',
    slug: 'tee-01',
  },
  {
    id: 'hoodie-graph',
    name: 'Over-Dye Cyber Graphic Heavy Hoodie',
    category: 'Heavy Hoodies',
    weight: '480 GSM Cotton',
    fit: 'Boxy Silhouette',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80',
    slug: 'hoodie-01',
  },
  {
    id: 'tee-moss',
    name: 'Vintage Sun-Faded Moss Green Tee',
    category: 'Acid Wash Series',
    weight: '290 GSM Combed',
    fit: 'Relaxed Fit',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80',
    slug: 'tee-04',
  },
  {
    id: 'hoodie-fleece',
    name: 'Loopback Fleece Street Hoodie',
    category: 'Heavy Hoodies',
    weight: '520 GSM Brushed Cotton',
    fit: 'Double Seamed',
    image: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&w=1000&q=80',
    slug: 'hoodie-02',
  },
];

const ALL_COMING_SOON_PIECES = [
  ...STICKY_GALLERY_COL_LEFT,
  ...STICKY_GALLERY_COL_CENTER,
  ...STICKY_GALLERY_COL_RIGHT,
];

const CATEGORY_SLIDES: CoverflowSlide[] = [
  {
    src: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    alt: 'Drop-Shoulder Boxy Streetwear Tee in Clean White',
    title: 'Drop-Shoulder Tees',
    subtitle: 'Relaxed Oversized Cut',
    meta: [
      { label: 'Fabric', value: '280 GSM Pure Cotton' },
      { label: 'Fit', value: 'Boxy Drop Shoulder' },
      { label: 'Status', value: 'Available Now' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    alt: 'Heavyweight Fleece Hoodie in Deep Black',
    title: 'Heavy Hoodies',
    subtitle: 'Double-Layer Cozy Fleece',
    meta: [
      { label: 'Fabric', value: '480 GSM Cotton Fleece' },
      { label: 'Hood', value: 'Double-Layered Warm' },
      { label: 'Status', value: 'Available Now' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
    alt: 'Anime Character Graphic Back Print on Heavyweight Tee',
    title: 'Anime Art Series',
    subtitle: 'High Definition Graphic Art',
    meta: [
      { label: 'Print Type', value: 'Direct-To-Film Art' },
      { label: 'Durability', value: 'Never Cracks or Fades' },
      { label: 'Status', value: 'Coming Soon' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    alt: 'Acid Washed Vintage Charcoal T-Shirt',
    title: 'Acid Washed Series',
    subtitle: 'Vintage Mineral Wash',
    meta: [
      { label: 'Wash', value: 'Hand Mineral Treatment' },
      { label: 'Texture', value: 'Ultra-Soft Worn Feel' },
      { label: 'Status', value: 'Coming Soon' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    alt: 'Clean Heavyweight Streetwear Tee in Pitch Black',
    title: 'Clean Minimal Blanks',
    subtitle: 'Everyday Simple Essentials',
    meta: [
      { label: 'Fabric', value: '300 GSM Combed Cotton' },
      { label: 'Collar', value: 'Thick 1.25" Ribbed Collar' },
      { label: 'Status', value: 'Available Now' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80',
    alt: 'Full Zip Fleece Jacket with Silver Puller',
    title: 'Zip-Up Heavy Outerwear',
    subtitle: 'Cold-Weather Fleece',
    meta: [
      { label: 'Hardware', value: 'Silver Metal Zipper' },
      { label: 'Lining', value: 'Brushed Thermal Fleece' },
      { label: 'Status', value: 'Coming Soon' },
    ],
  },
];

export default function HomePage() {
  const { formatPrice } = useCurrencyStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeNotifyProduct, setActiveNotifyProduct] = useState<ComingSoonProduct | null>(null);
  const stripScrollRef = useRef<HTMLDivElement>(null);

  const scrollStrip = (direction: 'left' | 'right') => {
    if (stripScrollRef.current) {
      const scrollAmount = stripScrollRef.current.clientWidth * 0.75;
      stripScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const availableCategories = [
    { id: 'all', label: 'All Items' },
    { id: 'drop-shoulder', label: 'Drop Shoulder Tees' },
    { id: 'hoodies', label: 'Hoodies' },
    { id: 'anime-prints', label: 'Anime Prints' },
  ];

  const filteredAvailable = activeCategory === 'all'
    ? AVAILABLE_SHOWCASE_PRODUCTS
    : AVAILABLE_SHOWCASE_PRODUCTS.filter((p) => p.category === activeCategory);

  return (
    <ReactLenis root>
      <div className="w-full">
      {/* =========================================================================
          1. INTERACTIVE HERO: STACK SPREAD
          ========================================================================= */}
      <StackSpread
        scrollLength={260}
        bgColor="#FAFAF8"
        headline={
          <div className="space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#111111] leading-[1.05]">
              Heavyweight Fits.
              <br />
              <span className="font-light italic text-[#666666]">Built to last.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#6B6B6B] max-w-lg mx-auto leading-relaxed">
              Premium drop-shoulder t-shirts, warm hoodies, and anime graphic tees. Made from heavy, soft cotton that keeps its shape.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <a
                href="#upcoming-gallery"
                className="wocha-btn rounded-lg px-6 py-3 text-xs uppercase tracking-wider text-white flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Preview Upcoming Drops</span>
                <span>&darr;</span>
              </a>
              <Link
                href="/upcoming"
                className="wocha-btn-secondary rounded-lg px-6 py-3 text-xs uppercase tracking-wider text-[#111111] flex items-center gap-2 cursor-pointer"
              >
                <span>Get Launch Alerts</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        }
        subtitle=""
      />

      <div className="space-y-20 sm:space-y-28 mt-16 sm:mt-24">

      {/* =========================================================================
          2. COMING SOON: SWIPEABLE PRODUCT STRIP
          ========================================================================= */}
      <section id="upcoming-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 scroll-mt-24">
        {/* Header with Title and Scroll Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 hairline-bottom pb-4">
          <div>
            <span className="text-[11px] font-mono text-[#6B6B6B] uppercase tracking-widest block">
              Next Release &bull; Coming Soon
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              Coming Soon
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1">
              Swipe right to explore upcoming silhouettes. Tap any piece to view details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-mono text-[#6B6B6B]">
              Swipe right &rarr;
            </span>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollStrip('left')}
                aria-label="Scroll left"
                className="w-9 h-9 rounded-full bg-white hairline-border flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollStrip('right')}
                aria-label="Scroll right"
                className="w-9 h-9 rounded-full bg-white hairline-border flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              href="/upcoming"
              className="text-xs font-mono uppercase text-[#111111] underline underline-offset-4 hover:text-[#6B6B6B] ml-2 shrink-0"
            >
              See All &rarr;
            </Link>
          </div>
        </div>

        {/* Horizontal Swipeable Product Strip */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div
            ref={stripScrollRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 pb-6"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {ALL_COMING_SOON_PIECES.map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                href={item.slug ? `/product/${item.slug}` : '/upcoming'}
                className="group shrink-0 w-[230px] sm:w-[270px] md:w-[300px] snap-start flex flex-col bg-white hairline-border rounded-xl overflow-hidden hover:border-[#111111] hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[3/4] w-full bg-[#F5F4EF] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-65 group-hover:opacity-85 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm font-semibold text-white tracking-tight leading-snug line-clamp-2">
                      {item.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* =========================================================================
          4. CATEGORIES
          ========================================================================= */}
      {/* =========================================================================
          4. CATEGORIES (3D COVERFLOW CAROUSEL)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 hairline-bottom pb-4">
          <div>
            <span className="text-[11px] font-mono text-[#6B6B6B] uppercase tracking-widest block">
              Explore Collections
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#111111]">
              Shop By Category
            </h2>
          </div>
          <div className="flex items-center gap-4">
            
            <Link
              href="/shop"
              className="text-xs font-mono uppercase text-[#111111] underline underline-offset-4 hover:text-[#6B6B6B]"
            >
              View All Products
            </Link>
          </div>
        </div>

        <div className="bg-white hairline-border rounded-2xl p-4 sm:p-8 overflow-hidden">
          <CoverflowCarousel
            slides={CATEGORY_SLIDES}
            cardWidth="clamp(220px, 24vw, 320px)"
            rotate={42}
            depth={0.58}
            perspective={3}
            gap={0.06}
            loop={true}
            showCaption={true}
            showNavigation={true}
            showPagination={true}
            label="Shop by category 3D carousel"
          />

          <div className="mt-8 flex justify-center">
            <Link
              href="/shop"
              className="wocha-btn px-6 py-3 text-xs font-mono uppercase tracking-wider"
            >
              Explore All Categories &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. QUALITY & FABRIC
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 bg-white hairline-border rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 hairline-right pr-0 md:pr-8 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] block">
              Fabric & Quality
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] leading-tight">
              Real quality cotton. Made to feel great every day.
            </h2>
          </div>

          <div className="md:col-span-8 space-y-4 text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
            <p>
              We make clothes that feel solid and last long. No cheap, paper-thin fabrics. We use 100% thick combed cotton and heavy loopback fleece that holds its shape wash after wash.
            </p>
            <p>
              Pre-washed to prevent shrinking, with strong double stitching on all seams. Made for everyday wear that looks better the more you wear it.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4 font-mono text-[11px] text-[#111111]">
              <div>
                <span className="block font-semibold">280–300 GSM</span>
                <span className="text-[#6B6B6B]">Heavy Cotton Tees</span>
              </div>
              <div>
                <span className="block font-semibold">480–520 GSM</span>
                <span className="text-[#6B6B6B]">Thick Cozy Hoodies</span>
              </div>
              <div>
                <span className="block font-semibold">NO SHRINK</span>
                <span className="text-[#6B6B6B]">Pre-Washed Fabrics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>

      {/* Notification Modal for Coming Soon Launch signups */}
      <NotifyModal
        product={activeNotifyProduct}
        isOpen={!!activeNotifyProduct}
        onClose={() => setActiveNotifyProduct(null)}
      />
      </div>
    </ReactLenis>
  );
}
