
'use client';

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelBottom, Table, TerminalSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "../limpieza-de-datos/data-table";
import { Textarea } from "../ui/textarea";

// Mock data for demonstration
const mockData = [
  { id: 1, product: "Laptop", sales: 120, region: "Norte" },
  { id: 2, product: "Teclado", sales: 80, region: "Sur" },
  { id: 3, product: "Monitor", sales: 150, region: "Norte" },
];
const mockColumns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "product", header: "Producto" },
  { accessorKey: "sales", header: "Ventas" },
  { accessorKey: "region", header: "Región" },
];
const mockLogs = `[INFO] ${new Date().toLocaleTimeString()}: Flujo iniciado.
[INFO] ${new Date().toLocaleTimeString()}: Cargando nodo 'LOAD_CSV'.
[SUCCESS] ${new Date().toLocaleTimeString()}: Nodo 'LOAD_CSV' ejecutado. 150 filas cargadas.
[INFO] ${new Date().toLocaleTimeString()}: Ejecutando nodo 'filterRows'.
[WARNING] ${new Date().toLocaleTimeString()}: 5 filas no cumplen la condición y serán eliminadas.
[SUCCESS] ${new Date().toLocaleTimeString()}: Flujo completado.
`;

export function BottomPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          className="absolute bottom-4 right-4 z-10 rounded-full h-14 w-14 shadow-lg border-2 border-border"
        >
          <PanelBottom className="h-6 w-6" />
          <span className="sr-only">Abrir Panel de Resultados</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-3/4 p-0 flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Resultados y Registros del Flujo</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="output" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="output"><Table className="mr-2 h-4 w-4"/>Salida de Datos</TabsTrigger>
              <TabsTrigger value="logs"><TerminalSquare className="mr-2 h-4 w-4"/>Registros</TabsTrigger>
            </TabsList>
            <TabsContent value="output" className="flex-1 mt-4">
                <Card className="h-full">
                    <CardContent className="p-4">
                        <DataTable columns={mockColumns} data={mockData} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="logs" className="flex-1 mt-4">
               <Card className="h-full">
                    <CardContent className="p-4 h-full">
                        <Textarea
                            readOnly
                            value={mockLogs}
                            className="h-full bg-muted/50 font-mono text-xs resize-none"
                        />
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
