'use client';

import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { FileUploadForm } from "@/components/gestion-pdf/file-upload-form";
import { Card, CardContent } from '@/components/ui/card';
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { compressFiles } from '@/lib/api';
import { saveAs } from 'file-saver'; 

export default function OptimizeFilePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [compressedZipBlob, setCompressedZipBlob] = useState<Blob | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(newFiles);
    setCompressedZipBlob(null);
  };
  
  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(files.filter(f => f !== fileToRemove));
    setCompressedZipBlob(null);
  };

  const handleOptimize = async () => {
    setLoading(true);
    setCompressedZipBlob(null); 
    try {
      const zipBlob = await compressFiles(files);
      setCompressedZipBlob(zipBlob);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al optimizar los archivos");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (compressedZipBlob) {
      saveAs(compressedZipBlob, "archivos_comprimidos.zip");
      setCompressedZipBlob(null); 
      setFiles([]); 
    }
  };

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <DashboardSidebar />
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen bg-background">
          <TopBar />
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight">Optimizar Archivos</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Reduce el tamaño de tus archivos PDF, Word o imágenes. Sube tus archivos para empezar.
                </p>
              </header>

              <Card className='shadow-lg border-2 border-accent'>
                <CardContent className='p-6'>
                   <FileUploadForm 
                    action="compress" 
                    onFilesSelected={handleFilesSelected}
                    files={files}
                    allowMultiple={true}
                    acceptedFileTypes={{
                      'application/pdf': ['.pdf'],
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                      'image/jpeg': ['.jpg', '.jpeg'],
                      'image/png': ['.png'],
                    }}
                    uploadHelpText="Sube archivos PDF, DOCX, JPG o PNG de hasta 50MB."
                  />

                  {files.length > 0 && !compressedZipBlob && (
                    <div className='mt-6 space-y-3'>
                      <h3 className='text-lg font-medium text-muted-foreground'>Archivos para optimizar:</h3>
                       {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                          <div className="flex items-center gap-4 min-w-0">
                            <FileText className="w-6 h-6 text-primary flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-semibold truncate">{file.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(file)}>
                            <X className="w-5 h-5 text-destructive" />

                            <span className="sr-only">Remove file</span>
                          </Button>
                        </div>
                      ))}

                       <div className="flex justify-end pt-6 border-t mt-6">
                        <Button 
                          size="lg" 
                          className="w-full sm:w-auto" 
                          disabled={files.length === 0 || loading}
                          onClick={handleOptimize}
                        >
                          {loading ? "Optimizando..." : `Optimizar ${files.length} Archivos`}
                        </Button>
                      </div>
                    </div>
                  )}

                  {compressedZipBlob && (
                    <div className='mt-6 space-y-3'>
                      <h3 className='text-lg font-medium text-muted-foreground'>Archivos Comprimidos Listos:</h3>
                      <div className="flex justify-end pt-6 border-t mt-6">
                        <div className="flex gap-4">
                            <Button 
                              size="lg" 
                              variant="outline"
                              onClick={() => {
                                setFiles([]);
                                setCompressedZipBlob(null);
                              }}
                            >
                              Optimizar Nuevos Archivos
                            </Button>
                            <Button 
                              size="lg" 
                              className="w-full sm:w-auto" 
                              onClick={handleDownload}
                            >
                              Descargar ZIP
                            </Button>
                          </div>
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
