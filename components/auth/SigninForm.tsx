"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { signinAction } from "@/app/auth/admin/signin/action";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export function SigninForm() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsAuthenticating(true);
    try {
      const { message, errorMessage } = await signinAction(values);

      if (errorMessage) {
        return toast.error(errorMessage, {
          position: "top-center",
        });
      }

      form.reset();

      toast.success(message, {
        position: "top-center",
      });

      return redirect("/account/dashboard");
    } finally {
      setIsAuthenticating(false);
    }
  }

  return (
    <Card className="backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-3">
              <GoogleOauthButton
                text="Signin with Google"
                isAuthenticating={isAuthenticating}
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
                          disabled={isAuthenticating}
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
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} disabled={isAuthenticating} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={isAuthenticating}
                  type="submit"
                  className="w-full gap-1.5"
                >
                  {isAuthenticating ? (
                    <>
                      <Loader2 className="animate-spin w-5" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>Sign in</span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
