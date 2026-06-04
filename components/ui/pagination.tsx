import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hrefBuilder: (page: number) => string;
}

export function Pagination({
  currentPage,
  totalPages,
  hrefBuilder,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        href={hrefBuilder(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={cn(
          buttonVariants({ variant: "outline", className: "gap-2 rounded-full px-4" }),
          currentPage === 1 ? "pointer-events-none opacity-50" : undefined,
        )}
      >
        <ChevronLeft className="size-4" />
        Previous
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={hrefBuilder(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={buttonVariants({
            variant: page === currentPage ? "default" : "outline",
            className: "rounded-full px-4",
          })}
        >
          {page}
        </Link>
      ))}
      <Link
        href={hrefBuilder(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={cn(
          buttonVariants({ variant: "outline", className: "gap-2 rounded-full px-4" }),
          currentPage === totalPages ? "pointer-events-none opacity-50" : undefined,
        )}
      >
        Next
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}
