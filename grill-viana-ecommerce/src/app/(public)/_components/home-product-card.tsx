// src/app/(public)/_components/home-product-card.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function brl(cents?: number | null) {
  if (cents == null) return "—";
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function HomeProductCard(props: {
  product: { id: string; name: string; slug: string; priceCents: number | null; imageUrl: string | null };
}) {
  const { product } = props;

  return (
    <Card className="rounded-2xl hover:shadow-md transition min-w-0">
      <CardHeader className="p-0">
        <Link href={`/produto/${product.id}`} className="block -z-10">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl">
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" unoptimized/>
            ) : (
              <div className="w-full h-full bg-muted" />
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 space-y-1">
        <Link href={`/produto/${product.id}`} className="block">
          <h3 className="text-sm font-semibold line-clamp-2">{product.name}</h3>
        </Link>
        <div className="text-base font-bold">{brl(product.priceCents)}</div>
      </CardContent>
    </Card>
  );
}
