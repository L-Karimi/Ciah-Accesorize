"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/layout/navigation";
import type { NavItem } from "@/lib/site";

interface MobileMenuProps {
  items: NavItem[];
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-11 rounded-full px-4 lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-4" />
        Menu
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-[#111111]/70 px-4 py-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="mx-auto flex h-full max-w-sm flex-col rounded-[32px] bg-[#fffaf5] p-6 shadow-[0_18px_90px_rgba(0,0,0,0.2)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#8B5E3C]">
                  Ciah Accessorize
                </p>
                <p className="mt-2 text-xl font-semibold">Navigate the storefront</p>
              </div>
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-white"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>

            <Navigation
              items={items}
              vertical
              className="mt-10"
              linkClassName="px-0 py-0 text-lg text-foreground hover:bg-transparent"
            />

            <div className="mt-auto rounded-[28px] bg-[#111111] p-5 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-[#d6c2a6]">
                New Season
              </p>
              <p className="mt-3 text-sm leading-6 text-white/75">
                Discover office bags, travel holdalls, and elegant daily carry.
              </p>
              <Link
                href="/#featured"
                onClick={() => setOpen(false)}
                className="mt-5 inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-medium"
              >
                Shop featured
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
