export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'customer' | 'admin' | 'staff';
export type AddressType = 'shipping' | 'billing';
export type AttributeInputType = 'select' | 'color_swatch' | 'text';
export type ProductStatus = 'draft' | 'active' | 'archived';
export type CustomizationType = 'text_print' | 'color_pick' | 'placement';
export type CollectionType = 'manual' | 'smart';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type DiscountType = 'percent' | 'fixed';
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'dispatched'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';
export type PaymentProvider = 'razorpay' | 'stripe' | 'cod' | 'mock';
export type PaymentStatus = 'initiated' | 'succeeded' | 'failed' | 'refunded';
export type ShipmentStatus =
  | 'created'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'returned';
export type NotificationType = 'order_update' | 'promo' | 'system';
export type BroadcastAudience = 'all' | 'segment';
export type BroadcastChannel = 'in_app' | 'email' | 'push';
export type BannerPlacement = 'home_hero' | 'category_top' | 'checkout';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          full_name: string;
          phone: string | null;
          line1: string;
          line2: string | null;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          is_default: boolean;
          type: AddressType;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label?: string;
          full_name: string;
          phone?: string | null;
          line1: string;
          line2?: string | null;
          city: string;
          state: string;
          postal_code: string;
          country?: string;
          is_default?: boolean;
          type?: AddressType;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          full_name?: string;
          phone?: string | null;
          line1?: string;
          line2?: string | null;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
          is_default?: boolean;
          type?: AddressType;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          parent_id: string | null;
          description: string | null;
          image_key: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          parent_id?: string | null;
          description?: string | null;
          image_key?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          parent_id?: string | null;
          description?: string | null;
          image_key?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      attributes: {
        Row: {
          id: string;
          name: string;
          input_type: AttributeInputType;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          input_type?: AttributeInputType;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          input_type?: AttributeInputType;
          created_at?: string;
        };
      };
      category_attributes: {
        Row: {
          category_id: string;
          attribute_id: string;
        };
        Insert: {
          category_id: string;
          attribute_id: string;
        };
        Update: {
          category_id?: string;
          attribute_id?: string;
        };
      };
      attribute_values: {
        Row: {
          id: string;
          attribute_id: string;
          value: string;
          meta: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          attribute_id: string;
          value: string;
          meta?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          attribute_id?: string;
          value?: string;
          meta?: Json;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category_id: string;
          brand: string;
          description: string;
          base_price: number;
          currency: string;
          is_customizable: boolean;
          status: ProductStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category_id: string;
          brand?: string;
          description?: string;
          base_price?: number;
          currency?: string;
          is_customizable?: boolean;
          status?: ProductStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          category_id?: string;
          brand?: string;
          description?: string;
          base_price?: number;
          currency?: string;
          is_customizable?: boolean;
          status?: ProductStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          price_override: number | null;
          stock_quantity: number;
          weight_grams: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          price_override?: number | null;
          stock_quantity?: number;
          weight_grams?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          sku?: string;
          price_override?: number | null;
          stock_quantity?: number;
          weight_grams?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      variant_attribute_values: {
        Row: {
          variant_id: string;
          attribute_value_id: string;
        };
        Insert: {
          variant_id: string;
          attribute_value_id: string;
        };
        Update: {
          variant_id?: string;
          attribute_value_id?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          r2_key: string;
          alt_text: string;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          variant_id?: string | null;
          r2_key: string;
          alt_text?: string;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          variant_id?: string | null;
          r2_key?: string;
          alt_text?: string;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
      };
      customization_options: {
        Row: {
          id: string;
          product_id: string;
          option_type: CustomizationType;
          config: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          option_type: CustomizationType;
          config?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          option_type?: CustomizationType;
          config?: Json;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          title: string | null;
          body: string;
          is_verified_purchase: boolean;
          status: ReviewStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          rating: number;
          title?: string | null;
          body: string;
          is_verified_purchase?: boolean;
          status?: ReviewStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          rating?: number;
          title?: string | null;
          body?: string;
          is_verified_purchase?: boolean;
          status?: ReviewStatus;
          created_at?: string;
        };
      };
      carts: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          variant_id: string;
          quantity: number;
          customization_data: Json | null;
          unit_price_snapshot: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          variant_id: string;
          quantity?: number;
          customization_data?: Json | null;
          unit_price_snapshot: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          cart_id?: string;
          variant_id?: string;
          quantity?: number;
          customization_data?: Json | null;
          unit_price_snapshot?: number;
          created_at?: string;
        };
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      wishlist_items: {
        Row: {
          wishlist_id: string;
          variant_id: string;
          added_at: string;
        };
        Insert: {
          wishlist_id: string;
          variant_id: string;
          added_at?: string;
        };
        Update: {
          wishlist_id?: string;
          variant_id?: string;
          added_at?: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          discount_type: DiscountType;
          value: number;
          min_order_value: number;
          starts_at: string;
          expires_at: string | null;
          usage_limit: number | null;
          usage_count: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_type?: DiscountType;
          value: number;
          min_order_value?: number;
          starts_at?: string;
          expires_at?: string | null;
          usage_limit?: number | null;
          usage_count?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          discount_type?: DiscountType;
          value?: number;
          min_order_value?: number;
          starts_at?: string;
          expires_at?: string | null;
          usage_limit?: number | null;
          usage_count?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          status: OrderStatus;
          subtotal: number;
          discount_total: number;
          shipping_total: number;
          tax_total: number;
          grand_total: number;
          currency: string;
          shipping_address_id: string | null;
          billing_address_id: string | null;
          coupon_id: string | null;
          placed_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id: string;
          status?: OrderStatus;
          subtotal: number;
          discount_total?: number;
          shipping_total?: number;
          tax_total?: number;
          grand_total: number;
          currency?: string;
          shipping_address_id?: string | null;
          billing_address_id?: string | null;
          coupon_id?: string | null;
          placed_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string;
          status?: OrderStatus;
          subtotal?: number;
          discount_total?: number;
          shipping_total?: number;
          tax_total?: number;
          grand_total?: number;
          currency?: string;
          shipping_address_id?: string | null;
          billing_address_id?: string | null;
          coupon_id?: string | null;
          placed_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          variant_id: string;
          product_name_snapshot: string;
          variant_label_snapshot: string;
          unit_price: number;
          quantity: number;
          customization_data: Json | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          variant_id: string;
          product_name_snapshot: string;
          variant_label_snapshot: string;
          unit_price: number;
          quantity: number;
          customization_data?: Json | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          variant_id?: string;
          product_name_snapshot?: string;
          variant_label_snapshot?: string;
          unit_price?: number;
          quantity?: number;
          customization_data?: Json | null;
        };
      };
      order_status_history: {
        Row: {
          id: string;
          order_id: string;
          status: OrderStatus;
          note: string | null;
          changed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: OrderStatus;
          note?: string | null;
          changed_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          status?: OrderStatus;
          note?: string | null;
          changed_by?: string | null;
          created_at?: string;
        };
      };
      couriers: {
        Row: {
          id: string;
          name: string;
          api_config: Json;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          api_config?: Json;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          api_config?: Json;
          is_active?: boolean;
          created_at?: string;
        };
      };
      shipments: {
        Row: {
          id: string;
          order_id: string;
          courier_id: string;
          awb_number: string;
          status: ShipmentStatus;
          estimated_delivery: string | null;
          label_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          courier_id: string;
          awb_number: string;
          status?: ShipmentStatus;
          estimated_delivery?: string | null;
          label_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          courier_id?: string;
          awb_number?: string;
          status?: ShipmentStatus;
          estimated_delivery?: string | null;
          label_url?: string | null;
          created_at?: string;
        };
      };
      shipment_tracking_events: {
        Row: {
          id: string;
          shipment_id: string;
          status: ShipmentStatus;
          location: string | null;
          description: string;
          event_time: string;
        };
        Insert: {
          id?: string;
          shipment_id: string;
          status: ShipmentStatus;
          location?: string | null;
          description: string;
          event_time?: string;
        };
        Update: {
          id?: string;
          shipment_id?: string;
          status?: ShipmentStatus;
          location?: string | null;
          description?: string;
          event_time?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          type: NotificationType;
          title: string;
          body: string;
          is_read: boolean;
          link_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          type?: NotificationType;
          title: string;
          body: string;
          is_read?: boolean;
          link_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          type?: NotificationType;
          title?: string;
          body?: string;
          is_read?: boolean;
          link_url?: string | null;
          created_at?: string;
        };
      };
      banners: {
        Row: {
          id: string;
          title: string;
          image_key: string;
          link_url: string;
          placement: BannerPlacement;
          starts_at: string;
          ends_at: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          image_key: string;
          link_url?: string;
          placement?: BannerPlacement;
          starts_at?: string;
          ends_at?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          image_key?: string;
          link_url?: string;
          placement?: BannerPlacement;
          starts_at?: string;
          ends_at?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      email_templates: {
        Row: {
          id: string;
          key: string;
          subject: string;
          html_body: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          subject: string;
          html_body: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          subject?: string;
          html_body?: string;
          updated_at?: string;
        };
      };
      email_log: {
        Row: {
          id: string;
          to_email: string;
          template_key: string;
          order_id: string | null;
          status: string;
          sent_at: string;
        };
        Insert: {
          id?: string;
          to_email: string;
          template_key: string;
          order_id?: string | null;
          status?: string;
          sent_at?: string;
        };
        Update: {
          id?: string;
          to_email?: string;
          template_key?: string;
          order_id?: string | null;
          status?: string;
          sent_at?: string;
        };
      };
      admin_activity_log: {
        Row: {
          id: string;
          admin_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
      inventory_alerts: {
        Row: {
          id: string;
          variant_id: string;
          threshold: number;
          triggered_at: string;
          resolved: boolean;
        };
        Insert: {
          id?: string;
          variant_id: string;
          threshold?: number;
          triggered_at?: string;
          resolved?: boolean;
        };
        Update: {
          id?: string;
          variant_id?: string;
          threshold?: number;
          triggered_at?: string;
          resolved?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      decrement_stock_atomic: {
        Args: {
          p_order_id: string;
        };
        Returns: void;
      };
    };
    Enums: {
      user_role: UserRole;
      address_type: AddressType;
      attribute_input_type: AttributeInputType;
      product_status: ProductStatus;
      customization_type: CustomizationType;
      collection_type: CollectionType;
      review_status: ReviewStatus;
      discount_type: DiscountType;
      order_status: OrderStatus;
      payment_provider: PaymentProvider;
      payment_status: PaymentStatus;
      shipment_status: ShipmentStatus;
      notification_type: NotificationType;
      broadcast_audience: BroadcastAudience;
      broadcast_channel: BroadcastChannel;
      banner_placement: BannerPlacement;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
