import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { WishlistItem } from "@/types/header" 
interface WishlistState {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isWishlisted: (id: string) => boolean
  getTotalItems: () => number
  clearWishlist: () => void
}
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          if (!state.items.some((wishlistItem) => wishlistItem.id === item.id)) {
            return { items: [...state.items, item] }
          }
          return state 
        })
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },
      isWishlisted: (id) => {
        return get().items.some((item) => item.id === id)
      },
      getTotalItems: () => {
        return get().items.length
      },
      clearWishlist: () => {
        set({ items: [] })
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
