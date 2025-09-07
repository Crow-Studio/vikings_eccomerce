import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductUI from "@/components/global/product";
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
    className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default function VikingsHero({ products }: VikingsHeroProps) {
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      <GrainOverlay />
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Simple Header */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">
            Discover Quality{" "}
            <span className="relative text-blue-600">
              Products
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600/20 rounded-full"></span>
            </span>
          </h1>
          
          <Link href="/products">
            <Button className="group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
              <span className="relative z-10">Shop Now</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Featured Products */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Featured Products
            </h2>
            <Link href="/products">
              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium text-sm flex items-center gap-2 group transition-colors shadow-lg hover:shadow-xl">
                View All
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </div>

          <ProductUI 
            products={featuredProducts} 
            showPagination={false}
            itemsPerPage={8}
          />
        </div>
      </div>
    </div>
  );
}



























// import React from "react";
// import { ArrowRight, Shield, Truck } from "lucide-react";
// import Link from "next/link";
// import FeaturedProducts from "@/components/home/FeaturedProduct";
// import GrainOverlay from "@/components/global/GrainOverlay";
// import { DBProduct } from "@/types";
// interface VikingsHeroProps {
//   products: DBProduct[];
// }
// const Button = ({
//   children,
//   className = "",
//   ...props
// }: {
//   children: React.ReactNode;
//   className?: string;
//   [key: string]: any;
// }) => (
//   <button
//     className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${className}`}
//     {...props}
//   >
//     {children}
//   </button>
// );
// export default function VikingsHero({ products }: VikingsHeroProps) {
//   const featuredProducts = products.slice(0, 3);
//   return (
//     <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
//       <GrainOverlay />
//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
//           {}
//           <div className="space-y-8 lg:space-y-12">
//             {}
//             <div className="space-y-4">
//               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance">
//                 Kenya&apos;s trusted source for{" "}
//                 <span className="relative text-blue-600">
//                   professional tools
//                   <span className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600/20 rounded-full"></span>
//                 </span>{" "}
//                 & equipment
//               </h1>
//               <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-xl">
//                 Shop quality domestic tools, professional equipment,
//                 agricultural implements, and repair services from Vikings Kenya
//                 Power Traders.
//               </p>
//             </div>
//             {}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-blue-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 group shadow-sm">
//                 <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
//                   <Shield className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors">
//                     QUALITY GUARANTEED
//                   </h3>
//                   <p className="text-gray-600 text-sm leading-relaxed">
//                     Trusted by professionals since 2005
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-blue-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 group shadow-sm">
//                 <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
//                   <Truck className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <h3 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors">
//                     FAST DELIVERY
//                   </h3>
//                   <p className="text-gray-600 text-sm leading-relaxed">
//                     Quick delivery across Nairobi & country wide
//                   </p>
//                 </div>
//               </div>
//             </div>
//             {}
//             <div className="pt-2">
//               <Link href="/products">
//                 <Button className="group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
//                   <span className="relative z-10 cursor-pointer">
//                     Shop All Products
//                   </span>
//                   <ArrowRight className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" />
//                 </Button>
//               </Link>
//             </div>
//             {}
//             <div className="pt-6 border-t border-gray-200">
//               <div className="grid grid-cols-3 gap-4 sm:gap-6">
//                 <div className="text-center">
//                   <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 tracking-tight">
//                     5000+
//                   </div>
//                   <div className="text-xs sm:text-sm text-gray-600 font-medium">
//                     Happy Customers
//                   </div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-1 tracking-tight">
//                     4.8★
//                   </div>
//                   <div className="text-xs sm:text-sm text-gray-600 font-medium">
//                     Customer Rating
//                   </div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 tracking-tight">
//                     30
//                   </div>
//                   <div className="text-xs sm:text-sm text-gray-600 font-medium">
//                     Day Returns
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {}
//           <div className="space-y-6 lg:space-y-8">
//             <div className="flex items-center justify-between">
//               <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                 Featured Products
//               </h2>
//               <Link href="/products">
//                 <button className=" bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer shadow-lg hover:shadow-xl px-4 py-1  font-medium text-base flex items-center gap-1 group transition-colors">
//                   View All
//                   <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
//                 </button>
//               </Link>
//             </div>
//             <FeaturedProducts featuredProducts={featuredProducts} />
//             {}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
//               <button className="p-5 bg-white border border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50/50 rounded-lg transition-all duration-300 text-left group shadow-sm">
//                 <h4 className="font-semibold text-sm mb-2 group-hover:text-blue-600 transition-colors">
//                   Professional Tools
//                 </h4>
//                 <p className="text-xs text-gray-600">
//                   Power tools & equipment
//                 </p>
//               </button>
//               <button className="p-5 bg-white border border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50/50 rounded-lg transition-all duration-300 text-left group shadow-sm">
//                 <h4 className="font-semibold text-sm mb-2 group-hover:text-blue-600 transition-colors">
//                   Agricultural
//                 </h4>
//                 <p className="text-xs text-gray-600">
//                   Farming implements
//                 </p>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




