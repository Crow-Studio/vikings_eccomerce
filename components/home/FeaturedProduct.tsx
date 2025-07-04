import React from "react";
import Image from "next/image";

const FeaturedProducts = () => {
  const products = [
    {
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Professional Power Tools",
      price: "From KSh 2,500"
    },
    {
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Agricultural Equipment",
      price: "From KSh 800"
    },
    {
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Domestic Hardware",
      price: "From KSh 300"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((product, index) => (
        <div 
          key={index} 
          className="grid gap-1.5 group cursor-pointer transform transition-all duration-300 hover:scale-105"
        >
          <div className="h-[15rem] bg-muted rounded-lg overflow-hidden relative group-hover:shadow-xl transition-shadow duration-300">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index === 0}
            />
          </div>
          
          <div className="grid gap-y-1.5">
            <h4 className="text-sm font-medium group-hover:text-primary transition-colors duration-200">
              {product.title}
            </h4>
            <p className="text-xs text-muted-foreground font-semibold opacity-70 group-hover:opacity-100 transition-opacity duration-200">
              {product.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;