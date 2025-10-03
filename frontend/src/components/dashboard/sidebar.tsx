
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Settings,
  User,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { menuItems, type MenuItem } from "./sidebar-data"
import { useSidebarStore } from "@/hooks/use-sidebar-store"
import { useAuthStore } from "@/hooks/useAuthStore"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"

function NavLink({
  link,
  isPending,
}: {
  link: MenuItem
  isPending: boolean
}) {
  const pathname = usePathname()
  const { isOpen } = useSidebarStore()

  const isChildActive =
    link.href === pathname ||
    (link.items?.some((sub) => pathname === sub.href) ?? false)

  if (link.isCollapsible && link.items) {
    return (
      <CollapsibleNavItem
        link={link}
        isChildActive={isChildActive}
        isPending={isPending}
      />
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            variant={link.href === pathname ? "secondary" : "ghost"}
            className={cn(
              "h-12 justify-start",
              isOpen ? "w-full" : "size-12",
              link.href === pathname &&
                "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
            )}
          >
            <Link href={link.href}>
              <link.icon
                className={cn(
                  "size-6 transition-all",
                  isOpen ? "mr-4" : "mx-auto"
                )}
              />
              <span className={cn(isOpen ? "inline" : "hidden")}>
                {link.title}
              </span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className={cn(isOpen ? "hidden" : "flex")}
        >
          {link.title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function CollapsibleNavItem({
  link,
  isChildActive,
  isPending,
}: {
  link: MenuItem
  isChildActive: boolean
  isPending: boolean
}) {
  const { isOpen: isSidebarOpen } = useSidebarStore()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(isChildActive)

  if (!isSidebarOpen) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              variant={isChildActive ? "secondary" : "ghost"}
              className={cn(
                "size-12 justify-start",
                isChildActive &&
                  "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
              )}
            >
              <Link href={link.href}>
                <link.icon className="size-6 transition-all" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{link.title}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant={isChildActive && !isOpen ? "secondary" : "ghost"}
          className="h-12 w-full justify-start"
        >
          <link.icon className="mr-4 size-6" />
          {link.title}
          <ChevronRight
            className={cn(
              "ml-auto size-4 transition-all",
              isOpen && "rotate-90"
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 py-2 pl-12 pr-2">
        {link.items?.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={pathname === item.href ? "secondary" : "ghost"}
            className="h-10 w-full justify-start"
          >
            <Link href={item.href}>{item.title}</Link>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

function UserMenu() {
  const { user } = useAuthStore()
  const { isOpen } = useSidebarStore()
  if (!user) return null

  return (
    <div className="flex w-full items-center p-2">
      <Link href="/profile" className="flex-1">
        <div className="flex items-center gap-4">
          <Image
            src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
            alt="User avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div
            className={cn(
              "flex flex-col transition-all",
              isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
            )}
          >
            <p className="line-clamp-1 text-sm font-semibold">{user.name}</p>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      </Link>
      <Button
        variant="ghost"
        className={cn(
          "h-12 transition-all",
          isOpen ? "w-12 opacity-100" : "w-0 opacity-0"
        )}
        asChild
      >
        <Link href="/settings">
          <MoreHorizontal className="size-6" />
        </Link>
      </Button>
    </div>
  )
}

function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const { isOpen } = useSidebarStore()
    const isDark = theme === "dark"
    
    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    if (!isOpen) return null

    return (
        <div className="p-4 flex items-center justify-between">
            <Label htmlFor="theme-switch">Modo Oscuro</Label>
            <Switch id="theme-switch" checked={isDark} onCheckedChange={toggleTheme} />
        </div>
    )
}

export function DashboardSidebar() {
  const { isOpen, setOpen } = useSidebarStore()
  const { isLoggedIn } = useAuthStore()
  const [isPending, startTransition] = React.useTransition()
  const pathname = usePathname()

  const menuToRender = isLoggedIn ? menuItems : []

  return (
    <aside
      className={cn(
        "group fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r bg-background transition-all",
        isOpen ? "w-72" : "w-20"
      )}
    >
      <div className="flex h-20 items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/png/logo-256.png"
            alt="SIG Logo"
            width={40}
            height={40}
            className={cn(
              "transition-all",
              !isOpen && "group-hover:rotate-[20deg]"
            )}
          />
          <h1
            className={cn(
              "text-xl font-bold transition-all",
              isOpen ? "inline" : "hidden"
            )}
          >
            SIG IA
          </h1>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-y-2 px-4">
        {menuToRender.map((link) => (
          <NavLink key={link.href} link={link} isPending={isPending} />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-y-2 p-4">
        {isLoggedIn && <UserMenu />}
        <ThemeToggle />
        <Button
          variant="ghost"
          className={cn("h-12 w-full justify-start")}
          onClick={() => setOpen(!isOpen)}
        >
          <ChevronLeft
            className={cn(
              "size-6 transition-all",
              isOpen ? "mr-4" : "mx-auto rotate-180"
            )}
          />
          <span className={cn(isOpen ? "inline" : "hidden")}>Colapsar</span>
        </Button>
      </div>
    </aside>
  )
}
