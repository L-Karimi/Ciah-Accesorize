"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import type { InferOutput } from "valibot";
import { requestPasswordReset } from "@/lib/actions/auth";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ForgotPasswordFormValues = InferOutput<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: valibotResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSuccessMessage(null);

    const result = await requestPasswordReset(values);

    if (!result.success) {
      setFormError(result.error ?? "Something went wrong.");
      return;
    }

    setSuccessMessage(result.message ?? "Request received.");
  });

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      {formError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          autoComplete="email"
          aria-invalid={errors.email ? "true" : "false"}
          {...register("email")}
        />
        {errors.email?.message ? (
          <p className="text-sm text-red-700">{errors.email.message}</p>
        ) : null}
      </div>

      <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending request..." : "Send Reset Link"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-[#8B5E3C] transition-colors hover:text-[#6f492e]"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
