
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore"
import { useSidebarStore } from "@/hooks/use-sidebar-store"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"
import { platformItems, toolsItems, userMenuItems } from "./sidebar-data"
import type { MenuItem, SubMenuItem } from "./sidebar-data"
import { ChevronsRight, LogOut, ChevronDown } from "lucide-react"

export function DashboardSidebar() {
  const { isLoggedIn, user, clearSession } = useAuthStore()
  const { isOpen, toggle } = useSidebarStore();
  const pathname = usePathname();
  const router = useRouter();

  if (!isLoggedIn || !user) {
    return null
  }
  
  const handleLogout = () => {
    clearSession();
    router.push('/');
  }

  const renderNavLinks = (items: MenuItem[]) => {
    return items.map((item, index) => {
      const isActive = item.isCollapsible ? pathname.startsWith(item.href) : pathname === item.href;
      
      if (item.isCollapsible && item.items) {
        return (
          <Collapsible key={index} defaultOpen={isActive}>
            <CollapsibleTrigger asChild>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start text-base px-3"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-8 py-1 space-y-1 relative before:absolute before:left-3.5 before:top-0 before:h-full before:w-px before:bg-border/60">
              {item.items.map((subItem) => {
                const isSubItemActive = pathname === subItem.href;
                return (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      "group flex items-center rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground relative",
                      isSubItemActive && "bg-primary/10 text-primary"
                    )}
                  >
                     {isSubItemActive && <div className="absolute -left-[18px] h-full w-0.5 bg-primary rounded-r-full"></div>}
                    {subItem.title}
                  </Link>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        );
      }
      
      return (
        <Link
          key={index}
          href={item.href}
          className={cn(
            buttonVariants({ variant: isActive ? "secondary" : "ghost", size: "default" }),
            "w-full justify-start text-base px-3 h-10"
          )}
        >
          <item.icon className="mr-3 h-5 w-5" />
          {item.title}
        </Link>
      );
    });
  }


  return (
    <aside className={cn("flex-col border-r bg-sidebar transition-[width] duration-300 ease-in-out", isOpen ? "w-60" : "w-16", "hidden sm:flex")}>
      <div className="flex h-16 items-center px-4 shrink-0 justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/png/logo-256.png"
            alt="SIG Logo"
            width={32}
            height={32}
          />
          {isOpen && <span className="text-lg font-bold">SIG IA</span>}
        </Link>
        <Button variant="ghost" size="icon" onClick={toggle} className={cn(!isOpen && "rotate-180")}>
            <ChevronsRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 space-y-4 py-4">
        {isOpen ? (
            <>
                <div>
                    <p className="px-3 py-1 text-xs font-semibold uppercase text-muted-foreground/80 tracking-wider">
                        Plataforma
                    </p>
                    <div className="mt-2 space-y-1">{renderNavLinks(platformItems)}</div>
                </div>
                 <div>
                    <p className="px-3 py-1 text-xs font-semibold uppercase text-muted-foreground/80 tracking-wider">
                        Herramientas
                    </p>
                    <div className="mt-2 space-y-1">{renderNavLinks(toolsItems)}</div>
                </div>
            </>
        ) : (
            <div className="space-y-2">
                {[...platformItems, ...toolsItems].map((item, index) => (
                    <Link key={index} href={item.href} className={cn(
                        buttonVariants({ variant: (pathname.startsWith(item.href) && item.href !== '/') || (pathname === '/' && item.href === '/') ? "secondary" : "ghost", size: "icon" }), "h-10 w-10")}>
                        <item.icon className="h-5 w-5" />
                        <span className="sr-only">{item.title}</span>
                    </Link>
                ))}
            </div>
        )}
      </div>

       <div className="mt-auto p-3 space-y-2 border-t">
         {isOpen ? (
            <>
              {renderNavLinks(userMenuItems)}
              <Separator />
               <Button variant="ghost" className="w-full justify-start text-base px-3" onClick={handleLogout}>
                <LogOut className="mr-3 h-5 w-5" />
                Cerrar Sesión
              </Button>
            </>
         ): (
            <>
                {userMenuItems.map((item, index) => (
                    <Link key={index} href={item.href} className={cn(buttonVariants({ variant: pathname === item.href ? "secondary" : "ghost", size: "icon" }), "h-10 w-10")}>
                        <item.icon className="h-5 w-5" />
                        <span className="sr-only">{item.title}</span>
                    </Link>
                ))}
                 <Separator />
                 <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Cerrar Sesión</span>
                </Button>
            </>
         )}
      </div>
    </aside>
  )
}
