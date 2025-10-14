
'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Node } from '@xyflow/react';
import { NODE_CATEGORIES } from './node-types';
import { LoadCsvSheet } from './sheets/input/LoadCsvSheet';

interface NodeSheetProps {
  node: Node | null;
  onOpenChange: (isOpen: boolean) => void;
}

export function NodeSheet({ node, onOpenChange }: NodeSheetProps) {

  const nodeDefinition = node ? NODE_CATEGORIES
    .flatMap(cat => cat.nodes)
    .find(n => n.type === node.type) : null;

  const renderSheetContent = () => {
    if (!nodeDefinition) return null;

    // Here we can map node types to their specific sheet components
    switch (nodeDefinition.category) {
        case 'input':
            return <LoadCsvSheet />;
        // Add other categories and their sheets here
        default:
            return (
                <div className='p-4'>
                    <p>No configuration available for this node type yet.</p>
                </div>
            );
    }
  };

  return (
    <Sheet open={!!node} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0 flex flex-col">
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
