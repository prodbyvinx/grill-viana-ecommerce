"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight, Minus, Plus, Trash2 } from "lucide-react";
import { formatBRL } from "@/lib/money";
import { useCart } from "@/hooks/use-cart";
import BackButton from "../_components/backbutton";
import Header from "../_components/header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CheckoutButton from "../_components/cart-checkout-button";

export default function CartPage() {
  const { items, summary, updateQty, remove, loading } = useCart();
  const router = useRouter();
  const handleClear = async () => {
    await clear();
    router.refresh();
  };

  if (loading)
    return <main className="mx-[5%] mt-12">Carregando…</main>;
  if (!items.length)
    return (
      <>
        <Header />
        <BackButton />
        <main className="mx-[5%] mt-12 space-y-6">
          <h1 className="text-xl font-semibold pt-16">
            Seu carrinho está vazio.
          </h1>
          <Link href="/catalogo" className="flex items-center font-medium bg-red-800 text-white w-fit p-2 rounded-lg hover:bg-white hover:text-red-800 hover:border-red-800 hover:border-1 transition-all duration-200">Continuar Explorando <ChevronRight /></Link>
        </main>
      </>
    );

  return (
    <>
      <Header />
      <BackButton />
      <main className="mx-[5%] mt-18 space-y-6">
        <h1 className="text-2xl font-semibold">Carrinho</h1>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border rounded-lg p-4"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.product.images[0]?.url ?? "/images/placeholder.svg"}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  {item.variant?.name && (
                    <p className="text-sm text-gray-500">{item.variant.name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span>{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div>{formatBRL(item.unitCents * item.quantity)}</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="text-right text-xl">
          Total:{" "}
          <span className="font-semibold">{formatBRL(summary.totalCents)}</span>
          <CheckoutButton />
        </div>
      </main>
    </>
  );
}
