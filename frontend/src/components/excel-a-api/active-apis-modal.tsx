
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, DatabaseZap, Eye, TestTube, Copy, Settings, Trash2, BarChartHorizontal } from 'lucide-react';
import { ApiAnalytics } from './api-analytics';
import { ApiSettings } from './api-settings';
import { useToast } from '@/hooks/use-toast';

const apis = [
  { id: 'ds_abc123', name: 'API VENTAS Q1 2024', status: 'Activa', endpoint: '/api/datasets/ds_abc123/data', created: '15/01/2024', callsToday: 45, usage: 87, access: 'Privado' },
  { id: 'ds_def456', name: 'API INVENTARIO CENTRAL', status: 'Activa', endpoint: '/api/datasets/ds_def456/data', created: '10/01/2024', callsToday: 12, usage: 23, access: 'Público' },
  { id: 'ds_ghi789', name: 'API CLIENTES PREMIUM', status: 'Limitada', endpoint: '/api/datasets/ds_ghi789/data', created: '05/01/2024', callsToday: 950, usage: 95, access: 'Privado' },
  { id: 'ds_jkl012', name: 'API LOGS DE SISTEMA', status: 'Inactiva', endpoint: '/api/datasets/ds_jkl012/data', created: '02/01/2024', callsToday: 0, usage: 0, access: 'Privado' },
];

type View = 'list' | 'analytics' | 'settings';

export function ActiveApisModal({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) {
  const [view, setView] = useState<View>('list');
  const [selectedApi, setSelectedApi] = useState<any>(null);
  const { toast } = useToast();

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado al portapapeles",
      description: "El endpoint de la API ha sido copiado.",
    });
  };

  const handleSelectApi = (api: any) => {
    setSelectedApi(api);
    setView('analytics'); // Default to analytics view
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedApi(null);
  };

  const getStatusVariant = (status: string) => {
    if (status === 'Activa') return 'default';
    if (status === 'Limitada') return 'secondary';
    if (status === 'Inactiva') return 'destructive';
    return 'outline';
  };

  const getStatusColor = (status: string) => {
    if (status === 'Activa') return 'text-green-500';
    if (status === 'Limitada') return 'text-yellow-500';
    if (status === 'Inactiva') return 'text-red-500';
    return '';
  };
  
  const renderHeader = () => {
      if (view === 'list') {
          return (
             <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2"><DatabaseZap /> Mis APIs Activas</DialogTitle>
                <DialogDescription>Gestiona, monitoriza y configura tus APIs generadas.</DialogDescription>
            </DialogHeader>
          )
      }
      if (selectedApi) {
          return (
               <DialogHeader>
                  <Button variant="ghost" onClick={handleBackToList} className="absolute left-6 top-6 h-8 w-8 p-0">
                      <ArrowLeft />
                  </Button>
                  <DialogTitle className="text-2xl text-center">{selectedApi.name}</DialogTitle>
                   <div className="flex justify-center items-center gap-4 pt-2">
                        <Button variant={view === 'analytics' ? 'default' : 'outline'} size="sm" onClick={() => setView('analytics')}>
                            <BarChartHorizontal className="mr-2" /> Analytics
                        </Button>
                        <Button variant={view === 'settings' ? 'default' : 'outline'} size="sm" onClick={() => setView('settings')}>
                            <Settings className="mr-2" /> Configuración
                        </Button>
                    </div>
              </DialogHeader>
          )
      }
      return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 h-[80vh] flex flex-col">
        <div className="p-6 pb-0">{renderHeader()}</div>
        
        <ScrollArea className="flex-1 px-6 pb-6">
            {view === 'list' && (
                <div className="space-y-4">
                    {apis.map(api => (
                        <Card key={api.id} className="font-mono text-sm border-2 hover:border-primary transition-colors cursor-pointer" onClick={() => handleSelectApi(api)}>
                            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                               <div className="md:col-span-2 space-y-3">
                                   <div className="flex justify-between items-start gap-2">
                                        <p className="font-bold text-base text-foreground break-all flex items-center gap-2">
                                            <DatabaseZap className="w-5 h-5 text-primary" />
                                            {api.name}
                                        </p>
                                        <Badge variant={getStatusVariant(api.status)} className={getStatusColor(api.status)}>
                                            {api.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 p-2 bg-muted rounded-md flex items-center justify-between font-mono">
                                            <span className='text-muted-foreground font-sans'>📍 <span className="text-foreground">{api.endpoint}</span></span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={(e) => handleCopy(e, api.endpoint)}>
                                            <Copy className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground font-sans">
                                        <p>📅 Creado: {api.created}</p>
                                        <p>🔐 Acceso: {api.access}</p>
                                        <p>👥 {api.callsToday} llamadas hoy</p>
                                        <p>📊 {api.usage}% uso límite</p>
                                    </div>
                               </div>
                               <div className="md:col-span-1 grid grid-cols-2 gap-2 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4">
                                    <Button variant="outline" size="sm"><Eye className="mr-2" />Ver</Button>
                                    <Button variant="outline" size="sm"><TestTube className="mr-2" />Probar</Button>
                                    <Button variant="outline" size="sm" onClick={(e) => {e.stopPropagation(); setSelectedApi(api); setView('settings');}}><Settings className="mr-2" />Editar</Button>
                                    <Button variant="destructive" size="sm"><Trash2 className="mr-2"/>Eliminar</Button>
                               </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            {view === 'analytics' && selectedApi && <ApiAnalytics api={selectedApi} />}
            {view === 'settings' && selectedApi && <ApiSettings api={selectedApi} />}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}