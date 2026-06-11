import type { PaymentStatus } from "@prisma/client";

export const orderStatusOptions = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type ManagedOrderStatus = (typeof orderStatusOptions)[number];

export const orderStatusLabels: Record<ManagedOrderStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export function formatOrderStatus(status: string) {
  return orderStatusLabels[status as ManagedOrderStatus] ?? status;
}

export function formatPaymentStatus(status: string) {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "COMPLETED":
      return "Completed";
    case "FAILED":
      return "Failed";
    default:
      return status;
  }
}

export function getPaymentStatusForOrderStatus(
  status: ManagedOrderStatus,
  currentPaymentStatus: PaymentStatus,
): PaymentStatus {
  switch (status) {
    case "PENDING":
      return "PENDING";
    case "PAID":
    case "PROCESSING":
    case "SHIPPED":
    case "DELIVERED":
      return "COMPLETED";
    case "CANCELLED":
      return currentPaymentStatus;
  }
}

export function getOrderStatusNotificationContent(
  status: ManagedOrderStatus,
  orderId: string,
) {
  const orderReference = orderId.slice(0, 12);

  switch (status) {
    case "PENDING":
      return {
        title: "Order received",
        message: `Order ${orderReference} is pending while we wait for payment confirmation.`,
      };
    case "PAID":
      return {
        title: "Payment confirmed",
        message: `Order ${orderReference} has been paid and is queued for fulfillment.`,
      };
    case "PROCESSING":
      return {
        title: "Order processing",
        message: `Order ${orderReference} is now being packed and prepared for dispatch.`,
      };
    case "SHIPPED":
      return {
        title: "Order shipped",
        message: `Order ${orderReference} has left our store and is on the way.`,
      };
    case "DELIVERED":
      return {
        title: "Order delivered",
        message: `Order ${orderReference} has been marked as delivered.`,
      };
    case "CANCELLED":
      return {
        title: "Order cancelled",
        message: `Order ${orderReference} has been cancelled. Contact support if you need help.`,
      };
  }
}
