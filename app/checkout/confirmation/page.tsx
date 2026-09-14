'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Package, Truck, ShieldCheck } from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'WOC-78291';
  const orderId = searchParams.get('orderId') || orderNumber;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-white hairline-border rounded-xl p-8 sm:p-12 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B6B6B] block">
              Payment Authorized & Order Created
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              Consignment Confirmed
            </h1>
          </div>
        </div>

        <div className="p-4 bg-[#FAFAF8] hairline-border rounded-lg space-y-2 font-mono text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[#6B6B6B] uppercase tracking-wider text-[11px]">Consignment ID</span>
            <strong className="text-sm text-[#111111]">{orderNumber}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#6B6B6B] uppercase tracking-wider text-[11px]">Dispatch Status</span>
            <span className="text-emerald-700 font-semibold">Allocated for Atelier Preparation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#FAFAF8] hairline-border rounded-lg space-y-1">
            <Package className="w-4 h-4 text-[#111111] mb-1" />
            <strong className="block text-[#111111]">Quality Inspection</strong>
            <p className="text-[#6B6B6B] text-[11px]">Each garment undergoes hand finishing and measure check.</p>
          </div>
          <div className="p-4 bg-[#FAFAF8] hairline-border rounded-lg space-y-1">
            <Truck className="w-4 h-4 text-[#111111] mb-1" />
            <strong className="block text-[#111111]">Courier Allocation</strong>
            <p className="text-[#6B6B6B] text-[11px]">Assigned to express logistics with live GPS milestone tracking.</p>
          </div>
          <div className="p-4 bg-[#FAFAF8] hairline-border rounded-lg space-y-1">
            <ShieldCheck className="w-4 h-4 text-[#111111] mb-1" />
            <strong className="block text-[#111111]">Transit Insurance</strong>
            <p className="text-[#6B6B6B] text-[11px]">All parcels are sealed in moisture-proof tamper evident casing.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href={`/account/orders/${orderId}`}
            className="wocha-btn rounded-lg px-6 py-3 text-xs uppercase tracking-wider text-white text-center flex items-center justify-center gap-2"
          >
            <span>Live Consignment Tracking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/shop"
            className="wocha-btn-secondary rounded-lg px-6 py-3 text-xs uppercase tracking-wider text-[#111111] text-center"
          >
            Return to Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-mono text-xs">Loading Order Confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
