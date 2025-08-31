import AddNewProductForm from "@/components/account/products/add/AddNewProductForm";
import { db } from "@/database";
import { globalGETRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import React from "react";
export default async function AddProductsPage() {
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
  const categories = await db.query.category.findMany();
  return <AddNewProductForm categories={categories} />;
}
