
'use client';

import { useState, useMemo } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DataTable } from '@/components/limpieza-de-datos/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLoadingStore } from '@/hooks/use-loading-store';


export default function ProcessExcelPage() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const { setIsLoading, isLoading } = useLoadingStore();


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setData([]);
    }
  };

  const handleProcess = () => {
    if (!file) return;
    setIsLoading(true);
    setTimeout(() => {
        const mockExcelData = [
            { id: "row-1", "ID Cliente": "C001", "Nombre": "Ana", "Apellido": "Torres", "Email": "ana.t@example.com", "País": "España", "Último Pedido": "2024-08-15", "Total Gastado": "1,250.75", "Fecha Registro": "2023-01-20", "Estado": "Activo" },
            { id: "row-2", "ID Cliente": "C002", "Nombre": "Luis", "Apellido": "Gomez", "Email": "luis.g@example.com", "País": "México", "Último Pedido": "2024-08-12", "Total Gastado": "850.00", "Fecha Registro": "2022-11-05", "Estado": "Activo" },
            { id: "row-3", "ID Cliente": "C003", "Nombre": "Carla", "Apellido": "Diaz", "Email": "carla.d@example.com", "País": "Argentina", "Último Pedido": "2024-08-10", "Total Gastado": "2,300.50", "Fecha Registro": "2023-03-15", "Estado": "Inactivo" },
             { id: "row-4", "ID Cliente": "C004", "Nombre": "Jorge", "Apellido": "Perez", "Email": "jorge.p@example.com", "País": "Colombia", "Último Pedido": "2024-08-20", "Total Gastado": "500.00", "Fecha Registro": "2023-05-10", "Estado": "Activo" },
        ];
        setData(mockExcelData);
        setIsLoading(false);
    }, 1500);
  };
  
  const columns: ColumnDef<any>[] = useMemo(() => {
    if (data.length === 0) return [];
    
    const headers = Object.keys(data[0]);

    const dynamicColumns = headers.map(header => ({
        accessorKey: header,
        header: header,
        cell: ({ row }: any) => <div>{row.getValue(header)}</div>,
    }));
    
    return [
        {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
        ...dynamicColumns
    ]

  }, [data]);

  const renderDuplicateModal = (selectedRows: any[]) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={selectedRows.length === 0}>
            Duplicar Filas
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicar Filas</DialogTitle>
            <DialogDescription>
              Selecciona las filas que quieres duplicar y la cantidad de veces.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Filas Seleccionadas</Label>
               <Select>
                <SelectTrigger>
                  <SelectValue placeholder={`${selectedRows.length} fila(s) seleccionada(s)`} />
                </SelectTrigger>
                <SelectContent>
                  {selectedRows.map((row: any) => (
                    <SelectItem key={row.original.id} value={row.original.id}>
                      {`Fila ${row.index + 1}: ${row.original.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duplicate-count">Número de copias</Label>
              <Input id="duplicate-count" type="number" defaultValue="1" min="1" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button">Generar Copias</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }


  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <DashboardSidebar />
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen bg-background">
          <TopBar />
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Procesar Documento Excel</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                  Sube tu archivo, visualiza los datos y realiza transformaciones de forma sencilla.
                </p>
              </header>

              {data.length === 0 ? (
                <Card className="shadow-lg max-w-2xl mx-auto border-2 border-accent">
                    <CardHeader>
                        <CardTitle>Cargar Archivo</CardTitle>
                        <CardDescription>Selecciona un archivo .xlsx o .csv para empezar.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl text-center">
                            <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
                            <Button asChild variant="outline">
                                <Label htmlFor="file-upload" className="cursor-pointer">
                                  {file ? "Cambiar Archivo" : "Seleccionar Archivo"}
                                </Label>
                            </Button>
                            <Input id="file-upload" type="file" onChange={handleFileChange} accept=".csv, .xlsx, .xls" className="hidden" />
                            <p className="text-muted-foreground text-sm mt-3">
                              {file ? file.name : "Formatos soportados: .csv, .xlsx, .xls"}
                            </p>
                        </div>
                        <Button onClick={handleProcess} disabled={!file || isLoading} className="w-full" size="lg">
                            {isLoading ? 'Procesando...' : 'Procesar Archivo'}
                        </Button>
                    </CardContent>
                </Card>
              ) : (
                <div className="overflow-x-auto">
                    <DataTable 
                    columns={columns} 
                    data={data} 
                    file={file} 
                    toolbarContent={renderDuplicateModal} 
                    />
                </div>
              )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
