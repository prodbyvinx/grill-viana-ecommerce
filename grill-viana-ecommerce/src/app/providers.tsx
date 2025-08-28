"use client";

import { SessionProvider } from "next-auth/react";
import CartMergeOnSignIn from "@/app/(public)/_components/cart-merge-on-signin";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartMergeOnSignIn />
      {children}
    </SessionProvider>
  );
}