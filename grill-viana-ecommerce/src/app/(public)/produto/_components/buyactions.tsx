"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function BuyActions({
  slug,
  priceCents,
  disabled,
}: {
  slug: string;
  priceCents: number;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  async function handleBuy() {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout/mercadopago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, quantity: 1 }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erro ao iniciar checkout");
      }

      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point; // redireciona para o MP
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button size="lg" onClick={handleBuy} disabled={disabled || loading}>
        {loading ? "Carregando..." : "Comprar agora"}
      </Button>
      <Button variant="secondary" size="lg" disabled>
        Adicionar ao carrinho
      </Button>
    </div>
  );
}
