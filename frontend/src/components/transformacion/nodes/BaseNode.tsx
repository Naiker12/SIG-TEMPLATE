
'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

type NodeData = {
  title: string;
  icon: React.ReactNode;
  description: string;
};

export const BaseNode: React.FC<NodeProps<NodeData>> = ({ data, selected }) => {
  return (
    <div className={cn(
      "rounded-lg border-2 bg-card text-card-foreground shadow-md transition-all duration-200 w-60 hover:shadow-lg",
      selected ? "border-primary shadow-primary/20" : "border-border/50"
    )}>
      <div className="p-3 flex items-center gap-3">
        <div className="flex-shrink-0 text-primary">
          {React.isValidElement(data.icon) ? React.cloneElement(data.icon as React.ReactElement, { className: "w-5 h-5" }) : null}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{data.title}</p>
          <p className="text-xs text-muted-foreground truncate">{data.description}</p>
        </div>
      </div>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-primary"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-primary"
      />
    </div>
  );
};
