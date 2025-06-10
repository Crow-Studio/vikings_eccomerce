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
import { formSchema } from "@/types";
import { User } from "@/lib/server/user";
import { signoutAction } from "@/app/account/action";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { Loader } from "lucide-react";

export function VerifyEmailForm({ user }: { user: User }) {
  const [isSignout, setIsSignout] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(60);
  const [isResendCode, setIsResendCode] = useState<boolean>(false);
  const [isStopTimer, setIsStopTimer] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
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
    try {
      setIsResendCode(true);
      startTimer();
    } finally {
      setIsResendCode(false);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const onSignoutUSer = async () => {
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
                    name="email"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Verification code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g V3RIFY9"
                            {...field}
                            disabled={isSignout || isResendCode}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-1.5">
                    <Button
                      type="submit"
                      disabled={isSignout || isResendCode}
                      className="w-full cursor-pointer"
                    >
                      Verify code
                    </Button>
                    <Button
                      type="button"
                      className="w-full cursor-pointer"
                      variant="outline"
                      disabled={
                        isSignout ||
                        isResendCode ||
                        (timeElapsed > 0 && isStopTimer)
                      }
                      onClick={() => onResendCode()}
                    >
                      {isResendCode ? (
                        <Loader className="animate-spin size-5" />
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
        onClick={() => onSignoutUSer()}
        type="button"
        variant="link"
        className="cursor-pointer z-10 gap-1.5"
        disabled={isSignout || isResendCode}
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
