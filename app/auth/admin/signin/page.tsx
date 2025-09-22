import { SigninForm } from "@/components/auth/SigninForm";
import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
export default async function SigninPage() {
  const { user } = await getCurrentSession();
  if (user) {
    return redirect("/account/dashboard");
  }
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
