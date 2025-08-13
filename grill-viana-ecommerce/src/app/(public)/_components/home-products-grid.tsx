// src/app/(public)/_components/home-products-grid.tsx
import { Suspense } from "react";
import { getHomeProducts } from "@/server/home-products";
import HomeProductCard from "./home-product-card";

function Skeleton() {
  return <div className="animate-pulse rounded-2xl bg-muted h-[280px]" />;
}

async function List() {
  const items = await getHomeProducts(4);
  if (!items.length) {
    return (
      <div className="text-sm text-muted-foreground">
        Nenhum produto disponível.
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((p) => (
        <HomeProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export default function HomeProductsGrid() {
  return (
    <section className="space-y-4">
      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        }
      >
        <List />
      </Suspense>
    </section>
  );
}
