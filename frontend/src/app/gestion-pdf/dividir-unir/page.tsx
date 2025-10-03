'use client';

import { useState } from "react";
import { TopBar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploadForm } from "@/components/gestion-pdf/file-upload-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DraggableFileItem } from "@/components/gestion-pdf/draggable-file-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, X, Download, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { CircularProgressBar } from "@/components/ui/circular-progress-bar";
import { splitPdf, mergePdfs } from "@/services/pdfManipulationService";
import { saveAs } from "file-saver";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

type ProcessResult = {
  blob: Blob;
  size: number;
  fileName: string;
};

const FILE_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB

export default function SplitMergePdfPage() {
  const [activeTab, setActiveTab] = useState('split');
  const { toast } = useToast();
  const { isLoggedIn } = useAuthStore();
  const authModal = useAuthModal();
  
  // State for Split
  const [splitFile, setSplitFile] = useState<File[]>([]);
  const [pageRanges, setPageRanges] = useState("");

  // State for Merge
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  
  // Shared state for processing
  const [processResult, setProcessResult] = useState<ProcessResult | null>(null);
  const [processProgress, setProcessProgress] = useState<number | null>(null);

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
    setProcessProgress(0);

    const progressInterval = setInterval(() => {
        setProcessProgress(prev => {
            if (prev === null) return 0;
            if (prev >= 95) return 95;
            return prev + 5;
        });
    }, 400);
    
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
        setProcessProgress(100);

        setTimeout(() => {
            setProcessResult({ blob, size: blob.size, fileName });
            toast({ title: "Proceso Completo", description: "Tu archivo está listo para descargar." });
            setProcessProgress(null);
        }, 500);

    } catch (error) {
        clearInterval(progressInterval);
        setProcessProgress(null);
        console.error(error);
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

  return (
    <>
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <DashboardSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <TopBar />
            <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div className="max-w-4xl mx-auto w-full">
                  <header className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight">Dividir y Unir PDF</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                      Organiza tus documentos PDF dividiendo archivos grandes o uniendo varios archivos en uno solo.
                    </p>
                  </header>

                  {processResult ? (
                     <Card className="shadow-lg border-2 border-accent text-center">
                        <CardContent className="p-8">
                            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Proceso Completado</h2>
                            <p className="text-muted-foreground mb-6">Tu archivo ha sido procesado con éxito.</p>
                             <div className="bg-muted p-4 rounded-lg max-w-sm mx-auto">
                                <p className="text-sm text-muted-foreground">Tamaño del archivo final</p>
                                <p className="text-xl font-bold">{formatBytes(processResult.size)}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-8">
                               <Button size="lg" variant="outline" onClick={resetState}>Empezar de Nuevo</Button>
                               <Button size="lg" onClick={handleDownload}><Download className="mr-2"/>Descargar Archivo</Button>
                            </div>
                        </CardContent>
                     </Card>
                  ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="split">Dividir PDF</TabsTrigger>
                        <TabsTrigger value="merge">Unir PDF</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="split">
                        <Card className="shadow-lg mt-6 border-2 border-accent">
                          <CardContent className="p-6">
                            {splitFile.length === 0 ? (
                               <FileUploadForm 
                                  onFilesSelected={(files) => handleFilesSelected(files, 'split')}
                                  acceptedFileTypes={{'application/pdf': ['.pdf']}}
                                  uploadHelpText="Sube un archivo PDF para dividir. Límite de 50MB para invitados."
                                />
                            ) : (
                              <div className='space-y-6'>
                                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
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
                               <div className="space-y-2 pt-6 border-t">
                                  <Label htmlFor="ranges" className="text-lg font-medium">Rangos de Páginas</Label>
                                  <Input id="ranges" placeholder="Ej: 1-3, 5, 8-10" value={pageRanges} onChange={(e) => setPageRanges(e.target.value)} />
                                  <p className="text-sm text-muted-foreground">
                                    Define las páginas o rangos a extraer. Sepáralos con comas.
                                  </p>
                                </div>
                                <div className="flex justify-end pt-6 border-t">
                                  <Button size="lg" onClick={handleProcess} disabled={isSplitButtonDisabled}>Dividir PDF</Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="merge">
                         <Card className="shadow-lg mt-6 border-2 border-accent">
                            <CardContent className="p-6">
                                 <FileUploadForm 
                                   allowMultiple
                                   onFilesSelected={(files) => handleFilesSelected(files, 'merge')}
                                   acceptedFileTypes={{'application/pdf': ['.pdf']}}
                                   uploadHelpText="Sube o arrastra archivos PDF para unirlos. Límite de 50MB para invitados."
                                   isButton={mergeFiles.length > 0}
                                 />
                               {mergeFiles.length > 0 && (
                                 <div className='space-y-6 mt-6'>
                                   <Card>
                                      <CardHeader>
                                        <CardTitle className="text-xl">Ordenar Archivos</CardTitle>
                                        <CardDescription>Arrastra los archivos para establecer el orden final.</CardDescription>
                                      </CardHeader>
                                      <CardContent>
                                         <ScrollArea className="h-72">
                                            <div className="space-y-3 pr-4">
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
                                          </ScrollArea>
                                      </CardContent>
                                    </Card>
                                    <div className="flex justify-end pt-6 border-t">
                                       <Button size="lg" onClick={handleProcess} disabled={isMergeButtonDisabled}>Unir {mergeFiles.length} PDFs</Button>
                                    </div>
                                 </div>
                               )}
                            </CardContent>
                          </Card>
                      </TabsContent>
                    </Tabs>
                  )}

                </div>
            </main>
        </div>
    </div>

    <AnimatePresence>
        {processProgress !== null && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
                <CircularProgressBar 
                    progress={processProgress}
                    message={processProgress < 100 ? "Procesando..." : "Finalizando..."}
                />
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
