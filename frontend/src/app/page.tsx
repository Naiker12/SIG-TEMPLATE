'use client';

import { useState, useEffect } from "react";
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Bot, Download, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { AnalyticsView } from "@/components/dashboard/analytics-view";
import { getUserFiles, type File as RecentFile } from "@/services/fileService";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function Home() {
  const { isLoggedIn } = useAuthStore();
  const authModal = useAuthModal();
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setIsLoadingFiles(true);
      getUserFiles()
        .then(files => setRecentFiles(files))
        .catch(console.error)
        .finally(() => setIsLoadingFiles(false));
    }
  }, [isLoggedIn]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <DashboardSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <TopBar />
        <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {!isLoggedIn ? (
            <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
              <div className="text-center max-w-lg">
                <div className="inline-flex items-center justify-center p-6 bg-primary/10 rounded-full mb-6">
                  <Bot className="h-16 w-16 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Bienvenido a SIG IA</h1>
                <p className="text-muted-foreground mt-4 mb-8">
                  Tu plataforma inteligente para la gestión documental. Explora nuestras herramientas públicas o inicia sesión para acceder a todas las funciones y optimizar tu flujo de trabajo.
                </p>
                <Button size="lg" onClick={authModal.onOpen}>
                  Comenzar Ahora
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <header>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Tablero</h1>
                </header>
                <div className="flex items-center gap-2">
                  <Button variant="outline"><CalendarIcon className="mr-2 h-4 w-4"/> Seleccionar Fecha</Button>
                  <Button><Download className="mr-2 h-4 w-4"/> Descargar</Button>
                </div>
              </div>
              
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">
                    Vista General
                  </TabsTrigger>
                  <TabsTrigger value="analytics">
                    Analíticas
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-6">
                  {isLoadingFiles ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <DashboardOverview files={recentFiles} />
                  )}
                </TabsContent>
                <TabsContent value="analytics" className="mt-6">
                  <AnalyticsView />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
