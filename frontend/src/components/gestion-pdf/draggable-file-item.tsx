
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, GripVertical, Trash2 } from "lucide-react";
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

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
        "group relative cursor-grab transition-all duration-300",
        isDragging && "opacity-50 scale-95 shadow-2xl z-10"
      )}
    >
        <Card className="bg-muted/40 hover:bg-muted/70 hover:border-primary/50 transition-all hover:scale-105 hover:shadow-lg">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-48">
                <FileText className="w-12 h-12 text-primary mb-3" />
                <p className="font-semibold text-sm truncate w-full" title={file.name}>
                    {file.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
            </CardContent>
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute -top-2 -right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(file)}
             >
                <Trash2 className="w-4 h-4" />
                <span className="sr-only">Remove file</span>
            </Button>
        </Card>
    </div>
  );
}
