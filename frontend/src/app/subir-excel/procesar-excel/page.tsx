
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, FileSpreadsheet, Rows, Download } from "lucide-react";
import { DataTable } from '@/components/limpieza-de-datos/data-table';
import { type ColumnDef, type Row, type PaginationState } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';
import { uploadAndProcessExcel, getExcelPreview, type ExcelPreview, duplicateExcelRow, downloadExcelFile } from '@/services/excelService';
import { AnimatePresence, motion } from 'framer-motion';
import { CircularProgressBar } from '@/components/ui/circular-progress-bar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveAs } from 'file-saver';


type DuplicateModalState = {
  isOpen: boolean;
  rowData: any | null;
};

export default function ProcessExcelPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processedFileId, setProcessedFileId] = useState<string | null>(null);
  const [tableData, setTableData] = useState<ExcelPreview | null>(null);
  const [processingProgress, setProcessingProgress] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<Row<any>[]>([]);
  const [duplicateModal, setDuplicateModal] = useState<DuplicateModalState>({ isOpen: false, rowData: null });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { toast } = useToast();

  const fetchPageData = useCallback(async (fileId: string, page: number, pageSize: number) => {
    try {
      const previewData = await getExcelPreview(fileId, page, pageSize);
      setTableData(previewData);
      setPagination({ pageIndex: previewData.page - 1, pageSize: previewData.pageSize });
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
  
  const handlePaginationChange = useCallback((newPagination: PaginationState) => {
    if (!processedFileId) return;

    setPagination(newPagination);
    fetchPageData(processedFileId, newPagination.pageIndex + 1, newPagination.pageSize);
  }, [processedFileId, fetchPageData]);

  const handleDuplicate = () => {
    if (selectedRows.length !== 1) return;
    setDuplicateModal({ isOpen: true, rowData: selectedRows[0].original });
  };
  
  const handleConfirmDuplicate = async (count: number) => {
    if (!duplicateModal.rowData || !processedFileId || count < 1) return;
    
    try {
        await duplicateExcelRow({
            file_id: processedFileId,
            row_id: duplicateModal.rowData.id,
            count: count - 1
        });

        setDuplicateModal({ isOpen: false, rowData: null });
        toast({
            title: "Fila Duplicada",
            description: `Se han creado ${count - 1} copias de la fila. Actualizando tabla...`,
        });

        await fetchPageData(processedFileId, pagination.pageIndex + 1, pagination.pageSize);

    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error al duplicar",
            description: error instanceof Error ? error.message : "No se pudo duplicar la fila en el servidor.",
        });
    }
  }

  const handleDownload = async () => {
    if (!processedFileId) return;

    toast({ title: "Preparando descarga...", description: "Tu archivo se está generando." });
    try {
        const { blob, filename } = await downloadExcelFile(processedFileId);
        saveAs(blob, filename);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error al descargar",
            description: error instanceof Error ? error.message : "No se pudo descargar el archivo.",
        });
    }
  };


  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (!tableData || !tableData.columns) return [];
    return tableData.columns;
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
             <Button variant="outline" onClick={handleDuplicate} disabled={selectedRows.length !== 1}>
                <Rows className="mr-2 h-4 w-4"/> Duplicar Fila
             </Button>
        </div>
     );
  }, [tableData, selectedRows]);

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
                  <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex items-center gap-2 text-lg font-semibold">
                              <FileSpreadsheet className="text-primary" />
                              Mostrando resultados para: <span className="text-primary">{file?.name}</span>
                          </div>
                          <div className="flex gap-2">
                             <Button variant="outline" onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Descargar</Button>
                             <Button onClick={() => { setFile(null); setTableData(null); setProcessedFileId(null)}}>
                                Procesar otro archivo
                             </Button>
                          </div>
                      </div>
                      <DataTable 
                          columns={columns} 
                          data={tableData.data}
                          pageCount={tableData.totalPages}
                          pagination={pagination}
                          onPaginationChange={handlePaginationChange}
                          toolbarContent={tableToolbar}
                          onRowSelectionChange={(rows) => setSelectedRows(rows)}
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
      <DuplicateRowModal 
        isOpen={duplicateModal.isOpen} 
        onOpenChange={(isOpen) => setDuplicateModal(prev => ({...prev, isOpen}))}
        rowData={duplicateModal.rowData}
        onConfirm={handleConfirmDuplicate}
      />
    </>
  );
}

// Modal Component
function DuplicateRowModal({ isOpen, onOpenChange, rowData, onConfirm }: {
  isOpen: boolean,
  onOpenChange: (isOpen: boolean) => void,
  rowData: any | null,
  onConfirm: (count: number) => void
}) {
  const [count, setCount] = useState(2);

  useEffect(() => {
    if (isOpen) {
        setCount(2); // Reset count when modal opens
    }
  }, [isOpen]);

  if (!rowData) return null;

  const rowDescription = Object.entries(rowData)
    .filter(([key]) => key !== 'id' && key.toLowerCase() !== 'id')
    .slice(0, 2)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duplicar Fila</DialogTitle>
          <DialogDescription>
            ¿Cuántas copias totales de esta fila deseas tener? El original más las nuevas copias.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="p-4 bg-muted rounded-lg border text-sm">
             <p className="font-semibold truncate">Fila seleccionada (ID: {rowData.id})</p>
             <p className="text-muted-foreground text-xs truncate">{rowDescription}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duplicate-count">Número total de filas (original + copias)</Label>
            <Input 
              id="duplicate-count"
              type="number"
              min="1"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
            />
             <p className="text-xs text-muted-foreground">
                Si ingresas 3, tendrás la fila original + 2 copias.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => onConfirm(count)}>Confirmar Duplicación</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
