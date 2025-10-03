"use client"

import Link from "next/link"
import { LucideIcon, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/sidebar"
import type { MenuItem, SubMenuItem } from "./dashboard/sidebar-data"

interface NavProps {
  links: MenuItem[]
  isCollapsed: boolean
  groupLabel?: string
}

export function Nav({ links, isCollapsed, groupLabel }: NavProps) {
  return (
    <div className="flex flex-col gap-y-1">
      {groupLabel && !isCollapsed && (
         <p className="px-2 py-1 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
            {groupLabel}
        </p>
      )}
      <div
        data-collapsed={isCollapsed}
        className="group flex flex-col gap-1 py-2 data-[collapsed=true]:py-2"
      >
        <Accordion type="multiple" className="w-full">
          {links.map((link, index) =>
            isCollapsed ? (
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      buttonVariants({ variant: link.isActive ? "secondary" : "ghost", size: "icon" }),
                      "h-10 w-10",
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-4">
                  {link.title}
                </TooltipContent>
              </Tooltip>
            ) : link.isCollapsible && link.items ? (
              <AccordionItem value={link.title} key={index}>
                <AccordionTrigger
                  className={cn(
                    buttonVariants({ variant: link.isActive ? "secondary" : "ghost", size: "sm" }),
                    "w-full justify-start px-3"
                  )}
                >
                  <div className="flex items-center">
                    <link.icon className="mr-3 h-5 w-5" />
                    {link.title}
                  </div>
                   <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200" />
                </AccordionTrigger>
                <AccordionContent className="pl-8">
                  <div className="flex flex-col space-y-1 relative before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border">
                    {link.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          buttonVariants({ variant: subItem.isActive ? "secondary" : "ghost", size: "sm" }),
                          "w-full justify-start relative"
                        )}
                      >
                         {subItem.isActive && <div className="absolute -left-4 h-full w-0.5 bg-primary rounded-r-full"></div>}
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ) : (
              <Link
                key={index}
                href={link.href}
                className={cn(
                  buttonVariants({ variant: link.isActive ? "secondary" : "ghost", size: "sm" }),
                  "justify-start"
                )}
              >
                <link.icon className="mr-3 h-5 w-5" />
                {link.title}
              </Link>
            )
          )}
        </Accordion>
      </div>
    </div>
  )
}
