
'use client';

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AreaChart, Bot, Download, Calendar as CalendarIcon } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { AnalyticsView } from "@/components/dashboard/analytics-view";

export default function Home() {
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
              </header>
              <div className="flex items-center gap-2">
                  <Button variant="outline"><CalendarIcon className="mr-2 h-4 w-4"/> Pick a date</Button>
                  <Button><Download className="mr-2 h-4 w-4"/> Download</Button>
              </div>
            </div>
            
            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">
                        <AreaChart className="mr-2"/> Overview
                    </TabsTrigger>
                    <TabsTrigger value="analytics">
                        <Bot className="mr-2"/> Analytics
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-6">
                    <DashboardOverview />
                </TabsContent>
                <TabsContent value="analytics" className="mt-6">
                    <AnalyticsView />
                </TabsContent>
            </Tabs>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
