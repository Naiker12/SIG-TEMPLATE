
'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Node } from '@xyflow/react';
import { NODE_DEFINITIONS } from './node-types';
import { LoadCsvSheet } from './sheets/input/LoadCsvSheet';

interface NodeSheetProps {
  node: Node | null;
  onOpenChange: (isOpen: boolean) => void;
}

export function NodeSheet({ node, onOpenChange }: NodeSheetProps) {

  const nodeDefinition = node ? NODE_DEFINITIONS[node.type] : null;

  const renderSheetContent = () => {
    if (!nodeDefinition) return null;

    switch (nodeDefinition.category) {
        case 'input':
            if (nodeDefinition.type === 'LOAD_CSV') {
              return <LoadCsvSheet />;
            }
            // Add other input sheets here...
            return <div className='p-6'>Configuración para {nodeDefinition.title}</div>
        default:
            return (
                <div className='p-6'>
                    <p>No hay configuración disponible para este tipo de nodo todavía.</p>
                </div>
            );
    }
  };

  return (
    <Sheet open={!!node} onOpenChange={onOpenChange}>
      <SheetContent 
        className="w-[400px] sm:w-[540px] p-0 flex flex-col bg-card/95 backdrop-blur-sm border-l"
        // Custom positioning for floating effect
        style={{
            top: '1rem',
            right: '1rem',
            bottom: '1rem',
            height: 'auto',
            transform: 'none',
        }}
      >
        {nodeDefinition && (
            <>
                <SheetHeader className="p-6 border-b">
                    <SheetTitle className="text-2xl flex items-center gap-3">
                       <span className='text-primary'>{nodeDefinition.icon}</span>
                       {nodeDefinition.title}
                    </SheetTitle>
                    <SheetDescription>{nodeDefinition.description}</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                    {renderSheetContent()}
                </div>
            </>
        )}
      </SheetContent>
    </Sheet>
  );
}
