"use client"

import * as React from "react"
import Image from "next/image"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { useAuthStore } from "@/hooks/useAuthStore";
import { menuItems } from "./sidebar-data";


export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { isLoggedIn, user } = useAuthStore();

    if (!isLoggedIn || !user) {
        return null;
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <Image
                        src="/png/logo-256.png"
                        alt="SIG Logo"
                        width={32}
                        height={32}
                    />
                    <span className="text-lg font-semibold">SIG IA</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={menuItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            {/* The rail is the expanded view on hover when collapsed */}
            <SidebarRail>
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <Image
                            src="/png/logo-256.png"
                            alt="SIG Logo"
                            width={32}
                            height={32}
                        />
                        <span className="text-lg font-semibold">SIG IA</span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <NavMain items={menuItems} />
                </SidebarContent>
                <SidebarFooter>
                    <NavUser user={user} />
                </SidebarFooter>
            </SidebarRail>
        </Sidebar>
    )
}
