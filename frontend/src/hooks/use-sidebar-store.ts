
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware"
import * as React from 'react';

interface SidebarStore {
  isOpen: boolean;
  toggle: () => void;
}

export const useSidebarStore = create(
  persist<SidebarStore>(
    (set) => ({
      isOpen: true,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "sidebar-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  // Este provider es solo para asegurar que el store se hidrate en el cliente.
  // No necesita pasar ningún valor a través del contexto.
  return <>{children}</>;
}
