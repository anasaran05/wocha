'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function HomeNewsletter() {
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
  );
}
