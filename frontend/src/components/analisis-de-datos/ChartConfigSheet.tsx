
'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings2 } from 'lucide-react';
import { Separator } from '../ui/separator';

const mockColumns = ['month', 'category', 'country', 'sales', 'source'];

export function ChartConfigSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline"><Settings2 className="mr-2 h-4 w-4"/>Configurar Gráficos</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configuración de Gráficos</SheetTitle>
          <SheetDescription>
            Selecciona las columnas de tus datos para personalizar los gráficos del dashboard.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6">
            <div className="space-y-4 p-4 border rounded-lg">
                 <h4 className='font-semibold'>Gráfico de Ingresos por Mes</h4>
                 <div className="space-y-2">
                    <Label htmlFor="area-chart-x">Eje X (Categorías)</Label>
                    <Select defaultValue='month'>
                        <SelectTrigger id="area-chart-x"><SelectValue /></SelectTrigger>
                        <SelectContent>{mockColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
                  <div className="space-y-2">
                    <Label htmlFor="area-chart-y">Eje Y (Valores)</Label>
                    <Select defaultValue='sales'>
                        <SelectTrigger id="area-chart-y"><SelectValue /></SelectTrigger>
                        <SelectContent>{mockColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
            </div>
            <div className="space-y-4 p-4 border rounded-lg">
                 <h4 className='font-semibold'>Gráfico de Ventas por Categoría</h4>
                 <div className="space-y-2">
                    <Label htmlFor="pie-chart-labels">Etiquetas (Categorías)</Label>
                    <Select defaultValue='category'>
                        <SelectTrigger id="pie-chart-labels"><SelectValue /></SelectTrigger>
                        <SelectContent>{mockColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
                  <div className="space-y-2">
                    <Label htmlFor="pie-chart-values">Valores</Label>
                    <Select defaultValue='sales'>
                        <SelectTrigger id="pie-chart-values"><SelectValue /></SelectTrigger>
                        <SelectContent>{mockColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
