'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase/client';
import { getCourierAdapter } from '@/lib/couriers';
import {
  ShoppingCart,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  FileText,
} from 'lucide-react';

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  grandTotal: number;
  currency: string;
  placedAt: string;
  courierName?: string;
  awbNumber?: string;
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'WOC-94812',
    customerName: 'Julian K.',
    customerEmail: 'julian@kramer.de',
    status: 'paid',
    grandTotal: 395,
    currency: 'EUR',
    placedAt: '2026-09-14T09:12:00Z',
  },
  {
    id: 'ord-102',
    orderNumber: 'WOC-78291',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@rostova.com',
    status: 'processing',
    grandTotal: 210,
    currency: 'EUR',
    placedAt: '2026-09-13T16:40:00Z',
  },
  {
    id: 'ord-103',
    orderNumber: 'WOC-62118',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus@vance.io',
    status: 'dispatched',
    grandTotal: 185,
    currency: 'EUR',
    placedAt: '2026-09-12T11:20:00Z',
    courierName: 'Delhivery',
    awbNumber: 'DEL884920194',
  },
  {
    id: 'ord-104',
    orderNumber: 'WOC-48201',
    customerName: 'Sophie Moreau',
    customerEmail: 'sophie@moreau.fr',
    status: 'delivered',
    grandTotal: 520,
    currency: 'EUR',
    placedAt: '2026-09-10T14:15:00Z',
    courierName: 'Shiprocket',
    awbNumber: 'SR482910382',
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [selectedCourier, setSelectedCourier] = useState('Delhivery');
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            order_number,
            status,
            grand_total,
            currency,
            placed_at,
            profiles ( full_name ),
            shipments (
              awb_number,
              couriers ( name )
            )
          `)
          .order('placed_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map((o: any) => ({
            id: o.id,
            orderNumber: o.order_number,
            customerName: o.profiles?.full_name || 'Client',
            customerEmail: 'patron@wocha.com',
            status: o.status,
            grandTotal: Number(o.grand_total),
            currency: o.currency || 'EUR',
            placedAt: o.placed_at,
            courierName: o.shipments?.[0]?.couriers?.name,
            awbNumber: o.shipments?.[0]?.awb_number,
          }));
          setOrders(mapped);
        }
      } catch {
        // Fallback
      }
    }
    loadOrders();
  }, []);

  const handleDispatchAndAssignCourier = async (orderId: string) => {
    setIsAssigning(true);
    const adapter = getCourierAdapter(selectedCourier);

    const shipmentResult = await adapter.createShipment({
      orderId,
      orderNumber: selectedOrder?.orderNumber || 'WOC-94812',
      shippingAddress: {
        fullName: selectedOrder?.customerName || 'Client',
        line1: 'Torstraße 140',
        city: 'Berlin',
        state: 'Berlin',
        postalCode: '10115',
        country: 'Germany',
      },
      totalWeightGrams: 850,
      totalAmount: selectedOrder?.grandTotal || 185,
      currency: 'EUR',
      itemsCount: 1,
    });

    // Update local state
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'dispatched',
              courierName: shipmentResult.courierName,
              awbNumber: shipmentResult.awbNumber,
            }
          : o
      )
    );

    if (selectedOrder) {
      setSelectedOrder({
        ...selectedOrder,
        status: 'dispatched',
        courierName: shipmentResult.courierName,
        awbNumber: shipmentResult.awbNumber,
      });
    }

    setIsAssigning(false);
  };

  const filtered = filterStatus === 'all' ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B6B6B] block">
            Fulfillment Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Order Queue & Logistics Dispatch
          </h1>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white hairline-border rounded-xl font-mono text-xs max-w-2xl">
        {['all', 'paid', 'processing', 'dispatched', 'delivered'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer ${
              filterStatus === st ? 'bg-[#111111] text-white font-bold' : 'text-[#6B6B6B] hover:text-[#111111]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl hairline-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#FAFAF8] hairline-bottom text-[#6B6B6B]">
              <tr>
                <th className="p-4 font-medium">Consignment</th>
                <th className="p-4 font-medium">Patron</th>
                <th className="p-4 font-medium">Date Placed</th>
                <th className="p-4 font-medium">Invoice</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Courier AWB</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DD]">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#FAFAF8]/50">
                  <td className="p-4 font-bold text-[#111111]">{ord.orderNumber}</td>
                  <td className="p-4">
                    <div className="text-[#111111] font-medium">{ord.customerName}</div>
                    <div className="text-[10px] text-[#6B6B6B]">{ord.customerEmail}</div>
                  </td>
                  <td className="p-4 text-[#6B6B6B]">
                    {new Date(ord.placedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-semibold text-[#111111]">€{ord.grandTotal}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded uppercase text-[10px] font-bold ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : ord.status === 'dispatched'
                          ? 'bg-blue-50 text-blue-700'
                          : ord.status === 'processing'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#6B6B6B]">
                    {ord.awbNumber ? (
                      <span className="font-semibold text-[#111111]">
                        {ord.courierName}: {ord.awbNumber}
                      </span>
                    ) : (
                      <span className="text-[#9E9E9E] italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1 rounded bg-[#FAFAF8] hairline-border text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT / ASSIGN COURIER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl hairline-border max-w-lg w-full p-6 space-y-6">
            <div className="flex justify-between items-start hairline-bottom pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#6B6B6B] uppercase tracking-wider block">
                  Consignment Inspector
                </span>
                <h3 className="text-lg font-bold text-[#111111]">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-xs font-mono text-[#6B6B6B] hover:text-black"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Customer:</span>
                <span className="text-[#111111] font-semibold">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Invoice Total:</span>
                <span className="text-[#111111] font-semibold">€{selectedOrder.grandTotal}</span>
              </div>
              <div className="flex justify-between text-[#6B6B6B]">
                <span>Status:</span>
                <span className="uppercase font-bold text-[#111111]">{selectedOrder.status}</span>
              </div>
              {selectedOrder.awbNumber && (
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Active Consignment AWB:</span>
                  <span className="text-blue-700 font-bold">{selectedOrder.awbNumber}</span>
                </div>
              )}
            </div>

            {/* Courier Assignment & Dispatch Box */}
            <div className="p-4 bg-[#FAFAF8] hairline-border rounded-lg space-y-3 font-mono text-xs">
              <h4 className="font-bold text-[#111111] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Courier Allocation & AWB Generation
              </h4>
              <p className="text-[11px] text-[#6B6B6B]">
                Assign courier partner to generate digital shipping manifest and start live tracking timeline.
              </p>

              <div className="flex items-center gap-2">
                <select
                  value={selectedCourier}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  className="bg-white hairline-border rounded-lg p-2 text-xs flex-1 focus:outline-none"
                >
                  <option value="Delhivery">Delhivery Logistics</option>
                  <option value="Shiprocket">Shiprocket Air</option>
                  <option value="DTDC">DTDC Express</option>
                  <option value="Mock">WOCHA Atelier Express</option>
                </select>

                <button
                  onClick={() => handleDispatchAndAssignCourier(selectedOrder.id)}
                  disabled={isAssigning}
                  className="wocha-btn rounded-lg px-4 py-2 text-xs uppercase tracking-wider text-white"
                >
                  {isAssigning ? 'Generating...' : 'Dispatch'}
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Link
                href={`/account/orders/${selectedOrder.id}`}
                target="_blank"
                className="text-xs font-mono underline text-[#111111] flex items-center gap-1"
              >
                <span>View Customer Tracking View</span>
                <span>&rarr;</span>
              </Link>

              <button
                onClick={() => setSelectedOrder(null)}
                className="wocha-btn-secondary rounded-lg px-4 py-2 text-xs uppercase tracking-wider text-[#111111]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
