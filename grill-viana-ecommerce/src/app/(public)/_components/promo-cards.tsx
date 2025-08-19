"use client";

import Link from "next/link";
import Image from "next/image";
import type { PromoItem } from "@/data/products";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function PromoCards({ products }: { products: PromoItem[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
      <div className="mb-6 text-center">
        {/* (opcional) Ajuste o título já que não são "Promoções" */}
        <h2 className="text-2xl font-semibold">
          Sugestões do nosso <span className="text-red-700">Catálogo</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => {
          const img = p.image; // usa a URL exatamente como está no DB
          return (
            <Link key={p.id} href={`/produto/${p.id}`} className="block">
              <Card className="group h-full overflow-hidden rounded-2xl border bg-background transition hover:shadow-md">
                <CardContent className="p-0">
                  {img && (
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={img}
                        alt={p.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col items-start gap-1 p-3">
                  <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug">
                    {p.name}
                  </h3>
                  <p className="text-base font-semibold">
                    {Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(p.priceCents / 100)}
                  </p>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/catalogo"
          className="rounded-full bg-red-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Ver mais produtos
        </Link>
      </div>
    </section>
  );
}