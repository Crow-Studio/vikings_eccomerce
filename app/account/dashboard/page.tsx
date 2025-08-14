import DashboardStats from "@/components/account/dashboard/DashboardStats";
import { globalGETRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { getDashboardStats } from "@/lib/stats";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  if (!(await globalGETRateLimit())) {
    return "Too many requests";
  }

  const { user } = await getCurrentSession();

  if (user === null) {
    return redirect("/auth/signin");
  }

  if (!user.email_verified) {
    return redirect("/auth/verify-email");
  }

  const stats = await getDashboardStats()

  return (
    <div>
      <DashboardStats stats={stats} />
    </div>
  );
}
