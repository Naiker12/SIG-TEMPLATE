
'use client';

import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, Mail, File as FileIcon, FileImage, FileSpreadsheet } from 'lucide-react';
import { ChartConfigSheet } from './ChartConfigSheet';

type DataFiltersProps = {
  onExport: (format: 'png' | 'csv' | 'xlsx') => void;
};

export function DataFilters({ onExport }: DataFiltersProps) {
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
                <DropdownMenuItem onClick={() => onExport('png')}>
                  <FileImage className="mr-2 h-4 w-4" />
                  Descargar como Imagen (PNG)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('csv')}>
                  <FileIcon className="mr-2 h-4 w-4" />
                  Exportar datos como CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('xlsx')}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Exportar datos como Excel
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline"><Mail className="mr-2 h-4 w-4"/>Enviar por Correo</Button>
      </div>
    </div>
  );
}
