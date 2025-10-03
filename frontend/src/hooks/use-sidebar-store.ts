
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware"

interface SidebarStore {
  isOpen: boolean;
  isHovered: boolean;
  isClosing: boolean;
  setOpen: (isOpen: boolean) => void;
  toggle: () => void;
  setIsHovered: (isHovered: boolean) => void;
  setIsClosing: (isClosing: boolean) => void;
}

export const useSidebarStore = create(
  persist<SidebarStore>(
    (set, get) => ({
      isOpen: true,
      isHovered: false,
      isClosing: false,
      setOpen: (isOpen) => {
        set({ isOpen })
      },
      toggle: () => {
        const currentIsOpen = get().isOpen;
        if (currentIsOpen) {
          set({ isClosing: true });
          setTimeout(() => {
            set({ isOpen: false, isClosing: false });
          }, 300); // Match this with your animation duration
        } else {
          set({ isOpen: true });
        }
      },
      setIsHovered: (isHovered) => {
        set({ isHovered });
      },
      setIsClosing: (isClosing) => {
        set({ isClosing });
      }
    }),
    {
      name: "sidebar-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
