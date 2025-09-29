
'use client';

import { useState } from "react";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { PdfFilesTable } from "@/components/dashboard/pdf-files-table";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AreaChart } from "lucide-react";
import { ReportsModal } from "@/components/dashboard/reports-modal";

export default function Home() {
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

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
