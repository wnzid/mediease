"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      loading={isPending}
      onClick={() =>
        startTransition(async () => {
          await signOutAction();
          router.push("/");
          router.refresh();
        })
      }
    >
      Sign out
    </Button>
  );
}
