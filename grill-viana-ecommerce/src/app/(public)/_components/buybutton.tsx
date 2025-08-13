"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

export default function BuyButton({
  productId,
  quantity = 1,
}: {
  productId: number;
  disabled: boolean;
  quantity?: number;
}) {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erro ao criar pagamento");

      // Redireciona para o Mercado Pago
      window.location.href = data.init_point;
    } catch (e: any) {
      alert(e.message ?? "Falha ao iniciar compra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleBuy} disabled={loading} className="bg-red-800 hover:bg-red-700 text-white cursor-pointer min-w-24">
      {loading ? <Loader2 className="animate-spin cursor-progress" /> : "Comprar"}
    </Button>
  );
}
