
'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings2 } from 'lucide-react';
import { categoricalColumns, numericalColumns } from './mock-data';
import { useChartConfigStore } from '@/hooks/use-chart-config-store';

export function ChartConfigSheet() {
  const { 
    areaChartConfig, 
    pieChartConfig,
    setAreaChartConfig,
    setPieChartConfig 
  } = useChartConfigStore();
  
  const handleAreaChartChange = (key: 'xAxis' | 'yAxis', value: string) => {
    setAreaChartConfig({ ...areaChartConfig, [key]: value });
  };
  
  const handlePieChartChange = (key: 'labelKey' | 'valueKey', value: string) => {
    setPieChartConfig({ ...pieChartConfig, [key]: value });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline"><Settings2 className="mr-2 h-4 w-4"/>Configurar Gráficos</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configuración de Gráficos</SheetTitle>
          <SheetDescription>
            Selecciona las columnas de tus datos para personalizar los gráficos del dashboard. Los cambios se aplicarán en tiempo real.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6">
            <div className="space-y-4 p-4 border rounded-lg">
                 <h4 className='font-semibold'>Gráfico de Área</h4>
                 <div className="space-y-2">
                    <Label htmlFor="area-chart-x">Eje X (Categorías)</Label>
                    <Select value={areaChartConfig.xAxis} onValueChange={(value) => handleAreaChartChange('xAxis', value)}>
                        <SelectTrigger id="area-chart-x"><SelectValue /></SelectTrigger>
                        <SelectContent>{categoricalColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
                  <div className="space-y-2">
                    <Label htmlFor="area-chart-y">Eje Y (Valores Numéricos)</Label>
                     <Select value={areaChartConfig.yAxis} onValueChange={(value) => handleAreaChartChange('yAxis', value)}>
                        <SelectTrigger id="area-chart-y"><SelectValue /></SelectTrigger>
                        <SelectContent>{numericalColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
            </div>
            <div className="space-y-4 p-4 border rounded-lg">
                 <h4 className='font-semibold'>Gráfico de Pastel</h4>
                 <div className="space-y-2">
                    <Label htmlFor="pie-chart-labels">Etiquetas (Categorías)</Label>
                     <Select value={pieChartConfig.labelKey} onValueChange={(value) => handlePieChartChange('labelKey', value)}>
                        <SelectTrigger id="pie-chart-labels"><SelectValue /></SelectTrigger>
                        <SelectContent>{categoricalColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
                  <div className="space-y-2">
                    <Label htmlFor="pie-chart-values">Valores (Agregados)</Label>
                     <Select value={pieChartConfig.valueKey} onValueChange={(value) => handlePieChartChange('valueKey', value)}>
                        <SelectTrigger id="pie-chart-values"><SelectValue /></SelectTrigger>
                        <SelectContent>{numericalColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
            </div>
        </div>
         <SheetFooter>
          <p className="text-sm text-muted-foreground text-center w-full">Tus cambios se guardan automáticamente mientras navegas.</p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
