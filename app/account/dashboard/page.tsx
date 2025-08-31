import DashboardStats from "@/components/account/dashboard/DashboardStats";
import { SalesOvertime } from "@/components/account/dashboard/SalesOvertime";
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
    return redirect("/auth/admin/signin");
  }
  if (!user.email_verified) {
    return redirect("/auth/admin/verify-email");
  }
  const stats = await getDashboardStats();
  return (
    <div className="space-y-5">
      <DashboardStats stats={stats} />
      <SalesOvertime
        thisMonthData={stats.thisMonthData}
        lastMonthData={stats.lastMonthData}
      />
      <div className="grid gap-6"></div>
    </div>
  );
}
