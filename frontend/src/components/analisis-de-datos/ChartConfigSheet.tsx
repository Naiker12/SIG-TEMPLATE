
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
import { Settings } from 'lucide-react';
import { useChartConfigStore } from '@/hooks/use-chart-config-store';

export function ChartConfigSheet() {
  const { 
    areaChartConfig, 
    pieChartConfig,
    numericalColumns,
    categoricalColumns,
    setAreaChartConfig,
    setPieChartConfig 
  } = useChartConfigStore();
  
  const handleAreaChartChange = (key: 'xAxis' | 'yAxis', value: string) => {
    setAreaChartConfig({ ...areaChartConfig, [key]: value });
  };
  
  const handlePieChartChange = (key: 'labelKey' | 'valueKey', value: string) => {
    setPieChartConfig({ ...pieChartConfig, [key]: value });
  };

  const noColumnsAvailable = numericalColumns.length === 0 && categoricalColumns.length === 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline"><Settings className="mr-2 h-4 w-4"/>Configurar Gráficos</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configuración de Gráficos</SheetTitle>
          <SheetDescription>
            Selecciona las columnas para personalizar los gráficos. Los cambios se aplicarán en tiempo real.
          </SheetDescription>
        </SheetHeader>
        {noColumnsAvailable ? (
            <div className="py-6 text-center text-muted-foreground">
                Carga un archivo para ver las opciones de configuración.
            </div>
        ) : (
            <div className="py-6 space-y-6">
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h4 className='font-semibold'>Gráfico de Barras (Métrica Principal)</h4>
                    <div className="space-y-2">
                        <Label htmlFor="area-chart-x">Eje X (Categorías)</Label>
                        <Select value={areaChartConfig.xAxis} onValueChange={(value) => handleAreaChartChange('xAxis', value)} disabled={categoricalColumns.length === 0}>
                            <SelectTrigger id="area-chart-x"><SelectValue placeholder="Seleccionar columna"/></SelectTrigger>
                            <SelectContent>{categoricalColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Columna que aparecerá en el eje horizontal.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="area-chart-y">Eje Y (Valores Numéricos)</Label>
                        <Select value={areaChartConfig.yAxis} onValueChange={(value) => handleAreaChartChange('yAxis', value)} disabled={numericalColumns.length === 0}>
                            <SelectTrigger id="area-chart-y"><SelectValue placeholder="Seleccionar columna"/></SelectTrigger>
                            <SelectContent>{numericalColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                         <p className="text-xs text-muted-foreground">Columna que determinará la altura de las barras.</p>
                    </div>
                </div>
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <h4 className='font-semibold'>Gráfico de Pastel (Distribución)</h4>
                    <div className="space-y-2">
                        <Label htmlFor="pie-chart-labels">Etiquetas (Categorías)</Label>
                        <Select value={pieChartConfig.labelKey} onValueChange={(value) => handlePieChartChange('labelKey', value)} disabled={categoricalColumns.length === 0}>
                            <SelectTrigger id="pie-chart-labels"><SelectValue placeholder="Seleccionar columna"/></SelectTrigger>
                            <SelectContent>{categoricalColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Columna para agrupar los segmentos del gráfico.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pie-chart-values">Valores (Agregados)</Label>
                        <Select value={pieChartConfig.valueKey} onValueChange={(value) => handlePieChartChange('valueKey', value)} disabled={numericalColumns.length === 0}>
                            <SelectTrigger id="pie-chart-values"><SelectValue placeholder="Seleccionar columna"/></SelectTrigger>
                            <SelectContent>{numericalColumns.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Columna numérica para calcular el tamaño de cada segmento.</p>
                    </div>
                </div>
            </div>
        )}
         <SheetFooter>
          <p className="text-sm text-muted-foreground text-center w-full">Tus cambios se guardan automáticamente.</p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
