
'use client';

import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, MoreVertical, Play, PlusCircle, AlertCircle, CheckCircle, History } from "lucide-react";

const scheduledTasksData = [
    { name: "Sincronización Diaria de Clientes (Salesforce)", frequency: "Cada 24 horas", lastRun: "Hace 8 horas", status: "Activo" },
    { name: "Actualización de Inventario (SAP)", frequency: "Cada hora", lastRun: "Hace 32 minutos", status: "Activo" },
    { name: "Backup Semanal de Contactos (HubSpot)", frequency: "Cada 7 días", lastRun: "Hace 3 días", status: "Pausado" },
    { name: "Informe Financiero Mensual", frequency: "Primer día del mes", lastRun: "Error hace 1 día", status: "Error" },
];

export default function ScheduledSyncPage() {
    const [tasks, setTasks] = useState(scheduledTasksData);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Activo": return "default";
            case "Pausado": return "secondary";
            case "Error": return "destructive";
            default: return "outline";
        }
    };
    
    const toggleTaskStatus = (taskName: string) => {
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.name === taskName 
                ? { ...task, status: task.status === 'Activo' ? 'Pausado' : 'Activo' }
                : task
            )
        );
    };

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <DashboardSidebar />
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen bg-background">
          <TopBar />
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <header>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Sincronización Programada</h1>
                    <p className="text-muted-foreground mt-2 max-w-3xl">
                    Automatiza la extracción de datos configurando tareas recurrentes.
                    </p>
                </header>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-base p-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
                        <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
                        Función en Beta
                    </Badge>
                    <Button>
                        <PlusCircle className="mr-2"/>
                        Nueva Tarea
                    </Button>
                </div>
              </div>

              <Card className="shadow-lg border-2 border-accent">
                <CardHeader>
                    <CardTitle>Tareas Programadas</CardTitle>
                    <CardDescription>Gestiona tus sincronizaciones automáticas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tarea</TableHead>
                                    <TableHead className="hidden md:table-cell">Frecuencia</TableHead>
                                    <TableHead className="hidden lg:table-cell">Última Ejecución</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tasks.map((task, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{task.name}</TableCell>
                                        <TableCell className="hidden md:table-cell">{task.frequency}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{task.lastRun}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadge(task.status)}>{task.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Switch 
                                                    checked={task.status === 'Activo'} 
                                                    onCheckedChange={() => toggleTaskStatus(task.name)}
                                                    aria-label={`Activar o pausar la tarea ${task.name}`}
                                                />
                                                <Button variant="ghost" size="icon">
                                                    <History className="h-4 w-4" />
                                                    <span className="sr-only">Historial</span>
                                                </Button>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4"/>
                                                    <span className="sr-only">Opciones</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
