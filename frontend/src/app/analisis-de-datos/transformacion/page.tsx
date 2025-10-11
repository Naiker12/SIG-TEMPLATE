
'use client';

import React, { useState, useCallback, useMemo } from 'react';
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
  type DefaultEdgeOptions,
  type NodeTypes,
} from '@xyflow/react';
import { InputNode } from '@/components/transformacion/custom-nodes/InputNode';

import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
  type: 'smoothstep',
  style: {
    strokeWidth: 2,
    strokeDasharray: '5,5',
    stroke: 'hsl(var(--primary))'
  },
};

let nodeId = 0;

export default function DataTransformationPage() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoize nodeTypes to avoid re-renders
  const nodeTypes: NodeTypes = useMemo(() => ({
      inputNode: InputNode,
      // We can add more custom nodes here
  }), []);

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
    // For now, we'll map all inputs to a generic 'inputNode' type
    const newNode: Node = {
      id: `${++nodeId}`,
      type: 'inputNode', // Use the custom node type
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { nodeType: nodeType },
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
                nodeTypes={nodeTypes}
                defaultEdgeOptions={defaultEdgeOptions}
                fitView
            >
                <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
                <Controls />
                <MiniMap />
            </ReactFlow>
            <div className="absolute top-4 left-4 z-10">
              <Button size="lg" onClick={() => setIsModalOpen(true)} className="rounded-full shadow-lg">
                <PlusCircle className="mr-2 h-5 w-5" />
                Agregar Nodo
              </Button>
            </div>
        </main>
        <AddNodeModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} onNodeSelect={handleNodeSelect} />
    </div>
  );
}
