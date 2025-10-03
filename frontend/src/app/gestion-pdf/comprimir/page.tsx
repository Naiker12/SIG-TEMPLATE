
'use client';

import { useState, useEffect } from 'react';
import { TopBar } from "@/components/dashboard/topbar";
import { FileUploadForm } from "@/components/gestion-pdf/file-upload-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, X, CheckCircle, Download, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { compressFiles } from '@/services/compressionService';
import { uploadFileMetadata } from '@/services/fileService';
import { saveAs } from 'file-saver';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { CircularProgressBar } from '@/components/ui/circular-progress-bar';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useAuthModal } from '@/hooks/use-auth-modal';
import { DashboardSidebar } from '@/components/dashboard/sidebar';

type CompressedInfo = {
  blob: Blob;
  size: number;
  originalSize: number;
};

const FILE_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB

export default function OptimizeFilePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [compressionLevel, setCompressionLevel] = useState([1]);
  const [compressedInfo, setCompressedInfo] = useState<CompressedInfo | null>(null);
  const [optimizationProgress, setOptimizationProgress] = useState<number | null>(null);
  const { toast } = useToast();
  const { isLoggedIn } = useAuthStore();
  const authModal = useAuthModal();

  useEffect(() => {
    if (compressionLevel[0] === 2) {
      toast({
        title: "Advertencia de Calidad",
        description: "La alta compresión puede reducir la calidad de las imágenes.",
        variant: "default",
      });
    }
  }, [compressionLevel, toast]);
  
  const handleFilesSelected = (newFiles: File[]) => {
    const totalSize = newFiles.reduce((acc, file) => acc + file.size, 0);
    
    if (!isLoggedIn && totalSize > FILE_SIZE_LIMIT) {
        toast({
            variant: "destructive",
            title: "Límite de tamaño excedido",
            description: "Has superado el límite de 50MB. Por favor, inicia sesión para subir archivos más grandes.",
        });
        authModal.onOpen();
        return;
    }

    const combinedFiles = [...files, ...newFiles];
    const uniqueFiles = Array.from(new Set(combinedFiles.map(f => f.name))).map(name => {
        return combinedFiles.find(f => f.name === name)!
    });

    setFiles(uniqueFiles);
    setCompressedInfo(null);
    if (newFiles.length > 0) {
      toast({
        title: "Archivos Listos",
        description: `Se han cargado ${newFiles.length} nuevo(s) archivo(s) para optimizar.`,
      });
    }
  };
  
  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(files.filter(f => f !== fileToRemove));
    if (files.length === 1) {
        setCompressedInfo(null);
    }
  };

  const handleOptimize = async () => {
    if (files.length === 0) return;
    setCompressedInfo(null);
    setOptimizationProgress(0);
    
    const progressInterval = setInterval(() => {
        setOptimizationProgress(prev => {
            if (prev === null) return 0;
            if (prev >= 95) return 95;
            return prev + 5;
        });
    }, 350);

    try {
      const originalSize = files.reduce((acc, file) => acc + file.size, 0);
      const zipBlob = await compressFiles(files, compressionLevel[0]);
      
      clearInterval(progressInterval);
      setOptimizationProgress(100);

      // Log metadata after successful compression
      try {
          await uploadFileMetadata({
              filename: files.length > 1 ? "archivos_comprimidos.zip" : files[0].name,
              fileType: files.length > 1 ? 'application/zip' : files[0].type,
              size: zipBlob.size,
              status: "COMPLETED",
          });
      } catch (metaError) {
           console.error("Failed to upload metadata:", metaError);
           toast({
              variant: "destructive",
              title: "Error de Metadatos",
              description: "Los archivos se comprimieron, pero no se pudo guardar el registro.",
           })
      }

      setTimeout(() => {
        setCompressedInfo({
            blob: zipBlob,
            size: zipBlob.size,
            originalSize,
        });
        toast({
            title: "Optimización Completa",
            description: "Tus archivos han sido comprimidos y están listos para descargar.",
        });
        setOptimizationProgress(null);
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      setOptimizationProgress(null);
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error de Optimización",
        description: error instanceof Error ? error.message : "Hubo un problema al comprimir los archivos. Inténtalo de nuevo.",
      });
    }
  };

  const handleDownload = () => {
    if (compressedInfo) {
      saveAs(compressedInfo.blob, "archivos_comprimidos.zip");
      toast({
        title: "Descarga Iniciada",
        description: "Tu archivo ZIP se está descargando.",
      });
      setCompressedInfo(null); 
      setFiles([]); 
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  
  const getCompressionLabel = (value: number) => {
    if (value === 0) return "Baja compresión";
    if (value === 2) return "Alta compresión";
    return "Compresión recomendada";
  }

  const reductionPercentage = compressedInfo ? 
    Math.round(((compressedInfo.originalSize - compressedInfo.size) / compressedInfo.originalSize) * 100)
    : 0;

  return (
    <>
      <div className="flex h-screen w-full">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
            <TopBar />
            <main className="flex-1 overflow-y-auto p-4 sm:px-6">
              <div className="max-w-4xl mx-auto w-full">
                <header className="mb-8 text-center">
                  <h1 className="text-4xl font-bold tracking-tight">Optimizar Archivos</h1>
                  <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Reduce el tamaño de tus archivos PDF, Word o imágenes. Sube tus archivos para empezar.
                  </p>
                </header>

                <Card className='shadow-lg border-2 border-accent'>
                  <CardContent className='p-6'>
                    {files.length === 0 && !compressedInfo && (
                        <FileUploadForm 
                          onFilesSelected={handleFilesSelected}
                          allowMultiple={true}
                          acceptedFileTypes={{
                            'application/pdf': ['.pdf'],
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                            'image/jpeg': ['.jpg', '.jpeg'],
                            'image/png': ['.png'],
                          }}
                          uploadHelpText="Sube archivos PDF, DOCX, JPG o PNG. Límite de 50MB para invitados."
                        />
                    )}

                    {files.length > 0 && !compressedInfo && (
                      <div className='space-y-6'>
                          <div className='flex justify-end'>
                             <FileUploadForm 
                                onFilesSelected={handleFilesSelected}
                                allowMultiple={true}
                                acceptedFileTypes={{
                                'application/pdf': ['.pdf'],
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                                'image/jpeg': ['.jpg', '.jpeg'],
                                'image/png': ['.png'],
                                }}
                                isButton={true}
                             />
                          </div>
                        
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

                        <div className="space-y-3 pt-6 border-t">
                            <h3 className='text-lg font-medium text-muted-foreground'>Archivos para optimizar:</h3>
                             {files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                                <div className="flex items-center gap-4 min-w-0">
                                  <FileText className="w-6 h-6 text-primary flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="font-semibold truncate">{file.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {formatBytes(file.size)}
                                    </p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(file)}>
                                  <X className="w-5 h-5 text-destructive" />
                                  <span className="sr-only">Remove file</span>
                                </Button>
                              </div>
                            ))}
                        </div>

                         <div className="flex justify-end pt-6 border-t">
                          <Button 
                            size="lg" 
                            className="w-full sm:w-auto" 
                            disabled={files.length === 0}
                            onClick={handleOptimize}
                          >
                            Optimizar {files.length} {files.length === 1 ? 'Archivo' : 'Archivos'}
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {compressedInfo && (
                      <div className="text-center py-8">
                        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Optimización Completa</h2>
                        <CardDescription className="mb-6">
                          Tus archivos se han comprimido con éxito.
                        </CardDescription>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center my-6">
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">Tamaño Original</p>
                                <p className="text-xl font-bold">{formatBytes(compressedInfo.originalSize)}</p>
                            </div>
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">Tamaño Optimizado</p>
                                <p className="text-xl font-bold">{formatBytes(compressedInfo.size)}</p>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg border border-green-500/50">
                                <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-1"><TrendingDown />Reducción</p>
                                <p className="text-xl font-bold text-green-600 dark:text-green-300">{reductionPercentage}%</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-8">
                            <Button 
                              size="lg" 
                              variant="outline"
                              className="w-full sm:w-auto"
                              onClick={() => {
                                setFiles([]);
                                setCompressedInfo(null);
                              }}
                            >
                              Optimizar Nuevos Archivos
                            </Button>
                            <Button 
                              size="lg" 
                              className="w-full sm:w-auto" 
                              onClick={handleDownload}
                            >
                              <Download className="mr-2" /> Descargar ZIP
                            </Button>
                          </div>
                      </div>
                    )}

                  </CardContent>
                </Card>
              </div>
            </main>
        </div>
      </div>

       <AnimatePresence>
        {optimizationProgress !== null && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
                <CircularProgressBar 
                    progress={optimizationProgress}
                    message={optimizationProgress < 100 ? "Optimizando archivos..." : "Finalizando..."}
                />
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
