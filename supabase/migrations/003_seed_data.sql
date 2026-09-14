-- ============================================================================
-- 003_seed_data.sql
-- WOCHA Initial Seed: Categories, Attributes, Products, Variants, Couriers
-- ============================================================================

-- 1. ATTRIBUTES
INSERT INTO public.attributes (id, name, input_type) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Size', 'select'),
    ('a0000000-0000-0000-0000-000000000002', 'Color', 'color_swatch'),
    ('a0000000-0000-0000-0000-000000000003', 'Custom Text', 'text')
ON CONFLICT (name) DO NOTHING;

-- 2. ATTRIBUTE VALUES
-- Sizes
INSERT INTO public.attribute_values (id, attribute_id, value, meta) VALUES
    ('v0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'XS', '{}'),
    ('v0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'S', '{}'),
    ('v0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'M', '{}'),
    ('v0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'L', '{}'),
    ('v0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'XL', '{}'),
    ('v0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'XXL', '{}')
ON CONFLICT DO NOTHING;

-- Colors
INSERT INTO public.attribute_values (id, attribute_id, value, meta) VALUES
    ('v0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000002', 'Pitch Black', '{"hex": "#111111"}'),
    ('v0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000002', 'Chalk Bone', '{"hex": "#EBE9E1"}'),
    ('v0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000002', 'Muted Clay', '{"hex": "#B85C3E"}'),
    ('v0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000002', 'Washed Charcoal', '{"hex": "#262626"}'),
    ('v0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000002', 'Raw Ecru', '{"hex": "#ECE8DF"}'),
    ('v0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000002', 'Obsidian Black', '{"hex": "#0B0B0C"}')
ON CONFLICT DO NOTHING;

-- 3. HIERARCHICAL CATEGORIES
-- Root categories
INSERT INTO public.categories (id, name, slug, parent_id, description, sort_order, is_active) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'Hoodies', 'hoodies', NULL, 'Heavyweight fleece and terry silhouettes cut in architectural proportions.', 1, TRUE),
    ('c0000000-0000-0000-0000-000000000002', 'T-Shirts', 't-shirts', NULL, 'Substantial combed cotton foundations and structured collar treatments.', 2, TRUE),
    ('c0000000-0000-0000-0000-000000000003', 'Puffers', 'puffers', NULL, 'Thermal insulation systems engineered with high fill-power down.', 3, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Subcategory under T-Shirts: Customizable T-Shirts
INSERT INTO public.categories (id, name, slug, parent_id, description, sort_order, is_active) VALUES
    ('c0000000-0000-0000-0000-000000000004', 'Custom Studio', 'customizable', 'c0000000-0000-0000-0000-000000000002', 'Bespoke typography, placement, and color configurations rendered in 3D.', 4, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- 4. CATEGORY ATTRIBUTES
-- Hoodies -> Size, Color
INSERT INTO public.category_attributes (category_id, attribute_id) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001'),
    ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002'),
-- T-Shirts -> Size, Color
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001'),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002'),
-- Puffers -> Size, Color
    ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001'),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002'),
-- Customizable T-Shirts -> Size, Color, Custom Text (adaptive attribute)
    ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001'),
    ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002'),
    ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;

-- 5. COURIERS
INSERT INTO public.couriers (id, name, api_config, is_active) VALUES
    ('f0000000-0000-0000-0000-000000000001', 'Delhivery', '{"service_type": "surface", "client_code": "WOCHA_DEL"}'::jsonb, TRUE),
    ('f0000000-0000-0000-0000-000000000002', 'Shiprocket', '{"service_type": "air", "channel_id": "WOCHA_SR"}'::jsonb, TRUE),
    ('f0000000-0000-0000-0000-000000000003', 'DTDC', '{"service_type": "express"}'::jsonb, TRUE)
ON CONFLICT (name) DO NOTHING;

-- 6. COUPONS
INSERT INTO public.coupons (code, discount_type, value, min_order_value, is_active) VALUES
    ('WOCHA10', 'percent', 10.00, 50.00, TRUE),
    ('STUDIO20', 'percent', 20.00, 100.00, TRUE)
ON CONFLICT (code) DO NOTHING;

-- 7. EMAIL TEMPLATES
INSERT INTO public.email_templates (key, subject, html_body) VALUES
    ('order_confirmation', 'Your WOCHA Order {{order_number}} is confirmed', '<p>Thank you for your order, {{customer_name}}. Your order {{order_number}} has been received and is being prepared in our atelier.</p>'),
    ('shipped', 'Your WOCHA Order {{order_number}} has shipped', '<p>Your order is on its way via {{courier_name}}. Tracking AWB: <strong>{{awb_number}}</strong></p>'),
    ('abandoned_cart', 'Did you leave something behind in your WOCHA cart?', '<p>Complete your purchase of curated architectural silhouettes before sizes sell out.</p>')
ON CONFLICT (key) DO NOTHING;

-- 8. SAMPLE BANNERS
INSERT INTO public.banners (title, image_key, link_url, placement, sort_order, is_active) VALUES
    ('Collection 04 — Permanent Index', 'banners/home_hero_01.jpg', '/shop', 'home_hero', 1, TRUE),
    ('Atelier Custom Studio Open', 'banners/custom_studio_banner.jpg', '/custom-studio', 'category_top', 2, TRUE)
ON CONFLICT DO NOTHING;
