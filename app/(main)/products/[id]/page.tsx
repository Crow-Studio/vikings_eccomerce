// import ProductDescPage from "@/components/products/Description/product";
import { db, eq } from "@/database";
import { desc } from "drizzle-orm";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const products = await db.query.product.findMany({
    columns: { id: true },
  });

  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = params;

  const product = await db.query.product.findFirst({
    where: (table) => eq(table.id, id),
    with: {
      category: true,
      images: true,
      variants: {
        with: {
          generatedVariants: true,
        },
      },
    },
    orderBy: (table) => desc(table.created_at),
  });

  if (!product) {
    return notFound();
  }

  console.log(product)

  return (
    <div>
      {/* <ProductDescPage {...product} params={{ id }} /> */}
      {/* You can uncomment the above line and remove the line below */}
      {product.id}
    </div>
  );
}
