
'use client';

import { useState } from "react";
import { TopBar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploadForm } from "@/components/gestion-pdf/file-upload-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DraggableFileItem } from "@/components/gestion-pdf/draggable-file-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, X, HardDriveDownload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { splitPdf, mergePdfs } from "@/services/pdfManipulationService";
import { saveAs } from "file-saver";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { AnimatePresence, motion } from 'framer-motion';
import { CircularProgressBar } from '@/components/ui/circular-progress-bar';

type ProcessResult = {
  blob: Blob;
  size: number;
  fileName: string;
};

const FILE_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};


export default function SplitMergePdfPage() {
  const [activeTab, setActiveTab] = useState('split');
  const { toast } = useToast();
  const { isLoggedIn } = useAuthStore();
  const authModal = useAuthModal();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  // State for Split
  const [splitFile, setSplitFile] = useState<File[]>([]);
  const [pageRanges, setPageRanges] = useState("");

  // State for Merge
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  
  // Shared state for processing result
  const [processResult, setProcessResult] = useState<ProcessResult | null>(null);

  const handleFileRemove = (fileToRemove: File, type: 'split' | 'merge') => {
    if (type === 'split') {
        setSplitFile([]);
    } else {
        setMergeFiles(files => files.filter(f => f.name !== fileToRemove.name));
    }
  }

  const handleFilesSelected = (newFiles: File[], type: 'split' | 'merge') => {
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
      
      setProcessResult(null);
      if (type === 'split') {
        setSplitFile(newFiles.slice(0, 1));
      } else {
         const combined = [...mergeFiles, ...newFiles];
         const unique = Array.from(new Map(combined.map(f => [f.name, f])).values());
         setMergeFiles(unique);
      }
      if (newFiles.length > 0) {
        toast({ title: "Archivos listos", description: `${newFiles.length} archivo(s) cargado(s).`});
      }
  }

  const handleDragEnd = (result: File[]) => {
    setMergeFiles(result);
  };
  
  const handleProcess = async () => {
    setProcessResult(null);
    setIsProcessing(true);
    setProcessingProgress(0);

    const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
            if (prev >= 95) {
                clearInterval(progressInterval);
                return 95;
            }
            return prev + 5;
        });
    }, 200);
    
    try {
        let blob: Blob;
        let fileName: string;

        if (activeTab === 'split') {
            if (splitFile.length === 0 || !pageRanges) {
                throw new Error("Por favor, sube un archivo y especifica los rangos de páginas.");
            }
            blob = await splitPdf(splitFile[0], pageRanges);
            fileName = "pdf_dividido.pdf";
        } else {
            if (mergeFiles.length < 2) {
                throw new Error("Por favor, sube al menos dos archivos para unir.");
            }
            blob = await mergePdfs(mergeFiles);
            fileName = "pdf_unido.pdf";
        }
        
        clearInterval(progressInterval);
        setProcessingProgress(100);

        setTimeout(() => {
          setProcessResult({ blob, size: blob.size, fileName });
          toast({ title: "Proceso Completo", description: "Tu archivo está listo para descargar." });
          setIsProcessing(false);
        }, 500);

    } catch (error) {
        console.error(error);
        clearInterval(progressInterval);
        setIsProcessing(false);
        toast({
            variant: "destructive",
            title: "Error en el Proceso",
            description: error instanceof Error ? error.message : "Ocurrió un problema. Inténtalo de nuevo.",
        });
    }
  }

  const handleDownload = () => {
    if (processResult) {
      saveAs(processResult.blob, processResult.fileName);
      toast({ title: "Descarga Iniciada" });
      resetState();
    }
  };

  const resetState = () => {
    setSplitFile([]);
    setMergeFiles([]);
    setPageRanges("");
    setProcessResult(null);
  }
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const isSplitButtonDisabled = splitFile.length === 0 || !pageRanges.trim();
  const isMergeButtonDisabled = mergeFiles.length < 2;

  const renderContent = () => {
    if (processResult) {
        return (
             <motion.div 
                key="result" 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center py-8 w-full max-w-lg mx-auto"
              >
                <h2 className="text-3xl font-bold mb-2">Proceso Completado</h2>
                <CardDescription className="mb-8">Tu archivo ha sido procesado con éxito.</CardDescription>
                
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center my-6">
                    <div className="bg-muted/50 p-4 rounded-lg border">
                        <p className="text-sm text-muted-foreground">Archivos Procesados</p>
                        <p className="text-2xl font-bold">{activeTab === 'split' ? 1 : mergeFiles.length}</p>
                    </div>
                     <div className="bg-muted/50 p-4 rounded-lg border">
                        <p className="text-sm text-muted-foreground">Tamaño Final</p>
                        <p className="text-2xl font-bold">{formatBytes(processResult.size)}</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-10">
                   <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={resetState}>Empezar de Nuevo</Button>
                   <Button size="lg" className="w-full sm:w-auto" onClick={handleDownload}><HardDriveDownload className="mr-2"/>Descargar Archivo</Button>
                </div>
            </motion.div>
        )
    }

    if (activeTab === 'split') {
        return (
             <motion.div key="split-form" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                {splitFile.length === 0 ? (
                   <FileUploadForm 
                      onFilesSelected={(files) => handleFilesSelected(files, 'split')}
                      acceptedFileTypes={{'application/pdf': ['.pdf']}}
                      uploadHelpText="Sube un archivo PDF para dividir. Límite de 50MB para invitados."
                    />
                ) : (
                  <div className='space-y-8 max-w-lg mx-auto'>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                        <div className="flex items-center gap-4 min-w-0">
                            <FileText className="w-6 h-6 text-primary flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="font-semibold truncate">{splitFile[0].name}</p>
                                <p className="text-sm text-muted-foreground">{formatBytes(splitFile[0].size)}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleFileRemove(splitFile[0], 'split')}>
                            <X className="w-5 h-5 text-destructive" /><span className="sr-only">Quitar</span>
                        </Button>
                    </div>
                   <div className="space-y-3 pt-8 border-t">
                      <Label htmlFor="ranges" className="text-lg font-medium">Rangos de Páginas</Label>
                      <Input id="ranges" placeholder="Ej: 1-3, 5, 8-10" value={pageRanges} onChange={(e) => setPageRanges(e.target.value)} />
                      <p className="text-sm text-muted-foreground">
                        Define las páginas o rangos a extraer. Sepáralos con comas.
                      </p>
                    </div>
                    <div className="flex justify-center md:justify-end pt-8 border-t">
                      <Button size="lg" className="w-full md:w-auto" onClick={handleProcess} disabled={isSplitButtonDisabled}>Dividir PDF</Button>
                    </div>
                  </div>
                )}
            </motion.div>
        );
    }

     if (activeTab === 'merge') {
        return (
             <motion.div key="merge-form" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                 <FileUploadForm 
                   allowMultiple
                   onFilesSelected={(files) => handleFilesSelected(files, 'merge')}
                   acceptedFileTypes={{'application/pdf': ['.pdf']}}
                   uploadHelpText="Sube o arrastra archivos PDF para unirlos. Límite de 50MB para invitados."
                   isButton={mergeFiles.length > 0}
                 />
               {mergeFiles.length > 0 && (
                 <div className='space-y-8 mt-8'>
                    <div className="text-center">
                        <h3 className="text-xl font-semibold">Ordenar Archivos</h3>
                        <p className="text-muted-foreground">Arrastra los archivos para establecer el orden final de unión.</p>
                      </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {mergeFiles.map((file, index) => (
                        <DraggableFileItem 
                          key={file.name}
                          file={file}
                          index={index}
                          files={mergeFiles}
                          onRemove={(f) => handleFileRemove(f, 'merge')}
                          onDragEnd={handleDragEnd}
                        />
                      ))}
                    </div>
                    <div className="flex justify-center pt-8 border-t">
                       <Button size="lg" className="w-full md:w-auto" onClick={handleProcess} disabled={isMergeButtonDisabled}>Unir {mergeFiles.length} PDFs</Button>
                    </div>
                 </div>
               )}
            </motion.div>
        );
    }
    return null;
  }

  return (
    <>
      <TopBar />
      <main className="flex-1 gap-4 p-4 sm:px-6 md:gap-8 pb-16">
        <AnimatePresence>
            {isProcessing && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
                >
                    <CircularProgressBar progress={processingProgress} message={activeTab === 'split' ? 'Dividiendo PDF...' : 'Uniendo PDFs...'}/>
                </motion.div>
            )}
        </AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto w-full">
            <header className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Dividir y Unir PDF</h1>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Organiza tus documentos PDF dividiendo archivos grandes o uniendo varios archivos en uno solo.
              </p>
            </header>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-center mb-8">
                    <TabsList className="grid grid-cols-2 w-full max-w-md">
                    <TabsTrigger value="split">Dividir PDF</TabsTrigger>
                    <TabsTrigger value="merge">Unir PDF</TabsTrigger>
                    </TabsList>
                </div>
                
                <Card className="shadow-lg mt-6 border-2 border-accent rounded-2xl">
                    <CardContent className="p-6 md:p-10 flex items-center justify-center min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {renderContent()}
                        </AnimatePresence>
                    </CardContent>
                </Card>
              </Tabs>
          </motion.div>
      </main>
    </>
  );
}
