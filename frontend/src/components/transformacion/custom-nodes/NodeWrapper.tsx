
'use client';

import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cog } from 'lucide-react';
import type { NodeDefinition } from '../node-types';

const handleStyle = {
  width: '12px',
  height: '100%',
  background: 'hsl(var(--primary))',
  border: '2px solid hsl(var(--card))',
  borderRadius: '3px'
};

type NodeWrapperProps = {
  nodeDef: NodeDefinition | undefined;
  children: React.ReactNode;
};

export function NodeWrapper({ nodeDef, children }: NodeWrapperProps) {
  return (
    <div className="relative group">
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={handleStyle}
        className="nodrag"
      />
      <Card className="w-72 border-2 border-primary/40 shadow-lg bg-card">
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
            {children}
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
