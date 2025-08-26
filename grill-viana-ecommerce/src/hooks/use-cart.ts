// src/hooks/use-cart.ts
"use client";
import { useCallback, useEffect, useState } from "react";

export function useCart() {
  const [items, setItems] = useState<any[]>([]);
  const [summary, setSummary] = useState({ itemsCount: 0, totalCents: 0 });

  const refresh = useCallback(async () => {
    const res = await fetch("/api/cart", { cache: "no-store" });
    const data = await res.json();
    setItems(data.items ?? []);
    setSummary(data.summary ?? { itemsCount: 0, totalCents: 0 });
  }, []);

  const add = useCallback(
    async ({ productId, variantId, quantity = 1 }: { productId: number; variantId?: string; quantity?: number }) => {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Falha ao adicionar ao carrinho");
      if (data?.summary) setSummary(data.summary); // feedback imediato no badge
      await refresh(); // garante lista consistente
    },
    [refresh]
  );

  const updateQty = useCallback(async (itemId: string, quantity: number) => {
    const res = await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity }),
    });
    const data = await res.json();
    if (data?.summary) setSummary(data.summary);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (itemId: string) => {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    const data = await res.json();
    if (data?.summary) setSummary(data.summary);
    await refresh();
  }, [refresh]);

  useEffect(() => { refresh(); }, [refresh]);

  return { items, summary, refresh, add, updateQty, remove };
}