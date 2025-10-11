
'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Link, Database } from 'lucide-react';
import { NODE_CATEGORIES } from '../node-types';

export function InputNode({ data }: NodeProps<{ nodeType: string }>) {
  // Find the node's definition to get its title, icon, etc.
  const nodeDef = NODE_CATEGORIES
    .flatMap(cat => cat.nodes)
    .find(node => node.type === data.nodeType);

  const renderContent = () => {
    switch (data.nodeType) {
        case 'LOAD_API':
            return (
                <div className='flex items-center gap-2'>
                    <Link className="h-4 w-4 text-muted-foreground"/>
                    <Input placeholder="Pegar URL de API..." className="text-xs h-8" />
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
    <div className="relative group">
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        className="w-3 h-16 rounded-l-none rounded-r-md border-2 !bg-card -ml-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
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
        className="w-3 h-16 rounded-r-none rounded-l-md border-2 !bg-card -mr-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}
