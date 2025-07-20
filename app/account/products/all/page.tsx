import ProductsDataTable from "@/components/account/products/add/table/Products";
import { Button } from "@/components/ui/button";
import { db } from "@/database";
import { globalGETRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function AllProductsPage() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { user } = await getCurrentSession();

  if (user === null) {
    return redirect("/auth/signin");
  }
  if (!user.email_verified) {
    return redirect("/auth/verify-email");
  }

  const products = await db.query.product.findMany({
    with: {
      category: true,
      images: true,
      variants: {
        with: {
          generatedVariants: true,
        },
      },
    },
  });

  return (
    <div className="grid gap-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">Products</h2>
          <p className="text-sm text-muted-foreground">
            Overview of all your products
          </p>
        </div>
        <Button asChild>
          <Link href="/account/products/add">
            <Plus />
            Add product
          </Link>
        </Button>
      </div>
      <ProductsDataTable products={products} />
    </div>
  );
}
