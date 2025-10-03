
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation";
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight, LogOut } from "lucide-react";
import { useSidebarStore } from "@/hooks/use-sidebar-store"
import { useAuthStore } from "@/hooks/useAuthStore"
import { cn } from "@/lib/utils"
import { platformItems, toolsItems, userMenuItems } from "./sidebar-data";
import { ThemeSwitcher } from "./theme-switcher";
import { type MenuItem } from "./sidebar-data";

export function DashboardSidebar() {
    const { isLoggedIn, user, clearSession } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const { isOpen, toggle } = useSidebarStore();
    
    if (!isLoggedIn || !user) {
        return null;
    }

    const handleLogout = () => {
        clearSession();
        router.push('/');
    }

    return (
        <TooltipProvider delayDuration={0}>
            <Sidebar isOpen={isOpen} className="hidden sm:flex">
                <SidebarHeader>
                    <Link href="/" className="flex items-center gap-2.5">
                        <Image
                            src="/png/logo-256.png"
                            alt="SIG Logo"
                            width={32}
                            height={32}
                            className="transition-transform duration-300 group-hover:scale-110"
                        />
                        <span className={cn("text-lg font-bold whitespace-nowrap transition-opacity duration-200", !isOpen && "opacity-0")}>
                            SIG IA
                        </span>
                    </Link>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel isOpen={isOpen}>Plataforma</SidebarGroupLabel>
                        <SidebarGroupContent>
                            {platformItems.map((item) => (
                                <NavItem key={item.href} item={item} isOpen={isOpen} pathname={pathname} />
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel isOpen={isOpen}>Herramientas</SidebarGroupLabel>
                        <SidebarGroupContent>
                            {toolsItems.map((item) => (
                                <NavItem key={item.href} item={item} isOpen={isOpen} pathname={pathname} />
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                     <div className="space-y-1">
                        {userMenuItems.map((item) => (
                            <NavItem key={item.href} item={item} isOpen={isOpen} pathname={pathname} />
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className={cn("flex items-center gap-2", !isOpen && "w-full justify-center")}>
                            <ThemeSwitcher />
                            <span className={cn("text-sm text-muted-foreground transition-opacity", !isOpen && "opacity-0 w-0 h-0")}>
                                {isOpen ? "Cambiar Tema" : ""}
                            </span>
                        </div>
                        
                        <div className={cn(!isOpen && "hidden")}>
                            <Button variant="ghost" size="icon" onClick={handleLogout}>
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </SidebarFooter>
                 <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-5 top-16 rounded-full border bg-background hover:bg-accent"
                    onClick={toggle}
                >
                    <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                </Button>
            </Sidebar>
        </TooltipProvider>
    )
}

function NavItem({ item, isOpen, pathname }: { item: MenuItem, isOpen: boolean, pathname: string }) {
    const checkActive = (item: MenuItem, pathname: string) => {
        if (item.href === "/") return pathname === "/";
        return pathname.startsWith(item.href);
    }
    const isActive = checkActive(item, pathname);

    if (!isOpen) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={item.href}>
                        <Button variant={isActive ? "secondary" : "ghost"} className="w-full h-10 p-0 flex items-center justify-center">
                            <item.icon className="h-5 w-5" />
                            <span className="sr-only">{item.title}</span>
                        </Button>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
            </Tooltip>
        )
    }

    if (item.isCollapsible) {
        return (
            <Collapsible defaultOpen={isActive}>
                <CollapsibleTrigger asChild>
                    <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start px-3 group">
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.title}
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="py-1 pl-8">
                    <div className="flex flex-col space-y-1 relative before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border">
                        {item.items?.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                                <Link key={subItem.href} href={subItem.href}>
                                    <Button variant={isSubActive ? "secondary" : "ghost"} size="sm" className="w-full justify-start relative">
                                        {isSubActive && <div className="absolute -left-4 h-full w-0.5 bg-primary rounded-r-full"></div>}
                                        {subItem.title}
                                    </Button>
                                </Link>
                            )
                        })}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        )
    }

    return (
        <Link href={item.href}>
            <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start px-3">
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
            </Button>
        </Link>
    )
}
