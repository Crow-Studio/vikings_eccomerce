import OurCollections from "@/components/collections/OurCollections"
import GrainOverlay from "@/components/global/GrainOverlay"
import { db } from "@/database";
import { desc } from "drizzle-orm";

export default async function Page() {
  // Fetch products from database
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
    orderBy: table => desc(table.created_at)
  });

  // Transform products to match DBProduct type
  const products = rawProducts.map(product => ({
    ...product,
    created_at: product.created_at.toISOString(),
    updated_at: product.updated_at?.toISOString() || null,
  }));

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden ">
      <GrainOverlay/>
      <OurCollections products={products} />
    </div>
  );
}