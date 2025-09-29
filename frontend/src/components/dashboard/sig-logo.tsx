
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import Image from 'next/image';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger,
  Sheet,
  SheetContent,
} from "@/components/ui/sidebar";
import {
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useTheme } from "next-themes";
import { useSidebar } from "../ui/sidebar";
import { Switch } from "../ui/switch";
import { SidebarMenuBadge } from "../ui/sidebar";
import { adminMenuItems, settingsMenuItems } from "./sidebar-data";
import { CollapsibleMenuItem } from "./collapsible-menu-item";
import { usePathname } from 'next/navigation';

export function DashboardSidebar() {
  const { theme, setTheme } = useTheme();
  const { openMobile, setOpenMobile } = useSidebar();
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };
  
  const MobileSidebarContent = () => (
    <div className="flex flex-col h-full">
        <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
              <Image 
                src="/logo.svg" 
                alt="SIG Logo" 
                width={24} 
                height={24}
                className="text-foreground"
              />
              <span className="text-xl font-semibold">SIG</span>
          </div>
        </div>
      </SidebarHeader>

      <div className="flex-1 overflow-y-auto p-4">
        <SidebarGroup>
          <SidebarGroupLabel>Administrador</SidebarGroupLabel>
          <SidebarMenu>
            {adminMenuItems.map((item, index) =>
                item.isCollapsible ? (
                  <CollapsibleMenuItem key={index} item={item} />
                ) : (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.label}
                      onClick={() => setOpenMobile(false)}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
            )}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
            <SidebarGroupLabel>Configuración</SidebarGroupLabel>
            <SidebarMenu>
                {settingsMenuItems.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.label}
                        isActive={pathname === item.href}
                        onClick={() => setOpenMobile(false)}
                      >
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                          {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
      </div>

       <SidebarFooter className="p-4 mt-auto border-t">
        {isClient && (
            <div className="flex items-center justify-center mb-4">
                <Sun className="h-5 w-5" />
                <Switch checked={isDark} onCheckedChange={toggleTheme} aria-label="Toggle theme" className="mx-2" />
                <Moon className="h-5 w-5" />
            </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Perfil de usuario" onClick={() => setOpenMobile(false)}>
              <Link href="/profile">
                <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                  <AvatarFallback className="bg-transparent text-white">N</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold">Naiker</span>
                  <span className="text-xs text-muted-foreground">
                    naiker@gomail.com
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
              <SidebarMenuButton tooltip="Cerrar Sesión">
                  <LogOut />
                  <span>Cerrar Sesión</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </div>
  );


  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="p-0 w-[80%] max-w-xs bg-sidebar text-sidebar-foreground">
          <MobileSidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col h-full">
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-between group-data-[state=collapsed]:justify-center">
            <div className="flex items-center gap-2">
                <Image 
                    src="/logo.svg" 
                    alt="SIG Logo" 
                    width={24} 
                    height={24}
                    className="text-foreground"
                />
                <span className="text-xl font-semibold group-data-[state=collapsed]:hidden">SIG</span>
            </div>
            <SidebarTrigger className="group-data-[state=expanded]:block hidden" />
          </div>
        </SidebarHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4">
            <SidebarGroup>
              <SidebarGroupLabel>Administrador</SidebarGroupLabel>
              <SidebarMenu>
                {adminMenuItems.map((item, index) =>
                    item.isCollapsible ? (
                      <CollapsibleMenuItem key={index} item={item} />
                    ) : (
                      <SidebarMenuItem key={index}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                          tooltip={item.label}
                        >
                          <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                )}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
                <SidebarGroupLabel>Configuración</SidebarGroupLabel>
                <SidebarMenu>
                    {settingsMenuItems.map((item, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton
                            asChild
                            tooltip={item.label}
                            isActive={pathname === item.href}
                          >
                            <Link href={item.href}>
                              <item.icon />
                              <span>{item.label}</span>
                              {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
          </div>

          <SidebarFooter className="p-4 mt-auto">
            {isClient && (
              <>
                <div className="flex items-center justify-center group-data-[state=collapsed]:justify-start">
                    <div className="group-data-[state=expanded]:flex items-center gap-2 hidden">
                      <Sun className="h-5 w-5" />
                      <Switch checked={isDark} onCheckedChange={toggleTheme} aria-label="Toggle theme" />
                      <Moon className="h-5 w-5" />
                    </div>
                    <div className="group-data-[state=collapsed]:flex hidden">
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton onClick={toggleTheme} tooltip={isDark ? "Modo Claro" : "Modo Oscuro"} variant="ghost" className="h-10 w-10 p-2">
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </div>
                </div>
                <SidebarSeparator />
              </>
            )}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Perfil de usuario">
                  <Link href="/profile">
                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                      <AvatarFallback className="bg-transparent text-white">N</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col group-data-[state=collapsed]:hidden">
                      <span className="font-semibold">Naiker</span>
                      <span className="text-xs text-muted-foreground">
                        naiker@gomail.com
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Cerrar Sesión">
                      <LogOut />
                      <span className="group-data-[state=collapsed]:hidden">Cerrar Sesión</span>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <p className="text-xs text-muted-foreground group-data-[state=collapsed]:hidden">&copy; Copyright SIG 2025</p>
          </Footer>
        </div>
      </div>
    </>
  );
}
