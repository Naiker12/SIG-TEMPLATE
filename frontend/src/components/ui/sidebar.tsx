"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

// Context
type SidebarContextProps = {
  isOpen: boolean
  toggle: () => void
  isLocked: boolean
  toggleLock: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

// Provider
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(true)
  const [isLocked, setIsLocked] = React.useState(false)

  const toggle = () => setIsOpen(!isOpen)
  const toggleLock = () => setIsLocked(!isLocked)

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, isLocked, toggleLock }}>
      <div className={cn("transition-[padding-left] duration-300 ease-in-out", isOpen ? "pl-60" : "pl-16")}>
         {children}
      </div>
    </SidebarContext.Provider>
  )
}


// Variants
const sidebarVariants = cva(
  "fixed top-0 left-0 h-screen z-40 flex flex-col bg-sidebar border-r transition-[width] duration-300 ease-in-out",
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

// Main Component
interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, ...props }, ref) => {
    const { isOpen } = useSidebar()
    return (
      <aside
        ref={ref}
        className={cn(sidebarVariants({ state: isOpen ? "open" : "closed" }), className)}
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

// Header
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-16 items-center px-4 shrink-0", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

// Content
const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-y-auto overflow-x-hidden px-3", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

// Footer
const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 mt-auto border-t", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"


// Trigger
const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const { toggle } = useSidebar()
  const Comp = asChild ? Slot : "button"
  return <Comp ref={ref} onClick={toggle} className={cn("", className)} {...props} />
})
SidebarTrigger.displayName = "SidebarTrigger"

// Accordion for Nav items
const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b-0", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between font-medium transition-all [&[data-state=open]>svg:last-child]:rotate-90",
        className
      )}
      {...props}
    >
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-2 pt-1", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName


export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}
