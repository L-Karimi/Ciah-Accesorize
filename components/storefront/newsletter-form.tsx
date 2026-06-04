"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import type { InferOutput } from "valibot";
import { newsletterSchema } from "@/lib/validations/storefront";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type NewsletterFormValues = InferOutput<typeof newsletterSchema>;

export function NewsletterForm() {
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: valibotResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    setMessage(`Style notes will be sent to ${values.email}.`);
    reset();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          placeholder="Enter your email"
          className="h-12 rounded-full border-white/15 bg-white/5 px-5 text-white placeholder:text-white/55 focus-visible:border-[#d6c2a6]"
          aria-invalid={errors.email ? "true" : "false"}
          {...register("email")}
        />
        <Button type="submit" className="h-12 rounded-full px-6" disabled={isSubmitting}>
          {isSubmitting ? "Joining..." : "Join newsletter"}
        </Button>
      </div>
      {errors.email?.message ? (
        <p className="text-sm text-[#ffd4d4]">{errors.email.message}</p>
      ) : null}
      {message ? <p className="text-sm text-white/75">{message}</p> : null}
    </form>
  );
}
