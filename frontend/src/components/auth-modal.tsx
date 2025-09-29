
'use client';

import { useAuthModal } from '@/hooks/use-auth-modal';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// SVG Icons for social buttons
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M15.5 9.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" />
      <path d="M8.5 17.5c1.5-1 3.5-1.5 7-1.5" />
    </svg>
);

// The Modal Component itself
const AuthModal = () => {
    const { isOpen, onClose } = useAuthModal();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-0">
                 <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                        <TabsTrigger value="register">Registrarse</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login" className="p-6">
                        <DialogHeader className="mb-4">
                            <DialogTitle>Iniciar Sesión</DialogTitle>
                            <DialogDescription>Ingresa a tu cuenta para continuar.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input id="email" type="email" placeholder="tu@email.com" required />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <a href="#" className="ml-auto inline-block text-sm underline">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                                <Input id="password" type="password" required />
                            </div>
                            <Button type="submit" className="w-full">
                                Iniciar Sesión
                            </Button>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline">
                                <GithubIcon className="mr-2 h-4 w-4" />
                                GitHub
                                </Button>
                                <Button variant="outline">
                                <GoogleIcon className="mr-2 h-4 w-4" />
                                Google
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="register" className="p-6">
                        <DialogHeader className="mb-4">
                            <DialogTitle>Registrarse</DialogTitle>
                            <DialogDescription>Crea una cuenta para empezar a usar la aplicación.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input id="name" placeholder="Tu Nombre" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email-register">Correo Electrónico</Label>
                                <Input id="email-register" type="email" placeholder="tu@email.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password-register">Contraseña</Label>
                                <Input id="password-register" type="password" required />
                            </div>
                            <Button type="submit" className="w-full">
                                Crear Cuenta
                            </Button>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline">
                                    <GithubIcon className="mr-2 h-4 w-4" />
                                    GitHub
                                </Button>
                                <Button variant="outline">
                                    <GoogleIcon className="mr-2 h-4 w-4" />
                                    Google
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

// Provider component to be used in the layout
export const AuthModalProvider = () => {
    return <AuthModal />;
};
