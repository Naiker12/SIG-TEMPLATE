"use client"

import * as React from "react"
import Link from 'next/link';
import Image from "next/image"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  NavItem,
  CollapsibleNavItem,
} from "@/components/ui/sidebar"
import { useSidebarStore } from "@/hooks/use-sidebar-store"
import { menuItems } from "./sidebar-data";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button } from "../ui/button";
import { ChevronsLeft, Settings, User } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

function NavUser() {
  const { user } = useAuthStore()
  const { isCollapsed } = useSidebarStore()

  if (!user) return null

  return (
    <div className="flex w-full items-center p-2">
      <Link href="/profile" className="flex-1">
        <div className="flex items-center gap-4">
          <Image
            src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
            alt="User avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <p className="line-clamp-1 text-sm font-semibold">{user.name}</p>
              <p className="line-clamp-1 text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}

function SidebarToggle() {
  const { isOpen, setOpen } = useSidebarStore();
  const isCollapsed = !isOpen;

  return (
    <Button
      variant="ghost"
      className={cn("h-12 w-full justify-start", isCollapsed && "justify-center size-12")}
      onClick={() => setOpen(!isOpen)}
    >
      <ChevronsLeft
        className={cn(
          "size-6 transition-all",
          !isCollapsed ? "mr-4" : ""
        )}
      />
      <span className={cn(!isCollapsed ? "inline" : "hidden")}>Colapsar</span>
    </Button>
  );
}

export function DashboardSidebar() {
  const { isLoggedIn } = useAuthStore()
  const { isCollapsed } = useSidebarStore();

  const renderNavItems = (items: typeof menuItems) => {
    return items.map((item) => {
      if (item.isCollapsible && item.items) {
        return (
          <CollapsibleNavItem
            key={item.href}
            title={item.title}
            icon={React.createElement(item.icon, { className: "size-6" })}
            aria-label={item.title}
            items={item.items.map(subItem => ({
              href: subItem.href,
              "aria-label": subItem.title,
            }))}
          >
            <div className="flex items-center gap-x-4">
              <item.icon className="size-6" />
              <span>{item.title}</span>
            </div>
          </CollapsibleNavItem>
        )
      } else {
        return (
          <NavItem key={item.href} href={item.href} aria-label={item.title}>
            <item.icon className="size-6" />
            {!isCollapsed && <span className="font-medium">{item.title}</span>}
          </NavItem>
        )
      }
    });
  };

  if (!isLoggedIn) return null;

  return (
    <Sidebar collapsible="button">
        <SidebarHeader>
            <Link href="/" className="flex items-center gap-4 px-1.5">
              <Image
                src="/png/logo-256.png"
                alt="SIG Logo"
                width={40}
                height={40}
                className="transition-all"
              />
              {!isCollapsed && <h1 className="text-xl font-bold">SIG IA</h1>}
            </Link>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-y-auto">
            <NavMain>
                {renderNavItems(menuItems)}
            </NavMain>
        </SidebarContent>

        <SidebarFooter>
            <NavUser />
            <SidebarToggle />
        </SidebarFooter>
    </Sidebar>
  )
}
