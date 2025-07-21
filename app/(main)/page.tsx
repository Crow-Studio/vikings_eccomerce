import OurCollections from "@/components/collections/OurCollections";
import Hero from "@/components/home/Hero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Newsletter from "@/components/home/Newsletter";
import { db } from "@/database";
import { desc } from "drizzle-orm";

export default async function Home() {
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
    orderBy: table => desc(table.created_at)
  });

  return (
    <main>
      <Hero products={products} />
      <OurCollections products={products} />
      <WhyChooseUs />
      <Newsletter />
    </main>
  );
}