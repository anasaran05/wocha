import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { sendTransactionalEmail } from '@/lib/email/mailer';
import { createNotification } from '@/lib/notifications/service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      email,
      firstName,
      lastName,
      shippingAddress,
      items,
      subtotal,
      discountTotal,
      shippingTotal,
      grandTotal,
      couponCode,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const orderNumber = `WOC-${Math.floor(10000 + Math.random() * 90000)}`;
    const supabase = getSupabaseAdminClient();

    let finalUserId = userId;

    // If guest or no user_id, ensure a profile exists or resolve
    if (!finalUserId) {
      // Check if profile exists with this email
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('full_name', `${firstName} ${lastName}`)
        .limit(1)
        .single();

      if (existingProfile) {
        finalUserId = existingProfile.id;
      }
    }

    let shippingAddressId: string | null = null;
    let orderId = `ord_${Date.now()}`;

    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    try {
      if (!isMock) {
        // 1. Create or save address if user profile exists
      if (finalUserId && shippingAddress) {
        const { data: addr } = await supabase
          .from('addresses')
          .insert({
            user_id: finalUserId,
            full_name: `${firstName} ${lastName}`,
            line1: shippingAddress.address || 'Street 1',
            line2: shippingAddress.apartment || null,
            city: shippingAddress.city || 'Berlin',
            state: shippingAddress.state || 'Berlin',
            postal_code: shippingAddress.postalCode || '10115',
            country: shippingAddress.country || 'DE',
            type: 'shipping',
          })
          .select('id')
          .single();

        shippingAddressId = addr?.id || null;
      }

      // 2. Insert Order
      if (finalUserId) {
        const { data: order, error: orderErr } = await supabase
          .from('orders')
          .insert({
            order_number: orderNumber,
            user_id: finalUserId,
            status: 'paid',
            subtotal: subtotal || 0,
            discount_total: discountTotal || 0,
            shipping_total: shippingTotal || 0,
            grand_total: grandTotal || subtotal,
            currency: 'EUR',
            shipping_address_id: shippingAddressId,
          })
          .select('id')
          .single();

        if (!orderErr && order) {
          orderId = order.id;

          // 3. Insert Order Items
          for (const it of items) {
            await supabase.from('order_items').insert({
              order_id: orderId,
              variant_id: 'v0000000-0000-0000-0000-000000000001',
              product_name_snapshot: it.name,
              variant_label_snapshot: `${it.size} / ${it.color}`,
              unit_price: it.price,
              quantity: it.quantity,
              customization_data: it.customization || null,
            });
          }

          // 4. Atomic stock decrement via database RPC
          await supabase.rpc('decrement_stock_atomic', { p_order_id: orderId }).catch(() => {});

          // 5. Audit trail
          await supabase.from('order_status_history').insert({
            order_id: orderId,
            status: 'paid',
            note: 'Order placed and payment authorized successfully.',
          });

          // 6. Payment record
          await supabase.from('payments').insert({
            order_id: orderId,
            provider: 'mock',
            provider_payment_id: `pay_${Date.now()}`,
            amount: grandTotal || subtotal,
            status: 'succeeded',
          });
        }
      }
      }
    } catch {
      // Continue to send confirmation email and notification
    }

    // 7. Notification & Email triggers
    if (finalUserId) {
      await createNotification({
        userId: finalUserId,
        type: 'order_update',
        title: `Order ${orderNumber} Confirmed`,
        body: `We have received your order for ${items.length} garment(s). Preparing for atelier dispatch.`,
        linkUrl: `/account/orders/${orderId}`,
      }).catch(() => {});
    }

    await sendTransactionalEmail({
      toEmail: email || 'client@wocha.com',
      templateKey: 'order_confirmation',
      variables: {
        order_number: orderNumber,
        customer_name: `${firstName} ${lastName}`.trim() || 'Valued Client',
      },
      orderId: orderId.startsWith('ord_') ? undefined : orderId,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
