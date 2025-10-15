
'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
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
  ReactFlowProvider,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type DefaultEdgeOptions,
  type NodeTypes,
  type FitViewOptions,
} from '@xyflow/react';
import { NODE_DEFINITIONS } from '@/components/transformacion/node-types';

import '@xyflow/react/dist/style.css';
import { NodeSheet } from '@/components/transformacion/NodeSheet';
import { NodesPanel } from '@/components/transformacion/NodesPanel';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelRightOpen, Play, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomPanel } from '@/components/transformacion/BottomPanel';


const fitViewOptions: FitViewOptions = {
  padding: 0.3,
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

const DataTransformationFlow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const { screenToFlowPosition, fitView } = useReactFlow();

  const nodeTypes: NodeTypes = useMemo(() => {
    const types: NodeTypes = {};
    Object.values(NODE_DEFINITIONS).forEach(nodeDef => {
        types[nodeDef.type] = nodeDef.component;
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
  
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowWrapper.current) {
        return;
      }
      
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const nodeDefinition = NODE_DEFINITIONS[type];
      if (!nodeDefinition) return;

      const newNode: Node = {
        id: `${type}_${++nodeId}`,
        type,
        position,
        data: { 
            title: nodeDefinition.title,
            icon: nodeDefinition.icon,
            description: nodeDefinition.description,
            onDelete: (id: string) => setNodes(nds => nds.filter(n => n.id !== id)),
        },
      };

      setNodes((nds) => nds.concat(newNode));
      setTimeout(() => fitView({ duration: 300 }), 100);
    },
    [screenToFlowPosition, fitView]
  );

  return (
    <div className='flex-1 flex flex-col overflow-hidden relative'>
       <header className="h-16 flex items-center justify-between px-6 shrink-0 bg-transparent absolute top-0 left-0 right-0 z-10">
          <h2 className="text-xl font-bold">Editor de Transformación</h2>
          <div className="flex items-center gap-2">
              <Button variant="outline"><Download className="mr-2 h-4 w-4"/> Guardar</Button>
              <Button><Play className="mr-2 h-4 w-4"/> Ejecutar Flujo</Button>
          </div>
       </header>
       
       <main className="flex-1 flex overflow-hidden">
          <NodesPanel isOpen={isPanelOpen} onToggle={() => setIsPanelOpen(!isPanelOpen)} />
          <div className="flex-1 h-full" ref={reactFlowWrapper}>
              <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  defaultEdgeOptions={defaultEdgeOptions}
                  fitView
                  fitViewOptions={fitViewOptions}
                  selectionOnDrag
              >
                  <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
                  <Controls />
                  <MiniMap />
                  <BottomPanel />
                   {!isPanelOpen && (
                      <Button variant="ghost" size="icon" onClick={() => setIsPanelOpen(true)} className="absolute top-20 left-4 z-10">
                        <PanelRightOpen />
                      </Button>
                   )}
              </ReactFlow>
          </div>
      </main>
      <NodeSheet node={selectedNode} onOpenChange={() => setSelectedNode(null)} />
    </div>
  );
}

export default function DataTransformationPage() {
  return (
    <div className='h-screen flex flex-col bg-background'>
      <ReactFlowProvider>
        <DataTransformationFlow />
      </ReactFlowProvider>
    </div>
  );
}
