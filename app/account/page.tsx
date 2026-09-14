'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth';
import { getSupabaseClient } from '@/lib/supabase/client';
import { User, MapPin, Package, ShieldCheck, Plus, Check } from 'lucide-react';

interface Address {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const { user, logout, isAdmin, isStaff } = useAuth();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newFullName, setNewFullName] = useState('');
  const [newLine1, setNewLine1] = useState('');
  const [newCity, setNewCity] = useState('Berlin');
  const [newState, setNewState] = useState('Berlin');
  const [newPostal, setNewPostal] = useState('10115');
  const [newCountry, setNewCountry] = useState('Germany');

  useEffect(() => {
    if (!user) return;
    async function loadAddresses() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user!.id);

        if (!error && data && data.length > 0) {
          setAddresses(
            data.map((a: any) => ({
              id: a.id,
              label: a.label,
              fullName: a.full_name,
              line1: a.line1,
              line2: a.line2,
              city: a.city,
              state: a.state,
              postalCode: a.postal_code,
              country: a.country,
              isDefault: a.is_default,
            }))
          );
        } else {
          // Default demo address
          setAddresses([
            {
              id: 'addr-demo',
              label: 'Primary Atelier Residence',
              fullName: user?.name || 'Patron Client',
              line1: 'Torstraße 140',
              city: 'Berlin',
              state: 'Berlin',
              postalCode: '10115',
              country: 'Germany',
              isDefault: true,
            },
          ]);
        }
      } catch {
        // Fallback
      }
    }
    loadAddresses();
  }, [user]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: Address = {
      id: `addr_${Date.now()}`,
      label: newLabel,
      fullName: newFullName || user?.name || 'Client',
      line1: newLine1,
      city: newCity,
      state: newState,
      postalCode: newPostal,
      country: newCountry,
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, newAddr]);
    setShowAddAddress(false);

    try {
      if (user?.id) {
        const supabase = getSupabaseClient();
        await supabase.from('addresses').insert({
          user_id: user.id,
          label: newLabel,
          full_name: newAddr.fullName,
          line1: newLine1,
          city: newCity,
          state: newState,
          postal_code: newPostal,
          country: newCountry,
          is_default: newAddr.isDefault,
        });
      }
    } catch {
      // Keep local state
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 hairline-bottom pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B]">
              Patron Profile & Atelier Credentials
            </span>
            {isAdmin && (
              <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 rounded font-bold tracking-wider">
                Administrator
              </span>
            )}
            {isStaff && !isAdmin && (
              <span className="text-[10px] font-mono uppercase bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded font-bold tracking-wider">
                Staff
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111111]">
            {user?.name || 'Atelier Client'}
          </h1>
          <p className="text-xs font-mono text-[#6B6B6B]">
            Registered email: {user?.email || 'client@wocha.com'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(isAdmin || isStaff) && (
            <Link
              href="/admin"
              className="wocha-btn rounded-lg px-4 py-2 text-xs uppercase tracking-wider text-white"
            >
              Enter Admin Portal &rarr;
            </Link>
          )}
          <button
            onClick={logout}
            className="wocha-btn-secondary rounded-lg px-4 py-2 text-xs uppercase tracking-wider text-[#111111] cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Account Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          href="/account/orders"
          className="p-6 bg-white hairline-border rounded-xl hover:border-black transition-colors space-y-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#FAFAF8] flex items-center justify-center text-[#111111] group-hover:bg-black group-hover:text-white transition-colors">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-[#111111]">Consignments & Orders</h3>
          <p className="text-xs text-[#6B6B6B]">
            Track dispatches, review historic order slips, and inspect AWB milestones.
          </p>
        </Link>

        <Link
          href="/wishlist"
          className="p-6 bg-white hairline-border rounded-xl hover:border-black transition-colors space-y-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#FAFAF8] flex items-center justify-center text-[#111111] group-hover:bg-black group-hover:text-white transition-colors">
            <User className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-[#111111]">Saved Archives</h3>
          <p className="text-xs text-[#6B6B6B]">
            Inspect reserved silhouettes and custom atelier garments saved to your registry.
          </p>
        </Link>

        <div className="p-6 bg-[#FAFAF8] hairline-border rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#111111]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-[#111111]">Security & Privileges</h3>
          <p className="text-xs text-[#6B6B6B]">
            Your session is secured with Supabase Auth cryptographic JWT tokens.
          </p>
        </div>
      </div>

      {/* Addresses Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#111111]">
              Saved Shipping Destinations
            </h2>
            <p className="text-xs text-[#6B6B6B]">
              Destinations used for automated customs and courier dispatch generation.
            </p>
          </div>
          <button
            onClick={() => setShowAddAddress(!showAddAddress)}
            className="wocha-btn rounded-lg px-3 py-1.5 text-xs font-mono uppercase text-white flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Address</span>
          </button>
        </div>

        {/* Add Address Form */}
        {showAddAddress && (
          <form
            onSubmit={handleAddAddress}
            className="p-6 bg-white hairline-border rounded-xl space-y-4 max-w-xl"
          >
            <h4 className="text-xs font-mono uppercase text-[#111111] font-semibold">
              Add New Dispatch Address
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                placeholder="Label (e.g. Studio, Home)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                required
                className="bg-[#FAFAF8] hairline-border rounded-lg p-2.5 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Recipient Full Name"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                required
                className="bg-[#FAFAF8] hairline-border rounded-lg p-2.5 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Address Line 1"
                value={newLine1}
                onChange={(e) => setNewLine1(e.target.value)}
                required
                className="sm:col-span-2 bg-[#FAFAF8] hairline-border rounded-lg p-2.5 focus:outline-none"
              />
              <input
                type="text"
                placeholder="City"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                required
                className="bg-[#FAFAF8] hairline-border rounded-lg p-2.5 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={newPostal}
                onChange={(e) => setNewPostal(e.target.value)}
                required
                className="bg-[#FAFAF8] hairline-border rounded-lg p-2.5 focus:outline-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="wocha-btn rounded-lg px-4 py-2 text-xs uppercase tracking-wider text-white"
              >
                Save Destination
              </button>
              <button
                type="button"
                onClick={() => setShowAddAddress(false)}
                className="wocha-btn-secondary rounded-lg px-4 py-2 text-xs uppercase tracking-wider text-[#111111]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Address Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-6 bg-white hairline-border rounded-xl space-y-3 relative"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#111111]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{addr.label}</span>
                </div>
                {addr.isDefault && (
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <Check className="w-3 h-3" /> Default
                  </span>
                )}
              </div>
              <div className="text-xs text-[#6B6B6B] space-y-0.5 font-mono">
                <div className="text-[#111111] font-medium">{addr.fullName}</div>
                <div>{addr.line1}</div>
                <div>
                  {addr.city}, {addr.state} {addr.postalCode}
                </div>
                <div>{addr.country}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
