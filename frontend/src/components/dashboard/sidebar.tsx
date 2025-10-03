"use client"

import * as React from "react"
import Link from 'next/link';
import Image from "next/image"
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { useSidebarStore } from "@/hooks/use-sidebar-store"
import { menuItems } from "./sidebar-data";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button } from "../ui/button";
import { ChevronsLeft, Settings, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { cn } from "@/lib/utils";

function NavItem({ item }: { item: (typeof menuItems)[0] }) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();

  const isActive = item.isCollapsible
    ? item.items?.some(subItem => subItem.href === pathname)
    : item.href === pathname;

  if (isCollapsed) {
    if (item.isCollapsible && item.items) {
      return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={item.items[0].href}>
                        <Button variant={isActive ? "secondary" : "ghost"} size="icon" className="w-full">
                            <item.icon className="size-5" />
                        </Button>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    {item.title}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      )
    }
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={item.href}>
                        <Button variant={isActive ? "secondary" : "ghost"} size="icon" className="w-full">
                            <item.icon className="size-5" />
                        </Button>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    {item.title}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
  }

  // Expanded view
  if (item.isCollapsible && item.items) {
    return (
      <Collapsible defaultOpen={isActive}>
        <CollapsibleTrigger asChild>
          <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
            <item.icon className="mr-4 size-5" />
            {item.title}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="py-1 pl-8">
            <div className="flex flex-col space-y-1">
          {item.items.map(subItem => (
            <Link key={subItem.href} href={subItem.href}>
              <Button variant={pathname === subItem.href ? "secondary" : "ghost"} size="sm" className="w-full justify-start">
                {subItem.title}
              </Button>
            </Link>
          ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Link href={item.href}>
        <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
            <item.icon className="mr-4 size-5" />
            {item.title}
        </Button>
    </Link>
  )
}

function UserMenu() {
    const { user } = useAuthStore()
    const { isCollapsed } = useSidebar()

    if (!user) return null

    return (
        <div className="flex w-full items-center p-2">
            <Link href="/profile" className="flex-1">
                <div className="flex items-center gap-3">
                <Image
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt="User avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
                {!isCollapsed && (
                    <div className="flex flex-col overflow-hidden">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </p>
                    </div>
                )}
                </div>
            </Link>
        </div>
    )
}

function SidebarBottomContent() {
    const { isCollapsed } = useSidebar()
    const { theme, setTheme } = useTheme()

    if (isCollapsed) {
        return (
            <div className="flex flex-col gap-2">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-full" asChild>
                                <Link href="/profile"><User className="size-5" /></Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">Perfil</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-full" asChild>
                                <Link href="/settings"><Settings className="size-5" /></Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">Configuración</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        )
    }

    return (
        <div className="w-full space-y-2">
             <div className="flex items-center justify-between rounded-lg bg-muted p-2">
                <Label htmlFor="theme-switch" className="text-sm">
                    Modo Oscuro
                </Label>
                <Switch
                    id="theme-switch"
                    checked={theme === "dark"}
                    onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                />
            </div>
            <Link href="/profile">
                <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-4 size-5" /> Perfil
                </Button>
            </Link>
            <Link href="/settings">
                <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-4 size-5" /> Configuración
                </Button>
            </Link>
        </div>
    )
}

export function DashboardSidebar() {
  const { isLoggedIn } = useAuthStore()
  const { isOpen } = useSidebarStore();
  const isCollapsed = !isOpen;

  if (!isLoggedIn) return null;

  return (
    <SidebarProvider>
        <Sidebar isCollapsed={isCollapsed} className="hidden sm:flex">
            <SidebarHeader>
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/png/logo-256.png"
                        alt="SIG Logo"
                        width={32}
                        height={32}
                        className="transition-all"
                    />
                    {!isCollapsed && <h1 className="text-xl font-bold">SIG IA</h1>}
                </Link>
            </SidebarHeader>

            <SidebarContent className="flex flex-col justify-between">
                <nav className="flex flex-col gap-1 p-2">
                    {menuItems.map(item => <NavItem key={item.href} item={item} />)}
                </nav>
                <div className="p-2">
                    <SidebarBottomContent />
                </div>
            </SidebarContent>

            <SidebarFooter>
                <SidebarTrigger />
            </SidebarFooter>
        </Sidebar>
    </SidebarProvider>
  )
}
