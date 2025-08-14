"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import GoogleOauthButton from "./GoogleOauthButton";
import { PasswordInput } from "./PasswordInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formSchema } from "@/types";
import { useState } from "react";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { signupAction } from "@/app/auth/admin/signup/action";
import { Loader2 } from "lucide-react";

export function SignupForm() {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsCreatingAccount(true);
    try {
      const { message, errorMessage } = await signupAction(values);
      console.log(message, errorMessage);

      if (errorMessage) {
        return toast.error(errorMessage, {
          position: "top-center",
        });
      }
      form.reset();

      toast.success(message, {
        position: "top-center",
      });

      return redirect("/auth/admin/verify-email");
    } finally {
      setIsCreatingAccount(false);
    }
  }
  return (
    <Card className="backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-3">
              <GoogleOauthButton
                text="Signup with Google"
                isAuthenticating={isCreatingAccount}
              />
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-3.5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                          disabled={isCreatingAccount}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          disabled={isCreatingAccount}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={isCreatingAccount}
                  type="submit"
                  className="w-full gap-1.5"
                >
                  {isCreatingAccount ? (
                    <>
                      <Loader2 className="animate-spin w-5" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <span>Create an account</span>
                  )}
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/admin/signin"
                  className="underline underline-offset-4"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
