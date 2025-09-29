import NewCategoryButton from "@/components/account/products/categories/NewCategoryButton";
import CategoriesDataTable from "@/components/account/products/categories/table/Categories";
import { globalGETRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { getCategoriesWithProducts } from "@/lib/server/utils";
import { redirect } from "next/navigation";
import React from "react";

export default async function CategoriesPage() {
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

  const categories = await getCategoriesWithProducts();

  console.log('categories', categories)

  return (
    <div className="grid gap-y-5">
      <div className="flex flex-col gap-y-2 sm:gap-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-medium">Categories</h2>
          <p className="text-sm text-muted-foreground">
            Overview of all your categories
          </p>
        </div>
        <NewCategoryButton />
      </div>
      <CategoriesDataTable categories={categories} />
    </div>
  );
}
