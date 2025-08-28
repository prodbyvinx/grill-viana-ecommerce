"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CartMergeOnSignIn() {
  const { status, data } = useSession();
  const calledRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated" || calledRef.current) return;

    const userId = (data?.user as any)?.id ?? "anon";
    const key = `gv:cart-merged:${userId}`;

    if (typeof window !== "undefined" && localStorage.getItem(key)) return;

    calledRef.current = true;
    fetch("/api/cart/merge", { method: "POST", cache: "no-store" })
      .then(() => {
        if (typeof window !== "undefined") localStorage.setItem(key, "1");
        router.refresh();
      })
      .catch(() => {});
  }, [status, data, router]);

  return null;
}
