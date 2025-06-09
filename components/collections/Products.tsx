import Image from "next/image";
import React from "react";

export default function Products() {
  return (
    <div className="grid grid-col-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="grid gap-1.5">
          <div className="h-[15rem] bg-[#f3f2f3] dark:bg-background">
            <Image
              src="https://images.unsplash.com/photo-1633966887768-64f9a867bdba?q=80&w=2003&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              width={1980}
              height={1980}
              alt="image"
              className="h-full w-full rounded object-cover"
            />
          </div>
          <div className="grid gap-y-1.5">
            <h4 className="text-sm font-medium">
              Legendary Western Men&#39;s Long Sleeve
            </h4>
            <p className="text-xs text-muted-foreground">$34.5</p>
          </div>
        </div>
      ))}
    </div>
  );
}
