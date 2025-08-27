// src/app/(public)/_components/checkout-button.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export default function CheckoutButton({ customerEmail }: { customerEmail?: string }) {
  const router = useRouter();
  const { items } = useCart();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // melhora a sensação de velocidade
    router.prefetch("/pedido/sucesso");
    router.prefetch("/pedido/erro");
    router.prefetch("/pedido/pendente");
  }, [router]);

  const onCheckout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/mp?action=checkoutCart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Falha ao iniciar checkout");
      // Redireciona para o checkout do Mercado Pago
      window.location.href = data.initPoint;
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || items.length === 0;

  return (
    <Button
      onClick={onCheckout}
      disabled={disabled}
      className="w-full mt-3 cursor-pointer bg-red-800 text-white hover:bg-red-700"
    >
      {loading ? "Abrindo pagamento..." : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          Finalizar compra
        </>
      )}
    </Button>
  );
}
