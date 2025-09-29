'use client';

import { useLoadingStore } from '@/hooks/use-loading-store';
import { AnimatePresence, motion } from 'framer-motion';
import { AtomLoader } from './atom-loader';

export function PageLoader() {
  const { isLoading } = useLoadingStore();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4">
            <AtomLoader />
            <p className="text-sm font-medium text-muted-foreground">Cargando...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
