import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CustomizationOption } from '../data/products';
import { getSupabaseClient } from '../supabase/client';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  customization?: CustomizationOption;
}

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  promoCode: string;
  promoDiscount: number; // percentage (0 to 1)

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  setDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  applyPromo: (code: string) => Promise<{ success: boolean; message: string }>;
  syncWithBackend: (userId?: string) => Promise<void>;

  // Calculated getters
  getItemCount: () => number;
  getSubtotal: () => number;
  getShippingCost: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      promoCode: '',
      promoDiscount: 0,

      addItem: (newItem) => {
        const items = get().items;
        const customKey = newItem.customization
          ? `${newItem.customization.baseColor}-${newItem.customization.text}-${newItem.customization.placement}-${newItem.customization.font}`
          : 'standard';
        const id = `${newItem.productId}_${newItem.size}_${newItem.color}_${customKey}`;

        const existingIndex = items.findIndex((item) => item.id === id);

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += newItem.quantity;
          set({ items: updated, isDrawerOpen: true });
        } else {
          set({ items: [...items, { ...newItem, id }], isDrawerOpen: true });
        }

        // Background sync if online
        get().syncWithBackend().catch(() => {});
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        get().syncWithBackend().catch(() => {});
      },

      updateQuantity: (id, delta) => {
        const items = get().items;
        const updated = items
          .map((item) => {
            if (item.id === id) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[];

        set({ items: updated });
        get().syncWithBackend().catch(() => {});
      },

      clearCart: () => {
        set({ items: [], promoCode: '', promoDiscount: 0 });
      },

      setDrawerOpen: (open) => set({ isDrawerOpen: open }),
      toggleDrawer: () => set({ isDrawerOpen: !get().isDrawerOpen }),

      applyPromo: async (code: string) => {
        const clean = code.trim().toUpperCase();
        try {
          const supabase = getSupabaseClient();
          const { data: coupon, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', clean)
            .eq('is_active', true)
            .single();

          if (!error && coupon) {
            const subtotal = get().getSubtotal();
            if (coupon.min_order_value && subtotal < Number(coupon.min_order_value)) {
              return {
                success: false,
                message: `Order minimum of $${coupon.min_order_value} required for this coupon.`,
              };
            }

            const discountFraction = coupon.discount_type === 'percent'
              ? Number(coupon.value) / 100
              : Number(coupon.value) / Math.max(1, subtotal);

            set({ promoCode: clean, promoDiscount: discountFraction });
            return {
              success: true,
              message: `${coupon.discount_type === 'percent' ? `${coupon.value}%` : `$${coupon.value}`} discount applied.`,
            };
          }
        } catch {
          // Fallback
        }

        // Fallback promo codes
        if (clean === 'WOCHA10') {
          set({ promoCode: clean, promoDiscount: 0.1 });
          return { success: true, message: '10% discount applied to your order.' };
        }
        if (clean === 'STUDIO20') {
          set({ promoCode: clean, promoDiscount: 0.2 });
          return { success: true, message: '20% studio privilege discount applied.' };
        }
        return { success: false, message: 'Invalid or expired promotional code.' };
      },

      syncWithBackend: async (userId?: string) => {
        try {
          const supabase = getSupabaseClient();
          const { data: { session } } = await supabase.auth.getSession();
          const uid = userId || session?.user?.id;
          if (!uid) return;

          // Upsert cart for user
          const { data: cart } = await supabase
            .from('carts')
            .select('id')
            .eq('user_id', uid)
            .single();

          let cartId = cart?.id;
          if (!cartId) {
            const { data: newCart } = await supabase
              .from('carts')
              .insert({ user_id: uid })
              .select('id')
              .single();
            cartId = newCart?.id;
          }

          if (!cartId) return;

          // Merge items into database
          const items = get().items;
          for (const item of items) {
            await supabase
              .from('cart_items')
              .upsert({
                cart_id: cartId,
                variant_id: 'v0000000-0000-0000-0000-000000000001', // or resolved variant
                quantity: item.quantity,
                unit_price_snapshot: item.price,
                customization_data: item.customization || null,
              });
          }
        } catch {
          // Keep local state intact
        }
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 200 ? 0 : 18;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = subtotal * get().promoDiscount;
        const shipping = get().getShippingCost();
        return Math.max(0, subtotal - discount + shipping);
      },
    }),
    {
      name: 'wocha-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
        promoDiscount: state.promoDiscount,
      }),
    }
  )
);
