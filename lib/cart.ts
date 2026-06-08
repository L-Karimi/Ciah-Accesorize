import type { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { getServerAuthSession } from "@/lib/auth";
import { catalogProducts, type CatalogProduct } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { ensurePersistedCatalogProduct } from "@/lib/wishlist";

export const CART_COOKIE_NAME = "ciah_guest_cart";
export const CART_FREE_SHIPPING_THRESHOLD = 5000;
export const CART_STANDARD_SHIPPING_FEE = 350;

const MAX_CART_QUANTITY = 99;
const GUEST_CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

type PersistedCartProduct = Prisma.ProductGetPayload<{
  include: {
    category: true;
    images: true;
  };
}>;

export interface GuestCartEntry {
  productSlug: string;
  quantity: number;
}

export interface CartLineItem {
  productId: string;
  productSlug: string;
  name: string;
  category: string;
  image: string;
  imageAlt: string;
  accent: string;
  material: string;
  color: string;
  size: string;
  stock: number;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CartSummary {
  lineCount: number;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  qualifiesForFreeShipping: boolean;
  amountToFreeShipping: number;
}

export interface CartSnapshot {
  items: CartLineItem[];
  summary: CartSummary;
  isAuthenticated: boolean;
}

function getCatalogProductBySlug(productSlug: string) {
  return catalogProducts.find((product) => product.slug === productSlug);
}

export function clampCartQuantity(quantity: number, stock?: number) {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  const normalizedQuantity = Math.max(0, Math.floor(quantity));

  if (stock === undefined) {
    return Math.min(normalizedQuantity, MAX_CART_QUANTITY);
  }

  return Math.min(normalizedQuantity, Math.max(0, Math.min(stock, MAX_CART_QUANTITY)));
}

function normalizeGuestCartEntries(entries: GuestCartEntry[]) {
  const mergedEntries = new Map<string, number>();

  for (const entry of entries) {
    if (!entry.productSlug || !Number.isFinite(entry.quantity)) {
      continue;
    }

    const currentQuantity = mergedEntries.get(entry.productSlug) ?? 0;
    const nextQuantity = clampCartQuantity(currentQuantity + entry.quantity);

    if (nextQuantity > 0) {
      mergedEntries.set(entry.productSlug, nextQuantity);
    }
  }

  return Array.from(mergedEntries.entries()).map(([productSlug, quantity]) => ({
    productSlug,
    quantity,
  }));
}

function getCartAccent(productSlug: string) {
  return (
    getCatalogProductBySlug(productSlug)?.accent ?? "from-[#f3ece3] via-[#fbf7f1] to-[#ffffff]"
  );
}

function mapCatalogProductToCartLine(product: CatalogProduct, quantity: number): CartLineItem {
  const normalizedQuantity = clampCartQuantity(quantity, product.stock);

  return {
    productId: product.id,
    productSlug: product.slug,
    name: product.name,
    category: product.category,
    image: product.image,
    imageAlt: product.images[0]?.alt ?? product.name,
    accent: product.accent,
    material: product.material,
    color: product.color,
    size: product.size,
    stock: product.stock,
    unitPrice: product.price,
    quantity: normalizedQuantity,
    lineTotal: product.price * normalizedQuantity,
  };
}

function mapPersistedProductToCartLine(
  product: PersistedCartProduct,
  quantity: number,
): CartLineItem {
  const localProduct = getCatalogProductBySlug(product.slug);
  const unitPrice = product.discountPrice ?? product.price;
  const normalizedQuantity = clampCartQuantity(quantity, product.stock);
  const image = product.images[0]?.url ?? localProduct?.image ?? "/bags/hero-bag.svg";
  const imageAlt = product.images[0]?.alt ?? product.name;

  return {
    productId: product.id,
    productSlug: product.slug,
    name: product.name,
    category: product.category.name,
    image,
    imageAlt,
    accent: localProduct?.accent ?? getCartAccent(product.slug),
    material: product.material,
    color: product.color,
    size: product.size ?? localProduct?.size ?? "Medium",
    stock: product.stock,
    unitPrice,
    quantity: normalizedQuantity,
    lineTotal: unitPrice * normalizedQuantity,
  };
}

export function buildCartSummary(items: CartLineItem[]): CartSummary {
  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const qualifiesForFreeShipping =
    subtotal >= CART_FREE_SHIPPING_THRESHOLD || itemCount === 0;
  const shipping =
    itemCount === 0 || qualifiesForFreeShipping ? 0 : CART_STANDARD_SHIPPING_FEE;

  return {
    lineCount: items.length,
    itemCount,
    subtotal,
    shipping,
    total: subtotal + shipping,
    qualifiesForFreeShipping,
    amountToFreeShipping: Math.max(0, CART_FREE_SHIPPING_THRESHOLD - subtotal),
  };
}

export function parseGuestCartCookie(rawValue?: string) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return normalizeGuestCartEntries(
      parsed.flatMap((entry) => {
        if (
          typeof entry !== "object" ||
          entry === null ||
          typeof entry.productSlug !== "string" ||
          typeof entry.quantity !== "number"
        ) {
          return [];
        }

        return [
          {
            productSlug: entry.productSlug,
            quantity: entry.quantity,
          } satisfies GuestCartEntry,
        ];
      }),
    );
  } catch {
    return [];
  }
}

export async function getGuestCartEntries() {
  const cookieStore = await cookies();
  return parseGuestCartCookie(cookieStore.get(CART_COOKIE_NAME)?.value);
}

export async function setGuestCartEntries(entries: GuestCartEntry[]) {
  const cookieStore = await cookies();
  const normalizedEntries = normalizeGuestCartEntries(entries);

  if (normalizedEntries.length === 0) {
    cookieStore.delete(CART_COOKIE_NAME);
    return;
  }

  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(normalizedEntries), {
    path: "/",
    sameSite: "lax",
    maxAge: GUEST_CART_COOKIE_MAX_AGE,
  });
}

export async function clearGuestCartEntries() {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE_NAME);
}

export async function resolvePersistedCartProduct(productSlug: string) {
  const existingProduct = await prisma.product.findFirst({
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

  if (existingProduct) {
    return existingProduct;
  }

  const catalogProduct = getCatalogProductBySlug(productSlug);

  if (!catalogProduct) {
    return null;
  }

  const persistedProduct = await ensurePersistedCatalogProduct(catalogProduct);

  return {
    id: persistedProduct.id,
    slug: persistedProduct.slug,
    name: persistedProduct.name,
    stock: persistedProduct.stock,
    published: persistedProduct.published,
  };
}

async function getPersistedProductsBySlug(productSlugs: string[]) {
  if (productSlugs.length === 0) {
    return new Map<string, PersistedCartProduct>();
  }

  const persistedProducts = await prisma.product.findMany({
    where: {
      slug: {
        in: productSlugs,
      },
      deletedAt: null,
    },
    include: {
      category: true,
      images: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return new Map(persistedProducts.map((product) => [product.slug, product]));
}

async function getGuestCartItems() {
  const entries = await getGuestCartEntries();

  if (entries.length === 0) {
    return [];
  }

  const persistedProducts = await getPersistedProductsBySlug(
    entries.map((entry) => entry.productSlug),
  );

  return entries.flatMap((entry) => {
    const persistedProduct = persistedProducts.get(entry.productSlug);

    if (persistedProduct) {
      const item = mapPersistedProductToCartLine(persistedProduct, entry.quantity);
      return item.quantity > 0 ? [item] : [];
    }

    const catalogProduct = getCatalogProductBySlug(entry.productSlug);

    if (!catalogProduct) {
      return [];
    }

    const item = mapCatalogProductToCartLine(catalogProduct, entry.quantity);
    return item.quantity > 0 ? [item] : [];
  });
}

async function getAuthenticatedCartItems(userId: string) {
  const cartItems = await prisma.cartItem.findMany({
    where: {
      userId,
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

  return cartItems.flatMap((cartItem) => {
    const item = mapPersistedProductToCartLine(cartItem.product, cartItem.quantity);
    return item.quantity > 0 ? [item] : [];
  });
}

export async function getCurrentCartSnapshot(): Promise<CartSnapshot> {
  const session = await getServerAuthSession();
  const isAuthenticated = Boolean(session?.user?.id);
  const items = session?.user?.id
    ? await getAuthenticatedCartItems(session.user.id)
    : await getGuestCartItems();

  return {
    items,
    summary: buildCartSummary(items),
    isAuthenticated,
  };
}
