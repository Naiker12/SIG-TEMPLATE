
'use client';

import { TopBar } from "@/components/dashboard/topbar";
import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

export default function DataTransformationPage() {
  return (
    <div className='h-screen flex flex-col'>
        <TopBar />
        <main className="flex-1">
            <ReactFlow>
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </main>
    </div>
  );
}
