import AddUserButton from "@/components/account/settings/users/add-user-button";
import UsersDataTable from "@/components/account/settings/users/table/Users";
import { db } from "@/database";
import { globalGETRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
export default async function GeneralSettingsPage() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { user } = await getCurrentSession();

  if (user === null) {
    return redirect("/auth/admin/signin");
  }

  if (!user.email_verified) {
    return redirect("/auth/admin/verify-email");
  }

  const users = await db.query.user.findMany({
    orderBy: (table) => desc(table.updated_at),
  });

  return (
    <div className="grid gap-y-5">
      <div className="flex flex-col gap-y-2 sm:gap-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-medium">Users</h2>
          <p className="text-sm text-muted-foreground">
            Manage all the users of the vikings store
          </p>
        </div>
        <AddUserButton />
      </div>
      <UsersDataTable users={users} />
    </div>
  );
}
