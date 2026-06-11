import { FlashBanner } from "@/components/admin/flash-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateOrderAction } from "@/lib/actions/admin";
import { getAdminOrdersData } from "@/lib/admin";
import { formatOrderStatus, formatPaymentStatus, orderStatusOptions } from "@/lib/orders";

interface AdminOrdersPageProps {
  searchParams?: Promise<{
    status?: string | string[];
    error?: string | string[];
  }>;
}

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const status = typeof params?.status === "string" ? params.status : undefined;
  const error = typeof params?.error === "string" ? params.error : undefined;
  const data = await getAdminOrdersData();

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-black/5 bg-white px-6 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.06)] sm:px-8">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8B5E3C]">Orders</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          Process orders and notify customers as progress changes.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          Updating an order status also keeps payment state aligned and creates a customer notification.
        </p>
      </section>

      <FlashBanner message={status} tone="success" />
      <FlashBanner message={error} tone="error" />
      <FlashBanner message={data.setupError ?? undefined} tone="warning" />

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Orders management</CardTitle>
          <CardDescription>
            Review fulfillment progress, payment state, and shipping readiness for each customer order.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders are available yet.</p>
          ) : (
            data.orders.map((order) => (
              <form
                key={order.id}
                action={updateOrderAction}
                className="rounded-[24px] border border-border/70 bg-[#fcfaf7] p-4"
              >
                <input type="hidden" name="orderId" value={order.id} />
                <div className="grid gap-4 xl:grid-cols-[1.4fr,0.8fr,auto] xl:items-center">
                  <div>
                    <p className="font-semibold text-foreground">{order.customerName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.customerEmail} · {order.itemCount} item
                      {order.itemCount === 1 ? "" : "s"} · KES {order.total.toLocaleString()}
                    </p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-[#8B5E3C]">
                      Current status: {formatOrderStatus(order.status)} · Payment:{" "}
                      {formatPaymentStatus(order.paymentStatus)}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">
                      {order.shippingAddress ?? "No shipping address captured yet."}
                    </p>
                  </div>
                  <select
                    name="status"
                    defaultValue={order.status}
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring"
                  >
                    {orderStatusOptions.map((value) => (
                      <option key={value} value={value}>
                        {formatOrderStatus(value)}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" className="h-11 rounded-full px-5">
                    Save and notify
                  </Button>
                </div>
              </form>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
