"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import type { CartSnapshot } from "@/lib/cart";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { Button, buttonVariants } from "@/components/ui/button";

interface CartDrawerProps {
  initialCart: CartSnapshot;
}

export function CartDrawer({ initialCart }: CartDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="relative h-11 rounded-full px-4"
        onClick={() => setOpen(true)}
      >
        <ShoppingBag className="size-4" />
        Cart
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#111111] text-xs text-white">
          {initialCart.summary.itemCount}
        </span>
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        >
          <aside
            className="ml-auto flex h-full w-full max-w-md flex-col bg-[#fffaf5] p-6 shadow-[0_18px_90px_rgba(0,0,0,0.24)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#8B5E3C]">
                  Cart Drawer
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Your selection</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {initialCart.summary.itemCount} item
                  {initialCart.summary.itemCount === 1 ? "" : "s"} ready for checkout.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-white"
                aria-label="Close cart drawer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-8 flex-1 overflow-auto">
              {initialCart.items.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-border/80 bg-white px-5 py-8 text-center">
                  <p className="text-lg font-semibold text-foreground">Your cart is empty</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Add handbags, tote bags, office bags, or travel pieces to review
                    them here.
                  </p>
                  <Link
                    href="/products"
                    onClick={() => setOpen(false)}
                    className={buttonVariants({
                      className: "mt-5 h-11 rounded-full px-5",
                    })}
                  >
                    Explore products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {initialCart.items.map((item) => (
                    <CartLineItem key={item.productSlug} item={item} compact />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 space-y-4 rounded-[28px] border border-border/80 bg-white p-5">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">
                  KES {initialCart.summary.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>
                  {initialCart.summary.shipping === 0
                    ? "Free"
                    : `KES ${initialCart.summary.shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total</span>
                <span className="font-semibold text-foreground">
                  KES {initialCart.summary.total.toLocaleString()}
                </span>
              </div>
              {initialCart.items.length > 0 ? (
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ className: "h-11 w-full rounded-full" })}
                >
                  Proceed to checkout
                </Link>
              ) : null}
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className={buttonVariants({
                  variant: initialCart.items.length > 0 ? "outline" : "default",
                  className: "h-11 w-full rounded-full",
                })}
              >
                View cart
              </Link>
              {!initialCart.isAuthenticated ? (
                <p className="text-xs leading-5 text-muted-foreground">
                  Shopping as a guest. Your cart will merge automatically after sign in.
                </p>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
