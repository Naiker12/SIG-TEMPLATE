
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenu,
    SidebarSeparator,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminMenuItem } from "./sidebar-data";
import { usePathname } from "next/navigation";

type CollapsibleMenuItemProps = {
    item: AdminMenuItem;
};

export function CollapsibleMenuItem({ item }: CollapsibleMenuItemProps) {
    const pathname = usePathname();
    const { state, setOpen } = useSidebar();
    const isChildActive = item.submenu?.some(subItem => pathname === subItem.href);
    const [isOpen, setIsOpen] = useState(isChildActive || false);

    useEffect(() => {
        if (state === 'collapsed') {
            setIsOpen(false);
        }
    }, [state]);

    const handleTriggerClick = () => {
        if (state === 'collapsed') {
            setOpen(true);
        }
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        className="w-full"
                        tooltip={item.label}
                        isActive={isChildActive && !isOpen}
                        onClick={handleTriggerClick}
                    >
                        <item.icon />
                        <span>{item.label}</span>
                        <ChevronRight className={cn("ml-auto h-4 w-4 transition-transform group-data-[state=collapsed]:hidden", isOpen && "rotate-90")} />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                    <SidebarSeparator className="my-1" />
                    <SidebarMenu className="ml-4 px-2 border-l border-dashed border-sidebar-border">
                        {item.submenu?.map((subItem, subIndex) => (
                             <SidebarMenuItem key={subIndex}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={subItem.label}
                                    variant="ghost"
                                    className="h-9 justify-start"
                                    isActive={pathname === subItem.href}
                                >
                                    <Link href={subItem.href}>
                                        <subItem.icon />
                                        <span>{subItem.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}
