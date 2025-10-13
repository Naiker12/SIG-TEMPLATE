
'use client';

import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Inbox } from "lucide-react";
import { useAuthStore } from '@/hooks/useAuthStore';
import { getUserFiles } from '@/services/fileService';
import type { File as FileType } from '@/services/fileService';
import { generatePdfPreview, getPdfPageCount } from '@/services/pdfManipulationService';
import { CircularProgressBar } from '@/components/ui/circular-progress-bar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type DocumentPreview = {
  id: string;
  name: string;
  fileObject: File | null; // We might not have the full file object
  totalPages: number;
  currentPage: number;
  currentPreviewUrl: string;
  isLoading: boolean;
  scale: number;
};

export default function FileViewerPage() {
    const [documents, setDocuments] = useState<FileType[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<DocumentPreview | null>(null);
    const [isLoadingList, setIsLoadingList] = useState(true);
    const { isLoggedIn } = useAuthStore();
    const { toast } = useToast();

    useEffect(() => {
        if (isLoggedIn) {
            setIsLoadingList(true);
            getUserFiles()
                .then(setDocuments)
                .catch(() => toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los documentos." }))
                .finally(() => setIsLoadingList(false));
        } else {
             setIsLoadingList(false);
        }
    }, [isLoggedIn, toast]);

    const handleSelectDoc = async (doc: FileType) => {
        if (selectedDoc?.id === doc.id) return;
        
        setSelectedDoc({
            id: doc.id,
            name: doc.filename,
            fileObject: null, // We'd need to fetch the file blob for this
            totalPages: 1,
            currentPage: 1,
            currentPreviewUrl: "",
            isLoading: true,
            scale: 1,
        });

        try {
            // This is a placeholder; in a real scenario, we'd need a way to get the file blob from the server
            // For now, let's create a dummy file to pass to the preview service.
            const dummyFile = new File([""], doc.filename, { type: doc.fileType });

            const [pageCount, previewUrl] = await Promise.all([
                getPdfPageCount(dummyFile).catch(() => 15), // Fallback
                generatePdfPreview(dummyFile, 1)
            ]);

            setSelectedDoc(prev => prev ? ({
                ...prev,
                totalPages: pageCount,
                currentPreviewUrl: previewUrl,
                isLoading: false
            }) : null);

        } catch (error) {
            console.error("Error preparing document preview:", error);
            toast({ variant: "destructive", title: "Error", description: "No se pudo generar la vista previa del documento."});
            setSelectedDoc(null);
        }
    };

    const changePage = async (newPage: number) => {
        if (!selectedDoc || newPage < 1 || newPage > selectedDoc.totalPages || selectedDoc.isLoading) return;
        
        setSelectedDoc(prev => prev ? { ...prev, isLoading: true, currentPage: newPage } : null);
        
        try {
            const dummyFile = new File([""], selectedDoc.name, { type: 'application/pdf' });
            const previewUrl = await generatePdfPreview(dummyFile, newPage);
            setSelectedDoc(prev => prev ? ({
                ...prev,
                currentPreviewUrl: previewUrl,
                isLoading: false,
            }) : null);
        } catch (error) {
            console.error(`Error fetching page ${newPage}:`, error);
            toast({ variant: "destructive", title: "Error", description: `No se pudo cargar la página ${newPage}.`});
            setSelectedDoc(prev => prev ? { ...prev, isLoading: false } : null);
        }
    }

    const changeZoom = (direction: 'in' | 'out') => {
        setSelectedDoc(prev => {
            if (!prev) return null;
            const newScale = direction === 'in' ? prev.scale * 1.2 : prev.scale / 1.2;
            return { ...prev, scale: Math.max(0.2, Math.min(newScale, 3)) };
        });
    };

  return (
    <div className='h-screen flex flex-col'>
      <TopBar />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-[350px_1fr] overflow-hidden">
          {/* Sidebar de Documentos */}
          <aside className="border-r flex flex-col">
             <div className="p-4 space-y-4 border-b">
                <h1 className="text-2xl font-bold tracking-tight">Visor de Archivos</h1>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar documentos..." className="pl-10" />
               </div>
             </div>
             <ScrollArea className="flex-1">
               <nav className="p-4 space-y-2">
                  {!isLoggedIn ? (
                     <div className="text-center text-muted-foreground p-8">Inicia sesión para ver tus documentos.</div>
                  ) : isLoadingList ? (
                     <div className="text-center text-muted-foreground p-8">Cargando documentos...</div>
                  ) : documents.length === 0 ? (
                    <div className="text-center text-muted-foreground p-8 space-y-4">
                        <Inbox className="h-16 w-16 mx-auto"/>
                        <p>No se encontraron documentos.</p>
                    </div>
                  ) : (
                    documents.map((doc) => (
                        <button 
                        key={doc.id} 
                        className={cn(
                            "w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-start gap-3",
                            selectedDoc?.id === doc.id && "bg-accent"
                        )}
                        onClick={() => handleSelectDoc(doc)}
                        >
                        <FileText className="h-5 w-5 mt-1 flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <span className="font-medium truncate">{doc.filename}</span>
                            <span className="text-sm text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString()}</span>
                        </div>
                        </button>
                    ))
                  )}
               </nav>
             </ScrollArea>
          </aside>

          {/* Visor Principal */}
          <div className="flex-1 flex flex-col bg-muted/20">
            <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto">
                <Card className="w-full h-full shadow-lg border-2 border-accent">
                  <CardContent className="p-0 h-full flex items-center justify-center relative">
                    <AnimatePresence mode="wait">
                        {!selectedDoc ? (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center text-muted-foreground"
                            >
                                <FileText className="mx-auto h-24 w-24" />
                                <p className="mt-4 text-lg">Selecciona un documento para empezar</p>
                                <p>La previsualización del PDF aparecerá aquí.</p>
                            </motion.div>
                        ) : selectedDoc.isLoading ? (
                            <motion.div
                                key="loader"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center bg-background/50"
                            >
                                <CircularProgressBar progress={100} message="Cargando página..." />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full w-full overflow-auto p-4 flex items-center justify-center"
                            >
                                <img
                                    src={selectedDoc.currentPreviewUrl}
                                    alt={`Vista previa de ${selectedDoc.name}`}
                                    className="transition-transform duration-300 shadow-lg border rounded-md bg-background"
                                    style={{ transform: `scale(${selectedDoc.scale})` }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
            </div>
            <footer className="h-16 bg-card border-t flex items-center justify-center px-4 gap-4">
                <Button variant="ghost" size="icon" disabled={!selectedDoc || selectedDoc.scale <= 0.2} onClick={() => changeZoom('out')}>
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <span className="text-sm font-medium w-16 text-center">
                    {selectedDoc ? `${Math.round(selectedDoc.scale * 100)}%` : '100%'}
                </span>
                <Button variant="ghost" size="icon" disabled={!selectedDoc || selectedDoc.scale >= 3} onClick={() => changeZoom('in')}>
                  <ZoomIn className="h-5 w-5" />
                </Button>
                <div className="w-px h-6 bg-border mx-2"></div>
                 <Button variant="ghost" size="icon" disabled={!selectedDoc || selectedDoc.currentPage <= 1} onClick={() => changePage(selectedDoc.currentPage - 1)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="text-sm flex items-center gap-2">
                  Página 
                  <Input 
                    type="number"
                    value={selectedDoc?.currentPage ?? 1} 
                    onChange={(e) => {
                        const page = parseInt(e.target.value, 10);
                        if (selectedDoc && !isNaN(page) && page > 0 && page <= selectedDoc.totalPages) {
                            changePage(page);
                        }
                    }}
                    className="inline-block w-16 h-8 text-center" 
                    disabled={!selectedDoc} 
                  /> 
                  de {selectedDoc?.totalPages ?? 1}
                </span>
                 <Button variant="ghost" size="icon" disabled={!selectedDoc || selectedDoc.currentPage >= selectedDoc.totalPages} onClick={() => changePage(selectedDoc.currentPage + 1)}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
            </footer>
          </div>
      </main>
    </div>
  );
}
