import { ModalStore } from "@/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
export const useModal = create<ModalStore>()(
  devtools(
    persist(
      (set) => ({
        type: null,
        isOpen: false,
        data: {},
        onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
        onClose: () => set({ type: null, isOpen: false, data: {} }),
        onPopulateData: (data = {}) => set({ data })
      }),
      {
        name: "delirium-storage",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
