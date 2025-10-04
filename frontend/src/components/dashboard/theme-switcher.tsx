
"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSidebarStore } from "@/hooks/use-sidebar-store"
import { cn } from "@/lib/utils"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { isOpen } = useSidebarStore();
  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }
  
  if (!isOpen) {
      return (
         <Button variant="ghost" size="icon" className="h-10 w-10" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Cambiar tema</span>
        </Button>
      )
  }

  return (
    <div className="flex items-center justify-between rounded-lg border p-2 bg-sidebar-muted">
      <Button 
        variant={!isDark ? 'secondary' : 'ghost'} 
        size="sm" 
        className="flex-1"
        onClick={() => setTheme("light")}
      >
        <Sun className="mr-2 h-4 w-4" />
        Claro
      </Button>
      <Button 
        variant={isDark ? 'secondary' : 'ghost'} 
        size="sm" 
        className="flex-1"
        onClick={() => setTheme("dark")}
      >
        <Moon className="mr-2 h-4 w-4" />
        Oscuro
      </Button>
    </div>
  )
}
