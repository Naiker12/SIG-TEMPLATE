"use client"

import * as React from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sidebarVariants = cva(
  "group flex flex-col data-[collapsed=true]:items-center",
  {
    variants: {
      variant: {
        default: "bg-background",
      },
      size: {
        default: "h-svh",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  collapsed?: boolean
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, size, collapsed, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-collapsed={collapsed}
        className={cn(sidebarVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

export { Sidebar, sidebarVariants }
