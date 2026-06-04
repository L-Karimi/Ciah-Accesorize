import Link from "next/link";
import { Navigation } from "@/components/layout/navigation";
import { SearchBar } from "@/components/layout/search-bar";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { navItems, siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[#fbf6f0]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="min-w-fit">
          <div className="rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#8B5E3C]">
              Ciah
            </p>
            <p className="text-sm font-semibold tracking-[0.08em] text-foreground">
              {siteConfig.name}
            </p>
          </div>
        </Link>

        <Navigation items={navItems} className="hidden lg:flex" />

        <div className="hidden max-w-md flex-1 lg:block">
          <SearchBar compact />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <CartDrawer />
          <MobileMenu items={navItems} />
        </div>
      </div>
    </header>
  );
}
