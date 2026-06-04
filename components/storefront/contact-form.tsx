"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import type { InferOutput } from "valibot";
import { inquirySchema } from "@/lib/validations/storefront";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type InquiryFormValues = InferOutput<typeof inquirySchema>;

export function ContactForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: valibotResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    setSuccessMessage(`Thanks, ${values.name}. We will get back to you shortly.`);
    reset();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormField id="name" label="Full Name" error={errors.name?.message}>
        <Input
          id="name"
          placeholder="Your name"
          autoComplete="name"
          aria-invalid={errors.name ? "true" : "false"}
          {...register("name")}
        />
      </FormField>

      <FormField id="email" label="Email Address" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          aria-invalid={errors.email ? "true" : "false"}
          {...register("email")}
        />
      </FormField>

      <FormField
        id="message"
        label="What are you shopping for?"
        error={errors.message?.message}
        helper="Tell us the style, budget, or occasion and we will recommend a match."
      >
        <Textarea
          id="message"
          placeholder="I need a structured office bag that fits a 14-inch laptop..."
          aria-invalid={errors.message ? "true" : "false"}
          {...register("message")}
        />
      </FormField>

      <Button type="submit" className="h-11 w-full rounded-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send inquiry"}
      </Button>

      {successMessage ? (
        <p className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}
    </form>
  );
}
