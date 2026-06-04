import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Camera, Quote, Star, TrendingUp } from "lucide-react";
import { SearchBar } from "@/components/layout/search-bar";
import { CategoryCard } from "@/components/storefront/category-card";
import { NewsletterForm } from "@/components/storefront/newsletter-form";
import { ProductCard } from "@/components/storefront/product-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { getServerAuthSession } from "@/lib/auth";
import {
  bestSellers,
  categoryShowcase,
  customerReviews,
  featuredProducts,
  heroHighlights,
  instagramFeed,
  newArrivals,
  siteConfig,
} from "@/lib/site";
import { getCurrentUserWishlistSlugs } from "@/lib/wishlist";

export const metadata: Metadata = {
  title: "Premium Bags Kenya",
  description:
    "Shop premium handbags, tote bags, office bags, mini bags, and travel bags in Kenya with the refined storefront of Ciah Accessorize.",
  keywords: siteConfig.keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.name} | Premium Bags Kenya`,
    description:
      "Elegant handbags, office bags, totes, and luxury carry essentials for modern Kenyan style.",
    url: siteConfig.url,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Premium Bags Kenya`,
    description:
      "Discover luxury bags and fashion accessories with a polished, modern Kenyan storefront.",
  },
};

interface HomePageProps {
  searchParams?: Promise<{
    q?: string;
  }>;
}

function matchesQuery(query: string, values: string[]) {
  if (!query) {
    return true;
  }

  return values.join(" ").toLowerCase().includes(query);
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = searchParams ? await searchParams : undefined;
  const query = params?.q?.trim().toLowerCase() ?? "";
  const session = await getServerAuthSession();
  const wishlistSlugs = new Set(await getCurrentUserWishlistSlugs());
  const isAuthenticated = Boolean(session?.user);

  const filteredFeatured = featuredProducts.filter((product) =>
    matchesQuery(query, [product.name, product.category, product.material, product.color]),
  );
  const filteredArrivals = newArrivals.filter((product) =>
    matchesQuery(query, [product.name, product.category, product.material, product.color]),
  );
  const filteredBestSellers = bestSellers.filter((product) =>
    matchesQuery(query, [product.name, product.category, product.material, product.color]),
  );
  const filteredCategories = categoryShowcase.filter((category) =>
    matchesQuery(query, [category.name, category.description, category.eyebrow]),
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
      },
      {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteConfig.url}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "ItemList",
        name: "Featured Bags",
        itemListElement: featuredProducts.map((product, index) => ({
          "@type": "Product",
          position: index + 1,
          name: product.name,
          category: product.category,
          image: `${siteConfig.url}${product.image}`,
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

      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[42px] border border-white/60 bg-[#111111] text-white shadow-[0_32px_120px_rgba(0,0,0,0.22)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.05fr,0.95fr] lg:px-12 lg:py-12">
            <div className="flex flex-col justify-center">
              <p className="text-sm uppercase tracking-[0.32em] text-[#d6c2a6]">
                Premium Bags Kenya
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Luxury carry pieces for workdays, weekends, and every elegant in-between.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/74">
                Discover handbags, tote bags, mini bags, office bags, and travel bags
                shaped with modern confidence and a warm luxury finish.
              </p>

              <div className="mt-8 max-w-xl">
                <SearchBar defaultValue={query} />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/#featured-products"
                  className={buttonVariants({ className: "h-12 rounded-full px-5" })}
                >
                  Shop featured
                </Link>
                <Link
                  href="/#new-arrivals"
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "h-12 rounded-full border-white/15 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white",
                  })}
                >
                  Explore new arrivals
                </Link>
              </div>

              <ul className="mt-8 grid gap-3 text-sm text-white/75 sm:grid-cols-3">
                {heroHighlights.map((item) => (
                  <li
                    key={item}
                    className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-4"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-[0.6fr,0.4fr]">
              <div className="relative min-h-[420px] overflow-hidden rounded-[34px] bg-[linear-gradient(180deg,#F7E9D8_0%,#E1C8AE_100%)]">
                <Image
                  src="/bags/hero-bag.svg"
                  alt="Ciah Accessorize luxury hero bag"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="grid gap-4">
                <Card className="border-white/10 bg-white/6 text-white shadow-none">
                  <CardHeader>
                    <p className="text-sm uppercase tracking-[0.24em] text-[#d6c2a6]">
                      New Season
                    </p>
                    <CardTitle className="text-white">Statement carry, softer palette</CardTitle>
                    <CardDescription className="text-white/68">
                      Inspired by premium global fashion houses with a local,
                      wearable point of view.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <div className="relative min-h-[200px] overflow-hidden rounded-[30px] border border-white/10 bg-white/5">
                  <Image
                    src="/bags/mini-bag.svg"
                    alt="Mini bag editorial image"
                    fill
                    className="object-contain p-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="featured-products"
        className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#8B5E3C]">
              Featured Products
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Signature silhouettes with premium finish
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            A curated edit built to feel elevated, polished, and easy to wear
            across office days, events, and weekend movement.
          </p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {filteredFeatured.map((item) => (
            <ProductCard
              key={item.slug}
              item={item}
              wishlisted={wishlistSlugs.has(item.slug)}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </section>

      <section
        id="new-arrivals"
        className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid gap-6 lg:grid-cols-[0.44fr,0.56fr]">
          <div className="overflow-hidden rounded-[36px] bg-[#f7efe5] p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.24em] text-[#8B5E3C]">
              New Arrivals
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Fresh additions with luxury softness and structured detail
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              This week&apos;s edit leans into neutral tones, sculpted silhouettes,
              and bags designed to move from desk to dinner effortlessly.
            </p>
            <div className="relative mt-8 min-h-[320px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(17,17,17,0.08)]">
              <Image
                src="/bags/sling-bag.svg"
                alt="New arrival sling bag"
                fill
                className="object-contain p-6"
              />
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredArrivals.map((item) => (
              <ProductCard
                key={item.slug}
                item={item}
                wishlisted={wishlistSlugs.has(item.slug)}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="categories"
        className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#8B5E3C]">
              Categories
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Shop by lifestyle, function, and mood
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            Find the right bag for daily polish, travel ease, event dressing, or
            business-ready structure.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filteredCategories.map((item) => (
            <CategoryCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      <section
        id="best-sellers"
        className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#8B5E3C]">
              Best Sellers
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Most-loved pieces from the storefront edit
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm text-muted-foreground">
            <TrendingUp className="size-4 text-[#8B5E3C]" />
            Strong favorites for office, gifting, and travel
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.55fr,0.45fr]">
          {filteredBestSellers[0] ? (
            <div className="overflow-hidden rounded-[38px] bg-[#111111] text-white shadow-[0_24px_90px_rgba(0,0,0,0.16)]">
              <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[0.48fr,0.52fr]">
                <div className="relative min-h-[360px] overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#2C2421_0%,#C8AD8F_100%)]">
                  <Image
                    src={filteredBestSellers[0].image}
                    alt={filteredBestSellers[0].name}
                    fill
                    className="object-contain p-6"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm uppercase tracking-[0.24em] text-[#d6c2a6]">
                    {filteredBestSellers[0].badge}
                  </p>
                  <h3 className="mt-4 text-3xl font-semibold tracking-tight">
                    {filteredBestSellers[0].name}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/72">
                    {filteredBestSellers[0].description}
                  </p>
                  <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-4">
                      <p className="text-white/65">Material</p>
                      <p className="mt-1 font-medium text-white">
                        {filteredBestSellers[0].material}
                      </p>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-4">
                      <p className="text-white/65">Price</p>
                      <p className="mt-1 font-medium text-white">
                        KES {filteredBestSellers[0].price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/#newsletter"
                    className={buttonVariants({
                      className: "mt-6 h-12 rounded-full px-5",
                    })}
                  >
                    Get style notes
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid gap-5">
            {filteredBestSellers.slice(1).map((item) => (
              <ProductCard
                key={item.slug}
                item={item}
                wishlisted={wishlistSlugs.has(item.slug)}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="reviews"
        className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#8B5E3C]">
              Customer Reviews
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Customers describe the edit as polished, practical, and premium
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            Feedback centered on construction, styling ease, and how comfortably
            the bags move across different parts of the day.
          </p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {customerReviews.map((review) => (
            <Card key={review.name} className="bg-white">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>{review.name}</CardTitle>
                    <CardDescription>{review.title}</CardDescription>
                  </div>
                  <Quote className="size-5 text-[#8B5E3C]" />
                </div>
                <div className="flex items-center gap-1 text-[#8B5E3C]">
                  {Array.from({ length: review.rating }, (_, index) => (
                    <Star key={index} className="size-4 fill-current" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-muted-foreground">
                  “{review.quote}”
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="newsletter"
        className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="overflow-hidden rounded-[40px] bg-[#111111] text-white shadow-[0_24px_100px_rgba(0,0,0,0.18)]">
          <div className="grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[0.54fr,0.46fr] lg:px-12 lg:py-12">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#d6c2a6]">
                Newsletter
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                Receive product drops, styling notes, and soft-launch exclusives
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
                Join the Ciah Accessorize list for polished daily carry inspiration,
                limited edits, and first access to premium new arrivals.
              </p>
              <div className="mt-8 max-w-xl">
                <NewsletterForm />
              </div>
            </div>
            <div className="relative min-h-[320px] overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,#F8EFE4_0%,#D8B99B_100%)]">
              <Image
                src="/bags/hero-bag.svg"
                alt="Newsletter feature bag"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="instagram-feed"
        className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#8B5E3C]">
              Instagram Feed
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Visual styling moments from the brand world
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Camera className="size-4 text-[#8B5E3C]" />
            @ciahaccessorize
          </div>
        </div>
        <div className="mt-8 grid gap-5 grid-cols-2 lg:grid-cols-4">
          {instagramFeed.map((item) => (
            <div
              key={item.caption}
              className="overflow-hidden rounded-[30px] border border-border/70 bg-white shadow-[0_18px_60px_rgba(17,17,17,0.06)]"
            >
              <div className="relative aspect-[4/5] bg-[linear-gradient(180deg,#F8F2EB_0%,#E9D6BE_100%)]">
                <Image
                  src={item.image}
                  alt={item.caption}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-4">
                <p className="text-sm leading-6 text-muted-foreground">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
