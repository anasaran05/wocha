-- ============================================================================
-- 002_rls_policies_and_functions.sql
-- Row Level Security (RLS) Policies & Database Functions
-- ============================================================================

-- ============================================================================
-- 1. HELPER FUNCTIONS & TRIGGERS
-- ============================================================================

-- Check if current authenticated user has administrative privileges
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    current_role user_role;
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;

    SELECT role INTO current_role
    FROM public.profiles
    WHERE id = auth.uid();

    RETURN current_role IN ('admin', 'staff');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create a profile when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        'customer'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url;

    -- Also automatically create an empty wishlist
    INSERT INTO public.wishlists (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Hook into auth.users (if running on Supabase)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atomic inventory decrement with row-level locks on product_variants
CREATE OR REPLACE FUNCTION public.decrement_stock_atomic(p_order_id UUID)
RETURNS VOID AS $$
DECLARE
    item RECORD;
    v_stock INT;
    v_threshold INT := 5;
BEGIN
    FOR item IN
        SELECT oi.variant_id, oi.quantity, p.name AS product_name
        FROM public.order_items oi
        JOIN public.product_variants pv ON pv.id = oi.variant_id
        JOIN public.products p ON p.id = pv.product_id
        WHERE oi.order_id = p_order_id
    LOOP
        -- Lock row for update to prevent race conditions
        SELECT stock_quantity INTO v_stock
        FROM public.product_variants
        WHERE id = item.variant_id
        FOR UPDATE;

        IF v_stock < item.quantity THEN
            RAISE EXCEPTION 'Insufficient stock for % (Available: %, Requested: %)', item.product_name, v_stock, item.quantity;
        END IF;

        UPDATE public.product_variants
        SET stock_quantity = stock_quantity - item.quantity
        WHERE id = item.variant_id;

        -- Check low stock threshold
        IF (v_stock - item.quantity) <= v_threshold THEN
            INSERT INTO public.inventory_alerts (variant_id, threshold)
            VALUES (item.variant_id, v_threshold);
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update shipment status and emit customer notification upon tracking event
CREATE OR REPLACE FUNCTION public.handle_shipment_tracking_event()
RETURNS TRIGGER AS $$
DECLARE
    v_order_id UUID;
    v_user_id UUID;
    v_order_num TEXT;
BEGIN
    -- Update parent shipment status
    UPDATE public.shipments
    SET status = NEW.status
    WHERE id = NEW.shipment_id
    RETURNING order_id INTO v_order_id;

    -- Look up order details
    SELECT o.user_id, o.order_number
    INTO v_user_id, v_order_num
    FROM public.orders o
    WHERE o.id = v_order_id;

    -- If status transitioned, update order status history and add notification
    IF v_user_id IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, type, title, body, link_url)
        VALUES (
            v_user_id,
            'order_update',
            'Shipment Update: Order #' || v_order_num,
            NEW.description || ' (' || COALESCE(NEW.location, 'Hub') || ')',
            '/account/orders/' || v_order_id
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_tracking_event_inserted ON public.shipment_tracking_events;
CREATE TRIGGER on_tracking_event_inserted
    AFTER INSERT ON public.shipment_tracking_events
    FOR EACH ROW EXECUTE FUNCTION public.handle_shipment_tracking_event();

-- ============================================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variant_attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customization_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_alerts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. RLS POLICIES
-- ============================================================================

-- PROFILES
CREATE POLICY "Public profiles are viewable by owner or admin"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin());

-- ADDRESSES
CREATE POLICY "Users can view own addresses"
    ON public.addresses FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own addresses"
    ON public.addresses FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can update/delete own addresses"
    ON public.addresses FOR ALL
    USING (auth.uid() = user_id OR public.is_admin());

-- CATALOG (Public read, admin full write)
CREATE POLICY "Public read active categories" ON public.categories FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admin write categories" ON public.categories FOR ALL USING (public.is_admin());

CREATE POLICY "Public read attributes" ON public.attributes FOR SELECT USING (TRUE);
CREATE POLICY "Admin write attributes" ON public.attributes FOR ALL USING (public.is_admin());

CREATE POLICY "Public read category_attributes" ON public.category_attributes FOR SELECT USING (TRUE);
CREATE POLICY "Admin write category_attributes" ON public.category_attributes FOR ALL USING (public.is_admin());

CREATE POLICY "Public read attribute_values" ON public.attribute_values FOR SELECT USING (TRUE);
CREATE POLICY "Admin write attribute_values" ON public.attribute_values FOR ALL USING (public.is_admin());

CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (status = 'active' OR public.is_admin());
CREATE POLICY "Admin write products" ON public.products FOR ALL USING (public.is_admin());

CREATE POLICY "Public read active variants" ON public.product_variants FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admin write variants" ON public.product_variants FOR ALL USING (public.is_admin());

CREATE POLICY "Public read variant attributes" ON public.variant_attribute_values FOR SELECT USING (TRUE);
CREATE POLICY "Admin write variant attributes" ON public.variant_attribute_values FOR ALL USING (public.is_admin());

CREATE POLICY "Public read product images" ON public.product_images FOR SELECT USING (TRUE);
CREATE POLICY "Admin write product images" ON public.product_images FOR ALL USING (public.is_admin());

CREATE POLICY "Public read customization options" ON public.customization_options FOR SELECT USING (TRUE);
CREATE POLICY "Admin write customization options" ON public.customization_options FOR ALL USING (public.is_admin());

CREATE POLICY "Public read collections" ON public.collections FOR SELECT USING (TRUE);
CREATE POLICY "Admin write collections" ON public.collections FOR ALL USING (public.is_admin());

CREATE POLICY "Public read collection products" ON public.collection_products FOR SELECT USING (TRUE);
CREATE POLICY "Admin write collection products" ON public.collection_products FOR ALL USING (public.is_admin());

-- REVIEWS
CREATE POLICY "Public read approved reviews" ON public.reviews FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Customer can create review" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin moderate reviews" ON public.reviews FOR ALL USING (public.is_admin());

-- CARTS & CART ITEMS
CREATE POLICY "Cart access" ON public.carts FOR ALL
    USING (auth.uid() = user_id OR user_id IS NULL OR public.is_admin());

CREATE POLICY "Cart items access" ON public.cart_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.carts c
            WHERE c.id = cart_items.cart_id
            AND (c.user_id = auth.uid() OR c.user_id IS NULL OR public.is_admin())
        )
    );

-- WISHLISTS & WISHLIST ITEMS
CREATE POLICY "Wishlist access" ON public.wishlists FOR ALL
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Wishlist items access" ON public.wishlist_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.wishlists w
            WHERE w.id = wishlist_items.wishlist_id
            AND (w.user_id = auth.uid() OR public.is_admin())
        )
    );

-- COUPONS
CREATE POLICY "Public read active coupons" ON public.coupons FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admin manage coupons" ON public.coupons FOR ALL USING (public.is_admin());

CREATE POLICY "Redemptions access" ON public.coupon_redemptions FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

-- ORDERS & ORDER ITEMS
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
            AND (o.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Admin manage orders" ON public.orders FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage order items" ON public.order_items FOR ALL USING (public.is_admin());

CREATE POLICY "Read order status history" ON public.order_status_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_status_history.order_id
            AND (o.user_id = auth.uid() OR public.is_admin())
        )
    );

-- COURIERS & SHIPMENTS
CREATE POLICY "Public read active couriers" ON public.couriers FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admin manage couriers" ON public.couriers FOR ALL USING (public.is_admin());

CREATE POLICY "Users can view own shipments" ON public.shipments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = shipments.order_id
            AND (o.user_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Admin manage shipments" ON public.shipments FOR ALL USING (public.is_admin());

CREATE POLICY "Users view tracking events" ON public.shipment_tracking_events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.shipments s
            JOIN public.orders o ON o.id = s.order_id
            WHERE s.id = shipment_tracking_events.shipment_id
            AND (o.user_id = auth.uid() OR public.is_admin())
        )
    );

-- NOTIFICATIONS & BROADCASTS
CREATE POLICY "Users view own or global notifications" ON public.notifications FOR SELECT
    USING (user_id IS NULL OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users mark notifications as read" ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admin manage broadcasts" ON public.broadcasts FOR ALL USING (public.is_admin());

-- BANNERS
CREATE POLICY "Public read active banners" ON public.banners FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admin manage banners" ON public.banners FOR ALL USING (public.is_admin());

-- ADMIN ONLY TABLES
CREATE POLICY "Admin email templates" ON public.email_templates FOR ALL USING (public.is_admin());
CREATE POLICY "Admin email log" ON public.email_log FOR ALL USING (public.is_admin());
CREATE POLICY "Admin activity log" ON public.admin_activity_log FOR ALL USING (public.is_admin());
CREATE POLICY "Admin inventory alerts" ON public.inventory_alerts FOR ALL USING (public.is_admin());
