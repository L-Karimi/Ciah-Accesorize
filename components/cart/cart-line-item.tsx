"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { removeProductFromCart, updateCartItemQuantity } from "@/lib/actions/cart";
import type { CartLineItem as CartLineItemType } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CartLineItemProps {
  item: CartLineItemType;
  compact?: boolean;
}

export function CartLineItem({ item, compact = false }: CartLineItemProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleQuantityChange = (nextQuantity: number) => {
    startTransition(async () => {
      const result = await updateCartItemQuantity(item.productSlug, nextQuantity);

      if (!result.success) {
        setMessage(result.error ?? "We could not update your cart.");
        return;
      }

      setMessage(null);
      router.refresh();
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeProductFromCart(item.productSlug);

      if (!result.success) {
        setMessage(result.error ?? "We could not update your cart.");
        return;
      }

      setMessage(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-3 rounded-[28px] border border-border/70 bg-white p-4 shadow-[0_16px_50px_rgba(17,17,17,0.05)]">
      <div className="flex gap-4">
        <Link
          href={`/products/${item.productSlug}`}
          className={cn(
            "relative overflow-hidden rounded-[22px] bg-gradient-to-br",
            item.accent,
            compact ? "h-24 w-24 min-w-24" : "h-28 w-28 min-w-28",
          )}
        >
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            className="object-contain p-3"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8B5E3C]">
                {item.category}
              </p>
              <Link
                href={`/products/${item.productSlug}`}
                className="mt-2 block truncate text-base font-semibold text-foreground transition-colors hover:text-[#8B5E3C]"
              >
                {item.name}
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.material} · {item.color} · {item.size}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">Unit price</p>
              <p className="mt-1 font-semibold text-foreground">
                KES {item.unitPrice.toLocaleString()}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "mt-4 flex flex-wrap items-center justify-between gap-3",
              compact ? "items-end" : undefined,
            )}
          >
            <div className="inline-flex items-center rounded-full border border-border/80 bg-[#fbf6f0] p-1">
              <button
                type="button"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isPending}
                className="inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-white disabled:opacity-50"
                aria-label={`Decrease quantity for ${item.name}`}
              >
                <Minus className="size-4" />
              </button>
              <span className="min-w-10 text-center text-sm font-semibold">{item.quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isPending || item.quantity >= item.stock}
                className="inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-white disabled:opacity-50"
                aria-label={`Increase quantity for ${item.name}`}
              >
                <Plus className="size-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-foreground">
                KES {item.lineTotal.toLocaleString()}
              </p>
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-full px-3"
                onClick={handleRemove}
                disabled={isPending}
              >
                <Trash2 className="size-4" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      </div>

      {message ? <p className="text-sm text-red-700">{message}</p> : null}
    </div>
  );
}
