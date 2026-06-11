import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth-guards";
import { buttonVariants } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";
import { formatOrderStatus, formatPaymentStatus } from "@/lib/orders";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "My Account | Ciah Accessorize",
  description: "Manage your Ciah Accessorize account and orders.",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await requireAuth();
  const [orders, notifications] = await Promise.all([
    prisma.order.findMany({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      include: {
        items: {
          select: {
            quantity: true,
          },
        },
        payment: {
          select: {
            status: true,
            mpesaReceiptNumber: true,
          },
        },
      },
    }),
    prisma.notification.findMany({
      where: {
        userId: session.user.id,
        type: "ORDER_STATUS",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
      include: {
        order: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    }),
  ]);

  return (
    <main className="flex min-h-screen bg-[#f6f1ea] px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <section className="rounded-[32px] bg-[#111111] px-8 py-10 text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
          <p className="text-sm uppercase tracking-[0.28em] text-[#d6c2a6]">
            My Account
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Welcome back, {session.user.name ?? "there"}.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72">
            Track your recent orders, payment progress, and every notification we
            send when fulfillment status changes.
          </p>
          <div className="mt-6">
            <LogoutButton className="h-11 border-white/20 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white" />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[28px] border border-black/5 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
              Profile
            </p>
            <h2 className="mt-3 text-xl font-semibold text-foreground">
              Account details
            </h2>
            <dl className="mt-5 space-y-3 text-sm text-muted-foreground">
              <div>
                <dt className="font-medium text-foreground">Name</dt>
                <dd>{session.user.name ?? "Not set yet"}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Email</dt>
                <dd>{session.user.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Role</dt>
                <dd>{session.user.role}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[28px] border border-black/5 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">Orders</p>
            <h2 className="mt-3 text-xl font-semibold text-foreground">Recent order history</h2>
            {orders.length === 0 ? (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                You have not placed any orders yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-[20px] border border-border/70 bg-[#fcfaf7] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-foreground">{order.id.slice(0, 12)}</p>
                      <span className="rounded-full bg-[#efe3d3] px-3 py-1 text-xs font-medium text-[#6f492e]">
                        {formatOrderStatus(order.status)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {order.items.reduce((total, item) => total + item.quantity, 0)} item
                      {order.items.reduce((total, item) => total + item.quantity, 0) === 1 ? "" : "s"} ·
                      {" "}KES {order.total.toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Payment: {formatPaymentStatus(order.payment?.status ?? order.paymentStatus)}
                      {order.payment?.mpesaReceiptNumber
                        ? ` · Receipt ${order.payment.mpesaReceiptNumber}`
                        : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-[1.4fr,0.9fr]">
          <div className="rounded-[28px] border border-black/5 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
              Notifications
            </p>
            <h2 className="mt-3 text-xl font-semibold text-foreground">
              Order status updates
            </h2>
            {notifications.length === 0 ? (
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Status updates will appear here as soon as an order is created or changes stage.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="rounded-[20px] border border-border/70 bg-[#fcfaf7] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-foreground">{notification.title}</p>
                      {notification.order ? (
                        <span className="text-xs uppercase tracking-[0.18em] text-[#8B5E3C]">
                          {formatOrderStatus(notification.order.status)}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#8B5E3C]">
                      {notification.createdAt.toLocaleString("en-KE", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-black/5 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
              Next Steps
            </p>
            <h2 className="mt-3 text-xl font-semibold text-foreground">
              Continue shopping
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Browse the collection while we keep your order history and fulfillment updates in sync.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/" className={buttonVariants({ className: "h-11 px-5" })}>
                Return Home
              </Link>
              <Link
                href="/wishlist"
                className={buttonVariants({
                  variant: "outline",
                  className: "h-11 px-5",
                })}
              >
                View Wishlist
              </Link>
              {session.user.role === "ADMIN" ? (
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: "outline",
                    className: "h-11 px-5",
                  })}
                >
                  Open Dashboard
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
