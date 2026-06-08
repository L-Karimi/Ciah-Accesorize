import type { Metadata } from "next";
import { LogoutButton } from "@/components/auth/logout-button";
import { DashboardNav } from "@/components/admin/dashboard-nav";
import { requireAdmin } from "@/lib/auth-guards";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage products, categories, inventory, orders, and customers.",
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <main className="min-h-screen bg-[#f6f1ea] px-4 py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:flex-row">
        <aside className="lg:sticky lg:top-28 lg:h-fit lg:w-72">
          <div className="rounded-[32px] bg-[#111111] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
            <p className="text-sm uppercase tracking-[0.28em] text-[#d6c2a6]">
              Admin Dashboard
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              Store management
            </h1>
            <p className="mt-3 text-sm leading-7 text-white/72">
              Signed in as {session.user.email}. Revenue, orders, catalog, and
              customer operations now live in one protected workspace.
            </p>
            <div className="mt-6">
              <LogoutButton className="h-11 w-full border-white/20 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white" />
            </div>
          </div>

          <div className="mt-4 rounded-[32px] border border-border/70 bg-[#fcfaf7] p-4 shadow-[0_18px_60px_rgba(17,17,17,0.05)]">
            <DashboardNav />
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  );
}
