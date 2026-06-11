import { FlashBanner } from "@/components/admin/flash-banner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminCustomersData } from "@/lib/admin";
import { formatOrderStatus } from "@/lib/orders";

interface AdminCustomersPageProps {
  searchParams?: Promise<{
    status?: string | string[];
    error?: string | string[];
  }>;
}

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({
  searchParams,
}: AdminCustomersPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const status = typeof params?.status === "string" ? params.status : undefined;
  const error = typeof params?.error === "string" ? params.error : undefined;
  const data = await getAdminCustomersData();

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-black/5 bg-white px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.06)] sm:px-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8B5E3C]">Customers</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          View customer profiles and recent order history.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          Customer management is focused on service visibility: who ordered, how much they spend, and what they last purchased.
        </p>
      </section>

      <FlashBanner message={status} tone="success" />
      <FlashBanner message={error} tone="error" />
      <FlashBanner message={data.setupError ?? undefined} tone="warning" />

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Customer management</CardTitle>
          <CardDescription>
            Review account growth and customer order summaries in one place.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-2">
          {data.customers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No customers are available yet.</p>
          ) : (
            data.customers.map((customer) => (
              <div
                key={customer.id}
                className="rounded-[24px] border border-border/70 bg-[#fcfaf7] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{customer.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{customer.email}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {customer.phone ?? "No phone on file"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm uppercase tracking-[0.18em] text-[#8B5E3C]">
                      Spend
                    </p>
                    <p className="mt-2 font-semibold text-foreground">
                      KES {customer.totalSpend.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[20px] bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#8B5E3C]">
                      Orders
                    </p>
                    <p className="mt-2 font-medium text-foreground">{customer.orderCount}</p>
                  </div>
                  <div className="rounded-[20px] bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#8B5E3C]">
                      Joined
                    </p>
                    <p className="mt-2 font-medium text-foreground">
                      {customer.createdAt.toLocaleDateString("en-KE")}
                    </p>
                  </div>
                  <div className="rounded-[20px] bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#8B5E3C]">
                      Last order
                    </p>
                    <p className="mt-2 font-medium text-foreground">
                      {customer.lastOrderDate
                        ? customer.lastOrderDate.toLocaleDateString("en-KE")
                        : "No orders"}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-foreground">Recent orders</p>
                  <div className="mt-3 space-y-2">
                    {customer.recentOrders.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No order history yet.
                      </p>
                    ) : (
                      customer.recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="rounded-[18px] border border-border/70 bg-white px-4 py-3 text-sm text-muted-foreground"
                        >
                          {order.id.slice(0, 12)} · {formatOrderStatus(order.status)} · KES{" "}
                          {order.total.toLocaleString()}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
