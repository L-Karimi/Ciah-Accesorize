import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductPurchasePanel } from "@/components/storefront/product-purchase-panel";
import { buttonVariants } from "@/components/ui/button";
import {
  catalogProducts,
  getAverageRating,
  getCatalogProductBySlug,
  getRelatedProducts,
} from "@/lib/catalog";
import { siteConfig } from "@/lib/site";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return catalogProducts.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getCatalogProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | ${product.category}`,
    description: `${product.description} Shop ${product.category.toLowerCase()} in ${product.color.toLowerCase()} ${product.material.toLowerCase()} from ${siteConfig.name}.`,
    keywords: [
      ...siteConfig.keywords,
      product.name,
      product.category,
      `${product.color} ${product.category}`,
      `${product.material} ${product.category}`,
    ],
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.description,
      url: `${siteConfig.url}/products/${product.slug}`,
      type: "website",
      images: [
        {
          url: `${siteConfig.url}${product.image}`,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${siteConfig.name}`,
      description: product.description,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getCatalogProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 4);
  const averageRating = getAverageRating(product);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => `${siteConfig.url}${image.src}`),
    sku: product.id,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    color: product.color,
    material: product.material,
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/products/${product.slug}`,
      priceCurrency: "KES",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageRating,
      reviewCount: product.reviews.length,
    },
    review: product.reviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
      },
      headline: review.title,
      reviewBody: review.comment,
      datePublished: review.date,
    })),
  };

  return (
    <main className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/products", label: "Products" },
              { label: product.name },
            ]}
          />
          <Link
            href="/products"
            className={buttonVariants({
              variant: "outline",
              className: "h-11 rounded-full px-4",
            })}
          >
            <ArrowLeft className="size-4" />
            Back to catalog
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.52fr,0.48fr]">
          <ProductGallery
            images={product.images}
            name={product.name}
            accent={product.accent}
          />
          <ProductPurchasePanel product={product} averageRating={averageRating} />
        </div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="bg-white">
            <CardHeader>
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-[#f5ede3] text-[#8B5E3C]">
                <ShieldCheck className="size-5" />
              </div>
              <CardTitle className="mt-4">Secure quality promise</CardTitle>
              <CardDescription>
                Carefully chosen materials and structured finishing for a refined,
                long-wearing carry experience.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-[#f5ede3] text-[#8B5E3C]">
                <Truck className="size-5" />
              </div>
              <CardTitle className="mt-4">Delivery support</CardTitle>
              <CardDescription>
                Nairobi and Kenya-wide dispatch guidance makes gifting and personal
                shopping feel easy and premium.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
              <CardDescription>
                Available in {product.variantColors.join(", ")} with sizes{" "}
                {product.variantSizes.join(", ")}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">
                Primary material: {product.material}. Designed for {product.gender.toLowerCase()} styling with a {product.size.toLowerCase()} carry profile.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#8B5E3C]">
              Reviews
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Customers describe this piece as polished, practical, and premium
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            Review feedback focuses on comfort, structure, versatility, and the
            refined finish across work and weekend wear.
          </p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {product.reviews.map((review) => (
            <Card key={`${review.author}-${review.date}`} className="bg-white">
              <CardHeader>
                <CardTitle>{review.title}</CardTitle>
                <CardDescription>
                  {review.author} · {review.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-3 text-sm font-medium text-[#8B5E3C]">
                  {"★".repeat(review.rating)}
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#8B5E3C]">
              Related Products
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Similar pieces you may also love
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-foreground transition-colors hover:text-[#8B5E3C]"
          >
            Browse full catalog
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} item={relatedProduct} />
          ))}
        </div>
      </section>
    </main>
  );
}
