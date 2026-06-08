"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { addProductToCart } from "@/lib/actions/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddToCartButtonResult {
  success: boolean;
  message?: string;
  error?: string;
}

interface AddToCartButtonProps {
  productSlug: string;
  productName: string;
  quantity?: number;
  className?: string;
  label?: string;
  pendingLabel?: string;
  onComplete?: (result: AddToCartButtonResult) => void;
}

export function AddToCartButton({
  productSlug,
  productName,
  quantity = 1,
  className,
  label = "Add to cart",
  pendingLabel = "Adding...",
  onComplete,
}: AddToCartButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await addProductToCart(productSlug, quantity);
      onComplete?.(result);

      if (!onComplete) {
        if (result.success) {
          toast.success(result.message ?? `${productName} added to your cart.`);
        } else {
          toast.error(result.error ?? "We could not update your cart right now.");
        }
      }

      if (result.success) {
        router.refresh();
      }
    });
  };

  return (
    <Button
      type="button"
      className={cn("h-11 rounded-full", className)}
      onClick={handleClick}
      disabled={isPending}
      aria-label={`Add ${productName} to cart`}
    >
      <ShoppingBag className="size-4" />
      {isPending ? pendingLabel : label}
    </Button>
  );
}
