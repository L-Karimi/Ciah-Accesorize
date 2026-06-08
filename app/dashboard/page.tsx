import Link from "next/link";
import { FlashBanner } from "@/components/admin/flash-banner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { getAdminOverviewData } from "@/lib/admin";

interface DashboardPageProps {
  searchParams?: Promise<{
    status?: string | string[];
    error?: string | string[];
  }>;
}

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const status = typeof params?.status === "string" ? params.status : undefined;
  const error = typeof params?.error === "string" ? params.error : undefined;
  const data = await getAdminOverviewData();

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-black/5 bg-white px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.06)] sm:px-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8B5E3C]">Overview</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          Monitor revenue, fulfillment, inventory health, and customers.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          This dashboard pulls the key store numbers into one place and links
          directly into the management modules for fast daily operations.
        </p>
      </section>

      <FlashBanner message={status} tone="success" />
      <FlashBanner message={error} tone="error" />
      <FlashBanner message={data.setupError ?? undefined} tone="warning" />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <Card key={metric.label} className="bg-white">
            <CardHeader>
              <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
                {metric.label}
              </p>
              <CardTitle className="text-3xl">{metric.value}</CardTitle>
              <CardDescription>{metric.helper}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr,0.9fr]">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>
              Review the latest order activity and jump into order management when needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No orders are available yet.
              </p>
            ) : (
              data.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-border/70 bg-[#fcfaf7] px-4 py-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.id.slice(0, 12)} · {order.status} · {order.paymentStatus}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">
                    KES {order.total.toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Low stock watch</CardTitle>
              <CardDescription>
                Products that should be reviewed for replenishment or publishing decisions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.lowStockProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No inventory alerts right now.</p>
              ) : (
                data.lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-[22px] border border-border/70 bg-[#fcfaf7] px-4 py-4"
                  >
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.categoryName} · {product.stock} left ·{" "}
                      {product.published ? "Published" : "Draft"}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Quick links</CardTitle>
              <CardDescription>
                Open the module you need without leaving the dashboard flow.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/products"
                className={buttonVariants({ className: "h-11 rounded-full px-5" })}
              >
                Manage products
              </Link>
              <Link
                href="/dashboard/orders"
                className={buttonVariants({
                  variant: "outline",
                  className: "h-11 rounded-full px-5",
                })}
              >
                Review orders
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>New customers</CardTitle>
          <CardDescription>
            Recent registrations and how quickly they are converting into orders.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.recentCustomers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No customer accounts have been created yet.
            </p>
          ) : (
            data.recentCustomers.map((customer) => (
              <div
                key={customer.id}
                className="rounded-[22px] border border-border/70 bg-[#fcfaf7] px-4 py-4"
              >
                <p className="font-medium text-foreground">{customer.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{customer.email}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {customer.orderCount} order{customer.orderCount === 1 ? "" : "s"}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
