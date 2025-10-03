
'use client';

import { useState } from 'react';
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { DashboardSidebar } from '@/components/dashboard/sidebar';

const documents = [
  { name: "Informe_Financiero_Q4.pdf", date: "2024-08-15" },
  { name: "Propuesta_Comercial_V2.pdf", date: "2024-08-12" },
  { name: "Contrato_Servicios_ABC.pdf", date: "2024-08-10" },
  { name: "Manual_Usuario_App.pdf", date: "2024-08-05" },
  { name: "Plan_Marketing_2025.pdf", date: "2024-08-01" },
];

export default function FileViewerPage() {
    const [selectedDoc, setSelectedDoc] = useState<any>(null);

  return (
    <div className="flex h-screen w-full">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
            <TopBar />
            <main className="flex-1 overflow-y-auto p-4 sm:px-6">
                <div className="w-full">
                    <header className="px-0 py-4 border-b">
                        <h1 className="text-2xl font-bold tracking-tight">Visor de Archivos</h1>
                        <p className="text-muted-foreground mt-1">
                            Selecciona un documento para previsualizarlo.
                        </p>
                    </header>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-[350px_1fr] overflow-hidden h-[calc(100vh-10rem)]">
                        {/* Sidebar de Documentos */}
                        <aside className="border-r flex flex-col">
                           <div className="p-4 space-y-4">
                             <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Buscar documentos..." className="pl-10" />
                             </div>
                           </div>
                           <ScrollArea className="flex-1">
                             <nav className="p-4 space-y-2">
                                {documents.map((doc, index) => (
                                  <button 
                                    key={index} 
                                    className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-start gap-3"
                                    onClick={() => setSelectedDoc(doc)}
                                  >
                                    <FileText className="h-5 w-5 mt-1 flex-shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                      <span className="font-medium truncate">{doc.name}</span>
                                      <span className="text-sm text-muted-foreground">{doc.date}</span>
                                    </div>
                                  </button>
                                ))}
                             </nav>
                           </ScrollArea>
                        </aside>

                        {/* Visor Principal */}
                        <div className="flex-1 flex flex-col bg-muted/20">
                          <div className="flex-1 flex items-center justify-center p-8">
                              <Card className="w-full h-full max-w-4xl shadow-lg border-2 border-accent">
                                <CardContent className="p-0 h-full flex items-center justify-center">
                                   {!selectedDoc ? (
                                     <div className="text-center text-muted-foreground">
                                       <FileText className="mx-auto h-24 w-24" />
                                       <p className="mt-4 text-lg">Selecciona un documento para empezar</p>
                                       <p>La previsualización del PDF aparecerá aquí.</p>
                                     </div>
                                   ) : (
                                     <div className="text-center text-foreground">
                                        <h2 className="text-xl font-semibold">Previsualización de</h2>
                                        <p className="text-lg mt-2 font-mono bg-muted p-2 rounded-md">{selectedDoc.name}</p>
                                     </div>
                                   )}
                                </CardContent>
                              </Card>
                          </div>
                          <footer className="h-16 bg-card border-t flex items-center justify-center px-4 gap-4">
                              <Button variant="ghost" size="icon" disabled={!selectedDoc}>
                                <ZoomOut className="h-5 w-5" />
                              </Button>
                              <span className="text-sm font-medium">100%</span>
                              <Button variant="ghost" size="icon" disabled={!selectedDoc}>
                                <ZoomIn className="h-5 w-5" />
                              </Button>
                              <div className="w-px h-6 bg-border mx-2"></div>
                               <Button variant="ghost" size="icon" disabled={!selectedDoc}>
                                <ChevronLeft className="h-5 w-5" />
                              </Button>
                              <span className="text-sm">
                                Página <Input defaultValue="1" className="inline-block w-12 h-8 text-center mx-1" disabled={!selectedDoc} /> de 15
                              </span>
                               <Button variant="ghost" size="icon" disabled={!selectedDoc}>
                                <ChevronRight className="h-5 w-5" />
                              </Button>
                          </footer>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
  );
}
