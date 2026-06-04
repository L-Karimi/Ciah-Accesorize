import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import { catalogProducts, type CatalogProduct } from "@/lib/catalog";

function slugifyCategory(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export async function getCurrentUserWishlistSlugs() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return [];
  }

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
}

export async function getCurrentUserWishlistProducts() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return [];
  }

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

  return wishlists.map((wishlist) => {
    const localProduct = catalogProducts.find(
      (product) => product.slug === wishlist.product.slug,
    );

    if (localProduct) {
      return localProduct;
    }

    return {
      id: wishlist.product.id,
      name: wishlist.product.name,
      slug: wishlist.product.slug,
      category: wishlist.product.category.name,
      price: wishlist.product.price,
      material: wishlist.product.material as CatalogProduct["material"],
      color: wishlist.product.color as CatalogProduct["color"],
      description: wishlist.product.description ?? "Saved wishlist product.",
      accent: "from-[#f3ece3] via-[#fbf7f1] to-[#ffffff]",
      image: wishlist.product.images[0]?.url ?? "/bags/hero-bag.svg",
      badge: "Saved",
      gender: wishlist.product.gender as CatalogProduct["gender"],
      size: wishlist.product.size ?? "Medium",
      stock: wishlist.product.stock,
      featured: wishlist.product.featured,
      published: wishlist.product.published,
      createdAt: wishlist.product.createdAt.toISOString().slice(0, 10),
      images:
        wishlist.product.images.length > 0
          ? wishlist.product.images.map((image) => ({
              src: image.url,
              alt: image.alt ?? wishlist.product.name,
            }))
          : [{ src: "/bags/hero-bag.svg", alt: wishlist.product.name }],
      variantColors: [wishlist.product.color as CatalogProduct["color"]],
      variantSizes: [wishlist.product.size ?? "Medium"],
      reviews: [],
    } satisfies CatalogProduct;
  });
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
