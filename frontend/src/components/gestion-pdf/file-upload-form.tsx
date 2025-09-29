
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, FileText, X, Image, FileType } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

type FileUploadFormProps = {
  action: 'compress' | 'convert' | 'split' | 'merge';
  acceptedFileTypes?: { [key: string]: string[] };
  allowMultiple?: boolean;
  uploadHelpText?: string;
  files: File[];
  onFilesSelected: (files: File[]) => void;
};

const defaultAcceptedFileTypes = {
  'application/pdf': ['.pdf'],
};

const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
        return <Image className="w-8 h-8 text-primary" />;
    }
    if (fileType.includes('pdf')) {
        return <FileText className="w-8 h-8 text-primary" />;
    }
    return <FileType className="w-8 h-8 text-primary" />;
};


export function FileUploadForm({ 
  action,
  acceptedFileTypes = defaultAcceptedFileTypes, 
  allowMultiple = false,
  uploadHelpText = "Solo se permiten archivos PDF de hasta 50MB.",
  files,
  onFilesSelected
}: FileUploadFormProps) {
  const [compressionLevel, setCompressionLevel] = useState([1]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      if (allowMultiple) {
        const updatedFiles = [...files, ...newFiles];
        onFilesSelected(updatedFiles);
      } else {
        onFilesSelected([newFiles[0]]);
      }
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
       const newFiles = Array.from(event.dataTransfer.files);
       if (allowMultiple) {
        const updatedFiles = [...files, ...newFiles];
        onFilesSelected(updatedFiles);
      } else {
        onFilesSelected([newFiles[0]]);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const getCompressionLabel = (value: number) => {
    if (value === 0) return "Baja compresión (Alta calidad)";
    if (value === 2) return "Alta compresión (Calidad optimizada)";
    return "Compresión recomendada";
  }
  
  const getButtonText = () => {
    switch(action) {
      case 'compress': return 'Añadir más archivos';
      case 'convert': return 'Convertir a PDF';
      case 'split': return 'Dividir PDF';
      case 'merge': return 'Añadir más archivos';
    }
  }
  
  const acceptString = useMemo(() => Object.keys(acceptedFileTypes).join(','), [acceptedFileTypes]);
  
  const showCompressionSlider = useMemo(() => {
    if (action !== 'compress' || files.length === 0) return false;
    // For multi-file, we can show slider if at least one is image/pdf
    return files.some(f => f.type.startsWith('image/') || f.type.includes('pdf'));
  }, [files, action]);


  if (allowMultiple && files.length > 0) {
     return (
       <>
        <div className="flex flex-col items-center justify-center p-6 text-center">
            <Button type="button" size="lg" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                <FileUp className="mr-2" />
                {getButtonText()}
            </Button>
            <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept={acceptString}
                multiple={allowMultiple}
              />
        </div>
        {showCompressionSlider && (
          <div className="space-y-4 pt-4 border-t mt-6">
            <div className="flex justify-between items-center">
              <Label htmlFor="compression" className="text-lg font-medium">Nivel de Compresión</Label>
              <span className="text-muted-foreground font-medium">{getCompressionLabel(compressionLevel[0])}</span>
            </div>
            <Slider
              id="compression"
              min={0}
              max={2}
              step={1}
              value={compressionLevel}
              onValueChange={setCompressionLevel}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Menos</span>
              <span>Recomendado</span>
              <span>Más</span>
            </div>
          </div>
        )}
       </>
     )
  }

  return (
    <div className="w-full">
      {files.length === 0 && (
        <div
          className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl text-center cursor-pointer hover:border-primary transition-colors"
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <FileUp className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Arrastra y suelta tus archivos aquí</h3>
          <p className="text-muted-foreground mb-4">o</p>
          <Button type="button" onClick={(e) => { e.stopPropagation(); document.getElementById('file-upload')?.click(); }}>
            Seleccionar Archivos
          </Button>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept={acceptString}
            multiple={allowMultiple}
          />
          <p className="text-xs text-muted-foreground mt-4">{uploadHelpText}</p>
        </div>
      )}
       {!allowMultiple && files.length > 0 && (
        <div className="space-y-6">
          {showCompressionSlider && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <Label htmlFor="compression" className="text-lg font-medium">Nivel de Compresión</Label>
                <span className="text-muted-foreground font-medium">{getCompressionLabel(compressionLevel[0])}</span>
              </div>
              <Slider
                id="compression"
                min={0}
                max={2}
                step={1}
                value={compressionLevel}
                onValueChange={setCompressionLevel}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Menos</span>
                <span>Recomendado</span>
                <span>Más</span>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-6 border-t mt-6">
              <Button size="lg" className="w-full sm:w-auto" disabled={files.length === 0}>
                Optimizar Archivo
              </Button>
          </div>
        </div>
      )}
    </div>
  );
}
