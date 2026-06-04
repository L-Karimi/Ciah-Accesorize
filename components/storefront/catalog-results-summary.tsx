import { SlidersHorizontal } from "lucide-react";
import type { CatalogFilters } from "@/lib/catalog";

interface CatalogResultsSummaryProps {
  totalResults: number;
  visibleCount: number;
  currentPage: number;
  totalPages: number;
  filters: CatalogFilters;
}

export function CatalogResultsSummary({
  totalResults,
  visibleCount,
  currentPage,
  totalPages,
  filters,
}: CatalogResultsSummaryProps) {
  const activeFilterCount =
    filters.categories.length +
    filters.genders.length +
    filters.materials.length +
    filters.colors.length +
    (filters.price ? 1 : 0);

  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-white p-5 shadow-[0_18px_60px_rgba(17,17,17,0.05)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
          Product Catalog
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          {totalResults.toLocaleString()} product{totalResults === 1 ? "" : "s"} found
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Showing {visibleCount} item{visibleCount === 1 ? "" : "s"} on page{" "}
          {currentPage} of {totalPages}.
        </p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-full bg-[#fbf6f0] px-4 py-2 text-sm text-muted-foreground">
        <SlidersHorizontal className="size-4 text-[#8B5E3C]" />
        {activeFilterCount} active filter{activeFilterCount === 1 ? "" : "s"}
      </div>
    </div>
  );
}
