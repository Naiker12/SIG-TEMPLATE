
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NODE_CATEGORIES, type NodeDefinition } from './node-types';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface AddNodeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onNodeSelect?: (nodeType: string) => void;
}

const NodeCard = ({ node, onSelect }: { node: NodeDefinition, onSelect: (type: string) => void }) => (
    <Card 
      className="hover:border-primary/80 transition-colors cursor-pointer bg-card/50 hover:bg-muted/80 group" 
      onClick={() => onSelect(node.type)}
    >
        <CardHeader>
            <CardTitle className="text-base flex items-center gap-3">
                <span className="text-primary group-hover:scale-110 transition-transform">{node.icon}</span>
                {node.title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">{node.description}</p>
        </CardContent>
    </Card>
);


export function AddNodeModal({ isOpen, onOpenChange, onNodeSelect = () => {} }: AddNodeModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = NODE_CATEGORIES.map(category => ({
    ...category,
    nodes: category.nodes.filter(node => 
      node.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.nodes.length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[70vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2 border-b">
          <DialogTitle className="text-2xl">Agregar un Nuevo Nodo</DialogTitle>
          <DialogDescription>
            Busca o selecciona un nodo de las siguientes categorías para añadirlo a tu flujo.
          </DialogDescription>
          <div className="relative pt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar nodos (ej: CSV, Filtrar, API...)" 
              className="pl-10 h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
           <Tabs defaultValue={filteredCategories[0]?.id || ''} className="h-full flex flex-col md:flex-row gap-6 p-6">
                <TabsList className="flex flex-col h-auto justify-start p-1 gap-1 w-full md:w-56 bg-transparent">
                    {filteredCategories.map(category => (
                        <TabsTrigger key={category.id} value={category.id} className="w-full justify-start text-base py-2.5 px-4 data-[state=active]:bg-muted data-[state=active]:shadow-none">
                           <span className="mr-3 text-lg">{category.icon}</span> {category.title}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <div className="flex-1 overflow-hidden border-l pl-6">
                    {filteredCategories.map(category => (
                        <TabsContent key={category.id} value={category.id} className="h-full m-0">
                            <ScrollArea className="h-full pr-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {category.nodes.map(node => (
                                        <NodeCard key={node.type} node={node} onSelect={onNodeSelect} />
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    ))}
                    {filteredCategories.length === 0 && (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>No se encontraron nodos para "{searchTerm}".</p>
                      </div>
                    )}
                </div>
            </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
