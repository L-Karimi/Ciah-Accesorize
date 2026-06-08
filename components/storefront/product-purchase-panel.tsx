"use client";

import { useMemo, useState } from "react";
import { Check, Minus, Plus, Star } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import type { CatalogProduct, ColorFilter } from "@/lib/catalog";
import { WishlistToggle } from "@/components/storefront/wishlist-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductPurchasePanelProps {
  product: CatalogProduct;
  averageRating: number;
  wishlisted?: boolean;
  isAuthenticated?: boolean;
}

export function ProductPurchasePanel({
  product,
  averageRating,
  wishlisted = false,
  isAuthenticated = false,
}: ProductPurchasePanelProps) {
  const [selectedColor, setSelectedColor] = useState<ColorFilter>(product.color);
  const [selectedSize, setSelectedSize] = useState(product.variantSizes[0] ?? product.size);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  const stockLabel = useMemo(() => {
    if (product.stock <= 5) {
      return `Only ${product.stock} left in stock`;
    }

    return "Ready to ship";
  }, [product.stock]);

  return (
    <div className="rounded-[34px] border border-border/70 bg-white p-6 shadow-[0_24px_80px_rgba(17,17,17,0.05)] sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-[#f5ede3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]">
          {product.badge}
        </span>
        <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground">
          {product.category}
        </span>
      </div>

      <h1 className="mt-5 text-4xl font-semibold tracking-tight">{product.name}</h1>
      <p className="mt-4 text-base leading-8 text-muted-foreground">{product.description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 text-[#8B5E3C]">
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              className={cn(
                "size-4",
                index < Math.round(averageRating) ? "fill-current" : "fill-transparent",
              )}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {averageRating} rating from {product.reviews.length} review
          {product.reviews.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-6 flex items-end gap-3">
        <p className="text-3xl font-semibold text-foreground">
          KES {product.price.toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground">Inclusive of premium packaging</p>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8B5E3C]">
            Color Variants
          </h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {product.variantColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={cn(
                  buttonVariants({
                    variant: selectedColor === color ? "default" : "outline",
                    className: "h-11 rounded-full px-4",
                  }),
                )}
              >
                {selectedColor === color ? <Check className="size-4" /> : null}
                {color}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8B5E3C]">
            Size Variants
          </h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {product.variantSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={buttonVariants({
                  variant: selectedSize === size ? "default" : "outline",
                  className: "h-11 rounded-full px-4",
                })}
              >
                {selectedSize === size ? <Check className="size-4" /> : null}
                {size}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8B5E3C]">
            Quantity Selector
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-border/80 bg-[#fbf6f0] p-1">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-white"
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </button>
              <span className="min-w-10 text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((current) => Math.min(product.stock, current + 1))
                }
                className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-white"
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">{stockLabel}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <AddToCartButton
            productSlug={product.slug}
            productName={product.name}
            quantity={quantity}
            className="h-12 flex-1"
            label="Add to cart"
            pendingLabel="Adding..."
            onComplete={(result) => {
              if (!result.success) {
                setCartMessage({
                  tone: "error",
                  text: result.error ?? "We could not update your cart right now.",
                });
                return;
              }

              setCartMessage({
                tone: "success",
                text:
                  result.message ??
                  `Added ${quantity} ${product.name} to your cart.`,
              });
            }}
          />
          <WishlistToggle
            productSlug={product.slug}
            productName={product.name}
            initialWishlisted={wishlisted}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {cartMessage ? (
          <p
            className={cn(
              "rounded-[20px] px-4 py-3 text-sm",
              cartMessage.tone === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-red-200 bg-red-50 text-red-700",
            )}
          >
            {cartMessage.text}
          </p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[24px] bg-[#fbf6f0] p-4">
          <p className="text-sm uppercase tracking-[0.18em] text-[#8B5E3C]">Material</p>
          <p className="mt-2 font-medium text-foreground">{product.material}</p>
        </div>
        <div className="rounded-[24px] bg-[#fbf6f0] p-4">
          <p className="text-sm uppercase tracking-[0.18em] text-[#8B5E3C]">Gender</p>
          <p className="mt-2 font-medium text-foreground">{product.gender}</p>
        </div>
        <div className="rounded-[24px] bg-[#fbf6f0] p-4">
          <p className="text-sm uppercase tracking-[0.18em] text-[#8B5E3C]">Primary Size</p>
          <p className="mt-2 font-medium text-foreground">{product.size}</p>
        </div>
      </div>
    </div>
  );
}
