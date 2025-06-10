import { globalGETRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import React from "react";

export default async function EditProductsPage() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { user } = await getCurrentSession();

  if (user === null) {
    return redirect("/auth/signin");
  }

  if (!user.emailVerified) {
    return redirect("/auth/verify-email");
  }

  return <div>EditProductsPage</div>;
}
