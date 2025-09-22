import { getProductById } from "@/actions/product-actions";
import EditProductForm from "@/components/account/products/edit/edit-product-form";
import { db } from "@/database";
import { globalGETRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { notFound, redirect } from "next/navigation";
import React from "react";
interface PageProps {
  params: Promise<{
    productId: string;
  }>;
}
export async function generateStaticParams() {
  const products = await db.query.product.findMany({
    columns: { id: true },
  });
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function EditProductsPage({ params }: PageProps) {
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

  const { productId } = await params;
  const productFromDb = await getProductById(productId);

  if (!productFromDb) {
    return notFound();
  }

  const product = {
    ...productFromDb,
    created_at: productFromDb.created_at.toISOString(),
    updated_at: productFromDb.updated_at.toISOString(),
  };

  const categories = await db.query.category.findMany();
  return <EditProductForm categories={categories} product={product} />;
}
