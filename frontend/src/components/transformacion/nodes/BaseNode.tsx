
'use client';

import React from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';

const handleStyle = {
  width: '10px',
  height: '10px',
  background: 'hsl(var(--primary))',
  border: '2px solid hsl(var(--card))',
  borderRadius: '50%',
  boxShadow: '0 0 0 2px hsl(var(--background))',
};

type NodeData = {
  title: string;
  icon: React.ReactNode;
  description: string;
};

export const BaseNode: React.FC<NodeProps<NodeData>> = ({ id, data, selected }) => {
  const { setNodes, setEdges } = useReactFlow();

  const handleDelete = () => {
    setEdges((edges) => edges.filter((e) => e.source !== id && e.target !== id));
    setNodes((nodes) => nodes.filter((n) => n.id !== id));
  };
  
  return (
    <div className={cn(
      "rounded-2xl border-2 bg-card text-card-foreground shadow-lg transition-all duration-300",
      selected ? "border-primary shadow-primary/20" : "border-transparent"
    )}>
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <div className="p-4 flex items-start gap-4">
        <div className="flex-shrink-0 text-primary bg-primary/10 p-3 rounded-lg">
          {React.isValidElement(data.icon) ? React.cloneElement(data.icon as React.ReactElement, { className: "w-6 h-6" }) : null}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-lg truncate">{data.title}</p>
          <p className="text-xs text-muted-foreground truncate">{data.description}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={handleDelete}>
            <MoreVertical className="w-4 h-4"/>
        </Button>
      </div>
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  );
};
