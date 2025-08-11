"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function BuyButton({ skuCode }: { skuCode: string }) {
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skuCode, quantity: 1 }),
      });

      const isJson = res.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson ? await res.json() : { error: await res.text() };

      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      if (!data.init_point) throw new Error("Resposta sem init_point");

      window.location.href = data.init_point;
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }
  if (!skuCode) {
    return (
      <Button disabled className="w-auto bg-gray-400 cursor-not-allowed">
        Comprar
      </Button>
    );
  }

  return (
    <Button
      onClick={handleBuy}
      disabled={loading}
      className="w-auto bg-red-800 hover:bg-red-700 cursor-pointer"
    >
      {loading ? "Aguarde..." : "Comprar"}
    </Button>
  );
}
