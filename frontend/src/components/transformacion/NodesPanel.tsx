
'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import { NODE_CATEGORIES, type NodeDefinition } from './node-types';
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { PanelLeftClose } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <AnimatePresence>
        {isOpen && (
            <motion.aside 
                className="absolute top-20 bottom-4 left-4 z-10 w-72 bg-card/95 backdrop-blur-sm border rounded-2xl flex flex-col h-auto"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } }}
                exit={{ opacity: 0, x: -50, transition: { duration: 0.2, ease: "easeIn" } }}
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
                            <div key={category.id} className="mb-4">
                                <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2 flex items-center gap-2">
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
            </motion.aside>
        )}
    </AnimatePresence>
  );
};
