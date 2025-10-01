
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, Link as LinkIcon, Bot, User, Send, Loader2 } from "lucide-react";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/hooks/useAuthStore';


export default function SemanticSearchPage() {
    const [sourceType, setSourceType] = useState('url');
    const [source, setSource] = useState<string | File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const { isLoggedIn } = useAuthStore(state => ({ isLoggedIn: state.isLoggedIn }));
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        if (useAuthStore.persist.hasHydrated()) {
            if (!useAuthStore.getState().isLoggedIn) {
                router.push('/');
            } else {
                setIsCheckingAuth(false);
            }
        }
        
        const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
             if (!useAuthStore.getState().isLoggedIn) {
                router.push('/');
            } else {
                setIsCheckingAuth(false);
            }
        });

        return () => unsubscribe();
    }, [isLoggedIn, router]);

    const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (sourceType === 'url') {
            setSource(e.target.value);
        } else {
            if (e.target.files) {
                setSource(e.target.files[0]);
            }
        }
    };
    
    const handleSearch = () => {
        if (!query.trim()) return;
        
        const userMessage = { role: 'user', content: query };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setQuery('');

        setTimeout(() => {
             const aiResponse = { role: 'ai', content: `Respuesta simulada de la IA para la pregunta: "${query}". La búsqueda semántica permite encontrar información basada en el significado contextual en lugar de coincidencias de palabras clave exactas.` };
             setMessages(prev => [...prev, aiResponse]);
             setIsLoading(false);
        }, 1500)

    };
    
    const isSourceSet = !!source;
    
    if (isCheckingAuth) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Búsqueda Semántica</h1>
                                <p className="text-muted-foreground mt-2 max-w-3xl">
                                    Haz preguntas en lenguaje natural sobre tus documentos o páginas web y obtén respuestas precisas.
                                </p>
                            </header>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                {/* Config Panel */}
                                <div className="lg:col-span-1 space-y-6 sticky top-24">
                                    <Card className="shadow-lg border-2 border-accent">
                                        <CardHeader>
                                            <CardTitle>Fuente de Datos</CardTitle>
                                            <CardDescription>Elige desde dónde quieres buscar.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Tabs defaultValue="url" onValueChange={setSourceType} className="w-full">
                                                <TabsList className="grid w-full grid-cols-2">
                                                    <TabsTrigger value="url">URL</TabsTrigger>
                                                    <TabsTrigger value="file">Archivo</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="url" className="mt-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="url-input">Pegar URL de la página</Label>
                                                        <div className="relative">
                                                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                            <Input id="url-input" placeholder="https://ejemplo.com/articulo" className="pl-10" onChange={handleSourceChange} />
                                                        </div>
                                                    </div>
                                                </TabsContent>
                                                <TabsContent value="file" className="mt-4">
                                                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl text-center">
                                                        <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
                                                        <Button asChild variant="outline">
                                                            <label htmlFor="file-upload" className="cursor-pointer">
                                                                {source instanceof File ? "Cambiar" : "Seleccionar"} Archivo
                                                            </label>
                                                        </Button>
                                                        <Input id="file-upload" type="file" onChange={handleSourceChange} accept=".pdf,.txt,.docx" className="hidden" />
                                                        {source instanceof File && <p className="text-muted-foreground text-sm mt-2">{source.name}</p>}
                                                        <p className="text-xs text-muted-foreground mt-3">Sube archivos .pdf, .txt, o .docx</p>
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </CardContent>
                                    </Card>
                                </div>
                                
                                {/* Chat Panel */}
                                <div className="lg:col-span-2">
                                    <Card className="shadow-lg border-2 border-accent">
                                        <CardHeader>
                                            <CardTitle>Chat de Búsqueda</CardTitle>
                                            <CardDescription>Haz tus preguntas aquí.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="h-[500px] flex flex-col">
                                            <ScrollArea className="flex-1 pr-4 -mr-4">
                                                <div className="space-y-6">
                                                {!isSourceSet ? (
                                                    <div className="flex items-center justify-center h-full pt-16">
                                                        <div className="text-center text-muted-foreground">
                                                            <Bot className="h-20 w-20 mx-auto" />
                                                            <p className="mt-4 text-lg font-semibold">Esperando fuente de datos</p>
                                                            <p>Configura una URL o sube un archivo para empezar a chatear.</p>
                                                        </div>
                                                    </div>
                                                ) : messages.length === 0 ? (
                                                     <div className="flex items-center justify-center h-full pt-16">
                                                        <div className="text-center text-muted-foreground">
                                                            <Bot className="h-20 w-20 mx-auto" />
                                                            <p className="mt-4 text-lg font-semibold">Listo para conversar</p>
                                                            <p>Escribe tu primera pregunta en el campo de abajo.</p>
                                                        </div>
                                                     </div>
                                                ): (
                                                    messages.map((msg, index) => (
                                                        <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : '')}>
                                                            {msg.role === 'ai' && (
                                                                <Avatar className="w-8 h-8 bg-primary text-primary-foreground flex-shrink-0">
                                                                    <AvatarFallback><Bot className="w-5 h-5"/></AvatarFallback>
                                                                </Avatar>
                                                            )}
                                                            <div className={cn("max-w-sm md:max-w-md p-3 rounded-2xl", msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none')}>
                                                                <p className="text-sm">{msg.content}</p>
                                                            </div>
                                                            {msg.role === 'user' && (
                                                                 <Avatar className="w-8 h-8 bg-muted text-muted-foreground flex-shrink-0">
                                                                    <AvatarFallback><User className="w-5 h-5"/></AvatarFallback>
                                                                </Avatar>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                                {isLoading && (
                                                    <div className="flex items-start gap-3">
                                                        <Avatar className="w-8 h-8 bg-primary text-primary-foreground flex-shrink-0">
                                                             <AvatarFallback><Bot className="w-5 h-5"/></AvatarFallback>
                                                        </Avatar>
                                                        <div className="max-w-sm md:max-w-md p-3 rounded-2xl bg-muted rounded-bl-none flex items-center gap-2">
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                            <p className="text-sm">Pensando...</p>
                                                        </div>
                                                    </div>
                                                )}
                                                </div>
                                            </ScrollArea>
                                        </CardContent>
                                        <CardFooter className="border-t pt-6">
                                             <div className="relative w-full">
                                                <Input 
                                                    placeholder={!isSourceSet ? "Primero configura una fuente de datos..." : "Escribe tu pregunta aquí..."}
                                                    value={query}
                                                    onChange={(e) => setQuery(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                                    disabled={!isSourceSet || isLoading}
                                                    className="pr-12"
                                                />
                                                <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={handleSearch} disabled={!isSourceSet || isLoading || !query.trim()}>
                                                    <Send className="h-4 w-4" />
                                                </Button>
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
