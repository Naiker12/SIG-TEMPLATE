"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  ChevronRight,
  PanelLeft,
} from "lucide-react"

import { useAuthStore } from "@/hooks/useAuthStore"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/ui/sidebar"
import { menuItems, settingsMenuItems, type MenuItem } from "./sidebar-data"

function NavItem({
  item,
  isCollapsed,
}: {
  item: MenuItem
  isCollapsed: boolean
}) {
  const pathname = usePathname()
  const isChildActive =
    item.href === pathname || (item.items?.some((sub) => pathname === sub.href) ?? false)

  if (item.isCollapsible && item.items) {
    return (
      <CollapsibleNavItem
        item={item}
        isCollapsed={isCollapsed}
        isChildActive={isChildActive}
      />
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            variant={isChildActive ? "default" : "ghost"}
            className={cn(
              "h-10 w-full justify-start",
              isCollapsed && "h-10 w-10 justify-center p-2"
            )}
          >
            <Link href={item.href}>
              <item.icon className={cn("size-5", !isCollapsed && "mr-4")} />
              <span className={cn(isCollapsed && "sr-only")}>{item.title}</span>
            </Link>
          </Button>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">{item.title}</TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

function CollapsibleNavItem({
  item,
  isCollapsed,
  isChildActive,
}: {
  item: MenuItem
  isCollapsed: boolean
  isChildActive: boolean
}) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(isChildActive)

  React.useEffect(() => {
    if (isCollapsed) {
      setIsOpen(false)
    } else if (isChildActive) {
      setIsOpen(true)
    }
  }, [isCollapsed, isChildActive])

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              variant={isChildActive ? "default" : "ghost"}
              className="h-10 w-10 justify-center p-2"
            >
              <Link href={item.items?.[0]?.href ?? item.href}>
                <item.icon className="size-5" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{item.title}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div>
      <Button
        variant={isChildActive && !isOpen ? "default" : "ghost"}
        className="h-10 w-full justify-start"
        onClick={() => setIsOpen(!isOpen)}
      >
        <item.icon className="mr-4 size-5" />
        {item.title}
        {isOpen ? (
          <ChevronDown className="ml-auto size-4" />
        ) : (
          <ChevronRight className="ml-auto size-4" />
        )}
      </Button>
      <div
        className={cn(
          "my-1 ml-4 space-y-1 border-l-2 border-l-border pl-5",
          !isOpen && "hidden"
        )}
      >
        {item.items?.map((subItem) => (
          <Button
            key={subItem.title}
            asChild
            variant={pathname === subItem.href ? "secondary" : "ghost"}
            className="h-9 w-full justify-start"
          >
            <Link href={subItem.href}>{subItem.title}</Link>
          </Button>
        ))}
      </div>
    </div>
  )
}

export function DashboardSidebar() {
  const { isLoggedIn } = useAuthStore()
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  const menuToRender = isLoggedIn ? menuItems : []

  return (
    <div
      className={cn(
        "sticky top-0 h-svh border-r",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <Sidebar
        collapsed={isCollapsed}
        className="flex h-full flex-col justify-between p-2"
      >
        <div className="flex flex-col gap-2">
          {/* Top section */}
          <div
            className={cn(
              "flex h-12 items-center",
              isCollapsed ? "justify-center" : "justify-start px-2"
            )}
          >
            <Image
              src="/png/logo-256.png"
              alt="SIG Logo"
              width={isCollapsed ? 32 : 24}
              height={isCollapsed ? 32 : 24}
            />
          </div>

          {/* Main navigation */}
          <nav className="flex flex-col gap-1">
            {menuToRender.map((item) => (
              <NavItem key={item.title} item={item} isCollapsed={isCollapsed} />
            ))}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col gap-1">
          {isLoggedIn &&
            settingsMenuItems.map((item) => (
              <NavItem key={item.title} item={item} isCollapsed={isCollapsed} />
            ))}
          <Button
            variant="ghost"
            className={cn(
              "h-10 w-full justify-start",
              isCollapsed && "h-10 w-10 justify-center p-2"
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <PanelLeft className="size-5" />
            <span className={cn("ml-4", isCollapsed && "sr-only")}>
              Colapsar
            </span>
          </Button>
        </div>
      </Sidebar>
    </div>
  )
}
