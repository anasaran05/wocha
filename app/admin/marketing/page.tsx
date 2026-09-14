'use client';

import React, { useState } from 'react';
import { Megaphone, Ticket, Image as ImageIcon, Mail, Plus, Send } from 'lucide-react';
import { createNotification } from '@/lib/notifications/service';

export default function AdminMarketingPage() {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'coupons' | 'banners' | 'emails'>('broadcast');

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastChannel, setBroadcastChannel] = useState<'in_app' | 'email'>('in_app');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Coupons state
  const [coupons, setCoupons] = useState([
    { code: 'WOCHA10', type: 'percent', value: 10, minOrder: 50, usageCount: 42, active: true },
    { code: 'STUDIO20', type: 'percent', value: 20, minOrder: 100, usageCount: 18, active: true },
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(75);

  // Banners state
  const [banners, setBanners] = useState([
    {
      id: 'b1',
      title: 'Collection 04 — Permanent Index',
      placement: 'home_hero',
      linkUrl: '/shop',
      active: true,
    },
    {
      id: 'b2',
      title: 'Atelier Custom Studio Open',
      placement: 'category_top',
      linkUrl: '/custom-studio',
      active: true,
    },
  ]);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    await createNotification({
      userId: null, // Broadcast to all
      type: 'promo',
      title: broadcastTitle,
      body: broadcastBody,
      linkUrl: '/shop',
    });
    setBroadcastSent(true);
    setBroadcastTitle('');
    setBroadcastBody('');
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    setCoupons([
      ...coupons,
      {
        code: newCouponCode.toUpperCase(),
        type: 'percent',
        value: newCouponValue,
        minOrder: newCouponMin,
        usageCount: 0,
        active: true,
      },
    ]);
    setNewCouponCode('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] block">
          Client Engagement
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
          Marketing, Broadcasts & Promos
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 hairline-bottom pb-4 font-mono text-xs">
        <button
          onClick={() => setActiveTab('broadcast')}
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === 'broadcast'
              ? 'border-b-2 border-black font-bold text-[#111111]'
              : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          Broadcast Composer
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === 'coupons'
              ? 'border-b-2 border-black font-bold text-[#111111]'
              : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          Discount Coupons ({coupons.length})
        </button>
        <button
          onClick={() => setActiveTab('banners')}
          className={`pb-2 transition-colors cursor-pointer ${
            activeTab === 'banners'
              ? 'border-b-2 border-black font-bold text-[#111111]'
              : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          Storefront Banners ({banners.length})
        </button>
      </div>

      {/* TAB 1: BROADCAST COMPOSER */}
      {activeTab === 'broadcast' && (
        <div className="bg-white p-8 rounded-xl hairline-border space-y-6 max-w-xl">
          <div className="space-y-1 hairline-bottom pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              <span>Compose Patron Notification Broadcast</span>
            </h3>
            <p className="text-xs text-[#6B6B6B]">
              Dispatches global in-app notifications and queues transactional messages across client sessions.
            </p>
          </div>

          {broadcastSent && (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-mono">
              &check; Broadcast notification dispatched successfully to all patron sessions.
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase block mb-1">
                Notice Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Atelier Drop 05 Announced"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full bg-[#FAFAF8] hairline-border rounded-lg p-2.5 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#6B6B6B] uppercase block mb-1">
                Notice Body
              </label>
              <textarea
                required
                rows={4}
                placeholder="Enter communique detailing new heavyweight textiles and form studies..."
                value={broadcastBody}
                onChange={(e) => setBroadcastBody(e.target.value)}
                className="w-full bg-[#FAFAF8] hairline-border rounded-lg p-2.5 focus:outline-none"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="ch"
                  checked={broadcastChannel === 'in_app'}
                  onChange={() => setBroadcastChannel('in_app')}
                />
                <span>In-App Realtime Notification</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="ch"
                  checked={broadcastChannel === 'email'}
                  onChange={() => setBroadcastChannel('email')}
                />
                <span>In-App + Transactional Email</span>
              </label>
            </div>

            <button
              type="submit"
              className="wocha-btn rounded-lg px-6 py-2.5 text-xs uppercase tracking-wider text-white flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast to All Patrons</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddCoupon}
            className="p-6 bg-white rounded-xl hairline-border space-y-4 max-w-xl font-mono text-xs"
          >
            <h4 className="font-bold text-[#111111] uppercase tracking-wider text-xs">
              Generate New Promotional Coupon
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase block mb-1">Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP25"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full bg-[#FAFAF8] hairline-border rounded-lg p-2 focus:outline-none uppercase"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase block mb-1">Discount (%)</label>
                <input
                  type="number"
                  required
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(Number(e.target.value))}
                  className="w-full bg-[#FAFAF8] hairline-border rounded-lg p-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#6B6B6B] uppercase block mb-1">Min Order (€)</label>
                <input
                  type="number"
                  required
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  className="w-full bg-[#FAFAF8] hairline-border rounded-lg p-2 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="wocha-btn rounded-lg px-4 py-2 text-xs uppercase tracking-wider text-white"
            >
              Create Coupon
            </button>
          </form>

          <div className="bg-white rounded-xl hairline-border overflow-hidden">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#FAFAF8] hairline-bottom text-[#6B6B6B]">
                <tr>
                  <th className="p-4 font-medium">Coupon Code</th>
                  <th className="p-4 font-medium">Discount</th>
                  <th className="p-4 font-medium">Min Order</th>
                  <th className="p-4 font-medium">Total Redemptions</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E3DD]">
                {coupons.map((c) => (
                  <tr key={c.code}>
                    <td className="p-4 font-bold text-[#111111]">{c.code}</td>
                    <td className="p-4 font-semibold text-[#111111]">{c.value}% OFF</td>
                    <td className="p-4 text-[#6B6B6B]">€{c.minOrder}</td>
                    <td className="p-4 text-[#6B6B6B]">{c.usageCount} orders</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BANNERS */}
      {activeTab === 'banners' && (
        <div className="bg-white rounded-xl p-6 hairline-border space-y-4">
          <div className="flex justify-between items-center hairline-bottom pb-4 font-mono text-xs">
            <h3 className="font-bold text-[#111111] uppercase tracking-wider">
              Active Storefront Banners
            </h3>
            <span className="text-[#6B6B6B]">{banners.length} Scheduled</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {banners.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-[#FAFAF8] hairline-border rounded-xl flex justify-between items-center"
              >
                <div>
                  <strong className="text-[#111111] block">{b.title}</strong>
                  <span className="text-[10px] text-[#6B6B6B]">
                    Placement: {b.placement} &bull; Target: {b.linkUrl}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
