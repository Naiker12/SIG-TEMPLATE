"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { useSidebarStore } from "@/hooks/use-sidebar-store"
import { cn } from "@/lib/utils"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { isOpen } = useSidebarStore();
  const isDark = theme === "dark"

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }
  
  if (!isOpen) {
      return (
         <div className="flex items-center justify-center">
            <button
                className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-sidebar-muted"
                onClick={() => toggleTheme(!isDark)}
            >
                {isDark ? <Sun className="h-5 w-5 text-sidebar-muted-foreground" /> : <Moon className="h-5 w-5 text-sidebar-muted-foreground" />}
                <span className="sr-only">Cambiar tema</span>
            </button>
         </div>
      )
  }

  return (
    <div className="flex items-center justify-between rounded-lg p-2">
      <div className="flex items-center gap-2">
         <Sun className="h-5 w-5 text-sidebar-muted-foreground" />
         <Switch
            checked={isDark}
            onCheckedChange={toggleTheme}
            aria-label="Toggle theme"
         />
         <Moon className="h-5 w-5 text-sidebar-muted-foreground" />
      </div>
    </div>
  )
}
