"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { LogOut, Settings, User as UserIcon } from "lucide-react"
import { useAuthStore } from "@/hooks/useAuthStore"
import { useRouter } from "next/navigation"

export interface NavUserProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
}

export function NavUser({ user }: NavUserProps) {
  const { isCollapsed } = useSidebar()
  const { clearSession } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
      clearSession();
      router.push('/');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-12 w-full justify-start px-3",
            isCollapsed && "size-12 justify-center p-0"
          )}
        >
          <div className="flex items-center gap-3">
            <Image
              src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
              alt={`Avatar de ${user.name}`}
              width={32}
              height={32}
              className="rounded-full"
            />
            {!isCollapsed && (
              <div className="flex flex-col items-start overflow-hidden">
                <div className="truncate font-medium">{user.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {user.email}
                </div>
              </div>
            )}
          </div>
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserIcon className="mr-2" />
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2" />
            Configuración
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
