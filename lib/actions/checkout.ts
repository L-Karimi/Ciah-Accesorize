"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guards";
import { getCurrentCartSnapshot } from "@/lib/cart";
import { buildShippingAddressSnapshot, splitCustomerName } from "@/lib/checkout";
import { checkoutSchema } from "@/lib/validations/checkout";
import { flatten, safeParse, type InferOutput } from "valibot";

type CheckoutInput = InferOutput<typeof checkoutSchema>;

function revalidateCheckoutSurfaces() {
  revalidatePath("/", "layout");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/account");
}

export async function createPendingOrder(input: CheckoutInput) {
  const session = await requireAuth("/checkout");
  const parsed = safeParse(checkoutSchema, input);

  if (!parsed.success) {
    const issues = flatten(parsed.issues);
    return {
      success: false,
      error:
        issues.root?.[0] ??
        Object.values(issues.nested ?? {}).flat()[0] ??
        "Please review your checkout details and try again.",
    };
  }

  const cart = await getCurrentCartSnapshot();

  if (cart.items.length === 0) {
    return {
      success: false,
      error: "Your cart is empty.",
    };
  }

  const checkoutInput = {
    ...parsed.output,
    email: parsed.output.email.trim().toLowerCase(),
    name: parsed.output.name.trim(),
    phone: parsed.output.phone.trim(),
    county: parsed.output.county.trim(),
    deliveryAddress: parsed.output.deliveryAddress.trim(),
    notes: parsed.output.notes.trim(),
  };
  const { firstName, lastName } = splitCustomerName(checkoutInput.name);

  try {
    const order = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          name: checkoutInput.name,
          phone: checkoutInput.phone,
        },
      });

      const existingDefaultAddress = await tx.address.findFirst({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        select: {
          id: true,
        },
      });

      if (existingDefaultAddress) {
        await tx.address.update({
          where: {
            id: existingDefaultAddress.id,
          },
          data: {
            firstName,
            lastName,
            phone: checkoutInput.phone,
            email: checkoutInput.email,
            street: checkoutInput.deliveryAddress,
            city: checkoutInput.county,
            county: checkoutInput.county,
            isDefault: true,
          },
        });
      } else {
        await tx.address.updateMany({
          where: {
            userId: session.user.id,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        });

        await tx.address.create({
          data: {
            userId: session.user.id,
            firstName,
            lastName,
            phone: checkoutInput.phone,
            email: checkoutInput.email,
            street: checkoutInput.deliveryAddress,
            city: checkoutInput.county,
            county: checkoutInput.county,
            country: "Kenya",
            isDefault: true,
          },
        });
      }

      const createdOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          status: "PENDING",
          total: cart.summary.total,
          tax: 0,
          shippingCost: cart.summary.shipping,
          paymentStatus: "PENDING",
          shippingAddress: buildShippingAddressSnapshot(checkoutInput),
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.unitPrice,
            })),
          },
          payment: {
            create: {
              amount: cart.summary.total,
              currency: "KES",
              status: "PENDING",
              method: "MPESA",
              phoneNumber: checkoutInput.phone,
            },
          },
        },
        select: {
          id: true,
          total: true,
          createdAt: true,
        },
      });

      await tx.cartItem.deleteMany({
        where: {
          userId: session.user.id,
        },
      });

      return createdOrder;
    });

    revalidateCheckoutSurfaces();

    return {
      success: true,
      orderId: order.id,
      total: order.total,
      createdAt: order.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Create pending order error:", error);
    return {
      success: false,
      error: "We could not create your order right now.",
    };
  }
}
