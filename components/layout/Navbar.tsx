'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/cart/store';
import { useAuth } from '@/lib/auth/auth';

export function Navbar() {
  const pathname = usePathname();
  const { toggleDrawer, getItemCount } = useCartStore();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = mounted ? getItemCount() : 0;

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Drop Shoulders', href: '/shop?category=t-shirts' },
    { label: 'Hoodies', href: '/shop?category=hoodies' },
    { label: 'Upcoming Drops', href: '/upcoming' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF8]/95 backdrop-blur-md hairline-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center hover:opacity-85 transition-opacity py-1"
            aria-label="WOCHA Home"
          >
            <Image
              src="/wocha.png"
              alt="WOCHA"
              width={130}
              height={32}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wide">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-1 ${
                    isActive
                      ? 'text-[#111111] font-semibold border-b border-[#111111]'
                      : 'text-[#6B6B6B] hover:text-[#111111]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Auth, Bag, Mobile Toggle */}
        <div className="flex items-center gap-4 text-xs">
          {/* Auth State */}
          <div className="hidden sm:flex items-center gap-3">
            {mounted && user ? (
              <div className="flex items-center gap-3">
                {(user.role === 'admin' || user.role === 'staff') && (
                  <Link
                    href="/admin"
                    className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 rounded font-bold hover:bg-neutral-800 transition-colors"
                  >
                    Admin Portal
                  </Link>
                )}
                <Link
                  href="/account"
                  className="text-[#111111] hover:underline font-mono text-[11px] font-semibold"
                >
                  {user.name || user.email.split('@')[0]}
                </Link>
                <button
                  onClick={logout}
                  className="text-[#6B6B6B] hover:text-[#111111] underline text-[11px] cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-[#111111] hover:text-[#6B6B6B] transition-colors uppercase tracking-wider font-mono text-[11px]"
              >
                Sign In
              </Link>
            )}
          </div>

          <span className="hidden sm:inline-block w-px h-4 bg-[#E5E3DD]" />

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="hidden sm:flex items-center gap-1 py-1.5 px-2.5 text-[#111111] hover:bg-white hairline-border rounded-lg transition-colors cursor-pointer text-xs font-mono"
            aria-label="Personal Archive Wishlist"
          >
            <span className="text-xs uppercase font-mono font-medium">Saved</span>
          </Link>

          <span className="hidden sm:inline-block w-px h-4 bg-[#E5E3DD]" />

          {/* Bag Trigger Button */}
          <button
            onClick={toggleDrawer}
            className="flex items-center gap-1.5 py-1.5 px-2.5 text-[#111111] hover:bg-white hairline-border rounded-lg transition-colors cursor-pointer"
            aria-label="Open shopping bag"
          >
            <span className="text-xs uppercase font-mono font-medium">Bag</span>
            <span
              className="font-mono text-xs text-[#111111] font-semibold"
              suppressHydrationWarning
            >
              [{itemCount}]
            </span>
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#111111] hairline-border rounded-lg hover:bg-white"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="square" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="square" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAFAF8] hairline-top px-4 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm uppercase tracking-wide text-[#111111] hover:text-[#6B6B6B] font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm uppercase tracking-wide text-[#111111] hover:text-[#6B6B6B] font-medium"
            >
              Saved Items
            </Link>
          </nav>

          <div className="hairline-top pt-4 flex items-center justify-between">
            {mounted && user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-mono text-[#6B6B6B]">{user.email}</span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-[#111111] underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="wocha-btn rounded-lg px-4 py-1.5 text-xs text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="wocha-btn-secondary rounded-lg px-4 py-1.5 text-xs text-[#111111]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
