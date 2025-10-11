
'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Link as LinkIcon, Database, Cog, Type, Rows, GitMerge, Split, Calculator } from 'lucide-react';
import { NODE_CATEGORIES } from '../node-types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const handleStyle = {
  width: '12px',
  height: '100%',
  background: 'hsl(var(--primary))',
  border: '2px solid hsl(var(--card))',
  borderRadius: '3px'
};

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


export function InputNode({ data, id }: NodeProps<{ nodeType: string }>) {
  const nodeDef = NODE_CATEGORIES
    .flatMap(cat => cat.nodes)
    .find(node => node.type === data.nodeType);

  const renderContent = () => {
    switch (data.nodeType) {
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
                        <Rows className="h-4 w-4 text-muted-foreground"/>
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
        case 'MERGE_COLUMNS':
            return (
                <Button variant="outline" size="sm" className="w-full">
                    <GitMerge className="mr-2 h-4 w-4" />
                    Seleccionar Columnas
                </Button>
            );
        case 'SPLIT_COLUMN':
            return (
                 <div className="flex items-center gap-2">
                    <Label htmlFor={`split-input-${id}`} className="text-xs whitespace-nowrap">Dividir por:</Label>
                    <Input id={`split-input-${id}`} placeholder="Delimitador (ej: ,)" className="h-8 text-xs"/>
                </div>
            );
        case 'CALCULATE_COLUMN':
            return (
                 <div className="flex items-center gap-2">
                    <Label htmlFor={`calc-input-${id}`} className="text-xs whitespace-nowrap text-muted-foreground">f(x) =</Label>
                    <Input id={`calc-input-${id}`} placeholder="(col1 * col2)" className="h-8 text-xs font-mono"/>
                </div>
            );

        default:
            return <p className='text-xs text-muted-foreground'>Nodo no configurado.</p>;
    }
  }

  return (
    <div className="relative group">
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={handleStyle}
        className="nodrag"
      />
      <Card className="w-64 border-2 border-primary/40 shadow-lg bg-card">
        <CardHeader className="p-3 flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base flex items-center gap-3">
            <span className="text-primary">{nodeDef?.icon}</span>
            {nodeDef?.title || 'Nodo'}
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Cog className="h-4 w-4 text-muted-foreground" />
          </Button>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-center">
            {renderContent()}
        </CardContent>
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={handleStyle}
        className="nodrag"
      />
    </div>
  );
}
