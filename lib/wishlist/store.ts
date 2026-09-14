import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getSupabaseClient } from '../supabase/client';

export interface WishlistItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  syncWithBackend: (userId?: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        if (!get().isInWishlist(item.productId)) {
          set({ items: [...get().items, item] });
          get().syncWithBackend().catch(() => {});
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
        get().syncWithBackend().catch(() => {});
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      clearWishlist: () => set({ items: [] }),

      syncWithBackend: async (userId?: string) => {
        try {
          const supabase = getSupabaseClient();
          const { data: { session } } = await supabase.auth.getSession();
          const uid = userId || session?.user?.id;
          if (!uid) return;

          const { data: wishlist } = await supabase
            .from('wishlists')
            .select('id')
            .eq('user_id', uid)
            .single();

          if (!wishlist?.id) return;

          for (const item of get().items) {
            await supabase
              .from('wishlist_items')
              .upsert({
                wishlist_id: wishlist.id,
                variant_id: item.variantId || 'v0000000-0000-0000-0000-000000000001',
              });
          }
        } catch {
          // Keep local state
        }
      },
    }),
    {
      name: 'wocha-wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
