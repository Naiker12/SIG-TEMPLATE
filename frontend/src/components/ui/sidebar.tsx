"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sidebarVariants = cva(
  "fixed top-0 left-0 h-full z-40 flex flex-col bg-sidebar border-r transition-all duration-300 ease-in-out",
  {
    variants: {
      state: {
        open: "w-60",
        closed: "w-16",
      },
    },
    defaultVariants: {
      state: "open",
    },
  }
)

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {
  isOpen: boolean;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, isOpen, ...props }, ref) => {
    return (
      <aside ref={ref} className={cn(sidebarVariants({ state: isOpen ? 'open' : 'closed' }), className)} {...props} />
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex h-16 items-center px-4 shrink-0", className)} {...props} />
    )
  }
)
SidebarHeader.displayName = "SidebarHeader"


const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex-1 overflow-y-auto overflow-x-hidden", className)} {...props} />
    )
  }
)
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-4 mt-auto border-t", className)} {...props} />
    )
  }
)
SidebarFooter.displayName = "SidebarFooter"


const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("py-2 px-3", className)} {...props} />
    )
  }
)
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement> & { isOpen: boolean }>(
  ({ className, isOpen, ...props }, ref) => {
    return (
      <p ref={ref} className={cn(
        "px-2 py-1 text-xs font-semibold uppercase text-muted-foreground tracking-wider transition-opacity duration-200",
        !isOpen && "opacity-0 h-0 p-0",
        className
      )} {...props} />
    )
  }
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"


const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("mt-1 space-y-1", className)} {...props} />
    )
  }
)
SidebarGroupContent.displayName = "SidebarGroupContent"


export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent }
