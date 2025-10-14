
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area";
import { NODE_CATEGORIES, type NodeDefinition } from './node-types';

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

export const NodesPanel = () => {
  return (
    <aside className="border-r bg-background flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Nodos Disponibles</h2>
        <p className="text-sm text-muted-foreground">Arrastra un nodo al lienzo.</p>
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
    </aside>
  );
};
