import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth-guards";
import { buttonVariants } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";

export const metadata: Metadata = {
  title: "My Account | Ciah Accessorize",
  description: "Manage your Ciah Accessorize account and orders.",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await requireAuth();

  return (
    <main className="flex min-h-screen bg-[#f6f1ea] px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <section className="rounded-[32px] bg-[#111111] px-8 py-10 text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
          <p className="text-sm uppercase tracking-[0.28em] text-[#d6c2a6]">
            My Account
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Welcome back, {session.user.name ?? "there"}.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72">
            Your account area is now connected to authentication. From here we can
            continue building order history, wishlist management, and profile
            settings.
          </p>
          <div className="mt-6">
            <LogoutButton className="h-11 border-white/20 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white" />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[28px] border border-black/5 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
              Profile
            </p>
            <h2 className="mt-3 text-xl font-semibold text-foreground">
              Account details
            </h2>
            <dl className="mt-5 space-y-3 text-sm text-muted-foreground">
              <div>
                <dt className="font-medium text-foreground">Name</dt>
                <dd>{session.user.name ?? "Not set yet"}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Email</dt>
                <dd>{session.user.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Role</dt>
                <dd>{session.user.role}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[28px] border border-black/5 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
              Next Steps
            </p>
            <h2 className="mt-3 text-xl font-semibold text-foreground">
              Continue shopping
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Browse the collection while we keep filling out the customer account
              experience.
            </p>
            <Link href="/" className={buttonVariants({ className: "mt-6 h-11 px-5" })}>
              Return Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
