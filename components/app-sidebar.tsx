"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  ChartBarIcon,
  UsersIcon,
  Settings2Icon,
  CircleHelpIcon,
  PackageIcon,
  TagIcon,
  CreditCardIcon,
  ShoppingCartIcon,
  ShieldCheckIcon,
  BoxesIcon,
} from "lucide-react"

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string
    email: string
    avatar: string
    role?: string
  }
}) {
  const pathname = usePathname()
  const userRole = user?.role || "user"
  const isAdmin = userRole === "admin"

  const catalogNav = [
    {
      title: "Products",
      url: "/admin/products",
      icon: <PackageIcon className="h-4 w-4" />,
    },
    {
      title: "Categories",
      url: "/admin/categories",
      icon: <TagIcon className="h-4 w-4" />,
    },
    {
      title: "Inventory",
      url: "/admin/products",
      icon: <BoxesIcon className="h-4 w-4" />,
    },
  ]

  const salesNav = [
    {
      title: "Orders",
      url: "/admin/orders",
      icon: <ShoppingCartIcon className="h-4 w-4" />,
    },
    {
      title: "Payments",
      url: "/admin/payments",
      icon: <CreditCardIcon className="h-4 w-4" />,
    },
  ]

  const overviewNav = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: <LayoutDashboardIcon className="h-4 w-4" />,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: <ChartBarIcon className="h-4 w-4" />,
    },
  ]

  const adminNav = [
    {
      title: "Users",
      url: "/admin/users",
      icon: <UsersIcon className="h-4 w-4" />,
    },
    {
      title: "Roles & Permissions",
      url: "/admin/users",
      icon: <ShieldCheckIcon className="h-4 w-4" />,
    },
  ]

  const data = {
    user: user || {
      name: "Admin",
      email: "admin@footwearduka.com",
      avatar: "/avatars/default.jpg",
    },
    navSecondary: [
      {
        title: "Settings",
        url: "/admin/settings",
        icon: <Settings2Icon className="h-4 w-4" />,
      },
      {
        title: "Help & Support",
        url: "#",
        icon: <CircleHelpIcon className="h-4 w-4" />,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" side="left" {...props}>
      <SidebarHeader className="border-b border-sidebar-border pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5! font-semibold"
              render={<Link href="/admin" className="flex items-center gap-2.5" />}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold shadow">
                FD
              </span>
              <span className="text-base font-semibold tracking-tight">Footwear Duka</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto py-2 gap-0 overflow-x-hidden">
        {/* Overview */}
        <NavMain
          items={overviewNav}
          pathname={pathname}
          label="Overview"
        />

        <SidebarSeparator className="my-1" />

        {/* Catalog */}
        <NavMain
          items={catalogNav}
          pathname={pathname}
          label="Catalog"
        />

        <SidebarSeparator className="my-1" />

        {/* Sales */}
        <NavMain
          items={salesNav}
          pathname={pathname}
          label="Sales"
        />

        {/* Admin-only */}
        {isAdmin && (
          <>
            <SidebarSeparator className="my-1" />
            <NavMain
              items={adminNav}
              pathname={pathname}
              label="Administration"
            />
          </>
        )}

        {/* Secondary at bottom */}
        <NavSecondary items={data.navSecondary} className="mt-auto" pathname={pathname} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border pt-2">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
