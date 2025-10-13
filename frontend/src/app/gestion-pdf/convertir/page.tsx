
'use client';

import { useState } from 'react';
import { TopBar } from "@/components/dashboard/topbar";
import { FileUploadForm } from "@/components/gestion-pdf/file-upload-form";
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { FileText, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { convertPdfToWord, type ConversionResult } from '@/services/conversionService';
import { useToast } from '@/hooks/use-toast';
import { saveAs } from 'file-saver';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useAuthModal } from '@/hooks/use-auth-modal';
import { AnimatePresence, motion } from 'framer-motion';
import { CircularProgressBar } from '@/components/ui/circular-progress-bar';

const FILE_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB

export default function ConvertPdfToWordPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [convertedInfo, setConvertedInfo] = useState<ConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const { toast } = useToast();
  const { isLoggedIn } = useAuthStore();
  const authModal = useAuthModal();

  const handleFilesSelected = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== newFiles.length) {
      toast({
        variant: "destructive",
        title: "Archivos no válidos",
        description: "Solo se pueden seleccionar archivos PDF para esta conversión.",
      });
    }

    const totalSize = pdfFiles.reduce((acc, file) => acc + file.size, 0);
    if (!isLoggedIn && totalSize > FILE_SIZE_LIMIT) {
        toast({
            variant: "destructive",
            title: "Límite de tamaño excedido",
            description: "Has superado el límite de 50MB. Por favor, inicia sesión para subir archivos más grandes.",
        });
        authModal.onOpen();
        return;
    }

    const combinedFiles = [...files, ...pdfFiles];
    const uniqueFiles = Array.from(new Set(combinedFiles.map(f => f.name))).map(name => {
        return combinedFiles.find(f => f.name === name)!
    });

    setFiles(uniqueFiles);
    setConvertedInfo(null);
    if (pdfFiles.length > 0) {
      toast({
        title: "Archivos Listos",
        description: `Se han cargado ${pdfFiles.length} nuevo(s) archivo(s) para convertir.`,
      });
    }
  };
  
  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(files.filter(f => f !== fileToRemove));
    if (files.length === 1) {
        setConvertedInfo(null);
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setConvertedInfo(null);
    setIsConverting(true);
    setConversionProgress(0);

    const progressInterval = setInterval(() => {
        setConversionProgress(prev => {
            if (prev >= 95) {
                clearInterval(progressInterval);
                return 95;
            }
            return prev + 5;
        });
    }, 200);

    try {
      const result = await convertPdfToWord(files);
      
      clearInterval(progressInterval);
      setConversionProgress(100);

      setTimeout(() => {
        setConvertedInfo(result);
        toast({
          title: "Conversión Completa",
          description: "Tus archivos han sido convertidos a Word y están listos para descargar.",
        });
        setIsConverting(false);
      }, 500);

    } catch (error) {
      console.error(error);
      clearInterval(progressInterval);
      setIsConverting(false);
      toast({
        variant: "destructive",
        title: "Error de Conversión",
        description: error instanceof Error ? error.message : "Hubo un problema al convertir los archivos. Inténtalo de nuevo.",
      });
    }
  };
  
  const handleDownload = () => {
    if (convertedInfo) {
      saveAs(convertedInfo.blob, convertedInfo.filename);
      toast({
        title: "Descarga Iniciada",
        description: `Tu archivo ${convertedInfo.filename} se está descargando.`,
      });
      setConvertedInfo(null); 
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
  };

  const isZip = convertedInfo?.contentType === 'application/zip';

  return (
    <>
      <TopBar />
      <main className="flex-1 gap-4 p-4 sm:px-6 md:gap-8 pb-8">
        <AnimatePresence>
            {isConverting && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                >
                    <CircularProgressBar progress={conversionProgress} message="Convirtiendo a Word..." />
                </motion.div>
            )}
        </AnimatePresence>
        <div className="max-w-4xl mx-auto w-full">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Convertir PDF a Word</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Sube tus archivos PDF para convertirlos a formato Word (.docx) editable.
            </p>
          </header>

          <Card className='shadow-lg border-2 border-accent min-h-[400px]'>
            <CardContent className='p-6 flex items-center justify-center'>
               <AnimatePresence mode="wait">
                  {files.length === 0 && !convertedInfo ? (
                      <motion.div key="upload" className="w-full">
                        <FileUploadForm 
                          onFilesSelected={handleFilesSelected}
                          allowMultiple={true}
                          acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
                          uploadHelpText="Sube archivos PDF. Límite de 50MB para invitados."
                        />
                      </motion.div>
                  ) : !convertedInfo ? (
                     <motion.div key="files" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-6">
                        <div className='flex justify-end'>
                           <FileUploadForm 
                              onFilesSelected={handleFilesSelected}
                              allowMultiple={true}
                              acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
                              isButton={true}
                           />
                        </div>
                      
                      <div className="space-y-3 pt-6 border-t">
                          <h3 className='text-lg font-medium text-muted-foreground'>Archivos para convertir:</h3>
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
                          onClick={handleConvert}
                        >
                          Convertir {files.length} {files.length === 1 ? 'Archivo' : 'Archivos'}
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 w-full">
                       <h2 className="text-2xl font-bold mb-2">Conversión Completa</h2>
                        <CardDescription className="mb-6">
                          Tus archivos se han convertido a Word con éxito.
                        </CardDescription>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center my-6 max-w-md mx-auto">
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">Archivos Convertidos</p>
                                <p className="text-xl font-bold">{files.length}</p>
                            </div>
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground">Tamaño Final</p>
                                <p className="text-xl font-bold">{formatBytes(convertedInfo.blob.size)}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-8">
                          <Button 
                            size="lg" 
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => {
                              setFiles([]);
                              setConvertedInfo(null);
                            }}
                          >
                            Convertir Nuevos Archivos
                          </Button>
                          <Button 
                            size="lg" 
                            className="w-full sm:w-auto" 
                            onClick={handleDownload}
                          >
                            <Download className="mr-2" /> 
                            {isZip ? 'Descargar ZIP' : 'Descargar DOCX'}
                          </Button>
                        </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
