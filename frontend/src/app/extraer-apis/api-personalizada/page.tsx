
'use client';

import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, TableIcon, View, HardDriveDownload, Settings, Loader2, FileJson, FileSpreadsheet, ChevronDown, Network, KeyRound, Download } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/limpieza-de-datos/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';
import { fetchCustomApi, getLatestApiData, clearTempApiData } from '@/services/apiService';
import type { CustomApiRequest } from '@/services/apiService';
import { Switch } from '@/components/ui/switch';
import { CircularProgressBar } from '@/components/ui/circular-progress-bar';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

// Función auxiliar para encontrar el primer array anidado en un objeto
const findNestedArray = (data: any): any[] => {
    if (Array.isArray(data)) {
        return data;
    }
    if (typeof data === 'object' && data !== null) {
        // Claves comunes que suelen contener el array de datos principal
        const commonKeys = ['results', 'data', 'docs', 'items', 'records', 'users', 'payload', 'rows', 'list'];
        for (const key of commonKeys) {
            if (Array.isArray(data[key])) {
                return data[key];
            }
        }
        // Si no se encuentra una clave común, buscar la primera propiedad que sea un array
        for (const key in data) {
            if (Array.isArray(data[key])) {
                return data[key];
            }
        }
        // Si no hay ningún array, pero es un objeto, devolverlo como un array de un elemento
        return [data];
    }
    return [];
};


export default function CustomApiPage() {
  const [response, setResponse] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('cards');
  const { toast } = useToast();

  const handleExtract = async (requestData: CustomApiRequest) => {
    setIsSheetOpen(false); // Cierra el panel de configuración
    setIsLoading(true);
    setProgress(0);
    setResponse(null);

    const progressInterval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 95) {
                clearInterval(progressInterval);
                return 95;
            }
            return prev + 5;
        });
    }, 200);

    try {
        console.log("Enviando petición al backend:", requestData);
        const result = await fetchCustomApi(requestData);
        console.log("Respuesta recibida del backend:", result);
        setResponse(result);
        toast({
          title: "Petición Exitosa",
          description: `Datos recibidos correctamente.`,
        });
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error de Conexión",
            description: error instanceof Error ? error.message : "No se pudo conectar con el servidor.",
        });
    } finally {
        clearInterval(progressInterval);
        setProgress(100);
        setIsLoading(false);
    }
  };

  const responseDataArray = useMemo(() => {
    if (!response) return [];
    return findNestedArray(response);
  }, [response]);

  const columns: ColumnDef<any>[] = useMemo(() => {
    if (responseDataArray.length === 0) return [];
    
    const allKeys = responseDataArray.reduce<Set<string>>((keys, item) => {
        if (item && typeof item === 'object') {
            Object.keys(item).forEach(key => keys.add(key));
        }
        return keys;
    }, new Set());

    return Array.from(allKeys).map(key => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
    }));
  }, [responseDataArray]);

  const downloadData = async (format: 'json' | 'csv' | 'excel') => {
      toast({ title: `Preparando descarga como ${format.toUpperCase()}` });
      try {
          const temp_data = await getLatestApiData();
          const dataToExport = findNestedArray(temp_data.responseData);

          if (!dataToExport || dataToExport.length === 0) {
              toast({ variant: 'destructive', title: 'Sin datos', description: 'No hay datos para exportar.' });
              return;
          }

          if (format === 'json') {
              const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
              saveAs(blob, 'datos_api.json');
          } else if (format === 'csv') {
              const headers = Object.keys(dataToExport[0]);
              const csv = [
                  headers.join(','),
                  ...dataToExport.map(row => headers.map(field => JSON.stringify(row[field] ?? '')).join(','))
              ].join('\n');
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              saveAs(blob, 'datos_api.csv');
          } else if (format === 'excel') {
              const worksheet = XLSX.utils.json_to_sheet(dataToExport);
              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
              XLSX.writeFile(workbook, 'datos_api.xlsx');
          }

          await clearTempApiData();
          toast({ title: 'Descarga Completa', description: 'Los datos temporales han sido limpiados.' });

      } catch (error) {
          toast({ variant: 'destructive', title: 'Error al descargar', description: error instanceof Error ? error.message : "No se pudieron obtener los datos para la descarga."});
      }
  }
  

  const RequestSheet = () => {
    const [request, setRequest] = useState<Partial<CustomApiRequest>>({
        method: 'GET',
        url: '',
        headers: {},
        body: {}
    });
    const [useAuth, setUseAuth] = useState(false);

    React.useEffect(() => {
      const newHeaders = { ...(request.headers || {}) };
      if (useAuth) {
        newHeaders['Authorization'] = 'Bearer TU_TOKEN_AQUÍ';
      } else {
        delete newHeaders['Authorization'];
      }
      
      if (request.method === 'POST' || request.method === 'PUT') {
        if (!newHeaders['Content-Type']) {
          newHeaders['Content-Type'] = 'application/json';
        }
      } else {
         if (newHeaders['Content-Type'] === 'application/json') {
          delete newHeaders['Content-Type'];
        }
      }
      
      setRequest(prev => ({ ...prev, headers: newHeaders }));
    }, [useAuth, request.method]);

    const handleFieldChange = <K extends keyof CustomApiRequest>(field: K, value: CustomApiRequest[K]) => {
        setRequest(prev => ({...prev, [field]: value }));
    }

    const handleSubmit = () => {
        if (!request.url) {
            toast({ variant: 'destructive', title: 'URL inválida', description: 'Por favor, ingresa una URL válida.' });
            return;
        }

        const finalRequest: CustomApiRequest = {
            method: request.method || 'GET',
            url: request.url,
            ...(request.headers && Object.keys(request.headers).length > 0 ? { headers: request.headers } : {}),
        };
        
        if ((request.method === 'POST' || request.method === 'PUT') && request.body && typeof request.body === 'object' && Object.keys(request.body).length > 0) {
            finalRequest.body = request.body;
        }
        
        handleExtract(finalRequest);
    }
    
    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <Button size="lg">
                    <Settings className="mr-2"/>
                    Configurar Petición
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Configurar Petición de API</SheetTitle>
                    <SheetDescription>Define los parámetros de tu punto final para extraer los datos.</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="api-url">URL del Endpoint</Label>
                        <Input id="api-url" placeholder="https://api.example.com/data" value={request.url} onChange={(e) => handleFieldChange('url', e.target.value as any)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="api-method">Método</Label>
                        <Select value={request.method} onValueChange={(value) => handleFieldChange('method', value as any)}>
                          <SelectTrigger id="api-method"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="space-y-3 rounded-lg border p-4">
                         <div className="flex items-center justify-between">
                            <Label htmlFor="auth-switch" className="flex items-center gap-2 font-semibold">
                                <KeyRound className="h-5 w-5 text-primary"/>
                                Autenticación
                            </Label>
                            <Switch id="auth-switch" checked={useAuth} onCheckedChange={setUseAuth} />
                         </div>
                         <p className="text-sm text-muted-foreground">Activa para añadir una cabecera de autorización "Bearer Token".</p>
                    </div>

                    <div className="space-y-2">
                       <Label htmlFor="api-headers">Cabeceras (JSON)</Label>
                       <Textarea 
                          id="api-headers" 
                          placeholder={`{\n  "Content-Type": "application/json"\n}`} 
                          rows={4}
                          value={JSON.stringify(request.headers, null, 2)}
                          onChange={(e) => {
                             try {
                                const parsedHeaders = e.target.value ? JSON.parse(e.target.value) : {};
                                setRequest(prev => ({ ...prev, headers: parsedHeaders }));
                                setUseAuth('Authorization' in parsedHeaders);
                             } catch (err) {/* Ignore JSON parse errors while typing */}
                          }}
                       />
                    </div>
                     {(request.method === 'POST' || request.method === 'PUT') && (
                       <div className="space-y-2">
                         <Label htmlFor="api-body">Cuerpo (JSON)</Label>
                         <Textarea
                           id="api-body"
                           placeholder={`{\n  "key": "value"\n}`}
                           rows={6}
                           value={JSON.stringify(request.body, null, 2)}
                           onChange={(e) => {
                             try {
                               handleFieldChange('body', e.target.value ? JSON.parse(e.target.value) : {});
                             } catch (err) {/* Ignore JSON parse errors while typing */}
                           }}
                         />
                       </div>
                     )}
                </div>
                <SheetFooter>
                    <Button type="button" onClick={handleSubmit}>Extraer Datos</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
  };

  const DownloadButton = () => {
    if (!response) return null;

    return (
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Download className="mr-2" />
            Descargar
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => downloadData('json')}><FileJson className="mr-2"/>Descargar como JSON</DropdownMenuItem>
          <DropdownMenuItem onClick={() => downloadData('csv')}><FileJson className="mr-2"/>Descargar como CSV</DropdownMenuItem>
          <DropdownMenuItem onClick={() => downloadData('excel')}><FileSpreadsheet className="mr-2"/>Descargar como Excel</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <TopBar />
       <AnimatePresence>
        {isLoading && (
            <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            >
                <CircularProgressBar progress={progress} message="Extrayendo datos..." />
            </motion.div>
        )}
      </AnimatePresence>
      <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 overflow-auto">
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-full mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <header>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">API Personalizada</h1>
              <p className="text-muted-foreground mt-2 max-w-3xl">
                Conéctate a cualquier punto final de API para extraer y visualizar datos en tiempo real.
              </p>
            </header>
            <div className="flex-shrink-0">
                <RequestSheet />
            </div>
          </div>

          <Card className="shadow-lg min-h-[600px] border-2 border-accent">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <CardTitle>Resultados de la Petición</CardTitle>
                    <CardDescription>Visualiza los datos extraídos de la API.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    {response && responseDataArray.length > 0 && <DownloadButton />}
                </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                  {!response || responseDataArray.length === 0 ? (
                     <motion.div key="placeholder" {...containerVariants} className="flex items-center justify-center h-96 border-2 border-dashed rounded-xl bg-muted/50">
                        <div className="text-center text-muted-foreground p-4">
                            <Network className="h-16 w-16 mx-auto mb-4" />
                            <p className="text-lg font-semibold mb-2">Esperando petición</p>
                            <p className="max-w-sm mx-auto text-sm leading-relaxed">
                              Conecta tu API personalizada y observa cómo los datos cobran vida en tiempo real.
                              <br />
                              <span className="text-primary font-medium">Haz clic en “Configurar Petición”</span> para comenzar.
                            </p>
                        </div>
                     </motion.div>
                  ) : (
                    <motion.div key="content" {...containerVariants}>
                        <Tabs defaultValue="cards" value={activeTab} onValueChange={setActiveTab} className="mt-4">
                            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid md:grid-cols-3">
                                <TabsTrigger value="cards"><View className="mr-2"/>Tarjetas</TabsTrigger>
                                <TabsTrigger value="table"><TableIcon className="mr-2"/>Tabla</TabsTrigger>
                                <TabsTrigger value="json"><Code className="mr-2"/>JSON</TabsTrigger>
                            </TabsList>
                            <TabsContent value="cards" className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {responseDataArray.map((item: any, index: number) => (
                                    <Card key={item.id || item._id || index} className="hover:border-primary/50 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="text-lg truncate">{String(item.name || item.title || `Item ${index + 1}`)}</CardTitle>
                                        <CardDescription>{String(item.category || item.email || Object.values(item)[1]?.toString() || '')}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-2 text-sm">
                                        {Object.entries(item).slice(0, 4).map(([key, value]) => (
                                          <React.Fragment key={key}>
                                            <p className="text-muted-foreground truncate">{key}:</p>
                                            <p className="font-medium truncate">{String(value)}</p>
                                          </React.Fragment>
                                        ))}
                                    </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>
                            <TabsContent value="table" className="mt-4">
                                <DataTable columns={columns} data={responseDataArray} />
                            </TabsContent>
                            <TabsContent value="json" className="mt-4">
                                <div className="relative">
                                    <Textarea 
                                        readOnly
                                        value={JSON.stringify(response, null, 2)}
                                        className="min-h-[400px] bg-muted/50 font-mono text-xs"
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                  )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </>
  );
}
