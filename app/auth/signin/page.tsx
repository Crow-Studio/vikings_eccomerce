import React from "react";
import { SigninForm } from "@/components/auth/SigninForm";

export default function SigninPage() {
  return (
    <div className="flex flex-col gap-6">
      <SigninForm />
      <div className="text-muted-foreground z-10 *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
