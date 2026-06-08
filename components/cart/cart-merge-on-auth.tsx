"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { mergeGuestCartAfterLogin } from "@/lib/actions/cart";

interface CartMergeOnAuthProps {
  cookieName: string;
  isAuthenticated: boolean;
}

function hasCookie(cookieName: string) {
  return document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith(`${cookieName}=`));
}

export function CartMergeOnAuth({
  cookieName,
  isAuthenticated,
}: CartMergeOnAuthProps) {
  const router = useRouter();
  const hasMergedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || hasMergedRef.current || !hasCookie(cookieName)) {
      return;
    }

    hasMergedRef.current = true;

    void (async () => {
      const result = await mergeGuestCartAfterLogin();

      if (result.success && result.merged) {
        router.refresh();
      }
    })();
  }, [cookieName, isAuthenticated, router]);

  return null;
}
