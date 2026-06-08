"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Smartphone } from "lucide-react";
import {
  retryOrderMpesaPayment,
  verifyOrderMpesaPayment,
} from "@/lib/actions/mpesa";
import { Button } from "@/components/ui/button";

interface PaymentStatusActionsProps {
  orderId: string;
  canRetry: boolean;
  canVerify: boolean;
}

export function PaymentStatusActions({
  orderId,
  canRetry,
  canVerify,
}: PaymentStatusActionsProps) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<"default" | "error">("default");
  const [isPending, startTransition] = useTransition();

  const runVerify = () => {
    setFeedback(null);
    startTransition(async () => {
      const result = await verifyOrderMpesaPayment(orderId);

      setFeedback(result.success ? result.message ?? "Payment verified." : result.error ?? "We could not verify the payment.");
      setFeedbackTone(result.success ? "default" : "error");
      router.refresh();
    });
  };

  const runRetry = () => {
    setFeedback(null);
    startTransition(async () => {
      const result = await retryOrderMpesaPayment(orderId);

      setFeedback(result.success ? result.message ?? "A new STK push has been sent." : result.error ?? "We could not retry the payment.");
      setFeedbackTone(result.success ? "default" : "error");
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {feedback ? (
        <div
          className={
            feedbackTone === "error"
              ? "rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              : "rounded-[20px] border border-[#d6c2a6] bg-[#fff8f1] px-4 py-3 text-sm text-[#6d4a31]"
          }
        >
          {feedback}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {canVerify ? (
          <Button
            type="button"
            className="h-11 rounded-full px-5"
            onClick={runVerify}
            disabled={isPending}
          >
            <RefreshCw className={isPending ? "animate-spin" : ""} />
            {isPending ? "Checking payment..." : "Verify payment"}
          </Button>
        ) : null}

        {canRetry ? (
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full px-5"
            onClick={runRetry}
            disabled={isPending}
          >
            <Smartphone />
            {isPending ? "Sending STK push..." : "Retry STK push"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
