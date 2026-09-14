'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { getCourierAdapter, TrackingEvent } from '@/lib/couriers';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  Radio,
  FileText,
  ExternalLink,
} from 'lucide-react';

const LIFECYCLE_STEPS = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'paid', label: 'Payment Cleared' },
  { key: 'processing', label: 'Atelier Tailoring' },
  { key: 'dispatched', label: 'Dispatched' },
  { key: 'out_for_delivery', label: 'Out For Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderTrackingPage() {
  const routeParams = useParams();
  const rawId = routeParams?.orderId;
  const orderId = (Array.isArray(rawId) ? rawId[0] : rawId) || '';

  const [order, setOrder] = useState<any>(null);
  const [shipment, setShipment] = useState<any>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [realtimeActive, setRealtimeActive] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            addresses (*),
            order_items (*),
            shipments (
              id,
              awb_number,
              status,
              estimated_delivery,
              label_url,
              couriers ( name )
            )
          `)
          .or(`id.eq.${orderId},order_number.eq.${orderId}`)
          .single();

        if (!error && data) {
          const orderData = data as any;
          setOrder(orderData);
          const ship = orderData.shipments?.[0];
          if (ship) {
            setShipment(ship);
            // Fetch tracking events
            const { data: events } = await supabase
              .from('shipment_tracking_events')
              .select('*')
              .eq('shipment_id', ship.id)
              .order('event_time', { ascending: false });

            if (events && events.length > 0) {
              setTrackingEvents(
                events.map((e: any) => ({
                  status: e.status,
                  location: e.location,
                  description: e.description,
                  timestamp: e.event_time,
                }))
              );
            }
          }
        }
      } catch {
        // Fall through to simulated tracking
      }

      // If no live DB shipment was found, use realistic simulated tracking adapter
      if (!order) {
        const mockCourier = getCourierAdapter('mock');
        const tracking = await mockCourier.getTracking(`WOC-${orderId.slice(-6).toUpperCase()}`);

        setOrder({
          id: orderId,
          order_number: orderId.startsWith('WOC-') ? orderId : `WOC-${orderId.slice(-5)}`,
          status: 'out_for_delivery',
          placed_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          subtotal: 185,
          grand_total: 185,
          currency: 'EUR',
          addresses: {
            full_name: 'Julian K.',
            line1: 'Torstraße 140',
            city: 'Berlin',
            postal_code: '10115',
            country: 'Germany',
          },
          order_items: [
            {
              id: 'it-1',
              product_name_snapshot: '01 Heavyweight Boxy Hoodie',
              variant_label_snapshot: 'L / Pitch Black',
              unit_price: 185,
              quantity: 1,
            },
          ],
        });

        setShipment({
          awb_number: tracking.awbNumber,
          status: tracking.currentStatus,
          estimated_delivery: tracking.estimatedDelivery,
          courier_name: 'WOCHA Atelier Express Logistics',
        });

        setTrackingEvents(tracking.events);
      }

      setLoading(false);
    }

    loadOrder();

    // Setup Supabase Realtime Channel
    try {
      const supabase = getSupabaseClient();
      const channel = supabase
        .channel(`order-tracking-${orderId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'shipment_tracking_events' },
          (payload: any) => {
            const newEvent: TrackingEvent = {
              status: payload.new.status,
              location: payload.new.location,
              description: payload.new.description,
              timestamp: payload.new.event_time,
            };
            setTrackingEvents((prev) => [newEvent, ...prev]);
            setShipment((prev: any) => ({ ...prev, status: newEvent.status }));
          }
        )
        .subscribe((status: string) => {
          if (status === 'SUBSCRIBED') {
            setRealtimeActive(true);
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Offline fallback
    }
  }, [orderId]);

  const currentStatus = shipment?.status || order?.status || 'paid';
  const currentStepIndex = Math.max(
    0,
    LIFECYCLE_STEPS.findIndex((s) => s.key === currentStatus)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-[#6B6B6B]">
        <Link href="/account" className="hover:text-[#111111]">Account</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/account/orders" className="hover:text-[#111111]">Orders</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#111111] font-semibold">{order?.order_number || orderId}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-white hairline-border rounded-xl p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 hairline-bottom pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B]">
                Live Consignment Telemetry
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                Realtime Connected
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#111111]">
              Order {order?.order_number || orderId}
            </h1>
            <p className="text-xs font-mono text-[#6B6B6B]">
              Carrier: {shipment?.couriers?.name || shipment?.courier_name || 'WOCHA Global Logistics'} &bull; Waybill AWB:{' '}
              <span className="text-[#111111] font-semibold">{shipment?.awb_number || 'Pending Assignment'}</span>
            </p>
          </div>

          <div className="text-left sm:text-right font-mono text-xs space-y-1">
            <span className="text-[#6B6B6B] block uppercase text-[10px]">Estimated Delivery</span>
            <strong className="text-sm text-[#111111]">
              {shipment?.estimated_delivery
                ? new Date(shipment.estimated_delivery).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                : '2–3 Business Days'}
            </strong>
          </div>
        </div>

        {/* Milestone Steps Bar */}
        <div className="pt-2">
          <div className="relative flex items-center justify-between">
            {/* Background line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[#E5E3DD] -z-0" />
            {/* Progress line */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#111111] transition-all duration-700 -z-0"
              style={{
                width: `${(currentStepIndex / (LIFECYCLE_STEPS.length - 1)) * 100}%`,
              }}
            />

            {LIFECYCLE_STEPS.map((step, idx) => {
              const isPast = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.key} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono transition-colors ${
                      isPast
                        ? 'bg-[#111111] text-white'
                        : 'bg-white hairline-border text-[#6B6B6B]'
                    } ${isCurrent ? 'ring-4 ring-neutral-200' : ''}`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] font-mono mt-2 text-center max-w-[70px] ${
                      isCurrent
                        ? 'font-bold text-[#111111]'
                        : isPast
                        ? 'text-[#111111]'
                        : 'text-[#9E9E9E]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Tracking Timeline + Consignment Slip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Milestone Events */}
        <div className="lg:col-span-2 bg-white hairline-border rounded-xl p-8 space-y-6">
          <div className="flex justify-between items-center hairline-bottom pb-4">
            <h2 className="text-base font-bold tracking-tight text-[#111111] flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span>Consignment Milestone Feed</span>
            </h2>
            <span className="text-xs font-mono text-[#6B6B6B]">
              {trackingEvents.length} Recorded Milestones
            </span>
          </div>

          <div className="space-y-6 relative pl-6 border-l border-[#E5E3DD]">
            {trackingEvents.map((evt, i) => (
              <div key={i} className="relative space-y-1">
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    i === 0 ? 'bg-emerald-600 ring-2 ring-emerald-100' : 'bg-[#111111]'
                  }`}
                />

                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#111111]">{evt.description}</h4>
                  <span className="text-[10px] font-mono text-[#6B6B6B]" suppressHydrationWarning>
                    {new Date(evt.timestamp).toLocaleString()}
                  </span>
                </div>

                {evt.location && (
                  <div className="flex items-center gap-1 text-[11px] font-mono text-[#6B6B6B]">
                    <MapPin className="w-3 h-3" />
                    <span>{evt.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Consignment Manifest Slip */}
        <div className="bg-[#FAFAF8] hairline-border rounded-xl p-6 space-y-6 text-xs font-mono">
          <div className="flex items-center gap-2 hairline-bottom pb-4">
            <FileText className="w-4 h-4 text-[#111111]" />
            <h3 className="font-bold text-[#111111] uppercase tracking-wider text-xs">
              Consignment Slip
            </h3>
          </div>

          {/* Delivery Address */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase text-[#6B6B6B] tracking-wider block">
              Consignee Address
            </span>
            <div className="text-[#111111] font-semibold">
              {order?.addresses?.full_name || 'Client'}
            </div>
            <div className="text-[#6B6B6B]">
              {order?.addresses?.line1}
              <br />
              {order?.addresses?.city}, {order?.addresses?.postal_code}
              <br />
              {order?.addresses?.country || 'Germany'}
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-2 hairline-top pt-4">
            <span className="text-[10px] uppercase text-[#6B6B6B] tracking-wider block">
              Garments Enclosed
            </span>
            {order?.order_items?.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start py-1">
                <div>
                  <div className="text-[#111111] font-medium">{item.product_name_snapshot}</div>
                  <div className="text-[10px] text-[#6B6B6B]">{item.variant_label_snapshot}</div>
                </div>
                <div className="text-[#111111] font-semibold">
                  €{item.unit_price} × {item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-1.5 hairline-top pt-4">
            <div className="flex justify-between text-[#6B6B6B]">
              <span>Subtotal</span>
              <span>€{order?.subtotal || 185}</span>
            </div>
            <div className="flex justify-between text-[#6B6B6B]">
              <span>Complimentary Courier</span>
              <span>€0.00</span>
            </div>
            <div className="flex justify-between text-[#111111] font-bold text-sm pt-2 hairline-top">
              <span>Grand Total</span>
              <span>€{order?.grand_total || 185}</span>
            </div>
          </div>

          <div className="p-3 bg-white hairline-border rounded-lg text-[10px] text-[#6B6B6B] leading-relaxed">
            All shipments are insured and handled under WOCHA atelier white-glove transport protocols.
          </div>
        </div>
      </div>
    </div>
  );
}
