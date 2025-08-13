// src/server/home-products.ts
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export type HomeProductDTO = {
  id: string;
  name: string;
  slug: string;
  priceCents: number | null;
  imageUrl: string | null;
};

const _getHomeProducts = async (limit = 4): Promise<HomeProductDTO[]> => {
  const items = await prisma.product.findMany({
    where: { isActive: true /*, stock: { gt: 0 }*/ },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      priceCents: true,
      // Pega só a PRIMEIRA imagem; ajuste `position` se seu schema tiver outro nome
      images: {
        select: { url: true },
        take: 1,
      },
    },
  });

  return items.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    priceCents: p.priceCents ?? null,
    imageUrl: p.images?.[0]?.url ?? null, // aponta para a primeira imagem do array
  }));
};

export const getHomeProducts = unstable_cache(
  _getHomeProducts,
  ["home:products"],
  { tags: ["home:products"], revalidate: 120 }
);
