"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { X, ChevronLeft, ChevronRight, ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/hooks/use-cart"; // <-- hook que consulta a API do servidor
import { formatBRL } from "@/lib/money";
import CheckoutButton from "./cart-checkout-button";

export function ShoppingCartDropdown() {
  const { items, summary, updateQty, remove } = useCart();

  // total de unidades (1 item com qty=3 => conta 3)
  const itemsCount = summary.itemsCount ?? items.reduce((acc, i) => acc + i.quantity, 0);

  // limpar carrinho (como a API não tem "clear all", removemos um a um)
  const clearCart = async () => {
    await Promise.all(items.map((i) => remove(i.id)));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="link"
          className="relative cursor-pointer w-auto hover:text-red-800"
          aria-label={`Abrir carrinho (${itemsCount} itens)`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {itemsCount > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex h-5 w-5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-800 opacity-20" />
                <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-800 text-[11px] leading-none font-semibold text-white">
                  {itemsCount}
                </span>
              </span>
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Carrinho ({itemsCount})</h3>
            <Link href="/cart" aria-label="Ver carrinho">
              <Eye />
            </Link>
          </div>

          <Button variant="ghost" size="sm" onClick={clearCart} className="cursor-pointer">
            Limpar
          </Button>
        </div>

        <ul className="max-h-72 overflow-y-auto divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Image
                  src={item.product.images[0]?.url ?? "/images/fallback.jpg"}
                  alt={item.product.name}
                  width={48}
                  height={48}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{item.product.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Diminuir quantidade"
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="px-2">{item.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                  aria-label="Aumentar quantidade"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(item.id)}
                aria-label="Remover item"
              >
                <X size={16} />
              </Button>
            </li>
          ))}
        </ul>

        <div className="flex justify-end font-bold text-red-800 mt-4">
          Total: {formatBRL(summary.totalCents ?? items.reduce((s, i) => s + i.quantity * i.unitCents, 0))}
        </div>

        <CheckoutButton />
      </PopoverContent>
    </Popover>
  );
}
// Note: "Finalizar compra" não faz nada, pois o fluxo de checkout depende do gateway de pagamento que você escolher.