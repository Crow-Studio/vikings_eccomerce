import OurCollections from "@/components/collections/OurCollections"
import GrainOverlay from "@/components/global/GrainOverlay"
import { db } from "@/database";
import { desc } from "drizzle-orm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products - Quality Tools & Equipment",
  description: "Browse our complete collection of quality tools, equipment, and machinery. Find construction tools, agricultural equipment, industrial machinery, power tools, and hand tools from trusted brands.",
  keywords: [
    "all products",
    "tools collection",
    "equipment catalog",
    "power tools Kenya",
    "hand tools",
    "construction equipment",
    "agricultural machinery",
    "industrial tools",
    "tool shop Kenya",
    "equipment store"
  ],
  openGraph: {
    title: "All Products - Vikings Kepower",
    description: "Browse our complete collection of quality tools and equipment. Find everything you need for construction, agriculture, and industrial work.",
    url: "https://vikings.co.ke/products",
    type: "website",
  },
  alternates: {
    canonical: "https://vikings.co.ke/products",
  },
};

export default async function Page() {
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