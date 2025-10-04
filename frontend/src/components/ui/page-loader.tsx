'use client';

import { useLoadingStore } from '@/hooks/use-loading-store';
import { AnimatePresence, motion } from 'framer-motion';
import { CircularProgressBar } from './circular-progress-bar';
import { useEffect, useState } from 'react';

export function PageLoader() {
  const { isLoading } = useLoadingStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoading]);


  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <CircularProgressBar progress={progress} message="Procesando..." />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
