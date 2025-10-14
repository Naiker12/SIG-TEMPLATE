
'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from '@/components/ui/button';
import { PlusCircle, PanelBottom, Cog } from 'lucide-react';
import { AddNodeModal } from '@/components/transformacion/AddNodeModal';
import { BottomPanel } from '@/components/transformacion/BottomPanel';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  ReactFlowProvider, // Import the provider
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type DefaultEdgeOptions,
  type NodeTypes,
  type FitViewOptions,
} from '@xyflow/react';
import { NODE_CATEGORIES } from '@/components/transformacion/node-types';

import '@xyflow/react/dist/style.css';
import { NodeSheet } from '@/components/transformacion/NodeSheet';

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: false,
  type: 'smoothstep',
  style: {
    strokeWidth: 2,
    stroke: 'hsl(var(--primary))'
  },
};

let nodeId = 0;

// All the logic and JSX is now in this child component
const DataTransformationFlow = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { setCenter } = useReactFlow();

  const nodeTypes: NodeTypes = useMemo(() => {
    const types: NodeTypes = {};
    NODE_CATEGORIES.forEach(category => {
      category.nodes.forEach(nodeDef => {
        types[nodeDef.type] = nodeDef.component;
      });
    });
    return types;
  }, []);

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

  const handleNodeSelectFromModal = (nodeType: string) => {
    const nodeDefinition = NODE_CATEGORIES
        .flatMap(cat => cat.nodes)
        .find(n => n.type === nodeType);

    if (!nodeDefinition) return;

    const position = { x: Math.random() * 200, y: Math.random() * 200 };
    const newNode: Node = {
      id: `${nodeDefinition.type}_${++nodeId}`,
      type: nodeType,
      position,
      data: { 
          title: nodeDefinition.title,
          icon: nodeDefinition.icon,
          description: nodeDefinition.description,
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setIsModalOpen(false);
  };
  
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  useEffect(() => {
    const unselectNode = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.react-flow__node') && !target.closest('[role="dialog"]')) {
        setSelectedNode(null);
      }
    };
    document.addEventListener('click', unselectNode);
    return () => document.removeEventListener('click', unselectNode);
  }, []);

  return (
    <>
      <main className="flex-1 relative">
          <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              defaultEdgeOptions={defaultEdgeOptions}
              fitView
              fitViewOptions={fitViewOptions}
              selectionOnDrag
          >
              <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
              <Controls />
              <MiniMap />
          </ReactFlow>
          <div className="absolute top-4 right-16 z-10">
            <Button size="lg" onClick={() => setIsModalOpen(true)} className="rounded-full shadow-lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              Agregar Nodo
            </Button>
          </div>
          <BottomPanel />
      </main>
      <AddNodeModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} onNodeSelect={handleNodeSelectFromModal} />
      <NodeSheet node={selectedNode} onOpenChange={() => setSelectedNode(null)} />
    </>
  );
}

// The main page component now just provides the context
export default function DataTransformationPage() {
  return (
    <div className='h-screen flex flex-col'>
      <TopBar />
      <ReactFlowProvider>
        <DataTransformationFlow />
      </ReactFlowProvider>
    </div>
  );
}
