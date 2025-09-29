import { create } from "zustand"
import { persist } from "zustand/middleware"
export interface CartItem {
  id: string 
  name: string
  price: number
  quantity: number
  image: string
  selectedVariants?: Record<string, string> 
}
interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  increaseQuantity: (id: string) => void
  decreaseQuantity: (id: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const { items } = get()
        const existingItemIndex = items.findIndex((i) => 
          i.id === item.id && 
          JSON.stringify(i.selectedVariants) === JSON.stringify(item.selectedVariants)
        )
        if (existingItemIndex !== -1) {
          const updatedItems = [...items]
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + item.quantity
          }
          set({ items: updatedItems })
        } else {
          set({ items: [...items, item] })
        }
      },
      removeItem: (id) => {
        const { items } = get()
        set({
          items: items.filter((i) => i.id !== id)
        })
      },
      updateQuantity: (id, quantity) => {
        const { items } = get()
        if (quantity <= 0) {
          set({
            items: items.filter((i) => i.id !== id)
          })
        } else {
          set({
            items: items.map((i) => (i.id === id ? { ...i, quantity } : i))
          })
        }
      },
      increaseQuantity: (id) => {
        const { items } = get()
        set({
          items: items.map((i) => 
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          )
        })
      },
      decreaseQuantity: (id) => {
        const { items } = get()
        const item = items.find((i) => i.id === id)
        if (item && item.quantity > 1) {
          set({
            items: items.map((i) => 
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            )
          })
        } else {
          set({
            items: items.filter((i) => i.id !== id)
          })
        }
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },
      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
    }),
    {
      name: "vikings-cart-storage",
    },
  ),
)