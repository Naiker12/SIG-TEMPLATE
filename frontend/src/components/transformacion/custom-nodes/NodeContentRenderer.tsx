
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Link as LinkIcon, Database, Cog } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Bar, BarChart, ResponsiveContainer } from 'recharts';

const ApiHeaderSheet = () => (
  <Sheet>
    <SheetTrigger asChild>
      <button className="text-xs text-primary hover:underline font-semibold">Headers</button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Configurar Cabeceras (Headers)</SheetTitle>
        <SheetDescription>
          Añade cabeceras personalizadas para tu petición de API, como tokens de autorización.
        </SheetDescription>
      </SheetHeader>
      <div className="py-4 space-y-4">
        <div className="space-y-2">
            <Label htmlFor="api-headers">Cabeceras (formato JSON)</Label>
            <Textarea 
                id="api-headers" 
                placeholder={`{\n  "Authorization": "Bearer YOUR_API_KEY"\n}`} 
                rows={10} 
                className="font-mono text-sm"
            />
        </div>
      </div>
       <SheetFooter>
          <Button type="submit">Guardar Cambios</Button>
        </SheetFooter>
    </SheetContent>
  </Sheet>
);

const chartPreviewData = [
  { value: 10 }, { value: 25 }, { value: 15 }, { value: 30 }, { value: 20 }, { value: 40 },
];

const ChartNodeContent = () => (
    <div className='space-y-3 text-left'>
        <div className="grid grid-cols-[auto_1fr] items-center gap-2">
            <Label htmlFor='x-axis' className='text-xs'>x-axis</Label>
            <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="population" /></SelectTrigger><SelectContent><SelectItem value="pop">population</SelectItem></SelectContent></Select>
        </div>
        <div className="grid grid-cols-[auto_1fr] items-center gap-2">
            <Label htmlFor='y-axis' className='text-xs'>y-axis</Label>
            <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="population" /></SelectTrigger><SelectContent><SelectItem value="pop">population</SelectItem></SelectContent></Select>
        </div>
        <div className="flex items-center space-x-2 pt-1">
            <Checkbox id="horizontal"/>
            <Label htmlFor='horizontal' className='text-xs font-normal'>horizontal</Label>
        </div>
        <div className='relative mt-2 h-32 w-full bg-muted/30 rounded-md p-2'>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartPreviewData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={2} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);


export function NodeContentRenderer({ type, id }: { type: string, id: string }) {
    switch (type) {
        // --- INPUT NODES ---
        case 'LOAD_API':
            return (
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2 w-full'>
                        <LinkIcon className="h-4 w-4 text-muted-foreground"/>
                        <Input placeholder="Pegar URL de API..." className="text-xs h-8 flex-1" />
                    </div>
                    <ApiHeaderSheet />
                </div>
            );
        case 'LOAD_SUPABASE':
             return (
                <Button variant="outline" size="sm" className="w-full">
                    <Database className="mr-2 h-4 w-4" />
                    Configurar Conexión
                </Button>
            );
        case 'LOAD_CSV':
        case 'LOAD_EXCEL':
        case 'LOAD_JSON':
            return (
                <Button variant="outline" size="sm" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Cargar Archivo
                </Button>
            );

        // --- TRANSFORM NODES ---
        case 'RENAME_COLUMNS':
            return (
                <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2">
                        <Input placeholder="Nombre Antiguo" className="h-8 text-xs"/>
                        <span className='font-bold text-muted-foreground'>→</span>
                        <Input placeholder="Nombre Nuevo" className="h-8 text-xs"/>
                    </div>
                </div>
            );
        case 'CONVERT_DATATYPE':
            return (
                <div className="space-y-2 text-left">
                     <Select>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Seleccionar Columna..." /></SelectTrigger>
                        <SelectContent><SelectItem value="col1">columna_ejemplo</SelectItem></SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Convertir a..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="text">Texto</SelectItem>
                            <SelectItem value="number">Número</SelectItem>
                            <SelectItem value="date">Fecha</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            );
        case 'SPLIT_COLUMN':
            return (
                 <div className="flex items-center gap-2">
                    <Label htmlFor={`split-input-${id}`} className="text-xs whitespace-nowrap">Dividir por:</Label>
                    <Input id={`split-input-${id}`} placeholder="Delimitador (ej: ,)" className="h-8 text-xs"/>
                </div>
            );
        case 'CALCULATE_COLUMN':
        case 'CALCULATE_METRIC':
            return (
                 <div className="flex items-center gap-2">
                    <Label htmlFor={`calc-input-${id}`} className="text-xs whitespace-nowrap text-muted-foreground">f(x) =</Label>
                    <Input id={`calc-input-${id}`} placeholder="(col1 * col2)" className="h-8 text-xs font-mono"/>
                </div>
            );
        case 'FILL_NULLS':
            return (
                <div className="space-y-2 text-left">
                     <Select>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Rellenar en..." /></SelectTrigger>
                        <SelectContent><SelectItem value="col1">Todas las columnas</SelectItem></SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="con estrategia..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mean">Promedio</SelectItem>
                            <SelectItem value="median">Mediana</SelectItem>
                            <SelectItem value="zero">Cero (0)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            );
        case 'FILTER_ROWS':
             return (
                 <div className="flex items-center gap-2">
                    <Input id={`filter-input-${id}`} placeholder="Ej: columna_1 > 100" className="h-8 text-xs font-mono"/>
                </div>
            );
        
        // --- VISUALIZATION NODES ---
        case 'BAR_CHART':
        case 'LINE_CHART':
            return <ChartNodeContent />;
        
        // --- DEFAULT/GENERIC ---
        default:
            return (
                <Button variant="outline" size="sm" className="w-full">
                    <Cog className="mr-2 h-4 w-4" />
                    Configurar Nodo
                </Button>
            );
    }
}
