import { getCurrentSession } from "@/lib/server/session";
import React from "react";
import { AppSidebar } from "@/components/account/navigations/app-sidebar";
import { SiteHeader } from "@/components/account/navigations/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

export default async function NavigationWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentSession();

  if (!user) {
    return redirect("/auth/signin");
  }
  
  return (
    <SidebarProvider className="flex flex-col">
      <SiteHeader />
      <div className="flex flex-1">
        <AppSidebar user={user} />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
