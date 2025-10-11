
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NODE_CATEGORIES, type NodeDefinition } from './node-types.tsx';

interface AddNodeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onNodeSelect?: (nodeType: string) => void;
}

const NodeCard = ({ node, onSelect }: { node: NodeDefinition, onSelect: (type: string) => void }) => (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => onSelect(node.type)}>
        <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
                {node.icon} {node.title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">{node.description}</p>
        </CardContent>
    </Card>
);


export function AddNodeModal({ isOpen, onOpenChange, onNodeSelect = () => {} }: AddNodeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[70vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl">Agregar un Nuevo Nodo</DialogTitle>
          <DialogDescription>
            Selecciona un nodo de las siguientes categorías para añadirlo a tu flujo de trabajo.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
           <Tabs defaultValue={NODE_CATEGORIES[0].id} className="h-full flex flex-col md:flex-row gap-6 p-6">
                <TabsList className="flex flex-col h-auto justify-start p-2 gap-1 w-full md:w-64">
                    {NODE_CATEGORIES.map(category => (
                        <TabsTrigger key={category.id} value={category.id} className="w-full justify-start text-base py-2 px-4">
                           <span className="mr-3">{category.icon}</span> {category.title}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <div className="flex-1 overflow-hidden">
                    {NODE_CATEGORIES.map(category => (
                        <TabsContent key={category.id} value={category.id} className="h-full m-0">
                            <ScrollArea className="h-full pr-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {category.nodes.map(node => (
                                        <NodeCard key={node.type} node={node} onSelect={onNodeSelect} />
                                    ))}
                                    {category.nodes.length === 0 && (
                                        <div className="col-span-2 text-center text-muted-foreground py-16">
                                            <p>Próximamente habrá nodos en esta categoría.</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
