import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import { catalogProducts, type CatalogProduct } from "@/lib/catalog";
import { isPrismaSetupError } from "@/lib/prisma-errors";

type WishlistProductRecord = Prisma.ProductGetPayload<{
  include: {
    category: true;
    images: true;
  };
}>;

function slugifyCategory(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function getCatalogProductBySlug(slug: string) {
  return catalogProducts.find((product) => product.slug === slug);
}

function buildWishlistCatalogProduct(
  wishlistProduct: WishlistProductRecord,
) {
  const localProduct = getCatalogProductBySlug(wishlistProduct.slug);
  const fallbackName = wishlistProduct.name;
  const fallbackImage = wishlistProduct.images[0]?.url ?? localProduct?.image ?? "/bags/hero-bag.svg";
  const fallbackAlt = wishlistProduct.images[0]?.alt ?? fallbackName;
  const fallbackSize = wishlistProduct.size ?? localProduct?.size ?? "Medium";
  const fallbackColor = wishlistProduct.color as CatalogProduct["color"];
  const fallbackMaterial = wishlistProduct.material as CatalogProduct["material"];
  const fallbackGender = wishlistProduct.gender as CatalogProduct["gender"];

  return {
    id: wishlistProduct.id,
    name: wishlistProduct.name,
    slug: wishlistProduct.slug,
    category: wishlistProduct.category.name,
    price: wishlistProduct.price,
    material: fallbackMaterial,
    color: fallbackColor,
    description:
      wishlistProduct.description ?? localProduct?.description ?? "Saved wishlist product.",
    accent: localProduct?.accent ?? "from-[#f3ece3] via-[#fbf7f1] to-[#ffffff]",
    image: fallbackImage,
    badge:
      localProduct?.badge ?? (wishlistProduct.featured ? "Featured" : "Saved"),
    gender: fallbackGender,
    size: fallbackSize,
    stock: wishlistProduct.stock,
    featured: wishlistProduct.featured,
    published: wishlistProduct.published,
    createdAt: wishlistProduct.createdAt.toISOString().slice(0, 10),
    images:
      wishlistProduct.images.length > 0
        ? wishlistProduct.images.map((image) => ({
            src: image.url,
            alt: image.alt ?? fallbackName,
          }))
        : localProduct?.images ?? [{ src: fallbackImage, alt: fallbackAlt }],
    variantColors:
      localProduct?.variantColors.length ? localProduct.variantColors : [fallbackColor],
    variantSizes:
      localProduct?.variantSizes.length ? localProduct.variantSizes : [fallbackSize],
    reviews: localProduct?.reviews ?? [],
  } satisfies CatalogProduct;
}

export async function getCurrentUserWishlistSlugs() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return [];
  }

  try {
    const wishlists = await prisma.wishlist.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    return wishlists.map((wishlist) => wishlist.product.slug);
  } catch (error) {
    if (isPrismaSetupError(error)) {
      console.warn("Wishlist lookup skipped because the database is not ready yet.");
      return [];
    }

    throw error;
  }
}

export async function getCurrentUserWishlistProducts() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return [];
  }

  try {
    const wishlists = await prisma.wishlist.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        product: {
          include: {
            category: true,
            images: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    return wishlists.map((wishlist) => buildWishlistCatalogProduct(wishlist.product));
  } catch (error) {
    if (isPrismaSetupError(error)) {
      console.warn("Wishlist page is using an empty state because the database is not ready yet.");
      return [];
    }

    throw error;
  }
}

export async function ensurePersistedCatalogProduct(product: CatalogProduct) {
  const categorySlug = slugifyCategory(product.category);

  const category = await prisma.category.upsert({
    where: {
      slug: categorySlug,
    },
    update: {
      name: product.category,
      description: `${product.category} collection for Ciah Accessorize.`,
    },
    create: {
      name: product.category,
      slug: categorySlug,
      description: `${product.category} collection for Ciah Accessorize.`,
    },
  });

  const persistedProduct = await prisma.product.upsert({
    where: {
      slug: product.slug,
    },
    update: {
      name: product.name,
      description: product.description,
      price: product.price,
      featured: product.featured,
      published: product.published,
      stock: product.stock,
      gender: product.gender,
      material: product.material,
      color: product.color,
      size: product.size,
      categoryId: category.id,
    },
    create: {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      featured: product.featured,
      published: product.published,
      stock: product.stock,
      gender: product.gender,
      material: product.material,
      color: product.color,
      size: product.size,
      categoryId: category.id,
    },
  });

  const imageCount = await prisma.productImage.count({
    where: {
      productId: persistedProduct.id,
    },
  });

  if (imageCount === 0) {
    await prisma.productImage.createMany({
      data: product.images.map((image, index) => ({
        productId: persistedProduct.id,
        url: image.src,
        alt: image.alt,
        order: index,
      })),
    });
  }

  return persistedProduct;
}

export async function findWishlistProductBySlug(productSlug: string) {
  try {
    return await prisma.product.findFirst({
      where: {
        slug: productSlug,
        deletedAt: null,
      },
      select: {
        id: true,
        slug: true,
        name: true,
      },
    });
  } catch (error) {
    if (isPrismaSetupError(error)) {
      return null;
    }

    throw error;
  }
}

export function getCatalogWishlistProduct(productSlug: string) {
  return getCatalogProductBySlug(productSlug);
}
