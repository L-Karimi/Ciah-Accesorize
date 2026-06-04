"use client";

import { useMemo, useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sampleCartItems } from "@/lib/site";

export function CartDrawer() {
  const [open, setOpen] = useState(false);

  const subtotal = useMemo(
    () =>
      sampleCartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    [],
  );

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
          {sampleCartItems.length}
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#8B5E3C]">
                  Cart Drawer
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Your selection</h2>
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

            <div className="mt-8 flex-1 space-y-4 overflow-auto">
              {sampleCartItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-4 rounded-[24px] border border-border/70 bg-white p-4"
                >
                  <div
                    className={`h-20 w-18 min-w-18 rounded-[20px] bg-gradient-to-br ${item.accent}`}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4 rounded-[28px] border border-border/80 bg-white p-5">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">
                  KES {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Delivery estimate</span>
                <span>Free over KES 5,000</span>
              </div>
              <Button className="h-11 w-full rounded-full">Proceed to checkout</Button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
