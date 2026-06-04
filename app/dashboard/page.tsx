import type { Metadata } from "next";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireAdmin } from "@/lib/auth-guards";

export const metadata: Metadata = {
  title: "Admin Dashboard | Ciah Accessorize",
  description: "Administrative dashboard for Ciah Accessorize.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireAdmin();

  return (
    <main className="flex min-h-screen bg-[#111111] px-4 py-10 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-[32px] border border-white/10 bg-white/5 px-8 py-10">
          <p className="text-sm uppercase tracking-[0.28em] text-[#d6c2a6]">
            Dashboard
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Admin access confirmed.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72">
            This milestone wires the protected admin entry point. Product,
            order, and analytics modules can build on top of this route next.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] bg-white px-6 py-5 text-black">
            <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
              Role
            </p>
            <p className="mt-3 text-2xl font-semibold">{session.user.role}</p>
          </div>
          <div className="rounded-[28px] bg-white px-6 py-5 text-black">
            <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
              Admin
            </p>
            <p className="mt-3 text-lg font-medium">{session.user.email}</p>
          </div>
          <div className="rounded-[28px] bg-white px-6 py-5 text-black">
            <p className="text-sm uppercase tracking-[0.22em] text-[#8B5E3C]">
              Session
            </p>
            <LogoutButton className="mt-3 h-11 w-full px-5" />
          </div>
        </section>
      </div>
    </main>
  );
}
