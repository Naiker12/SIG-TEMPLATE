
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, GripVertical, Trash2, Loader2 } from "lucide-react";
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
import { generatePdfPreview } from '@/services/pdfManipulationService';
import Image from 'next/image';

type MergeFile = {
    file: File;
    id: string;
    previewUrl?: string;
    isLoadingPreview: boolean;
};

type DraggableFileItemProps = {
  mergeFile: MergeFile;
  index: number;
  files: MergeFile[];
  onRemove: (fileId: string) => void;
  onDragEnd: (files: MergeFile[]) => void;
  setMergeFiles: React.Dispatch<React.SetStateAction<MergeFile[]>>;
};

export function DraggableFileItem({ mergeFile, index, files, onRemove, onDragEnd, setMergeFiles }: DraggableFileItemProps) {
  const [isDragging, setIsDragging] = useState(false);

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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    setTimeout(() => setIsDragging(true), 0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const newFiles = [...files];
    const [removed] = newFiles.splice(draggedIndex, 1);
    newFiles.splice(index, 0, removed);
    onDragEnd(newFiles);
    setIsDragging(false);
  };
  
  const handleDragEndInternal = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEndInternal}
      className={cn(
        "group relative cursor-grab transition-all duration-300",
        isDragging && "opacity-50 scale-95 shadow-2xl z-10"
      )}
    >
        <Card className="bg-muted/40 hover:bg-muted/70 hover:border-primary/50 transition-all hover:scale-105 hover:shadow-lg aspect-[3/4]">
            <CardContent className="p-2 flex flex-col items-center justify-between text-center h-full">
                <div className="w-full flex-1 relative mb-2 flex items-center justify-center bg-background rounded-md overflow-hidden">
                    {mergeFile.isLoadingPreview && <Loader2 className="w-8 h-8 text-primary animate-spin" />}
                    {mergeFile.previewUrl && !mergeFile.isLoadingPreview && (
                        // eslint-disable-next-line @next/next/no-img-element
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
              className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(mergeFile.id)}
             >
                <Trash2 className="w-4 h-4" />
                <span className="sr-only">Remove file</span>
            </Button>
        </Card>
    </div>
  );
}
