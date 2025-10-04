
'use client';

import { useSidebarStore } from '@/hooks/use-sidebar-store';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // On first render on the client, hasMounted is false, so we render with the default (closed) state
  // to avoid a hydration mismatch. On the next render, hasMounted is true and we use the actual isOpen value.
  const sidebarIsOpen = hasMounted ? isOpen : true;

  const mainContentClasses = cn(
    "transition-[padding-left] duration-300 ease-in-out",
    {
      "sm:pl-60": !isMobile && sidebarIsOpen,
      "sm:pl-16": !isMobile && !sidebarIsOpen,
      "pl-0": isMobile,
    }
  );

  return (
    <div className={mainContentClasses}>
      {isMobile && sidebarIsOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => useSidebarStore.getState().toggle()}
        />
      )}
      {children}
    </div>
  );
}
