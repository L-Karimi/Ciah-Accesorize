import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, Truck } from "lucide-react";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentCartSnapshot } from "@/lib/cart";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cart | Ciah Accessorize",
  description:
    "Review your Ciah Accessorize cart, update quantities, and confirm totals before checkout.",
  keywords: [...siteConfig.keywords, "Shopping Cart", "Cart"],
  alternates: {
    canonical: "/cart",
  },
  openGraph: {
    title: `${siteConfig.name} | Cart`,
    description:
      "Manage the bags and accessories in your cart before moving on to checkout.",
    url: `${siteConfig.url}/cart`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Cart`,
    description:
      "Review your selected handbags, tote bags, office bags, and travel styles.",
  },
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await getCurrentCartSnapshot();

  return (
    <main className="pb-20">
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { label: "Cart" },
          ]}
        />
      </section>

      <section className="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[38px] bg-[#111111] text-white shadow-[0_32px_120px_rgba(0,0,0,0.18)]">
          <div className="grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[0.95fr,0.5fr] lg:px-12 lg:py-12">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#d6c2a6]">
                Shopping Cart
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Review your selection before checkout.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-white/72">
                Update quantities, remove items, and keep an eye on totals while you
                curate your ideal Ciah Accessorize order.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className={buttonVariants({ className: "h-11 rounded-full px-5" })}
                >
                  Continue shopping
                </Link>
                {!cart.isAuthenticated ? (
                  <Link
                    href="/auth/login?callbackUrl=%2Fcart"
                    className={buttonVariants({
                      variant: "outline",
                      className:
                        "h-11 rounded-full border-white/15 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white",
                    })}
                  >
                    Sign in and merge cart
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Card className="border-white/10 bg-white/6 text-white shadow-none">
                <CardHeader>
                  <div className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-[#d6c2a6]">
                    <ShoppingBag className="size-5" />
                  </div>
                  <CardTitle className="mt-4 text-white">
                    {cart.summary.itemCount} item{cart.summary.itemCount === 1 ? "" : "s"}
                  </CardTitle>
                  <CardDescription className="text-white/68">
                    {cart.isAuthenticated
                      ? "Signed-in cart syncing with your account."
                      : "Guest cart active. We will merge it after sign in."}
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-white/10 bg-white/6 text-white shadow-none">
                <CardHeader>
                  <div className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-[#d6c2a6]">
                    <Truck className="size-5" />
                  </div>
                  <CardTitle className="mt-4 text-white">
                    {cart.summary.qualifiesForFreeShipping
                      ? "Free delivery unlocked"
                      : "Free delivery from KES 5,000"}
                  </CardTitle>
                  <CardDescription className="text-white/68">
                    {cart.summary.qualifiesForFreeShipping
                      ? "Your current subtotal already qualifies for complimentary delivery."
                      : `Add KES ${cart.summary.amountToFreeShipping.toLocaleString()} more to qualify.`}
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
                Add premium bags and accessories to your cart, then return here to
                review quantities and totals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/products"
                className={buttonVariants({ className: "h-11 rounded-full px-5" })}
              >
                Explore products
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),360px]">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <CartLineItem key={item.productSlug} item={item} />
              ))}
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <Card className="border-border/80 bg-white">
                <CardHeader>
                  <CardTitle>Order summary</CardTitle>
                  <CardDescription>
                    Totals update automatically as you change quantities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold text-foreground">
                      KES {cart.summary.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span className="font-semibold text-foreground">
                      {cart.summary.shipping === 0
                        ? "Free"
                        : `KES ${cart.summary.shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/70 pt-4 text-sm">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="text-lg font-semibold text-foreground">
                      KES {cart.summary.total.toLocaleString()}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    className={buttonVariants({
                      className: "h-11 w-full rounded-full",
                    })}
                  >
                    Proceed to checkout
                  </Link>
                  {!cart.isAuthenticated ? (
                    <p className="text-sm leading-6 text-muted-foreground">
                      Sign in when you are ready. Your guest cart will merge into your
                      account automatically.
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
