
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, FileSpreadsheet, Loader2, Rows } from "lucide-react";
import { DataTable } from '@/components/limpieza-de-datos/data-table';
import { type ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';
import { uploadAndProcessExcel, getExcelPreview, type ExcelPreview } from '@/services/excelService';
import { AnimatePresence, motion } from 'framer-motion';
import { CircularProgressBar } from '@/components/ui/circular-progress-bar';
import { useAuthStore } from '@/hooks/useAuthStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export default function ProcessExcelPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processedFileId, setProcessedFileId] = useState<string | null>(null);
  const [tableData, setTableData] = useState<ExcelPreview | null>(null);
  const [processingProgress, setProcessingProgress] = useState<number | null>(null);
  const { toast } = useToast();
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
        const state = useAuthStore.getState();
        if (!state.isLoggedIn) {
            router.push('/');
        } else {
            setIsCheckingAuth(false);
        }
    }
    
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
        const state = useAuthStore.getState();
         if (!state.isLoggedIn) {
            router.push('/');
        } else {
            setIsCheckingAuth(false);
        }
    });

    return () => unsubscribe();
  }, [isLoggedIn, router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        toast({
          variant: "destructive",
          title: "Archivo no válido",
          description: "Por favor, selecciona un archivo de Excel (.xlsx o .xls).",
        });
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setTableData(null);
      setProcessedFileId(null);
    }
  };

  const fetchPageData = useCallback(async (fileId: string, page: number, pageSize: number) => {
    try {
      const previewData = await getExcelPreview(fileId, page, pageSize);
      setTableData(previewData);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error al cargar los datos",
        description: error instanceof Error ? error.message : "No se pudieron cargar los datos de la página.",
      });
    }
  }, [toast]);

  const handleProcess = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No hay archivo",
        description: "Por favor, selecciona un archivo para procesar.",
      });
      return;
    }
    
    setProcessingProgress(0);
    const progressInterval = setInterval(() => {
        setProcessingProgress(prev => (prev !== null && prev < 95 ? prev + 5 : 95));
    }, 500);

    try {
      const { file_id } = await uploadAndProcessExcel(file);
      setProcessedFileId(file_id);
      
      toast({
        title: "Archivo Procesado",
        description: "El backend ha procesado el archivo. Obteniendo vista previa...",
      });
      
      // Fetch the first page of data
      await fetchPageData(file_id, 1, 10);

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error en el Procesamiento",
        description: error instanceof Error ? error.message : "No se pudo procesar el archivo.",
      });
    } finally {
      clearInterval(progressInterval);
      setProcessingProgress(100);
      setTimeout(() => setProcessingProgress(null), 500);
    }
  };
  
  const handlePaginationChange = async ({ pageIndex, pageSize }: PaginationState) => {
    if (!processedFileId) return;
    await fetchPageData(processedFileId, pageIndex + 1, pageSize);
  };

  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (!tableData || tableData.columns.length === 0) return [];
    
    return tableData.columns.map(col => ({
      accessorKey: col.accessorKey,
      header: col.header,
    }));
  }, [tableData]);
  
  const tableToolbar = useMemo(() => {
     if (!tableData) return null;
     return (
        <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <Label htmlFor="month-filter">Mes:</Label>
                <Select>
                    <SelectTrigger id="month-filter" className="w-[180px]">
                        <SelectValue placeholder="Filtrar por mes" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="enero">Enero</SelectItem>
                        <SelectItem value="febrero">Febrero</SelectItem>
                        <SelectItem value="marzo">Marzo</SelectItem>
                    </SelectContent>
                </Select>
             </div>
             <Button variant="outline"><Rows className="mr-2 h-4 w-4"/> Duplicar Fila</Button>
        </div>
     );
  }, [tableData]);


  if (isCheckingAuth) {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <>
      <SidebarProvider>
        <Sidebar variant="sidebar" collapsible="icon">
          <DashboardSidebar />
        </Sidebar>
        <SidebarInset>
          <main className="min-h-screen bg-background">
            <TopBar />
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="max-w-full mx-auto">
                <header className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Procesar Documento Excel</h1>
                  <p className="text-muted-foreground mt-2 max-w-3xl">
                    Sube tu archivo, visualiza los datos y realiza transformaciones de forma sencilla.
                  </p>
                </header>

                {!tableData ? (
                  <Card className="shadow-lg max-w-2xl mx-auto border-2 border-accent">
                      <CardHeader>
                          <CardTitle>Cargar Archivo</CardTitle>
                          <CardDescription>Selecciona un archivo .xlsx o .xls para empezar.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl text-center">
                              <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
                              <Button asChild variant="outline">
                                  <Label htmlFor="file-upload" className="cursor-pointer">
                                    {file ? "Cambiar Archivo" : "Seleccionar Archivo"}
                                  </Label>
                              </Button>
                              <Input id="file-upload" type="file" onChange={handleFileChange} accept=".xlsx, .xls" className="hidden" />
                              <p className="text-muted-foreground text-sm mt-3">
                                {file ? file.name : "Formatos soportados: .xlsx, .xls"}
                              </p>
                          </div>
                          <Button onClick={handleProcess} disabled={!file} className="w-full" size="lg">
                              Procesar Archivo
                          </Button>
                      </CardContent>
                  </Card>
                ) : (
                  <div className="overflow-x-auto space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-center gap-2 text-lg font-semibold">
                              <FileSpreadsheet className="text-primary" />
                              Mostrando resultados para: <span className="text-primary">{file?.name}</span>
                          </div>
                           <Button onClick={() => { setFile(null); setTableData(null); setProcessedFileId(null)}}>
                             Procesar otro archivo
                          </Button>
                      </div>
                      <DataTable 
                          columns={columns} 
                          data={tableData.data}
                          pageCount={tableData.totalPages}
                          pagination={{
                            pageIndex: tableData.page - 1,
                            pageSize: tableData.pageSize,
                          }}
                          onPaginationChange={handlePaginationChange}
                          toolbarContent={tableToolbar}
                      />
                  </div>
                )}
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
      <AnimatePresence>
        {processingProgress !== null && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
                <CircularProgressBar 
                    progress={processingProgress}
                    message={processingProgress < 100 ? "Procesando archivo..." : "Finalizando..."}
                />
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
