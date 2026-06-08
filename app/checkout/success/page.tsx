import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth-guards";

export const metadata: Metadata = {
  title: "Order Created | Ciah Accessorize",
  description: "Your Ciah Accessorize order has been created and is waiting for payment.",
};

interface CheckoutSuccessPageProps {
  searchParams?: Promise<{
    orderId?: string | string[];
  }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  await requireAuth("/checkout/success");
  const params = searchParams ? await searchParams : undefined;
  const orderId = typeof params?.orderId === "string" ? params.orderId : undefined;

  return (
    <main className="flex min-h-screen bg-[#f6f1ea] px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <section className="rounded-[32px] bg-[#111111] px-8 py-10 text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
          <p className="text-sm uppercase tracking-[0.28em] text-[#d6c2a6]">
            Checkout Complete
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Your pending order has been created.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
            We captured your customer information, delivery address, order items,
            and a pending M-Pesa payment record. Payment collection comes in the next
            milestone.
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
                {orderId ? `Reference: ${orderId}` : "Your order reference is now available."}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-[#fff4e6] text-[#8B5E3C]">
                <Clock3 className="size-5" />
              </div>
              <CardTitle className="mt-4">Payment still pending</CardTitle>
              <CardDescription>
                The order is ready for M-Pesa activation once the payment milestone is
                implemented.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <Card className="bg-white">
          <CardContent className="flex flex-wrap gap-3 pt-6">
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
      </div>
    </main>
  );
}
