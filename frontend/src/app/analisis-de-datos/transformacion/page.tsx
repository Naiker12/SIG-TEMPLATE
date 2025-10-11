
'use client';

import React, { useCallback, useState } from 'react';
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AddNodeModal } from '@/components/transformacion/AddNodeModal';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

export default function DataTransformationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className='h-screen flex flex-col'>
        <TopBar />
        <main className="flex-1 relative">
            <ReactFlow>
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <Controls />
                <MiniMap />
            </ReactFlow>
            <div className="absolute top-4 left-4 z-10">
              <Button size="lg" onClick={() => setIsModalOpen(true)}>
                <PlusCircle className="mr-2 h-5 w-5" />
                Agregar Nodo
              </Button>
            </div>
        </main>
        <AddNodeModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
