'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('You must agree to the terms of service.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // TODO: replace with Supabase Auth query:
      // const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
      // if (error) throw error;
      await signup(name, email);
      router.push('/shop');
    } catch {
      setError('Registration could not be completed. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block">
          Client Registration
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
          Register Atelier Account
        </h1>
        <p className="text-xs text-[#6B6B6B]">
          Join the permanent archive. Enjoy early access to limited edition cuts.
        </p>
      </div>

      <div className="bg-white hairline-border rounded-xl p-8 space-y-6">
        {/* Backend Seam Banner */}
        <div className="p-3 bg-[#FAFAF8] hairline-border rounded-lg text-[11px] font-mono text-[#6B6B6B]">
          <span className="text-[#111111] font-semibold block mb-0.5">
            // Supabase Auth Integration Seam
          </span>
          Currently running mock client-side registration stub.
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase text-[#111111] block mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Elena R."
              className="w-full bg-[#FAFAF8] hairline-border rounded-md px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-[#111111] block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elena@domain.com"
              className="w-full bg-[#FAFAF8] hairline-border rounded-md px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-[#111111] block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#FAFAF8] hairline-border rounded-md px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
            />
          </div>

          <label className="flex items-start gap-2 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 accent-[#111111]"
            />
            <span className="text-[11px] text-[#6B6B6B] leading-tight">
              I consent to the Terms of Service and Privacy Policy for archival account creation.
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full wocha-btn rounded-lg py-3 text-xs uppercase tracking-wider text-white disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Registering Account...' : 'Create Account'}
          </button>
        </form>

        <div className="hairline-top pt-4 text-center text-xs text-[#6B6B6B]">
          <span>Already possess an account? </span>
          <Link
            href="/auth/login"
            className="text-[#111111] font-semibold underline underline-offset-2"
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
