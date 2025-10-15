
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, TableIcon, View, HardDriveDownload, Settings, Loader2, FileJson, FileSpreadsheet, ChevronDown, Network, KeyRound } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/limpieza-de-datos/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useToast } from '@/hooks/use-toast';
import { fetchCustomApi } from '@/services/apiService';
import type { CustomApiRequest, CustomApiResponse } from '@/services/apiService';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export default function CustomApiPage() {
  const [response, setResponse] = useState<CustomApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('cards');
  const { toast } = useToast();

  const handleExtract = async (requestData: CustomApiRequest) => {
    setIsLoading(true);
    setIsSheetOpen(false);
    setResponse(null);

    try {
        const result = await fetchCustomApi(requestData);
        setResponse(result);
        if (result.status_code >= 400) {
           toast({
              variant: "destructive",
              title: `Error ${result.status_code}`,
              description: `La API ha respondido con un error. Revisa la consola para más detalles.`,
            });
        } else {
            toast({
              title: "Petición Exitosa",
              description: `Datos recibidos correctamente con estado ${result.status_code}.`,
            });
        }
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error de Conexión",
            description: error instanceof Error ? error.message : "No se pudo conectar con el servidor.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const responseDataArray = useMemo(() => {
    if (!response || !response.data) return [];
    if (Array.isArray(response.data)) {
        return response.data;
    }
    if (typeof response.data === 'object' && response.data !== null) {
        // Handle APIs that return a result object with a data array inside, e.g. { "results": [...] }
        const dataKey = Object.keys(response.data).find(key => Array.isArray((response.data as any)[key]));
        if (dataKey) {
            return (response.data as any)[dataKey];
        }
        return [response.data]; // It's a single object, wrap it in an array
    }
    return [];
  }, [response]);

  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (responseDataArray.length === 0) return [];
    
    const dataKeys = Array.from(new Set(responseDataArray.flatMap(item => Object.keys(item))));

    return dataKeys.map(key => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
    }));
  }, [responseDataArray]);
  

  const RequestSheet = () => {
    const [request, setRequest] = useState<Partial<CustomApiRequest>>({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/users',
        headers: {},
        body: {}
    });
    const [useAuth, setUseAuth] = useState(false);

    useEffect(() => {
        const newHeaders = { ...request.headers };
        if (useAuth) {
            newHeaders['Authorization'] = 'Bearer TU_TOKEN_AQUÍ';
        } else {
            delete newHeaders['Authorization'];
        }
        // Set a default content-type for methods that usually have a body
        if(request.method === 'POST' || request.method === 'PUT') {
            if (!newHeaders['Content-Type']) {
                newHeaders['Content-Type'] = 'application/json';
            }
        }
        setRequest(prev => ({ ...prev, headers: newHeaders }));
    }, [useAuth, request.method]);

    const handleFieldChange = <K extends keyof CustomApiRequest>(field: K, value: CustomApiRequest[K]) => {
        setRequest(prev => ({...prev, [field]: value }));
    }

    const handleSubmit = () => {
        if (!request.url || !URL.canParse(request.url)) {
            toast({ variant: 'destructive', title: 'URL inválida', description: 'Por favor, ingresa una URL válida.' });
            return;
        }

        const finalRequest: CustomApiRequest = {
            method: request.method || 'GET',
            url: request.url,
            headers: Object.keys(request.headers || {}).length > 0 ? request.headers : undefined,
            body: (request.method === 'POST' || request.method === 'PUT') && Object.keys(request.body || {}).length > 0 ? request.body : undefined,
        };
        
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
                                const parsedHeaders = JSON.parse(e.target.value);
                                setRequest(prev => ({ ...prev, headers: parsedHeaders }));
                                // check if auth header is now present/absent
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
                               handleFieldChange('body', JSON.parse(e.target.value));
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

    if (activeTab === 'json') {
      return (
        <Button variant="outline">
          <FileJson className="mr-2"/> Descargar JSON
        </Button>
      )
    }

    return (
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <HardDriveDownload className="mr-2" />
            Descargar
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem><FileSpreadsheet className="mr-2"/>Descargar como Excel</DropdownMenuItem>
          <DropdownMenuItem><FileJson className="mr-2"/>Descargar como CSV</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <TopBar />
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
                    {response && <DownloadButton />}
                </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                  {isLoading ? (
                     <motion.div key="loader" {...containerVariants} className="flex items-center justify-center h-96 border-2 border-dashed rounded-xl bg-muted/50">
                        <div className="text-center text-muted-foreground p-4 flex flex-col items-center gap-4">
                            <Loader2 className="h-12 w-12 animate-spin text-primary"/>
                            <p className="text-lg font-semibold">Extrayendo datos...</p>
                        </div>
                     </motion.div>
                  ) : !response ? (
                     <motion.div key="placeholder" {...containerVariants} className="flex items-center justify-center h-96 border-2 border-dashed rounded-xl bg-muted/50">
                        <div className="text-center text-muted-foreground p-4">
                            <Network className="h-16 w-16 mx-auto mb-4" />
                            <p className="text-lg font-semibold mb-2">Esperando petición</p>
                            <p className="max-w-xs mx-auto">Usa el botón "Configurar Petición" para empezar a extraer datos de una API.</p>
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
                                    <Card key={item.id || index} className="hover:border-primary/50 transition-colors">
                                    <CardHeader>
                                        <CardTitle className="text-lg truncate">{item.name || item.title || `Item ${index + 1}`}</CardTitle>
                                        <CardDescription>{item.category || item.email || Object.values(item)[1]}</CardDescription>
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
