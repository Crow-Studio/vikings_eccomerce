import React from "react";
import { ArrowRight, Shield, Truck } from "lucide-react";
import Link from "next/link";
import FeaturedProducts from "@/components/home/FeaturedProduct";
import GrainOverlay from "@/components/global/GrainOverlay";
import { DBProduct } from "@/types";
interface VikingsHeroProps {
  products: DBProduct[];
}
const Button = ({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => (
  <button
    className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);
export default function VikingsHero({ products }: VikingsHeroProps) {
  const featuredProducts = products.slice(0, 3);
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      <GrainOverlay />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {}
          <div className="space-y-8 lg:space-y-12">
            {}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance">
                Kenya&apos;s trusted source for{" "}
                <span className="relative text-primary">
                  professional tools
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/20 rounded-full"></span>
                </span>{" "}
                & equipment
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Shop quality domestic tools, professional equipment,
                agricultural implements, and repair services from Vikings Kenya
                Power Traders.
              </p>
            </div>
            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 group">
                <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    QUALITY GUARANTEED
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Trusted by professionals since 2005
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 group">
                <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    FAST DELIVERY
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Quick delivery across Nairobi & country wide
                  </p>
                </div>
              </div>
            </div>
            {}
            <div className="pt-2">
              <Link href="/products">
                <Button className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                  <span className="relative z-10 cursor-pointer">
                    Shop All Products
                  </span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
            {}
            <div className="pt-6 border-t border-muted">
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">
                    5000+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Happy Customers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">
                    4.8★
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Customer Rating
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">
                    30
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Day Returns
                  </div>
                </div>
              </div>
            </div>
          </div>
          {}
          <div className="space-y-6 lg:space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                Featured Products
              </h2>
              <Link href="/products">
                <button className=" bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg cursor-pointer shadow-lg hover:shadow-xl px-4 py-1  font-medium text-base flex items-center gap-1 group transition-colors">
                  View All
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
            </div>
            <FeaturedProducts featuredProducts={featuredProducts} />
            {}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button className="p-5 bg-muted/30 hover:bg-muted/50 rounded-lg transition-all duration-300 text-left group">
                <h4 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">
                  Professional Tools
                </h4>
                <p className="text-xs text-muted-foreground">
                  Power tools & equipment
                </p>
              </button>
              <button className="p-5 bg-muted/30 hover:bg-muted/50 rounded-lg transition-all duration-300 text-left group">
                <h4 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">
                  Agricultural
                </h4>
                <p className="text-xs text-muted-foreground">
                  Farming implements
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
