
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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuthStore } from "@/hooks/useAuthStore";
import { cn } from "@/lib/utils";
import { platformMenu, toolsMenu, settingsMenuItems, type MenuItem, type MenuGroup } from "./sidebar-data";

const NavItem = ({ item, setOpenMobile }: { item: MenuItem; setOpenMobile: (open: boolean) => void }) => {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isChildActive = item.href === pathname || (item.items?.some(sub => pathname === sub.href) ?? false);
  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => {
    if (state === 'collapsed') {
      setIsOpen(false);
    } else if (isChildActive) {
      setIsOpen(true);
    }
  }, [state, isChildActive]);

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
                  size="sm"
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
  const pathname = usePathname();

  if (!user) return null;

  return (
     <SidebarGroup>
        <SidebarGroupLabel asChild>
          <div className="flex items-center justify-between">
            <span>{user.name}</span>
          </div>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {settingsMenuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                 <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title} onClick={() => setOpenMobile(false)}>
                    <Link href={item.href}>
                      {item.icon && <item.icon/>}
                      <span>{item.title}</span>
                    </Link>
                 </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
             <SidebarMenuItem>
                <SidebarMenuButton onClick={clearSession} tooltip="Cerrar Sesión">
                    <LogOut />
                    <span>Cerrar Sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
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
  
  const menuGroups: MenuGroup[] = isLoggedIn
    ? [platformMenu, toolsMenu]
    : [toolsMenu];

  const SidebarItems = () => (
    <>
      {menuGroups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <NavItem key={item.title} item={item} setOpenMobile={setOpenMobile} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );

  const SidebarBottomContent = () => (
    <div className="flex flex-col gap-4">
      {isLoggedIn && isClient && (
        <>
          <SidebarSeparator />
          <UserMenu setOpenMobile={setOpenMobile} />
        </>
      )}
      {isClient && (
        <div className="flex items-center justify-center group-data-[state=collapsed]:justify-start">
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
      )}
    </div>
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
          <SidebarBottomContent />
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
        <SidebarHeader className="p-4 flex justify-center items-center group-data-[state=collapsed]:p-2 group-data-[state=collapsed]:bg-primary/10 rounded-lg">
            <div className="flex items-center justify-between group-data-[state=collapsed]:justify-center w-full">
                <div className="flex items-center gap-2">
                    <Image src="/png/logo-256.png" alt="SIG Logo" width={24} height={24} />
                    <span className="text-xl font-semibold group-data-[state=collapsed]:hidden">SIG</span>
                </div>
                <SidebarTrigger className="hidden group-data-[state=expanded]:block" />
            </div>
        </SidebarHeader>

        <SidebarContent className="flex-1 px-4 flex flex-col justify-between">
            {isClient && <SidebarItems />}
            {isClient && <div className="mt-auto"><SidebarBottomContent /></div>}
        </SidebarContent>

        <SidebarFooter className="p-4 space-y-4 hidden">
           {/* Footer content moved to SidebarContent for better layout control */}
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
