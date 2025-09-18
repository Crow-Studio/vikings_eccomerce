import OurCollections from "@/components/collections/OurCollections";
import Hero from "@/components/home/Hero";
import { db } from "@/database";
import { desc } from "drizzle-orm";
export default async function Home() {
  const rawProducts = await db.query.product.findMany({
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

  const products = rawProducts.map((product) => ({
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      generatedVariants: variant.generatedVariants.map((gv) => ({
        ...gv,
        value: gv.name,
      })),
    })),
  }));

  return (
    <main>
      <Hero products={products} />
      <OurCollections products={products} />
    </main>
  );
}
