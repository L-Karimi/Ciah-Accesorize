"use server";

import { revalidatePath } from "next/cache";
import { getServerAuthSession } from "@/lib/auth";
import { catalogProducts } from "@/lib/catalog";
import {
  clearGuestCartEntries,
  clampCartQuantity,
  getGuestCartEntries,
  resolvePersistedCartProduct,
  setGuestCartEntries,
} from "@/lib/cart";
import {
  getDatabaseSetupErrorMessage,
  isPrismaSetupError,
} from "@/lib/prisma-errors";
import { prisma } from "@/lib/prisma";

function revalidateCartSurfaces(productSlug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/cart");

  if (productSlug) {
    revalidatePath(`/products/${productSlug}`);
  }
}

async function getCartProductSnapshot(productSlug: string) {
  let persistedProduct = null;

  try {
    persistedProduct = await prisma.product.findFirst({
      where: {
        slug: productSlug,
        deletedAt: null,
      },
      select: {
        slug: true,
        name: true,
        stock: true,
        published: true,
      },
    });
  } catch (error) {
    if (!isPrismaSetupError(error)) {
      throw error;
    }
  }

  if (persistedProduct) {
    return persistedProduct;
  }

  const catalogProduct = catalogProducts.find((product) => product.slug === productSlug);

  if (!catalogProduct) {
    return null;
  }

  return {
    slug: catalogProduct.slug,
    name: catalogProduct.name,
    stock: catalogProduct.stock,
    published: catalogProduct.published,
  };
}

async function findPersistedCartProduct(productSlug: string) {
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
        stock: true,
        published: true,
      },
    });
  } catch (error) {
    if (isPrismaSetupError(error)) {
      return null;
    }

    throw error;
  }
}

export async function addProductToCart(productSlug: string, quantity = 1) {
  const session = await getServerAuthSession();
  const normalizedRequestedQuantity = clampCartQuantity(quantity);

  if (normalizedRequestedQuantity <= 0) {
    return {
      success: false,
      error: "Please choose a valid quantity.",
    };
  }

  const cartProduct = await getCartProductSnapshot(productSlug);

  if (!cartProduct || !cartProduct.published) {
    return {
      success: false,
      error: "Product not found.",
    };
  }

  if (cartProduct.stock <= 0) {
    return {
      success: false,
      error: "This product is currently out of stock.",
    };
  }

  try {
    if (session?.user?.id) {
      const persistedProduct = await resolvePersistedCartProduct(productSlug);

      if (!persistedProduct || !persistedProduct.published) {
        return {
          success: false,
          error: getDatabaseSetupErrorMessage("save items to your authenticated cart"),
        };
      }

      const existingCartItem = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: persistedProduct.id,
          },
        },
        select: {
          quantity: true,
        },
      });

      const nextQuantity = clampCartQuantity(
        (existingCartItem?.quantity ?? 0) + normalizedRequestedQuantity,
        persistedProduct.stock,
      );

      await prisma.cartItem.upsert({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: persistedProduct.id,
          },
        },
        update: {
          quantity: nextQuantity,
        },
        create: {
          userId: session.user.id,
          productId: persistedProduct.id,
          quantity: nextQuantity,
        },
      });
    } else {
      const guestEntries = await getGuestCartEntries();
      const existingEntry = guestEntries.find((entry) => entry.productSlug === productSlug);
      const nextQuantity = clampCartQuantity(
        (existingEntry?.quantity ?? 0) + normalizedRequestedQuantity,
        cartProduct.stock,
      );
      const nextEntries = guestEntries.filter((entry) => entry.productSlug !== productSlug);

      if (nextQuantity > 0) {
        nextEntries.push({
          productSlug,
          quantity: nextQuantity,
        });
      }

      await setGuestCartEntries(nextEntries);
    }

    revalidateCartSurfaces(productSlug);

    return {
      success: true,
      message: `${cartProduct.name} added to your cart.`,
    };
  } catch (error) {
    console.error("Add to cart error:", error);
    return {
      success: false,
      error: isPrismaSetupError(error)
        ? getDatabaseSetupErrorMessage("update your cart")
        : "We could not update your cart right now.",
    };
  }
}

export async function updateCartItemQuantity(productSlug: string, quantity: number) {
  const session = await getServerAuthSession();

  if (quantity <= 0) {
    return removeProductFromCart(productSlug);
  }

  const cartProduct = await getCartProductSnapshot(productSlug);

  if (!cartProduct || !cartProduct.published) {
    return {
      success: false,
      error: "Product not found.",
    };
  }

  try {
    const nextQuantity = clampCartQuantity(quantity, cartProduct.stock);

    if (nextQuantity <= 0) {
      return removeProductFromCart(productSlug);
    }

    if (session?.user?.id) {
      const persistedProduct = await findPersistedCartProduct(productSlug);

      if (!persistedProduct) {
        return {
          success: false,
          error: getDatabaseSetupErrorMessage("update your authenticated cart"),
        };
      }

      await prisma.cartItem.updateMany({
        where: {
          userId: session.user.id,
          productId: persistedProduct.id,
        },
        data: {
          quantity: nextQuantity,
        },
      });
    } else {
      const guestEntries = await getGuestCartEntries();
      const nextEntries = guestEntries.map((entry) =>
        entry.productSlug === productSlug
          ? {
              ...entry,
              quantity: nextQuantity,
            }
          : entry,
      );

      await setGuestCartEntries(nextEntries);
    }

    revalidateCartSurfaces(productSlug);

    return {
      success: true,
      message: `Updated quantity for ${cartProduct.name}.`,
    };
  } catch (error) {
    console.error("Update cart quantity error:", error);
    return {
      success: false,
      error: isPrismaSetupError(error)
        ? getDatabaseSetupErrorMessage("update your cart")
        : "We could not update your cart right now.",
    };
  }
}

export async function removeProductFromCart(productSlug: string) {
  const session = await getServerAuthSession();

  try {
    if (session?.user?.id) {
      const persistedProduct = await findPersistedCartProduct(productSlug);

      if (persistedProduct) {
        await prisma.cartItem.deleteMany({
          where: {
            userId: session.user.id,
            productId: persistedProduct.id,
          },
        });
      }
    } else {
      const guestEntries = await getGuestCartEntries();
      await setGuestCartEntries(
        guestEntries.filter((entry) => entry.productSlug !== productSlug),
      );
    }

    revalidateCartSurfaces(productSlug);

    return {
      success: true,
      message: "Item removed from your cart.",
    };
  } catch (error) {
    console.error("Remove from cart error:", error);
    return {
      success: false,
      error: isPrismaSetupError(error)
        ? getDatabaseSetupErrorMessage("update your cart")
        : "We could not update your cart right now.",
    };
  }
}

export async function mergeGuestCartAfterLogin() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return {
      success: false,
      merged: false,
    };
  }

  const guestEntries = await getGuestCartEntries();

  if (guestEntries.length === 0) {
    return {
      success: true,
      merged: false,
    };
  }

  try {
    const mergedProductSlugs: string[] = [];

    for (const entry of guestEntries) {
      const persistedProduct = await resolvePersistedCartProduct(entry.productSlug);

      if (!persistedProduct || !persistedProduct.published || persistedProduct.stock <= 0) {
        continue;
      }

      const existingCartItem = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: persistedProduct.id,
          },
        },
        select: {
          quantity: true,
        },
      });

      const nextQuantity = clampCartQuantity(
        (existingCartItem?.quantity ?? 0) + entry.quantity,
        persistedProduct.stock,
      );

      if (nextQuantity <= 0) {
        continue;
      }

      await prisma.cartItem.upsert({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: persistedProduct.id,
          },
        },
        update: {
          quantity: nextQuantity,
        },
        create: {
          userId: session.user.id,
          productId: persistedProduct.id,
          quantity: nextQuantity,
        },
      });

      mergedProductSlugs.push(entry.productSlug);
    }

    await clearGuestCartEntries();
    revalidateCartSurfaces();
    mergedProductSlugs.forEach((productSlug) => revalidateCartSurfaces(productSlug));

    return {
      success: true,
      merged: mergedProductSlugs.length > 0,
    };
  } catch (error) {
    console.error("Merge guest cart error:", error);
    return {
      success: false,
      merged: false,
      error: isPrismaSetupError(error)
        ? getDatabaseSetupErrorMessage("merge your cart")
        : undefined,
    };
  }
}
