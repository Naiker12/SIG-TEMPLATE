
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

  if (!hasMounted) {
    // Evita el mismatch de hidratación renderizando sin clases de padding en el servidor
    // o en el primer render del cliente.
    return <div>{children}</div>;
  }
  
  const mainContentClasses = cn(
    "transition-[padding-left] duration-300 ease-in-out",
    {
      "sm:pl-60": isOpen && !isMobile,
      "sm:pl-16": !isOpen && !isMobile,
      "pl-0": isMobile, // No padding on mobile
    }
  );

  return (
    <div className={mainContentClasses}>
      {children}
    </div>
  );
}
