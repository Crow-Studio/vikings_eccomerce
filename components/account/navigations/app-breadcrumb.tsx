"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import {
  House,
  LifeBuoy,
  Settings2,
  ShoppingBag,
  ShoppingBasket,
  Users,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { User } from "@/lib/server/user";
import { UserRole } from "@/database/schema";

interface DynamicBreadcrumbProps {
  user: User;
}

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  isShowInterface?: boolean;
  items?: Array<{
    title: string;
    url: string;
    isShowInterface?: boolean;
  }>;
}

interface BreadcrumbSegment {
  title: string;
  url: string;
  isLast: boolean;
}

export function AppBreadcrumb({ user }: DynamicBreadcrumbProps) {
  const pathname = usePathname();

  const formatSegmentName = (segment: string): string => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getFriendlySegmentName = (
    segment: string,
    fullPath: string,
    navItems: NavItem[]
  ): string => {
    for (const item of navItems) {
      if (item.url === fullPath) {
        return item.title;
      }
      if (item.items) {
        const subItem = item.items.find((sub) => sub.url === fullPath);
        if (subItem) {
          return subItem.title;
        }
      }
    }
    return formatSegmentName(segment);
  };

  const navigationData = React.useMemo(() => {
    const navMain: NavItem[] = [
      {
        title: "Dashboard",
        url: "/account/dashboard",
        icon: House,
        isShowInterface: true,
      },
      {
        title: "Customers",
        url: "/account/customers",
        icon: Users,
        isShowInterface: user.role === UserRole.ADMIN,
      },
      {
        title: "Orders",
        url: "/account/orders",
        icon: ShoppingBasket,
        isShowInterface: user.role === UserRole.ADMIN,
      },
      {
        title: "Products",
        url: "/account/products/all",
        icon: ShoppingBag,
        isShowInterface: user.role === UserRole.ADMIN,
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
          {
            title: "Users",
            url: "/account/settings/users",
            isShowInterface: true,
          },
        ],
      },
    ];
    const navSecondary: NavItem[] = [
      {
        title: "Support",
        url: "mailto:thecodingmontana@gmail.com",
        icon: LifeBuoy,
        isShowInterface: true,
      },
    ];
    return { navMain, navSecondary };
  }, [user.role]);

  const breadcrumbSegments = React.useMemo((): BreadcrumbSegment[] => {
    if (pathname === "/" || pathname === "/account") {
      return [{ title: "Home", url: "/", isLast: true }];
    }
    const allNavItems = [
      ...navigationData.navMain,
      ...navigationData.navSecondary,
    ];
    for (const mainItem of allNavItems) {
      if (mainItem.items) {
        const subItem = mainItem.items.find((item) => item.url === pathname);
        if (
          subItem &&
          mainItem.isShowInterface &&
          subItem.isShowInterface !== false
        ) {
          return [
            { title: "Home", url: "/", isLast: false },
            { title: mainItem.title, url: mainItem.url, isLast: false },
            { title: subItem.title, url: subItem.url, isLast: true },
          ];
        }
      }
    }
    const mainItem = allNavItems.find((item) => item.url === pathname);
    if (mainItem && mainItem.isShowInterface) {
      return [
        { title: "Home", url: "/", isLast: false },
        { title: mainItem.title, url: mainItem.url, isLast: true },
      ];
    }
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      return [{ title: "Home", url: "/", isLast: true }];
    }
    if (segments[0] === "account") {
      const breadcrumbs: BreadcrumbSegment[] = [
        { title: "Home", url: "/", isLast: false },
      ];
      let currentPath = "";
      segments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const isLast = index === segments.length - 1;
        const friendlyName = getFriendlySegmentName(
          segment,
          currentPath,
          allNavItems
        );
        breadcrumbs.push({
          title: friendlyName,
          url: currentPath,
          isLast,
        });
      });
      return breadcrumbs;
    }
    return [
      { title: "Home", url: "/", isLast: false },
      {
        title: formatSegmentName(segments[segments.length - 1]),
        url: pathname,
        isLast: true,
      },
    ];
  }, [pathname, navigationData]);

  if (pathname === "/") {
    return null;
  }

  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        {breadcrumbSegments.map((segment, index) => (
          <React.Fragment key={`breadcrumb-${index}-${segment.url}`}>
            <BreadcrumbItem>
              {segment.isLast ? (
                <BreadcrumbPage>{segment.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={segment.url}>
                  {segment.title}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!segment.isLast && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
