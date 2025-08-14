import { UserProfileForm } from "@/components/account/settings/profile/UserProfileForm";
import { globalGETRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
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

  return (
    <div className="grid gap-5 rounded-lg bg-[#fafafa] p-5 dark:bg-[#1d1d1d]">
      <div>
        <h1 className="text-base font-medium">Profile Details</h1>
        <p className="max-w-xl text-balance text-sm text-muted-foreground">
          Update your profile info details.
        </p>
      </div>
      <UserProfileForm user={user} />
    </div>
  );
}
