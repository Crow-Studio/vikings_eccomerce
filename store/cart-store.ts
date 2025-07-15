import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface CartStore {
  items: CartItem[]
  itemCount: number
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find((i) => i.id === item.id)

        if (existingItem) {
          set({
            items: items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)),
            itemCount: get().itemCount + item.quantity,
          })
        } else {
          set({
            items: [...items, item],
            itemCount: get().itemCount + item.quantity,
          })
        }
      },
      removeItem: (id) => {
        const { items } = get()
        const itemToRemove = items.find((i) => i.id === id)
        if (itemToRemove) {
          set({
            items: items.filter((i) => i.id !== id),
            itemCount: get().itemCount - itemToRemove.quantity,
          })
        }
      },
      updateQuantity: (id, quantity) => {
        const { items } = get()
        const oldItem = items.find((i) => i.id === id)
        if (oldItem) {
          const quantityDiff = quantity - oldItem.quantity
          set({
            items: items.map((i) => (i.id === id ? { ...i, quantity } : i)),
            itemCount: get().itemCount + quantityDiff,
          })
        }
      },
      clearCart: () => set({ items: [], itemCount: 0 }),
    }),
    {
      name: "vikings-cart-storage",
    },
  ),
)
