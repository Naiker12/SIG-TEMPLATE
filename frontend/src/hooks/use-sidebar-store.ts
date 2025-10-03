
'use client';

import { create } from 'zustand';

interface SidebarStore {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (isOpen: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (isOpen) => set({ isOpen }),
}));
