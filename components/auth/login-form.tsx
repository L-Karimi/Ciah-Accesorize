"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import type { InferOutput } from "valibot";
import { loginSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LoginFormValues = InferOutput<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: valibotResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    const result = await signIn("credentials", {
      email: values.email.toLowerCase(),
      password: values.password,
      redirect: false,
    });

    if (!result || result.error) {
      setFormError("Invalid email or password.");
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
          autoComplete="current-password"
          aria-invalid={errors.password ? "true" : "false"}
          {...register("password")}
        />
        {errors.password?.message ? (
          <p className="text-sm text-red-700">{errors.password.message}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Secure sign in for your account</span>
        <Link
          href="/auth/forgot-password"
          className="font-medium text-[#8B5E3C] transition-colors hover:text-[#6f492e]"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-[#8B5E3C] transition-colors hover:text-[#6f492e]"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
