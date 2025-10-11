
'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Link as LinkIcon, Database, Cog } from 'lucide-react';
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

const handleStyle = {
  width: '12px',
  height: '100%',
  borderRadius: '3px',
  background: 'hsl(var(--primary))',
  border: '2px solid hsl(var(--card))',
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
  // Find the node's definition to get its title, icon, etc.
  const nodeDef = NODE_CATEGORIES
    .flatMap(cat => cat.nodes)
    .find(node => node.type === data.nodeType);

  const renderContent = () => {
    switch (data.nodeType) {
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
        default:
            return (
                <Button variant="outline" size="sm" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Cargar Archivo
                </Button>
            );
    }
  }

  return (
    // node__<id> class is used to prevent dragging from inside elements
    <div className={`node__${id} group`}>
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={handleStyle}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />
      <Card className="w-64 border-2 border-primary/40 shadow-lg bg-card">
        <CardHeader className="p-3">
          <CardTitle className="text-base flex items-center gap-3">
            <span className="text-primary">{nodeDef?.icon}</span>
            {nodeDef?.title || 'Nodo de Entrada'}
          </CardTitle>
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
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />
    </div>
  );
}
