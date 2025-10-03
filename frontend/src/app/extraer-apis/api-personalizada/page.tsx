'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Code, TableIcon, View, HardDriveDownload, Settings, Loader2, File, FileJson, FileSpreadsheet, ChevronDown } from "lucide-react";
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLoadingStore } from '@/hooks/use-loading-store';
import { useAuthStore } from '@/hooks/useAuthStore';
import { DashboardSidebar } from '@/components/dashboard/sidebar';


export default function CustomApiPage() {
  const [response, setResponse] = useState<any>(null);
  const { setIsLoading, isLoading } = useLoadingStore();
  const [hasHeaders, setHasHeaders] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('cards');
  const { isLoggedIn } = useAuthStore(state => ({ isLoggedIn: state.isLoggedIn }));
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
        if (!useAuthStore.getState().isLoggedIn) {
            router.push('/');
        } else {
            setIsCheckingAuth(false);
        }
    }
    
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
         if (!useAuthStore.getState().isLoggedIn) {
            router.push('/');
        } else {
            setIsCheckingAuth(false);
        }
    });

    return () => unsubscribe();
  }, [isLoggedIn, router]);

  const handleExtract = () => {
    setIsLoading(true);
    setIsModalOpen(false);
    setTimeout(() => {
      setResponse({
        data: [
          { id: 1, product: "Laptop Gamer Pro", category: "Electrónica", stock: 25, price: 1499.99 },
          { id: 2, product: "Teclado Mecánico RGB", category: "Accesorios", stock: 150, price: 89.90 },
          { id: 3, product: "Monitor Ultrawide 34\"", category: "Monitores", stock: 45, price: 799.00 },
          { id: 4, product: "Silla Gamer Ergonómica", category: "Mobiliario", stock: 80, price: 349.50 },
        ],
        metadata: {
          source: "https://api.example.com/products",
          timestamp: "2024-08-26T14:30:00Z",
          count: 4
        }
      });
      setIsLoading(false);
    }, 1500);
  };

  const tableHeaders = response && response.data.length > 0 ? Object.keys(response.data[0] || {}) : [];
  
  if (isCheckingAuth) {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  const RequestModal = () => (
     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
            <Button size="lg">
                <Settings className="mr-2"/>
                Configurar Petición
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Configurar Petición de API</DialogTitle>
                <DialogDescription>Define los parámetros de tu punto final para extraer los datos.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="api-url">URL del Endpoint</Label>
                    <Input id="api-url" placeholder="https://api.example.com/data" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="api-method">Método</Label>
                    <Select defaultValue="GET">
                      <SelectTrigger id="api-method">
                        <SelectValue placeholder="Método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="headers-switch" checked={hasHeaders} onCheckedChange={setHasHeaders} />
                    <Label htmlFor="headers-switch">Añadir Cabeceras Personalizadas</Label>
                </div>
                {hasHeaders && (
                    <div className="space-y-2">
                        <Label htmlFor="api-headers">Cabeceras (JSON)</Label>
                        <Textarea id="api-headers" placeholder={`{\n  "Authorization": "Bearer YOUR_API_KEY"\n}`} rows={4} />
                    </div>
                )}
            </div>
            <DialogFooter>
                <Button type="button" onClick={handleExtract}>Extraer Datos</Button>
            </DialogFooter>
        </DialogContent>
     </Dialog>
  );

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
          <DropdownMenuItem><File className="mr-2"/>Descargar como CSV</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <DashboardSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <TopBar />
            <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              <div className="max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <header>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">API Personalizada</h1>
                    <p className="text-muted-foreground mt-2 max-w-3xl">
                      Conéctate a cualquier punto final de API para extraer y visualizar datos en tiempo real.
                    </p>
                  </header>
                  <div className="flex-shrink-0">
                      <RequestModal />
                  </div>
                </div>

                {/* Response Viewer */}
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
                    {!response && !isLoading && (
                       <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-xl bg-muted/50">
                          <div className="text-center text-muted-foreground p-4">
                              <p className="text-lg font-semibold mb-2">Esperando petición</p>
                              <p className="max-w-xs mx-auto">Usa el botón "Configurar Petición" para empezar a extraer datos de una API.</p>
                          </div>
                       </div>
                    )}
                    {response && (
                      <Tabs defaultValue="cards" value={activeTab} onValueChange={setActiveTab} className="mt-4">
                        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid md:grid-cols-3">
                          <TabsTrigger value="cards"><View className="mr-2"/>Tarjetas</TabsTrigger>
                          <TabsTrigger value="table"><TableIcon className="mr-2"/>Tabla</TabsTrigger>
                          <TabsTrigger value="json"><Code className="mr-2"/>JSON</TabsTrigger>
                        </TabsList>
                        <TabsContent value="cards" className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto">
                            {response.data.map((item: any) => (
                              <Card key={item.id} className="hover:border-primary/50 transition-colors">
                                <CardHeader>
                                  <CardTitle className="text-lg">{item.product}</CardTitle>
                                  <CardDescription>{item.category}</CardDescription>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-2 text-sm">
                                    <p className="text-muted-foreground">Stock:</p><p className="font-medium">{item.stock}</p>
                                    <p className="text-muted-foreground">Precio:</p><p className="font-medium">${item.price}</p>
                                </CardContent>
                              </Card>
                            ))}
                        </TabsContent>
                        <TabsContent value="table" className="mt-4">
                          <div className="border rounded-lg overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  {tableHeaders.map(header => <TableHead key={header}>{header.charAt(0).toUpperCase() + header.slice(1)}</TableHead>)}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                 {response.data.map((row: any) => (
                                    <TableRow key={row.id}>
                                      {tableHeaders.map(header => <TableCell key={`${row.id}-${header}`}>{row[header]}</TableCell>)}
                                    </TableRow>
                                 ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TabsContent>
                        <TabsContent value="json" className="mt-4">
                          <Textarea 
                              readOnly
                              value={JSON.stringify(response, null, 2)}
                              className="min-h-[400px] bg-muted/50 font-mono text-xs"
                          />
                        </TabsContent>
                      </Tabs>
                    )}
                  </CardContent>
                </Card>
              </div>
            </main>
        </div>
    </div>
  );
}
