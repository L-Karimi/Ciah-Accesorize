import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | Ciah Accessorize",
  description: "Reset your Ciah Accessorize password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f1ea] px-4 py-12">
      <div className="w-full max-w-md rounded-[28px] border border-black/5 bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Reset Password
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Enter the email address linked to your account and we&apos;ll send you a
          reset link.
        </p>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
