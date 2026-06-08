"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2">
      {adminNavItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-[20px] px-4 py-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-[#111111] text-white"
                : "bg-white text-muted-foreground hover:bg-[#f6efe6] hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
