
"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Switch } from "@/components/ui/switch"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Switch
      checked={isDark}
      onCheckedChange={toggleTheme}
      aria-label="Toggle theme"
    />
  )
}
