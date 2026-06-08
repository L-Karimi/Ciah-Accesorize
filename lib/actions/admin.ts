"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { flatten, safeParse, type InferOutput } from "valibot";
import { requireAdmin } from "@/lib/auth-guards";
import {
  getDatabaseSetupErrorMessage,
  isPrismaSetupError,
} from "@/lib/prisma-errors";
import { prisma } from "@/lib/prisma";
import {
  adminCategorySchema,
  adminInventorySchema,
  adminOrderSchema,
  adminProductSchema,
  orderStatusOptions,
  paymentStatusOptions,
} from "@/lib/validations/admin";

type AdminCategoryInput = InferOutput<typeof adminCategorySchema>;
type AdminProductInput = InferOutput<typeof adminProductSchema>;
type AdminInventoryInput = InferOutput<typeof adminInventorySchema>;
type AdminOrderInput = InferOutput<typeof adminOrderSchema>;

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalText(value: FormDataEntryValue | null) {
  const normalized = normalizeText(value);
  return normalized.length > 0 ? normalized : "";
}

function normalizeNumber(value: FormDataEntryValue | null) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return Number.NaN;
  }

  return Number(normalized);
}

function normalizeOptionalNumber(value: FormDataEntryValue | null) {
  const normalized = normalizeText(value);
  return normalized ? Number(normalized) : undefined;
}

function normalizeBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

function flattenValidationError(issues: ReturnType<typeof flatten>): string {
  const firstNestedIssue = Object.values(issues.nested ?? {}).flat()[0];

  if (typeof issues.root?.[0] === "string") {
    return issues.root[0];
  }

  if (typeof firstNestedIssue === "string") {
    return firstNestedIssue;
  }

  return "Please review the form and try again.";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseImageUrls(rawValue: string) {
  return rawValue
    .split(/\r?\n|,/)
    .map((value) => value.trim())
    .filter(Boolean);
}

function isValidOrderStatus(value: string): value is (typeof orderStatusOptions)[number] {
  return orderStatusOptions.includes(value as (typeof orderStatusOptions)[number]);
}

function isValidPaymentStatus(
  value: string,
): value is (typeof paymentStatusOptions)[number] {
  return paymentStatusOptions.includes(value as (typeof paymentStatusOptions)[number]);
}

function revalidateAdminSurfaces() {
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/customers");
}

function redirectWithFeedback(path: string, params: Record<string, string>): never {
  const searchParams = new URLSearchParams(params);
  redirect(`${path}?${searchParams.toString()}`);
}

function handleAdminActionError(path: string, error: unknown, feature: string): never {
  console.error(`Admin action error (${feature}):`, error);

  if (isPrismaSetupError(error)) {
    redirectWithFeedback(path, {
      error: getDatabaseSetupErrorMessage(feature),
    });
  }

  redirectWithFeedback(path, {
    error: `We could not ${feature} right now.`,
  });
}

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();
  const path = "/dashboard/categories";

  const parsed = safeParse(adminCategorySchema, {
    name: normalizeText(formData.get("name")),
    slug: slugify(normalizeText(formData.get("slug")) || normalizeText(formData.get("name"))),
    description: normalizeOptionalText(formData.get("description")),
    image: normalizeOptionalText(formData.get("image")),
  });

  if (!parsed.success) {
    redirectWithFeedback(path, {
      error: flattenValidationError(flatten(parsed.issues)),
    });
  }

  const output = parsed.output as AdminCategoryInput;

  try {
    await prisma.category.create({
      data: {
        name: output.name,
        slug: output.slug,
        description: output.description || null,
        image: output.image || null,
      },
    });

    revalidateAdminSurfaces();
    redirectWithFeedback(path, {
      status: "Category created successfully.",
    });
  } catch (error) {
    handleAdminActionError(path, error, "create the category");
  }
}

export async function updateCategoryAction(formData: FormData) {
  await requireAdmin();
  const path = "/dashboard/categories";
  const categoryId = normalizeText(formData.get("categoryId"));

  if (!categoryId) {
    redirectWithFeedback(path, {
      error: "Category is required.",
    });
  }

  const parsed = safeParse(adminCategorySchema, {
    name: normalizeText(formData.get("name")),
    slug: slugify(normalizeText(formData.get("slug")) || normalizeText(formData.get("name"))),
    description: normalizeOptionalText(formData.get("description")),
    image: normalizeOptionalText(formData.get("image")),
  });

  if (!parsed.success) {
    redirectWithFeedback(path, {
      error: flattenValidationError(flatten(parsed.issues)),
    });
  }

  const output = parsed.output as AdminCategoryInput;

  try {
    await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: output.name,
        slug: output.slug,
        description: output.description || null,
        image: output.image || null,
      },
    });

    revalidateAdminSurfaces();
    redirectWithFeedback(path, {
      status: "Category updated successfully.",
    });
  } catch (error) {
    handleAdminActionError(path, error, "update the category");
  }
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  const path = "/dashboard/categories";
  const categoryId = normalizeText(formData.get("categoryId"));

  if (!categoryId) {
    redirectWithFeedback(path, {
      error: "Category is required.",
    });
  }

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        products: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!category) {
      redirectWithFeedback(path, {
        error: "Category not found.",
      });
    }

    if (category.products.length > 0) {
      redirectWithFeedback(path, {
        error: "Archive or move active products before deleting this category.",
      });
    }

    const archivedSuffix = `archived-${Date.now()}`;

    await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        deletedAt: new Date(),
        name: `${category.name} (${archivedSuffix})`,
        slug: `${category.slug}-${archivedSuffix}`,
      },
    });

    revalidateAdminSurfaces();
    redirectWithFeedback(path, {
      status: "Category archived successfully.",
    });
  } catch (error) {
    handleAdminActionError(path, error, "delete the category");
  }
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const path = "/dashboard/products";

  const parsed = safeParse(adminProductSchema, {
    name: normalizeText(formData.get("name")),
    slug: slugify(normalizeText(formData.get("slug")) || normalizeText(formData.get("name"))),
    description: normalizeOptionalText(formData.get("description")),
    categoryId: normalizeText(formData.get("categoryId")),
    gender: normalizeText(formData.get("gender")),
    material: normalizeText(formData.get("material")),
    color: normalizeText(formData.get("color")),
    size: normalizeOptionalText(formData.get("size")),
    price: normalizeNumber(formData.get("price")),
    discountPrice: normalizeOptionalNumber(formData.get("discountPrice")),
    stock: normalizeNumber(formData.get("stock")),
    featured: normalizeBoolean(formData.get("featured")),
    published: normalizeBoolean(formData.get("published")),
    imageUrls: normalizeOptionalText(formData.get("imageUrls")),
  });

  if (!parsed.success) {
    redirectWithFeedback(path, {
      error: flattenValidationError(flatten(parsed.issues)),
    });
  }

  const output = parsed.output as AdminProductInput;
  const imageUrls = parseImageUrls(output.imageUrls);

  try {
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: output.name,
          slug: output.slug,
          description: output.description || null,
          categoryId: output.categoryId,
          gender: output.gender,
          material: output.material,
          color: output.color,
          size: output.size || null,
          price: output.price,
          discountPrice: output.discountPrice ?? null,
          stock: output.stock,
          featured: output.featured,
          published: output.published,
        },
      });

      if (imageUrls.length > 0) {
        await tx.productImage.createMany({
          data: imageUrls.map((url, index) => ({
            productId: product.id,
            url,
            alt: output.name,
            order: index,
          })),
        });
      }
    });

    revalidateAdminSurfaces();
    redirectWithFeedback(path, {
      status: "Product created successfully.",
    });
  } catch (error) {
    handleAdminActionError(path, error, "create the product");
  }
}

export async function updateProductAction(formData: FormData) {
  await requireAdmin();
  const path = "/dashboard/products";
  const productId = normalizeText(formData.get("productId"));

  if (!productId) {
    redirectWithFeedback(path, {
      error: "Product is required.",
    });
  }

  const parsed = safeParse(adminProductSchema, {
    name: normalizeText(formData.get("name")),
    slug: slugify(normalizeText(formData.get("slug")) || normalizeText(formData.get("name"))),
    description: normalizeOptionalText(formData.get("description")),
    categoryId: normalizeText(formData.get("categoryId")),
    gender: normalizeText(formData.get("gender")),
    material: normalizeText(formData.get("material")),
    color: normalizeText(formData.get("color")),
    size: normalizeOptionalText(formData.get("size")),
    price: normalizeNumber(formData.get("price")),
    discountPrice: normalizeOptionalNumber(formData.get("discountPrice")),
    stock: normalizeNumber(formData.get("stock")),
    featured: normalizeBoolean(formData.get("featured")),
    published: normalizeBoolean(formData.get("published")),
    imageUrls: normalizeOptionalText(formData.get("imageUrls")),
  });

  if (!parsed.success) {
    redirectWithFeedback(path, {
      error: flattenValidationError(flatten(parsed.issues)),
    });
  }

  const output = parsed.output as AdminProductInput;
  const imageUrls = parseImageUrls(output.imageUrls);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: {
          id: productId,
        },
        data: {
          name: output.name,
          slug: output.slug,
          description: output.description || null,
          categoryId: output.categoryId,
          gender: output.gender,
          material: output.material,
          color: output.color,
          size: output.size || null,
          price: output.price,
          discountPrice: output.discountPrice ?? null,
          stock: output.stock,
          featured: output.featured,
          published: output.published,
        },
      });

      await tx.productImage.deleteMany({
        where: {
          productId,
        },
      });

      if (imageUrls.length > 0) {
        await tx.productImage.createMany({
          data: imageUrls.map((url, index) => ({
            productId,
            url,
            alt: output.name,
            order: index,
          })),
        });
      }
    });

    revalidateAdminSurfaces();
    redirectWithFeedback(path, {
      status: "Product updated successfully.",
    });
  } catch (error) {
    handleAdminActionError(path, error, "update the product");
  }
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const path = "/dashboard/products";
  const productId = normalizeText(formData.get("productId"));

  if (!productId) {
    redirectWithFeedback(path, {
      error: "Product is required.",
    });
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        name: true,
        slug: true,
      },
    });

    if (!product) {
      redirectWithFeedback(path, {
        error: "Product not found.",
      });
    }

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        deletedAt: new Date(),
        published: false,
        slug: `${product.slug}-archived-${Date.now()}`,
      },
    });

    revalidateAdminSurfaces();
    redirectWithFeedback(path, {
      status: "Product archived successfully.",
    });
  } catch (error) {
    handleAdminActionError(path, error, "delete the product");
  }
}

export async function updateInventoryAction(formData: FormData) {
  await requireAdmin();
  const path = "/dashboard/inventory";

  const parsed = safeParse(adminInventorySchema, {
    productId: normalizeText(formData.get("productId")),
    stock: normalizeNumber(formData.get("stock")),
    featured: normalizeBoolean(formData.get("featured")),
    published: normalizeBoolean(formData.get("published")),
  });

  if (!parsed.success) {
    redirectWithFeedback(path, {
      error: flattenValidationError(flatten(parsed.issues)),
    });
  }

  const output = parsed.output as AdminInventoryInput;

  try {
    await prisma.product.update({
      where: {
        id: output.productId,
      },
      data: {
        stock: output.stock,
        featured: output.featured,
        published: output.published,
      },
    });

    revalidateAdminSurfaces();
    redirectWithFeedback(path, {
      status: "Inventory updated successfully.",
    });
  } catch (error) {
    handleAdminActionError(path, error, "update inventory");
  }
}

export async function updateOrderAction(formData: FormData) {
  await requireAdmin();
  const path = "/dashboard/orders";

  const parsed = safeParse(adminOrderSchema, {
    orderId: normalizeText(formData.get("orderId")),
    status: normalizeText(formData.get("status")),
    paymentStatus: normalizeText(formData.get("paymentStatus")),
  });

  if (!parsed.success) {
    redirectWithFeedback(path, {
      error: flattenValidationError(flatten(parsed.issues)),
    });
  }

  const output = parsed.output as AdminOrderInput;

  if (!isValidOrderStatus(output.status) || !isValidPaymentStatus(output.paymentStatus)) {
    redirectWithFeedback(path, {
      error: "Please choose a valid order and payment status.",
    });
  }

  const orderStatus = output.status;
  const paymentStatus = output.paymentStatus;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: {
          id: output.orderId,
        },
        data: {
          status: orderStatus,
          paymentStatus,
        },
      });

      await tx.payment.updateMany({
        where: {
          orderId: output.orderId,
        },
        data: {
          status: paymentStatus,
          transactionStatus:
            paymentStatus === "COMPLETED"
              ? "COMPLETED"
              : paymentStatus === "FAILED"
                ? "FAILED"
                : "PENDING",
        },
      });
    });

    revalidateAdminSurfaces();
    redirectWithFeedback(path, {
      status: "Order updated successfully.",
    });
  } catch (error) {
    handleAdminActionError(path, error, "update the order");
  }
}
