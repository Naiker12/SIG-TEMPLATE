"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore"
import { useSidebarStore } from "@/hooks/use-sidebar-store"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"
import { platformItems, toolsItems, userMenuItems, publicToolsItems } from "./sidebar-data"
import type { MenuItem } from "./sidebar-data"
import { ChevronsLeft, LogOut, ChevronDown, LogIn } from "lucide-react"
import { ThemeSwitcher } from "./theme-switcher";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthModal } from "@/hooks/use-auth-modal";

export function DashboardSidebar() {
  const { isLoggedIn, user, clearSession } = useAuthStore()
  const { isOpen, toggle } = useSidebarStore();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = React.useState(false);
  const authModal = useAuthModal();


  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push('/');
  }
  
  if (!hasMounted) {
    return null
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
                className="w-full justify-start text-base px-3 h-10"
              >
                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-sidebar-muted-foreground")} />
                {isOpen && item.title}
                {isOpen && <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />}
              </Button>
            </CollapsibleTrigger>
            {isOpen && (
              <CollapsibleContent className="pl-8 py-1 space-y-1 relative before:absolute before:left-3.5 before:top-0 before:h-full before:w-px before:bg-sidebar-border/60">
                {item.items.map((subItem) => {
                  const isSubItemActive = pathname === subItem.href;
                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "group flex items-center rounded-md px-3 py-1.5 text-sm text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground relative",
                        isSubItemActive && "bg-primary/10 text-primary"
                      )}
                    >
                      {isSubItemActive && <div className="absolute -left-[18px] h-full w-0.5 bg-primary rounded-r-full"></div>}
                      {subItem.title}
                    </Link>
                  );
                })}
              </CollapsibleContent>
            )}
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
          <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-sidebar-muted-foreground")} />
          {isOpen && item.title}
        </Link>
      );
    });
  }

  const sidebarClasses = cn(
    "fixed top-0 left-0 h-screen flex flex-col border-r bg-sidebar-background transition-all duration-300 ease-in-out z-50",
    {
      // Desktop classes
      "sm:w-60": !isMobile && isOpen,
      "sm:w-16": !isMobile && !isOpen,
      // Mobile classes (overlay effect)
      "w-60": isMobile,
      "translate-x-0": isMobile && isOpen,
      "-translate-x-full": isMobile && !isOpen,
    }
  );


  return (
     <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 sm:hidden"
          onClick={toggle}
        />
      )}
      <aside className={sidebarClasses}>
        <div className="flex h-16 items-center px-4 shrink-0 justify-between">
          <Link href="/" className={cn("flex items-center gap-2.5", !isOpen && "w-10 justify-center")}>
            <Image
              src="/logo-256.png"
              alt="SIG Logo"
              width={32}
              height={32}
            />
            {isOpen && <span className="text-lg font-bold text-sidebar-foreground">SIG IA</span>}
          </Link>
          {isOpen && !isMobile && (
              <Button variant="ghost" size="icon" onClick={toggle}>
                  <ChevronsLeft className="h-5 w-5" />
              </Button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 space-y-4 py-4">
          {isOpen ? (
              isLoggedIn ? (
                  <>
                      <div>
                          <p className="px-3 py-1 text-xs font-semibold uppercase text-sidebar-muted-foreground/80 tracking-wider">
                              Plataforma
                          </p>
                          <div className="mt-2 space-y-1">{renderNavLinks(platformItems)}</div>
                      </div>
                      <div>
                          <p className="px-3 py-1 text-xs font-semibold uppercase text-sidebar-muted-foreground/80 tracking-wider">
                              Herramientas
                          </p>
                          <div className="mt-2 space-y-1">{renderNavLinks(toolsItems)}</div>
                      </div>
                  </>
              ) : (
                  <>
                      <div>
                          <p className="px-3 py-1 text-xs font-semibold uppercase text-sidebar-muted-foreground/80 tracking-wider">
                              Herramientas Públicas
                          </p>
                          <div className="mt-2 space-y-1">{renderNavLinks(publicToolsItems)}</div>
                      </div>
                  </>
              )
          ) : (
              <div className="space-y-2">
                  {(isLoggedIn ? [...platformItems, ...toolsItems] : publicToolsItems).map((item, index) => (
                      <Link key={index} href={item.href} className={cn(
                          buttonVariants({ variant: (pathname.startsWith(item.href) && item.href !== '/') || (pathname === '/' && item.href === '/') ? "secondary" : "ghost", size: "icon" }), "h-10 w-10")}>
                          <item.icon className="h-5 w-5" />
                          <span className="sr-only">{item.title}</span>
                      </Link>
                  ))}
              </div>
          )}
        </div>

         <div className="mt-auto p-3 border-t border-sidebar-border">
           <div className="space-y-2 pt-2">
              {isOpen ? (
                  isLoggedIn ? (
                    <>
                    {renderNavLinks(userMenuItems)}
                    <Separator className="bg-sidebar-border my-2"/>
                    <ThemeSwitcher />
                    <Button variant="ghost" className="w-full justify-start text-base px-3 h-10 text-sidebar-muted-foreground" onClick={handleLogout}>
                        <LogOut className="mr-3 h-5 w-5" />
                        Cerrar Sesión
                    </Button>
                    </>
                  ) : (
                    <>
                    <Separator className="bg-sidebar-border my-2"/>
                    <ThemeSwitcher />
                    <Button variant="ghost" className="w-full justify-start text-base px-3 h-10 text-sidebar-muted-foreground" onClick={authModal.onOpen}>
                        <LogIn className="mr-3 h-5 w-5" />
                        Iniciar Sesión
                    </Button>
                    </>
                  )
              ): (
                  isLoggedIn ? (
                    <>
                        {userMenuItems.map((item, index) => (
                            <Link key={index} href={item.href} className={cn(
                                buttonVariants({ variant: pathname.startsWith(item.href) ? "secondary" : "ghost", size: "icon" }), "h-10 w-10")}>
                                <item.icon className="h-5 w-5" />
                                <span className="sr-only">{item.title}</span>
                            </Link>
                        ))}
                        <Separator className="bg-sidebar-border my-2"/>
                        <ThemeSwitcher />
                        <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handleLogout}>
                            <LogOut className="h-5 w-5" />
                            <span className="sr-only">Cerrar Sesión</span>
                        </Button>
                    </>
                  ) : (
                     <>
                      <Separator className="bg-sidebar-border my-2"/>
                      <ThemeSwitcher />
                      <Button variant="ghost" size="icon" className="h-10 w-10" onClick={authModal.onOpen}>
                          <LogIn className="h-5 w-5" />
                          <span className="sr-only">Iniciar Sesión</span>
                      </Button>
                    </>
                  )
              )}
           </div>
        </div>
      </aside>
    </>
  )
}
