import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';

export const metadata = {
  title: 'About Us — WOCHA',
  description: 'Learn why we started WOCHA and how we make our clothes.',
};

export default function AboutPage() {
  return (
    <div className="w-full bg-[#FAFAF8] text-[#111111]">
      {/* 1. Header */}
      <section className="border-b border-[#EDEAE3] bg-white py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#482922] bg-[#EFECE6] px-3 py-1 rounded-full border border-[#E3DFD7]">
            About Us
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#111111] leading-tight font-sans">
            Good clothes that feel right and last long.
          </h1>
          <p className="text-sm sm:text-base text-[#6B6B6B] max-w-xl mx-auto leading-relaxed">
            We started WOCHA because we were tired of buying shirts and hoodies that lose their shape, shrink, or feel cheap after a few washes. We make clothes that you can wear every day without worrying about wear and tear.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#111111] text-white hover:bg-neutral-800 text-xs font-mono uppercase tracking-wider font-semibold rounded-lg transition-colors"
            >
              <span>Shop All Clothes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. What We Care About */}
      <section id="quality" className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 border-b border-[#EDEAE3]">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B]">
            How We Make Our Clothes
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Simple things we do differently
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#EDEAE3] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#EFECE6] flex items-center justify-center text-[#482922]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              Thick, Solid Cotton
            </h3>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              We only use thick, durable cotton. It holds its shape, feels heavy and soft in your hands, and never feels paper-thin or see-through.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#EDEAE3] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#EFECE6] flex items-center justify-center text-[#482922]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              Pre-Washed (No Shrinking)
            </h3>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              We wash all fabrics before stitching them together. That means the size you try on the first day is the same size it stays after 50 washes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#EDEAE3] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#EFECE6] flex items-center justify-center text-[#482922]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              Strong Seams &amp; Zippers
            </h3>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Double stitching on the necklines, shoulders, and pockets, plus heavy-duty metal zippers that will never jam or snap off.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Easy Shopping & Guarantee */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B]">
            Our Promise
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Try it on at home. 30 days to decide.
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-lg mx-auto leading-relaxed">
            If the fit isn&apos;t right, or if you simply change your mind, send it back within 30 days. We give you a full refund or swap it for another size with no questions asked.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="px-8 py-3.5 bg-[#111111] text-white hover:bg-neutral-800 text-xs font-mono uppercase tracking-wider font-bold rounded-lg transition-colors"
          >
            Start Shopping
          </Link>
          <Link
            href="/shop?category=hoodies"
            className="px-8 py-3.5 bg-white hairline-border text-[#111111] hover:bg-neutral-100 text-xs font-mono uppercase tracking-wider font-medium rounded-lg transition-colors"
          >
            Browse Hoodies
          </Link>
        </div>
      </section>
    </div>
  );
}
