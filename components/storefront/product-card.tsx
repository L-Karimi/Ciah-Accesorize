import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductShowcaseItem } from "@/lib/site";

interface ProductCardProps {
  item: ProductShowcaseItem;
}

export function ProductCard({ item }: ProductCardProps) {
  return (
    <Card className="overflow-hidden border-border/80 bg-white">
      <Link href={`/products/${item.slug}`} className={`relative block h-60 bg-gradient-to-br ${item.accent}`}>
        <span className="absolute left-4 top-4 z-10 rounded-full bg-white/88 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]">
          {item.badge}
        </span>
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain px-6 py-4"
        />
      </Link>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
              {item.category}
            </p>
            <CardTitle className="mt-2">
              <Link href={`/products/${item.slug}`} className="transition-colors hover:text-[#8B5E3C]">
                {item.name}
              </Link>
            </CardTitle>
          </div>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-white"
            aria-label={`Save ${item.name} to wishlist`}
          >
            <Heart className="size-4" />
          </button>
        </div>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          <p>Material</p>
          <p className="mt-1 font-medium text-foreground">{item.material}</p>
        </div>
        <div>
          <p>Color</p>
          <p className="mt-1 font-medium text-foreground">{item.color}</p>
        </div>
        <div className="text-right">
          <p>Price</p>
          <p className="mt-1 font-semibold text-foreground">
            KES {item.price.toLocaleString()}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="h-11 flex-1 rounded-full">Add to cart</Button>
        <Link
          href={`/products/${item.slug}`}
          className={buttonVariants({
            variant: "outline",
            className: "h-11 rounded-full px-4",
          })}
        >
          View details
        </Link>
      </CardFooter>
    </Card>
  );
}
