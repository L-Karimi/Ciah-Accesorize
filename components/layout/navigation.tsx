import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/site";

interface NavigationProps {
  items: NavItem[];
  vertical?: boolean;
  className?: string;
  linkClassName?: string;
}

export function Navigation({
  items,
  vertical = false,
  className,
  linkClassName,
}: NavigationProps) {
  return (
    <nav
      className={cn(
        "flex items-center gap-1",
        vertical ? "flex-col items-start gap-3" : "flex-row",
        className,
      )}
    >
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white hover:text-foreground",
            linkClassName,
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
