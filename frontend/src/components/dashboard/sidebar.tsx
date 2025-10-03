
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuthStore } from "@/hooks/useAuthStore"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Nav } from "@/components/nav"
import { platformItems, toolsItems, userMenuItems } from "./sidebar-data"
import { Button } from "../ui/button"
import { ChevronsRight, LogOut } from "lucide-react"

export function DashboardSidebar() {
  const { isLoggedIn, user, clearSession } = useAuthStore()
  const { isOpen, toggle } = useSidebar()

  if (!isLoggedIn || !user) {
    return null
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/png/logo-256.png"
            alt="SIG Logo"
            width={32}
            height={32}
            className="transition-transform duration-300 group-hover:scale-110"
          />
          {isOpen && <span className="text-lg font-bold">SIG IA</span>}
        </Link>
        <SidebarTrigger asChild className="ml-auto">
          <Button variant="ghost" size="icon">
            <ChevronsRight className="h-5 w-5" />
          </Button>
        </SidebarTrigger>
      </SidebarHeader>

      <SidebarContent>
        <Nav isCollapsed={!isOpen} links={platformItems} groupLabel="Plataforma" />
        <Nav isCollapsed={!isOpen} links={toolsItems} groupLabel="Herramientas" />
      </SidebarContent>

      <SidebarContent className="mt-auto p-2">
        <Nav isCollapsed={!isOpen} links={userMenuItems} />
         {isOpen && (
            <Button variant="ghost" className="w-full justify-start mt-4" onClick={clearSession}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
         )}
      </SidebarContent>
    </Sidebar>
  )
}
