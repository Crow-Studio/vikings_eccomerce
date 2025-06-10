import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { globalGETRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import React from "react";

export default async function VerifyEmailPage() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { user } = await getCurrentSession();

  if (user === null) {
    return redirect("/auth/signin");
  }

  if (user.emailVerified) {
    return redirect("/account/dashboard");
  }
  return <VerifyEmailForm user={user} />;
}
