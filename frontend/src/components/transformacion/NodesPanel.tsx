
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
            className="p-3 mb-2 rounded-lg border-2 border-dashed bg-card hover:bg-muted cursor-grab transition-colors"
            onDragStart={(event) => onDragStart(event, nodeDef.type)}
            draggable
        >
            <div className="flex items-center gap-3">
                <div className="text-primary">{nodeDef.icon}</div>
                <div>
                    <div className="font-semibold">{nodeDef.title}</div>
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
                        <p className="text-sm text-muted-foreground">Arrastra al lienzo.</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onToggle}>
                        <PanelLeftClose />
                    </Button>
                </div>
                <ScrollArea className="flex-1">
                    <Accordion type="multiple" defaultValue={['input', 'transform']} className="w-full p-4">
                        {NODE_CATEGORIES.map((category) => (
                            <AccordionItem value={category.id} key={category.id}>
                                <AccordionTrigger className="text-base py-2">
                                    <span className="flex items-center gap-2">{category.icon} {category.title}</span>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pl-2 border-l-2 ml-2">
                                    {category.nodes.map((node) => (
                                        <DraggableNode key={node.type} nodeDef={node} />
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </ScrollArea>
            </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
