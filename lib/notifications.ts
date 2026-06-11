import "server-only";

import type { Prisma, PrismaClient } from "@prisma/client";
import type { ManagedOrderStatus } from "@/lib/orders";
import { getOrderStatusNotificationContent } from "@/lib/orders";

type NotificationDbClient = PrismaClient | Prisma.TransactionClient;

export async function createOrderStatusNotification(
  db: NotificationDbClient,
  input: {
    orderId: string;
    status: ManagedOrderStatus;
    userId: string;
  },
) {
  const content = getOrderStatusNotificationContent(input.status, input.orderId);

  return db.notification.create({
    data: {
      userId: input.userId,
      orderId: input.orderId,
      type: "ORDER_STATUS",
      title: content.title,
      message: content.message,
    },
  });
}
