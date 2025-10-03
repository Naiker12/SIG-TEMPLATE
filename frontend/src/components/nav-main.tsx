
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"

import { buttonVariants } from "./ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

export interface NavItemProps extends LinkProps {
  children: React.ReactNode
  "aria-label": string
}

function NavItem({ className, children, ...props }: NavItemProps) {
  const pathname = usePathname()
  const { isCollapsed } = useSidebar()

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            data-collapsed={isCollapsed}
            className={cn(
              buttonVariants({
                variant: props.href === pathname ? "secondary" : "ghost",
              }),
              "h-10 justify-start data-[collapsed=true]:size-10 data-[collapsed=true]:justify-center data-[collapsed=true]:p-0",
              className
            )}
            {...props}
          >
            {children}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">{props["aria-label"]}</TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

export { NavItem }
