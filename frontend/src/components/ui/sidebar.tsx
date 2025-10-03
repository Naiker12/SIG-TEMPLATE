"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronsLeft, ChevronsRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { useSidebarStore } from "@/hooks/use-sidebar-store"
import { Button } from "./button"

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */

export type SidebarContextProps = {
  isCollapsed: boolean
  isCollapsible: "icon" | "full" | boolean
  isExpanded: boolean
  isHovered: boolean
  isClosing: boolean
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(
  undefined
)

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

/* -------------------------------------------------------------------------- */
/*                                SidebarProvider                             */
/* -------------------------------------------------------------------------- */

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { isOpen, isHovered } = useSidebarStore()
  return (
    <SidebarContext.Provider
      value={{
        isCollapsed: !isOpen,
        isCollapsible: true,
        isExpanded: isOpen,
        isHovered: isHovered,
        isClosing: false,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Sidebar                                  */
/* -------------------------------------------------------------------------- */

const sidebarVariants = cva("flex flex-col bg-background transition-all", {
  variants: {
    size: {
      icon: "group-[.is-collapsed]/sidebar:w-16 group-[.is-expanded]/sidebar:w-64",
      full: "w-64",
    },
  },
  defaultVariants: {
    size: "icon",
  },
})

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  collapsible?: "icon" | "full" | boolean
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, size, collapsible = "icon", ...props }, ref) => {
    const { isOpen, isClosing, setIsHovered } = useSidebarStore()
    const { isCollapsed, isExpanded } = useSidebar()
    const isCollapsible = !!collapsible

    const handleMouseEnter = () => {
      if (isCollapsible && isCollapsed) {
        setIsHovered(true)
      }
    }

    const handleMouseLeave = () => {
      if (isCollapsible && isCollapsed) {
        setIsHovered(false)
      }
    }

    return (
      <div
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-expanded={isExpanded ? "" : undefined}
        data-collapsed={isCollapsed ? "" : undefined}
        data-collapsible={isCollapsible ? "" : undefined}
        className={cn(
          "group/sidebar",
          isCollapsed && "is-collapsed",
          isExpanded && "is-expanded",
          isClosing && "is-closing"
        )}
      >
        <div
          className={cn(sidebarVariants({ size, className }))}
          data-collapsible={collapsible}
          {...props}
        />
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

/* -------------------------------------------------------------------------- */
/*                                SidebarRail                                 */
/* -------------------------------------------------------------------------- */

const SidebarRail = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none fixed z-20 h-full w-64 -translate-x-full bg-background transition-transform duration-300 ease-in-out group-[.is-collapsed.is-hovered]/sidebar:translate-x-0",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

/* -------------------------------------------------------------------------- */
/*                                SidebarHeader                               */
/* -------------------------------------------------------------------------- */

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex h-16 shrink-0 items-center px-4", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

/* -------------------------------------------------------------------------- */
/*                               SidebarContent                               */
/* -------------------------------------------------------------------------- */

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto", className)}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

/* -------------------------------------------------------------------------- */
/*                                SidebarFooter                               */
/* -------------------------------------------------------------------------- */

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mt-auto flex flex-col gap-y-2 p-4", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

/* -------------------------------------------------------------------------- */
/*                               SidebarTrigger                               */
/* -------------------------------------------------------------------------- */

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  const { toggle } = useSidebarStore()

  const Icon = isCollapsed ? ChevronsRight : ChevronsLeft

  return (
    <Button
      ref={ref}
      variant="ghost"
      className={cn(
        "size-10 justify-center p-0",
        !isCollapsed && "ml-auto"
      )}
      onClick={toggle}
      {...props}
    >
      <Icon className="size-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

/* -------------------------------------------------------------------------- */
/*                                SidebarClose                                */
/* -------------------------------------------------------------------------- */

const SidebarClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { toggle } = useSidebarStore()

  return (
    <Button
      ref={ref}
      variant="ghost"
      className={cn("h-10 w-full justify-start", className)}
      onClick={toggle}
      {...props}
    />
  )
})

SidebarClose.displayName = "SidebarClose"

/* -------------------------------------------------------------------------- */
/*                                SidebarInset                                */
/* -------------------------------------------------------------------------- */

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "sm:pl-16" : "sm:pl-64",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"
