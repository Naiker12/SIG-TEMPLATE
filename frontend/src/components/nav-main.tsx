"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"
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
import { buttonVariants } from "./ui/button"

export interface NavItemProps {
  title: string
  href: string
  icon?: React.ElementType
  isActive?: boolean
  isCollapsible?: boolean
  items?: NavItemProps[]
}

export interface NavMainProps {
  items: NavItemProps[]
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname()
  const { isCollapsed } = useSidebar()

  return (
    <TooltipProvider>
      <div
        data-collapsed={isCollapsed}
        className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
      >
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {items.map((item, index) => {
            const isActive = item.isCollapsible
              ? item.items?.some((subItem) => pathname === subItem.href)
              : pathname === item.href

            if (isCollapsed) {
              if (item.isCollapsible && item.items) {
                return (
                  <Tooltip key={index} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          buttonVariants({
                            variant: isActive ? "secondary" : "ghost",
                            size: "icon",
                          }),
                          "h-10 w-10"
                        )}
                      >
                        {item.icon && <item.icon className="size-5" />}
                        <span className="sr-only">{item.title}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="flex items-center gap-4"
                    >
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return (
                <Tooltip key={index} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        buttonVariants({
                          variant: isActive ? "secondary" : "ghost",
                          size: "icon",
                        }),
                        "h-10 w-10"
                      )}
                    >
                      {item.icon && <item.icon className="size-5" />}
                      <span className="sr-only">{item.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="flex items-center gap-4"
                  >
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              )
            }

            if (item.isCollapsible && item.items) {
              return (
                <Collapsible key={index} defaultOpen={isActive}>
                  <CollapsibleTrigger
                    className={cn(
                      buttonVariants({
                        variant: isActive ? "secondary" : "ghost",
                        size: "sm",
                      }),
                      "w-full justify-start px-3"
                    )}
                  >
                    {item.icon && <item.icon className="mr-4 size-5" />}
                    {item.title}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="py-1 pl-8">
                    <div className="flex flex-col space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            buttonVariants({
                              variant: pathname === subItem.href ? "secondary" : "ghost",
                              size: "sm",
                            }),
                            "justify-start"
                          )}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )
            }

            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  buttonVariants({
                    variant: isActive ? "secondary" : "ghost",
                    size: "sm",
                  }),
                  "justify-start px-3"
                )}
              >
                {item.icon && <item.icon className="mr-4 size-5" />}
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </TooltipProvider>
  )
}
