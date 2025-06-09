import React from "react";
import { cn } from "@/lib/utils";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage({ className }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <SignupForm />
      <div className="text-muted-foreground z-10 *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
