import "server-only";

import type { Prisma } from "@prisma/client";
import { createOrderStatusNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import {
  getMpesaMaxRetries,
  initiateMpesaStkPush,
  parseMpesaCallback,
  queryMpesaStkPushStatus,
  type MpesaCallbackPayload,
} from "@/lib/mpesa";

type PaymentWithOrder = Prisma.PaymentGetPayload<{
  include: {
    order: true;
  };
}>;

function buildAccountReference(orderId: string) {
  return `Ciah${orderId.slice(-8)}`;
}

function buildTransactionStatus(resultCode: string) {
  if (resultCode === "0") {
    return "COMPLETED";
  }

  if (resultCode === "1032") {
    return "CANCELLED";
  }

  if (resultCode === "1037") {
    return "TIMED_OUT";
  }

  if (resultCode === "2001") {
    return "INVALID_PIN";
  }

  return "FAILED";
}

async function getPaymentForOrder(orderId: string) {
  return prisma.payment.findUnique({
    where: {
      orderId,
    },
    include: {
      order: true,
    },
  });
}

async function markPaymentCompleted(
  payment: NonNullable<PaymentWithOrder>,
  input: {
    mpesaReceiptNumber?: string | null;
    phoneNumber?: string | null;
    rawPayload?: unknown;
    resultCode: string;
    resultDescription?: string | null;
    transactionStatus?: string;
  },
) {
  return prisma.$transaction(async (tx) => {
    const shouldNotify = payment.order.status !== "PAID";

    await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "COMPLETED",
        transactionStatus: input.transactionStatus ?? "COMPLETED",
        resultCode: input.resultCode,
        resultDescription: input.resultDescription ?? null,
        callbackPayload:
          input.rawPayload === undefined ? undefined : (input.rawPayload as object),
        mpesaReceiptNumber: input.mpesaReceiptNumber ?? payment.mpesaReceiptNumber ?? null,
        transactionId: input.mpesaReceiptNumber ?? payment.transactionId ?? null,
        phoneNumber: input.phoneNumber ?? payment.phoneNumber,
      },
    });

    await tx.order.update({
      where: {
        id: payment.orderId,
      },
      data: {
        paymentStatus: "COMPLETED",
        status: "PAID",
      },
    });

    if (shouldNotify) {
      await createOrderStatusNotification(tx, {
        userId: payment.order.userId,
        orderId: payment.orderId,
        status: "PAID",
      });
    }
  });
}

async function markPaymentFailed(
  payment: NonNullable<PaymentWithOrder>,
  input: {
    rawPayload?: unknown;
    resultCode?: string | null;
    resultDescription?: string | null;
    transactionStatus: string;
  },
) {
  return prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "FAILED",
        transactionStatus: input.transactionStatus,
        resultCode: input.resultCode ?? payment.resultCode ?? null,
        resultDescription: input.resultDescription ?? payment.resultDescription ?? null,
        callbackPayload:
          input.rawPayload === undefined ? undefined : (input.rawPayload as object),
      },
    });

    await tx.order.update({
      where: {
        id: payment.orderId,
      },
      data: {
        paymentStatus: "FAILED",
        status: "PENDING",
      },
    });
  });
}

async function markPaymentPending(
  payment: NonNullable<PaymentWithOrder>,
  input: {
    rawPayload?: unknown;
    resultCode?: string | null;
    resultDescription?: string | null;
    transactionStatus: string;
  },
) {
  return prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "PENDING",
        transactionStatus: input.transactionStatus,
        resultCode: input.resultCode ?? payment.resultCode ?? null,
        resultDescription: input.resultDescription ?? payment.resultDescription ?? null,
        callbackPayload:
          input.rawPayload === undefined ? undefined : (input.rawPayload as object),
      },
    });

    await tx.order.update({
      where: {
        id: payment.orderId,
      },
      data: {
        paymentStatus: "PENDING",
        status: "PENDING",
      },
    });
  });
}

function shouldKeepPaymentPending(input: {
  resultCode?: string | null;
  resultDescription?: string | null;
  responseDescription?: string | null;
}) {
  const resultCode = input.resultCode?.trim();
  const detail = `${input.resultDescription ?? ""} ${input.responseDescription ?? ""}`
    .toLowerCase()
    .trim();

  if (!resultCode) {
    return true;
  }

  return detail.includes("processing") || detail.includes("pending");
}

export async function initiateMpesaPaymentForOrder(
  orderId: string,
  options?: {
    isRetry?: boolean;
  },
) {
  const payment = await getPaymentForOrder(orderId);
  const isRetry = Boolean(options?.isRetry);

  if (!payment) {
    return {
      success: false,
      error: "Payment record not found for this order.",
    };
  }

  if (payment.status === "COMPLETED") {
    return {
      success: true,
      checkoutRequestId: payment.checkoutRequestId,
      initiated: false,
      transactionStatus: payment.transactionStatus ?? "COMPLETED",
    };
  }

  if (!payment.phoneNumber) {
    return {
      success: false,
      error: "The payment phone number is missing.",
    };
  }

  if (isRetry && payment.retryCount >= getMpesaMaxRetries()) {
    return {
      success: false,
      error: "Maximum M-Pesa retry attempts reached.",
    };
  }

  try {
    const stkResponse = await initiateMpesaStkPush({
      accountReference: buildAccountReference(orderId),
      amount: payment.amount,
      phoneNumber: payment.phoneNumber,
      transactionDescription: "Ciah Accessorize order payment",
    });

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: "PENDING",
          transactionStatus: isRetry ? "RETRY_PENDING" : "STK_PUSH_SENT",
          checkoutRequestId: stkResponse.payload.CheckoutRequestID ?? payment.checkoutRequestId,
          merchantRequestId: stkResponse.payload.MerchantRequestID ?? payment.merchantRequestId,
          resultCode: stkResponse.payload.ResponseCode ?? payment.resultCode,
          resultDescription:
            stkResponse.payload.ResponseDescription ??
            stkResponse.payload.CustomerMessage ??
            payment.resultDescription,
          phoneNumber: stkResponse.normalizedPhoneNumber,
          lastRetryAt: isRetry ? new Date() : payment.lastRetryAt,
          retryCount: isRetry ? { increment: 1 } : payment.retryCount,
        },
      });

      await tx.order.update({
        where: {
          id: payment.orderId,
        },
        data: {
          paymentStatus: "PENDING",
          status: "PENDING",
        },
      });
    });

    return {
      success: true,
      checkoutRequestId: stkResponse.payload.CheckoutRequestID ?? payment.checkoutRequestId,
      initiated: true,
      transactionStatus: isRetry ? "RETRY_PENDING" : "STK_PUSH_SENT",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unable to start the M-Pesa payment.";

    await markPaymentFailed(payment, {
      resultDescription: errorMessage,
      transactionStatus: isRetry ? "RETRY_FAILED" : "STK_PUSH_FAILED",
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function reconcileMpesaCallback(payload: MpesaCallbackPayload) {
  const callback = parseMpesaCallback(payload);
  const payment = await prisma.payment.findFirst({
    where: {
      checkoutRequestId: callback.checkoutRequestId,
    },
    include: {
      order: true,
    },
  });

  if (!payment) {
    return {
      matched: false,
    };
  }

  if (callback.resultCode === "0") {
    await markPaymentCompleted(payment, {
      mpesaReceiptNumber: callback.mpesaReceiptNumber,
      phoneNumber: callback.phoneNumber,
      rawPayload: payload,
      resultCode: callback.resultCode,
      resultDescription: callback.resultDescription,
      transactionStatus: "COMPLETED",
    });

    return {
      matched: true,
      paymentStatus: "COMPLETED",
    };
  }

  await markPaymentFailed(payment, {
    rawPayload: payload,
    resultCode: callback.resultCode,
    resultDescription: callback.resultDescription,
    transactionStatus: buildTransactionStatus(callback.resultCode),
  });

  return {
    matched: true,
    paymentStatus: "FAILED",
  };
}

export async function verifyMpesaPaymentForOrder(orderId: string) {
  const payment = await getPaymentForOrder(orderId);

  if (!payment) {
    return {
      success: false,
      error: "Payment record not found for this order.",
    };
  }

  if (!payment.checkoutRequestId) {
    return {
      success: false,
      error: "No CheckoutRequestID is stored for this order yet.",
    };
  }

  try {
    const verification = await queryMpesaStkPushStatus(payment.checkoutRequestId);
    const resultCode = verification.ResultCode ?? "";
    const resultDescription = verification.ResultDesc ?? null;
    const responseDescription = verification.ResponseDescription ?? null;

    if (resultCode === "0") {
      await markPaymentCompleted(payment, {
        resultCode,
        resultDescription: resultDescription ?? responseDescription,
        transactionStatus: "COMPLETED",
      });

      return {
        success: true,
        paymentStatus: "COMPLETED",
        transactionStatus: "COMPLETED",
      };
    }

    if (
      shouldKeepPaymentPending({
        resultCode,
        resultDescription,
        responseDescription,
      })
    ) {
      await markPaymentPending(payment, {
        resultCode: resultCode || null,
        resultDescription: resultDescription ?? responseDescription,
        transactionStatus: "PROCESSING",
      });

      return {
        success: true,
        paymentStatus: "PENDING",
        transactionStatus: "PROCESSING",
      };
    }

    await markPaymentFailed(payment, {
      resultCode,
      resultDescription: resultDescription ?? responseDescription,
      transactionStatus: buildTransactionStatus(resultCode),
    });

    return {
      success: true,
      paymentStatus: "FAILED",
      transactionStatus: buildTransactionStatus(resultCode),
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "We could not verify the payment with Safaricom right now.",
    };
  }
}
