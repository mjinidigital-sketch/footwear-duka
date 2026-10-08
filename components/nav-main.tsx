"use client"

import Link from "next/link"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  pathname,
  label,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    badge?: string | number
  }[]
  pathname?: string
  label?: string
}) {
  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 mb-1">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url || (item.url !== "/admin" && pathname?.startsWith(item.url))
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActive}
                  render={<Link href={item.url} />}
                >
                  <span className={isActive ? "text-primary" : "text-muted-foreground"}>
                    {item.icon}
                  </span>
                  <span className={isActive ? "font-semibold text-foreground" : "text-foreground/80"}>
                    {item.title}
                  </span>
                </SidebarMenuButton>
                {item.badge !== undefined && (
                  <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
