import type { Metadata } from "next";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/storefront/product-card";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth-guards";
import { getCurrentUserWishlistProducts, getCurrentUserWishlistSlugs } from "@/lib/wishlist";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Wishlist | Ciah Accessorize",
  description:
    "Review saved bags, handbags, tote bags, office bags, and travel pieces in your Ciah Accessorize wishlist.",
  keywords: [...siteConfig.keywords, "Wishlist", "Saved Products"],
  alternates: {
    canonical: "/wishlist",
  },
  openGraph: {
    title: `${siteConfig.name} | Wishlist`,
    description:
      "Return to your saved Ciah Accessorize products and continue shopping premium bags in Kenya.",
    url: `${siteConfig.url}/wishlist`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Wishlist`,
    description:
      "Manage your saved products and return to the luxury bag styles you love.",
  },
};

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const session = await requireAuth("/wishlist");
  const [wishlistProducts, wishlistSlugs] = await Promise.all([
    getCurrentUserWishlistProducts(),
    getCurrentUserWishlistSlugs(),
  ]);
  const savedSlugs = new Set(wishlistSlugs);

  return (
    <main className="pb-20">
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[38px] bg-[#111111] text-white shadow-[0_28px_120px_rgba(0,0,0,0.18)]">
          <div className="grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[0.95fr,0.5fr] lg:px-12 lg:py-12">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#d6c2a6]">
                Saved Products
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Your wishlist, ready whenever inspiration strikes.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-white/72">
                Keep track of premium handbags, ladies bags, office bags, and travel
                pieces you want to revisit before checkout.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className={buttonVariants({ className: "h-11 rounded-full px-5" })}
                >
                  Continue shopping
                </Link>
                <Link
                  href="/account"
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "h-11 rounded-full border-white/15 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white",
                  })}
                >
                  Back to account
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Card className="border-white/10 bg-white/6 text-white shadow-none">
                <CardHeader>
                  <div className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-[#d6c2a6]">
                    <Heart className="size-5" />
                  </div>
                  <CardTitle className="mt-4 text-white">
                    {wishlistProducts.length} saved product
                    {wishlistProducts.length === 1 ? "" : "s"}
                  </CardTitle>
                  <CardDescription className="text-white/68">
                    Signed in as {session.user.email}
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-white/10 bg-white/6 text-white shadow-none">
                <CardHeader>
                  <div className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-[#d6c2a6]">
                    <ShoppingBag className="size-5" />
                  </div>
                  <CardTitle className="mt-4 text-white">Luxury shortlist</CardTitle>
                  <CardDescription className="text-white/68">
                    Save now, compare later, and return to your favorite silhouettes fast.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {wishlistProducts.length === 0 ? (
          <Card className="border-border/80 bg-white">
            <CardHeader>
              <CardTitle>Your wishlist is empty</CardTitle>
              <CardDescription>
                Save products from the catalog or product pages to build your personal
                shortlist.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/products"
                className={buttonVariants({ className: "h-11 rounded-full px-5" })}
              >
                Explore products
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product.slug}
                item={product}
                wishlisted={savedSlugs.has(product.slug)}
                isAuthenticated={Boolean(session.user)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
