
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { Camera, Loader2 } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { isLoggedIn, user, clearSession } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn, router]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin" />
            </div>
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
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
               <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Mi Perfil</h1>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Profile Information Card */}
                <div className="lg:col-span-1 lg:sticky lg:top-24">
                   <Card className="shadow-lg border-2 border-accent">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                <Avatar className="h-28 w-28 border-4 border-card shadow-md">
                                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={`Avatar de ${user.name}`} />
                                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8">
                                    <Camera className="h-4 w-4"/>
                                </Button>
                            </div>
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground mt-2">Rol: {user.role}</p>
                        </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Profile Edit Form */}
                <div className="lg:col-span-2">
                   <Card className="shadow-lg border-2 border-accent">
                     <CardHeader>
                        <CardTitle>Configuración del Perfil</CardTitle>
                        <CardDescription>
                        Actualiza tu foto y tus datos personales aquí.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-muted-foreground border-b pb-2">Datos Personales</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Nombre Completo</Label>
                                <Input id="fullName" defaultValue={user.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input id="email" type="email" defaultValue={user.email} disabled />
                            </div>
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="bio">Biografía</Label>
                            <Textarea id="bio" placeholder="Cuéntanos un poco sobre ti." defaultValue="Soy un usuario apasionado por la tecnología y la inteligencia artificial." />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-muted-foreground border-b pb-2">Seguridad</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                                <Input id="currentPassword" type="password" placeholder="••••••••"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                                <Input id="newPassword" type="password" placeholder="••••••••"/>
                            </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-muted-foreground">Última actualización: hace 2 horas</p>
                        <div className="flex gap-2">
                            <Button variant="destructive" onClick={() => { clearSession(); router.push('/'); }}>Eliminar Cuenta</Button>
                            <Button>Guardar Cambios</Button>
                        </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
