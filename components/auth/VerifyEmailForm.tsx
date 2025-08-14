"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { emailVerificationSchema } from "@/types";
import { User } from "@/lib/server/user";
import { signoutAction } from "@/app/account/action";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { Loader, Loader2 } from "lucide-react";
import {
  resendEmailVerificationCodeAction,
  verifyEmailAction,
} from "@/app/auth/admin/verify-email/action";
import { redirect } from "next/navigation";

export function VerifyEmailForm({ user }: { user: User }) {
  const [isSignout, setIsSignout] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(60);
  const [isResendCode, setIsResendCode] = useState<boolean>(false);
  const [isStopTimer, setIsStopTimer] = useState<boolean>(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<z.infer<typeof emailVerificationSchema>>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const startTimer = () => {
    setIsStopTimer(true);
    if (timerRef.current) {
      setIsStopTimer(false);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeElapsed((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setIsStopTimer(false);
          return 60;
        }
      });
    }, 1000);
  };

  const onResendCode = async () => {
    setIsResendCode(true);
    try {
      const { message, errorMessage } =
        await resendEmailVerificationCodeAction();

      if (errorMessage) {
        return toast.error(errorMessage, {
          position: "top-center",
        });
      }

      startTimer();

      return toast.success(message, {
        position: "top-center",
      });
    } finally {
      setIsResendCode(false);
    }
  };

  async function onSubmit(values: z.infer<typeof emailVerificationSchema>) {
    setIsVerifyingCode(true);
    try {
      const { message, errorMessage } = await verifyEmailAction(values);

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
      setIsVerifyingCode(false);
    }
  }

  const onSignoutUser = async () => {
    setIsSignout(true);
    try {
      const { message } = await signoutAction();

      if (message) {
        return toast.error(message, {
          position: "top-center",
        });
      }
    } finally {
      setIsSignout(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Card className="backdrop-blur w-full sm:min-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify Email</CardTitle>
          <CardDescription>
            Verification code was sent to{" "}
            <strong className="text-primary">{user.email}</strong>. Check your
            spam folder if you can&#39;t find the email.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-3">
                <div className="grid gap-3.5">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Verification code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g V3RIFY9"
                            {...field}
                            disabled={
                              isSignout || isResendCode || isVerifyingCode
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-1.5">
                    <Button
                      type="submit"
                      disabled={isSignout || isResendCode || isVerifyingCode}
                      className="w-full cursor-pointer gap-1.5"
                    >
                      {isVerifyingCode ? (
                        <>
                          <Loader2 className="w-5 animate-spin" />
                          <span>Verifying code...</span>
                        </>
                      ) : (
                        <span>Verify Code</span>
                      )}
                    </Button>
                    <Button
                      type="button"
                      className="w-full cursor-pointer gap-1.5"
                      variant="outline"
                      disabled={
                        isSignout ||
                        isResendCode ||
                        (timeElapsed > 0 && isStopTimer) ||
                        isVerifyingCode
                      }
                      onClick={() => onResendCode()}
                    >
                      {isResendCode ? (
                        <>
                          <Loader className="animate-spin size-5" />
                          <span>Reseding code...</span>
                        </>
                      ) : timeElapsed > 0 && isStopTimer ? (
                        <span>Resend verification code in {timeElapsed}s</span>
                      ) : (
                        <span>Resend Code</span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Button
        onClick={() => onSignoutUser()}
        type="button"
        variant="link"
        className="cursor-pointer z-10 gap-1.5"
        disabled={isSignout || isResendCode || isVerifyingCode}
      >
        {isSignout ? (
          <>
            <Loader className="animate-spin w-5 h-auto" />
            <span>Signin you out...</span>
          </>
        ) : (
          <span>want to use another email? Sign out now.</span>
        )}
      </Button>
    </div>
  );
}
