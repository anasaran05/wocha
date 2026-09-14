'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Package, ArrowRight, Clock, Truck, CheckCircle2 } from 'lucide-react';

interface OrderItemSummary {
  id: string;
  orderNumber: string;
  status: string;
  placedAt: string;
  grandTotal: number;
  currency: string;
  itemsCount: number;
  awbNumber?: string;
}

const DEMO_ORDERS: OrderItemSummary[] = [
  {
    id: 'ord-demo-01',
    orderNumber: 'WOC-94812',
    status: 'out_for_delivery',
    placedAt: '2026-09-12T10:00:00Z',
    grandTotal: 395,
    currency: 'EUR',
    itemsCount: 2,
    awbNumber: 'WOC-482910',
  },
  {
    id: 'ord-demo-02',
    orderNumber: 'WOC-81729',
    status: 'delivered',
    placedAt: '2026-08-28T14:20:00Z',
    grandTotal: 185,
    currency: 'EUR',
    itemsCount: 1,
    awbNumber: 'DEL992182718',
  },
];

export default function AccountOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderItemSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        if (user?.id) {
          const supabase = getSupabaseClient();
          const { data, error } = await supabase
            .from('orders')
            .select(`
              id,
              order_number,
              status,
              placed_at,
              grand_total,
              currency,
              order_items ( id ),
              shipments ( awb_number )
            `)
            .eq('user_id', user.id)
            .order('placed_at', { ascending: false });

          if (!error && data && data.length > 0) {
            const mapped = data.map((o: any) => ({
              id: o.id,
              orderNumber: o.order_number,
              status: o.status,
              placedAt: o.placed_at,
              grandTotal: Number(o.grand_total),
              currency: o.currency || 'EUR',
              itemsCount: o.order_items?.length || 1,
              awbNumber: o.shipments?.[0]?.awb_number,
            }));
            setOrders(mapped);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fallback
      }

      setOrders(DEMO_ORDERS);
      setLoading(false);
    }

    loadOrders();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-medium">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case 'out_for_delivery':
      case 'dispatched':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-medium">
            <Truck className="w-3 h-3" /> In Transit
          </span>
        );
      case 'processing':
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded bg-amber-50 text-amber-700 font-medium">
            <Clock className="w-3 h-3" /> Atelier Prep
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded bg-neutral-100 text-neutral-700 font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-[#6B6B6B]">
        <Link href="/account" className="hover:text-[#111111]">Account</Link>
        <span>/</span>
        <span className="text-[#111111] font-semibold">Orders & Consignments</span>
      </nav>

      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B] block">
          Order Registry
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-[#111111]">
          Consignments & Tracking History
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-xl">
          Live milestone tracking, dispatch inspection, and digital receipt archives.
        </p>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="p-20 text-center font-mono text-xs text-[#6B6B6B]">
          Loading consignments...
        </div>
      ) : orders.length === 0 ? (
        <div className="p-16 text-center bg-white hairline-border rounded-xl space-y-4 max-w-md mx-auto">
          <p className="text-xs text-[#6B6B6B]">No recorded orders found for this patron.</p>
          <Link
            href="/shop"
            className="wocha-btn rounded-lg px-6 py-2.5 text-xs uppercase tracking-wider text-white inline-block"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white hairline-border rounded-xl p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-6 hover:border-black transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-bold text-[#111111]">
                    {order.orderNumber}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#6B6B6B]">
                  <span>Placed: {new Date(order.placedAt).toLocaleDateString()}</span>
                  <span>&bull;</span>
                  <span>{order.itemsCount} Garment(s)</span>
                  {order.awbNumber && (
                    <>
                      <span>&bull;</span>
                      <span className="text-[#111111] font-medium">AWB: {order.awbNumber}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 hairline-top sm:hairline-top-0 pt-4 sm:pt-0">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#6B6B6B] block uppercase tracking-wider">
                    Total Invoiced
                  </span>
                  <span className="font-mono text-base font-bold text-[#111111]">
                    €{order.grandTotal}
                  </span>
                </div>

                <Link
                  href={`/account/orders/${order.id}`}
                  className="wocha-btn rounded-lg px-4 py-2 text-xs uppercase tracking-wider text-white flex items-center gap-1.5"
                >
                  <span>Track Consignment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
