
'use client';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SheetFooter } from "@/components/ui/sheet";
import { UploadCloud } from "lucide-react";

export function LoadCsvSheet() {
    return (
        <div className="p-6 space-y-6">
            <div className="space-y-2">
                <Label>Archivo</Label>
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl text-center">
                    <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
                    <Button asChild variant="outline">
                        <label htmlFor="file-upload" className="cursor-pointer">Seleccionar Archivo CSV</label>
                    </Button>
                    <Input id="file-upload" type="file" accept=".csv" className="hidden" />
                    <p className="text-muted-foreground text-xs mt-3">Sube o arrastra tu archivo aquí.</p>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold text-muted-foreground">Configuración de Parseo</h4>
                <div className="space-y-2">
                    <Label htmlFor="delimiter">Delimitador</Label>
                    <Input id="delimiter" defaultValue="," placeholder="Ej: , o ;" />
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id="has-header" defaultChecked />
                    <Label htmlFor="has-header">El archivo tiene una fila de encabezado</Label>
                </div>
            </div>

            <SheetFooter className="pt-6">
                <Button>Aplicar Cambios</Button>
            </SheetFooter>
        </div>
    );
}
