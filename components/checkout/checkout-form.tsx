"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import type { InferOutput } from "valibot";
import { CreditCard, MapPin, ReceiptText, UserRound } from "lucide-react";
import { createPendingOrder } from "@/lib/actions/checkout";
import type { CartSnapshot } from "@/lib/cart";
import { kenyaCountyOptions, type CheckoutFormDefaults } from "@/lib/checkout";
import { checkoutSchema } from "@/lib/validations/checkout";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type CheckoutFormValues = InferOutput<typeof checkoutSchema>;

const stepFields: Array<Array<keyof CheckoutFormValues>> = [
  ["name", "email", "phone"],
  ["county", "deliveryAddress", "notes"],
  [],
  [],
];

const steps = [
  {
    label: "Customer Information",
    description: "Confirm who is placing the order.",
    icon: UserRound,
  },
  {
    label: "Delivery Address",
    description: "Tell us where your order should arrive.",
    icon: MapPin,
  },
  {
    label: "Order Summary",
    description: "Review quantities, delivery, and totals.",
    icon: ReceiptText,
  },
  {
    label: "Payment",
    description: "Trigger the M-Pesa STK push for this order.",
    icon: CreditCard,
  },
] as const;

interface CheckoutFormProps {
  cart: CartSnapshot;
  defaultValues: CheckoutFormDefaults;
}

export function CheckoutForm({ cart, defaultValues }: CheckoutFormProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: valibotResolver(checkoutSchema),
    defaultValues,
  });

  const nextStep = async () => {
    setFormError(null);
    const fields = stepFields[activeStep];

    if (fields.length > 0) {
      const isStepValid = await trigger(fields);

      if (!isStepValid) {
        return;
      }
    }

    setActiveStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const previousStep = () => {
    setFormError(null);
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const result = await createPendingOrder(values);

    if (!result.success) {
      setFormError(result.error ?? "We could not create your order right now.");
      return;
    }

    if (!result.orderId) {
      setFormError("We created the order, but could not load the confirmation screen.");
      return;
    }

    router.push(`/checkout/success?orderId=${encodeURIComponent(result.orderId)}`);
    router.refresh();
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[0.62fr,0.38fr]">
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCurrent = index === activeStep;
            const isComplete = index < activeStep;

            return (
              <div
                key={step.label}
                className={cn(
                  "rounded-[28px] border px-4 py-4 transition-colors",
                  isCurrent || isComplete
                    ? "border-[#8B5E3C]/30 bg-[#fff7ef]"
                    : "border-border/70 bg-white",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-full",
                      isCurrent || isComplete
                        ? "bg-[#8B5E3C] text-white"
                        : "bg-[#f3ece3] text-[#8B5E3C]",
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#8B5E3C]">
                      Step {index + 1}
                    </p>
                    <p className="text-sm font-semibold text-foreground">{step.label}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <form onSubmit={onSubmit} className="rounded-[32px] border border-border/70 bg-white p-6 shadow-[0_20px_70px_rgba(17,17,17,0.05)] sm:p-8">
          {formError ? (
            <div className="mb-6 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          ) : null}

          {activeStep === 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                id="name"
                label="Name"
                error={errors.name?.message}
                className="sm:col-span-2"
              >
                <Input
                  id="name"
                  placeholder="Jane Mwangi"
                  autoComplete="name"
                  {...register("name")}
                />
              </FormField>
              <FormField id="email" label="Email" error={errors.email?.message}>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  autoComplete="email"
                  {...register("email")}
                />
              </FormField>
              <FormField id="phone" label="Phone" error={errors.phone?.message}>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+254700000000"
                  autoComplete="tel"
                  {...register("phone")}
                />
              </FormField>
            </div>
          ) : null}

          {activeStep === 1 ? (
            <div className="space-y-5">
              <FormField id="county" label="County" error={errors.county?.message}>
                <select
                  id="county"
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                  {...register("county")}
                >
                  <option value="">Select county</option>
                  {kenyaCountyOptions.map((county) => (
                    <option key={county} value={county}>
                      {county}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField
                id="deliveryAddress"
                label="Delivery Address"
                error={errors.deliveryAddress?.message}
                helper="Include estate, building, house number, or nearby landmark."
              >
                <Textarea
                  id="deliveryAddress"
                  placeholder="Westlands, Waiyaki Way, Applewood Apartments, House B12"
                  className="min-h-36"
                  {...register("deliveryAddress")}
                />
              </FormField>
              <FormField
                id="notes"
                label="Notes"
                error={errors.notes?.message}
                helper="Optional delivery notes for the rider or support team."
              >
                <Textarea
                  id="notes"
                  placeholder="Optional notes about delivery timing or landmarks."
                  className="min-h-28"
                  {...register("notes")}
                />
              </FormField>
            </div>
          ) : null}

          {activeStep === 2 ? (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.productSlug}
                  className="flex items-center justify-between gap-4 rounded-[24px] border border-border/70 bg-[#fcfaf7] px-4 py-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Qty {item.quantity} · {item.color} · {item.size}
                    </p>
                  </div>
                  <p className="font-semibold text-foreground">
                    KES {item.lineTotal.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {activeStep === 3 ? (
            <div className="space-y-5">
              <div className="rounded-[28px] border border-[#8B5E3C]/20 bg-[#fff7ef] p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-[#8B5E3C]">
                  Payment Method
                </p>
                <h2 className="mt-3 text-xl font-semibold text-foreground">M-Pesa</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  This step creates your order, stores a pending payment record, and
                  sends a Safaricom STK push to the phone number you entered.
                </p>
              </div>
              <div className="rounded-[28px] border border-border/70 bg-[#fcfaf7] p-5">
                <p className="text-sm font-medium text-foreground">What happens next</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Approve the M-Pesa prompt on your phone, then use the status screen
                  to verify payment or request another STK push if needed.
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full px-5"
              onClick={previousStep}
              disabled={activeStep === 0 || isSubmitting}
            >
              Back
            </Button>

            {activeStep < steps.length - 1 ? (
              <Button
                type="button"
                className="h-11 rounded-full px-5"
                onClick={nextStep}
                disabled={isSubmitting}
              >
                Continue
              </Button>
            ) : (
              <Button type="submit" className="h-11 rounded-full px-5" disabled={isSubmitting}>
                {isSubmitting ? "Starting payment..." : "Place order and pay"}
              </Button>
            )}
          </div>
        </form>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[32px] border border-border/70 bg-white p-6 shadow-[0_20px_70px_rgba(17,17,17,0.05)]">
          <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">Checkout Summary</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Items</span>
              <span>{cart.summary.itemCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">
                KES {cart.summary.subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Shipping</span>
              <span className="font-semibold text-foreground">
                {cart.summary.shipping === 0
                  ? "Free"
                  : `KES ${cart.summary.shipping.toLocaleString()}`}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border/70 pt-4">
              <span className="font-medium text-foreground">Total</span>
              <span className="text-lg font-semibold text-foreground">
                KES {cart.summary.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
