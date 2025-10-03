'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TopBar } from "@/components/dashboard/topbar";
import { Camera, Loader2, LogOut } from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile, updateUserPassword } from "@/services/userService";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

const profileSchema = z.object({
  name: z.string().min(1, "El nombre no puede estar vacío."),
  bio: z.string().optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Debes ingresar tu contraseña actual."),
    newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
    const { isLoggedIn, user, clearSession, setSession } = useAuthStore(state => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        clearSession: state.clearSession,
        setSession: state.setSession,
    }));
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, setValue } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
    });
    
    const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPasswordForm } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
    });

    useEffect(() => {
        if (useAuthStore.persist.hasHydrated()) {
            const state = useAuthStore.getState();
            if (!state.isLoggedIn) {
                router.push('/');
            } else {
                setValue('name', state.user?.name || '');
                setValue('bio', state.user?.bio || '');
                setIsCheckingAuth(false);
            }
        }
        
        const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
             const state = useAuthStore.getState();
             if (!state.isLoggedIn) {
                router.push('/');
            } else {
                setValue('name', state.user?.name || '');
                setValue('bio', state.user?.bio || '');
                setIsCheckingAuth(false);
            }
        });

        return () => unsubscribe();
    }, [isLoggedIn, router, setValue]);

    const onProfileSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
        setIsLoading(true);
        try {
            const updatedUser = await updateUserProfile(data);
            const currentToken = useAuthStore.getState().token;
            if (currentToken) {
                setSession(currentToken, updatedUser);
            }
            toast({ title: "Éxito", description: "Tu perfil ha sido actualizado." });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: error instanceof Error ? error.message : "No se pudo actualizar el perfil." });
        } finally {
            setIsLoading(false);
        }
    };
    
    const onPasswordSubmit: SubmitHandler<PasswordFormValues> = async (data) => {
        setIsLoading(true);
        try {
            await updateUserPassword({ current_password: data.currentPassword, new_password: data.newPassword });
            toast({ title: "Éxito", description: "Tu contraseña ha sido actualizada." });
            resetPasswordForm();
        } catch (error) {
             toast({ variant: "destructive", title: "Error", description: error instanceof Error ? error.message : "No se pudo actualizar la contraseña." });
        } finally {
            setIsLoading(false);
        }
    }

    const handleLogout = () => {
        clearSession();
        router.push('/');
    }

    if (isCheckingAuth || !user) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

  return (
    <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex flex-col w-full">
            <TopBar />
            <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 overflow-auto">
               <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Mi Perfil</h1>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
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
                            <p className="text-xs text-muted-foreground mt-2">Rol: {user.role.name}</p>
                        </div>
                    </CardContent>
                  </Card>
                   <Card className="shadow-lg border-2 border-accent">
                        <CardHeader>
                            <CardTitle>Zona de Peligro</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <Button variant="destructive" className="w-full" onClick={handleLogout}>
                             <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                           </Button>
                        </CardContent>
                   </Card>
                </div>

                <div className="lg:col-span-2 space-y-8">
                   <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                       <Card className="shadow-lg border-2 border-accent mb-8">
                         <CardHeader>
                            <CardTitle>Datos Personales</CardTitle>
                            <CardDescription>Actualiza tu foto y tus datos personales aquí.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre Completo</Label>
                                <Input id="name" {...registerProfile("name")} />
                                {profileErrors.name && <p className="text-sm text-destructive">{profileErrors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input id="email" type="email" defaultValue={user.email} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Biografía</Label>
                                <Textarea id="bio" placeholder="Cuéntanos un poco sobre ti." {...registerProfile("bio")} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Guardar Datos
                            </Button>
                        </CardFooter>
                      </Card>
                  </form>
                  
                  <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                      <Card className="shadow-lg border-2 border-accent">
                          <CardHeader>
                             <CardTitle>Seguridad</CardTitle>
                             <CardDescription>Gestiona la seguridad de tu cuenta.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                               <Label htmlFor="currentPassword">Contraseña Actual</Label>
                               <Input id="currentPassword" type="password" placeholder="••••••••" {...registerPassword("currentPassword")} />
                               {passwordErrors.currentPassword && <p className="text-sm text-destructive">{passwordErrors.currentPassword.message}</p>}
                            </div>
                            <div className="space-y-2">
                               <Label htmlFor="newPassword">Nueva Contraseña</Label>
                               <Input id="newPassword" type="password" placeholder="••••••••" {...registerPassword("newPassword")} />
                               {passwordErrors.newPassword && <p className="text-sm text-destructive">{passwordErrors.newPassword.message}</p>}
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-end">
                             <Button type="submit" disabled={isLoading}>
                               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Cambiar Contraseña
                            </Button>
                          </CardFooter>
                      </Card>
                  </form>
                </div>
              </div>
            </main>
        </div>
    </div>
  );
}
