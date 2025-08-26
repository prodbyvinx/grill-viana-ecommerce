"use client";

import { useState, useEffect } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

export default function AddToCartButton({
  productId,
  variantId,
  quantity = 1,
}: {
  productId: number;
  variantId?: string;
  quantity?: number;
}) {
  const [loading, setLoading] = useState(false);
  const { add } = useCart();
  const router = useRouter();

  // deixa a navegação mais instantânea
  useEffect(() => {
    router.prefetch("/cart");
  }, [router]);

  const onAdd = async () => {
    try {
      setLoading(true);
      await add({ productId, variantId, quantity }); // faz POST /api/cart e atualiza summary
      router.push("/cart");                           // redireciona para a página do carrinho
      // opcional: router.refresh(); // só se a página de /cart for Server Component e depender de cache
    } catch (e: any) {
      alert(e.message ?? "Falha ao adicionar ao carrinho");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={onAdd} disabled={loading} className="min-w-24">
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-1" />
          Adicionar
        </>
      )}
    </Button>
  );
}
