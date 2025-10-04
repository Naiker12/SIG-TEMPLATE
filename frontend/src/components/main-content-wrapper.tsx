
'use client';

import { useSidebarStore } from '@/hooks/use-sidebar-store';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // On first render on the client, hasMounted is false, so we render with the default (open) state
  // to avoid a hydration mismatch. On the next render, hasMounted is true and we use the actual isOpen value.
  const sidebarIsOpen = hasMounted ? isOpen : true;

  const mainContentClasses = cn(
    "transition-[padding-left] duration-300 ease-in-out",
    {
      "sm:pl-60": sidebarIsOpen,
      "sm:pl-16": !sidebarIsOpen,
    }
  );

  return (
    <div className={mainContentClasses}>
      {children}
    </div>
  );
}
