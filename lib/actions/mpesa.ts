"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-guards";
import { getMpesaMaxRetries } from "@/lib/mpesa";
import {
  initiateMpesaPaymentForOrder,
  verifyMpesaPaymentForOrder,
} from "@/lib/mpesa-payments";
import { prisma } from "@/lib/prisma";

function revalidatePaymentSurfaces() {
  revalidatePath("/", "layout");
  revalidatePath("/account");
  revalidatePath("/checkout");
  revalidatePath("/checkout/success");
}

async function ensureOwnedOrder(orderId: string, userId: string) {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    select: {
      id: true,
      payment: {
        select: {
          id: true,
          status: true,
          retryCount: true,
        },
      },
    },
  });
}

export async function retryOrderMpesaPayment(orderId: string) {
  const session = await requireAuth("/checkout/success");
  const order = await ensureOwnedOrder(orderId, session.user.id);

  if (!order?.payment) {
    return {
      success: false,
      error: "We could not find that order payment.",
    };
  }

  if (order.payment.status === "COMPLETED") {
    return {
      success: true,
      message: "This order has already been paid.",
      paymentStatus: "COMPLETED" as const,
      transactionStatus: "COMPLETED",
    };
  }

  if (order.payment.retryCount >= getMpesaMaxRetries()) {
    return {
      success: false,
      error: "Maximum M-Pesa retry attempts reached for this order.",
    };
  }

  const result = await initiateMpesaPaymentForOrder(orderId, { isRetry: true });
  revalidatePaymentSurfaces();

  if (!result.success) {
    return {
      success: false,
      error: result.error ?? "We could not retry the M-Pesa payment.",
    };
  }

  return {
    success: true,
    message:
      result.initiated === false
        ? "This order has already been paid."
        : "A new M-Pesa STK push has been sent to your phone.",
    paymentStatus: result.transactionStatus === "COMPLETED" ? ("COMPLETED" as const) : ("PENDING" as const),
    transactionStatus: result.transactionStatus ?? "RETRY_PENDING",
  };
}

export async function verifyOrderMpesaPayment(orderId: string) {
  const session = await requireAuth("/checkout/success");
  const order = await ensureOwnedOrder(orderId, session.user.id);

  if (!order?.payment) {
    return {
      success: false,
      error: "We could not find that order payment.",
    };
  }

  const result = await verifyMpesaPaymentForOrder(orderId);
  revalidatePaymentSurfaces();

  if (!result.success) {
    return {
      success: false,
      error: result.error ?? "We could not verify the M-Pesa payment.",
    };
  }

  return {
    success: true,
    message:
      result.paymentStatus === "COMPLETED"
        ? "Payment confirmed successfully."
        : result.paymentStatus === "PENDING"
          ? "Payment is still being processed by Safaricom."
          : "Payment has not completed yet.",
    paymentStatus: result.paymentStatus,
    transactionStatus: result.transactionStatus,
  };
}
