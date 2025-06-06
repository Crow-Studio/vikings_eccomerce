import Image from "next/image";
import React from "react";

export default function NewArrivals() {
  return (
    <div className="grid grid-cols-3 gap-x-5">
      <div className="grid gap-1.5">
        <div className="h-[15rem] bg-[#f3f2f3]">
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
            Legendary Western Men's Long Sleeve
          </h4>
          <p className="text-xs text-muted-foreground">
            $34.5
          </p>
        </div>
      </div>
      <div className="grid gap-1.5">
        <div className="h-[15rem] bg-[#f3f2f3]">
          <Image
            src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHNoaXJ0fGVufDB8fDB8fHww"
            width={1980}
            height={1980}
            alt="image"
            className="h-full w-full rounded object-cover"
          />
        </div>
        <div className="grid gap-y-1.5">
          <h4 className="text-sm font-medium">
            Legendary Western Men's Long Sleeve
          </h4>
          <p className="text-xs text-muted-foreground">
            $34.5
          </p>
        </div>
      </div>
      <div className="grid gap-1.5">
        <div className="h-[15rem] bg-[#f3f2f3]">
          <Image
            src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fHRzaGlydHxlbnwwfHwwfHx8MA%3D%3D"
            width={1980}
            height={1980}
            alt="image"
            className="h-full w-full rounded object-cover"
          />
        </div>
        <div className="grid gap-y-1.5">
          <h4 className="text-sm font-medium">
            Legendary Western Men's Long Sleeve
          </h4>
          <p className="text-xs text-muted-foreground">
            $34.5
          </p>
        </div>
      </div>
    </div>
  );
}
