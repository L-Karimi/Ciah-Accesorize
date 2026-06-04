import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { ProductCard } from "@/components/storefront/product-card";
import { CatalogFilters } from "@/components/storefront/catalog-filters";
import { CatalogResultsSummary } from "@/components/storefront/catalog-results-summary";
import { getServerAuthSession } from "@/lib/auth";
import {
  buildCatalogHref,
  catalogProducts,
  filterCatalogProducts,
  parseCatalogFilters,
} from "@/lib/catalog";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { getCurrentUserWishlistSlugs } from "@/lib/wishlist";

const PRODUCTS_PER_PAGE = 9;

export const metadata: Metadata = {
  title: "Product Catalog",
  description:
    "Browse handbags, tote bags, office bags, mini bags, sling bags, and travel bags with refined ecommerce filters from Ciah Accessorize.",
  keywords: [
    ...siteConfig.keywords,
    "Product Catalog",
    "Tote Bags Kenya",
    "Office Bags Kenya",
    "Travel Bags Kenya",
  ],
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: `${siteConfig.name} | Product Catalog`,
    description:
      "Filter premium bags by category, gender, material, color, price, and sorting on the Ciah Accessorize catalog.",
    url: `${siteConfig.url}/products`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Product Catalog`,
    description:
      "Explore a professional ecommerce catalog of handbags, office bags, mini bags, and travel bags.",
  },
};

interface ProductsPageProps {
  searchParams?: Promise<{
    q?: string | string[];
    category?: string | string[];
    gender?: string | string[];
    material?: string | string[];
    color?: string | string[];
    price?: string | string[];
    sort?: string | string[];
    page?: string | string[];
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const session = await getServerAuthSession();
  const wishlistSlugs = new Set(await getCurrentUserWishlistSlugs());
  const isAuthenticated = Boolean(session?.user);
  const filters = parseCatalogFilters(params);
  const filteredProducts = filterCatalogProducts(catalogProducts, filters);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const currentPage = Math.min(filters.page, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  const hrefBuilder = (page: number) => buildCatalogHref(filters, page);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Ciah Accessorize Product Catalog",
        url: `${siteConfig.url}/products`,
        description:
          "Professional ecommerce catalog with search, sorting, and multi-filter product discovery.",
      },
      {
        "@type": "ItemList",
        name: "Catalog Products",
        itemListElement: filteredProducts.slice(0, 12).map((product, index) => ({
          "@type": "Product",
          position: index + 1,
          name: product.name,
          category: product.category,
          image: `${siteConfig.url}${product.image}`,
          color: product.color,
          material: product.material,
          offers: {
            "@type": "Offer",
            priceCurrency: "KES",
            price: product.price,
          },
        })),
      },
    ],
  };

  return (
    <main className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { label: "Products" },
          ]}
        />
      </section>

      <section className="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[38px] bg-[#111111] text-white shadow-[0_32px_120px_rgba(0,0,0,0.18)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[0.95fr,0.55fr] lg:px-12 lg:py-12">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#d6c2a6]">
                Professional Ecommerce Catalog
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Filter premium bags by style, function, finish, and price.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-white/72">
                Discover ladies bags, gents bags, handbags, tote bags, sling bags,
                mini bags, office bags, and travel bags using a catalog experience
                tailored for fast product discovery.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-[#d6c2a6]">
                  Search + Filter
                </p>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  Category, gender, material, color, price range, and smart sorting
                  are all available in one professional catalog flow.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-[#d6c2a6]">
                  SEO Friendly
                </p>
                <p className="mt-3 text-sm leading-6 text-white/72">
                  URL-based discovery keeps search results shareable and crawlable
                  for better catalog indexing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[320px,minmax(0,1fr)]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <CatalogFilters filters={filters} />
          </div>

          <div className="space-y-6">
            <CatalogResultsSummary
              totalResults={filteredProducts.length}
              visibleCount={paginatedProducts.length}
              currentPage={currentPage}
              totalPages={totalPages}
              filters={filters}
            />

            {paginatedProducts.length === 0 ? (
              <Card className="bg-white">
                <CardHeader>
                  <div className="inline-flex size-12 items-center justify-center rounded-full bg-[#f5ede3] text-[#8B5E3C]">
                    <SearchX className="size-5" />
                  </div>
                  <CardTitle className="mt-4">No products match these filters</CardTitle>
                  <CardDescription>
                    Try broadening the search or clearing some filters to see more
                    handbags, office bags, totes, and travel pieces.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href="/products"
                    className={buttonVariants({ className: "h-11 rounded-full px-5" })}
                  >
                    Clear all filters
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      item={product}
                      wishlisted={wishlistSlugs.has(product.slug)}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  hrefBuilder={hrefBuilder}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
