'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { User, Heart, ShoppingBag, Search, X, Menu } from 'lucide-react';
import { useCartStore } from '@/lib/cart/store';
import { useWishlistStore } from '@/lib/wishlist/store';
import { useAuth } from '@/lib/auth/auth';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleDrawer, getItemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const itemCount = mounted ? getItemCount() : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-white">
      {/* =========================================================================
          1. TOP RUNNING TICKER / ANNOUNCEMENT BAR (Exact Nude Project Tone)
          ========================================================================= */}
      <div className="w-full bg-[#EFECE6] border-b border-[#E3DFD7] overflow-hidden py-1.5 select-none">
        <div className="flex w-max">
          {/* Track 1 */}
          <div className="flex shrink-0 items-center animate-marquee">
            {[1, 2, 3].map((idx) => (
              <div
                key={`track1-${idx}`}
                className="flex items-center gap-6 px-4 shrink-0 font-sans text-[11px] sm:text-[12px] text-[#482922] font-normal tracking-tight"
              >
                <span>Free Express Shipping Across India</span>
                <span className="text-[#482922]/50 font-bold">&middot;</span>
                <span>30 Days Easy Returns &amp; Exchanges</span>
                <span className="text-[#482922]/50 font-bold">&middot;</span>
                <span>Taxes &amp; Duties Included</span>
                <span className="text-[#482922]/50 font-bold">&middot;</span>
              </div>
            ))}
          </div>
          {/* Track 2 (infinite clone) */}
          <div className="flex shrink-0 items-center animate-marquee" aria-hidden="true">
            {[1, 2, 3].map((idx) => (
              <div
                key={`track2-${idx}`}
                className="flex items-center gap-6 px-4 shrink-0 font-sans text-[11px] sm:text-[12px] text-[#482922] font-normal tracking-tight"
              >
                <span>Free Express Shipping Across India</span>
                <span className="text-[#482922]/50 font-bold">&middot;</span>
                <span>30 Days Easy Returns &amp; Exchanges</span>
                <span className="text-[#482922]/50 font-bold">&middot;</span>
                <span>Taxes &amp; Duties Included</span>
                <span className="text-[#482922]/50 font-bold">&middot;</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. MAIN HEADER NAVIGATION BAR
          ========================================================================= */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#EDEAE3] transition-all relative">
        <div className="max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-[66px] flex items-center justify-between">
          
          {/* LEFT: Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center group cursor-pointer select-none hover:opacity-85 transition-opacity"
              aria-label="WOCHA Home"
            >
              <Image
                src="/wocha.png"
                alt="WOCHA"
                width={140}
                height={34}
                priority
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </Link>
          </div>

          {/* CENTER: Category Nav Links (Streetwear, Gym Wear, Normal Wear, New In) */}
          <nav className="hidden md:flex items-center gap-7 sm:gap-8 lg:gap-10 text-[14px] text-[#482922] font-medium tracking-tight absolute left-1/2 -translate-x-1/2">
            <Link
              href="/shop?category=streetwear"
              className="transition-colors hover:text-black font-semibold"
            >
              Streetwear
            </Link>
            <Link
              href="/shop?category=gym-wear"
              className="transition-colors hover:text-black font-semibold"
            >
              Gym Wear
            </Link>
            <Link
              href="/shop?category=normal-wear"
              className="transition-colors hover:text-black font-semibold"
            >
              Normal Wear
            </Link>
            <Link
              href="/shop?filter=new"
              className="transition-colors hover:text-black"
            >
              New In
            </Link>
          </nav>

          {/* RIGHT GROUP: Search ▮, Account, Wishlist, Bag */}
          <div className="flex items-center gap-4 sm:gap-6 text-[14px] text-[#482922]">

            {/* Search ▮ */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden sm:flex items-center gap-1.5 hover:text-black transition-colors cursor-pointer font-medium"
              aria-label="Toggle search"
            >
              <span>Search</span>
              <span className="inline-block w-1.5 h-3.5 bg-[#482922] align-middle" />
            </button>

            {/* Account / User Icon */}
            <Link
              href={mounted && user ? '/account' : '/auth/login'}
              className="hover:text-black transition-colors p-1"
              aria-label="User Account"
            >
              <User className="w-[19px] h-[19px] stroke-[1.7]" />
            </Link>

            {/* Wishlist Heart Icon */}
            <Link
              href="/wishlist"
              className="relative hover:text-black transition-colors p-1"
              aria-label="Wishlist"
            >
              <Heart className="w-[19px] h-[19px] stroke-[1.7]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#482922] text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Icon */}
            <button
              type="button"
              onClick={toggleDrawer}
              className="relative hover:text-black transition-colors p-1 cursor-pointer"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-[19px] h-[19px] stroke-[1.7]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#482922] text-white text-[9px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 hover:text-black transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* =========================================================================
            3. EXPANDABLE SEARCH BAR
            ========================================================================= */}
        {searchOpen && (
          <div className="border-t border-[#EDEAE3] bg-white px-4 sm:px-8 py-3 animate-in fade-in duration-150">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-4 h-4 text-[#482922]/60 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, hoodies, tees, collections..."
                className="flex-1 bg-transparent text-[14px] text-[#482922] placeholder:text-[#482922]/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-[#482922]/60 hover:text-[#482922] p-1"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* =========================================================================
            4. MOBILE DRAWER MENU
            ========================================================================= */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#EDEAE3] px-6 py-6 space-y-5 animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 pb-3 border-b border-[#EDEAE3]">
              <Search className="w-4 h-4 text-[#482922]/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 text-sm text-[#482922] placeholder:text-[#482922]/40 focus:outline-none"
              />
            </form>

            <nav className="flex flex-col space-y-3.5 text-[15px] font-medium text-[#482922]">
              <Link
                href="/shop?category=streetwear"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-black font-semibold"
              >
                Streetwear
              </Link>
              <Link
                href="/shop?category=gym-wear"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-black font-semibold"
              >
                Gym Wear
              </Link>
              <Link
                href="/shop?category=normal-wear"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-black font-semibold"
              >
                Normal Wear
              </Link>
              <Link
                href="/shop?filter=new"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-black"
              >
                New In
              </Link>
            </nav>

            <div className="pt-4 border-t border-[#EDEAE3] flex items-center justify-between text-xs text-[#482922]">
              {mounted && user ? (
                <div className="flex items-center justify-between w-full">
                  <span>{user.email}</span>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="underline font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-semibold underline"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#6B6B6B]"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
