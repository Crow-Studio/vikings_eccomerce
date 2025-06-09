import React from "react";
import { cn } from "@/lib/utils";
import DeliriumSvgIcon from "@/components/svgs/DeliriumSvgIcon";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid place-content-center min-h-screen">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <div className="grid gap-3">
        <div className="backdrop-blur-xs grid place-content-center">
          <div className="flex items-center gap-1.5">
            <DeliriumSvgIcon className="w-[2.5rem] h-auto" />
            <h1 className="text-4xl font-semibold text-[#353535] dark:text-white">
              Delirium
            </h1>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
