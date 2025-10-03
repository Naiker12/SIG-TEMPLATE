"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation";
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight, Settings, User } from "lucide-react";
import { useSidebarStore } from "@/hooks/use-sidebar-store"
import { useAuthStore } from "@/hooks/useAuthStore"
import { cn } from "@/lib/utils"
import { menuItems } from "./sidebar-data";
import { ThemeSwitcher } from "./theme-switcher";

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

    const platformItems = menuItems.slice(0, 3);
    const toolsItems = menuItems.slice(3);

    return (
        <TooltipProvider>
            <Sidebar isOpen={isOpen} className="hidden sm:flex">
                <SidebarHeader>
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/png/logo-256.png"
                            alt="SIG Logo"
                            width={32}
                            height={32}
                            className="transition-transform duration-300 group-hover:scale-110"
                        />
                        <span className={cn("text-lg font-semibold whitespace-nowrap transition-opacity duration-200", !isOpen && "opacity-0")}>
                            SIG IA
                        </span>
                    </Link>
                </SidebarHeader>

                <SidebarContent className="flex-1 flex flex-col justify-between">
                    <div>
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
                    </div>

                    <div>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <NavItem item={{ title: "Perfil", href: "/profile", icon: User }} isOpen={isOpen} pathname={pathname} />
                                <NavItem item={{ title: "Configuración", href: "/settings", icon: Settings }} isOpen={isOpen} pathname={pathname} />
                            </SidebarGroupContent>
                        </SidebarGroup>
                        <div className={cn("mt-4 p-4 border-t", !isOpen && "px-2")}>
                             <ThemeSwitcher/>
                        </div>
                    </div>
                </SidebarContent>

                <SidebarFooter>
                    <div className="flex items-center justify-between">
                        <div className={cn("flex items-center gap-3", !isOpen && "gap-0")}>
                            <Image
                                src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                alt={`Avatar de ${user.name}`}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <div className={cn("flex flex-col transition-opacity duration-200", !isOpen && "opacity-0 w-0")}>
                                <span className="text-sm font-semibold truncate">{user.name}</span>
                                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                            </div>
                        </div>
                    </div>
                </SidebarFooter>
                 <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-5 top-1/2 -translate-y-1/2 rounded-full border bg-background hover:bg-accent"
                    onClick={toggle}
                >
                    <ChevronRight className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                </Button>
            </Sidebar>
        </TooltipProvider>
    )
}

function NavItem({ item, isOpen, pathname }: { item: any, isOpen: boolean, pathname: string }) {
    const isActive = item.isCollapsible ? item.items.some((sub: any) => pathname.startsWith(sub.href)) : pathname === item.href;

    if (!isOpen) {
        return (
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Link href={item.href}>
                        <Button variant={isActive ? "secondary" : "ghost"} className="w-10 h-10 p-0">
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
                    <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start px-3">
                        <item.icon className="mr-4 h-5 w-5" />
                        {item.title}
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="py-1 pl-8">
                    <div className="flex flex-col space-y-1">
                        {item.items.map((subItem: any) => (
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
            <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start px-3">
                <item.icon className="mr-4 h-5 w-5" />
                {item.title}
            </Button>
        </Link>
    )
}
