
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, GripVertical, Trash2 } from "lucide-react";
import { cn } from '@/lib/utils';

type DraggableFileItemProps = {
  file: File;
  index: number;
  files: File[];
  onRemove: (file: File) => void;
  onDragEnd: (files: File[]) => void;
};

export function DraggableFileItem({ file, index, files, onRemove, onDragEnd }: DraggableFileItemProps) {
  const [isDragging, setIsDragging] = useState(false);

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
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={cn(
        "flex items-center justify-between p-3 border rounded-lg bg-card transition-all",
        isDragging ? "opacity-50 border-primary shadow-lg" : "bg-muted/20"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
        <FileText className="w-6 h-6 text-primary flex-shrink-0" />
        <div className="min-w-0">
            <p className="font-semibold truncate">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onRemove(file)}>
        <Trash2 className="w-5 h-5 text-destructive" />
        <span className="sr-only">Remove file</span>
      </Button>
    </div>
  );
}
