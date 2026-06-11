import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock3, Receipt, Smartphone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentStatusActions } from "@/components/checkout/payment-status-actions";
import { requireAuth } from "@/lib/auth-guards";
import { getMpesaMaxRetries } from "@/lib/mpesa";
import { formatOrderStatus, formatPaymentStatus } from "@/lib/orders";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Payment Status | Ciah Accessorize",
  description: "Track your Ciah Accessorize M-Pesa payment and order confirmation status.",
};

interface CheckoutSuccessPageProps {
  searchParams?: Promise<{
    orderId?: string | string[];
  }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const session = await requireAuth("/checkout/success");
  const params = searchParams ? await searchParams : undefined;
  const orderId = typeof params?.orderId === "string" ? params.orderId : undefined;
  const order = orderId
    ? await prisma.order.findFirst({
        where: {
          id: orderId,
          userId: session.user.id,
        },
        select: {
          id: true,
          status: true,
          total: true,
          paymentStatus: true,
          createdAt: true,
          payment: {
            select: {
              status: true,
              phoneNumber: true,
              checkoutRequestId: true,
              mpesaReceiptNumber: true,
              transactionStatus: true,
              resultDescription: true,
              retryCount: true,
            },
          },
          notifications: {
            where: {
              type: "ORDER_STATUS",
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 3,
            select: {
              id: true,
              title: true,
              message: true,
              createdAt: true,
            },
          },
        },
      })
    : null;
  const payment = order?.payment;
  const paymentStatusLabel = payment?.status ?? order?.paymentStatus ?? "PENDING";
  const transactionStatusLabel = payment?.transactionStatus ?? "PENDING";
  const canRetry =
    Boolean(order?.id) &&
    paymentStatusLabel !== "COMPLETED" &&
    (payment?.retryCount ?? 0) < getMpesaMaxRetries();
  const canVerify = Boolean(order?.id) && paymentStatusLabel !== "COMPLETED";
  const maxRetries = getMpesaMaxRetries();
  const statusHeadline =
    order?.status === "PENDING"
      ? "Your order is waiting on M-Pesa confirmation."
      : order?.status === "PAID"
        ? "Your payment is confirmed."
        : order?.status === "PROCESSING"
          ? "Your order is being prepared."
          : order?.status === "SHIPPED"
            ? "Your order is on the way."
            : order?.status === "DELIVERED"
              ? "Your order has been delivered."
              : "Your order has been cancelled.";
  const statusDescription =
    order?.status === "PENDING"
      ? "We created your order, triggered the Safaricom STK push, and will confirm the order automatically when payment clears."
      : order?.status === "PAID"
        ? "Payment has cleared successfully and your order is now queued for fulfillment."
        : order?.status === "PROCESSING"
          ? "Our team is currently packing and preparing your items for dispatch."
          : order?.status === "SHIPPED"
            ? "Your items have left our store and are moving through delivery."
            : order?.status === "DELIVERED"
              ? "Delivery is complete. Thank you for shopping with Ciah Accessorize."
              : "This order has been cancelled. Contact support if you still need assistance.";

  if (!orderId || !order) {
    return (
      <main className="flex min-h-screen bg-[#f6f1ea] px-4 py-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Order not found</CardTitle>
              <CardDescription>
                We could not find that checkout session for your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Link href="/cart" className={buttonVariants({ className: "h-11 px-5" })}>
                Back to cart
              </Link>
              <Link
                href="/account"
                className={buttonVariants({
                  variant: "outline",
                  className: "h-11 px-5",
                })}
              >
                View account
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-[#f6f1ea] px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <section className="rounded-[32px] bg-[#111111] px-8 py-10 text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
          <p className="text-sm uppercase tracking-[0.28em] text-[#d6c2a6]">
            Payment Status
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            {statusHeadline}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
            {statusDescription}
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="bg-white">
            <CardHeader>
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-[#eef9f0] text-emerald-600">
                <CheckCircle2 className="size-5" />
              </div>
              <CardTitle className="mt-4">Order saved</CardTitle>
              <CardDescription>
                Reference: {order.id}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-[#fff4e6] text-[#8B5E3C]">
                <Clock3 className="size-5" />
              </div>
              <CardTitle className="mt-4">Payment lifecycle</CardTitle>
              <CardDescription>
                Order status: {formatOrderStatus(order.status)}. Payment status:{" "}
                {formatPaymentStatus(paymentStatusLabel)}.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Safaricom M-Pesa details</CardTitle>
            <CardDescription>
              Use the tools below if the prompt has not arrived yet or if you want a fresh status check.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3 pt-6">
            <div className="grid w-full gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-border/70 bg-[#fcfaf7] p-5">
                <div className="flex items-center gap-3">
                  <div className="inline-flex size-10 items-center justify-center rounded-full bg-[#f3ece3] text-[#8B5E3C]">
                    <Smartphone className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">STK Push</p>
                    <p className="text-sm text-muted-foreground">
                      {payment?.phoneNumber ?? "Phone number unavailable"}
                    </p>
                  </div>
                </div>
                <dl className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <div>
                    <dt className="font-medium text-foreground">CheckoutRequestID</dt>
                    <dd className="break-all">{payment?.checkoutRequestId ?? "Not available yet"}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-foreground">Transaction status</dt>
                    <dd>{transactionStatusLabel}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-[24px] border border-border/70 bg-[#fcfaf7] p-5">
                <div className="flex items-center gap-3">
                  <div className="inline-flex size-10 items-center justify-center rounded-full bg-[#eef4ff] text-sky-700">
                    <Receipt className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Verification</p>
                    <p className="text-sm text-muted-foreground">
                      Receipt and callback information
                    </p>
                  </div>
                </div>
                <dl className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <div>
                    <dt className="font-medium text-foreground">M-Pesa receipt</dt>
                    <dd>{payment?.mpesaReceiptNumber ?? "Waiting for callback"}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-foreground">Retry attempts</dt>
                    <dd>
                      {payment?.retryCount ?? 0} of {maxRetries}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {payment?.resultDescription ? (
              <div className="w-full rounded-[24px] border border-border/70 bg-[#fcfaf7] px-5 py-4 text-sm text-muted-foreground">
                {payment.resultDescription}
              </div>
            ) : null}

            <div className="w-full">
              <PaymentStatusActions
                orderId={order.id}
                canRetry={canRetry}
                canVerify={canVerify}
              />
            </div>

            <Link href="/products" className={buttonVariants({ className: "h-11 px-5" })}>
              Continue shopping
            </Link>
            <Link
              href="/account"
              className={buttonVariants({
                variant: "outline",
                className: "h-11 px-5",
              })}
            >
              Back to account
            </Link>
          </CardContent>
        </Card>

        {order.notifications.length > 0 ? (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Latest order updates</CardTitle>
              <CardDescription>
                We will keep adding updates here as the order moves through fulfillment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-[20px] border border-border/70 bg-[#fcfaf7] px-4 py-4"
                >
                  <p className="font-medium text-foreground">{notification.title}</p>
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
            </CardContent>
          </Card>
        ) : null}

        <Card className="bg-white">
          <CardContent className="pt-6 text-sm leading-7 text-muted-foreground">
            Total: KES {order.total.toLocaleString()}. Created on{" "}
            {order.createdAt.toLocaleString("en-KE", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
            . Your order will move to <span className="font-medium text-foreground">Paid</span>{" "}
            automatically after successful payment verification, then continue through processing and delivery.
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
