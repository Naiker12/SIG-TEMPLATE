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
  isCollapsible: boolean
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
  const { isOpen } = useSidebarStore()
  return (
    <SidebarContext.Provider
      value={{
        isCollapsed: !isOpen,
        isCollapsible: true,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Sidebar                                  */
/* -------------------------------------------------------------------------- */

const sidebarVariants = cva(
  "flex h-screen flex-col border-r bg-background transition-[width] duration-300 ease-in-out",
  {
    variants: {
      isCollapsed: {
        true: "w-14",
        false: "w-64",
      },
    },
    defaultVariants: {
      isCollapsed: false,
    },
  }
)

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, isCollapsed, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(sidebarVariants({ isCollapsed, className }))}
      {...props}
    />
  )
)
Sidebar.displayName = "Sidebar"

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
      className={cn("flex h-16 shrink-0 items-center px-3.5", className)}
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
      className={cn("mt-auto flex flex-col gap-y-2 p-2", className)}
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
        "h-10 w-full justify-start",
        isCollapsed && "size-10 justify-center p-0"
      )}
      onClick={toggle}
      {...props}
    >
      <Icon className="size-4" />
      <span className={cn("ml-2", isCollapsed && "hidden")}>Colapsar</span>
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
        isCollapsed ? "sm:pl-14" : "sm:pl-64",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"
