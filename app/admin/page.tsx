'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase/client';
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Users,
  ArrowUpRight,
  Package,
  Layers,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState({
    grossRevenue: 48920,
    totalOrders: 214,
    conversionRate: 3.4,
    lowStockCount: 3,
  });

  const [lowStockVariants, setLowStockVariants] = useState([
    { id: 'v1', name: '01 Heavyweight Boxy Hoodie', variant: 'L / Pitch Black', stock: 2, threshold: 5 },
    { id: 'v2', name: '02 Atelier Zip Pullover', variant: 'XL / Washed Charcoal', stock: 1, threshold: 5 },
    { id: 'v3', name: '01 Heavy Boxy Tee', variant: 'S / Raw Ecru', stock: 3, threshold: 5 },
  ]);

  const [ordersByStatus, setOrdersByStatus] = useState([
    { status: 'Paid / Prep', count: 18, color: 'bg-amber-500' },
    { status: 'Dispatched', count: 42, color: 'bg-blue-500' },
    { status: 'Out For Delivery', count: 12, color: 'bg-indigo-500' },
    { status: 'Delivered', count: 138, color: 'bg-emerald-500' },
    { status: 'Cancelled / Refunded', count: 4, color: 'bg-red-400' },
  ]);

  const [funnel, setFunnel] = useState([
    { step: 'Catalog Browsing Sessions', count: 8420, pct: '100%' },
    { step: 'Cart Additions', count: 1180, pct: '14.0%' },
    { step: 'Initiated Checkouts', count: 540, pct: '6.4%' },
    { step: 'Paid & Fulfilled Consignments', count: 214, pct: '2.5%' },
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] block">
            Executive Command
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Platform Analytics & Operations
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/catalog"
            className="wocha-btn rounded-lg px-4 py-2 text-xs uppercase tracking-wider text-white"
          >
            + Add New Garment
          </Link>
          <Link
            href="/admin/orders"
            className="wocha-btn-secondary rounded-lg px-4 py-2 text-xs uppercase tracking-wider text-[#111111]"
          >
            Manage Consignments
          </Link>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl hairline-border space-y-2">
          <div className="flex justify-between items-center text-[#6B6B6B]">
            <span className="text-xs font-mono uppercase tracking-wider">Gross Invoiced</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[#111111]">€{metrics.grossRevenue.toLocaleString()}</div>
          <span className="text-[11px] font-mono text-emerald-700 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +18.4% month-over-month
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl hairline-border space-y-2">
          <div className="flex justify-between items-center text-[#6B6B6B]">
            <span className="text-xs font-mono uppercase tracking-wider">Total Consignments</span>
            <ShoppingBag className="w-4 h-4 text-[#111111]" />
          </div>
          <div className="text-2xl font-bold text-[#111111]">{metrics.totalOrders}</div>
          <span className="text-[11px] font-mono text-[#6B6B6B]">
            Across European & Global destinations
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl hairline-border space-y-2">
          <div className="flex justify-between items-center text-[#6B6B6B]">
            <span className="text-xs font-mono uppercase tracking-wider">Funnel Conversion</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-[#111111]">{metrics.conversionRate}%</div>
          <span className="text-[11px] font-mono text-[#6B6B6B]">
            Cart-to-paid checkout efficiency
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl hairline-border space-y-2">
          <div className="flex justify-between items-center text-[#6B6B6B]">
            <span className="text-xs font-mono uppercase tracking-wider">Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{metrics.lowStockCount} Variants</div>
          <span className="text-[11px] font-mono text-[#6B6B6B]">
            Below minimum atelier threshold (5)
          </span>
        </div>
      </div>

      {/* Middle Grid: Conversion Funnel + Orders by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conversion Funnel */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 hairline-border space-y-6">
          <div className="flex justify-between items-center hairline-bottom pb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                Atelier Conversion Funnel
              </h3>
              <p className="text-xs text-[#6B6B6B]">Session progression from discovery to paid invoice.</p>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
              High Intent
            </span>
          </div>

          <div className="space-y-4">
            {funnel.map((step, idx) => (
              <div key={idx} className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-[#111111]">
                  <span>{step.step}</span>
                  <span className="font-semibold">{step.count.toLocaleString()} ({step.pct})</span>
                </div>
                <div className="w-full h-2 bg-[#FAFAF8] rounded-full overflow-hidden hairline-border">
                  <div
                    className="h-full bg-[#111111] rounded-full transition-all duration-700"
                    style={{ width: step.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consignment Status Breakdown */}
        <div className="bg-white rounded-xl p-6 hairline-border space-y-6">
          <div className="hairline-bottom pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
              Orders by Status
            </h3>
            <p className="text-xs text-[#6B6B6B]">Live consignment pipeline distribution.</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {ordersByStatus.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded bg-[#FAFAF8]">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-[#111111]">{item.status}</span>
                </div>
                <strong className="text-[#111111]">{item.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Low Stock Alert Table + Quick Ops */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 hairline-border space-y-4">
          <div className="flex justify-between items-center hairline-bottom pb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
                Critical Inventory Thresholds
              </h3>
            </div>
            <Link href="/admin/catalog" className="text-xs font-mono text-[#111111] underline">
              Manage Variants &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="text-[#6B6B6B] hairline-bottom">
                  <th className="pb-3 font-medium">Garment</th>
                  <th className="pb-3 font-medium">Variant</th>
                  <th className="pb-3 font-medium text-center">Remaining</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E3DD]">
                {lowStockVariants.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 font-medium text-[#111111]">{item.name}</td>
                    <td className="py-3 text-[#6B6B6B]">{item.variant}</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">
                        {item.stock} left
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-[11px] underline text-[#111111] cursor-pointer">
                        Restock +20
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operations Panel */}
        <div className="bg-white rounded-xl p-6 hairline-border space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111] hairline-bottom pb-4">
            Logistics & Marketing Actions
          </h3>
          <div className="space-y-2">
            <Link
              href="/admin/marketing"
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[#FAFAF8] hover:bg-[#111111] hover:text-white transition-colors group text-xs font-mono"
            >
              <span>Broadcast Patron Notice</span>
              <span className="text-[#6B6B6B] group-hover:text-white">&rarr;</span>
            </Link>
            <Link
              href="/admin/logistics"
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[#FAFAF8] hover:bg-[#111111] hover:text-white transition-colors group text-xs font-mono"
            >
              <span>Audit Courier Exception Logs</span>
              <span className="text-[#6B6B6B] group-hover:text-white">&rarr;</span>
            </Link>
            <Link
              href="/admin/customers"
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[#FAFAF8] hover:bg-[#111111] hover:text-white transition-colors group text-xs font-mono"
            >
              <span>Moderate Pending Reviews</span>
              <span className="text-[#6B6B6B] group-hover:text-white">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
