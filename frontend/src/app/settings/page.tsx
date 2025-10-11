
'use client';

import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSwitcher } from "@/components/dashboard/theme-switcher";
import { Bell, Brush, Settings as SettingsIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";


export default function SettingsPage() {
  return (
    <>
      <TopBar />
      <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 overflow-auto pb-8">
        <div className="max-w-6xl mx-auto w-full">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Configuración</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona la configuración de la aplicación y las notificaciones.
            </p>
          </header>

          <Tabs defaultValue="general" className="flex flex-col md:flex-row gap-8 items-start">
            <TabsList className="flex flex-row md:flex-col justify-start h-auto bg-transparent p-0 border-b md:border-b-0 md:border-r w-full md:w-48">
              <TabsTrigger value="general" className="justify-start gap-2"><SettingsIcon className="h-5 w-5"/>General</TabsTrigger>
              <TabsTrigger value="appearance" className="justify-start gap-2"><Brush className="h-5 w-5"/>Apariencia</TabsTrigger>
              <TabsTrigger value="notifications" className="justify-start gap-2"><Bell className="h-5 w-5"/>Notificaciones</TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-4 md:mt-0">
              <TabsContent value="general">
                <Card className="shadow-lg border-2 border-accent">
                  <CardHeader>
                    <CardTitle>General</CardTitle>
                    <CardDescription>Configuración general de tu espacio de trabajo.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-base font-semibold">Sitio</h4>
                        <div className="space-y-2">
                          <Label htmlFor="siteName">Nombre del Sitio</Label>
                          <Input id="siteName" defaultValue="SIG IA" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="siteUrl">URL del Sitio</Label>
                          <Input id="siteUrl" defaultValue="https://sig-ia.app" />
                        </div>
                    </div>
                    <Separator/>
                     <div className="space-y-4">
                        <h4 className="text-base font-semibold">Localización y Formatos</h4>
                        <div className="space-y-2">
                          <Label htmlFor="language">Idioma</Label>
                          <Select defaultValue="es">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un idioma" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="es">Español</SelectItem>
                              <SelectItem value="en">Inglés</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Zona Horaria</Label>
                           <Select defaultValue="utc-5">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una zona horaria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="utc-5">UTC-5 (Bogotá, Lima, Quito)</SelectItem>
                              <SelectItem value="utc-6">UTC-6 (Ciudad de México)</SelectItem>
                              <SelectItem value="utc-3">UTC-3 (Buenos Aires)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                         <div className="space-y-2">
                          <Label htmlFor="download-format">Formato de Descarga Preferido</Label>
                           <Select defaultValue="excel">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un formato" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                              <SelectItem value="csv">CSV (.csv)</SelectItem>
                              <SelectItem value="json">JSON (.json)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <Label>Tema de la Interfaz</Label>
                        <CardDescription>Selecciona un tema claro u oscuro.</CardDescription>
                      </div>
                      <ThemeSwitcher />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                       <div>
                        <Label>Bloquear barra lateral abierta</Label>
                        <CardDescription>Mantiene la barra lateral siempre visible.</CardDescription>
                      </div>
                      <Switch />
                    </div>
                     <Separator/>
                     <div className="space-y-4">
                        <h4 className="text-base font-semibold">Tipografía</h4>
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
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                       <div>
                        <Label>Notificaciones por Correo</Label>
                        <CardDescription>Recibirás correos sobre actividad importante.</CardDescription>
                      </div>
                      <Switch defaultChecked />
                    </div>
                     <div className="flex items-center justify-between p-4 rounded-lg border">
                       <div>
                        <Label>Notificaciones de Tareas</Label>
                        <CardDescription>Recibir un correo cuando una tarea larga finalice.</CardDescription>
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
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
          <div className="mt-8 flex justify-end">
            <Button>Guardar Cambios</Button>
          </div>
        </div>
      </main>
    </>
  );
}
