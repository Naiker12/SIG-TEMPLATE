
'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { NODE_CATEGORIES } from '../node-types';

export function InputNode({ data }: NodeProps<{ nodeType: string }>) {
  // Find the node's definition to get its title, icon, etc.
  const nodeDef = NODE_CATEGORIES
    .flatMap(cat => cat.nodes)
    .find(node => node.type === data.nodeType);

  return (
    <Card className="w-64 border-2 border-primary/40 shadow-lg">
      <CardHeader className="p-3">
        <CardTitle className="text-base flex items-center gap-3">
          <span className="text-primary">{nodeDef?.icon}</span>
          {nodeDef?.title || 'Nodo de Entrada'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 text-center">
        <p className="text-xs text-muted-foreground mb-3 h-10">
          {nodeDef?.description}
        </p>
        <Button variant="outline" size="sm" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Cargar Archivo
        </Button>
      </CardContent>
      {/* Handle for outgoing connections */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 !bg-primary"
      />
    </Card>
  );
}
