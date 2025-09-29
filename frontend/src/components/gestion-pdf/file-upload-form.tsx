
"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";

type FileUploadFormProps = {
  acceptedFileTypes?: { [key: string]: string[] };
  allowMultiple?: boolean;
  uploadHelpText?: string;
  onFilesSelected: (files: File[]) => void;
};

const defaultAcceptedFileTypes = {
  'application/pdf': ['.pdf'],
};

export function FileUploadForm({ 
  acceptedFileTypes = defaultAcceptedFileTypes, 
  allowMultiple = false,
  uploadHelpText = "Solo se permiten archivos PDF de hasta 50MB.",
  onFilesSelected,
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
    if (event.dataTransfer.files) {
       const newFiles = Array.from(event.dataTransfer.files);
       onFilesSelected(newFiles);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const acceptString = useMemo(() => Object.keys(acceptedFileTypes).join(','), [acceptedFileTypes]);

  return (
    <div className="w-full">
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
    </div>
  );
}
