"use client"

import * as React from "react"
import Link, { type LinkProps } from "next/link"
import { usePathname } from "next/navigation"
import { cva, type VariantProps } from "class-variance-authority"
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useSidebarStore } from "@/hooks/use-sidebar-store"

import { Button, buttonVariants } from "./button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */

export type SidebarContextProps = {
  isCollapsed: boolean
  isCollapsible: boolean
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
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
/*                                   Sidebar                                  */
/* -------------------------------------------------------------------------- */

const sidebarVariants = cva(
  "flex h-full flex-col data-[collapsed=true]:w-14",
  {
    variants: {
      variant: {
        default:
          "border-r bg-background transition-[width] duration-300 ease-in-out",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  collapsible?: "icon" | "button"
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, collapsible, ...props }, ref) => {
    const { isOpen, setOpen } = useSidebarStore()
    const isCollapsible = collapsible === "icon" || collapsible === "button"
    const isCollapsed = isCollapsible && !isOpen

    return (
      <SidebarContext.Provider
        value={{
          isCollapsed: isCollapsed,
          isCollapsible: isCollapsible,
          isOpen: isOpen,
          setIsOpen: setOpen,
        }}
      >
        <div
          ref={ref}
          data-collapsed={isCollapsed}
          className={cn(sidebarVariants({ variant, className }))}
          {...props}
        />
      </SidebarContext.Provider>
    )
  }
)
Sidebar.displayName = "Sidebar"

/* -------------------------------------------------------------------------- */
/*                                Sidebar Rail                                */
/* -------------------------------------------------------------------------- */

const SidebarRail = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none fixed inset-y-0 left-0 z-50 w-14",
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
  const { isCollapsed } = useSidebar()
  const Icon = isCollapsed ? ChevronsRight : ChevronsLeft

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
/*                                  Nav Main                                  */
/* -------------------------------------------------------------------------- */

const mainNavVariants = cva("flex flex-col gap-y-1 py-2", {
  variants: {},
  defaultVariants: {},
})

export interface NavMainProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mainNavVariants> {}

function NavMain({ className, ...props }: NavMainProps) {
  return (
    <nav
      className={cn(mainNavVariants({ className }))}
      aria-label="Main"
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*                                Nav Projects                                */
/* -------------------------------------------------------------------------- */

const projectsNavVariants = cva("flex flex-col gap-y-1", {
  variants: {},
  defaultVariants: {},
})

export interface NavProjectsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof projectsNavVariants> {}

function NavProjects({ className, ...props }: NavProjectsProps) {
  return (
    <div className="p-2">
      <h2
        data-collapsed={useSidebar().isCollapsed}
        className={cn(
          projectsNavVariants({ className }),
          "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground data-[collapsed=true]:text-center"
        )}
      >
        <span
          data-collapsed={useSidebar().isCollapsed}
          className="data-[collapsed=true]:hidden"
        >
          Projects
        </span>
        <span
          data-collapsed={useSidebar().isCollapsed}
          className="hidden data-[collapsed=true]:block"
        >
          —
        </span>
      </h2>
      <nav {...props} aria-label="Projects" />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   NavUser                                  */
/* -------------------------------------------------------------------------- */

export interface NavUserProps extends React.HTMLAttributes<HTMLDivElement> {}

function NavUser({ ...props }: NavUserProps) {
  const { isCollapsed } = useSidebar()
  return (
    <div {...props}>
      <DropdownMenu>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "h-12 w-full justify-start",
                    isCollapsed && "size-12 justify-center"
                  )}
                >
                  {isCollapsed ? (
                    <>
                      <div className="size-8 rounded-full bg-muted" />
                      <span className="sr-only">shadcn</span>
                    </>
                  ) : (
                    <>
                      <div className="mr-3 size-8 rounded-full bg-muted" />
                      <div className="flex flex-col items-start">
                        <p className="line-clamp-1 text-sm font-medium">shadcn</p>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          m@example.com
                        </p>
                      </div>
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>shadcn</p>
                <p className="text-muted-foreground">m@example.com</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">shadcn</p>
              <p className="text-xs leading-none text-muted-foreground">
                m@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   Sidebar                                  */
/* -------------------------------------------------------------------------- */

const navItemVariants = cva(
  buttonVariants({ variant: "ghost" }),
  "h-10 data-[collapsed=true]:size-10 data-[collapsed=true]:justify-center data-[collapsed=true]:p-0"
)

export interface NavItemProps extends LinkProps {
  children: React.ReactNode
  "aria-label": string
}

function NavItem({ className, children, ...props }: NavItemProps) {
  return (
    <Link
      data-collapsed={useSidebar().isCollapsed}
      className={cn(navItemVariants({ className }))}
      {...props}
    >
      {children}
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/*                             Collapsible NavItem                             */
/* -------------------------------------------------------------------------- */

export interface CollapsibleNavItemProps extends Omit<NavItemProps, "href"> {
  title: string
  items: Omit<NavItemProps, "children">[]
  icon: React.ReactElement
}

function CollapsibleNavItem({
  children,
  icon,
  items,
  title,
  ...props
}: CollapsibleNavItemProps) {
  const { isCollapsed } = useSidebar()
  const pathname = usePathname()
  const isChildActive = items.some((item) => item.href === pathname)
  const [isOpen, setIsOpen] = React.useState(isChildActive)

  if (isCollapsed) {
    return (
      <DropdownMenu>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={isChildActive ? "secondary" : "ghost"}
                  className="size-10 justify-center p-0"
                  aria-label={title}
                >
                  {icon}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">{title}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent side="right" align="start">
          {items.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link {...item}>{item["aria-label"]}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant={isChildActive && !isOpen ? "secondary" : "ghost"}
          className="h-10 w-full justify-start"
          aria-label={title}
        >
          {children}
          <ChevronLeft
            className={cn(
              "ml-auto size-4 transition-all",
              isOpen && "-rotate-90"
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 py-1 pl-12 pr-2">
        {items.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={pathname === item.href ? "secondary" : "ghost"}
            className="h-9 w-full justify-start"
          >
            <Link {...item}>{item["aria-label"]}</Link>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

export {
  NavItem,
  NavMain,
  NavProjects,
  NavUser,
  CollapsibleNavItem,
}
