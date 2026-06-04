import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryShowcaseItem } from "@/lib/site";

interface CategoryCardProps {
  item: CategoryShowcaseItem;
}

export function CategoryCard({ item }: CategoryCardProps) {
  return (
    <Card className="overflow-hidden bg-white">
      <div className={`relative h-48 bg-gradient-to-br ${item.accent}`}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain px-6 py-4"
        />
      </div>
      <CardHeader>
        <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
          {item.eyebrow}
        </p>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href={`/#${item.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-[#8B5E3C]"
        >
          Explore collection
          <ArrowUpRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
