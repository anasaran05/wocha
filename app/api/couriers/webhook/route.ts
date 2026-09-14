import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { ShipmentStatus } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-courier-signature') || '';
    const secret = process.env.COURIER_WEBHOOK_SECRET || 'wocha_webhook_secret_key';

    // Verify secret / signature if present
    if (signature && signature !== secret) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const payload = await request.json();
    const { awb_number, status, location, description, event_time } = payload;

    if (!awb_number || !status) {
      return NextResponse.json({ error: 'Missing awb_number or status' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    // 1. Find shipment
    const { data: shipment, error: shipErr } = await supabase
      .from('shipments')
      .select('id, order_id, status')
      .eq('awb_number', awb_number)
      .single();

    if (shipErr || !shipment) {
      // In dev or unseeded state, return acknowledged
      return NextResponse.json({ acknowledged: true, simulated: true });
    }

    const normalizedStatus = status.toLowerCase() as ShipmentStatus;

    // 2. Insert shipment tracking event
    await supabase.from('shipment_tracking_events').insert({
      shipment_id: shipment.id,
      status: normalizedStatus,
      location: location || null,
      description: description || `Package status updated to ${normalizedStatus}`,
      event_time: event_time || new Date().toISOString(),
    });

    // 3. Update shipment record
    await supabase
      .from('shipments')
      .update({ status: normalizedStatus })
      .eq('id', shipment.id);

    // 4. Update order status if final delivery status
    if (normalizedStatus === 'delivered') {
      await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('id', shipment.order_id);

      await supabase.from('order_status_history').insert({
        order_id: shipment.order_id,
        status: 'delivered',
        note: `Delivered by courier. Confirmed at ${location || 'Destination'}.`,
      });
    } else if (normalizedStatus === 'out_for_delivery') {
      await supabase
        .from('orders')
        .update({ status: 'out_for_delivery' })
        .eq('id', shipment.order_id);

      await supabase.from('order_status_history').insert({
        order_id: shipment.order_id,
        status: 'out_for_delivery',
        note: 'Courier is out for final delivery.',
      });
    }

    return NextResponse.json({ success: true, awb_number, status: normalizedStatus });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Webhook processing failed' }, { status: 500 });
  }
}
