import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, quantity: number, selectedVariants?: Record<string, string>) => void
  removeItem: (id: string) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity, selectedVariants) => {
        const existingItemIndex = get().items.findIndex(
          (cartItem) =>
            cartItem.id === item.id && JSON.stringify(cartItem.selectedVariants) === JSON.stringify(selectedVariants),
        )

        if (existingItemIndex > -1) {
          set((state) => {
            const newItems = [...state.items]
            newItems[existingItemIndex].quantity += quantity
            return { items: newItems }
          })
        } else {
          set((state) => ({
            items: [...state.items, { ...item, quantity, selectedVariants }],
          }))
        }
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },
      increaseQuantity: (id) => {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
        }))
      },
      decreaseQuantity: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item,
          ),
        }))
      },
      clearCart: () => {
        set({ items: [] })
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
      storage: typeof window !== "undefined" ? localStorage : undefined,
    },
  ),
)
export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  selectedVariants?: Record<string, string>
}
