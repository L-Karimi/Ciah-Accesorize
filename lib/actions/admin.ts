"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { flatten, safeParse, type InferOutput } from "valibot";
import { requireAdmin } from "@/lib/auth-guards";
import { uploadProductImage } from "@/lib/cloudinary";
import { createOrderStatusNotification } from "@/lib/notifications";
import {
  getPaymentStatusForOrderStatus,
  orderStatusOptions,
  type ManagedOrderStatus,
} from "@/lib/orders";
import {
  getDatabaseSetupErrorMessage,
  isPrismaSetupError,
} from "@/lib/prisma-errors";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import {
  adminCategorySchema,
  adminInventorySchema,
  adminOrderSchema,
  adminProductSchema,
} from "@/lib/validations/admin";

type AdminCategoryInput = InferOutput<typeof adminCategorySchema>;
type AdminProductInput = InferOutput<typeof adminProductSchema>;
type AdminInventoryInput = InferOutput<typeof adminInventorySchema>;
type AdminOrderInput = InferOutput<typeof adminOrderSchema>;

export interface AdminActionResult {
  success: boolean;
  message: string;
}

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

function isValidOrderStatus(value: string): value is (typeof orderStatusOptions)[number] {
  return orderStatusOptions.includes(value as (typeof orderStatusOptions)[number]);
}

function revalidateAdminSurfaces() {
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/customers");
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/account");
  revalidatePath("/checkout/success");
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

function normalizeStringList(values: FormDataEntryValue[]) {
  return values.map((value) => normalizeText(value)).filter(Boolean);
}

function normalizeFileList(values: FormDataEntryValue[]) {
  return values.filter((value): value is File => value instanceof File && value.size > 0);
}

function getProductActionErrorMessage(error: unknown, feature: string) {
  if (isPrismaSetupError(error)) {
    return getDatabaseSetupErrorMessage(feature);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return "That product slug already exists. Use a different slug and try again.";
    }

    if (error.code === "P2003") {
      return "Choose a valid category before saving this product.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return `We could not ${feature} right now.`;
}

async function uploadProductImages(files: File[]) {
  return Promise.all(files.map((file) => uploadProductImage(file)));
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

export async function createProductAction(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();

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
    existingImageUrls: normalizeStringList(formData.getAll("existingImageUrls")),
  });
  const newImages = normalizeFileList(formData.getAll("newImages"));

  if (!parsed.success) {
    return {
      success: false,
      message: flattenValidationError(flatten(parsed.issues)),
    };
  }

  const output = parsed.output as AdminProductInput;

  if (output.existingImageUrls.length + newImages.length === 0) {
    return {
      success: false,
      message: "Add at least one product image before saving.",
    };
  }

  try {
    const uploadedImageUrls = await uploadProductImages(newImages);
    const imageUrls = [...output.existingImageUrls, ...uploadedImageUrls];

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
    revalidatePath(`/products/${output.slug}`);

    return {
      success: true,
      message: output.published
        ? "Product created and published successfully."
        : "Draft product created successfully.",
    };
  } catch (error) {
    console.error("Admin action error (create the product):", error);

    return {
      success: false,
      message: getProductActionErrorMessage(error, "create the product"),
    };
  }
}

export async function updateProductAction(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();
  const productId = normalizeText(formData.get("productId"));

  if (!productId) {
    return {
      success: false,
      message: "Product is required.",
    };
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
    existingImageUrls: normalizeStringList(formData.getAll("existingImageUrls")),
  });
  const newImages = normalizeFileList(formData.getAll("newImages"));

  if (!parsed.success) {
    return {
      success: false,
      message: flattenValidationError(flatten(parsed.issues)),
    };
  }

  const output = parsed.output as AdminProductInput;

  if (output.existingImageUrls.length + newImages.length === 0) {
    return {
      success: false,
      message: "Add at least one product image before saving.",
    };
  }

  try {
    const currentProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        slug: true,
      },
    });

    if (!currentProduct) {
      return {
        success: false,
        message: "Product not found.",
      };
    }

    const uploadedImageUrls = await uploadProductImages(newImages);
    const imageUrls = [...output.existingImageUrls, ...uploadedImageUrls];

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
    revalidatePath(`/products/${currentProduct.slug}`);
    revalidatePath(`/products/${output.slug}`);

    return {
      success: true,
      message: output.published
        ? "Product updated successfully."
        : "Draft product updated successfully.",
    };
  } catch (error) {
    console.error("Admin action error (update the product):", error);

    return {
      success: false,
      message: getProductActionErrorMessage(error, "update the product"),
    };
  }
}

export async function deleteProductAction(productId: string): Promise<AdminActionResult> {
  await requireAdmin();

  if (!productId) {
    return {
      success: false,
      message: "Product is required.",
    };
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
      return {
        success: false,
        message: "Product not found.",
      };
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
    revalidatePath(`/products/${product.slug}`);

    return {
      success: true,
      message: "Product archived successfully.",
    };
  } catch (error) {
    console.error("Admin action error (delete the product):", error);

    return {
      success: false,
      message: getProductActionErrorMessage(error, "archive the product"),
    };
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
  });

  if (!parsed.success) {
    redirectWithFeedback(path, {
      error: flattenValidationError(flatten(parsed.issues)),
    });
  }

  const output = parsed.output as AdminOrderInput;

  if (!isValidOrderStatus(output.status)) {
    redirectWithFeedback(path, {
      error: "Please choose a valid order status.",
    });
  }

  const orderStatus = output.status as ManagedOrderStatus;

  try {
    await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: {
          id: output.orderId,
        },
        select: {
          id: true,
          userId: true,
          status: true,
          paymentStatus: true,
        },
      });

      if (!existingOrder) {
        throw new Error("Order not found.");
      }

      const paymentStatus = getPaymentStatusForOrderStatus(
        orderStatus,
        existingOrder.paymentStatus,
      );

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
                : orderStatus === "CANCELLED"
                  ? "ORDER_CANCELLED"
                  : "PENDING",
        },
      });

      if (existingOrder.status !== orderStatus) {
        await createOrderStatusNotification(tx, {
          userId: existingOrder.userId,
          orderId: existingOrder.id,
          status: orderStatus,
        });
      }
    });

    revalidateAdminSurfaces();
    redirectWithFeedback(path, {
      status: "Order updated and customer notified successfully.",
    });
  } catch (error) {
    handleAdminActionError(path, error, "update the order");
  }
}
