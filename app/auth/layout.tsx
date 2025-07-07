import { cn } from "@/lib/utils";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import VikingsSvgIcon from "@/components/svgs/VikingsSvgIcon";
import GrainOverlay from "@/components/global/GrainOverlay";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid place-content-center min-h-screen">
      <GrainOverlay />
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <div className="grid gap-3 w-full max-w-2xl">
        <div className="z-10 bg-transparent grid place-content-center">
          <Link href="/" className="flex items-center gap-1.5">
            <VikingsSvgIcon className="w-[4.5rem] h-auto" />
            <h1 className="text-4xl font-semibold text-[#353535] dark:text-white">
              Vikings
            </h1>
          </Link>
        </div>
        <div className="w-full">{children}</div>
      </div>
      <Toaster richColors closeButton />
    </main>
  );
}
