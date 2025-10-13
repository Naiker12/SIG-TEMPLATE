
'use client';

import React, { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent } from '../ui/card';
import { generatePdfPreview } from '@/services/pdfManipulationService';

type MergeFile = {
    file: File;
    id: string;
    previewUrl?: string;
    isLoadingPreview: boolean;
};

type DraggableFileItemProps = {
  mergeFile: MergeFile;
  onRemove: (fileId: string) => void;
  setMergeFiles: React.Dispatch<React.SetStateAction<MergeFile[]>>;
};

export function DraggableFileItem({ mergeFile, onRemove, setMergeFiles }: DraggableFileItemProps) {
  useEffect(() => {
    let isMounted = true;
    if (mergeFile.isLoadingPreview && !mergeFile.previewUrl) {
      generatePdfPreview(mergeFile.file)
        .then(previewUrl => {
            if (isMounted) {
                setMergeFiles(prevFiles =>
                    prevFiles.map(f => f.id === mergeFile.id ? { ...f, previewUrl, isLoadingPreview: false } : f)
                );
            }
        })
        .catch(err => {
            console.error("Failed to generate preview:", err);
            if (isMounted) {
                setMergeFiles(prevFiles =>
                    prevFiles.map(f => f.id === mergeFile.id ? { ...f, isLoadingPreview: false } : f)
                );
            }
        });
    }
    return () => { isMounted = false; };
  }, [mergeFile, setMergeFiles]);

  return (
    <Reorder.Item
      value={mergeFile}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileDrag={{ scale: 1.05, boxShadow: "0px 10px 20px hsla(var(--primary), 0.2)" }}
      className="group relative cursor-grab"
    >
        <Card className="bg-muted/40 hover:bg-muted/70 hover:border-primary/50 transition-all aspect-[3/4] overflow-hidden">
            <CardContent className="p-2 flex flex-col items-center justify-between text-center h-full">
                <div className="w-full flex-1 relative mb-2 flex items-center justify-center bg-background rounded-md overflow-hidden">
                    {mergeFile.isLoadingPreview && <Loader2 className="w-8 h-8 text-primary animate-spin" />}
                    {mergeFile.previewUrl && !mergeFile.isLoadingPreview && (
                        <img src={mergeFile.previewUrl} alt={`Preview of ${mergeFile.file.name}`} className="object-contain h-full w-full" />
                    )}
                    {!mergeFile.isLoadingPreview && !mergeFile.previewUrl && (
                        <FileText className="w-12 h-12 text-muted-foreground" />
                    )}
                </div>
                <div className="w-full">
                  <p className="font-semibold text-sm truncate w-full" title={mergeFile.file.name}>
                      {mergeFile.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                      {(mergeFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
            </CardContent>
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={(e) => {
                e.stopPropagation(); // Evita que el drag se active al hacer clic en el botón
                onRemove(mergeFile.id);
              }}
             >
                <Trash2 className="w-4 h-4" />
                <span className="sr-only">Remove file</span>
            </Button>
        </Card>
    </Reorder.Item>
  );
}
