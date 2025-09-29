
'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

type FileProgressLoaderProps = {
  fileName: string;
  onComplete: () => void;
};

export function FileProgressLoader({ fileName, onComplete }: FileProgressLoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full max-w-md mx-auto text-center p-8">
      <h2 className="text-2xl font-semibold mb-2">Procesando tu archivo...</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        Estamos analizando <span className="font-medium text-primary">{fileName}</span>. Esto podría tardar unos segundos.
      </p>
      <Progress value={progress} className="w-full" />
      <p className="text-lg font-bold mt-4">{progress}%</p>
    </div>
  );
}
