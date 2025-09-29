
'use client';

import { useState } from "react";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { PdfFilesTable } from "@/components/dashboard/pdf-files-table";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AreaChart, Bot } from "lucide-react";
import { ReportsModal } from "@/components/dashboard/reports-modal";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useAuthModal } from "@/hooks/use-auth-modal";

export default function Home() {
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const authModal = useAuthModal();

  if (!isLoggedIn) {
      return (
          <SidebarProvider>
              <Sidebar variant="sidebar" collapsible="icon">
                  <DashboardSidebar />
              </Sidebar>
              <SidebarInset>
                  <main className="min-h-screen bg-background">
                      <TopBar />
                      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center h-[calc(100vh-5rem)]">
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
                  </main>
              </SidebarInset>
          </SidebarProvider>
      );
  }

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <DashboardSidebar />
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen bg-background">
          <TopBar />
          <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <header>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Tablero</h1>
                <p className="text-muted-foreground mt-2 max-w-3xl">
                  Una vista general de tu actividad y análisis de documentos.
                </p>
              </header>
              <Button size="lg" onClick={() => setIsReportsModalOpen(true)}>
                <AreaChart className="mr-2" />
                Ver Reportes
              </Button>
            </div>
            
            <DashboardOverview />
            <PdfFilesTable />
          </div>
        </main>
      </SidebarInset>
      <ReportsModal isOpen={isReportsModalOpen} onOpenChange={setIsReportsModalOpen} />
    </SidebarProvider>
  );
}
