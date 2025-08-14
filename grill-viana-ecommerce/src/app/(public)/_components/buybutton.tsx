"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function BuyButton({
  productId,
  unitPriceCents,
}: {
  productId: number;
  disabled: boolean;
  quantity?: number;
  unitPriceCents: number;
}) {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    try {
      setLoading(true);
      const res = await fetch("/api/mp?action=checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1, unitPriceCents }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Falha ao iniciar checkout");
      }

      const data = await res.json();
      console.log("Checkout data:", data);
      if (data.initPoint) {
        window.location.href = data.initPoint as string;
        return;
      }
    } catch (e) {
      console.error(e);
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleBuy}
      disabled={loading}
      className="bg-red-800 hover:bg-red-700 text-white cursor-pointer min-w-24"
    >
      {loading ? (
        <Loader2 className="animate-spin cursor-progress" />
      ) : (
        "Comprar"
      )}
    </Button>
  );
}
