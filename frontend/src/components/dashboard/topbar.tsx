"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Menu, LogIn } from "lucide-react";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { useAuthStore } from "@/hooks/useAuthStore";
import Link from "next/link";
import { useSidebarStore } from "@/hooks/use-sidebar-store";


export function TopBar() {
  const [date, setDate] = useState("");
  const [isClient, setIsClient] = useState(false);
  const authModal = useAuthModal();
  const { isLoggedIn, user } = useAuthStore();
  const { toggle } = useSidebarStore();
  
  useEffect(() => {
    setIsClient(true);
    const now = new Date();
    setDate(now.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }));
  }, []);
  
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Button onClick={toggle} variant="ghost" size="icon" className="sm:hidden">
        <Menu />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
       <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar..." className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]" />
      </div>
      <div className="flex items-center gap-2">
        {isClient && isLoggedIn && (
            <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notificaciones</span>
            </Button>
        )}

        {isClient && isLoggedIn && user ? (
            <Link href="/profile">
                <Avatar className="h-9 w-9 border-2 border-border cursor-pointer">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={`Avatar de ${user.name}`} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
            </Link>
        ) : (
            isClient && (
                <Button variant="outline" onClick={authModal.onOpen}>
                    <LogIn className="mr-2 h-4 w-4"/>
                    Iniciar Sesión
                </Button>
            )
        )}
      </div>
    </header>
  );
}
