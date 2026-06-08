"use server";

import { revalidatePath } from "next/cache";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ensurePersistedCatalogProduct,
  findWishlistProductBySlug,
  getCatalogWishlistProduct,
} from "@/lib/wishlist";

function revalidateWishlistSurfaces(productSlug: string) {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${productSlug}`);
  revalidatePath("/wishlist");
}

export async function addProductToWishlist(productSlug: string) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return {
      success: false,
      requiresLogin: true,
      error: "Please log in to save products.",
    };
  }

  try {
    let persistedProduct = await findWishlistProductBySlug(productSlug);

    if (!persistedProduct) {
      const catalogProduct = getCatalogWishlistProduct(productSlug);

      if (catalogProduct) {
        persistedProduct = await ensurePersistedCatalogProduct(catalogProduct);
      }
    }

    if (!persistedProduct) {
      return {
        success: false,
        error: "Product not found.",
      };
    }

    await prisma.wishlist.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: persistedProduct.id,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        productId: persistedProduct.id,
      },
    });

    revalidateWishlistSurfaces(persistedProduct.slug);

    return {
      success: true,
      message: `${persistedProduct.name} saved to your wishlist.`,
    };
  } catch (error) {
    console.error("Add wishlist error:", error);
    return {
      success: false,
      error: "We could not save that product right now.",
    };
  }
}

export async function removeProductFromWishlist(productSlug: string) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return {
      success: false,
      requiresLogin: true,
      error: "Please log in to manage your wishlist.",
    };
  }

  try {
    const persistedProduct = await findWishlistProductBySlug(productSlug);

    if (!persistedProduct) {
      return {
        success: true,
        message: "Product removed from your wishlist.",
      };
    }

    await prisma.wishlist.deleteMany({
      where: {
        userId: session.user.id,
        productId: persistedProduct.id,
      },
    });

    revalidateWishlistSurfaces(productSlug);

    return {
      success: true,
      message: "Product removed from your wishlist.",
    };
  } catch (error) {
    console.error("Remove wishlist error:", error);
    return {
      success: false,
      error: "We could not update your wishlist right now.",
    };
  }
}
