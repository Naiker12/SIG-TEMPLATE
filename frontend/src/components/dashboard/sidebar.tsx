"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LogOut,
  Moon,
  Sun,
  ChevronDown,
  ChevronsLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
  Sheet,
  SheetContent,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  publicMenuItems,
  privateMenuItems,
  settingsMenuItems,
  type MenuItem,
  type SubMenuItem,
} from "./sidebar-data";
import { useAuthStore } from "@/hooks/useAuthStore";
import { cn } from "@/lib/utils";

const NavItem = ({ item, setOpenMobile }: { item: MenuItem; setOpenMobile: (open: boolean) => void }) => {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isChildActive = item.items?.some(sub => pathname === sub.href);
  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => {
    if (state === 'collapsed') {
      setIsOpen(false);
    }
  }, [state]);

  if (item.isCollapsible && item.items) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={isChildActive && !isOpen}
            className="w-full"
          >
            <item.icon />
            <span>{item.title}</span>
            <ChevronDown
              className={cn(
                "ml-auto size-4 transition-transform",
                "group-data-[state=collapsed]:hidden",
                isOpen && "rotate-180"
              )}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.href}>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathname === subItem.href}
                  onClick={() => setOpenMobile(false)}
                >
                  <Link href={subItem.href}>
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={pathname === item.href}
        tooltip={item.title}
        onClick={() => setOpenMobile(false)}
      >
        <Link href={item.href}>
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};


const UserMenu = ({ setOpenMobile }: { setOpenMobile: (open: boolean) => void }) => {
  const { user, clearSession } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (!user) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip="User Menu" className="w-full h-auto p-2">
                <Avatar className="size-8">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={`Avatar de ${user.name}`} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                    <span className="font-semibold">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
                 <ChevronsLeft className={cn(
                    "ml-auto size-4 transition-transform",
                    "group-data-[state=collapsed]:hidden",
                    isOpen && "-rotate-90"
                  )} />
            </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
            <SidebarMenuSub>
                 {settingsMenuItems.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.href}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === subItem.href}
                      onClick={() => setOpenMobile(false)}
                    >
                      <Link href={subItem.href}>
                        {subItem.icon && <subItem.icon />}
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
                <SidebarSeparator className="my-1"/>
                 <SidebarMenuSubItem>
                    <SidebarMenuSubButton onClick={clearSession}>
                        <LogOut />
                        <span>Cerrar Sesión</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
            </SidebarMenuSub>
        </CollapsibleContent>
    </Collapsible>
  )
}


export function DashboardSidebar() {
  const { theme, setTheme } = useTheme();
  const { openMobile, setOpenMobile } = useSidebar();
  const { isLoggedIn } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");
  
  const allMenuItems = isLoggedIn
    ? [...privateMenuItems, ...publicMenuItems]
    : publicMenuItems;

  const SidebarItems = () => (
    <SidebarMenu>
      {allMenuItems.map((item) => (
        <NavItem key={item.title} item={item} setOpenMobile={setOpenMobile} />
      ))}
    </SidebarMenu>
  );

  const MobileSidebarContent = () => (
     <div className="flex h-full flex-col">
        <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
                <Image src="/png/logo-256.png" alt="SIG Logo" width={24} height={24} />
                <span className="text-xl font-semibold">SIG</span>
            </div>
        </SidebarHeader>
        <SidebarContent className="flex-1 overflow-y-auto p-4">
            {isClient && <SidebarItems />}
        </SidebarContent>
        <SidebarFooter className="mt-auto border-t p-4">
          {isLoggedIn && isClient && <UserMenu setOpenMobile={setOpenMobile} />}
           {isClient && (
            <div className="mt-4 flex items-center justify-center">
              <Sun className="size-5" />
              <Switch
                checked={isDark}
                onCheckedChange={toggleTheme}
                className="mx-2"
              />
              <Moon className="size-5" />
            </div>
          )}
        </SidebarFooter>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-[var(--sidebar-width-mobile)] p-0">
          <MobileSidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
            <div className="flex items-center justify-between group-data-[state=collapsed]:justify-center">
                <div className="flex items-center gap-2">
                    <Image src="/png/logo-256.png" alt="SIG Logo" width={24} height={24} />
                    <span className="text-xl font-semibold group-data-[state=collapsed]:hidden">SIG</span>
                </div>
                <SidebarTrigger className="hidden group-data-[state=expanded]:block" />
            </div>
        </SidebarHeader>

        <SidebarContent className="flex-1 px-4">
            {isClient && <SidebarItems />}
        </SidebarContent>

        <SidebarFooter className="p-4">
            {isClient && (
                <>
                <div className="flex items-center justify-center group-data-[state=collapsed]:justify-start mb-4">
                    <div className="hidden items-center gap-2 group-data-[state=expanded]:flex">
                        <Sun className="size-5" />
                        <Switch
                        checked={isDark}
                        onCheckedChange={toggleTheme}
                        aria-label="Toggle theme"
                        />
                        <Moon className="size-5" />
                    </div>
                    <div className="hidden group-data-[state=collapsed]:flex">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                onClick={toggleTheme}
                                tooltip={isDark ? "Modo Claro" : "Modo Oscuro"}
                                variant="ghost"
                                className="size-10 p-2"
                                >
                                {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </div>
                </div>
                </>
            )}
           {isLoggedIn && isClient && (
            <>
              <SidebarSeparator />
              <UserMenu setOpenMobile={setOpenMobile} />
            </>
           )}
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
