import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, ShieldCheck } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth-guards";
import type { CheckoutFormDefaults } from "@/lib/checkout";
import { getCurrentCartSnapshot } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Checkout | Ciah Accessorize",
  description:
    "Complete your Ciah Accessorize checkout with customer details, delivery address, order summary, and live M-Pesa payment initiation.",
  keywords: [...siteConfig.keywords, "Checkout", "M-Pesa Checkout"],
  alternates: {
    canonical: "/checkout",
  },
  openGraph: {
    title: `${siteConfig.name} | Checkout`,
    description:
      "Review your order, confirm delivery details, and trigger your Ciah Accessorize M-Pesa checkout.",
    url: `${siteConfig.url}/checkout`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Checkout`,
    description:
      "Finalize your selected bags and accessories with delivery details and M-Pesa payment initiation.",
  },
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await requireAuth("/checkout");
  const cart = await getCurrentCartSnapshot();
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      email: true,
      phone: true,
      addresses: {
        where: {
          isDefault: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 1,
      },
    },
  });
  const defaultAddress = user?.addresses[0];
  const defaultValues: CheckoutFormDefaults = {
    name: user?.name ?? "",
    email: user?.email ?? session.user.email ?? "",
    phone: user?.phone ?? defaultAddress?.phone ?? "",
    county: defaultAddress?.county ?? "",
    deliveryAddress: defaultAddress?.street ?? "",
    notes: "",
  };

  return (
    <main className="pb-20">
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/cart", label: "Cart" },
            { label: "Checkout" },
          ]}
        />
      </section>

      <section className="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[38px] bg-[#111111] text-white shadow-[0_32px_120px_rgba(0,0,0,0.18)]">
          <div className="grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[0.95fr,0.5fr] lg:px-12 lg:py-12">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#d6c2a6]">
                Checkout
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Finalize delivery details and trigger your M-Pesa payment.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-white/72">
                We will save your customer information, delivery address, order
                summary, and immediately send a Safaricom STK push for payment.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Card className="border-white/10 bg-white/6 text-white shadow-none">
                <CardHeader>
                  <div className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-[#d6c2a6]">
                    <CreditCard className="size-5" />
                  </div>
                  <CardTitle className="mt-4 text-white">Live M-Pesa checkout</CardTitle>
                  <CardDescription className="text-white/68">
                    Your order stays pending until Safaricom confirms the STK payment.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-white/10 bg-white/6 text-white shadow-none">
                <CardHeader>
                  <div className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-[#d6c2a6]">
                    <ShieldCheck className="size-5" />
                  </div>
                  <CardTitle className="mt-4 text-white">Authenticated checkout</CardTitle>
                  <CardDescription className="text-white/68">
                    Signed in as {session.user.email}. Your cart is already linked to
                    your account.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {cart.items.length === 0 ? (
          <Card className="border-border/80 bg-white">
            <CardHeader>
              <CardTitle>Your cart is empty</CardTitle>
              <CardDescription>
                Add products to your cart before moving into checkout.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className={buttonVariants({ className: "h-11 rounded-full px-5" })}
                >
                  Explore products
                </Link>
                <Link
                  href="/cart"
                  className={buttonVariants({
                    variant: "outline",
                    className: "h-11 rounded-full px-5",
                  })}
                >
                  Back to cart
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <CheckoutForm cart={cart} defaultValues={defaultValues} />
        )}
      </section>
    </main>
  );
}
