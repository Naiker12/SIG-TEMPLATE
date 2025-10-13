
'use client';

import { useState, useEffect, useCallback } from 'react';
import { generatePdfPreview } from '@/services/pdfManipulationService';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';

interface PdfPageSelectorProps {
  file: File;
  pageCount: number;
  selectedPages: number[];
  onSelectedPagesChange: (pages: number[]) => void;
}

interface PagePreview {
  pageNumber: number;
  previewUrl: string;
}

export function PdfPageSelector({ file, pageCount, selectedPages, onSelectedPagesChange }: PdfPageSelectorProps) {
  const [previews, setPreviews] = useState<PagePreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPreviews = useCallback(async () => {
    setIsLoading(true);
    const promises: Promise<PagePreview | null>[] = [];
    for (let i = 1; i <= pageCount; i++) {
      promises.push(
        generatePdfPreview(file, i)
          .then(previewUrl => ({ pageNumber: i, previewUrl }))
          .catch(err => {
            console.error(`Failed to generate preview for page ${i}:`, err);
            return null;
          })
      );
    }
    const results = await Promise.all(promises);
    setPreviews(results.filter((p): p is PagePreview => p !== null));
    setIsLoading(false);
  }, [file, pageCount]);

  useEffect(() => {
    fetchPreviews();
  }, [fetchPreviews]);

  const handlePageToggle = (pageNumber: number) => {
    onSelectedPagesChange(
      selectedPages.includes(pageNumber)
        ? selectedPages.filter(p => p !== pageNumber)
        : [...selectedPages, pageNumber]
    );
  };
  
  const handleSelectAll = () => {
    const allPageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);
    onSelectedPagesChange(allPageNumbers);
  };

  const handleClearAll = () => {
    onSelectedPagesChange([]);
  };

  if (isLoading && previews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <p>Generando previsualizaciones...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
        <div className="flex-shrink-0 mb-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Seleccionadas {selectedPages.length} de {pageCount} páginas.</p>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>Seleccionar Todo</Button>
                <Button variant="outline" size="sm" onClick={handleClearAll}>Limpiar</Button>
            </div>
        </div>
      <ScrollArea className="flex-1 -mr-4 pr-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map(pageNumber => {
            const preview = previews.find(p => p.pageNumber === pageNumber);
            const isSelected = selectedPages.includes(pageNumber);
            return (
              <Card
                key={pageNumber}
                className={cn(
                  'cursor-pointer transition-all border-2',
                  isSelected ? 'border-primary' : 'border-transparent hover:border-primary/50'
                )}
                onClick={() => handlePageToggle(pageNumber)}
              >
                <CardContent className="p-1 relative aspect-[3/4] flex flex-col items-center justify-center">
                  <div className="absolute top-2 right-2 z-10 bg-background/50 rounded-sm">
                     <Checkbox checked={isSelected} className="h-5 w-5" />
                  </div>
                  {preview ? (
                    <img src={preview.previewUrl} alt={`Page ${pageNumber}`} className="object-contain h-full w-full rounded" />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-muted rounded">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  )}
                   <div className="absolute bottom-1 left-1 right-1 text-center bg-black/50 text-white text-xs font-bold py-0.5 rounded-b-sm">
                      {pageNumber}
                    </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
