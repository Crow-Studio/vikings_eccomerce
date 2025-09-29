"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  House,
  LifeBuoy,
  Settings2,
  ShoppingBag,
  ShoppingBasket,
  Users,
  Search,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/server/user";
import { UserRole } from "@/database/schema";
interface SearchCommandProps {
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
export function SearchCommand({ user }: SearchCommandProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
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
            title: "Categories",
            url: "/account/products/categories",
          },
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
  const allNavItems = React.useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      url: string;
      icon: React.ComponentType<{ className?: string }>;
      group: string;
      parent?: string;
    }> = [];
    navigationData.navMain.forEach((item, mainIndex) => {
      if (item.isShowInterface) {
        const hasSubItems = item.items && item.items.length > 0;
        const firstSubItemUrl = hasSubItems ? item.items?.[0].url : null;
        if (!hasSubItems || item.url !== firstSubItemUrl) {
          items.push({
            id: `main-${mainIndex}`,
            title: item.title,
            url: item.url,
            icon: item.icon,
            group: "Navigation",
          });
        }
        item.items?.forEach((subItem, subIndex) => {
          if (subItem.isShowInterface !== false) {
            items.push({
              id: `sub-${mainIndex}-${subIndex}`,
              title: subItem.title,
              url: subItem.url,
              icon: item.icon,
              group: "Navigation",
              parent: item.title,
            });
          }
        });
      }
    });
    navigationData.navSecondary.forEach((item, index) => {
      if (item.isShowInterface !== false) {
        items.push({
          id: `secondary-${index}`,
          title: item.title,
          url: item.url,
          icon: item.icon,
          group: "Support",
        });
      }
    });
    return items;
  }, [navigationData]);
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  const handleSelect = React.useCallback((url: string) => {
    setOpen(false);
    if (url.startsWith("mailto:")) {
      window.location.href = url;
    } else {
      router.push(url);
    }
  }, [router]);
  return (
    <div className="w-full sm:ml-auto sm:w-auto">
      {}
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search navigation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      {}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type to search navigation..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {}
          <CommandGroup heading="Navigation">
            {allNavItems
              .filter((item) => item.group === "Navigation")
              .map((item) => {
                const IconComponent = item.icon;
                return (
                  <CommandItem
                    key={item.id}
                    value={`${item.title} ${item.parent || ""}`}
                    onSelect={() => handleSelect(item.url)}
                    className="cursor-pointer"
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    <span>
                      {item.parent ? `${item.parent} › ` : ""}
                      {item.title}
                    </span>
                  </CommandItem>
                );
              })}
          </CommandGroup>
          {}
          <CommandGroup heading="Support">
            {allNavItems
              .filter((item) => item.group === "Support")
              .map((item) => {
                const IconComponent = item.icon;
                return (
                  <CommandItem
                    key={item.id}
                    value={item.title}
                    onSelect={() => handleSelect(item.url)}
                    className="cursor-pointer"
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </CommandItem>
                );
              })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}