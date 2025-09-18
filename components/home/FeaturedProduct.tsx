import React from "react";
import { Product } from "@/types/products";
import ProductUI from "../global/Product";
interface FeaturedProductsProps {
  featuredProducts: Product[];
}
const FeaturedProducts = ({ featuredProducts }: FeaturedProductsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {featuredProducts.map((product) => (
        <ProductUI key={product.id} product={product} />
      ))}
    </div>
  );
};
export default FeaturedProducts;
