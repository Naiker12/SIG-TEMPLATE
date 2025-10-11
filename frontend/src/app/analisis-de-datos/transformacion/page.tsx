
'use client';

import React, { useState, useCallback } from 'react';
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
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

let nodeId = 0;

export default function DataTransformationPage() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleNodeSelect = (nodeType: string) => {
    const newNode: Node = {
      id: `${++nodeId}`,
      type: 'default', // Usaremos un tipo genérico por ahora
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `${nodeType}` },
       // Añadimos puntos de conexión
      sourcePosition: 'right',
      targetPosition: 'left',
    };
    setNodes((nds) => nds.concat(newNode));
    setIsModalOpen(false);
  };


  return (
    <div className='h-screen flex flex-col'>
        <TopBar />
        <main className="flex-1 relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
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
        <AddNodeModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} onNodeSelect={handleNodeSelect} />
    </div>
  );
}
