import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { CategoryCard } from "@/components/storefront/category-card";
import { ContactForm } from "@/components/storefront/contact-form";
import { ProductCard } from "@/components/storefront/product-card";
import { ShowroomModal } from "@/components/storefront/showroom-modal";
import { SearchBar } from "@/components/layout/search-bar";
import { categoryShowcase, featuredProducts, siteConfig } from "@/lib/site";
import Link from "next/link";

const PRODUCTS_PER_PAGE = 3;

interface HomePageProps {
  searchParams?: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = searchParams ? await searchParams : undefined;
  const query = params?.q?.trim().toLowerCase() ?? "";
  const requestedPage = Number(params?.page ?? "1");
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const filteredProducts = featuredProducts.filter((product) => {
    if (!query) {
      return true;
    }

    return [product.name, product.category, product.material, product.color]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * PRODUCTS_PER_PAGE,
    safePage * PRODUCTS_PER_PAGE,
  );

  const hrefBuilder = (page: number) => {
    const next = new URLSearchParams();

    if (query) {
      next.set("q", query);
    }

    if (page > 1) {
      next.set("page", String(page));
    }

    const suffix = next.toString();
    return suffix ? `/?${suffix}` : "/";
  };

  return (
    <main className="pb-20">
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { label: "Storefront" },
          ]}
        />
      </section>

      <section className="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[40px] bg-[#111111] text-white shadow-[0_32px_120px_rgba(0,0,0,0.18)]">
          <div className="grid gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[1.2fr,0.8fr] lg:px-12 lg:py-14">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[#d6c2a6]">
                Public Storefront
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                A reusable storefront system for premium bags in Kenya.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">
                {siteConfig.name} now has a shared UI foundation for navigation,
                search, cart interactions, forms, cards, breadcrumbs, pagination,
                and modal-driven moments.
              </p>
              <div className="mt-8 max-w-xl">
                <SearchBar defaultValue={query} />
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/#featured"
                  className={buttonVariants({ className: "h-12 rounded-full px-5" })}
                >
                  Shop featured
                </Link>
                <ShowroomModal />
              </div>
            </div>

            <div className="grid gap-4 self-end sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
                <ShieldCheck className="size-5 text-[#d6c2a6]" />
                <h2 className="mt-4 text-lg font-semibold">Premium trust cues</h2>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Reusable cards and buttons for polished reassurance and conversion.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
                <Truck className="size-5 text-[#d6c2a6]" />
                <h2 className="mt-4 text-lg font-semibold">Cart-first UX</h2>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Drawer patterns are in place for delivery-aware shopping flow.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
                <Sparkles className="size-5 text-[#d6c2a6]" />
                <h2 className="mt-4 text-lg font-semibold">Luxury brand tone</h2>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Warm neutrals, deep contrast, and soft geometry tuned to the brand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="collections"
        className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#8B5E3C]">
              Category Cards
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Collections with a premium visual language
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            These cards are reusable across the homepage, category listings, and
            future collection landing pages.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {categoryShowcase.map((item) => (
            <CategoryCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      <section
        id="featured"
        className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#8B5E3C]">
              Product Cards
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Featured picks built on reusable cards, buttons, and pagination
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            Search is already wired to this showcase, so the same system can
            support product listing pages in the next milestone.
          </p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {paginatedProducts.map((item) => (
            <ProductCard key={item.slug} item={item} />
          ))}
        </div>
        {paginatedProducts.length === 0 ? (
          <Card className="mt-8 bg-white">
            <CardHeader>
              <CardTitle>No products matched your search</CardTitle>
              <CardDescription>
                Try another bag name, material, or color to broaden the result set.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}
        <div className="mt-8">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            hrefBuilder={hrefBuilder}
          />
        </div>
      </section>

      <section
        id="contact"
        className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
          <Card className="overflow-hidden bg-white">
            <CardHeader>
              <p className="text-sm uppercase tracking-[0.24em] text-[#8B5E3C]">
                Forms
              </p>
              <CardTitle className="mt-3 text-3xl">
                Inquiry form primitives ready for storefront use
              </CardTitle>
              <CardDescription className="text-base">
                The shared form field, input, textarea, and button styles now give
                the app a consistent conversion surface.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          <div className="grid gap-5">
            <Card className="bg-white">
              <CardHeader>
                <p className="text-sm uppercase tracking-[0.24em] text-[#8B5E3C]">
                  Header + Footer
                </p>
                <CardTitle>Reusable shell components</CardTitle>
                <CardDescription>
                  The branded header and footer now frame every route with
                  consistent navigation, cart access, and search.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/account"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-[#8B5E3C]"
                >
                  View the shell on account pages
                  <ArrowRight className="size-4" />
                </Link>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardHeader>
                <p className="text-sm uppercase tracking-[0.24em] text-[#8B5E3C]">
                  Mobile Menu + Modal
                </p>
                <CardTitle>Interactive storefront patterns</CardTitle>
                <CardDescription>
                  Compact navigation, cart drawer, and modal moments are all ready
                  to extend into products, checkout, and campaigns.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-[#fbf6f0] p-4">
                  <p className="font-medium text-foreground">Mobile-first menu</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Accessible overlay navigation for smaller screens.
                  </p>
                </div>
                <div className="rounded-[24px] bg-[#fbf6f0] p-4">
                  <p className="font-medium text-foreground">Reusable modal</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Ideal for quick views, promotions, and appointment booking.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
