import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";

export async function requireAuth(callbackUrl = "/account") {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "ADMIN") {
    redirect("/account");
  }

  return session;
}
