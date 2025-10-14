
'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { TopBar } from "@/components/dashboard/topbar";
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
  const { screenToFlowPosition } = useReactFlow();

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
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition]
  );

  return (
    <>
      <main className="flex-1 grid grid-cols-[280px_1fr] h-full">
          <NodesPanel />
          <div className="h-full" ref={reactFlowWrapper}>
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
              </ReactFlow>
          </div>
      </main>
      <NodeSheet node={selectedNode} onOpenChange={() => setSelectedNode(null)} />
    </>
  );
}

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
