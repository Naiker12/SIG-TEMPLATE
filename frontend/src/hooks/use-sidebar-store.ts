
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware"

interface SidebarStore {
  isOpen: boolean;
  isCollapsed: boolean;
  setOpen: (isOpen: boolean) => void;
  toggle: () => void;
}

export const useSidebarStore = create(
  persist<SidebarStore>(
    (set, get) => ({
      isOpen: true,
      isCollapsed: false,
      setOpen: (isOpen) => {
        set({ isOpen, isCollapsed: !isOpen })
      },
      toggle: () => {
        const currentIsOpen = get().isOpen
        set({ isOpen: !currentIsOpen, isCollapsed: currentIsOpen })
      },
    }),
    {
      name: "sidebar-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
