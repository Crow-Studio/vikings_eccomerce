"use client";

import * as React from "react";
import {
  House,
  LifeBuoy,
  Settings2,
  ShoppingBag,
  ShoppingBasket,
} from "lucide-react";

import { NavMain } from "@/components/account/navigations/nav-main";
import { NavSecondary } from "@/components/account/navigations/nav-secondary";
import { NavUser } from "@/components/account/navigations/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import DeliriumSvgIcon from "@/components/svgs/DeliriumSvgIcon";
import Link from "next/link";
import { User } from "@/lib/server/user";

// Extend the Sidebar props to include user
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/account/dashboard",
        icon: House,
        isShowInterface: true,
      },
      {
        title: "Orders",
        url: "/account/orders",
        icon: ShoppingBasket,
        isShowInterface: user.role === "ADMIN" ? true : false,
      },
      {
        title: "Products",
        url: "/account/products/all",
        icon: ShoppingBag,
        isShowInterface: user.role === "ADMIN" ? true : false,
        items: [
          {
            title: "All Products",
            url: "/account/products/all",
          },
          {
            title: "Add Product",
            url: "/account/products/add",
          },
        ],
      },
      {
        title: "Settings",
        url: "/account/settings/general",
        icon: Settings2,
        isShowInterface: true,
        items: [
          {
            title: "General",
            url: "/account/settings/general",
            isShowInterface: true,
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "mailto:thecodingmontana@gmail.com",
        icon: LifeBuoy,
      },
    ],
  };

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <DeliriumSvgIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Derilium</span>
                  <span className="truncate text-xs">{user.role}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
