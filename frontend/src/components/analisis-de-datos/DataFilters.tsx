
'use client';

import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, Mail } from 'lucide-react';
import { ChartConfigSheet } from './ChartConfigSheet';

export function DataFilters() {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center p-4 border rounded-lg bg-card">
      <div className="flex flex-wrap items-center gap-4">
        <DateRangePicker />
        <ChartConfigSheet />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button><Download className="mr-2 h-4 w-4"/>Exportar</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Opciones de Exportación</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Exportar como CSV</DropdownMenuItem>
                <DropdownMenuItem>Exportar como Excel</DropdownMenuItem>
                <DropdownMenuItem>Descargar como Imagen</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline"><Mail className="mr-2 h-4 w-4"/>Enviar por Correo</Button>
      </div>
    </div>
  );
}
