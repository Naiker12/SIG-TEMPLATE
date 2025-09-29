
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuthModal } from "@/hooks/use-auth-modal";

export function TopBar() {
  const [date, setDate] = useState("");
  const { toggleSidebar, state } = useSidebar();
  const [isClient, setIsClient] = useState(false);
  const authModal = useAuthModal();
  const pathname = usePathname();
  
  // For now, we'll simulate a logged-out state.
  // In a real app, this would come from an auth context.
  const isLoggedIn = false;

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
    <header className="flex h-20 items-center justify-between border-b bg-card px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex flex-1 items-center gap-4 min-w-0">
        <Button variant="ghost" size="icon" className="md:hidden flex-shrink-0" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
        {isClient && state === 'collapsed' && (
          <Button variant="ghost" size="icon" className="hidden md:flex flex-shrink-0" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        )}
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
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificaciones</span>
        </Button>
        <button onClick={isLoggedIn ? undefined : authModal.onOpen}>
          <Avatar className="h-9 w-9 border-2 border-muted">
              <AvatarImage src={isLoggedIn ? "https://placehold.co/80x80.png" : ""} alt="Avatar" data-ai-hint="avatar persona" />
              <AvatarFallback>{isLoggedIn ? "N" : "?"}</AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  );
}
