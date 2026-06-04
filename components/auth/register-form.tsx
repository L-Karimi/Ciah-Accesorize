"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import type { InferOutput } from "valibot";
import { register as registerUser } from "@/lib/actions/auth";
import { registerSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RegisterFormValues = InferOutput<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: valibotResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    if (values.password !== values.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    const result = await registerUser(values);

    if (!result.success) {
      setFormError(result.error ?? "Registration failed.");
      return;
    }

    const signInResult = await signIn("credentials", {
      email: values.email.toLowerCase(),
      password: values.password,
      redirect: false,
    });

    if (!signInResult || signInResult.error) {
      router.push("/auth/login");
      return;
    }

    router.push("/account");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {formError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Full Name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          aria-invalid={errors.name ? "true" : "false"}
          {...register("name")}
        />
        {errors.name?.message ? (
          <p className="text-sm text-red-700">{errors.name.message}</p>
        ) : null}
      </div>

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

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={errors.password ? "true" : "false"}
          {...register("password")}
        />
        <p className="text-sm text-muted-foreground">Minimum 8 characters.</p>
        {errors.password?.message ? (
          <p className="text-sm text-red-700">{errors.password.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-foreground"
        >
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={errors.confirmPassword ? "true" : "false"}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword?.message ? (
          <p className="text-sm text-red-700">{errors.confirmPassword.message}</p>
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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
