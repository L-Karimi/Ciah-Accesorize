"use server";

import { createHash, randomUUID } from "node:crypto";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import {
  flatten,
  safeParse,
  type InferOutput,
} from "valibot";
import {
  forgotPasswordSchema,
  profileSchema,
  registerSchema,
} from "@/lib/validations/auth";

type RegisterInput = InferOutput<typeof registerSchema>;
type UpdateProfileInput = InferOutput<typeof profileSchema>;
type ForgotPasswordInput = InferOutput<typeof forgotPasswordSchema>;

export async function register(input: RegisterInput) {
  const parsed = safeParse(registerSchema, input);

  if (!parsed.success) {
    const issues = flatten(parsed.issues);
    return {
      success: false,
      error:
        issues.root?.[0] ??
        Object.values(issues.nested ?? {}).flat()[0] ??
        "Please check the form and try again.",
    };
  }

  const email = parsed.output.email.toLowerCase();
  const { name, password } = parsed.output;

  if (password !== input.confirmPassword) {
    return {
      success: false,
      error: "Passwords do not match.",
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "CUSTOMER",
      },
    });

    return {
      success: true,
      message: "Your account has been created.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "We could not create your account right now.",
    };
  }
}

export async function requestPasswordReset(input: ForgotPasswordInput) {
  const parsed = safeParse(forgotPasswordSchema, input);

  if (!parsed.success) {
    const issues = flatten(parsed.issues);
    return {
      success: false,
      error:
        issues.root?.[0] ??
        Object.values(issues.nested ?? {}).flat()[0] ??
        "Please check the form and try again.",
    };
  }

  const email = parsed.output.email.toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (user) {
      const rawToken = randomUUID();
      const hashedToken = createHash("sha256").update(rawToken).digest("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.passwordResetToken.deleteMany({
        where: { email },
      });

      await prisma.passwordResetToken.create({
        data: {
          email,
          token: hashedToken,
          expiresAt,
        },
      });
    }

    return {
      success: true,
      message:
        "If an account exists for that email, a reset link request has been prepared.",
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      error: "We could not process that request right now.",
    };
  }
}

export async function updateProfile(input: UpdateProfileInput) {
  const session = await getServerAuthSession();

  if (!session?.user?.email) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const parsed = safeParse(profileSchema, input);

  if (!parsed.success) {
    const issues = flatten(parsed.issues);
    return {
      success: false,
      error:
        issues.root?.[0] ??
        Object.values(issues.nested ?? {}).flat()[0] ??
        "Please check the form and try again.",
    };
  }

  try {
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: parsed.output,
    });

    return {
      success: true,
      message: "Profile updated successfully.",
      user,
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      success: false,
      error: "We could not update your profile right now.",
    };
  }
}
