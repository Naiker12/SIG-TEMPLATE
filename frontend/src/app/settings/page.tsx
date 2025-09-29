
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSwitcher } from "@/components/dashboard/theme-switcher";
import { KeyRound, Bell, Brush, Settings as SettingsIcon } from "lucide-react";


export default function SettingsPage() {
  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <DashboardSidebar />
      </Sidebar>
      <SidebarInset>
        <main className="min-h-screen bg-background">
          <TopBar />
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
                <p className="text-muted-foreground mt-1">
                  Gestiona la configuración de la aplicación y las notificaciones.
                </p>
              </header>

              <Tabs defaultValue="general" className="flex flex-col md:flex-row gap-8 items-start">
                <TabsList className="flex flex-row md:flex-col justify-start h-auto bg-transparent p-0 border-b md:border-b-0 md:border-r w-full md:w-48">
                  <TabsTrigger value="general" className="justify-start gap-2"><SettingsIcon className="h-5 w-5"/>General</TabsTrigger>
                  <TabsTrigger value="appearance" className="justify-start gap-2"><Brush className="h-5 w-5"/>Apariencia</TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start gap-2"><Bell className="h-5 w-5"/>Notificaciones</TabsTrigger>
                  <TabsTrigger value="security" className="justify-start gap-2"><KeyRound className="h-5 w-5"/>Seguridad</TabsTrigger>
                </TabsList>

                <div className="flex-1 mt-4 md:mt-0">
                  <TabsContent value="general">
                    <Card className="shadow-lg border-2 border-accent">
                      <CardHeader>
                        <CardTitle>General</CardTitle>
                        <CardDescription>Configuración general del sitio.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="siteName">Nombre del Sitio</Label>
                          <Input id="siteName" defaultValue="SIG" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="siteUrl">URL del Sitio</Label>
                          <Input id="siteUrl" defaultValue="https://sig-app.com" />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="appearance">
                    <Card className="shadow-lg border-2 border-accent">
                      <CardHeader>
                        <CardTitle>Apariencia</CardTitle>
                        <CardDescription>
                          Personaliza la apariencia de la aplicación.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Tema</Label>
                            <CardDescription>Selecciona el tema para el dashboard.</CardDescription>
                          </div>
                          <ThemeSwitcher />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="font">Fuente</Label>
                          <Select defaultValue="inter">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una fuente" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inter">Inter</SelectItem>
                              <SelectItem value="roboto">Roboto</SelectItem>
                              <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fontSize">Tamaño de Fuente</Label>
                           <Select defaultValue="medium">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tamaño" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Pequeño</SelectItem>
                              <SelectItem value="medium">Mediano</SelectItem>
                              <SelectItem value="large">Grande</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notifications">
                    <Card className="shadow-lg border-2 border-accent">
                      <CardHeader>
                        <CardTitle>Notificaciones</CardTitle>
                        <CardDescription>
                          Configura cómo recibes las notificaciones.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-lg border">
                           <div>
                            <Label>Notificaciones por Correo</Label>
                            <CardDescription>Recibirás correos sobre actividad importante.</CardDescription>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg border">
                           <div>
                            <Label>Novedades del Producto</Label>
                            <CardDescription>Recibirás correos sobre nuevas funciones y actualizaciones.</CardDescription>
                          </div>
                          <Switch />
                        </div>
                         <div className="flex items-center justify-between p-4 rounded-lg border">
                           <div>
                            <Label>Recordatorios de Seguridad</Label>
                            <CardDescription>Recibirás correos sobre la seguridad de tu cuenta.</CardDescription>
                          </div>
                          <Switch defaultChecked/>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="security">
                    <Card className="shadow-lg border-2 border-accent">
                      <CardHeader>
                        <CardTitle>Seguridad</CardTitle>
                        <CardDescription>Gestiona la seguridad de tu cuenta.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                         <div className="space-y-2">
                          <Label>Sesiones Activas</Label>
                          <CardDescription>Cierra la sesión en todos los demás dispositivos.</CardDescription>
                          <Button variant="outline">Cerrar Sesión en otros dispositivos</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
              <div className="mt-8 flex justify-end">
                <Button>Guardar Cambios</Button>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    