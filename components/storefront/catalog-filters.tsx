import Link from "next/link";
import { Filter, RotateCcw } from "lucide-react";
import {
  catalogCategories,
  colorOptions,
  genderOptions,
  materialOptions,
  priceOptions,
  sortOptions,
  type CatalogFilters,
} from "@/lib/catalog";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface CatalogFiltersProps {
  filters: CatalogFilters;
}

interface FilterSectionProps {
  title: string;
  name: string;
  options: readonly string[];
  selected: string[];
}

function FilterSection({
  title,
  name,
  options,
  selected,
}: FilterSectionProps) {
  return (
    <div className="space-y-4 border-t border-border/70 pt-5 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8B5E3C]">
        {title}
      </h3>
      <div className="grid gap-3">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              name={name}
              value={option}
              defaultChecked={selected.includes(option)}
              className="size-4 rounded border-border text-primary focus:ring-[#8B5E3C]"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function CatalogFilters({ filters }: CatalogFiltersProps) {
  return (
    <Card className="bg-white">
      <CardHeader className="border-b border-border/70">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-10 items-center justify-center rounded-full bg-[#f5ede3] text-[#8B5E3C]">
              <Filter className="size-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Catalog Filters</CardTitle>
              <p className="text-sm text-muted-foreground">
                Narrow products by category, gender, material, color, and price.
              </p>
            </div>
          </div>
          <Link
            href="/products"
            className={buttonVariants({
              variant: "outline",
              className: "h-10 rounded-full px-4",
            })}
          >
            <RotateCcw className="size-4" />
            Reset
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <form action="/products" className="space-y-6 p-6">
          <div className="space-y-2">
            <label htmlFor="catalog-search" className="text-sm font-medium text-foreground">
              Search products
            </label>
            <Input
              id="catalog-search"
              name="q"
              defaultValue={filters.q}
              placeholder="Search by bag name, color, category..."
              className="h-12 rounded-[18px]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="space-y-2">
              <label htmlFor="catalog-sort" className="text-sm font-medium text-foreground">
                Sort
              </label>
              <select
                id="catalog-sort"
                name="sort"
                defaultValue={filters.sort}
                className="flex h-12 w-full rounded-[18px] border border-input bg-background px-4 text-sm text-foreground outline-none focus-visible:border-ring"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="catalog-price" className="text-sm font-medium text-foreground">
                Price range
              </label>
              <select
                id="catalog-price"
                name="price"
                defaultValue={filters.price ?? ""}
                className="flex h-12 w-full rounded-[18px] border border-input bg-background px-4 text-sm text-foreground outline-none focus-visible:border-ring"
              >
                <option value="">All price ranges</option>
                {priceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <FilterSection
            title="Categories"
            name="category"
            options={catalogCategories}
            selected={filters.categories}
          />
          <FilterSection
            title="Gender"
            name="gender"
            options={genderOptions}
            selected={filters.genders}
          />
          <FilterSection
            title="Material"
            name="material"
            options={materialOptions}
            selected={filters.materials}
          />
          <FilterSection
            title="Color"
            name="color"
            options={colorOptions}
            selected={filters.colors}
          />

          <button
            type="submit"
            className={buttonVariants({
              className: "h-12 w-full rounded-full px-5",
            })}
          >
            Apply filters
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
