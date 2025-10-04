
"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, LogIn, Menu } from "lucide-react";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { useAuthStore } from "@/hooks/useAuthStore";
import Link from "next/link";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import { cn } from "@/lib/utils";

function DateDisplay() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es }));
  }, []);

  if (!currentDate) {
    return <div className="h-9 w-48 rounded-md bg-muted animate-pulse" />;
  }
  
  return (
    <Button variant="outline" className="hidden sm:flex">
      {currentDate}
    </Button>
  );
}

export function TopBar() {
  const [isClient, setIsClient] = useState(false);
  const authModal = useAuthModal();
  const { isLoggedIn, user } = useAuthStore();
  const { isOpen, toggle } = useSidebarStore();
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
       <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="flex sm:hidden"
        >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir/Cerrar Sidebar</span>
        </Button>
       
       {!isOpen && (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="hidden sm:flex"
        >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir Sidebar</span>
        </Button>
      )}

       <div className="relative flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar..." className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]" />
      </div>
      <div className="flex items-center gap-2 ml-auto">
        {isClient && isLoggedIn && (
          <>
            <DateDisplay />
            <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notificaciones</span>
            </Button>
          </>
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
