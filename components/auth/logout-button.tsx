"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          void signOut({ callbackUrl: "/" });
        });
      }}
    >
      {isPending ? "Signing out..." : "Sign Out"}
    </Button>
  );
}
