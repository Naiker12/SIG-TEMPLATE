
"use client";

import { useMemo, useId } from "react";
import { Button } from "@/components/ui/button";
import { FileUp, PlusCircle } from "lucide-react";

type FileUploadFormProps = {
  acceptedFileTypes?: { [key: string]: string[] };
  allowMultiple?: boolean;
  uploadHelpText?: string;
  onFilesSelected: (files: File[]) => void;
  isButton?: boolean;
};

const defaultAcceptedFileTypes = {
  'application/pdf': ['.pdf'],
};

export function FileUploadForm({ 
  acceptedFileTypes = defaultAcceptedFileTypes, 
  allowMultiple = false,
  uploadHelpText = "Solo se permiten archivos PDF de hasta 50MB.",
  onFilesSelected,
  isButton = false,
}: FileUploadFormProps) {

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      onFilesSelected(newFiles);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && !isButton) {
       const newFiles = Array.from(event.dataTransfer.files);
       onFilesSelected(newFiles);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const acceptString = useMemo(() => Object.keys(acceptedFileTypes).join(','), [acceptedFileTypes]);

  const uniqueId = useId();
  const fileInputId = `file-upload-${uniqueId}`;

  if (isButton) {
    return (
        <div>
            <Button type="button" variant="outline" onClick={(e) => { e.stopPropagation(); document.getElementById(fileInputId)?.click(); }}>
                <PlusCircle className="mr-2 h-4 w-4"/> Añadir más archivos
            </Button>
            <input
                type="file"
                id={fileInputId}
                className="hidden"
                onChange={handleFileChange}
                accept={acceptString}
                multiple={allowMultiple}
            />
        </div>
    );
  }

  return (
    <div className="w-full">
        <div
          className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl text-center cursor-pointer hover:border-primary transition-colors"
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById(fileInputId)?.click()}
        >
          <FileUp className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Arrastra y suelta tus archivos aquí</h3>
          <p className="text-muted-foreground mb-4">o</p>
          <Button type="button" onClick={(e) => { e.stopPropagation(); document.getElementById(fileInputId)?.click(); }}>
            Seleccionar Archivos
          </Button>
          <input
            type="file"
            id={fileInputId}
            className="hidden"
            onChange={handleFileChange}
            accept={acceptString}
            multiple={allowMultiple}
          />
          <p className="text-xs text-muted-foreground mt-4">{uploadHelpText}</p>
        </div>
    </div>
  );
}
