import { DBProduct } from "@/types";
import Image from "next/image";

interface ProductUIProps {
  product: DBProduct;
}

export default function ProductUI({ product }: ProductUIProps) {
  return (
    <div className="grid gap-1.5 group cursor-pointer">
      <div className="h-[15rem] rounded-lg overflow-hidden relative transition-shadow duration-300 bg-white">
        <Image
          src={product.images[0].url}
          alt={`${product.name.toLowerCase()}_${product.images[0].id}`}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="grid gap-y-1.5">
        <h4 className="text-sm font-medium group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h4>
        <p className="text-xs text-muted-foreground font-semibold opacity-70 group-hover:opacity-100 transition-opacity duration-200">
          {product.price}
        </p>
      </div>
    </div>
  );
}
