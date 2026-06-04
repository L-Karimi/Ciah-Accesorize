import Link from "next/link";
import { footerCollections, navItems, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-[#111111] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr,0.8fr,0.8fr] lg:px-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#d6c2a6]">
            {siteConfig.name}
          </p>
          <h2 className="mt-4 max-w-md text-3xl font-semibold tracking-tight">
            Elegant bags and accessories for modern Kenyan style.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
            We build premium everyday carry with warmth, polish, and a practical
            sense of luxury.
          </p>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[#d6c2a6]">
            Navigate
          </p>
          <div className="mt-5 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-[#d6c2a6]">
            Collections
          </p>
          <div className="mt-5 flex flex-col gap-3">
            {footerCollections.map((item) => (
              <p key={item} className="text-sm text-white/70">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-white/55 sm:px-6 lg:px-8">
        Copyright © 2026 Ciah Accessorize. Crafted for premium storefront growth.
      </div>
    </footer>
  );
}
