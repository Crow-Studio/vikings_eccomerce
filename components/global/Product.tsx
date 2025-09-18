"use client";
import { cn, generateSrcSet } from "@/lib/utils";
import { useState } from "react";
import type * as React from "react";
import Link from "next/link";
import ProductSkeleton from "./ProductSkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { DBProduct } from "@/types/products";

interface ProductUIProps {
  products?: DBProduct[];
  product?: DBProduct;
  isLoading?: boolean;
  itemsPerPage?: number;
  showPagination?: boolean;
}

function isNewProduct(createdAt: Date): boolean {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  return createdAt > oneDayAgo;
}

function ProductCard({ product }: { product: DBProduct }) {
  const isNew = isNewProduct(new Date(product.created_at));
  const whatsappNumber = "+254721780466";

  const image = product.images[0];

  const srcSet = generateSrcSet({
    large: image.urls?.large as string,
    medium: image.urls?.medium as string,
    original: image.urls?.original as string,
    thumbnail: image.urls?.thumbnail as string,
  });

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const message = `Hi! I'm interested in ordering:\n\n*${
      product.name
    }*\nPrice: KSh ${Number.parseFloat(
      product.price
    ).toLocaleString()}\n\nPlease let me know about availability and delivery details.`;

    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(
      /[^0-9]/g,
      ""
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div>
      <div className="grid gap-1.5 group cursor-pointer">
        <div className="h-[15rem] rounded-lg overflow-hidden relative transition-shadow duration-300 bg-white shadow shadow-white border border-gray-200 dark:border-slate-700">
          {/* New Badge */}
          {isNew && (
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                New
              </span>
            </div>
          )}
          <img
            src={image.urls?.medium as string}
            srcSet={srcSet}
            sizes="(max-width: 300px) 300px, (max-width: 600px) 600px,
         (max-width: 1200px) 1200px, 2000px"
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="object-contain transition-transform duration-300 group-hover:scale-110"
          />

          {/* Hover actions */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-3 grid sm:group-hover:grid gap-y-1.5 sm:hidden transition-all duration-200">
            <button
              onClick={handleWhatsAppOrder}
              className="p-0.5 rounded-md w-full bg-white/95 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium shadow-sm cursor-pointer transition-colors duration-200"
              aria-label="Order Now"
            >
              Order Now
            </button>
            <Link href={`/products/${product.id}`}
              className="p-0.5 flex items-center justify-center rounded-md w-full bg-white/95 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium shadow-sm cursor-pointer transition-colors duration-200"
              aria-label="View details"
            >
              View Details
            </Link>
          </div>
        </div>

        <div className="grid gap-y-1.5">
          <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
            {product.name}
          </div>
          <p className="text-sm text-red-600 font-bold group-hover:text-red-700 transition-opacity duration-200">
            KSh {Number.parseFloat(product.price).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProductUI({
  products,
  product,
  isLoading = false,
  itemsPerPage = 12,
  showPagination = true,
}: ProductUIProps) {
  const [currentPage, setCurrentPage] = useState(1);

  if (product && !products) {
    if (isLoading) {
      return <ProductSkeleton />;
    }
    return <ProductCard product={product} />;
  }

  if (!products) {
    return <ProductSkeleton />;
  }

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 2;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("ellipsis", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(
          1,
          "ellipsis",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis",
          totalPages
        );
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="space-y-8">
      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: itemsPerPage }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : currentProducts.map((productItem) => (
              <ProductCard key={productItem.id} product={productItem} />
            ))}
      </div>

      {/* Pagination */}
      {!isLoading &&
        showPagination &&
        products.length > 0 &&
        totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={cn(
                      "cursor-pointer hover:bg-blue-50 hover:text-blue-600",
                      currentPage === 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>

                {pageNumbers.map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className={cn(
                          "cursor-pointer hover:bg-blue-50 hover:text-blue-600",
                          currentPage === page &&
                            "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                        )}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={cn(
                      "cursor-pointer hover:bg-blue-50 hover:text-blue-600",
                      currentPage === totalPages &&
                        "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

      {/* Pagination info */}
      {!isLoading && showPagination && products.length > 0 && (
        <div className="text-center text-sm text-blue-600">
          Showing {startIndex + 1} to {Math.min(endIndex, products.length)} of{" "}
          {products.length} products
        </div>
      )}

      {/* Empty state */}
      {!isLoading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      )}
    </div>
  );
}
