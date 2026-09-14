'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
  Compass,
  Camera,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

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

import { ReactLenis } from 'lenis/react';
import {
  AVAILABLE_SHOWCASE_PRODUCTS,
  ShowcaseProduct,
  ComingSoonProduct,
} from '@/lib/data/showcase';
import { NotifyModal } from '@/components/shop/NotifyModal';
import { DropMarquee } from '@/components/home/DropMarquee';
import { StreetProductCard } from '@/components/home/StreetProductCard';
import { PodcastSection } from '@/components/home/PodcastSection';
import { useCurrencyStore } from '@/lib/currency/store';

// Lookbook Street Gallery Images
const STREET_LOOKBOOK = [
  {
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
    title: 'Silver Double-Zip Fleece',
    city: 'Berlin',
    tag: '@niko_berlin',
    productLink: '/shop?category=hoodies',
  },
  {
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
    title: 'Drop-Shoulder Boxy Tee',
    city: 'Madrid',
    tag: '@carlos_m',
    productLink: '/shop?category=t-shirts',
  },
  {
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    title: 'Pitch Black Heavy Loopback',
    city: 'Tokyo',
    tag: '@kenji_shibuya',
    productLink: '/shop?category=hoodies',
  },
  {
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
    title: 'Mineral Acid Washed Tee',
    city: 'London',
    tag: '@maya_ldn',
    productLink: '/shop?category=t-shirts',
  },
  {
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
    title: 'Phantom Ronin Anime Print',
    city: 'Seoul',
    tag: '@seoul_fits',
    productLink: '/shop?category=t-shirts',
  },
  {
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
    title: 'Clean Minimal 300 GSM Blank',
    city: 'Paris',
    tag: '@lucas_marais',
    productLink: '/shop?category=t-shirts',
  },
];

// Upcoming drops countdown pieces
const UPCOMING_DROPS: ComingSoonProduct[] = [
  {
    id: 'drop-cyber-hoodie',
    name: 'Cybernetic High-Density Loopback Hoodie',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    launchWindow: 'Friday 20:00 CET',
    estimatedPriceUSD: 195,
    estimatedPriceINR: 7999,
    weight: '520 GSM Ultra Fleece',
    fit: 'Brutalist Boxy Silhouette',
    description: 'Extremely heavyweight loopback French terry with silver double-head zipper hardware and custom drop-shoulder geometry.',
    previewTag: 'Only 75 Pieces',
  },
  {
    id: 'drop-acid-cargo',
    name: 'Vintage Sun-Faded Acid Wash Tee',
    category: 'acid-wash',
    categoryLabel: 'Acid Wash',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    launchWindow: 'Friday 20:00 CET',
    estimatedPriceUSD: 55,
    estimatedPriceINR: 2499,
    weight: '290 GSM Combed Cotton',
    fit: 'Washed Street Cut',
    description: 'Each piece is individually treated by hand with mineral stonewash pigments for a one-of-a-kind vintage fade.',
    previewTag: 'Limited Dye Run',
  },
  {
    id: 'drop-mecha-tee',
    name: 'Mecha Unit High-Density Graphic Tee',
    category: 'anime-prints',
    categoryLabel: 'Anime Series',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    launchWindow: 'Next Friday',
    estimatedPriceUSD: 60,
    estimatedPriceINR: 2699,
    weight: '280 GSM Pure Cotton',
    fit: 'Oversized Street Cut',
    description: 'High-density Direct-To-Film artwork that will never peel or crack, finished with reinforced 1.25" ribbing.',
    previewTag: 'Cult Classic',
  },
];

export default function HomePage() {
  const { formatPrice } = useCurrencyStore();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activeNotifyProduct, setActiveNotifyProduct] = useState<ComingSoonProduct | null>(null);
  const [emailInput, setEmailInput] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  // Fake live countdown for drop urgency
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 48,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmailInput('');
    }, 3000);
  };

  const filteredProducts =
    activeTab === 'all'
      ? AVAILABLE_SHOWCASE_PRODUCTS
      : AVAILABLE_SHOWCASE_PRODUCTS.filter((p) => {
          if (activeTab === 'hoodies') return p.category === 'hoodies';
          if (activeTab === 'drop-shoulder') return p.category === 'drop-shoulder';
          if (activeTab === 'anime-prints') return p.category === 'anime-prints';
          if (activeTab === 'acid-wash') return p.category === 'acid-wash';
          return true;
        });

  return (
    <ReactLenis root>
      <div className="w-full bg-[#FAFAF8] text-[#111111] selection:bg-[#111111] selection:text-white">
        {/* =========================================================================
            1. EXACT NUDE PROJECT EDITORIAL HERO (As Shown in Reference)
            ========================================================================= */}
        <section className="relative w-full bg-white overflow-hidden border-b border-[#EDEAE3]">
          <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10">
            <div className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] rounded-2xl overflow-hidden bg-[#E9EBEA] flex flex-col justify-between p-6 sm:p-10 lg:p-14 shadow-xs">
              
              {/* Background Model Studio Lineup */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/hero-nude.jpg"
                  alt="WOCHA Fall/Winter Lineup"
                  className="w-full h-full object-cover object-center"
                />
                {/* Subtle soft gradient on left bottom to make text legible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              </div>

              {/* Top Row: Small Capsule Tag */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-mono tracking-widest uppercase text-[#482922] bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-black/5">
                  Fall / Winter 2026
                </span>
              </div>

              {/* Main Content Area */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end w-full">
                
                {/* Bottom-Left Overlay: FW26-01 & New Arrivals */}
                <div className="lg:col-span-7 space-y-4 text-white">
                  <div className="space-y-1">
                    <span className="text-xs sm:text-sm font-mono tracking-[0.2em] uppercase text-white/90 drop-shadow-sm block font-medium">
                      FW26-01
                    </span>
                    <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg font-sans">
                      New Arrivals
                    </h2>
                  </div>

                  {/* Pill Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href="/shop"
                      className="px-7 sm:px-8 py-3 bg-white text-[#111111] hover:bg-neutral-100 text-xs sm:text-sm font-semibold rounded-full transition-all shadow-md active:scale-95 cursor-pointer font-sans"
                    >
                      Shop Now
                    </Link>

                    <Link
                      href="/shop?filter=exclusive"
                      className="px-7 sm:px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white text-xs sm:text-sm font-medium rounded-full transition-all active:scale-95 cursor-pointer font-sans"
                    >
                      Women&apos;s Exclusive
                    </Link>
                  </div>
                </div>

                {/* Right Column: "You're gonna need a bigger closet" */}
                <div className="lg:col-span-5 flex flex-col justify-end lg:items-end text-left lg:text-right space-y-3">
                  <div className="bg-white/90 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-5 lg:p-0 rounded-xl lg:rounded-none border lg:border-none border-black/5 max-w-md">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-[0.92] text-[#111111] font-sans">
                      You&apos;re<br />
                      gonna<br />
                      need a<br />
                      bigger<br />
                      closet
                    </h1>

                    <p className="text-xs sm:text-[13px] text-[#2E1E19]/80 leading-relaxed font-sans font-normal pt-3 max-w-sm ml-auto">
                      The Fall/Winter wardrobe everyone wants. Our warmest collection yet. The fits took us all year. Layers, textures, everyday essentials. Good luck choosing. We made countless versions before these. Back for the cold.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>


        {/* =========================================================================
            2. THE LATEST DROP (Streetwear Grid with Filter Tabs & Quick Add)
            ========================================================================= */}
        <section id="drop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 space-y-8 scroll-mt-20">
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E5E3DD] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-black" />
                <span className="text-[11px] font-mono text-[#6B6B6B] uppercase tracking-widest">
                  Current Release &bull; In Stock
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111111]">
                The Latest Drop
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1">
                Select your size directly on any card for 1-click bag addition.
              </p>
            </div>

            {/* Filter Tabs (Nude Project Style Pill Buttons) */}
            <div className="flex items-center flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'hoodies', label: 'Heavy Hoodies' },
                { id: 'drop-shoulder', label: 'Drop-Shoulder Tees' },
                { id: 'anime-prints', label: 'Anime Graphic Series' },
                { id: 'acid-wash', label: 'Vintage Acid Wash' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#111111] text-white font-bold shadow-sm'
                      : 'bg-white hairline-border text-[#6B6B6B] hover:text-[#111111] hover:border-[#111111]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid (4-column responsive) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, idx) => (
              <StreetProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>

          {/* Explore Catalog Link */}
          <div className="flex justify-center pt-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#111111] text-white hover:bg-neutral-800 text-xs font-mono uppercase tracking-widest font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <span>Explore Complete Atelier Catalog ({AVAILABLE_SHOWCASE_PRODUCTS.length}+ Pieces)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* =========================================================================
            3. SPLIT CAMPAIGN STORYTELLING (Nude Project Editorial Duos)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Tile 1: Heavy Hoodies */}
            <div className="group relative min-h-[480px] sm:min-h-[560px] rounded-2xl overflow-hidden bg-[#141414] text-white flex flex-col justify-between p-8 sm:p-10 hairline-border">
              <img
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80"
                alt="480 GSM Loopback Hoodie"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="relative z-10 flex justify-between items-start">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full font-mono text-[10px] uppercase tracking-wider text-white border border-white/20">
                  Core Heavy Series
                </span>
                <span className="font-mono text-xs text-neutral-300">480–520 GSM</span>
              </div>

              <div className="relative z-10 space-y-3">
                <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-white">
                  The Hoodie
                  <br />
                  Protocol.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-sm">
                  Knit from double-faced loopback terry with zero exterior logos. Double-layered hood that never collapses.
                </p>
                <div className="pt-2">
                  <Link
                    href="/shop?category=hoodies"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#111111] hover:bg-neutral-200 text-xs font-mono uppercase tracking-wider font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Shop Hoodies</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Tile 2: Drop-Shoulder Tees */}
            <div className="group relative min-h-[480px] sm:min-h-[560px] rounded-2xl overflow-hidden bg-[#141414] text-white flex flex-col justify-between p-8 sm:p-10 hairline-border">
              <img
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80"
                alt="Drop-Shoulder Boxy Tee"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="relative z-10 flex justify-between items-start">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full font-mono text-[10px] uppercase tracking-wider text-white border border-white/20">
                  Architectural Cut
                </span>
                <span className="font-mono text-xs text-neutral-300">280–300 GSM</span>
              </div>

              <div className="relative z-10 space-y-3">
                <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-white">
                  Boxy Drop
                  <br />
                  Shoulder.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-sm">
                  Thick 1.25" ribbed collar that stays tight around the neck forever. Pre-washed for a draped boxy silhouette.
                </p>
                <div className="pt-2">
                  <Link
                    href="/shop?category=t-shirts"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#111111] hover:bg-neutral-200 text-xs font-mono uppercase tracking-wider font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <span>Shop Tees</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. THE PODCAST & CULTURE HUB (Direct Nude Project Reference)
            ========================================================================= */}
        <div className="pt-20 sm:pt-28">
          <PodcastSection />
        </div>

        {/* =========================================================================
            5. UPCOMING DROPS & RADAR (With Scarcity Urgency)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E3DD] pb-6">
            <div>
              <span className="text-[11px] font-mono text-[#6B6B6B] uppercase tracking-widest block mb-1">
                Drop Radar &bull; Launching Soon
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111111]">
                Upcoming Silhouettes
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1">
                Sign up to receive the direct SMS / email unlock code 30 minutes before public release.
              </p>
            </div>

            <Link
              href="/upcoming"
              className="text-xs font-mono uppercase text-[#111111] underline underline-offset-4 hover:text-[#6B6B6B] shrink-0"
            >
              View Full Launch Schedule &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {UPCOMING_DROPS.map((drop) => (
              <div
                key={drop.id}
                className="group relative bg-white hairline-border rounded-xl overflow-hidden hover:border-[#111111] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/5] w-full bg-[#F5F4EF] overflow-hidden">
                  <img
                    src={drop.image}
                    alt={drop.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="bg-[#111111] text-white text-[10px] font-mono px-2 py-0.5 rounded tracking-wider uppercase">
                      {drop.previewTag}
                    </span>
                    <span className="bg-white/90 backdrop-blur-sm text-[#111111] text-[10px] font-mono px-2 py-0.5 rounded border border-[#E5E3DD] tracking-wide">
                      {drop.weight}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-black/75 backdrop-blur-md text-white p-3 rounded-lg flex items-center justify-between text-xs font-mono">
                      <span>Launch Window:</span>
                      <span className="font-bold text-amber-300">{drop.launchWindow}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#111111] tracking-tight leading-snug">
                      {drop.name}
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-1.5 leading-relaxed line-clamp-2">
                      {drop.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F0EFEA] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#6B6B6B] block">
                        Estimated Retail
                      </span>
                      <span className="text-sm font-bold font-mono text-[#111111]">
                        {formatPrice(drop.estimatedPriceUSD)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveNotifyProduct(drop)}
                      className="px-4 py-2 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-mono uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Notify Me</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            6. STREET LOOKBOOK & COMMUNITY UGC (#WOCHASOCIETY)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E3DD] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <InstagramIcon className="w-4 h-4 text-[#111111]" />
                <span className="text-[11px] font-mono text-[#6B6B6B] uppercase tracking-widest">
                  @wocha.atelier &bull; #WOCHASOCIETY
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111111]">
                Worn In The Streets
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1">
                Real community members, skaters, and creatives across the world wearing WOCHA pieces.
              </p>
            </div>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase text-[#111111] underline underline-offset-4 hover:text-[#6B6B6B] shrink-0"
            >
              Follow On Instagram &rarr;
            </a>
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
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
                  <span className="text-[10px] font-mono text-neutral-300">{item.city}</span>
                  <span className="text-xs font-bold truncate">{item.tag}</span>
                  <span className="text-[10px] font-mono text-amber-300 mt-1 underline">
                    Shop Piece &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* =========================================================================
            7. THE HEAVYWEIGHT MANIFESTO (Brutalist Technical Specs)
            ========================================================================= */}
        <section id="manifesto" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28">
          <div className="bg-[#111111] text-[#FAFAF8] rounded-2xl p-8 sm:p-14 lg:p-16 relative overflow-hidden border border-neutral-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 block">
                  The WOCHA Manifesto
                </span>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-[1.05] text-white">
                  We Don't Do Thin Clothes.
                  <br />
                  <span className="text-neutral-400 font-light italic">Period.</span>
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Fast fashion made clothes transparent, disposable, and weak. We do the exact opposite. 
                  Every WOCHA piece is heavily knit, pre-shrunk, and engineered to hold its structure for decades.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-white">280–300</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded">
                      GSM
                    </span>
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Heavy Combed Cotton
                  </h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Used across all drop-shoulder t-shirts. Stiff enough to drape boxy, soft enough for all-day comfort.
                  </p>
                </div>

                <div className="p-5 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-white">480–520</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded">
                      GSM
                    </span>
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Loopback French Terry
                  </h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Double-faced heavy knit fleece. Keeps the hood standing rigid and protects against cold winds.
                  </p>
                </div>

                <div className="p-5 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-emerald-400">0%</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded">
                      Shrinkage
                    </span>
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Pre-Washed & Sanitized
                  </h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Washed before sewing. The fit you receive on day one is the exact fit you keep after 100 washes.
                  </p>
                </div>

                <div className="p-5 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-amber-400">YKK</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded">
                      Hardware
                    </span>
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Industrial Silver Zips
                  </h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Two-way heavy silver zippers and double-needle bar-tacked seams designed to resist tearing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. SYNDICATE EARLY DROP ACCESS (Password Access Box)
            ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="bg-white hairline-border rounded-2xl p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-6 shadow-sm">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] block">
              Join The Inner Circle &bull; Secret Drop Access
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-[#111111]">
              Get The Password 30 Mins Early.
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-md mx-auto leading-relaxed">
              Our drops sell out fast. Members receive the encrypted link & password before the public launch, plus 10% off your first drop.
            </p>

            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-3.5 rounded-lg bg-[#FAFAF8] border border-[#E5E3DD] text-xs font-mono text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111]"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#111111] text-white hover:bg-neutral-800 text-xs font-mono uppercase tracking-wider font-bold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Get Password
              </button>
            </form>

            {subscribed && (
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>You are on the syndicate list. Early password code sent to your inbox.</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-center gap-6 text-[11px] font-mono text-[#6B6B6B]">
              <span>✓ No Spam Ever</span>
              <span>✓ Instant Unsubscribe</span>
              <span>✓ VIP Secret Drops</span>
            </div>
          </div>
        </section>

        {/* Modal for Launch Signups */}
        <NotifyModal
          product={activeNotifyProduct}
          isOpen={!!activeNotifyProduct}
          onClose={() => setActiveNotifyProduct(null)}
        />
      </div>
    </ReactLenis>
  );
}
