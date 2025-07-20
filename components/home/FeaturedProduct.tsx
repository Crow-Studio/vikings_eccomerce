import React from "react";
import { DBProduct } from "@/types";
import ProductUI from "../global/Product";

interface FeaturedProductsProps {
  featuredProducts: DBProduct[];
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
