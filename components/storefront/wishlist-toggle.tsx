"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { addProductToWishlist, removeProductFromWishlist } from "@/lib/actions/wishlist";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WishlistToggleProps {
  productSlug: string;
  productName: string;
  initialWishlisted?: boolean;
  isAuthenticated?: boolean;
  compact?: boolean;
}

export function WishlistToggle({
  productSlug,
  productName,
  initialWishlisted = false,
  isAuthenticated = false,
  compact = false,
}: WishlistToggleProps) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    startTransition(async () => {
      const action = wishlisted ? removeProductFromWishlist : addProductToWishlist;
      const result = await action(productSlug);

      if (result.requiresLogin) {
        router.push("/auth/login");
        return;
      }

      if (!result.success) {
        setMessage(result.error ?? "Wishlist update failed.");
        return;
      }

      setWishlisted((current) => !current);
      setMessage(result.message ?? null);
      router.refresh();
    });
  };

  return (
    <div className={cn("space-y-2", compact ? "w-auto" : "w-full")}>
      <Button
        type="button"
        variant="outline"
        className={cn(
          compact ? "size-10 rounded-full px-0" : "h-12 rounded-full px-5",
          wishlisted ? "border-[#8B5E3C] text-[#8B5E3C]" : undefined,
        )}
        disabled={isPending}
        onClick={handleClick}
        aria-label={`${wishlisted ? "Remove" : "Save"} ${productName} ${wishlisted ? "from" : "to"} wishlist`}
      >
        <Heart className={cn("size-4", wishlisted ? "fill-current" : undefined)} />
        {!compact ? (isPending ? "Updating..." : wishlisted ? "Saved" : "Save Product") : null}
      </Button>
      {!compact && message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
    </div>
  );
}
