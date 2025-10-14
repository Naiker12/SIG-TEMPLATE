
'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { NODE_CATEGORIES, type NodeDefinition } from './node-types';
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { PanelLeftClose } from "lucide-react";

const DraggableNode = ({ nodeDef }: { nodeDef: NodeDefinition }) => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className="p-3 mb-2 rounded-lg border bg-card hover:bg-muted cursor-grab transition-colors"
            onDragStart={(event) => onDragStart(event, nodeDef.type)}
            draggable
        >
            <div className="flex items-center gap-4">
                <div className="text-primary bg-muted p-2 rounded-lg">
                    {nodeDef.icon}
                </div>
                <div>
                    <div className="font-semibold text-card-foreground">{nodeDef.title}</div>
                    <div className="text-xs text-muted-foreground">{nodeDef.description}</div>
                </div>
            </div>
        </div>
    );
};

interface NodesPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const NodesPanel = ({ isOpen, onToggle }: NodesPanelProps) => {
  return (
    <aside className="border-r bg-background flex flex-col h-full overflow-hidden">
      <AnimatePresence>
        {isOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
            >
                <div className="p-4 border-b flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-bold">Nodos</h2>
                        <p className="text-sm text-muted-foreground">Arrastra un nodo al lienzo.</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onToggle}>
                        <PanelLeftClose />
                    </Button>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-4">
                        {NODE_CATEGORIES.map((category) => (
                            <div key={category.id} className="mb-6">
                                <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2 flex items-center gap-2">
                                    {category.icon} {category.title}
                                </h3>
                                <div>
                                    {category.nodes.map((node) => (
                                        <DraggableNode key={node.type} nodeDef={node} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
