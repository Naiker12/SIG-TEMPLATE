
'use client';

import { useState, useEffect } from "react";
import { TopBar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploadForm } from "@/components/gestion-pdf/file-upload-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DraggableFileItem } from "@/components/gestion-pdf/draggable-file-item";
import { FileText, X, HardDriveDownload, Rows3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { splitPdf, mergePdfs, generatePdfPreview, getPdfPageCount } from "@/services/pdfManipulationService";
import { saveAs } from "file-saver";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { AnimatePresence, motion } from 'framer-motion';
import { CircularProgressBar } from '@/components/ui/circular-progress-bar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PdfPageSelector } from "@/components/gestion-pdf/PdfPageSelector";


type ProcessResult = {
  blob: Blob;
  size: number;
  fileName: string;
};

type MergeFile = {
    file: File;
    id: string;
    previewUrl?: string;
    isLoadingPreview: boolean;
};

type SplitFileInfo = {
    file: File;
    previewUrl?: string;
    pageCount: number;
    isLoading: boolean;
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
  const [splitFileInfo, setSplitFileInfo] = useState<SplitFileInfo | null>(null);
  const [pageRanges, setPageRanges] = useState("");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  // State for Merge
  const [mergeFiles, setMergeFiles] = useState<MergeFile[]>([]);
  
  // Shared state for processing result
  const [processResult, setProcessResult] = useState<ProcessResult | null>(null);

  useEffect(() => {
    // Generate range string from selected pages
    if (selectedPages.length > 0) {
      const sorted = [...selectedPages].sort((a, b) => a - b);
      const ranges: (string | number)[] = [];
      let start = sorted[0];

      for (let i = 0; i < sorted.length; i++) {
        const current = sorted[i];
        const next = sorted[i + 1];

        if (next !== current + 1) {
          if (start === current) {
            ranges.push(current);
          } else {
            ranges.push(`${start}-${current}`);
          }
          if (next) {
            start = next;
          }
        }
      }
      setPageRanges(ranges.join(','));
    } else {
      setPageRanges('');
    }
  }, [selectedPages]);

  const handleFileRemove = (fileIdToRemove: string, type: 'split' | 'merge') => {
    if (type === 'split') {
        setSplitFileInfo(null);
        setPageRanges('');
        setSelectedPages([]);
    } else {
        setMergeFiles(files => files.filter(f => f.id !== fileIdToRemove));
    }
  }

  const handleFilesSelected = async (newFiles: File[], type: 'split' | 'merge') => {
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
        const file = newFiles[0];
        setSplitFileInfo({ file, isLoading: true, pageCount: 0 });
        try {
            const [previewUrl, pageCount] = await Promise.all([
                generatePdfPreview(file),
                getPdfPageCount(file)
            ]);
            setSplitFileInfo({ file, previewUrl, pageCount, isLoading: false });
        } catch (err) {
            console.error(err);
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo procesar el PDF.' });
            setSplitFileInfo(null);
        }
      } else {
         const newMergeFiles: MergeFile[] = newFiles.map(file => ({
            file,
            id: `${file.name}-${file.lastModified}`,
            isLoadingPreview: true
         }));
         
         const combined = [...mergeFiles, ...newMergeFiles];
         const unique = Array.from(new Map(combined.map(f => [f.id, f])).values());
         setMergeFiles(unique);
      }
      if (newFiles.length > 0) {
        toast({ title: "Archivos listos", description: `${newFiles.length} archivo(s) cargado(s).`});
      }
  }

  const handleDragEnd = (result: MergeFile[]) => {
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
            if (!splitFileInfo || !pageRanges) {
                throw new Error("Por favor, sube un archivo y especifica los rangos de páginas.");
            }
            blob = await splitPdf(splitFileInfo.file, pageRanges);
            fileName = "pdf_dividido.pdf";
        } else {
            if (mergeFiles.length < 2) {
                throw new Error("Por favor, sube al menos dos archivos para unir.");
            }
            blob = await mergePdfs(mergeFiles.map(mf => mf.file));
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
    setSplitFileInfo(null);
    setMergeFiles([]);
    setPageRanges("");
    setSelectedPages([]);
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

  const isSplitButtonDisabled = !splitFileInfo || !pageRanges.trim();
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
                {!splitFileInfo ? (
                   <FileUploadForm 
                      onFilesSelected={(files) => handleFilesSelected(files, 'split')}
                      acceptedFileTypes={{'application/pdf': ['.pdf']}}
                      uploadHelpText="Sube un archivo PDF para dividir. Límite de 50MB para invitados."
                    />
                ) : (
                  <div className='space-y-8 max-w-lg mx-auto'>
                    <Card className="bg-muted/40 hover:bg-muted/70 hover:border-primary/50 transition-all shadow-md">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4 min-w-0">
                                {splitFileInfo.previewUrl && (
                                     <img src={splitFileInfo.previewUrl} alt={`Preview of ${splitFileInfo.file.name}`} className="object-contain h-20 w-16 rounded-md bg-background" />
                                )}
                                <div className="min-w-0">
                                    <p className="font-semibold truncate">{splitFileInfo.file.name}</p>
                                    <p className="text-sm text-muted-foreground">{formatBytes(splitFileInfo.file.size)}</p>
                                    <p className="text-sm text-muted-foreground">{splitFileInfo.pageCount} páginas</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleFileRemove(splitFileInfo.file.name, 'split')}>
                                <X className="w-5 h-5 text-destructive" /><span className="sr-only">Quitar</span>
                            </Button>
                        </CardContent>
                    </Card>

                   <div className="space-y-3 pt-8 border-t">
                      <Label htmlFor="ranges" className="text-lg font-medium">Rangos de Páginas</Label>
                        <div className="flex gap-2">
                          <Input id="ranges" placeholder="Ej: 1-3, 5, 8-10" value={pageRanges} onChange={(e) => setPageRanges(e.target.value)} />
                           <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline"><Rows3 className="mr-2 h-4 w-4"/>Seleccionar</Button>
                            </DialogTrigger>
                             <DialogContent className="max-w-4xl h-[80vh]">
                                <DialogHeader>
                                  <DialogTitle>Seleccionar Páginas</DialogTitle>
                                  <DialogDescription>Haz clic en las páginas que quieres extraer. Las seleccionadas se añadirán al campo de rangos.</DialogDescription>
                                </DialogHeader>
                                 <PdfPageSelector 
                                    file={splitFileInfo.file} 
                                    pageCount={splitFileInfo.pageCount} 
                                    selectedPages={selectedPages} 
                                    onSelectedPagesChange={setSelectedPages} 
                                 />
                              </DialogContent>
                          </Dialog>
                        </div>
                      <p className="text-sm text-muted-foreground">
                        Define las páginas o rangos a extraer, o selecciónalas visualmente.
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
                      {mergeFiles.map((mergeFile, index) => (
                        <DraggableFileItem 
                          key={mergeFile.id}
                          mergeFile={mergeFile}
                          index={index}
                          files={mergeFiles}
                          onRemove={(fileId) => handleFileRemove(fileId, 'merge')}
                          onDragEnd={handleDragEnd}
                          setMergeFiles={setMergeFiles}
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
