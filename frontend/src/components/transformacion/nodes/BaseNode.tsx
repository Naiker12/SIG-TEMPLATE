
'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

type NodeData = {
  title: string;
  icon: React.ReactNode;
  description: string;
  onDelete: (id: string) => void;
};

export const BaseNode: React.FC<NodeProps<NodeData>> = ({ id, data, selected }) => {
  return (
    <div className={cn(
      "rounded-2xl border-2 bg-card text-card-foreground shadow-md transition-all duration-200 w-64 hover:shadow-lg",
      selected ? "border-primary shadow-primary/20" : "border-border/50"
    )}>
      <div className="p-4 flex items-start gap-4">
        <div className="flex-shrink-0 text-primary bg-primary/10 p-2 rounded-lg">
          {React.isValidElement(data.icon) ? React.cloneElement(data.icon as React.ReactElement, { className: "w-6 h-6" }) : null}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{data.title}</p>
          <p className="text-sm text-muted-foreground truncate">{data.description}</p>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                    <MoreVertical className="w-4 h-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                 <DropdownMenuItem onClick={() => data.onDelete(id)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4"/>
                    Eliminar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Handles */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="a"
        className="!left-[-6px] !top-1/2 !-translate-y-1/2"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="b"
        className="!right-[-6px] !top-1/2 !-translate-y-1/2"
      />
    </div>
  );
};
