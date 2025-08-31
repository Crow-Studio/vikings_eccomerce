import NewCustomerButton from "@/components/account/customer/new-customer-button";
import CustomersDataTable from "@/components/account/customer/tables/all/Customers";
import { db } from "@/database";
import { globalGETRateLimit } from "@/lib/server/request";
import { getCurrentSession } from "@/lib/server/session";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function CustomersPage() {
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

  const customersData = await db.query.customer.findMany({
    with: {
      orders: true,
    },
    orderBy: (table) => desc(table.updated_at),
  });

  const customers = customersData.map((customer) => ({
    id: customer.id,
    full_name: customer.full_name,
    email: customer.email,
    phone: customer.phone,
    avatar: customer.avatar,
    address: customer.address,
    city: customer.city,
    country: customer.country,
    total_orders: customer.orders.length,
    created_at: customer.created_at.toISOString(),
    updated_at: customer.updated_at?.toISOString() || null,
  }));

  return (
    <div className="grid gap-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">Customers</h2>
          <p className="text-sm text-muted-foreground">
            Overview of all your customers
          </p>
        </div>
        <NewCustomerButton />
      </div>
      <CustomersDataTable customers={customers} />
    </div>
  );
}
