
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
  const { toggle } = useSidebarStore();
  const [isClient, setIsClient] = useState(false);
  const authModal = useAuthModal();
  const { isLoggedIn, user } = useAuthStore();
  
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
    <header className="flex h-16 shrink-0 items-center justify-between gap-x-4 border-b bg-background px-4 sm:px-6">
      <div className="flex flex-1 items-center gap-4 min-w-0">
        <Button variant="ghost" size="icon" className="md:hidden flex-shrink-0" onClick={toggle}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
         <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar..." className="w-full pl-10 bg-background rounded-lg" />
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {isClient && <span className="hidden font-semibold text-muted-foreground md:inline-block bg-background px-4 py-2 rounded-lg text-sm">
          {date}
        </span>}
        <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
        </Button>
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
