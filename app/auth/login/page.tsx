'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // TODO: replace with Supabase Auth query:
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      // if (error) throw error;
      await login(email);
      router.push('/shop');
    } catch {
      setError('Unable to authenticate credentials. Please verify your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block">
          Client Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
          Sign In to WOCHA
        </h1>
        <p className="text-xs text-[#6B6B6B]">
          Access order histories, atelier custom designs, and expedited checkout.
        </p>
      </div>

      <div className="bg-white hairline-border rounded-xl p-8 space-y-6">
        {/* Backend Seam Banner */}
        <div className="p-3 bg-[#FAFAF8] hairline-border rounded-lg text-[11px] font-mono text-[#6B6B6B]">
          <span className="text-[#111111] font-semibold block mb-0.5">
            // Supabase Auth Integration Seam
          </span>
          Currently running mock client-side session. Any valid email will authenticate.
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-mono">
            {error}
          </div>
        )}

        {user ? (
          <div className="space-y-4 text-center">
            <p className="text-xs font-mono text-[#111111]">
              Currently authenticated as <strong>{user.email}</strong>
            </p>
            <Link href="/shop" className="w-full wocha-btn rounded-lg py-2.5 text-xs text-white block">
              Continue to Catalog
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase text-[#111111] block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@domain.com"
                className="w-full bg-[#FAFAF8] hairline-border rounded-md px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1">
                <label className="text-xs font-mono uppercase text-[#111111]">
                  Password
                </label>
                <span className="text-[10px] font-mono text-[#6B6B6B] cursor-pointer hover:underline">
                  Forgot Password?
                </span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#FAFAF8] hairline-border rounded-md px-3 py-2 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full wocha-btn rounded-lg py-3 text-xs uppercase tracking-wider text-white disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        <div className="hairline-top pt-4 text-center text-xs text-[#6B6B6B]">
          <span>Do not possess an account? </span>
          <Link
            href="/auth/signup"
            className="text-[#111111] font-semibold underline underline-offset-2"
          >
            Create Atelier Account
          </Link>
        </div>
      </div>
    </div>
  );
}
