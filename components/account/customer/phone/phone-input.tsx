import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
export default function PhoneInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="phone-input"
      className={cn("-ms-px rounded-s-none shadow-none focus-visible:z-10", className)}
      {...props}
    />
  );
}